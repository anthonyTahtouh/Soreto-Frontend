/* eslint-disable no-restricted-syntax */

import { formatCurrency, formatNumber, formatPercent } from './formattingUtils';

const reportBaseFields: { [key: string]: any } = {
  sharePlaceViewCountTotal: {
    header: 'Placement Views',
    formatter: (value: any) => formatNumber.format(value),
  },
  shareCountTotal: {
    header: 'Enrolments',
    formatter: (value: any) => formatNumber.format(value),
  },
  shareRate: {
    header: 'Enrol. Rate',
    formatter: (value: any) => formatPercent(value / 100),
  },
  interstitialLoadCountTotal: {
    header: 'Ref. Clicks',
    formatter: (value: any) => formatNumber.format(value),
  },
  referralClickRate: {
    header: 'Ref. CTR',
    formatter: (value: any) => formatPercent(value / 100),
  },
  interstitialCTACountTotal: {
    header: 'Offer Clicks',
    formatter: (value: any) => formatNumber.format(value),
  },
  interstitialClickRate: {
    header: 'Offer CTR',
    formatter: (value: any) => formatPercent(value / 100),
  },
  saleCountTotal: {
    header: 'Sales',
    formatter: (value: any) => formatNumber.format(value),
  },
  conversionRate: {
    header: 'Conv. Rate',
    formatter: (value: any) => formatPercent(value / 100),
  },
  saleRevenueTotal: {
    header: 'Order Value',
    formatter: (value: any) => formatCurrency.format(value),
  },
  saleCommissionTotal: {
    header: 'Commission',
    formatter: (value: any) => formatCurrency.format(value),
  },
  avCpa: {
    header: 'AvCPA %',
    formatter: (value: any) => formatPercent(value / 100),
  },
  avCpaCurrency: {
    header: 'AvCPA £',
    formatter: (value: any) => formatCurrency.format(value),
  },
  aov: {
    header: 'AOV',
    formatter: (value: any) => formatCurrency.format(value),
  },
  ePCEarningsPerClick: {
    header: 'EPC Earnings Per Clicks',
    formatter: (value: any) => formatCurrency.format(value),
  },
  ePEEarningsPerEnrolment: {
    header: 'EPE Earnings Per Enrolment',
    formatter: (value: any) => formatCurrency.format(value),
  },
  affiliateClickCountTotal: {
    header: 'Affiliate Offer Clicks',
    formatter: (value: any) => formatNumber.format(value),
  },
};

const diffCalc = (value1: number, value2: number) => {
  try {
    if (!value1) {
      return 0;
    }

    return ((value2 || 0) / value1) * 100;
  } catch (error) {
    return 0;
  }
};

const handleStatsResults = (data: any, _id?: any) => {
  const statsResultData: any = {};

  // Assigning the values from the data object to the statsResultData object
  for (const key of Object.keys(reportBaseFields)) {
    statsResultData[key] = data[key] || 0;
  }

  statsResultData.name = data.name;
  statsResultData.id = _id;

  statsResultData.avCpa =
    ((data.saleCommissionTotal || 0) / (data.saleRevenueTotal || 1)) * 100;

  statsResultData.avCpaCurrency =
    (data.saleCommissionTotal || 0) / (data.saleCountTotal || 1);

  statsResultData.aov = !data.saleCountTotal
    ? 0
    : data.saleRevenueTotal / data.saleCountTotal;

  statsResultData.ePCEarningsPerClick = !data.saleCommissionTotal
    ? 0
    : data.saleCommissionTotal / data.interstitialLoadCountTotal;

  statsResultData.ePEEarningsPerEnrolment = !data.saleCommissionTotal
    ? 0
    : data.saleCommissionTotal / data.shareCountTotal;

  /**
   * Calculating the differences between the values
   */
  statsResultData.referralClickRate = diffCalc(
    data.shareCountTotal,
    data.interstitialLoadCountTotal,
  );
  statsResultData.interstitialClickRate = diffCalc(
    data.interstitialLoadCountTotal,
    data.interstitialCTACountTotal,
  );
  statsResultData.conversionRate = diffCalc(
    data.interstitialLoadCountTotal,
    data.saleCountTotal,
  );
  statsResultData.shareRate = diffCalc(
    data.sharePlaceViewCountTotal,
    data.shareCountTotal,
  );

  return statsResultData;
};

const percentualDiff = (
  currentValue: number,
  previousValue?: any,
  decimalLength = 2,
): string => {
  if (previousValue === null || previousValue === undefined) {
    return '';
  }

  if (currentValue === 0 && parseFloat(previousValue) === 0) {
    return '0';
  }

  if (previousValue === 0) {
    return '100';
  }

  const diffValue = currentValue - previousValue;
  const percentValue = (diffValue / previousValue) * 100;

  if (Math.abs(percentValue) <= 0.006) {
    return Number(0).toFixed(decimalLength);
  }

  let formattedValue = percentValue.toFixed(decimalLength);

  const stringHasOnlyZeros = /^-0(\.0+)?$/g.test(formattedValue);

  if (stringHasOnlyZeros) {
    formattedValue = formattedValue.replace('-', '');
  }

  return formattedValue;
};

const calculateDifferences = (originalItem: any, comparisonItem: any) => {
  const statsResultData: any = {};

  // Assigning the values from the data object to the statsResultData object
  for (const key of Object.keys(reportBaseFields)) {
    statsResultData[key] = percentualDiff(
      originalItem[key] || 0,
      comparisonItem[key] || 0,
    );
  }

  return statsResultData;
};

export {
  handleStatsResults,
  diffCalc,
  reportBaseFields,
  calculateDifferences,
  percentualDiff,
};
