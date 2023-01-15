import DrawingApp from "./DrawingApp";
import { useState } from "react";
import Canv from "./Canv";
import "./App.css";
import useHistory from "./canvasUtils/useHistory";

function App() {
  const [data, setData] = useState(null);
  const [tool, setTool] = useState("text");
  const [elements, setElements, undo, redo] = useHistory([]);
  const [scrollPositionx, setScrollPositionx] = useState(0);
  const [scrollPositiony, setScrollPositiony] = useState(0);

  const saveExtend = (e) => {
    const extendData = {
      ...e,
    };
    setData(extendData);
  };

  const tooldata = (e) => {
    setTool(e);
  };

  return (
    <div className="App">
      <DrawingApp
        data={data}
        onTool={tooldata}
        elements={elements}
        setElements={setElements}
        undo={undo}
        redo={redo}
        setData={setData}
        setScrollPositionx={setScrollPositionx}
        scrollPositiony={scrollPositiony}
        setScrollPositiony={setScrollPositiony}
        scrollPositionx={scrollPositionx}
      />
      <div className="cons">
        <Canv
          onSaveItem={saveExtend}
          godata={tool}
          elements={elements}
          setElements={setElements}
          undo={undo}
          redo={redo}
          setScrollPositionx={setScrollPositionx}
          scrollPositiony={scrollPositiony}
          scrollPositionx={scrollPositionx}
          setScrollPositiony={setScrollPositiony}
        />
      </div>
    </div>
  );
}

export default App;
