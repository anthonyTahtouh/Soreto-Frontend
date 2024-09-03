import BaseService from './BaseService';

export default class RankService extends BaseService {
  static getLastTrendingIndex(query: string) {
    return this.get('mp/rank/latestRank', query)
      .then(result => result.data)
      .catch(error => console.error(error));
  }
}
