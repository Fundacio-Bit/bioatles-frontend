import React from "react";
import Keycloak from 'keycloak-js';
import axios from 'axios';

import MainContainer from "./components/MainContainer";

import "./App.css";

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { keycloak: null, authenticated: false, backendData: null };
  }

  componentDidMount = () => {
    console.log("process.env.REACT_APP_ROUTER_BASE: ", process.env.REACT_APP_ROUTER_BASE);
    const keycloak = Keycloak(process.env.REACT_APP_ROUTER_BASE + "/keycloak.json");

    keycloak.init({ onLoad: 'login-required', checkLoginIframe: false }).success(authenticated => {
      this.setState({ keycloak: keycloak, authenticated: authenticated });
      window.sessionStorage.setItem("token", keycloak.token);

    }).error(err => {
      alert("Error initializing KEYCLOAK " + err);
    });
  }

  decodeJWT = (token) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.stringify(JSON.parse(window.atob(base64)), null, 4);
  }

  fetchBackendData = () => {
    axios({
      method: "get",
      baseURL: "http://127.0.0.1:8080/",
      url: "serproes/api/services/regist/findRegistByEspeci/6986",
      headers:       
      { 
        'Authorization': ' Bearer ' + this.state.keycloak.token ,
      },
    })
      .then((response) => {
        console.log(
          "Response: ", response
        );
      })
      .catch((error) => {
        console.log("REST API error: ", error);
      });
  }

  render() {
    return (
      <>
        { this.state.authenticated ?
          <MainContainer></MainContainer>:
          <div class="alert">
            <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
            You are currently not logged in. Wait until you get redirected to Keycloak.
          </div>
        } 
      </>
    );
  }
}

export default App;
