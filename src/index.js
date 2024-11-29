import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Administrador from "./components/administrador";
import Editar from "./components/CRUD/editar";
import VerAudio from "./components/CRUD/verAudio";
import CrearAudio from "./components/CRUD/crearAudio"; 
import Interface from "./interface";
import Prueba from "./prueba";
import Login from "./components/login";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/styles.css";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/Proyecto/administrador" component={Administrador} />
        <Route exact path="/Proyecto/editar/:id" component={Editar} />
        <Route exact path="/Proyecto/verAudio/:id" component={VerAudio} />
        <Route exact path="/Proyecto/CrearAudio" component={CrearAudio} />
        <Route exact path="/Proyecto/Interface/:id" component={Interface} />
        <Route exact path="/Proyecto/Prueba" component={Prueba} />

        <Route path="*" render={() => <h1>RECURSO NO ENCONTRADO</h1>} />
      </Switch>
    </Router>
  );
};

export default App;
