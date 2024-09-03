/* eslint-disable no-underscore-dangle */
import BaseService from './BaseService';

export default class FlashCampaignService extends BaseService {
  static getFlashCampaigns(query: string) {
    return this.get('mp/flashCampaigns', query)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static createFlashCampaign(flashCampaign: any) {
    return this.post(`mp/flashCampaign`, flashCampaign)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static saveFlashCampaign(flashCampaign: any) {
    return this.put(`mp/flashCampaign/${flashCampaign._id}`, flashCampaign)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static deleteFlashCampaign(flashCampaign: any) {
    return this.delete(`mp/flashCampaign/${flashCampaign._id}`)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static getFlashCampaignById(flashCampaignId: string) {
    return this.get('mp/flashCampaign/', flashCampaignId)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }
}
