import * as yup from 'yup';
import regexDictionary from '../shared/regexDictionary';
import Meta from './DTO/Meta';

export default class MpFlashCampaign {
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    this.meta = new Meta();
  }

  _id!: string;

  name!: string;

  active = false;

  menuLabel!: string;

  urlId!: string;

  startDate!: Date;

  endDate!: Date;

  title!: string;

  description!: string;

  descriptionSmall!: string;

  descriptionMedium!: string;

  logoImageUrl!: string;

  coverImageUrl!: string;

  customSettings!: string;

  meta!: Meta;

  backgroundColor!: string;

  color!: string;

  static schemaValidation() {
    return yup
      .object({
        name: yup.string().required(),
        menuLabel: yup.string().required(),
        urlId: yup
          .string()
          .required()
          .matches(regexDictionary.noEmptySpaces, 'No empty spaces allowed')
          .matches(
            regexDictionary.onlyLetterNumberUndescoreAndDash,
            'Must contain only letter, numbers, undescore and dash',
          )
          .max(50),
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
        description: yup.string().required(),
        descriptionSmall: yup.string().required().max(210),
        descriptionMedium: yup.string().required().max(170),
      })
      .required();
  }
}
