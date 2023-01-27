import axios from "axios";

class ApiService {
    constructor() {
        this.client = axios.create({
            baseURL: API_URL,
        });
    }

    post(endpoint, data) {
        return this.client.post(endpoint, data);
    }

    get(endpoint) {
        return this.client.get(endpoint);
    }
}

export default new ApiService();
