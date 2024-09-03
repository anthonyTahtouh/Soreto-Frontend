import * as yup from 'yup';

export default class MpNotification {
  _id!: string;

  createdAt!: Date;

  updatedAt!: Date;

  publisedAt!: Date;

  message!: string;

  type!: string;

  redirectUrl!: string;

  targetMpOfferId!: string;

  targetMpBrandId!: string;

  targetMpCategoryId!: string;

  static schemaValidation() {
    return yup
      .object({
        message: yup.string().required(),
        type: yup.string().required(),
      })
      .required();
  }
}
