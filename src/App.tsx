import { ToolTip } from "./lib";

function App() {
  return (
    <>
      <ToolTip
        content={<div style={{ color: "white" }}>tool</div>}
        arrowSize={0}
      >
        <div style={{ display: "inline-block", margin: "100px 100px" }}>A</div>
      </ToolTip>
    </>
  );
}

export default App;
