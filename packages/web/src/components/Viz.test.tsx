import React from 'react';
import { mount } from 'enzyme';
import { Viz } from './Viz';
import { gitLogClient } from '../GitLogClient';


describe('A Viz Component', () => {
    const gcl = gitLogClient();

    xit('should attempt to load a GitLog', () => {
        gcl.getLog = jest.fn().mockResolvedValueOnce({});
        const component = mount(<Viz gitLogClient={gcl}/>);
        expect((gcl.getLog as any).mock).toBeTruthy();
        return expect((gcl.getLog as any).mock).toHaveBeenCalled();
    });
});