/* eslint-disable no-underscore-dangle */
import BaseService from './BaseService';

interface BannerProps {
  _id?: string;
  name?: string;
  title?: string;
  description?: string | null;
  buttonLabel?: string | null;
  active?: boolean;
  coverImageUrl?: string;
  tag?: string;
  targetMpOfferId?: string | null;
  targetMpBrandId?: string | null;
  targetMpCategoryId?: string | null;
}

export default class BannerService extends BaseService {
  static getBanners(query: string) {
    return this.get('mp/banners', query)
      .then(result => result.data)
      .catch(error => console.error(error));
  }

  static createBanner(banner: BannerProps) {
    return this.post(`mp/banners`, banner)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static saveBanner(banner: BannerProps) {
    return this.put(`mp/banners/${banner._id}`, banner)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static deleteBanner(banner: BannerProps) {
    return this.delete(`mp/banners/${banner._id}`)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }
}
