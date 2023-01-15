import { updateElement } from "./canvasUtils/canvasUtils";
import "./DrawingApp.css";

function DrawingApp(props) {
  const {
    data,
    undo,
    redo,
    scrollPositiony,
    scrollPositionx,
    elements,
    setElements,
    setData,
  } = props;

  const objdata = (elements) => {
    const extendData = {
      ...elements,
    };
    const Imge = [];
    const rectangle = [];
    const line = [];
    const linesp = [];
    const text = [];
    let all = [];

    for (var i = 0; i < elements.length; i++) {
      if (extendData[i].type === "Imge") {
        Imge.push(extendData[i]);
      } else if (extendData[i].type === "rectangle") {
        line.push(extendData[i]);
      } else if (extendData[i].type === "line") {
        line.push(extendData[i]);
      } else if (extendData[i].type === "linesp") {
        line.push(extendData[i]);
      } else if (extendData[i].type === "text") {
        text.push(extendData[i]);
      }
    }
    all = { Imge, line, text };
    console.log(all);
  };

  return (
    <div className="cav">
      <p>Properties</p>
      <aside className="panel">
        <div className="properties">
          <div className="key">
            ID <span className="value">{data ? data.id : "null"}</span>
          </div>

          <div className="key">
            Type <span className="value">{data?.type || "null"}</span>
          </div>

          <div className="key">
            Text <span className="value">{data?.text || "null"}</span>
          </div>

          <div className="key">
            X Start <span className="value">
              <input type="number" className="snpnum" name="ystart" value={data?.x1 || 0}
              onChange={(event) => {
                  const value = Number(event.target.value);
                  updateElement({
                    ...data,
                    x1: value,
                    scrollPositiony,
                    scrollPositionx,
                    elements,
                    setElements,
                  });
                  setData((prevState) => ({ ...prevState, x1: value }));
                }}
              />
              px
            </span>
          </div>

          <div className="key">
            X End
            <span className="value">
              <input
                type="number"
                className="snpnum"
                name="ystart"
                value={data?.x2 || 0}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  updateElement({
                    ...data,
                    x2: value,
                    scrollPositiony,
                    scrollPositionx,
                    elements,
                    setElements,
                  });
                  setData((prevState) => ({ ...prevState, x2: value }));
                }}
              />
              px
            </span>
          </div>

          <div className="key">
            Y Start
            <span className="value">
              <input
                type="number"
                className="snpnum"
                name="ystart"
                value={data?.y1 || 0}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  updateElement({
                    ...data,
                    y1: value,
                    scrollPositiony,
                    scrollPositionx,
                    elements,
                    setElements,
                  });
                  setData((prevState) => ({ ...prevState, y1: value }));
                }}
              />
              px
            </span>
          </div>

          <div className="key">
            Y End{" "}
            <span className="value">
              <input
                type="number"
                className="snpnum"
                name="ystart"
                value={data?.y2 || 0}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  updateElement({
                    ...data,
                    y2: value,
                    scrollPositiony,
                    scrollPositionx,
                    elements,
                    setElements,
                  });
                  setData((prevState) => ({ ...prevState, y2: value }));
                }}
              />
              px
            </span>
          </div>

          <div className="key">
            Width
            <span className="value">
              <input
                type="number"
                className="snpnum"
                name="ystart"
                value={data ? data.x2 - data.x1 : 0}
              />
              px
            </span>
          </div>

          <div className="key">
            Height{" "}
            <span className="value">
              <input
                type="number"
                className="snpnum"
                value={data ? data.y2 - data.y1 : 0}
              />
              px
            </span>
          </div>

          <hr/>
          <div class="main-container">
            <div class="radio-buttons">
              <label class="custom-radio">
                <input
                  type="radio"
                  name="radio"
                  onChange={() => props.onTool("selection")}
                />
                <span class="radio-btn">
                  <div class="hobbies-icon">
                    <i class="las la-arrows-alt "></i>
                    <h3>Selection</h3>
                  </div>
                </span>
              </label>

              <label class="custom-radio">
                <input
                  type="radio"
                  name="radio"
                  onChange={() => props.onTool("rectangle")}
                />
                <span class="radio-btn">
                  <div class="hobbies-icon">
                    <i class="las la-stop"></i>
                    <h3>Rectangle</h3>
                  </div>
                </span>
              </label>

              <label class="custom-radio">
                <input
                  type="radio"
                  name="radio"
                  onChange={() => props.onTool("Imge")}
                />
                <span class="radio-btn">
                  <div class="hobbies-icon">
                    <i class="lar la-image"></i>
                    <h3>Image</h3>
                  </div>
                </span>
              </label>

              <label class="custom-radio">
                <input
                  type="radio"
                  name="radio"
                  onChange={() => props.onTool("line")}
                />
                <span class="radio-btn">
                  <div class="hobbies-icon">
                    <i class="las la-chart-line"></i>
                    <h3>Line</h3>
                  </div>
                </span>
              </label>

              <label class="custom-radio">
                <input
                  type="radio"
                  name="radio"
                  onChange={() => props.onTool("linesp")}
                />
                <span class="radio-btn">
                  <div class="hobbies-icon">
                    <i class="las la-grip-lines-vertical"></i>
                    <h3>Line SP</h3>
                  </div>
                </span>
              </label>

              <label class="custom-radio">
                <input
                  type="radio"
                  name="radio"
                  onClick={() => props.onTool("text")}
                />
                <span class="radio-btn">
                  <div class="hobbies-icon">
                    <i class="las la-text-width"></i>
                    <h3>Text</h3>
                  </div>
                </span>
              </label>
            </div>
          </div>

          <hr/>
          <div>
            <button className="butun" onClick={undo}>
              Undo
            </button>
            <button className="butun" onClick={redo}>
              Redo
            </button>
            <button className="butun" onClick={objdata.bind(this, elements)}>
              Submit
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default DrawingApp;
