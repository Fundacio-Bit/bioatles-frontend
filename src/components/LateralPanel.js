import React, { useState } from "react";
import { EyeOutlined } from "@ant-design/icons";

const LateralPanel = ({ displayedSpecies, selectedSpeciesChangeHandler }) => {
  const [selectedButton, setSelectedButton] = useState(null);

  const getButtonColor = (species) => {
    /*Changes the button color when a species is clicked.*/
    if (selectedButton === species.toLowerCase().replace(/\s/g, "_")) {
      return "#039962";
    } else return "inherit";
  };

  // ###### COMPONENT RENDERING (JSX)  #####
  return (
    <div>
      {displayedSpecies &&
        displayedSpecies.map((species) => (
          <div
            key={species.toLowerCase().replace(/\s/g, "_")}
            style={{ margin: 5, color: getButtonColor(species) }}
          >
            {species}
            <EyeOutlined
              style={{ margin: 5 }}
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
