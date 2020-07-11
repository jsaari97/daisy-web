/**
 *
 * @param {string} key
 * @param {object} cache
 * @returns {Array<any>}
 */
export function getCache(key, cache) {
  if (cache && cache[key]) {
    return cache[key];
  }

  return [];
}

/**
 *
 * @param {string} key
 * @param {Array<any>} value
 * @param {object} cache
 */
export function setCache(key, value, cache) {
  cache[key] = value;
}
