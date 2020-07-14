/**
 * Validate zip file contents
 * @param {object} files
 * @returns {[boolean, string]}
 */
export function isFileValid(files) {
  const keys = Object.keys(files);

  if (keys.some((file) => file.match(/\.xml$/)) === false) {
    return [false];
  }

  if (keys.some((file) => file.match(/\/ncc\.html$/))) {
    return [false, 'DAISY 2 format is not supported.'];
  }

  if (keys.some((file) => file.match(/\.mp3$/)) === false) {
    return [false];
  }

  if (keys.some((file) => file.match(/\.smil$/)) === false) {
    return [false];
  }

  return [true];
}
