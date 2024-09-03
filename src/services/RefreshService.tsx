import BaseService from './BaseService';

export default class RefreshService extends BaseService {
  static vanishCollections() {
    return this.post('mp/vanish_collections', {});
  }

  static refresh() {
    return this.post(`mp/refresh`, {});
  }

  static fillCollections() {
    return this.post(`mp/fill_collections`, {});
  }
}
