#!/usr/bin/env node
const { resolve } = require('path');
const argv = require('yargs').argv;
const { saveFileChangeCounts } = require('./git');

// eslint-disable-next-line
console.log(argv);

const opts = {
    path: argv.path
        ? resolve(__dirname, argv.path)
        : resolve(__dirname, 'git-changes.json'),
    repoPath: argv.path
        ? resolve(__dirname, argv.repoPath)
        : resolve(__dirname),
    top: 100,
    number: 999999,
};

saveFileChangeCounts(opts.path, {
    repoPath: opts.repoPath,
    top: opts.top,
    number: opts.number,
});
