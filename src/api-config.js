let backendHost;
const apiVersion = 'v1';

const hostname = window && window.location && window.location.hostname;

if(hostname === 'heroku.com') {
  backendHost = 'shrouded-wave-69866.herokuapp.com';
} else {
  backendHost = 'localhost:3001';
}


export const API_ROOT = backendHost;
export const API_ROOT_WINDOW = backendHost;
