import BaseService from './BaseService';

export default class RoleService extends BaseService {
  static getAll(query: string) {
    return this.get('roles', query);
  }
}
