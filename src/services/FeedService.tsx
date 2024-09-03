/* eslint-disable no-console */
import BaseService from './BaseService';
import OfferService from './OfferService';
import BrandService from './BrandService';

const { REACT_APP_MAGGIE_SIMULATOR_URL } = process.env;

export default class FeedService extends BaseService {
  static getFeeds(query: string) {
    return this.get('mp/operation/feeds', query)
      .then(result => result.data)
      .catch(error => console.error(error));
  }

  static getFeedById(feedId: string, type: string) {
    return this.get(`mp/operation/feeds/${feedId}/${type}`, '')
      .then(result => result.data)
      .catch(error => console.error(error));
  }

  static getFeedsByType(type: string) {
    return this.get(`mp/operation/feeds/${type}`, '')
      .then(result => result.data)
      .catch(error => console.error(error));
  }

  static save(feedId: string, data: any, type: string) {
    return this.post(`mp/operation/feeds/${feedId}/${type}`, data)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static async reprove(feedId: string, type: string) {
    return this.post(`mp/operation/feeds/${feedId}/${type}/reprove`)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static async publish(feedId: string, type: string) {
    return this.post(`mp/operation/feeds/${feedId}/${type}/publish`)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static buildClientBrand(feedId: string) {
    return this.post(`feedWizard/brand/${feedId}`, '').catch(response => {
      throw response?.response?.data;
    });
  }

  static buildOffer(feedId: string) {
    return this.post(`feedWizard/offer/${feedId}`, '').catch(response => {
      throw response?.response?.data;
    });
  }

  static async simulateOffer(affiliateOffer: any) {
    // let currentOfferToRevisionForm: MpOffer = {
    //   _id: '',
    //   campaignVersionId: 'id',
    //   name: 'feedOffer.name',
    //   cardTitle: 'feedOffer.cardTitle',
    //   active: true,
    //   cardImageUrl: '/images/banner_offer.png',
    //   // shareHeroImageUrl: '/images/banner_offer.png',
    //   type: 'feedOffer.type',
    //   cardDescription: 'Up to 30% off all Isaw with minimum spend',
    //   condition: 'Get 30% off spending £90',
    //   urlId: 'feedOffer.urlId',
    //   title: 'feedOffer.title',
    //   subtitle: 'feedOffer.subtitle',
    //   cardSubtitle: 'feedOffer.subtitle',
    //   startDate: new Date(),
    //   endDate: new Date(),
    //   shareHeroImageUrl: '',
    //   shareHeroSmallImageUrl: '',
    //   trendingIndex: 0,
    //   brandName: '',
    //   brandUrlId: '',
    //   customSettings: {
    //     cardButtonField: 'string',
    //     modalButtomField: 'string',
    //   },
    //   meta: {
    //     title: 'string',
    //     description: 'string',
    //     keywords: 'string',
    //     ogImage: 'string',
    //     headingOne: 'string',
    //     headingTwo: 'string',
    //   },
    // };

    const currentOffer = await OfferService.getByOfferId(
      affiliateOffer.mpOfferId,
    );

    if (currentOffer) {
      // eslint-disable-next-line prefer-destructuring
      currentOffer.resultData.brand = currentOffer?.resultData.brand[0];
    }

    delete currentOffer?.resultData.meta;
    delete currentOffer?.resultData.categories;

    // TODO: Not offer, so get revision form
    // TODO: Prepare object to sent for new screen.

    const objJsonStr = JSON.stringify(currentOffer?.resultData);
    const objJsonB64 = Buffer.from(objJsonStr).toString('base64');

    window.open(
      `${REACT_APP_MAGGIE_SIMULATOR_URL}/simulator/offer?simulate=${objJsonB64}`,
      '_blank',
    );
  }

  static async viewOffer(offer: any) {
    window.open(
      `${REACT_APP_MAGGIE_SIMULATOR_URL}/${offer.revisionForm.brandUrlId}/offer/${offer.revisionForm.urlId}`,
      '_blank',
    );
  }

  static async simulateBrand(affiliateBrand: any) {
    const currentBrand = await BrandService.getByBrandId(
      affiliateBrand.brandId,
    );

    const objJsonStr = JSON.stringify(currentBrand?.resultData);
    const objJsonB64 = Buffer.from(objJsonStr).toString('base64');

    window.open(
      `${REACT_APP_MAGGIE_SIMULATOR_URL}/simulator/brand?simulate=${objJsonB64}`,
      '_blank',
    );
  }

  static async viewBrand(brand: any) {
    window.open(
      `${REACT_APP_MAGGIE_SIMULATOR_URL}/${brand.revisionForm.urlId}`,
      '_blank',
    );
  }

  static async unreject(feedId: string, type: string) {
    return this.post(`mp/operation/feeds/${feedId}/${type}/unreject`)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static async buildApproved(feedId: string, type: string) {
    return this.post(`mp/operation/feeds/${feedId}/${type}/buildApproved`)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static async buildReview(feedId: string, type: string) {
    return this.post(`mp/operation/feeds/${feedId}/${type}/buildReview`)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }
}
