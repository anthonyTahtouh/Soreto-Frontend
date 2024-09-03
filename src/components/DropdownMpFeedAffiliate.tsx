import React from 'react';
import { Dropdown } from 'primereact/dropdown';

function DropdownMpFeedAffiliate(
  { id, value, onChange, className, disabled }: any,
  ref: any,
) {
  const options = [
    { name: 'AWIN', value: 'AWIN' },
    { name: 'CF', value: 'CF' },
    { name: 'CJ', value: 'CJ' },
    { name: 'IMPACT', value: 'IMPACT' },
    { name: 'PARTNERIZE', value: 'PARTNERIZE' },
    { name: 'PEPPERJAM', value: 'PEPPERJAM' },
    { name: 'RAKUTEN', value: 'RAKUTEN' },
    { name: 'SHAREASALE', value: 'SHAREASALE' },
    { name: 'TRADEDOUBLER', value: 'TRADEDOUBLER' },
    { name: 'WEBGAINS', value: 'WEBGAINS' },
    { name: 'EBAY', value: 'EBAY' },
  ];

  const onChangeAffiliate = (e: any) => {
    onChange(e);
  };

  return (
    <Dropdown
      ref={ref}
      filter
      showClear
      filterBy="name"
      id={id}
      value={value}
      onChange={onChangeAffiliate}
      disabled={disabled}
      options={options}
      optionLabel="name"
      placeholder="Select the Affiliate"
      className={className}
    />
  );
}

export default React.forwardRef(DropdownMpFeedAffiliate);
