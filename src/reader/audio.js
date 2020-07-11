import JSZip from "jszip";
import xpath from "xpath";
import { getCache, setCache } from "./cache";

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
export const getAudioSource = (zip, cache) => async (element) => {
  try {
    const ref = element.getAttribute("smilref");

    if (!ref) {
      return;
    }

    const [name, id] = ref.split("#").map((s) => s.split(".")[0]);

    let [audio, dom] = getCache(name, cache);

    if (!audio && !dom) {
      const [audioPath, docPath] = findPaths(name, zip.files);

      audio = await loadAudio(audioPath, zip);

      dom = await loadDOM(docPath, zip);

      if (cache) {
        setCache(name, [audio, dom], cache);
      }
    }

    const range = getPlaybackRange(dom, id);

    return range ? `${audio}#t=${range.join(",")}` : null;
  } catch (error) {
    return Promise.reject(error);
  }
};
