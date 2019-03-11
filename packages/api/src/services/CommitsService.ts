import axios from 'axios';

<<<<<<< HEAD
const CommitsService = (repoUrl: string) => {
    return ({
        commits: []
    })
};

export  { CommitsService as default, CommitsService };

function splitLinkHeader(repoUrl){
    const linkHeader = `<${repoUrl}?per_page=100&page=2>; rel="next", <${repoUrl}?per_page=100&page=108>; rel="last"`;
=======
const CommitsService = () => ({
    commits: []
});

export  { CommitsService as default, CommitsService };

function splitLinkHeader(){
    const linkHeader = '<https://api.github.com/repositories/10270250/commits?per_page=100&page=2>; rel="next", <https://api.github.com/repositories/10270250/commits?per_page=100&page=108>; rel="last"';
>>>>>>> c7010ab981bc8c1e5188aafe20bc12151ccab528

    return linkHeader.split(',').map(l => {
        return l.split(';');
    }).map(p => {
        return {
<<<<<<< HEAD
            index: p[0].replace(`<${repoUrl}/commits?per_page=100&`, '').replace('>', '').replace('page=', ''),
=======
            index: p[0].replace('<https://api.github.com/repositories/10270250/commits?per_page=100&', '').replace('>', '').replace('page=', ''),
>>>>>>> c7010ab981bc8c1e5188aafe20bc12151ccab528
            position: p[1].replace('rel="', '').replace('"', '').trim()
        };
    });
}

<<<<<<< HEAD
const REPO_URL = 'https://github.com/supasympa/gitviz';
console.log(splitLinkHeader(REPO_URL));

function commits(repoUrl: string){
    axios.get(`${repoUrl}?per_page=100`).then(r => {
=======

console.log(splitLinkHeader());

function commits(){
    axios.get('https://api.github.com/repos/facebook/react/commits?per_page=100').then(r => {
>>>>>>> c7010ab981bc8c1e5188aafe20bc12151ccab528
        const l = r.headers.link;
        console.log(l);
    }).catch(console.log)
}

// commits();