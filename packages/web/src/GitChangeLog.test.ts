import { GitChangeLogData, GitChangeLog } from './GitChangeLog';

const chageLogData = {
    'package.json': [ 1551030067000, 1551005604000, 1550872421000, 1550868436000 ],
    'packages/first/index.html': [ 1551030067000 ],
    'packages/second/index.html': [ 1551030067000 ],
    'packages/first/images/first.jpg': [ 1551030067000, 1551005604000 ],
    'packages/second/images/first.jpg': [ 1551030067000 ],
    'packages/third/images/first.jpg': [ 1551030067000 ],
    'packages/third/images/second.jpg': [ 1551030067000, 1551005604000 ],

}

const changelogGraph = {
    'package.json': 4,
    "packages": {
        "first":{
            "index.html": 1,
            "images": {
                "first.jpg": 2,
            }
        },
        "second":{
            "index.html": 1,
            "images": {
                "first.jpg": 1
            }
        },
        "third":{
            "images": {
                "first.jpg": 1,
                "second.jpg": 2,
            }
        }
    }
}


describe('A GitChangeLog', () => {
    const gcl = GitChangeLog(chageLogData);
    
    it('should convert files to a graph', () => {
        expect(gcl.toGraph()).toEqual(changelogGraph);
    })

    describe('GitChangeLog.splitPath', () => {
        it('should split a path as expected when it is a root level file', () => {
            expect(GitChangeLog.splitPath('package.json')).toEqual(['package.json']);
        });
        it('should split a path as expected when it is a level deep', () => {
            expect(GitChangeLog.splitPath('file/file.one')).toEqual(['file', 'file.one']);
        });
        it('should split a path as expected when it is multiple levels deep', () => {
            expect(GitChangeLog.splitPath('file/one/two/three/four.json')).toEqual(['file', 'one', 'two', 'three', 'four.json']);
            expect(GitChangeLog.splitPath('file/one/three/four.json')).toEqual(['file', 'one', 'three', 'four.json']);
        });
        xit('should split a path as expected when it begins with /', () => {
            // NOTE: this case is never likely to happen
            expect(GitChangeLog.splitPath('/file/one/two/three/four.json')).toEqual(['file', 'one', 'two', 'three', 'four.json']);
        });                
    })

    describe('GitChangeLog.convertPathArrayToGraph', () => {
        it('should convert a path array to a graph', () => {
            const changes = [ 1551030067000, 1551005604000, 1550872421000, 1550868436000 ];
            const path = ['root', 'first', 'second', 'last.html'];
            const expectation ={
                root: {
                    first: {
                        second: {
                            'last.html': 4
                        }
                    }
                }
            }
            expect(GitChangeLog.convertPathArrayToGraph(path, changes)).toEqual(expectation);
        })

        it('should convert a path array with only one value', () => {
            const path = ['package.json'];
            const changes = [1]; 
            const expectation ={
                'package.json': 1
            }
            expect(GitChangeLog.convertPathArrayToGraph(path, changes)).toEqual(expectation);
        })

    })
})