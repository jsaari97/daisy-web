import { isFileValid } from "./validate";

/**
 *
 * @param {Array<string>} array
 * @returns {object}
 */
const dict = (array) =>
  array.reduce((acc, cur) => ({ ...acc, [`folder/${cur}`]: "test" }), {});

describe("Validate File", () => {
  it("should validate file contents", () => {
    expect(isFileValid(dict(["test.xml", "test.mp3", "test.smil"]))).toEqual([
      true,
    ]);

    expect(
      isFileValid(dict(["test.xml", "test.mp3", "test.smil", "ncc.html"]))
    ).toEqual([false, "DAISY 2 format is not supported."]);

    expect(isFileValid(dict(["test.xml", "test.mp3"]))).toEqual([false]);

    expect(isFileValid(dict(["test.xml", "test.smil"]))).toEqual([false]);

    expect(isFileValid(dict(["test.mp3", "test.smil"]))).toEqual([false]);
  });
});
