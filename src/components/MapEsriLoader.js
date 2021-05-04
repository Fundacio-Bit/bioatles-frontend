import React, { Component } from "react";
import { loadModules } from "esri-loader";
class MapEsriLoader extends Component {
  componentDidMount() {
    // this will lazy load the ArcGIS API
    // and then use Dojo's loader to require the classes
    // use the esri-loader to load the Esri modules asynchronoulsy (AMD style)
    // this is an alternative to using imports like:
    // import MapView from "@esri/views/MapView"
    // some modules cannot be imported like shown in the line above, that's why we used the esri-loader

    // TODO: check if used modules require esri-loader and direct imports of @esri/
    // TODO: check also if this can prevent also using the esri loader: https://www.npmjs.com/package/arcgis-js-api
    // TODO: check also if the webpaack-plugin works in Create React App: https://developers.arcgis.com/javascript/latest/amd-build/
    loadModules([
      "esri/views/MapView",
      "esri/WebMap",
      "esri/widgets/Search",
      "esri/layers/FeatureLayer",
    ])
      // https://community.esri.com/t5/arcgis-api-for-javascript/best-method-using-esri-loader-for-click-events/td-p/622926

      .then(([MapView, WebMap, Search, FeatureLayer]) => {
        // then we load a web map from an id
        var webmap = new WebMap({
          portalItem: {
            id: "884dd1c129b84c72a1db164c4fb85095",
            portal: {
              url: "https://portalideib.caib.es/portal",
            },
          },
        });

        // and we show that map in a container w/ id #mapDiv
        var view = new MapView({
          map: webmap,
          container: "mapDiv",
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
export default MapEsriLoader;
