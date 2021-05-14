import React, { useState } from "react";
import { EyeOutlined } from "@ant-design/icons";

const LateralPanel = ({ displayedSpecies, selectedSpeciesChangeHandler }) => {
  const [selectedButton, setSelectedButton] = useState(null);
  console.log("Selected", selectedButton);
  const getButtonColor = (species) => {
    if (selectedButton === species.toLowerCase().replace(/\s/g, "_")) {
      return "#039962";
    } else return "inherit";
  };
  return (
    <div>
      {displayedSpecies &&
        displayedSpecies.map((species) => (
          <div
            key={species.toLowerCase().replace(/\s/g, "_")}
            style={{ margin: 5, color: getButtonColor(species) }}
          >
            {" "}
            {species}
            <EyeOutlined
              style={{ margin: 5 }}
              // onClick={() => props.eventEmitter.emit("message", species)}
              onClick={() => {
                setSelectedButton(species.toLowerCase().replace(/\s/g, "_"));
                selectedSpeciesChangeHandler(species);
              }}
            ></EyeOutlined>
          </div>
        ))}
    </div>
  );
};

export default LateralPanel;
