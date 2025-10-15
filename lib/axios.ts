import axios from "axios";
 
const instance = axios.create({
  baseURL: "http://159.138.107.65:8093/api/",
  // baseURL: "http://52.230.97.224:5000/api",
  // baseURL: "https://dmshrismobile.hayleys.org:8092/api",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json"
  },
 
});
 
export default instance;