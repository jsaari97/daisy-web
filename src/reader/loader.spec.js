import { findEntryFile } from "./loader";

describe("findEntryFile", () => {
  it("should find entry file", () => {
    expect(
      findEntryFile({ "folder/test.xml": null, "folder/test.html": null })
    ).toEqual("folder/test.xml");
  });

  it("should throw if not found", () => {
    expect(findEntryFile({ "test.html": null })).toEqual(undefined);
  });
});
