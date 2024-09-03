/* eslint-disable no-restricted-syntax */
import axios from 'axios';

const { REACT_APP_API_URL } = process.env;

export default class BaseService {
  /**
   * This is the basic get function
   * @param endpoint
   * @param query
   * @returns
   */
  static get(endpoint: string, query?: string, params?: any) {
    return axios.get(`${REACT_APP_API_URL}/${endpoint}${query}`, {
      withCredentials: true,
      params,
    });
  }

  // /**
  //  * axios decodes de url (%20 becomes ' ') when passing a params
  //  * object instead of passing the query in the url directly
  //  */
  // static getWithParams(endpoint: string, query?: string) {
  //   return axios.get(`${REACT_APP_API_URL}/${endpoint}`, {
  //     withCredentials: true,
  //     params: this.buildParamObjectFromQueryString(query),
  //   });
  // }

  // /**
  //  * Converts a query string into a parameter object. Ex.:
  //  * "?&$message_$like=%Teste Com%&$offset=0&$limit=10"
  //  * becomes
  //  * {
  //     "$message_$like":"%Teste C%",
  //     "$offset":"0",
  //     "$limit":"10"
  //  * }
  //  */
  // private static buildParamObjectFromQueryString(query?: string) {
  //   if (!query) return {};
  //   const params = query.substring(query.indexOf('$')).split('&');
  //   const paramsObject: any = {};
  //   for (const param of params) {
  //     const [paramName, paramValue] = param.split('=');
  //     paramsObject[paramName] = paramValue;
  //   }
  //   return paramsObject;
  // }

  /**
   * This is the basic post function
   * @param endpoint
   * @param body
   * @returns
   */
  static post(endpoint: string, body?: any) {
    return axios.post(`${REACT_APP_API_URL}/${endpoint}`, body, {
      withCredentials: true,
    });
  }

  /**
   * This is the basic put function
   * @param endpoint
   * @param body
   * @returns
   */
  static put(endpoint: string, body?: any) {
    return axios.put(`${REACT_APP_API_URL}/${endpoint}`, body, {
      withCredentials: true,
    });
  }

  /**
   * This is the basic delete function
   * @param endpoint
   * @returns
   */
  static delete(endpoint: string) {
    return axios.delete(`${REACT_APP_API_URL}/${endpoint}`, {
      withCredentials: true,
    });
  }
}
