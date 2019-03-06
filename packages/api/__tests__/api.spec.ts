import axios from 'axios';

const BASE_URL = `http://localhost:3000`;
const url = (path) => `${BASE_URL}${path}`;

describe('api', () => {
    describe('get', () => {
        it('should respond with 204 for /status', () => {
            return axios.get(url('/status')).then((r: any) => {
                expect(r.status).toEqual(200);
                expect(r.data).toEqual({
                    status: 'ok'
                });
            })
        });

        it('/commits should respond with 200 and a json object, with a commits property', () => {
            return axios.get(url('/commits'))
                .then((r: any) => {
                    expect(r.status).toEqual(200);
                    expect(r.data).toHaveProperty('commits');
                })
        });
    });
})