/* eslint-disable @typescript-eslint/no-use-before-define */
// eslint-disable-next-line max-classes-per-file
import * as yup from 'yup';

export default class MpFeedOffer {
  constructor() {
    this.customSettings = new MpFeedOfferCustomSettings();
    this.meta = new MpFeedOfferMeta();
  }

  _id!: string;

  name!: string;

  startDate!: Date;

  endDate!: Date;

  cardTitle!: string;

  title!: string;

  subtitle!: string;

  condition!: string;

  type!: string;

  feedId!: number;

  customSettings: MpFeedOfferCustomSettings;

  meta: MpFeedOfferMeta;

  brandName!: string;

  brandUrlId!: string;

  brandId!: string;

  affiliateBrandName!: string;

  affiliateBrand!: undefined;

  urlId!: string;

  affiliate!: string;

  promotionTrackingLink!: string;

  promotionCode!: string;

  categoryIds!: string[];

  mpAffiliateFeedOfferId!: string;

  note!: string;

  status!: string;

  errors!: any;

  static schemaValidation() {
    return yup
      .object({
        name: yup.string().required(),
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
        title: yup.string().required(),
        subtitle: yup.string().required(),
        cardTitle: yup.string().required(),
        condition: yup.string().required(),
        urlId: yup.string().required(),
        type: yup.string().required(),
        affiliate: yup.string().required(),
        promotionTrackingLink: yup.string().required(),
        affiliateBrand: yup.object().when(['brandId'], validationDependency),
      })
      .required();
  }
}

const validationDependency = (brandId: any, schema: any) => {
  return schema.test({
    test: (i: any) => {
      return !((brandId === '' && i === '') || (!brandId && !i));
    },
    message: 'Field is a required',
  });
};

class MpFeedOfferCustomSettings {
  cardButtonField!: string;

  modalButtomField!: string;
}

class MpFeedOfferMeta {
  title!: string;

  description!: string;

  keywords!: string;

  ogImage!: string;

  tag!: string;

  headingOne!: string;

  headingTwo!: string;
}
