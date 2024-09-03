/* eslint-disable no-underscore-dangle */
import moment from 'moment';
import BaseService from './BaseService';

interface IResquest {
  clientId: string | undefined;
  typeCampaign: string | undefined;
}

export default class CampaignService extends BaseService {
  static getCampaign(query: IResquest) {
    let typeCampaign;
    if (query.typeCampaign) {
      typeCampaign = `&type_$=${query.typeCampaign}`;
    } else {
      typeCampaign = '';
    }

    const date = moment().format('YYYY-MM-DD');
    return this.get(
      `campaign/list?$sort=description&$relatedOffers_$null&clientId_$=${query.clientId}${typeCampaign}`,
      '',
    )
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static getCampaignById(query: string) {
    return this.get('campaign/', query)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }
}
