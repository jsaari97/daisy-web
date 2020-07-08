import JSZip from "jszip/dist/jszip.min.js";
import parser from "fast-xml-parser";

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
    const key = item.__name.split(":")[1].toLowerCase();
    const value = item.__content;

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

    const entry = parser.parse(entryXml, {
      ignoreAttributes: false,
      attributeNamePrefix: "__",
    });

    console.log(entry);
  } catch (error) {
    console.warn(error);
  }
};
