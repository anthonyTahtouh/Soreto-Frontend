/* eslint-disable */
import * as yup from 'yup';
import regexDictionary from '../shared/regexDictionary';
import MpBrand from './mpBrand';
import  Meta  from './DTO/Meta';
import BlogTemplate from './DTO/BlogTemplate';

export default class MpOffer {

  constructor() {
    this.meta = new Meta();
    this.templates = new BlogTemplate();
  }

  _id!: string;

  name!: string;

  title!: string;

  description!: string;

  active!: boolean;

  invisible!: boolean;

  publishedDate!: Date;

  cardImageUrl!: string;

  bodySourceUrl!: string;

  urlId!: string;

  coverTitle!: string;

  coverDescription!: string;

  coverImageUrl!: string;

  brandId!: string;

  brandUrlId!: string;

  brandName!: string;

  bodyContent!: string;

  trendingIndex!: number;

  meta!: Meta;
  
  templates: BlogTemplate;

  designContent!: string;

  flashCampaignIds!: string[];

  static schemaValidation() {
    return yup
      .object({
        name: yup.string().required(),
        title: yup.string().required(),
        description: yup.string().required(),
        trendingIndex: yup.number().required(),
        cardImageUrl: yup
          .string()
          .required()
          .matches(
            regexDictionary.validUrl,
            'Valid URL required!',
          ),
        bodySourceUrl: yup
          .string()
          .nullable()
          .matches(
            regexDictionary.validUrl,
            'Valid URL required!',
          ),
        urlId: yup
          .string()
          .required()
          .trim(),
        coverTitle: yup.string().required(),
        coverDescription: yup.string().required(),
        coverImageUrl: yup
          .string()
          .required()
          .matches(
            regexDictionary.validUrl,
            'Valid URL required!',
          ),
      })
      .required();
  }
}
