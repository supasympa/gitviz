import { gitLogClient } from './GitLogClient';

import expectGitLog from '../public/git-changes.json';

describe('A GitLogClient', () => {
    const gcl = gitLogClient();
    it('should load a git log', () => {
        const _f = (global as any).fetch;
        (global as any).fetch = jest.fn(() => Promise.resolve({ json: () => expectGitLog }));

        return gcl.getLog().then((gitLog) => {
           expect(gitLog).toEqual(expectGitLog);
           (global as any).fetch = _f;
        })
    });
});