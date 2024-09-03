/* eslint-disable react/require-default-props */
import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import CampaignService from '../services/CampaignService';

interface IDropdownClient {
  id: string;
  value: string | undefined;
  onChange?: any;
  className?: any;
  disabled?: boolean;
  clientId: string | undefined;
  typeCampaign: string | undefined;
}

export interface ICampaign {
  _id: string;
  description: string;
}

export interface ICampaigntArray {
  label: string;
  value: string;
  _id: string;
  description: string;
}

function DropdownCampaign(
  {
    id,
    value,
    onChange,
    className,
    disabled,
    clientId,
    typeCampaign,
  }: IDropdownClient,
  ref: any,
) {
  const [campaigns, setCampaigns] = useState<ICampaigntArray[]>([]);

  useEffect(() => {
    if (disabled) return;

    CampaignService.getCampaign({ clientId, typeCampaign }).then(
      (response: { page: [{ _id: string; description: string }] }) => {
        const listOfCampaigns = response;
        if (listOfCampaigns.page) {
          const campaignsArray = listOfCampaigns.page.map(
            (listCampaign: ICampaign) => ({
              ...listCampaign,
              label: listCampaign.description,
              value: listCampaign._id,
            }),
          );
          setCampaigns(campaignsArray);
        }
      },
    );
  }, [clientId, disabled]);

  const onChangeCampaign = (e: any) => {
    onChange(
      e,
      campaigns.find(f => f._id === e.target.value),
    );
  };

  return (
    <div>
      <Dropdown
        ref={ref}
        filter
        showClear
        filterBy="description"
        id={id}
        value={value}
        disabled={disabled}
        onChange={onChangeCampaign}
        options={campaigns}
        optionLabel="description"
        className={className}
        placeholder="Select One"
      />
    </div>
  );
}

export default React.forwardRef(DropdownCampaign);
