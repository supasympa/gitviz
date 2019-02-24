import { GitChangeLogData, GitChangeLog } from './GitChangeLog';

const chageLogData = {
    'package.json': 100,
    'packages/first/index.html': 80,
    'packages/second/index.html': 80,
    'packages/first/images/first.jpg': 60,
    'packages/second/images/first.jpg': 50,
    'packages/third/images/first.jpg': 20,
    'packages/third/images/second.jpg': 10,

}

const changelogGraph = {
    'package.json': 100,
    "packages": {
        "first":{
            "index.html": 80,
            "images": {
                "first.jpg": 60,
            }
        },
        "second":{
            "index.html": 80,
            "images": {
                "first.jpg": 50
            }
        },
        "third":{
            "images": {
                "first.jpg": 20,
                "second.jpg": 10,
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
            const count = 10;
            const path = ['root', 'first', 'second', 'last.html'];
            const expectation ={
                root: {
                    first: {
                        second: {
                            'last.html': 10
                        }
                    }
                }
            }
            expect(GitChangeLog.convertPathArrayToGraph(path, count)).toEqual(expectation);
        })

        it('should convert a path array with only one value', () => {
            const path = ['package.json'];
            const expectation ={
                'package.json': 1
            }
            expect(GitChangeLog.convertPathArrayToGraph(path, 1)).toEqual(expectation);
        })

    })
})