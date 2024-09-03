import axios from 'axios';

export default class ProductService {
  static getProductsSmall() {
    return axios
      .get('assets/demo/data/products-small.json')
      .then(res => res.data.data);
  }

  static getProducts() {
    return axios
      .get('assets/demo/data/products.json')
      .then(res => res.data.data);
  }

  static getProductsWithOrdersSmall() {
    return axios
      .get('assets/demo/data/products-orders-small.json')
      .then(res => res.data.data);
  }
}
