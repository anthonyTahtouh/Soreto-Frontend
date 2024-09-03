import * as yup from 'yup';

export default class MpDynamicRewardPool {
  _id!: string;

  name!: string;

  clientName!: string;

  createdAt!: string;

  updatedAt!: string;

  static schemaValidation() {
    return yup
      .object({
        name: yup.string().required(),
        clientName: yup.string().required(),
      })
      .required();
  }
}
