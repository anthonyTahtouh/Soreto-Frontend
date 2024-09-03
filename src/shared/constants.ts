const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  CLIENT: 'client',
  CLIENT_USER: 'clientUser',
  GUEST: 'guest',
  SYSTEM: 'system',
  SALES: 'sales',
  MP_USER: 'mpUser',
  TECH: 'tech',
};

const AFFILIATE_STATUS = {
  CREATED: 'CREATED',
  BUILD_FAILED: 'BUILD_FAILED',
  IN_REVIEW: 'IN_REVIEW',
  REVIEWED: 'REVIEWED',
  REJECTED: 'REJECTED',
  BUILT: 'BUILT',
  PUBLISHED: 'PUBLISHED',
  AFFILIATE_UPDATE: 'AFFILIATE_UPDATE',
  BUILD_REVIEW: 'BUILD_REVIEW',
  BUILD_UPDATE_REQUIRED: 'BUILD_UPDATE_REQUIRED',
  BUILD_APPROVED: 'BUILD_APPROVED',
};

export default {
  ROLES,
  IMAGE: {
    EMPTY_IMAGE_URL:
      'https://soreto-dev.s3.sa-east-1.amazonaws.com/noimage.jpg',
  },
  AFFILIATE_STATUS,
  KEYPRESS: {
    ENTER: 'Enter',
  },
};
