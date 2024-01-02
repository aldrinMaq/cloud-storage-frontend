import axios from "axios";

const ngrokBaseUrl = 'https://80d9-103-180-201-156.ngrok-free.app';

const apiClient = axios.create({
    baseURL: ngrokBaseUrl,
});
