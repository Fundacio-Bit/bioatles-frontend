import React, { useState } from "react";

import { Row, Col } from "antd";
import { Typography } from "antd";

import Map from "./Map";
import LateralPanel from "./LateralPanel";

import speciesData from "../data/dummySpeciesData.json";

import "./MainContainer.css";

const { Title } = Typography;

const MainContainer = ( {logoutHandler, username} ) => {
  // ###### STATES AND HANDLERS  #####
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [displayedTiles, setDisplayedTiles] = useState(null);
  const [displayedSpecies, setDisplayedSpecies] = useState(
    Object.keys(speciesData)
  );

  // Handlers are passed to child components.
  // Child comps will be able to update the state of the MainContainer (parent) when some actions are triggered withim them.
  const selectedSpeciesChangeHandler = (species) => {
    setSelectedSpecies(species);
  };

  const displayedSpeciesChangeHandler = (speciesArray) => {
    setDisplayedSpecies(speciesArray);
  };

  const displayedTilesChangeHandler = (tilesArray) => {
    setDisplayedTiles(tilesArray);
  };

  // ###### COMPONENT RENDERING (JSX)  #####
  return (
    <>
      <Row className="header">
        <Col span={20}>
          <Title className="header-title">Bioatles</Title>
        </Col>
        <Col span={2} style={{alignSelf: "center"}}>
          <div><b>Benvingut <span style={{color: "#039962", fontSize: 20}}>{username}</span> </b></div>
        </Col>
        <Col span={2} style={{alignSelf: "center"}}>
          <button className="w3-btn w3-red" style={{ borderRadius: 8, color: "white", backgroundColor: "#A63A04", border: "none", fontSize: 20 }} onClick={ () => logoutHandler() }>Logout</button>
        </Col>
      </Row>
      <Row>
        <Col span={6} className="left-col">
          <Title level={3} className="left-col-title">
            Espècies
          </Title>
          <LateralPanel
            // displayedSpecies={displayedSpecies}
            selectedSpeciesChangeHandler={selectedSpeciesChangeHandler}
            displayedTilesChangeHandler={displayedTilesChangeHandler}
          ></LateralPanel>
        </Col>
        <Col span={18}>
          <Map
            selectedSpecies={selectedSpecies}
            displayedTiles={displayedTiles}
            selectedSpeciesChangeHandler={selectedSpeciesChangeHandler}
            displayedSpeciesChangeHandler={displayedSpeciesChangeHandler}
          ></Map>
        </Col>
      </Row>
    </>
  );
};

export default MainContainer;
