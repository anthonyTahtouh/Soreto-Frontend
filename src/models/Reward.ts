export interface Reward {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  type: string;
  clientId: string | undefined;
  clientName: string;
  meta: any;
}
