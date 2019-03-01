import { gitLogClient } from './GitLogClient';

import expectGitLog from '../../public/git-changes.json';

describe('A GitLogClient', () => {
    const gcl = gitLogClient();
    it('should load a git log', () => {
        return gcl.getLog().then((gitLog) => {
            expect(gitLog).toEqual(expectGitLog);
        })
    });
});