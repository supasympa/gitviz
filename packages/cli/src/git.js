#!/usr/bin/env node
const gitlog = require('gitlog');
const deepMerge = require('deepmerge');

const log = o => {
    console.log(o);
    return o;
}

const dedupe = (acc, item) => (
    (acc.includes(item) ? 
        acc : 
        (acc.push(item)) && acc
    )
)

const getChanges = (opts = { repoPath: __dirname } ) => {
    // TODO: Add some tests!
    const commitMap = gitlog({
        repo: opts.repoPath,
        number: opts.max || 1999999,
        fields: ['committerDate', 'committerDateRel'],
        execOptions: {
            maxBuffer: 99999 * 1024,
        },
    })
    .map((item) => {
        // add a short date
        const monthName = item.committerDate.substring(4, 7); 
        const day = item.committerDate.substring(8, 10); 
        const year = item.committerDate.substring(20, 24);
        const months = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' }
        const shortDate = `${day}-${months[monthName]}-${year}`;
        return {
            ...item,
            ...{shortDate}
        }
    })
    .map((item) => {
        return {
            shortDate: item.shortDate,
            files: item.files            
        }
    })
    .map(log)
    .reduce((acc, item) => {
        return [{
            ...acc[0],
            ...{
                [item.shortDate]: item.files.concat(acc[0].files|| []).reduce(dedupe, [])            
            }
        }];
    }, [{}])
    .map(log)
    
    return commitMap;
};

const getFileChangeCounts = (opts = { repoPath: __dirname }) => {
    // TODO: Add some tests!
    const commitMap = gitlog({
        repo: opts.repoPath,
        number: opts.max || 1999999,
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

module.exports.getChanges = getChanges;
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


// ref: https://github.com/domharrington/node-gitlog