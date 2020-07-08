import { findEntryFile, constructMeta } from "./loader";

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
      { __content: "version", __name: "dt:version" },
      { __content: "uid", __name: "dtb:uid" },
      { __content: "Title", __name: "dc:Title" },
      { __content: "Creator", __name: "dc:Creator" },
      { __content: "Date", __name: "dc:Date" },
      { __content: "Publisher", __name: "dc:Publisher" },
      { __content: "Subject", __name: "dc:Subject" },
      { __content: "Identifier", __name: "dc:Identifier" },
      { __content: "Language", __name: "dc:Language" },
    ];

    expect(constructMeta(meta)).toEqual({
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
      { __content: "uid", __name: "dtb:uid" },
      { __content: "Title", __name: "dc:Title" },
      { __content: "Creator", __name: "dc:Creator" },
      { __content: "Date", __name: "dc:Date" },
      { __content: "Publisher", __name: "dc:Publisher" },
      { __content: "Subject", __name: "dc:Subject" },
      { __content: "Identifier", __name: "dc:Identifier" },
    ];

    expect(constructMeta(meta)).toEqual({
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
