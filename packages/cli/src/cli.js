#!/usr/bin/env node
const { resolve } = require('path');
const yargs = require('yargs');
const { saveFileChangeCounts } = require('./git');

const { argv } = yargs
    .option('path', {
        alias: 'p',
        describe: 'Provide the filepath, where the changes map should be written (defaults to ./git-changes.json).'
    })
    .option('repoPath', {
        alias: 'r',
        describe: 'Provide the filepath where the repo to analyse is (defaults to the working directory).'
    })
    .option('top', {
        alias: 't',
        describe: 'The number of entries to return (defaults to 100)'
    })
    .help();

const opts = {
    path: argv.path
        ? resolve(process.cwd(), argv.path)
        : resolve(process.cwd(), 'git-changes.json'),
    repoPath: argv.repoPath
        ? resolve(process.cwd(), argv.repoPath)
        : resolve(process.cwd()),
    max: argv.max || 999999,
    top: argv.top || 100,
};
console.log(opts);
saveFileChangeCounts(opts.path, {
    repoPath: opts.repoPath,
    max: opts.max,
    top: opts.top
});

