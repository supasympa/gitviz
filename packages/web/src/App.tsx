import React, { Component } from 'react';
import logo from './logo.svg';
import gitChangeLog from './git-changes-react.json';

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

import changeLog from './git-changes-react.json'
import { Viz } from './viz';


class App extends Component {
  render() {
    return (
      <div className="App container-fluid">
        <div className="row">
          <div className="col-12">
            <header>
              <div className="bd-brand-logos">
                <div className="bd-brand-item">
                  <img src="/logos/logo_transparent.png" className="logo"/>
                </div>
              </div>
            </header>
            <Viz data={changeLog} />     
          </div> 
        </div>
      </div>
    );
  }
}

export default App;
