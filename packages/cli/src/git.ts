#!/usr/bin/env node
const gitlog = require('gitlog');

const log = (o: any) => {
    console.log(o);
    return o;
};

const dedupe = (acc: any, item: any) =>
    acc.includes(item) ? acc : acc.push(item) && acc;

const getChangesForLogAsGraph = (gitLog: any) => {
    return gitLog.reduce((acc: any, item: any) => {
        item.files.forEach((file: string) => {
            acc[file]
                ? acc[file].push(new Date(item.committerDate).getTime())
                : (acc[file] = [new Date(item.committerDate).getTime()]);
        });
        return acc;
    }, {});    
}   

const getChangesForLogAsArray = (gitLog: any) => Object.entries(getChangesForLogAsGraph(gitLog));

const getChanges = (opts: any = { repoPath: __dirname }) => {
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
const _saveFileChangeCounts = (filePath: string, gitFileChangeOptions: any) =>
    writeFileSync(
        filePath,
        JSON.stringify(getChanges(gitFileChangeOptions), null, 4),
        defaultFileOpts
    );

module.exports.getChangesForLogAsGraph = getChangesForLogAsGraph;
module.exports.getChanges = getChanges;
module.exports.saveFileChangeCounts = _saveFileChangeCounts;

// ref: https://github.com/domharrington/node-gitlog
