# Bioatles frontend

Bioatles is a tool used by the Servei de Protecció d'Espècies del Govern de les Illes Balears for management tasks.
There exists an [old version](http://bioatles.caib.es/) already active.

We aim to develop a modern tool to substitute the old one. We will focus on improving usability and adding new capabilities.

The initial commit was a [Create React App](https://github.com/facebook/create-react-app) project.
Next commits are our own developments.

## Current development goals

Proof of concept: integration of Bioatles GIS layers in a React Component using the ArcGis API for JavaScript.

## Requisites, installation and execution

You only need [NodeJS](https://nodejs.dev/) to execute this app on a local server.

Add a file called ".env" in your project root and add the following variable: *REACT_APP_ROUTER_BASE*

To deploy in JBoss: *REACT_APP_ROUTER_BASE*=/serproes-front

To npm run start: *REACT_APP_ROUTER_BASE*=



Once installed open a console, go to the project folder and run:

```
npm install
```

Once finished the installation of all packages type:

```
npm start
```

This command will run the app in the development mode.
You can open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make code edits.
You will also see any lint errors in the console.

## Documentation

[Keycloak Javascript Adapter](https://github.com/keycloak/keycloak-documentation/blob/master/securing_apps/topics/oidc/javascript-adapter.adoc     )

