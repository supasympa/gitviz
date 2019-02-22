import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { GitChangesAnalyser }  from './GitChangesAnalyser';
import gitChangeLog from './git-changes-react.json';


class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
          <h1>GitViz</h1>
        </header>
        <GitChangesAnalyser changeLog={gitChangeLog}/>
      </div>
    );
  }
}

export default App;
