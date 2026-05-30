import { convertToSeconds, findPaths, getPlaybackRange } from "./audio";

describe("Timestamp Conversion", () => {
  it("should convert to seconds", () => {
    expect(convertToSeconds("0:00:02")).toEqual(2);
    expect(convertToSeconds("0:00:13.055")).toEqual(13.055);
    expect(convertToSeconds("0:15:13.7")).toEqual(913.7);
    expect(convertToSeconds("1:15:16")).toEqual(4516);
  });
});

describe("getPlaybackRange", () => {
  it("should return range for matching element", () => {
    const doc = new DOMParser().parseFromString(
      '<root><div id="foo"><audio clipBegin="0:00:02" clipEnd="0:00:13.055"/></div></root>',
      "text/xml"
    );
    expect(getPlaybackRange(doc, "foo")).toEqual([2, 13.055]);
  });

  it("should return null when element not found", () => {
    const doc = new DOMParser().parseFromString(
      "<root></root>",
      "text/xml"
    );
    expect(getPlaybackRange(doc, "nonexistent")).toBe(null);
  });
});

describe("Media Paths", () => {
  it("should return audio and document tuple", () => {
    const files = ["folder/test", "folder/test2", "folder/test3"].reduce(
      (acc, cur) => ({
        ...acc,
        [`${cur}.mp3`]: null,
        [`${cur}.smil`]: null,
      }),
      {}
    );

    expect(findPaths("test", files)).toEqual([
      "folder/test.mp3",
      "folder/test.smil",
    ]);
  });
});
