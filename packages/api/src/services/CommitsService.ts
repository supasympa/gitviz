import axios from 'axios';

const CommitsService = (repoUrl: string) => {
    return ({
        commits: []
    })
};

export  { CommitsService as default, CommitsService };

function splitLinkHeader(repoUrl){
    const linkHeader = `<${repoUrl}?per_page=100&page=2>; rel="next", <${repoUrl}?per_page=100&page=108>; rel="last"`;

    return linkHeader.split(',').map(l => {
        return l.split(';');
    }).map(p => {
        return {
            index: p[0].replace(`<${repoUrl}/commits?per_page=100&`, '').replace('>', '').replace('page=', ''),
            position: p[1].replace('rel="', '').replace('"', '').trim()
        };
    });
}

const REPO_URL = 'https://github.com/supasympa/gitviz';
console.log(splitLinkHeader(REPO_URL));

function commits(repoUrl: string){
    axios.get(`${repoUrl}?per_page=100`).then(r => {
        const l = r.headers.link;
        console.log(l);
    }).catch(console.log)
}

// commits();