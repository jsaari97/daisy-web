import { findEntryFile, constructMeta } from "./loader";

const createElement = (tagName, attributes) => {
  const element = document.createElement(tagName);

  if (attributes) {
    for (const key in attributes) {
      element.setAttribute(key, attributes[key]);
    }
  }

  return element;
};

describe("findEntryFile", () => {
  it("should find entry file", () => {
    expect(findEntryFile({ "test.xml": null, "test.html": null })).toEqual(
      "test.xml"
    );
  });

  it("should throw if not found", () => {
    expect(findEntryFile({ "test.html": null })).toEqual(null);
  });
});

describe("constructMeta", () => {
  it("should return correct format", () => {
    const meta = [
      { content: "version", name: "dt:version" },
      { content: "uid", name: "dtb:uid" },
      { content: "Title", name: "dc:Title" },
      { content: "Creator", name: "dc:Creator" },
      { content: "Date", name: "dc:Date" },
      { content: "Publisher", name: "dc:Publisher" },
      { content: "Subject", name: "dc:Subject" },
      { content: "Identifier", name: "dc:Identifier" },
      { content: "Language", name: "dc:Language" },
    ];

    const elements = meta.map((attrs) => createElement("meta", attrs));

    expect(constructMeta(elements)).toEqual({
      version: "version",
      uid: "uid",
      title: "Title",
      creator: "Creator",
      date: "Date",
      publisher: "Publisher",
      subject: "Subject",
      identifier: "Identifier",
      language: "Language",
    });
  });

  it("should handle missing properties", () => {
    const meta = [
      { content: "uid", name: "dtb:uid" },
      { content: "Title", name: "dc:Title" },
      { content: "Creator", name: "dc:Creator" },
      { content: "Date", name: "dc:Date" },
      { content: "Publisher", name: "dc:Publisher" },
      { content: "Subject", name: "dc:Subject" },
      { content: "Identifier", name: "dc:Identifier" },
    ];

    const elements = meta.map((attrs) => createElement("meta", attrs));

    expect(constructMeta(elements)).toEqual({
      version: null,
      uid: "uid",
      title: "Title",
      creator: "Creator",
      date: "Date",
      publisher: "Publisher",
      subject: "Subject",
      identifier: "Identifier",
      language: null,
    });
  });
});
