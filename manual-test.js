console.log(
    Object.entries(
        require('./packages/cli/src/git').getChanges({
            repoPath: require('path').resolve(process.cwd(), '../react')
        })
    ).sort((a, b) => (b[1].length - a[1].length)) 
    .slice(0, 10)   
);
