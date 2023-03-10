import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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

const nearPoint = (x, y, x1, y1, name) => {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
};

const onLine = (x1, y1, x2, y2, x, y, maxDistance = 1) => {
  const a = { x: x1, y: y1 };
  const b = { x: x2, y: y2 };
  const c = { x, y };
  const offset = distance(a, b) - (distance(a, c) + distance(b, c));
  return Math.abs(offset) < maxDistance ? "inside" : null;
};

const positionWithinElement = (x, y, element) => {
  const { type, x1, x2, y1, y2 } = element;
  switch (type) {
    case "linesp":
      const on2 = onLine(x1, y1, x2, y2, x, y);
      const start2 = nearPoint(x, y, x1, y1, "start");
      const end2 = nearPoint(x, y, x2, y2, "end");
      return start2 || end2 || on2;
    case "line":
      const on = onLine(x1, y1, x2, y2, x, y);
      const start = nearPoint(x, y, x1, y1, "start");
      const end = nearPoint(x, y, x2, y2, "end");
      return start || end || on;
    case "rectangle":
    case "Imge":
      const topLeft = nearPoint(x, y, x1, y1, "tl");
      const topRight = nearPoint(x, y, x2, y1, "tr");
      const bottomLeft = nearPoint(x, y, x1, y2, "bl");
      const bottomRight = nearPoint(x, y, x2, y2, "br");
      const inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
      return topLeft || topRight || bottomLeft || bottomRight || inside;
    case "text":
      return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
    default:
      throw new Error(`Type not recognised: ${type}`);
  }
};

const distance = (a, b) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

const getElementAtPosition = (x, y, elements) => {
  return elements
    .map((element) => ({
      ...element,
      position: positionWithinElement(x, y, element),
    }))
    .find((element) => element.position !== null);
};

const adjustElementCoordinates = (element) => {
  const { type, x1, y1, x2, y2 } = element;
  if (type === "rectangle" || type === "Imge") {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    return { x1: minX, y1: minY, x2: maxX, y2: maxY };
  } else {
    if (x1 < x2 || (x1 === x2 && y1 < y2)) {
      return { x1, y1, x2, y2 };
    } else {
      return { x1: x2, y1: y2, x2: x1, y2: y1 };
    }
  }
};

const cursorForPosition = (position) => {
  switch (position) {
    case "tl":
    case "br":
    case "start":
    case "end":
      return "nwse-resize";
    case "tr":
    case "bl":
      return "nesw-resize";
    default:
      return "move";
  }
};

const resizedCoordinates = (clientX, clientY, position, coordinates) => {
  const { x1, y1, x2, y2 } = coordinates;
  switch (position) {
    case "tl":
    case "start":
      return { x1: clientX, y1: clientY, x2, y2 };
    case "tr":
      return { x1, y1: clientY, x2: clientX, y2 };
    case "bl":
      return { x1: clientX, y1, x2, y2: clientY };
    case "br":
    case "end":
      return { x1, y1, x2: clientX, y2: clientY };
    default:
      return null; //should not really get here...
  }
};

const drawElement = (roughCanvas, context, element) => {
  switch (element.type) {
    case "linesp":
      roughCanvas.draw(element.roughElement2);
      break;
    case "line":
    case "rectangle":
    case "Imge":
      roughCanvas.draw(element.roughElement);
      break;
    case "text":
      context.textBaseline = "top";
      context.font = "24px sans-serif";
      context.fillText(element.text, element.x1, element.y1);
      break;
    default:
      throw new Error(`Type not recognised: ${element.type}`);
  }
};

const adjustmentRequired = (type) =>
  ["line", "rectangle", "Imge", "linesp"].includes(type);

  

