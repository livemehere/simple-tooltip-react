import { ToolTip } from "./lib";

function App() {
  return (
    <>
      <ToolTip
        content={<ToolTipContent />}
        arrowSize={3}
        color={"#00000050"}
        margin={20}
        dir={"right"}
      >
        <div
          style={{
            display: "inline-block",
            margin: "300px 100px",
            cursor: "default",
          }}
        >
          A
        </div>
      </ToolTip>
    </>
  );
}

export default App;

function ToolTipContent() {
  return (
    <div
      style={{
        color: "#fff",
        padding: "20px",
        width: "200px",
      }}
    >
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi, dolore
      eligendi explicabo fugit id impedit possimus voluptatem. Amet corporis ea
      ex facilis labore maiores repellat sed vitae voluptatum! Dicta, officiis?
    </div>
  );
}
