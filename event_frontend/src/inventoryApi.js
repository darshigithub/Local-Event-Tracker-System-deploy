import axios from "axios";

const inventoryApi = axios.create({
  baseURL: "http://localhost:5001/api/inventory",
});

export default inventoryApi;