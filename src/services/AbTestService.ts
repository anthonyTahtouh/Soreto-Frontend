import BaseService from './BaseService';

export default class AbTestService extends BaseService {
  static getAbTest(id: string): Promise<any> {
    return this.get(`abTest/${id}`, '')
      .then(result => result.data?.resultData)
      .catch(response => {
        throw response?.response;
      });
  }

  static getAbTests(query: string) {
    return this.get('abTest', query)
      .then(result => result.data)
      .catch(response => {
        throw response?.response;
      });
  }

  static createAbTest(abTest: any): Promise<any> {
    return this.post(`abTest`, abTest);
  }

  static updateAbTest(id: string, abTest: any): Promise<any> {
    return this.put(`abTest/${id}`, abTest);
  }

  static deleteAbTest(id: string): Promise<any> {
    return this.delete(`abTest/${id}`)
      .then(result => result)
      .catch(response => {
        throw response?.response;
      });
  }
}
