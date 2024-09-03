import axios from 'axios';

const { REACT_APP_API_URL } = process.env;

const instance = axios.create({
  withCredentials: true,
  baseURL: REACT_APP_API_URL,
});

export default class UploadService {
  static async uploadFile(
    assetObjInfo: any,
    section: 'brand' | 'offer' | 'blog' | 'banner' | 'flashCampaign',
    asset: string,
    file: any,
  ) {
    // const prefixName = ogImage ? 'ogImage' : asset;
    const formData = new FormData();

    formData.append('image', file);
    formData.append('assetObjInfo', JSON.stringify(assetObjInfo));
    formData.append('asset', asset);
    formData.append('section', section);

    return instance
      .post(`/mp/assetsUpload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(result => result.data.resultData)
      .catch(response => {
        throw response?.response?.data;
      });
  }
}
