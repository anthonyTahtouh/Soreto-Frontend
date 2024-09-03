import BaseService from './BaseService';

export default class NotificationService extends BaseService {
  static getNotifications(query: string) {
    return this.get('mp/notifications', query)
      .then(result => result.data)
      .catch(error => console.error(error));
  }

  static createNotification(notificationId: any) {
    return this.post(`mp/notifications`, notificationId)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static saveNotification(notificationId: any) {
    return this.put(`mp/notifications/${notificationId._id}`, notificationId)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static async deleteNotification(notificationId: string) {
    return this.delete(`mp/notifications/${notificationId}`)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static async publishNotifications(notificationIds: string[]) {
    return this.post(`mp/notifications/publish`, { notificationIds })
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }
}
