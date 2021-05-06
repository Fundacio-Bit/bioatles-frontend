import React, { useRef, useEffect } from "react";
// import Bookmarks from "@arcgis/core/widgets/Bookmarks";
// import Expand from "@arcgis/core/widgets/Expand";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import Search from "@arcgis/core/widgets/Search";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";

// TODO: avoid rerendering
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
        zoom: 2,
      });

      var gra = {};

      gra.geometry = props.polygon;
      gra.symbol = {
        type: "simple-fill", // autocasts as new SimpleFillSymbol()
        color: "#039962",
      };

      // Add graphics when GraphicsLayer is constructed
      var graphicsLayer = new GraphicsLayer({
        // graphics: [pointGraphic, polylineGraphic, polygonGraphic, gra],
        graphics: [gra],
      });

      webmap.add(graphicsLayer);
      console.log(
        "PreColor",
        webmap.allLayers.items[0].graphics.items[0].symbol.color
      );

      // ################# MAP INTERACTION ################
      // Manage click events. Get grid tile id on click.
      console.log("PreView", view);

      view.on("click", function (event) {
        // webmap.allLayers.items[1].graphics.items[0].symbol.color = "#756282";
        // console.log(
        //   "PostColor",
        //   webmap.allLayers.items[1].graphics.items[0].symbol.color
        // );

        webmap.remove(graphicsLayer);

        gra.symbol.color = "#756282";
        var updatedGgraphicsLayer = new GraphicsLayer({
          // graphics: [pointGraphic, polylineGraphic, polygonGraphic, gra],
          graphics: [gra],
        });
        webmap.add(updatedGgraphicsLayer);

        //  get the layer that contains the features
        // it contains two sublayers in a list 0 --> 1x1 and 1 --> 5 x 5
        const mallas = webmap.findLayerById("GOIB_DistEspecies_IB_9660");

        // this function makes a query to the 1x1 feature layer
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
              // view.graphics.removeAll();
              console.log("Feature", featureSet.features[0]);

              props.tileChangeHandler(
                featureSet.features[0].attributes["Q_CODI"]
              );
            })
            .catch((error) => console.log("Query error", error));
        }

        view.hitTest(event).then(function (response) {
          console.log(response);

          // check if a feature is returned
          if (response.screenPoint) {
            console.log(response.results[0]);
            queryFeatures(response.screenPoint, mallas.allSublayers.items[1]);
          }
        });
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
