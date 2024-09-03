import BaseService from './BaseService';

export default class SupportService extends BaseService {
  static async getUserTrackingFlow(email: string) {
    const query = `?email=${email}`;
    return this.get('support/usertrackingflow', query);
  }

  static getOrderTrackingFlow(clientOrderId: string, source: string) {
    const query = `?clientOrderId=${clientOrderId}&source=${source}`;
    return this.get('support/ordertrackingflow', query);
  }

  static async getOrderPostReward(query: string) {
    return this.get('postreward/report', query);
  }
}
