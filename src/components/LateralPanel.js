import React from "react";
import { EyeOutlined } from "@ant-design/icons";

function LateralPanel({ displayedSpecies, selectedSpeciesChangeHandler }) {
  console.log("MySpecies", displayedSpecies);
  return (
    <div>
      {displayedSpecies &&
        displayedSpecies.map((species) => (
          <div
            key={species.toLowerCase().replace(/\s/g, "_")}
            style={{ margin: 5 }}
          >
            {" "}
            {species}
            <EyeOutlined
              style={{ margin: 5 }}
              // onClick={() => props.eventEmitter.emit("message", species)}
              onClick={() => selectedSpeciesChangeHandler(species)}
            ></EyeOutlined>
          </div>
        ))}
    </div>
  );
}

export default LateralPanel;
