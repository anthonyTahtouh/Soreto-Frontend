import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import FeedService from '../services/FeedService';

function DropdownMpFeedBrand(
  { id, value, onChange, className, disabled }: any,
  ref: any,
) {
  const [brands, setBrands] = useState<any>([]);

  useEffect(() => {
    FeedService.getFeedsByType('brand').then(response => {
      const data = response?.resultData.sort((a: any, b: any) =>
        a.name > b.name ? 1 : -1,
      );

      setBrands(data);
    });
  }, []);

  const onChangeBrand = (e: any) => {
    onChange(e);
  };

  return (
    <Dropdown
      ref={ref}
      filter
      showClear
      filterBy="name"
      id={id}
      disabled={disabled}
      value={value}
      onChange={onChangeBrand}
      options={brands}
      optionLabel="name"
      placeholder="Select the Feed Brand"
      className={className}
    />
  );
}

export default React.forwardRef(DropdownMpFeedBrand);
