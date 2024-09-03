import * as yup from 'yup';
import Meta from './DTO/Meta';

export default class MpCategory {
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    this.meta = new Meta();
  }

  _id!: string;

  name!: string;

  active = false;

  staticId!: string;

  urlId!: string;

  showOnHeaderMenu = false;

  showHeaderMenuIndex = 0;

  showOnTabPanelMenu = false;

  showTabPanelMenuIndex = 0;

  showOnCategoryMenu = false;

  showCategoryMenuIndex = 0;

  showOnFooterMenu = false;

  showFooterMenuIndex = 0;

  meta!: Meta;

  static schemaValidation() {
    return yup
      .object({
        name: yup.string().required(),
        staticId: yup.string().max(30).required(),
        urlId: yup.string().required().max(50),
        showHeaderMenuIndex: yup.number().required().min(0),
        showTabPanelMenuIndex: yup.number().required().min(0),
        showCategoryMenuIndex: yup.number().required().min(0),
        showFooterMenuIndex: yup.number().required().min(0),
      })
      .required();
  }
}
