import React from "react";
import { EyeOutlined } from "@ant-design/icons";

function LateralPanel(props) {
  console.log("MySpecies", props.displayedSpecies);
  return (
    <div>
      {props.displayedSpecies &&
        props.displayedSpecies.map((species) => (
          <div
            key={species.toLowerCase().replace(/\s/g, "_")}
            style={{ margin: 5 }}
          >
            {" "}
            {species}
            <EyeOutlined
              style={{ margin: 5 }}
              onClick={() => props.eventEmitter.emit("message", species)}
            ></EyeOutlined>
          </div>
        ))}
    </div>
  );
}

export default LateralPanel;
