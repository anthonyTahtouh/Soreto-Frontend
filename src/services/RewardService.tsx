/* eslint-disable no-underscore-dangle */
import BaseService from './BaseService';

export default class RewardService extends BaseService {
  static getRewards(clientId: string | undefined) {
    return this.get('reward/page?clientId=', clientId)
      .then(result => {
        return result.data;
      })
      .catch(error => console.error(error));
  }
}
