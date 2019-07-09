import { environment } from '../environments/environment';
const production_url = 'https://roomies-web-server.herokuapp.com/';
// test url
const dev_url = 'http://localhost:3333/api/';
export const API_URL = environment.production ? production_url : dev_url;
