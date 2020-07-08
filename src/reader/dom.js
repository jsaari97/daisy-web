export const parseNode = (element) => {
  // console.log(element.tagName);

  switch (element.tagName) {
    default:
      break;
  }

  // recursion
  if (element.children.length) {
    Array.from(element.children).map(parseNode);
  }

  return element;
};

export const parseXml = (xml) => {
  return xml
    .replace('xmlns="', 'xmlns:conf="')
    .replace(/<level(\d)>/g, '<div class="level level-$1">')
    .replace(/<\/level\d>/g, "</div>")
    .replace(/<sent/g, "<span")
    .replace(/<\/sent>/g, "</span>");
};
