import React, { Component } from 'react';
import './App.css';

import { gitLogClient } from './GitLogClient';
import { Viz } from './components';


class App extends Component {
  render() {
    return (
      <div className="App container-fluid">
        <div className="row">
          <div className="col-12">
            <header style={{ position: 'absolute', top: '0px'}}>
              <div className="bd-brand-logos">
                <div className="bd-brand-item">
                  <img src="/logos/logo_transparent.png" className="logo"/>
                </div>
              </div>
            </header>
            <Viz gitLogClient={gitLogClient()}/>     
          </div> 
        </div>
      </div>
    );
  }
}

export default App;
