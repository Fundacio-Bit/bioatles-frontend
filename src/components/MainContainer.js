import React, { useState } from "react";

import { Row, Col } from "antd";
import { Typography } from "antd";

import Map from "./Map";
import LateralPanel from "./LateralPanel";
import "./MainContainer.css";

const { Title } = Typography;

function MainContainer() {
  const [selectedTile, setSelectedTile] = useState(null);
  const [selectedSpecies, setSelectedSpecies] = useState(0);

  const getPolygon = (speciesIndex) => {
    const polygons = [
      {
        type: "polygon",
        rings: [
          [1.1554, 38.8794], //Longitude, latitude
          [1.2134, 38.8798], //Longitude, latitude
          [1.2134, 38.835], //Longitude, latitude
          [1.1554, 38.835], //Longitude, latitude
        ],
      },
    ];
    return polygons[speciesIndex];
  };

  console.log("species", selectedSpecies);
  console.log("polygon", getPolygon(selectedSpecies));
  console.log("MYTILE", selectedTile);

  const tileChangeHandler = (tileNr) => {
    setSelectedTile(tileNr);
  };
  const speciesChangeHandler = (speciesNr) => {
    setSelectedSpecies(speciesNr);
  };

  return (
    <>
      <Row className="header">
        <Col span={24}>
          <Title className="header-title">Bioatles</Title>
        </Col>
      </Row>
      <Row>
        <Col span={6} className="left-col">
          <Title level={3} className="left-col-title">
            Espècies
          </Title>
          <LateralPanel
            tile={selectedTile}
            speciesChangeHandler={speciesChangeHandler}
          ></LateralPanel>
        </Col>
        <Col span={18}>
          <Map
            tileChangeHandler={tileChangeHandler}
            polygon={getPolygon(selectedSpecies)}
            selectedSpecies={selectedSpecies}
          ></Map>
        </Col>
      </Row>
    </>
  );
}

export default MainContainer;
