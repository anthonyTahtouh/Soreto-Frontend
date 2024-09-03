import * as yup from 'yup';

export default class WizardSchemaValidation {
  static schemaValidation() {
    return yup
      .object({
        selectedTemplateCampaign: yup.object({
          _id: yup.string().required(),
        }),
        selectedClient: yup
          .object({
            _id: yup.string().required(),
          })
          .required(),
        clientName: yup.string().required(),
        clientCustomIdentifier: yup.string().required(),
        clientSite: yup.string().required(),
        clientSiteShortUrl: yup.string().required(),
        clientProductUrl: yup.string().required(),
        clientAbout: yup.string().required(),
        campaignDescription: yup.string().required(),
        selectedCountry: yup
          .object({
            _id: yup.string().required(),
          })
          .required(),
        campaignStartDate: yup.date().required(),
        campaignExpiryDate: yup.date().required(),
        actionButtonBackgroundColor: yup.string().required(),
        actionButtonTextColor: yup.string().required(),
        campaignVersionName: yup.string().required(),
        sharerRewardName: yup.string().required(),
        sharerRewardLiteralDescription: yup.string().required(),
        sharerRewardValueAmount: yup.number().required(),
        sharerRewardCode: yup.string().required(),
        sharerRewardValidFrom: yup.date().required(),
        friendRewardName: yup.string().required(),
        friendRewardLiteralDescription: yup.string().required(),
        friendRewardValueAmount: yup.number().required(),
        friendRewardCode: yup.string().required(),
        friendRewardValidFrom: yup.date().required(),
        brandShortName: yup.string().required(),
        brandUrlId: yup.string().required(),
        offerUrlId: yup.string().required(),
      })
      .required();
  }
}
