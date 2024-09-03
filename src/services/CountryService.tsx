import BaseService from './BaseService';

export default class CountryService extends BaseService {
  static getAllCountries() {
    return this.get('country/all', '');
  }
}
