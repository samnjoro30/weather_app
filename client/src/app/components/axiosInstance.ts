const axios = require('axios');

const token = sessionStorage.getItem('userToken');

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    headers: {
        Authorization : `Bearer${token}`,
    }
});

export default axiosInstance;