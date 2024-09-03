import BaseService from './BaseService';

export default class WizardService extends BaseService {
  static getTemplateCampaigns() {
    const query = `?$sort=-description&clientTemplate_$eq=true&type_$eq=marketplace`;
    return this.get('campaign/list', query);
  }

  static submit(clientTemplate: string, version: string, payload: any) {
    return this.post(`wizard/${clientTemplate}/${version}`, payload);
  }
}
