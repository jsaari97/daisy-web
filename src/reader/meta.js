export const defaultMeta = {
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

/**
 *
 * @param {xpath.SelectedValue[]} nodeList
 * @returns {object}
 */
export const extractMeta = (nodeList) => {
  return nodeList.reduce((meta, item) => {
    const key = item.getAttribute("name").split(":")[1].toLowerCase();
    const value = item.getAttribute("content");

    return {
      ...meta,
      [key]: value,
    };
  }, defaultMeta);
};