const Canv = (props) => {
  const {
    elements,
    setElements,
    undo,
    redo,
    setScrollPositionx,
    scrollPositiony,
    scrollPositionx,
    setScrollPositiony,
  } = props;
  
  const [selectedElement, setSelectedElement] = useState(null);

  const [action, setAction] = useState("none");
  const [tool, setTool] = useState("text");
  const textAreaRef = useRef();

  useEffect(() => {
    setTool(props.godata);
  }, [props.godata]);

  const handleScroll = () => {
    const positiony = window.pageYOffset;
    const positionx = window.pageXOffset;
    setScrollPositionx(positionx);
    setScrollPositiony(positiony);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");

    context.clearRect(0, 0, canvas.width, canvas.height);

    const roughCanvas = rough.canvas(canvas);

    elements.forEach((element) => {
      if (action === "writing" && selectedElement.id === element.id) return;
      drawElement(roughCanvas, context, element);
    });
  }, [elements, action, selectedElement]);

  useEffect(() => {
    const undoRedoFunction = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "z") {
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };

    document.addEventListener("keydown", undoRedoFunction);
    return () => {
      document.removeEventListener("keydown", undoRedoFunction);
    };
  }, [undo, redo]);

  
  useEffect(() => {
    const textArea = textAreaRef.current;
    if (action === "writing") {
      textArea.focus();
      textArea.value = selectedElement.text;
    }
  }, [action, selectedElement]);

  const updateElement = (id, x1, y1, x2, y2, type, options) => {
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

  const handleMouseDown = (event) => {
    if (action === "writing") return;

    const { clientX, clientY } = event;
    if (tool === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements);
      if (element) {
        if (element.type === "text") {
          const offsetX = clientX - element.x1 + scrollPositionx - 540;
          const offsetY = clientY - element.y1 + scrollPositiony - 40;
          setSelectedElement({ ...element, offsetX, offsetY });
          setElements((prevState) => prevState);
          props.onSaveItem({ ...element, offsetX, offsetY });
        } else {
          const offsetX = clientX - element.x1;
          const offsetY = clientY - element.y1;
          setSelectedElement({ ...element, offsetX, offsetY });
          setElements((prevState) => prevState);
          props.onSaveItem({ ...element, offsetX, offsetY });
        }

        if (element.position === "inside") {
          setAction("moving");
        } else {
          setAction("resizing");
        }
      }
    } else {
      const id = elements.length;
      const element = createElement(
        id,
        clientX,
        clientY,
        clientX,
        clientY,
        tool,
        scrollPositiony,
        scrollPositionx
      );
      setElements((prevState) => [...prevState, element]);
      setSelectedElement(element);

      setAction(tool === "text" ? "writing" : "drawing");
    }
  };

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;

    if (tool === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements);
      event.target.style.cursor = element
        ? cursorForPosition(element.position)
        : "default";
    }

    if (action === "drawing") {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      updateElement(index, x1, y1, clientX, clientY, tool);
    } else if (action === "moving") {
      const { id, x1, x2, y1, y2, type, offsetX, offsetY } = selectedElement;
      const width = x2 - x1;
      const height = y2 - y1;
      const newX1 = clientX - offsetX;
      const newY1 = clientY - offsetY;
      const options = type === "text" ? { text: selectedElement.text } : {};

      updateElement(
        id,
        newX1,
        newY1,
        newX1 + width,
        newY1 + height,
        type,
        options
      );
    } else if (action === "resizing") {
      const { id, type, position, ...coordinates } = selectedElement;
      const { x1, y1, x2, y2 } = resizedCoordinates(
        clientX,
        clientY,
        position,
        coordinates
      );
      updateElement(id, x1, y1, x2, y2, type);
    }
  };

  const handleMouseUp = (event) => {
    const { clientX, clientY } = event;
    if (selectedElement) {
      if (
        selectedElement.type === "text" &&
        clientX - selectedElement.offsetX === selectedElement.x1 &&
        clientY - selectedElement.offsetY === selectedElement.y1
      ) {
        setAction("writing");
        return;
      }

      const index = selectedElement.id;
      const { id, type } = elements[index];
      if (
        (action === "drawing" || action === "resizing") &&
        adjustmentRequired(type)
      ) {
        const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
        updateElement(id, x1, y1, x2, y2, type);
      }
    }

    if (action === "writing") return;

    setAction("none");
    setSelectedElement(null);
  };

  const handleBlur = (event) => {
    const { id, x1, y1, type } = selectedElement;
    setAction("none");
    setSelectedElement(null);
    updateElement(id, x1, y1, null, null, type, { text: event.target.value });
  };

  return (
    <div>
      <div>
        {action === "writing" ? (
          <textarea
            ref={textAreaRef}
            onBlur={handleBlur}
            style={{
              position: "fixed",
              top: selectedElement.y1 - 2,
              left: selectedElement.x1,
              font: "24px sans-serif",
              margin: 0,
              padding: 0,
              border: 0,
              outline: 0,
              resize: "auto",
              overflow: "hidden",
              whiteSpace: "pre",
              background: "transparent",
            }}
          />
        ) : null}
        <canvas
          id="canvas"
          width="595.28px"
          height="841.89px"
          style={{ border: "1px solid #000000" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          Canvas
        </canvas>
      </div>
    </div>
  );
};

export default Canv;
