import axios from "axios";

const ngrokBaseUrl = 'https://ccf9-103-180-201-155.ngrok-free.app';

const apiClient = axios.create({
    baseURL: ngrokBaseUrl,
});

export default apiClient;