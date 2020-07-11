import JSZip from "jszip";
import xpath from "xpath";

export const findPaths = (name, files) => {
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

export const loadDOM = async (path, zip) => {
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

export const getPlaybackRange = (dom, id) => {
  const [element] = xpath.select(`//*[@id="${id}"]/audio`, dom);

  if (!element) {
    return null;
  }

  const start = element.getAttribute("clipBegin");
  const end = element.getAttribute("clipEnd");

  return [convertToSeconds(start), convertToSeconds(end)];
};

/**
 * @param {JSZip} zip
 * @returns {(element: Element) => Promise<string | null>}
 */
export const getAudioSource = (zip) => async (element) => {
  try {
    const ref = element.getAttribute("smilref");

    if (!ref) {
      return;
    }

    const [name, id] = ref.split("#").map((s) => s.split(".")[0]);

    const [audioPath, docPath] = findPaths(name, zip.files);

    const audioBlob = await loadAudio(audioPath, zip);

    const dom = await loadDOM(docPath, zip);

    const range = getPlaybackRange(dom, id);

    if (!range) {
      return null;
    }

    const audioUrl = `${audioBlob}#t=${range.join(",")}`;

    return audioUrl;
  } catch (error) {
    return Promise.reject(error);
  }
};
