import React, { useRef, useEffect } from "react";
import Bookmarks from "@arcgis/core/widgets/Bookmarks";
import Expand from "@arcgis/core/widgets/Expand";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import Search from "@arcgis/core/widgets/Search";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";

import "./App.css";

function App() {
  const mapDiv = useRef(null);

  useEffect(() => {
    if (mapDiv.current) {
      /**
       * Initialize application
       */
      const webmap = new WebMap({
        portalItem: {
          id: "aa1d3f80270146208328cf66d022e09c",
          // id: "974c6641665a42bf8a57da08e607bb6f",
        },
      });

      const view = new MapView({
        container: mapDiv.current,
        center: [2.81898, 39.470204], // Longitude, latitude
        zoom: 9, // Zoom level
        map: webmap,
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

      // Add graphics when GraphicsLayer is constructed
      const graphicsLayer = new GraphicsLayer({
        graphics: [pointGraphic, polylineGraphic, polygonGraphic],
      });

      webmap.add(graphicsLayer);

      // ########## Bookmarks ##############
      // Some webmaps include bookmarks
      // This is the a way to display them

      const bookmarks = new Bookmarks({
        view,
        // allows bookmarks to be added, edited, or deleted
        editingEnabled: true,
      });

      // Show bookmarks
      webmap.when(() => {
        if (webmap.bookmarks && webmap.bookmarks.length) {
          console.log("Bookmarks: ", webmap.bookmarks);
        } else {
          console.log("No bookmarks in this webmap.");
        }
      });

      // ########## Expand panel widget ##############
      // Add a lateral expandable pre-built widget
      // It shows bookmarks and lets you to edit existing ones or add new ones
      const bkExpand = new Expand({
        view,
        content: bookmarks,
        expanded: true,
      });

      // ########## Search widget ##############
      // Add a pre-built search widget
      // loactions and even addresses can be found using it.
      const search = new Search({ view });
      view.ui.add(search, "top-right");

      // Add the widget to the top-right corner of the view
      view.ui.add(bkExpand, "top-right");
    }
  }, []);

  return <div className="mapDiv" ref={mapDiv}></div>;
}

export default App;
