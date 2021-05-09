import React, { useRef, useEffect } from "react";
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

function Map(props) {
  const mapDiv = useRef(null);

  useEffect(() => {
    if (mapDiv.current) {
      /**
       * Initialize application
       */
      const webmap = new WebMap({
        portalItem: {
          id: "884dd1c129b84c72a1db164c4fb85095",
          portal: {
            url: "https://portalideib.caib.es/portal",
          },
        },
      });

      webmap.infoWindow = null;

      const view = new MapView({
        container: mapDiv.current,
        map: webmap,
        zoom: props.viewZoom,
        extent: props.viewExtent,
      });

      // ################# INITIALIZE GRAPHICS LAYER ##############
      // it mus exist for later interaction
      var graphicsLayer = new GraphicsLayer({ graphics: null });

      webmap.add(graphicsLayer);

      // ################# MAP INTERACTION ################
      // Manage click events. Get grid tile id on click.

      view.on("click", function (event) {
        console.log("Zoom level", view.zoom, view.extent);
        props.zoomChangeHandler(view.zoom);
        props.extentChangeHandler(view.extent);

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
              console.log("Webmap pre", webmap);
              var gra = {};
              gra.geometry =
                tileData[featureSet.features[0].attributes["Q_CODI"]].polygon;
              gra.symbol = {
                type: "simple-fill", // autocasts as new SimpleFillSymbol()
                color: "#039962",
              };

              // Add graphics when GraphicsLayer is constructed
              graphicsLayer.removeAll();
              graphicsLayer.add(gra);

              props.displayedSpeciesChangeHandler(
                tileData[featureSet.features[0].attributes["Q_CODI"]].species
              );

              props.tileChangeHandler(
                featureSet.features[0].attributes["Q_CODI"]
              );
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

      // listen for LateralPanel events
      props.eventEmitter.on("message", function (text) {
        const speciesGraphics =
          text in speciesData
            ? speciesData[text].map((tile) => ({
                geometry: tileData[tile].polygon,
                symbol: {
                  type: "simple-fill",
                  color: "#039962",
                },
              }))
            : null;

        graphicsLayer.removeAll();
        speciesGraphics.map((graphic) => graphicsLayer.add(graphic));

        // var graphicsLayer = new GraphicsLayer({ graphics: speciesGraphics });

        webmap.add(graphicsLayer);
      });

      // ########## Search widget ##############
      // Add a pre-built search widget
      // locations and even addresses can be found using it.
      const search = new Search({ view });
      view.ui.add(search, "top-right");
    }
  }, []);

  return <div id="mapDiv" ref={mapDiv}></div>;
}

export default Map;
