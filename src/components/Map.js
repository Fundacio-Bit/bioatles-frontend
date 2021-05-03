import React, { Component } from "react";
import { loadModules } from "esri-loader";
class Map extends Component {
  componentDidMount() {
    // this will lazy load the ArcGIS API
    // and then use Dojo's loader to require the classes
    loadModules([
      "esri/views/MapView",
      "esri/WebMap",
      "esri/widgets/Search",
      // "dojo/_base/connect",
      // "dojo/on",
    ])
      // https://community.esri.com/t5/arcgis-api-for-javascript/best-method-using-esri-loader-for-click-events/td-p/622926

      .then(([MapView, WebMap, Search]) => {
        // then we load a web map from an id
        var webmap = new WebMap({
          portalItem: {
            id: "884dd1c129b84c72a1db164c4fb85095",
            portal: {
              url: "https://portalideib.caib.es/portal",
            },
            // id: "aa1d3f80270146208328cf66d022e09c",
          },
          // id: "974c6641665a42bf8a57da08e607bb6f",
        });

        // and we show that map in a container w/ id #mapDiv
        var view = new MapView({
          map: webmap,
          container: "mapDiv",
        });

        view.on("click", function (event) {
          alert(
            "User clicked at " +
              event.screenPoint.x +
              ", " +
              event.screenPoint.y +
              " on the screen. The map coordinate at this point is " +
              event.mapPoint.x +
              ", " +
              event.mapPoint.y
          );
        });

        // ########## Search widget ##############
        // Add a pre-built search widget
        // locations and even addresses can be found using it.
        const search = new Search({ view });
        view.ui.add(search, "top-right");
      })
      .catch((err) => {
        // handle any errors
        console.error(err);
      });
    // }
  }
  render() {
    return <div id="mapDiv"></div>;
  }
}
export default Map;
