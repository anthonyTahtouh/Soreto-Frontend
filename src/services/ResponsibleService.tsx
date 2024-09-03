import BaseService from './BaseService';

export default class ResponsibleService extends BaseService {
  static getAllOwner(query: string) {
    return this.get('userManagement/responsibles', query);
  }
}
