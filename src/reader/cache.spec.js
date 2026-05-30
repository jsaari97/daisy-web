import { getCache, setCache } from "./cache";

describe("getCache", () => {
  it("should return cached array for known key", () => {
    const cache = { foo: [1, 2, 3] };
    expect(getCache("foo", cache)).toEqual([1, 2, 3]);
  });

  it("should return empty array for unknown key", () => {
    const cache = {};
    expect(getCache("missing", cache)).toEqual([]);
  });

  it("should return empty array for null/undefined cache", () => {
    expect(getCache("any", null)).toEqual([]);
    expect(getCache("any", undefined)).toEqual([]);
  });
});

describe("setCache", () => {
  it("should set value on cache object", () => {
    const cache = {};
    setCache("bar", [4, 5], cache);
    expect(cache.bar).toEqual([4, 5]);
    expect(getCache("bar", cache)).toEqual([4, 5]);
  });
});
