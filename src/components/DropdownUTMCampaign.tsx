/* eslint-disable no-lonely-if */
import React, { useState, useEffect } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import TrackingService from '../services/TrackingService';

function DropdownUTMCampaign(
  { id, value, onChange, singleSelect, disabled = false }: any,
  ref: any,
) {
  const [utmCampaigns, setUTMCampaigns] = useState<any>([]);

  useEffect(() => {
    TrackingService.getUTMCampaigns('')
      .then(response => {
        if (response) {
          const data: any[] = response.map((result: any) => ({
            name: result.key,
            value: result.key,
          }));

          setUTMCampaigns(data);
        }
      })
      .catch(error => {
        console.warn(error);
      });
  }, []);

  const onChangeUTMCampaigns = (e: any) => {
    onChange(e);
  };

  /// //////////////////////////////////////////////////
  //              Single Select
  /// //////////////////////////////////////////////////

  if (singleSelect) {
    const selectedUTMCampaign = value?._id
      ? value
      : utmCampaigns.find((utmCampaign: any) => utmCampaign._id === value);
    return (
      <Dropdown
        filter
        showClear
        filterBy="name"
        id={id}
        disabled={disabled}
        value={selectedUTMCampaign}
        onChange={onChangeUTMCampaigns}
        options={utmCampaigns}
        optionLabel="name"
        placeholder="Select the UTM Campaign"
      />
    );
  }

  /// //////////////////////////////////////////////////
  //              MultiSelect
  /// //////////////////////////////////////////////////

  let selectedUTMCampaigns = [];

  const getUTMCampaignsFromIds = (arrayOfIds: string[]) => {
    const arrayOfUTMCampaigns = arrayOfIds.map(_id => {
      return utmCampaigns.find((utmCampaign: any) => utmCampaign.name === _id)
        .value;
    });
    return arrayOfUTMCampaigns;
  };

  if (
    !value ||
    !value.length ||
    value[0] === null ||
    (value.length === 1 && !value[0])
  ) {
    selectedUTMCampaigns = [];
  } else {
    if (value[0]?._id) {
      selectedUTMCampaigns = value;
    } else {
      selectedUTMCampaigns = getUTMCampaignsFromIds(value);
    }
  }

  return (
    <div>
      <MultiSelect
        ref={ref}
        filter
        showClear
        filterBy="name"
        id={id}
        disabled={disabled}
        value={selectedUTMCampaigns}
        onChange={onChangeUTMCampaigns}
        options={utmCampaigns}
        optionLabel="name"
        placeholder="Select the UTM Campaign"
      />
    </div>
  );
}

export default React.forwardRef(DropdownUTMCampaign);
