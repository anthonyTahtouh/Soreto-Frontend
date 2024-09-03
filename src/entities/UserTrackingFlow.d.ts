/* eslint-disable camelcase */
interface UserTrackingInterface {
  clientId: string;
  clientName: string;
  su: SharedUrl[];
}

interface SharedUrl {
  _id: string;
  cv_alias: string;
  type: 'PERSONAL' | 'SHARED';
  created_at: string;
  source_client_order_id: string;
  ipAddress: string;
  userAgent: string;
  suas?: SharedUrlAccess[];
}

interface Order {
  created_at: string;
  status: string;
  client_order_id: string;
  sharedUrlId: string;
  ipAdress?: string;
  userAgent?: string;
}
interface ExternalOrder {
  created_at: string;
  status: string;
  client_order_id: string;
  sharedUrlId: string;
  ipAdress?: string;
  userAgent?: string;
}
interface SharedUrlAccess {
  _id: string;
  created_at: string;
  ipAddress: string;
  userAgent: string;
  orders?: Order[];
  external_orders?: ExternalOrder[];
}
