/* eslint-disable no-underscore-dangle */
import BaseService from './BaseService';

export default class BrandService extends BaseService {
  static getBrands(query: string) {
    return this.get('mp/brands', query)
      .then(result => result.data)
      .catch(error => console.error(error));
  }

  static createBrand(brand: any) {
    return this.post(`mp/brands`, brand)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static saveBrand(brand: any) {
    return this.put(`mp/brands/${brand._id}`, brand)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static deleteBrand(brand: any) {
    return this.delete(`mp/brands/${brand._id}`)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }

  static async rankBrands(
    brandId: string,
    startIndex: string,
    endIndex: string,
  ) {
    if (startIndex === endIndex) return false;
    const data = await this.put(`mp/brands/${brandId}/rank`, {
      startIndex,
      endIndex,
    });
    return data;
  }

  static getBrandByMerchantId(merchantId: string, affiliateName: string) {
    return this.get(
      `mp/brands/merchantId/${merchantId}/affiliateName/${affiliateName}`,
      '',
    );
  }

  static getByBrandId(brandId: string) {
    return this.get('mp/brands/', brandId)
      .then(result => result.data)
      .catch(response => {
        throw response?.response?.data;
      });
  }
}
