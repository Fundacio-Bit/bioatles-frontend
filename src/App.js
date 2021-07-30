import React, { useState, useEffect } from "react";
import Keycloak from 'keycloak-js';

import { Result, Button } from 'antd';

import MainContainer from './components/MainContainer';

import "./App.css";

const App = () => {

  // ###### STATES AND HANDLERS  #####
  const [keycloak, setKeycloak] = useState(null);
  const [authenticated, setAuthenticated] = useState(null);
  
  useEffect(() => {
    const keycloak = Keycloak(process.env.REACT_APP_ROUTER_BASE + "/keycloak.json");
    keycloak.init({ onLoad: 'login-required', checkLoginIframe: false }).then(authenticated => {
      setKeycloak(keycloak);
      if (keycloak.realmAccess.roles.includes("SER_ADMIN")) {
        setAuthenticated(authenticated);
        console.log("username: " + keycloak.realmAccess.roles);
        // console.log("keycloak: " + JSON.stringify(keycloak));
        window.sessionStorage.setItem("token", keycloak.token);
      }
    }).catch(err => {
      alert("Error initializing KEYCLOAK " + err);
    });
    return () => null;
  }, []);

  const decodeJWT = (token) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.stringify(JSON.parse(window.atob(base64)), null, 4);
  }

  const logoutHandler = () => {
      keycloak.logout();
    }

  return (
    <>
      { authenticated && keycloak?
        <MainContainer logoutHandler={logoutHandler} username={keycloak.idTokenParsed.preferred_username}></MainContainer>
      :
      <Result
        status="warning"
        title="No s'ha pogut autenticar. Vosté no té privilegis per  accedir a l'admin de BIOATLES."
        extra={
          <Button type="primary" onClick={logoutHandler}>
            Tornar a formulari d'autenticació
          </Button>
        }
      />
      } 
    </>
  );
}

export default App;

