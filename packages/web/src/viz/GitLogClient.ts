import gitLog from '../../public/git-changes.json'; // HACK: fetch this

export const GitLogClient = () => {
    return {
        getLog: () => {
            // HACK: temporary solution
            return Promise.resolve(gitLog);
        }
    }
} 