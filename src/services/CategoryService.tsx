/* eslint-disable no-underscore-dangle */
import BaseService from './BaseService';

export default class CategoryService extends BaseService {
  static getProductsSmall() {
    // return axios
    //   .get('assets/demo/data/products-small.json')
    //   .then(res => res.data.data);
  }

  static getCategories(query: string) {
    return this.get('mp/categories', query)
      .then(result => {
        return result.data;
      })
      .catch(error => console.error(error));
  }

  static createCategory(category: any) {
    return this.post(`mp/categories`, category)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static saveCategory(category: any) {
    return this.put(`mp/categories/${category._id}`, category)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static deleteCategory(category: any) {
    return this.delete(`mp/categories/${category._id}`)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static async rankCategories(
    startIndex: string,
    endIndex: string,
    field: string,
    categoryId: string,
  ) {
    const data = await this.put(`mp/categories/${categoryId}/rank/${field}`, {
      startIndex,
      endIndex,
    });
    return data;
  }
}
