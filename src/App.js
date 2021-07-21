import React, { Component } from 'react';
import Keycloak from 'keycloak-js';

import MainContainer from './components/MainContainer';

import "./App.css";

export default class App extends Component {

    constructor(props) {
      super(props);
      this.state = { keycloak: null, authenticated: false, backendData: null };
    }

    componentDidMount = () => {
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

    render() {
      return (
        <>
          { this.state.authenticated ?
            <MainContainer></MainContainer>:
            <div className="alert">
              <span className="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>
              You are currently not logged in. Wait until you get redirected to Keycloak.
            </div>
          } 
        </>
      );
    }
  }
