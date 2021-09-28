import axios from 'axios';

export const api = axios.create({ baseURL: "http://194.163.165.84:3000", headers: { "Access-Control-Allow-Origin": "*" } });