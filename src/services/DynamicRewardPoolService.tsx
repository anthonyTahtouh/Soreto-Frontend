import BaseService from './BaseService';

export default class DynamicRewardPoolService extends BaseService {
  static getRewardPoolsDynamic(query: string) {
    return this.get('rewardPoolDynamic', query)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static createDRP(drp: any) {
    return this.post(`rewardPoolDynamic`, drp)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static saveDRP(drp: any) {
    return this.put(`rewardPoolDynamic/${drp._id}`, drp)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static async deleteDRP(drpID: string) {
    return this.delete(`rewardPoolDynamic/${drpID}`)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static getDynamicRewardPoolsItems(drpId: string) {
    return this.get(`rewardPoolDynamic/${drpId}`, '')
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static saveDynamicRewardPoolsItem(drpItem: any) {
    return this.post(`rewardPoolDynamicItem`, drpItem)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static deleteDynamicRewardPoolsItem(drpItemId: any) {
    return this.delete(`rewardPoolDynamicItem/${drpItemId}`)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static updatetDynamicRewardPoolsItem(drpItemId: any, drpItem: any) {
    return this.put(`rewardPoolDynamicItem/${drpItemId}`, drpItem)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }
}
