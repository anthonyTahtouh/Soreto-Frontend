/* eslint-disable @typescript-eslint/no-use-before-define */
// eslint-disable-next-line max-classes-per-file
import * as yup from 'yup';
import regexDictionary from '../shared/regexDictionary';

export default class MpFeedBrand {
  constructor() {
    this.meta = new MpFeedOfferMeta();
  }

  _id!: string;

  feedId!: number;

  merchantId!: number;

  name!: string;

  urlId!: string;

  clientId!: string;

  shortName!: string;

  shortUrl!: string;

  brandDescription!: string;

  brandDescriptionSmall!: string;

  brandDescriptionMedium!: string;

  contactEmail!: string;

  percentCommission!: string;

  website!: string;

  tierId!: string;

  customerServicesEmail!: string;

  industry!: string;

  categoryIds!: string[];

  meta: MpFeedOfferMeta;

  brandUrlId!: string;

  affiliate!: string;

  mpAffiliateFeedBrandId!: string;

  status!: string;

  clientName!: string;

  errors!: any;

  note!: string;

  static schemaValidation() {
    return yup
      .object({
        name: yup.string().required(),
        urlId: yup
          .string()
          .max(50)
          .matches(regexDictionary.noEmptySpaces, 'No empty spaces allowed')
          .matches(
            regexDictionary.onlyLetterNumberUndescoreAndDash,
            'Must contain only letter, numbers, undescore and dash',
          )
          .required(),
        shortName: yup.string().required(),
        shortUrl: yup.string().required(),
        brandDescription: yup.string().required().max(210),
        brandDescriptionSmall: yup.string().required().max(90),
        brandDescriptionMedium: yup.string().required().max(140),
        clientName: yup.string().when(['clientId'], validationDependency),
        contactEmail: yup.string().when(['clientId'], validationDependency),
        percentCommission: yup
          .string()
          .when(['clientId'], percentCommissionValidation)
          .when(['clientId'], validationDependency),
        website: yup.string().when(['clientId'], validationDependency),
        tierId: yup.string().when(['clientId'], validationDependency),
        customerServicesEmail: yup
          .string()
          .when(['clientId'], validationDependency),
        industry: yup.string().when(['clientId'], validationDependency),
        merchantId: yup.string().when(['clientId'], validationDependency),
        affiliate: yup.string().required(),
      })
      .required();
  }
}

const percentCommissionValidation = (clientId: string, schema: any) => {
  const { onlyLetterNumberUndescoreAndDash } = regexDictionary;
  return schema.test({
    test: (i: string) => {
      return !(
        !clientId &&
        i !== '' &&
        !onlyLetterNumberUndescoreAndDash.test(i)
      );
    },
    message: 'Must contain only letter, numbers, undescore and spaces',
  });
};

const validationDependency = (clientId: any, schema: any) => {
  return schema.test({
    test: (i: any) => {
      return !((clientId === '' && i === '') || (!clientId && !i));
    },
    message: 'Field is a required',
  });
};

class MpFeedOfferMeta {
  title!: string;

  description!: string;

  keywords!: string;

  ogImage!: string;

  tag!: string;

  headingOne!: string;

  headingTwo!: string;
}
