// export const API_URL = 'http://localhost:3000/';
import { environment } from '../environments/environment';
const production_url = 'https://roomies-web-server.herokuapp.com/';
const dev_url = 'http://localhost:3333/';
export const API_URL = environment.production ? production_url : dev_url;
