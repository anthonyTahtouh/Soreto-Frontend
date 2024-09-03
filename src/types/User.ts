export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: {
    _id: string;
    name: string;
  };
  imageId: string;
  imageUrl: string;
  verifiedEmail: boolean;
  passwordSet: boolean;
};
