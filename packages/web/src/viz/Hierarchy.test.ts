
import { Hierarchy } from './Hierarchy';

const folderOnly = {
    parent: { data: { name: 'root'} },
    data: { name: 'folder' }
}

const file = {
    parent: {
        parent: { data: { name: 'root'} },
        data: { name: 'folder' }
    },
    data: { name: 'file.html' }
}

const root = {
     data: { name: 'root'},
}


describe('Hierarchy(h)', () => {
    describe('toBreadcrumb()', () => {
        it('should transform correctly with a second level folder', () => {
            expect(Hierarchy(folderOnly).toBreadcrumb()).toEqual(['root', 'folder']);
        });

        it('should transform correctly with a file', () => {
            expect(Hierarchy(file).toBreadcrumb()).toEqual(['root', 'folder', 'file.html']);
        });

        it('should transform correctly with root', () => {
            expect(Hierarchy(root).toBreadcrumb()).toEqual(['root']);
        })
    });
});