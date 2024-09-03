import BaseService from './BaseService';

export default class TrackingService extends BaseService {
  static async getTrackingFlow(
    utmCampaign?: string,
    action?: string,
    ignoreLoggedUser?: boolean,
    startDate?: Date | undefined,
    endDate?: Date | undefined,
    lista?: string[],
  ) {
    let query = {
      $offset: 0,
      $limit: 1000,
    };

    query = Object.assign(query, { ref_utm_campaign: utmCampaign });
    query = Object.assign(query, { utm_source: undefined });
    query = Object.assign(query, { ignore_mp_logged_user: ignoreLoggedUser });
    query = Object.assign(query, { date_$gte: startDate });
    query = Object.assign(query, { date_$lte: endDate });
    query = Object.assign(query, { action });
    query = Object.assign(query, {
      utm_campaignIds: lista,
    });

    return this.get('reports/tracking', '', query);
  }

  static getUTMCampaigns(query: string) {
    return this.get('reports/utmCampaign', query).then(result => {
      return result.data;
    });
  }
}
