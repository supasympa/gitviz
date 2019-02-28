import { GitLogClient } from './GitLogClient';

import expectGitLog from '../../public/git-changes.json';

describe('A GitLogClient', () => {
    const gitLogClient = GitLogClient();
    it('should load a git log', () => {
        return gitLogClient.getLog().then((gitLog) => {
            expect(gitLog).toEqual(expectGitLog);
        })
    });
});