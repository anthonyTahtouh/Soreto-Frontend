/* eslint-disable no-underscore-dangle */
import BaseService from './BaseService';

const { REACT_APP_MAGGIE_BLOG_PREVIEW_URL } = process.env;

export default class BlogService extends BaseService {
  static getProductsSmall() {
    // return axios
    //   .get('assets/demo/data/products-small.json')
    //   .then(res => res.data.data);
  }

  static getBlogs(query: string) {
    return this.get('mp/blogs', query)
      .then(result => result.data)
      .catch(error => console.error(error));
  }

  static getBlog(blogId: any) {
    return this.get(`mp/blogs/${blogId}`, '')
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static createBlog(blog: any) {
    return this.post('mp/blogs', blog)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static saveBlog(blog: any) {
    return this.put(`mp/blogs/${blog._id}`, blog)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static async deleteBlog(blogID: string) {
    return this.delete(`mp/blogs/${blogID}`)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static async rankBlogs(blogId: string, startIndex: string, endIndex: string) {
    if (startIndex === endIndex) return false;
    const data = await this.put(`mp/blogs/${blogId}/rank`, {
      startIndex,
      endIndex,
    });
    return data;
  }

  static async viewBlog(blog: any) {
    window.open(
      `${REACT_APP_MAGGIE_BLOG_PREVIEW_URL}/the_edit_preview/${blog.urlId}`,
      '_blank',
    );
  }
}
