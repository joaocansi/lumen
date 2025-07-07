import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '30s', target: 50 },
    { duration: '30s', target: 100 },
    { duration: '45s', target: 200 },
    { duration: '1m', target: 400 },
    { duration: '1m', target: 600 },
    { duration: '45s', target: 200 },
    { duration: '30s', target: 50 },
    { duration: '30s', target: 0 }
  ],
};

const image = open('./resources/image.jpg', 'b');
const url = 'http://localhost:3000';

export function setup() {
    const data = http.post('http://localhost:3000/api/auth/sign-in/email', {
        password: 'mariaSecure2025!',
        email: 'maria.lima@example.com'
    });
    const token = data.headers['Set-Auth-Token'];
    return { token }
}
export default function (data) {
    http.asyncRequest('GET', url + '/api/photo/user/mamaefalei?limit=15&offset=0', {
        headers: {
            'Authorization': `Bearer ${data.token}`,
        }
    });
    sleep(1);
}

