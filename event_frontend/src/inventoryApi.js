import axios from "axios";

const inventoryApi = axios.create({
  baseURL: "http://localhost:8082/api/inventory",
});

export default inventoryApi;