import axios from "axios";

const API_URL = "/api/products"; // proxy set in package.json will forward to http://localhost:8080

class ProductService {
  getAllProducts() {
    return axios.get(API_URL);
  }
  getProductById(id) {
    return axios.get(`${API_URL}/${id}`);
  }
  createProduct(product) {
    return axios.post(`${API_URL}/register`, product);
  }
  updateProduct(id, product) {
    return axios.put(`${API_URL}/${id}`, product);
  }
  deleteProduct(id) {
    return axios.delete(`${API_URL}/${id}`);
  }
}

export default new ProductService();
