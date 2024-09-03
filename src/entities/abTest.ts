import * as yup from 'yup';

export default class AbTest {
  _id!: string;

  name!: string;

  description!: string;

  startDate!: Date;

  endDate!: Date;

  type = 'CLASSIC';

  responsibleUserIds!: string[];

  status!: string;

  kpis!: string[];

  campaignVersionIds!: string[];

  static schemaValidation() {
    return yup.object({
      name: yup.string().required('Name is required'),
      description: yup.string().required('Description is required'),
      startDate: yup
        .date()
        .required('Start Date is required')
        .typeError('Start Date must be a valid date'),
      endDate: yup
        .date()
        .typeError('End Date must be a valid date')
        .when('startDate', {
          is: (startDate: Date | undefined) => !!startDate,
          then: yup
            .date()
            .required('End Date is required')
            .min(
              yup.ref('startDate'),
              'End Date must be later than Start Date',
            ),
          otherwise: yup.date().nullable(),
        })
        .nullable(),
      responsibleUserIds: yup
        .array()
        .of(yup.string().required('Owner is required'))
        .required('Owner is required')
        .min(1, 'At least one Owner is required'),
      kpis: yup.array().min(1, 'At least one KPI must be selected').required(),
    });
  }
}
