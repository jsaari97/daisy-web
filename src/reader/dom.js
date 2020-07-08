export const parseNode = (element) => {
  // console.log(element.tagName);

  switch (element.tagName.toUpperCase()) {
    case "IMGGROUP":
      element.outerHTML = element.outerHTML.replace(/imggroup/g, "figure");
      break;
    case "IMG":
      break;
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
