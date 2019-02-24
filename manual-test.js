require('./packages/cli/src/git').getChanges({
    repoPath: require('path').resolve(process.cwd(), './')
});
