// eslint-disable-next-line max-classes-per-file
import * as yup from 'yup';
import regexDictionary from '../shared/regexDictionary';
import Meta from './DTO/Meta';

export default class MpOffer {
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    this.customSettings = new CustomSettings();

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    this.meta = new Meta();
  }

  _id!: string;

  name!: string;

  active = false;

  startDate!: Date;

  endDate!: Date;

  cardImageUrl!: string;

  shareHeroImageUrl!: string;

  shareHeroSmallImageUrl!: string;

  type!: string;

  title!: string;

  subtitle!: string;

  cardTitle!: string;

  cardSubtitle?: string;

  condition!: string;

  urlId!: string;

  trendingIndex!: number;

  campaignVersionId!: string;

  brandName!: string;

  brandUrlId!: string;

  clientId!: string;

  cardDescription!: string; // deprecated

  customSettings: CustomSettings;

  meta: Meta;

  flashCampaignIds!: string[];

  static schemaValidation() {
    return yup
      .object({
        name: yup.string().required(),
        campaignVersionId: yup
          .string()
          .required('Campaign Version Cannot be null'),
        urlId: yup
          .string()
          .max(50)
          .matches(regexDictionary.noEmptySpaces, 'No empty spaces allowed')
          .matches(
            regexDictionary.onlyLetterNumberUndescoreAndDash,
            'Must contain only letter, numbers, undescore and dash',
          )
          .required(),
        active: yup.boolean().required(),
        startDate: yup.date().required(),
        endDate: yup
          .date()
          .required()
          .when('startDate', (startDate: any, schema: any) => {
            return schema.test({
              test: (endDate: any) => {
                return startDate < endDate;
              },
              message: 'End date must be greater than Start date',
            });
          }),
        shareHeroImageUrl: yup.string().required(),
        shareHeroSmallImageUrl: yup.string().required(),
        cardImageUrl: yup.string().required(),
        type: yup.string().required(),
        title: yup.string().required(),
        subtitle: yup.string().nullable(),
        cardTitle: yup.string().required(),
        cardSubtitle: yup.string().nullable(),
        condition: yup.string().nullable(),
        trendingIndex: yup.number().required(),
        trackingLink: yup
          .string()
          .required()
          .matches(regexDictionary.validUrl, 'Valid URL required!'),
      })
      .required();
  }
}

class CustomSettings {
  cardButtonField!: string;

  modalButtomField!: string;
}
