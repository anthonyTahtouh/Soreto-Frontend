import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import OfferService from '../services/OfferService';

function DropdownMpOffer({ id, value, onChange }: any, ref: any) {
  const [offers, setOffers] = useState<any>([]);
  const [selectedOffer, setSelectedOffer] = useState<any>();

  useEffect(() => {
    OfferService.getOffers('').then(response => {
      setOffers(response?.resultData?.page);
    });
  }, []);

  useEffect(() => {
    if (offers !== undefined && offers.length >= 1) {
      setSelectedOffer(
        value?._id ? value : offers.find((offer: any) => offer._id === value),
      );
    }
  }, [value, offers]);

  const onChangeOffer = (e: any) => {
    onChange(e);
  };

  return (
    <Dropdown
      ref={ref}
      filter
      showClear
      filterBy="name"
      id={id}
      value={selectedOffer}
      onChange={onChangeOffer}
      options={offers}
      optionLabel="name"
      placeholder="Select the Offer"
    />
  );
}

export default React.forwardRef(DropdownMpOffer);
