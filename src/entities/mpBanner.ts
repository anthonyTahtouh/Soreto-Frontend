/* eslint-disable @typescript-eslint/no-use-before-define */
import * as yup from 'yup';
import regexDictionary from '../shared/regexDictionary';

export default class MpBanner {
  _id!: string;

  name!: string;

  startDate!: Date | Date[] | undefined;

  endDate!: Date | Date[] | undefined;

  title!: string;

  description!: string;

  buttonLabel!: string;

  active!: boolean;

  coverImageUrl!: string;

  tag!: string;

  targetMpOfferId!: string;

  targetMpBrandId!: string;

  targetMpCategoryId!: string;

  customUrlTarget!: string;

  trendingIndex!: number;

  flashCampaignIds!: string[];

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
        buttonLabel: yup.string().nullable(),
        coverImageUrl: yup.string().required(),
        targetMpOfferId: yup.string().nullable(),
        targetMpBrandId: yup.string().nullable(),
        targetMpCategoryId: yup.string().nullable(),
        flashCampaignIds: yup
          .array()
          .when(['targetTagId'], tagValidation)
          .nullable(),
        customUrlTarget: yup
          .string()
          .max(300)
          .matches(regexDictionary.noEmptySpaces, 'No empty spaces allowed')
          .nullable(),
      })
      .required()
      .test(
        'only-offer-brand-category-custom',
        'You must choose only one between Offer, Brand or category',
        (fields: any): boolean => {
          let filledFieldsCOunt = 0;

          if (fields.targetMpOfferId) filledFieldsCOunt += 1;
          if (fields.targetMpBrandId) filledFieldsCOunt += 1;
          if (fields.targetMpCategoryId) filledFieldsCOunt += 1;
          if (fields.customUrlTarget) filledFieldsCOunt += 1;
          if (fields.flashCampaignIds && fields.flashCampaignIds.length > 0)
            filledFieldsCOunt += 1;

          return filledFieldsCOunt <= 1;
        },
      )
      .test('only-tag', 'tag is a required field', (fields: any): boolean => {
        if (fields.targetTagId === undefined) return false;

        return true;
      });
  }
}

const tagValidation = (tag: any, schema: any) => {
  return schema.test({
    test: (field: any) => {
      return !(tag === 'FLASH_CAMPAIGN_BOTTOM' && !field);
    },
    message: 'Field is a required',
  });
};
