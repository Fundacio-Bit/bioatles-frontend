import React, { useState } from "react";

import { Row, Col } from "antd";
import { Typography } from "antd";

import Map from "./Map";
import LateralPanel from "./LateralPanel";

import speciesData from "../data/dummySpeciesData.json";

import "./MainContainer.css";

const { Title } = Typography;

// var EventEmitter = require("events");

function MainContainer() {
  const [selectedTile, setSelectedTile] = useState(null);
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  // const [viewZoom, setViewZoom] = useState(2);
  // const [viewExtent, setViewExtent] = useState(null);
  const [displayedSpecies, setDisplayedSpecies] = useState(
    Object.keys(speciesData)
  );
  // const [displayedTiles, setDisplayedTiles] = useState(null);

  /// ####### EVENTS MANAGEMENT ###########
  //stackoverflow.com/questions/42802931/node-js-how-can-i-return-a-value-from-an-event-listener
  // var ee = new EventEmitter();

  const tileChangeHandler = (tileNr) => {
    setSelectedTile(tileNr);
  };
  const selectedSpeciesChangeHandler = (species) => {
    setSelectedSpecies(species);
  };

  // const zoomChangeHandler = (zoomLevel) => {
  //   setViewZoom(zoomLevel);
  // };

  // const extentChangeHandler = (extent) => {
  //   setViewExtent(extent);
  // };

  const displayedSpeciesChangeHandler = (speciesArray) => {
    setDisplayedSpecies(speciesArray);
  };

  // const displayedTilesChangeHandler = (tilesArray) => {
  //   console.log("Tiles with species", tilesArray);
  //   setDisplayedTiles(tilesArray);
  // };

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
            displayedSpecies={displayedSpecies}
            selectedSpeciesChangeHandler={selectedSpeciesChangeHandler}
          ></LateralPanel>
        </Col>
        <Col span={18}>
          <Map
            tileChangeHandler={tileChangeHandler}
            selectedSpecies={selectedSpecies}
            displayedSpeciesChangeHandler={displayedSpeciesChangeHandler}
          ></Map>
        </Col>
      </Row>
    </>
  );
}

export default MainContainer;
