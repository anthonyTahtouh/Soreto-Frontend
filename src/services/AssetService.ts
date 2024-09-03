import BaseService from './BaseService';

export default class AssetService extends BaseService {
  static getAsset(id: string): Promise<any> {
    return this.get(`asset/${id}`, '');
  }

  static getAssetByCampaignVersionId(cpvId: string): Promise<any> {
    return this.get(`asset`, '', { cpv_id: cpvId });
  }

  static compileAsset(asset: any): Promise<any> {
    return this.post(`asset/compile`, asset);
  }
}
