import React from "react";
import data from "../data/dummyTileData.json";
import { EyeOutlined } from "@ant-design/icons";

function LateralPanel(props) {
  const lines =
    props.tile && props.tile in data
      ? data[props.tile].map((species, index) => (
          <div style={{ margin: 5 }}>
            {" "}
            {species}
            <EyeOutlined
              style={{ margin: 5 }}
              onClick={() => props.speciesChangeHandler(index)}
            ></EyeOutlined>
          </div>
        ))
      : null;
  return <div>{lines}</div>;
}

export default LateralPanel;
