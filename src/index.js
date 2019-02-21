const gitlog = require('gitlog');

const changesToFiles = (opts = { repoPath: __dirname }) => {
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

/*
 // EXAMPLE: 

console.log(changesToFiles({
    repoPath: resolve(__dirname, '../../react'),
    top: 10
    })
);
*/

module.exports = changesToFiles;
