import JSZip from "jszip";
import xpath from "xpath";
import { parseXml, embedImages, transformList } from "./dom";
import { isFileValid } from "./validate";
import { extractMeta } from "./meta";

/**
 *
 * @param {object} files
 * @returns {string | null}
 */
export const findEntryFile = (files) => {
  return Object.keys(files).find((file) => file.match(/\.xml$/));
};

/**
 *
 * @param {File} file
 * @returns {Promise<{ dom: xpath.SelectedValue, meta: object, zip: JSZip }>}
 */
export const loadFile = async (file) => {
  try {
    const zip = await JSZip.loadAsync(file);

    const [valid, message] = isFileValid(zip.files);

    if (!valid) {
      return Promise.reject(message || "File validation failed.");
    }

    const name = findEntryFile(zip.files);

    const entryXml = await zip.file(name).async("string");

    const doc = new DOMParser().parseFromString(parseXml(entryXml), "text/xml");

    const meta = extractMeta(xpath.select("//head/meta", doc));

    const [root] = xpath.select("//bodymatter/div", doc);

    await Promise.all(xpath.select("//img", root).map(embedImages(zip)));

    xpath.select("//list", root).forEach(transformList);

    return {
      dom: root,
      meta,
      zip,
    };
  } catch (error) {
    return Promise.reject(error);
  }
};
