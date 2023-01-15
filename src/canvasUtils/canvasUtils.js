import rough from "roughjs/bundled/rough.esm";

const baseOptions = { roughness: 0 };
const generator = rough.generator();

const createElement = (
  id,
  x1,
  y1,
  x2,
  y2,
  type,
  scrollPositiony,
  scrollPositionx
) => {
  switch (type) {
    case "linesp":
      Math.abs(x1 - x2) <= Math.abs(y1 - y2) ? (x2 = x1) : (y2 = y1);
      const roughElement2 = generator.line(
        x1 + scrollPositionx - 540,
        y1 + scrollPositiony - 40,
        x2 + scrollPositionx - 540,
        y2 + scrollPositiony - 40,
        baseOptions
      );

      return { id, x1, y1, x2, y2, type, roughElement2 };
    case "line":
    case "rectangle":
    case "Imge":
      const roughElement =
        type === "line"
          ? generator.line(
              x1 + scrollPositionx - 540,
              y1 + scrollPositiony - 40,
              x2 + scrollPositionx - 540,
              y2 + scrollPositiony - 40,
              baseOptions
            )
          : generator.rectangle(
              x1 + scrollPositionx - 540,
              y1 + scrollPositiony - 40,
              x2 - x1,
              y2 - y1,
              baseOptions
            );
      return { id, x1, y1, x2, y2, type, roughElement };
    case "text":
      return { id, type, x1, y1, x2, y2, text: "" };

    default:
      throw new Error(`Type not recognised: ${type}`);
  }
};

const updateElement = ({
  id,
  x1,
  y1,
  x2,
  y2,
  scrollPositiony,
  scrollPositionx,
  type,
  elements,
  setElements,
  options,
}) => {
  const elementsCopy = [...elements];

  switch (type) {
    case "line":
    case "linesp":
    case "rectangle":
    case "Imge":
      elementsCopy[id] = createElement(
        id,
        x1,
        y1,
        x2,
        y2,
        type,
        scrollPositiony,
        scrollPositionx
      );

      break;
    case "text":
      const textWidth = document
        .getElementById("canvas")
        .getContext("2d")
        .measureText(options.text).width;
      const textHeight = 24;
      elementsCopy[id] = {
        ...createElement(
          id,
          x1 + scrollPositionx - 540,
          y1 + scrollPositiony - 40,
          x1 + textWidth,
          y1 + textHeight,
          type,
          scrollPositiony,
          scrollPositionx
        ),
        text: options.text,
      };

      break;
    default:
      throw new Error(`Type not recognised: ${type}`);
  }

  setElements(elementsCopy, true);
};

export { updateElement };
