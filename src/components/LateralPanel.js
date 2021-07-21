import React, { useState, useEffect } from "react";
import { EyeOutlined } from "@ant-design/icons";
import axios from 'axios';

const LateralPanel = ({ selectedSpeciesChangeHandler, displayedTilesChangeHandler }) => {
  const [selectedButton, setSelectedButton] = useState(null);
  const [species, setSpecies] = useState(null);

  const getButtonColor = (species) => {
    /*Changes the button color when a species is clicked.*/
    if (selectedButton === species) {
      return "#039962";
    } else return "inherit";
  };

  useEffect(() => {
    const fetchSpecies = () => {
      axios({
        method: "get",
        baseURL: "http://127.0.0.1:8080/",
        // url: "serproes/api/services/regist/findRegistByEspeci/6986",
        url: "serproes/api/services/especi/list",
        headers:       
        { 
          'Authorization': ' Bearer ' + window.sessionStorage.getItem("token"),
        },
      })
        .then((response) => {
          setSpecies(response.data.slice(0, 30));
          // console.log(
          //   "Response: ", response.data.slice(0, 30)
          // );
        })
        .catch((error) => {
          console.log("REST API error: ", error);
        });
    }
    fetchSpecies();
    return () => null;
  }, []);

  const fetchRegistries = (specieId) => {
    axios({
      method: "get",
      baseURL: "http://127.0.0.1:8080/",
      url: `serproes/api/services/regist/findRegistByEspeci/${specieId}`,
      headers:       
      { 
        'Authorization': ' Bearer ' + window.sessionStorage.getItem("token"),
      },
    })
      .then((response) => {
        displayedTilesChangeHandler(response.data.map( item => item.regCodcua.cuaCodq5));
        console.log(
          "Response: ", response.data.map( item => item.regCodcua.cuaCodq5)
        );
      })
      .catch((error) => {
        console.log("REST API error: ", error);
      });
  }

  // ###### COMPONENT RENDERING (JSX)  #####
  return (
    <div>
      {species &&
        species.map((item) => (
          <div
            key={item.espTaxon}
            style={{ margin: 5, color: getButtonColor(item.espCodi) }}
          >
            {item.espTaxon}
            <EyeOutlined
              style={{ margin: 5 }}
              onClick={() => {
                fetchRegistries(item.espCodi);
                setSelectedButton(item.espCodi);
                selectedSpeciesChangeHandler(item.espCodi);
              }}
            ></EyeOutlined>
          </div>
        ))}
    </div>
  );
};

export default LateralPanel;
