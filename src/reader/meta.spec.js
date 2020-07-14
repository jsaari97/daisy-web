import { extractMeta } from "./meta";

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

    expect(extractMeta(elements)).toEqual({
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

    expect(extractMeta(elements)).toEqual({
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
