import React, { useState, useRef, useEffect } from "react";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import Search from "@arcgis/core/widgets/Search";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import tileData from "../data/dummyTileData.json";
import speciesData from "../data/dummySpeciesData.json";

// TODO ask to SITIBSA if the webmap can be configured without info windows
// TODO check with SITIBSA why the CADSATRO layer don't loads (a CORS error message is thrown)

const Map = ({
  selectedSpeciesChangeHandler,
  selectedSpecies,
  displayedSpeciesChangeHandler,
}) => {
  // the webmap with an empty graphics layer is initialized in a first useEffect, then saved in the state.
  // this way it will be available for later manipulations/updates on that graphic layer.
  const [webmap, setWebmap] = useState(null);

  // A reference for the div where the map will be injected
  const mapDiv = useRef(null);

  useEffect(() => {
    // Initialize webmap. It has been preconfigured by SITIBSA and made available throught the CAIB maps web portal
    const webmap = new WebMap({
      portalItem: {
        id: "884dd1c129b84c72a1db164c4fb85095",
        portal: {
          url: "https://portalideib.caib.es/portal",
        },
      },
    });

    // remove default info window (which is predefined in the webmap delivered)
    webmap.infoWindow = null;

    // ################# INITIALIZE GRAPHICS LAYER ##############
    // it must exist for later interaction
    // an id is provided to get it using the method findLayerById on manipulations
    var graphicsLayer = new GraphicsLayer({
      id: "bioatles-graphics",
      graphics: null,
    });

    webmap.add(graphicsLayer);

    setWebmap(webmap);
  }, []);

  useEffect(() => {
    // Add a view once the webmap exists
    // It defines the div that will contain the map, the zoom level and if desired the extent (the map area that will be shown)
    // event handlers (i.e. onClick interactions) and widgets (i.e. a search widget)
    if (webmap) {
      const view = new MapView({
        container: mapDiv.current,
        map: webmap,
        zoom: 2,
      });

      // ########## SEARCH WIDGET ##############
      // Add a pre-built search widget. Locations and even addresses can be found using it.
      const search = new Search({ view });
      view.ui.add(search, "top-right");

      // ########## ON CLICK EVENT HANDLER ##############
      // It will get the clicked tile number and use that information to draw a rectangle representing its area
      view.on("click", function (event) {
        // reset the graphics layer removing all tiles previously drawn
        webmap.findLayerById("bioatles-graphics").removeAll();

        // get the layer that contains the features (we look for tile numbers)
        // it contains two sublayers in a list 0 --> 1x1 and 1 --> 5 x 5
        const mallas = webmap.findLayerById("GOIB_DistEspecies_IB_9660");

        function queryFeatures(screenPoint, layer) {
          /* This function makes a query to the 5x5 feature layer.
          Uses a screen point (coordinates) retrieved via click. It is intersected with the features to know
          which one is found at that point.
          The attributes of this feature contain the information required (The grid tile number)*/
          const point = view.toMap(screenPoint);
          layer
            .queryFeatures({
              geometry: point,
              spatialRelationship: "intersects",
              returnGeometry: false,
              outFields: ["*"],
            })
            .then((featureSet) => {
              // ############ ADD GRAPHICS IN RESPONSE TO A MAP CLICK ###########
              // Draw the clicked tile adding graphics to the already existing graphicsLayer ("bioatles-graphics")
              var gra = {};
              gra.geometry =
                tileData[featureSet.features[0].attributes["Q_CODI"]].polygon;
              gra.symbol = {
                type: "simple-fill", // autocasts as new SimpleFillSymbol()
                color: "blue",
              };

              webmap.findLayerById("bioatles-graphics").add(gra);

              // ########### UPDATE PARENT (mainContainer) STATE #########
              // this state update prevents conflicts with previously applied filters.
              selectedSpeciesChangeHandler(null);

              // this tells the lateralPanel (via props) which species should be listed (those present at that tile)
              displayedSpeciesChangeHandler(
                tileData[featureSet.features[0].attributes["Q_CODI"]].species
              );
            })
            .catch((error) => console.log("Query error", error));
        }

        // hitTests of the Javascript ArcGis API are used to determine the topmost feature of the layers
        // intersecting teh provided coordinates
        view.hitTest(event).then(function (response) {
          // check if a feature is returned
          if (response.screenPoint) {
            queryFeatures(response.screenPoint, mallas.allSublayers.items[1]);
          }
        });
      });
    }
  }, [webmap]);

  // ############ ADD GRAPHICS IN RESPONSE TO A CHANGE IN THE SELECTED SPECIES ###########
  // Update when the selectedSpecies prop changes
  // This happens when the selectedSpecies state changes in the mainContainer because a species was selected in the lateralPanel
  // the webmap and view are not rerendered because they are not dependencies of the corresponding useEffects that creates them.
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

    if (speciesGraphics) {
      webmap.findLayerById("bioatles-graphics").removeAll();
      speciesGraphics.map((graphic) =>
        webmap.findLayerById("bioatles-graphics").add(graphic)
      );
    }
  }

  // ###### COMPONENT RENDERING (JSX)  #####
  return <div id="mapDiv" ref={mapDiv}></div>;
};

export default Map;
