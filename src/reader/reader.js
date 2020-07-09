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
  return Object.keys(files).filter((file) => file.includes(name));
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

export const loadSmilMetadata = async (path, id, zip) => {
  try {
    const doc = await loadSmilDom(path, zip);

    const [element] = xpath.select(`//*[@id="${id}"]/audio`, doc);

    if (!element) {
      return Promise.reject("empty");
    }

    const start = element.getAttribute("clipBegin");
    const end = element.getAttribute("clipEnd");

    console.log(id, start, end);

    return { start: convertToSeconds(start), end: convertToSeconds(end) };
  } catch (error) {
    return Promise.reject(error);
  }
};

/**
 * @param {JSZip} zip
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

    const audioUrl = await loadAudio(audioPath, zip);

    const { start, end } = await loadSmilMetadata(smilPath, id, zip);

    await play(
      `${audioUrl}#t=${Math.max(0, start + 0.125)}${end ? `,${end - 0.2}` : ""}`
    );
  } catch (error) {
    if (error === "empty") {
      return;
    }

    return Promise.reject(error);
  }
};
