import React, { useState, useRef, useEffect } from "react";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import Search from "@arcgis/core/widgets/Search";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import tileData from "../data/dummyTileData.json";
import speciesData from "../data/dummySpeciesData.json";

// THE ARCGIS BASE MAP SHOULD IMPLEMENT ALL THE REQUIRED FUNCTIONALITY
// IT WILL COMUNNICATE VIA EVENTS (EVENT EMITTER) WITH THE REACT PARENT AND SIBLINGS
// STATE SHOULD NOT BE MODIFIED: IT WOULD PRODUCE MAP RERENDERINGS AND THUS A BAD USER EXPERIENCE
// https://stackoverflow.com/questions/62619741/update-state-without-re-rendering-arcgis-map

function Map({
  tileChangeHandler,
  selectedSpecies,
  displayedSpeciesChangeHandler,
}) {
  const [webmap, setWebmap] = useState(null);
  const mapDiv = useRef(null);

  useEffect(() => {
    /**
     * Initialize webmap
     */
    const webmap = new WebMap({
      portalItem: {
        id: "884dd1c129b84c72a1db164c4fb85095",
        portal: {
          url: "https://portalideib.caib.es/portal",
        },
      },
    });

    // TODO: tell SITIBSA to configure the webmap removing info windows
    // remove default info window (which is predefined in the webmap delivered)
    webmap.infoWindow = null;

    // ################# INITIALIZE GRAPHICS LAYER ##############
    // it must exist for later interaction
    var graphicsLayer = new GraphicsLayer({
      id: "bioatles-graphics",
      graphics: null,
    });

    webmap.add(graphicsLayer);

    setWebmap(webmap);
  }, []);

  useEffect(() => {
    const view = new MapView({
      container: mapDiv.current,
      map: webmap,
      zoom: 2,
      // zoom: viewZoom,
      // extent: viewExtent,
    });

    // ########## Search widget ##############
    // Add a pre-built search widget
    // locations and even addresses can be found using it.
    const search = new Search({ view });
    view.ui.add(search, "top-right");

    view.on("click", function (event) {
      //  get the layer that contains the features
      // it contains two sublayers in a list 0 --> 1x1 and 1 --> 5 x 5
      const mallas = webmap.findLayerById("GOIB_DistEspecies_IB_9660");

      // this function makes a query to the 5x5 feature layer
      // uses a screen point (ccordinates) retrieved via click. It is intersected with the features to know
      // which one is found at that point.
      // The attributes of this feature contain the information required (i.e. the grid tile number)
      function queryFeatures(screenPoint, layer) {
        const point = view.toMap(screenPoint);
        layer
          .queryFeatures({
            geometry: point,
            spatialRelationship: "intersects",
            returnGeometry: false,
            outFields: ["*"],
          })
          .then((featureSet) => {
            var gra = {};
            gra.geometry =
              tileData[featureSet.features[0].attributes["Q_CODI"]].polygon;
            gra.symbol = {
              type: "simple-fill", // autocasts as new SimpleFillSymbol()
              color: "#039962",
            };

            // Add graphics when GraphicsLayer is constructed
            webmap.findLayerById("bioatles-graphics").removeAll();
            webmap.findLayerById("bioatles-graphics").add(gra);

            displayedSpeciesChangeHandler(
              tileData[featureSet.features[0].attributes["Q_CODI"]].species
            );

            tileChangeHandler(featureSet.features[0].attributes["Q_CODI"]);
          })
          .catch((error) => console.log("Query error", error));
      }

      view.hitTest(event).then(function (response) {
        // check if a feature is returned
        if (response.screenPoint) {
          queryFeatures(response.screenPoint, mallas.allSublayers.items[1]);
        }
      });
    });
    // setView(view);
  }, [webmap]);

  // Update when the selectedSpecies prop changes
  // the webmap and view are not rerendered because they are not dependencies of the corresponding useEffect that creates them.
  if (webmap) {
    const speciesGraphics =
      selectedSpecies in speciesData
        ? speciesData[selectedSpecies].map((tile) => ({
            geometry: tileData[tile].polygon,
            symbol: {
              type: "simple-fill",
              color: "#039962",
            },
          }))
        : null;

    webmap.findLayerById("bioatles-graphics").removeAll();
    if (speciesGraphics) {
      speciesGraphics.map((graphic) =>
        webmap.findLayerById("bioatles-graphics").add(graphic)
      );
    }
  }

  return <div id="mapDiv" ref={mapDiv}></div>;
}

export default Map;
