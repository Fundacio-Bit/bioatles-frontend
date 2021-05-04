import React, { useRef, useEffect } from "react";
// import Bookmarks from "@arcgis/core/widgets/Bookmarks";
// import Expand from "@arcgis/core/widgets/Expand";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import Search from "@arcgis/core/widgets/Search";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";

function Map() {
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

      // ################# MAP INTERACTION ################
      // Manage click events. Get grid tile id on click.

      view.on("click", function (event) {
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
              console.log(
                "FeatureSet",
                featureSet.features[0].attributes["Q_CODI"]
              );

              // open popup of query result
              // view.popup.open({
              //   features: featureSet.features,
              // });
            })
            .catch((error) => console.log("Query error", error));
        }

        view.hitTest(event).then(function (response) {
          console.log(response);

          // check if a feature is returned
          if (response.screenPoint) {
            console.log(response.results[0]);
            queryFeatures(response.screenPoint, mallas.allSublayers.items[0]);
          }
        });
      });

      // ################## GRAPHIC LAYER ##################3
      // where points, lines and polygons can be draw

      const point = {
        //Create a point
        type: "point",
        longitude: 2.81898,
        latitude: 39.470204,
      };
      const simpleMarkerSymbol = {
        type: "simple-marker",
        color: [226, 119, 40], // Orange
        outline: {
          color: [255, 255, 255], // White
          width: 1,
        },
      };

      const pointGraphic = new Graphic({
        geometry: point,
        symbol: simpleMarkerSymbol,
      });

      // Create a line geometry
      const polyline = {
        type: "polyline",
        paths: [
          [2.81898, 39.470204], //Longitude, latitude
          [2.71898, 39.510104], //Longitude, latitude
          [2.41888, 39.420004], //Longitude, latitude
        ],
      };
      const simpleLineSymbol = {
        type: "simple-line",
        color: [226, 119, 40], // Orange
        width: 2,
      };

      const polylineGraphic = new Graphic({
        geometry: polyline,
        symbol: simpleLineSymbol,
      });

      // Create a filled polygon
      const polygon = {
        type: "polygon",
        rings: [
          [3.1077163, 39.813113], //Longitude, latitude
          [3.1077163, 39.803113], //Longitude, latitude
          [3.0977163, 39.803113], //Longitude, latitude
          [3.0977163, 39.813113], //Longitude, latitude
        ],
      };

      // add a pop-up to the polygon

      const popupTemplate = {
        title: "{Name}",
        content: "{Description}",
      };
      const attributes = {
        Name: "Albufera de Mallorca",
        Description: "Cuadrícula 310",
      };

      const simpleFillSymbol = {
        type: "simple-fill",
        color: [227, 139, 79, 0.8], // Orange, opacity 80%
        outline: {
          color: [255, 255, 255],
          width: 1,
        },
      };

      const polygonGraphic = new Graphic({
        geometry: polygon,
        symbol: simpleFillSymbol,
        attributes: attributes,
        popupTemplate: popupTemplate,
      });

      // const myClickHandler = () => (e) => console.log("MapClick", e.mapPoint);
      // connect(webmap, "onClick", myClickHandler);

      // console.log(connect);

      // Add graphics when GraphicsLayer is constructed
      const graphicsLayer = new GraphicsLayer({
        graphics: [pointGraphic, polylineGraphic, polygonGraphic],
      });

      webmap.add(graphicsLayer);

      // ########## Bookmarks ##############
      // Some webmaps include bookmarks
      // This is the a way to display them

      // const bookmarks = new Bookmarks({
      //   view,
      //   // allows bookmarks to be added, edited, or deleted
      //   editingEnabled: true,
      // });

      // // Show bookmarks
      // webmap.when(() => {
      //   if (webmap.bookmarks && webmap.bookmarks.length) {
      //     console.log("Bookmarks: ", webmap.bookmarks);
      //   } else {
      //     console.log("No bookmarks in this webmap.");
      //   }
      // });

      // Add a lateral expandable pre-built widget
      // It shows bookmarks and lets you to edit existing ones or add new ones
      // const bkExpand = new Expand({
      //   view,
      //   content: bookmarks,
      //   expanded: true,
      // });
      // // Add the widget to the top-right corner of the view
      // view.ui.add(bkExpand, "top-right");

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
