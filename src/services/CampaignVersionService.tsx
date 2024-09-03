/* eslint-disable no-underscore-dangle */
import BaseService from './BaseService';

export default class CampaignVersionService extends BaseService {
  static getCampaignVersion(campaignVersion: any) {
    return this.get(`campaignVersion/`, campaignVersion)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static getCampaignVersionByCampaignId(query: string) {
    return this.get('campaignVersion/all', query)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static getCampaignVersions(query: string) {
    return this.get('campaignVersion/list', query)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }
}
