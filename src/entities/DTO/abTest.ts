export default class AbTest {
  _id!: string;

  createdAt!: Date;

  name!: string;

  description!: string;

  startDate!: Date;

  endDate!: Date;

  type!: string;

  responsibleUserId!: string[];

  responsibleUsers!: [];

  status!: string;

  kpis!: string[];

  campaignVersionIds!: string[];

  campaignVersions!: any[];
}
