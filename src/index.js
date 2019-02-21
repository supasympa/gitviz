#!/usr/bin/env node
const gitlog = require('gitlog');

const getFileChangeCount = (opts = { repoPath: __dirname }) => {
    const commitMap = gitlog({
        repo: opts.repoPath, 
        number: opts.max || 1999999,
        execOptions: {
            maxBuffer: 99999 * 1024
        }
    }).map(c => c.files)
        .reduce( (filesArray, files) => ([...filesArray, ...files]), [])
        .sort()
        .reduce((a, i) =>(( typeof a[i] === 'undefined' ? (a[i] = 1) : (a[i] = a[i] + 1) ) && a ), {});

    return Object.keys(commitMap)
        .map(k => ([k, commitMap[k]]))
        .sort((a, b) => (b[1] - a[1]))
        .slice(0, opts.top || 100)
        .reduce((a, i) => ((a[i[0]] = i[1]) && a), {});
};

const { writeFileSync } = require('fs');
const defaultFileOpts = { encoding: 'utf-8' };
const saveFileChanges = (filePath, gitFileChangeOptions) => writeFileSync(
    filePath, JSON.stringify(
        getFileChangeCount(gitFileChangeOptions), 
        null, 
        4
        ), defaultFileOpts
    );

module.exports.getFileChangeCount = getFileChangeCount;
module.exports.saveFileChanges = saveFileChanges;

/*
 // EXAMPLE: 

console.log(getFileChangeCount({
    repoPath: resolve(__dirname, '../../react'),
    top: 10
    })
);

saveFileChanges(require("path").resolve(process.cwd(), "foobar.json"));
*/