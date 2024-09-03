import * as yup from 'yup';

export default class WizardPayloadBuilder {
  static buildPayload(values: any) {
    const payload: any = {};
    payload.client = {
      name: values.clientName,
      customIdentifier: values.clientCustomIdentifier,
      siteUrl: values.clientSite,
      siteShortUrl: values.clientSiteShortUrl,
      productUrl: values.clientProductUrl,
      about: values.clientAbout,
    };
    payload.client._id = values.selectedClient ? values.selectedClient._id : '';
    payload.client.campaigns = [
      {
        description: values.campaignDescription,
        startDate: values.campaignStartDate,
        expiry: values.campaignExpiryDate,
      },
    ];
    payload.client.campaigns[0].countryId = values.selectedCountry
      ? values.selectedCountry._id
      : '';
    payload.client.campaigns[0].campaignVersions = [
      {
        discountCodes: [],
        name: values.campaignVersionName,
        actionButtonDefaultBackgroundColor: `#${values.actionButtonBackgroundColor}`,
        actionButtonDefaultTextColor: `#${values.actionButtonTextColor}`,
      },
    ];

    payload.client.rewards = [
      {
        _meta_reward_type: 'sharerPre',
        name: values.sharerRewardName,
        literalDescription: values.sharerRewardLiteralDescription,
        discountCodes: [
          {
            valueAmount: values.sharerRewardValueAmount,
            code: values.sharerRewardCode,
            validFrom: values.sharerRewardValidFrom,
            validTo: values.sharerRewardValidTo,
          },
        ],
      },
      {
        _meta_reward_type: 'friendPre',
        name: values.friendRewardName,
        literalDescription: values.friendRewardLiteralDescription,
        discountCodes: [
          {
            valueAmount: values.friendRewardValueAmount,
            code: values.friendRewardCode,
            validFrom: values.friendRewardValidFrom,
            validTo: values.friendRewardValidTo,
          },
        ],
      },
    ];

    payload.client.brand = {
      shortName: values.brandShortName,
      description: values.brandDescription,
      urlId: values.brandUrlId,
      categories: values.brandCategories,
    };

    payload.client.offer = {
      startDate: values.offerStartDate,
      endDate: values.offerEndDate,
      type: values.offerType,
      cardDescription: values.offerCardDescription,
      condition: values.offerCondition,
      urlId: values.offerUrlId,
      categories: values.offerCategories,
    };
    return payload;
  }
}
