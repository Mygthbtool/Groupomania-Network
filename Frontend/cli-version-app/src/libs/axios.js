import axios from 'axios';

// axios.defaults.baseURL = 'http://localhost:3000/api/';
const instance = axios.create({
    baseURL: 'http://localhost:3000/api/'
  });

export default instance;

