import * as React from 'react';
import { shallow } from 'enzyme';
import { Breadcrumb } from './Breadcrumb';

describe('A Viz Component', () => {
    it('should render the expected result, given an object that has root selected', () => {
        const filePath = ['root'];
        const component = shallow(<Breadcrumb path={filePath} />);
        console.log(component.html());
        expect(component.html()).toEqual(
            '<ol class="breadcrumb"><li class="path_1 breadcrumb-item"><a href="#">root</a></li></ol>'
        );
    });

    it('should render the expected result, given an object that has a folder selected', () => {
        const filePath = ['root', 'folder'];
        const component = shallow(<Breadcrumb path={filePath} />);
        expect(component.html()).toEqual(
            '<ol class="breadcrumb"><li class="path_1 breadcrumb-item"><a href="#">root</a></li><li class="path_2 breadcrumb-item"><a href="#">folder</a></li></ol>'
        );
    });

    it('should render the expected result, given an object that has a different folder selected', () => {
        const filePath = ['root', 'folder', 'subfolder'];
        const component = shallow(<Breadcrumb path={filePath} />);
        expect(component.contains(<li className="path_1 breadcrumb-item"><a href="#">root</a></li>)).toBeTruthy();
        expect(component.contains(<li className="path_2 breadcrumb-item"><a href="#">folder</a></li>)).toBeTruthy();
        expect(component.contains(<li className="path_3 breadcrumb-item"><a href="#">subfolder</a></li>)).toBeTruthy();
    });

    it('should render the expected result, given an object that has a file selected', () => {
        const filePath = ['root', 'folder', 'subfolder', 'file'];
        const component = shallow(<Breadcrumb path={filePath} />);
        expect(
            component.contains(
                <ol className="breadcrumb">
                    <li className="path_1 breadcrumb-item"><a href="#">root</a></li>
                    <li className="path_2 breadcrumb-item"><a href="#">folder</a></li>
                    <li className="path_3 breadcrumb-item"><a href="#">subfolder</a></li>
                    <li className="path_4 breadcrumb-item"><a href="#">file</a></li>
                </ol>
            )
        ).toEqual(true);
    });
});
