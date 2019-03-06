import axios from 'axios';

const host = (BASE_URL: string) => (path) => `${BASE_URL}${path}`;
const url = host(`http://localhost:3000`);

describe('api', () => {
    beforeAll(() => {
        
    });

    describe('/status', () => {
        it('should respond with 204 for /status', () => {
            return axios.get(url('/status')).then((r: any) => {
                expect(r.status).toEqual(200);
                expect(r.data).toEqual({
                    status: 'ok'
                });
            })
        });
    });

    describe('/commits', () => {
        it('should respond with 200 and contain a commits property', () => {
            return axios.get(url('/commits'))
                .then((r: any) => {
                    expect(r.status).toEqual(200);
                    expect(r.headers['Content-Type']).toEqual('application/json');
                    expect(r.data).toHaveProperty('commits');
                })
        });
    });
    
})