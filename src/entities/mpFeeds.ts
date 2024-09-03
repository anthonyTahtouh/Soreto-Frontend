import * as yup from 'yup';
import regexDictionary from '../shared/regexDictionary';

export default class MpFeeds {
  _id!: string;

  affiliateBrandName!: string;

  affiliate!: string;

  promotionTitle!: string;

  promotionDescription!: string;

  promotionType!: string;

  createdAt!: Date;

  status!: string;

  promotionTerms!: string;

  startDate!: Date;

  endDate!: Date;

  exclusive = false;
}
