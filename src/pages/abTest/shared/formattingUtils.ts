const formatNumber = new Intl.NumberFormat('en-GB', {
  maximumFractionDigits: 2,
});

function formatPercent(value: any) {
  if (value !== undefined && value !== null) {
    return value.toLocaleString('en-GB', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return (0.0).toLocaleString('en-GB', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const formatCurrency = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export { formatNumber, formatPercent, formatCurrency };
