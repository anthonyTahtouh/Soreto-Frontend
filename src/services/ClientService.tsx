import BaseService from './BaseService';

export default class ClientService extends BaseService {
  static getAllClients(query: string) {
    return this.get('clients/listings/all', query);
  }

  static getClient(clientId: string) {
    return this.get(`clients/${clientId}`, '');
  }

  static getClientByMerchantId(merchantId: string, affiliateName: string) {
    return this.get(
      `clients/merchantId/${merchantId}/affiliateName/${affiliateName}`,
      '',
    );
  }
}
