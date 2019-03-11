#!/usr/bin/env node
const gitlog = require('gitlog');

const log = (o) => {
    console.log(o);
    return o;
};

const dedupe = (acc, item) =>
    acc.includes(item) ? acc : acc.push(item) && acc;

const getChangesForLogAsGraph = (gitLog) => {
    return gitLog.reduce((acc, item) => {
        item.files.forEach((file) => {
            acc[file]
                ? acc[file].push(new Date(item.committerDate).getTime())
                : (acc[file] = [new Date(item.committerDate).getTime()]);
        });
        return acc;
    }, {});    
}   

const getChangesForLogAsArray = (gitLog) => Object.entries(getChangesForLogAsGraph(gitLog));

const getChanges = (opts = { repoPath: __dirname }) => {
    const log = gitlog({
        repo: opts.repoPath,
        number: opts.max || 1999999,
        fields: ['committerDate', 'committerDateRel'],
        execOptions: {
            maxBuffer: 99999 * 1024,
        },
    })

    return opts.asArray ? 
        getChangesForLogAsArray(log): 
        getChangesForLogAsGraph(log);
};

const { writeFileSync } = require('fs');
const defaultFileOpts = { encoding: 'utf-8' };
const saveFileChangeCounts = (filePath, gitFileChangeOptions) =>
    writeFileSync(
        filePath,
        JSON.stringify(getChanges(gitFileChangeOptions), null, 4),
        defaultFileOpts
    );

module.exports.getChangesForLogAsGraph = getChangesForLogAsGraph;
module.exports.getChanges = getChanges;
module.exports.saveFileChangeCounts = saveFileChangeCounts;

// ref: https://github.com/domharrington/node-gitlog
