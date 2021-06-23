import React, { useEffect } from 'react';
import Mapa from './components/Mapa';
import AddPoint from './components/AddPoint'
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import './App.css'

export default function App() {
    

  const getPosition = async () =>{
      navigator.geolocation.getCurrentPosition(function(position) {
          localStorage.setItem("latitude", position.coords.latitude);
          localStorage.setItem("longitude", position.coords.longitude);
        });  
  }

  useEffect(() =>{
    getPosition();

  })

  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Mapa} />
          <Route exact path="/addPoint" component={AddPoint} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}