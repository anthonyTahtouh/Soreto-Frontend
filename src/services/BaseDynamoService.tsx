import BaseService from './BaseService';

export default class BaseDynamoService extends BaseService {
  /**
   * This is the basic get function
   * @param endpoint
   * @returns
   */
  static async getAll(params?: any) {
    return this.get('reports/tracking/usersAccess', params)
      .then(result => result.data)
      .catch(error => console.error(error));
  }
}
