import JSZip from "jszip/dist/jszip.js";
import xpath from "xpath";

/**
 * Walk the DOM Tree
 * @param {Element} element
 * @param {(element: Element) => Promise<void>} handle
 * @param {boolean} visited
 */
export const readNode = async (element, handle, visited) => {
  try {
    if (!element) {
      return;
    }

    if (!visited && element.attributes["smilref"]) {
      await handle(element);
    }

    let next;

    if (!visited && element.firstElementChild) {
      next = element.firstElementChild;
    } else {
      next = element.nextElementSibling || element.parentElement || null;
    }

    await readNode(next, handle, next === element.parentElement);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getMediaPaths = (name, files) => {
  const re = new RegExp(`\/${name}\\.`, "g");
  return Object.keys(files).filter((file) => file.match(re));
};

export const loadAudio = async (path, zip) => {
  try {
    const file = await zip.file(path).async("arraybuffer");
    const blob = new Blob([file], { type: "audio/mpeg" });
    const url = window.URL.createObjectURL(blob);

    return url;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const loadSmilDom = async (path, zip) => {
  try {
    const file = await zip.file(path).async("string");
    return new DOMParser().parseFromString(
      file.replace('xmlns="', 'xmlns:conf="'),
      "text/xml"
    );
  } catch (error) {
    return Promise.reject(error);
  }
};

export const convertToSeconds = (timestamp) => {
  const [h, m, s] = timestamp.split(":").map(parseFloat);

  return h * 60 * 60 + m * 60 + s;
};

export const loadSmilMetadata = async (dom, id) => {
  try {
    const [element] = xpath.select(`//*[@id="${id}"]/audio`, dom);

    if (!element) {
      return Promise.reject("IS_PASSTHROUGH");
    }

    const start = element.getAttribute("clipBegin");
    const end = element.getAttribute("clipEnd");

    return {
      start: convertToSeconds(start),
      end: convertToSeconds(end),
    };
  } catch (error) {
    return Promise.reject(error);
  }
};

/**
 * @param {JSZip} zip
 * @param {(audioUrl: string, target: Element) => Promise<void>} play
 * @returns {(element: Element) => Promise<void>}
 */
export const handleNode = (zip, play) => async (element) => {
  try {
    const ref = element.getAttribute("smilref");

    if (!ref) {
      return;
    }

    const [name, id] = ref.split("#").map((s) => s.split(".")[0]);

    const [audioPath, smilPath] = getMediaPaths(name, zip.files);

    const audioBlob = await loadAudio(audioPath, zip);

    const dom = await loadSmilDom(smilPath, zip);

    const { start, end } = await loadSmilMetadata(dom, id);

    const audioUrl = `${audioBlob}#t=${Math.max(0, start + 0.125)}${
      end ? `,${end - 0.175}` : ""
    }`;

    await play(audioUrl, element);
  } catch (error) {
    if (error === "IS_PASSTHROUGH") {
      return;
    }

    return Promise.reject(error);
  }
};
