import * as yup from 'yup';
import regexDictionary from '../shared/regexDictionary';
import Meta from './DTO/Meta';

export default class MpBrand {
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    this.meta = new Meta();
  }

  _id!: string;

  name!: string;

  active = false;

  clientId!: string;

  urlId!: string;

  shortName!: string;

  shortUrl!: string;

  brandDescription!: string;

  brandDescriptionSmall!: string;

  brandDescriptionMedium!: string;

  cardImageUrl!: string;

  logoImageUrl!: string;

  coverImageUrl!: string;

  trendingIndex!: number;

  categoryIds!: string[];

  meta!: Meta;

  static schemaValidation() {
    return yup
      .object({
        name: yup.string().required(),
        urlId: yup
          .string()
          .required()
          .matches(regexDictionary.noEmptySpaces, 'No empty spaces allowed')
          .matches(
            regexDictionary.onlyLetterNumberUndescoreAndDash,
            'Must contain only letter, numbers, undescore and dash',
          )
          .max(50),
        clientId: yup.string().required(),
        shortName: yup.string().required(),
        shortUrl: yup.string().required(),
        brandDescription: yup.string().required(),
        brandDescriptionSmall: yup.string().required().max(210),
        brandDescriptionMedium: yup.string().required().max(170),
        cardImageUrl: yup.string().required(),
        logoImageUrl: yup.string().required(),
        coverImageUrl: yup.string().required(),
        trendingIndex: yup.number().required(),
      })
      .required();
  }
}
