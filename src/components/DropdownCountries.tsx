import React, { useRef, useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import CountryService from '../services/CountryService';

function DropdownCountries({ value, onChange, className }: any, ref: any) {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    CountryService.getAllCountries().then(response => {
      setCountries(response.data);
    });
  }, []);

  const onChangeCountry = (e: any) => {
    onChange(e);
  };

  return (
    <div>
      <Dropdown
        ref={ref}
        filter
        showClear
        filterBy="name"
        id="dropdownClientId"
        value={value}
        onChange={onChangeCountry}
        className={className}
        options={countries}
        optionLabel="name"
        placeholder="Select One"
      />
    </div>
  );
}

export default React.forwardRef(DropdownCountries);
