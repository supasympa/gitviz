#!/usr/bin/env node
const gitlog = require('gitlog');

const log = o => {
    console.log(o);
    return o;
}

const getFileChangeCounts = (opts = { repoPath: __dirname }) => {
    const commitMap = gitlog({
        repo: opts.repoPath,
        number: opts.max || 1999999,
        fields: ['committerDate', 'committerDateRel'],
        execOptions: {
            maxBuffer: 99999 * 1024,
        },
    })
    .map((c) => c.files)
    .reduce((filesArray, files) => [...filesArray, ...files], [])
    .sort()
    .reduce(
        (a, i) =>
            (typeof a[i] === 'undefined'
                ? (a[i] = 1)
                : (a[i] = a[i] + 1)) && a, // eslint-disable-line
        {}
    );

    return Object.entries(commitMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, opts.top || 100)
        .reduce((a, i) => (a[i[0]] = i[1]) && a, {});
};

const { writeFileSync } = require('fs');
const defaultFileOpts = { encoding: 'utf-8' };
const saveFileChangeCounts = (filePath, gitFileChangeOptions) =>
    writeFileSync(
        filePath,
        JSON.stringify(getFileChangeCounts(gitFileChangeOptions), null, 4),
        defaultFileOpts
    );

module.exports.getFileChangeCounts = getFileChangeCounts;
module.exports.saveFileChangeCounts = saveFileChangeCounts;

/*
 // EXAMPLE: 
console.log(getFileChangeCounts({
    repoPath: require('path').resolve(__dirname, '../../react'),
    top: 1000
    })
);

saveFileChangeCounts(require("path").resolve(process.cwd(), "foobar.json"));
*/
