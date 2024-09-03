import BaseService from './BaseService';

export default class ReportService extends BaseService {
  static getStatsV2(params: any) {
    return this.get('reports/v2/bi/stats', '', params)
      .then((result: any) => result.data.resultData)
      .catch(response => {
        throw response?.response;
      });
  }
}
