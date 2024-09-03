import BaseService from './BaseService';

export default class OfferService extends BaseService {
  static getOffers(query: string) {
    return this.get('mp/offers', query)
      .then(result => result.data)
      .catch(error => console.error(error));
  }

  static getByOfferId(offerId: string) {
    return this.get('mp/offers/', offerId)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static createOffer(offer: any) {
    return this.post(`mp/offers`, offer)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static saveOffer(offer: any) {
    return this.put(`mp/offers/${offer._id}`, offer)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static async deleteOffer(offerID: string) {
    return this.delete(`mp/offers/${offerID}`)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static async rankOffers(
    startIndex: string,
    endIndex: string,
    offerId: string,
  ) {
    const data = await this.put(`mp/offers/${offerId}/rank`, {
      startIndex,
      endIndex,
    });
    return data;
  }
}
