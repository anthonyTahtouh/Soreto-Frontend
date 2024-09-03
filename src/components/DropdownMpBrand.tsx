import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import BrandService from '../services/BrandService';

/**
 * You just can use one filter by clientID or by value whether you use both the component will not work
 */

function DropdownMpBrand(
  { id, value, clientId, onChange, className, disabled = false }: any,
  ref: any,
) {
  const [brands, setBrands] = useState<any>([]);
  const [selectedBrand, setSelectedBrand] = useState<any>();

  useEffect(() => {
    BrandService.getBrands('').then(response => {
      const data = response?.resultData?.page.sort((a: any, b: any) =>
        a.name > b.name ? 1 : -1,
      );
      setBrands(data);
    });
  }, []);

  useEffect(() => {
    if (brands !== undefined && brands.length >= 1) {
      let brand = null;
      if (clientId) {
        brand = brands.find((b: any) => b.clientId === clientId);
      } else {
        brand = value?._id ? value : brands.find((b: any) => b._id === value);
      }

      setSelectedBrand(brand);
    }
  }, [value, brands, clientId]);

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
      value={selectedBrand}
      onChange={onChangeBrand}
      options={brands}
      optionLabel="name"
      placeholder="Select the Brand"
      className={className}
    />
  );
}

export default React.forwardRef(DropdownMpBrand);
