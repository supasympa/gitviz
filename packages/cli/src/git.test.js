const git = require('./git');

const gitLog = [{ 
    status: [ 'M', 'A', 'M', 'M', 'M', 'A' ],
    files: 
    [ '.gitignore',
    'manual-test.js',
    'package.json',
    'packages/cli/package.json',
    'packages/cli/src/git.js',
    'packages/cli/yarn.lock' ],
    committerDate: 'Sat Feb 23 10:53:24 2019 +0000',
    committerDateRel: '5 hours ago',
    shortDate: '24-02-2019' 
    },
    { status: [ 'M' ],
    files: [ 'packages/cli/src/git.js' ],
    committerDate: 'Sun Feb 24 08:59:34 2019 +0000',
    committerDateRel: '7 hours ago',
    shortDate: '24-02-2019' },
    { status: [ 'M', 'M' ],
    files: 
    [ 'packages/web/src/viz/index.tsx',
    'packages/web/src/viz/viz.css' ],
    committerDate: 'Mon Feb 25 08:55:19 2019 +0000',
    committerDateRel: '7 hours ago',
    shortDate: '24-02-2019' 
    }
];

describe('git.changesForLog', () => {
    it('should work', () => {
        const expectation = {
            '.gitignore': [1550919204000],
            'manual-test.js': [ 1550919204000 ],
            'package.json': [ 1550919204000 ],
            'packages/cli/package.json': [ 1550919204000 ],
            'packages/cli/src/git.js': [ 1550919204000, 1550998774000 ],
            'packages/cli/yarn.lock': [ 1550919204000 ],
            'packages/web/src/viz/index.tsx': [ 1551084919000 ],
            'packages/web/src/viz/viz.css': [ 1551084919000 ]
        };
        const changes = git.getChangesForLog(gitLog);
        expect(changes).toStrictEqual(expectation);
    })
});