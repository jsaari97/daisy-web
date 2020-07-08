import JSZip from "jszip/dist/jszip.min.js";
// import { DOMParser } from "xmldom";
import xpath from "xpath";
import { parseNode, parseXml, embedImages } from "./dom";

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

    const images = select("//img", root);

    await Promise.all(images.map(embedImages(zip)));

    const html = parseNode(root);

    return html;
  } catch (error) {
    console.warn(error);
  }
};
