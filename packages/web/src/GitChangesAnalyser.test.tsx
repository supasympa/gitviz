import React from 'react';
import ReactDOM from 'react-dom';
import { GitChangesAnalyser } from './GitChangesAnalyser';
import changeLog from './git-changes-react.json'; 

describe('A GitChangesAnalyser Component', () => {
    it('should render without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<GitChangesAnalyser changeLog={changeLog} />, div);
        ReactDOM.unmountComponentAtNode(div);
    });
});