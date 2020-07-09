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

export const transformList = (element) => {
  const type = element.getAttribute("type");
  const enumType = element.getAttribute("enum") || "1";

  if (type === "ol" && enumType) {
    element.setAttribute("type", enumType);
  } else {
    element.removeAttribute("type");
  }

  changeElementType(element, type);
};

const changeElementType = (element, newType) => {
  const newElement = document.createElement(newType);

  // Move children
  while (element.firstChild) {
    newElement.appendChild(element.firstChild);
  }

  // Copy attributes
  for (let i = 0, a = element.attributes, l = a.length; i < l; i++) {
    newElement.setAttribute(a[i].name, a[i].value);
  }

  element.parentNode.replaceChild(newElement, element);
};
