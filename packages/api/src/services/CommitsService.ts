import axios from 'axios';

const CommitsService = () => ({
    commits: []
});

export  { CommitsService as default, CommitsService };

function splitLinkHeader(){
    const linkHeader = '<https://api.github.com/repositories/10270250/commits?per_page=100&page=2>; rel="next", <https://api.github.com/repositories/10270250/commits?per_page=100&page=108>; rel="last"';

    return linkHeader.split(',').map(l => {
        return l.split(';');
    }).map(p => {
        return {
            index: p[0].replace('<https://api.github.com/repositories/10270250/commits?per_page=100&', '').replace('>', '').replace('page=', ''),
            position: p[1].replace('rel="', '').replace('"', '').trim()
        };
    });
}


console.log(splitLinkHeader());

function commits(){
    axios.get('https://api.github.com/repos/facebook/react/commits?per_page=100').then(r => {
        const l = r.headers.link;
        console.log(l);
    }).catch(console.log)
}

// commits();