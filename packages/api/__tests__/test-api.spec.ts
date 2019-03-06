import axios from 'axios';

describe('api', () => {
    describe('get', () => {
        it('should return hello world!', () => {
            axios.get(`http://localhost:3000/`).then((r: any) => {
                return expect(r.data).toEqual('Hello World');
            })
        });
    });
})