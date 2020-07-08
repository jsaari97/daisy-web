export const parseNode = (element) => {
  // console.log(element.tagName);

  switch (element.tagName.toUpperCase()) {
    case "IMGGROUP":
      element.outerHTML = element.outerHTML.replace(/imggroup/g, "figure");
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
    .replace(/<\/sent>/g, "</span>")
    .replace(/(<\/?)imggroup/g, "$1figure");
};

export const embedImages = (zip) => async (element) => {
  try {
    const src = element.getAttribute("src");
    const [match] = zip.file(new RegExp(`\/${src}$`));

    if (!match) {
      return;
    }

    const data = await zip.file(match.name).async("base64");

    const format = match.name.match(/\.(.*)$/);

    element.setAttribute("src", `data:image/${format[1]};base64,${data}`);
  } catch (error) {
    console.warn(error);
  }
};
