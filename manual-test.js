console.log(
        require('./packages/cli/src/git').getChanges({
            repoPath: require('path').resolve(process.cwd(), '.'),
            asArray: false
        })
    // .sort((a, b) => b[1].length - a[1].length)
    // .reduce((acc, changeFrequency) => ({...acc, ...{ [changeFrequency[0]]: changeFrequency[1] }}) ,{})
);
