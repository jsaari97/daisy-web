import JSZip from "jszip/dist/jszip.js";
import xpath from "xpath";
import { parseXml, embedImages, transformList } from "./dom";

export const findEntryFile = (files) => {
  return Object.keys(files).find((file) => file.match(/\.xml$/)) || null;
};

const defaultMeta = {
  version: null,
  uid: null,
  title: null,
  creator: null,
  date: null,
  publisher: null,
  subject: null,
  identifier: null,
  language: null,
};

export const constructMeta = (metaList) => {
  return metaList.reduce((meta, item) => {
    const key = item.getAttribute("name").split(":")[1].toLowerCase();
    const value = item.getAttribute("content");

    return {
      ...meta,
      [key]: value,
    };
  }, defaultMeta);
};

export const loadFile = async (file) => {
  try {
    const zip = await JSZip.loadAsync(file);

    const name = findEntryFile(zip.files);

    const entryXml = await zip.file(name).async("string");

    const doc = new DOMParser().parseFromString(parseXml(entryXml), "text/xml");

    const select = xpath.useNamespaces({
      dtbook: "http://www.daisy.org/z3986/2005/dtbook/",
    });

    const meta = constructMeta(select("//head/meta", doc));

    const root = select("//bodymatter/div", doc)[0];

    await Promise.all(select("//img", root).map(embedImages(zip)));

    select("//list", root).forEach(transformList);

    return {
      dom: root,
      meta,
      zip,
    };
  } catch (error) {
    console.warn(error);
  }
};
