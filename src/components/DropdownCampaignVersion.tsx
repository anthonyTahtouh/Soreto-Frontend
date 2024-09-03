import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import CampaignVersionService from '../services/CampaignVersionService';

function DropdownCampaignVersion(
  {
    id,
    value,
    onChange,
    onLoad,
    disabled,
    campaignId,
    onSelectedOptionLoaded,
    error,
  }: any,
  ref: any,
) {
  const [campaignVersions, setCampaignVersions] = useState<any>([]);

  const getCampaignVersions = async () => {
    let url = value ? `?_id_$eq=${value}` : `?campaignId_$eq=${campaignId}`;

    url += '&$sort=name';

    const response = await CampaignVersionService.getCampaignVersions(url);
    if (response) {
      const listCampaignVersion = response;
      if (listCampaignVersion) {
        const campaignVersionsArray = listCampaignVersion.page.map(
          (listCampaign: { _id: string; name: string }) => ({
            ...listCampaign,
            label: listCampaign.name,
            value: listCampaign._id,
          }),
        );

        setCampaignVersions(campaignVersionsArray);

        if (value) {
          const selected = value
            ? campaignVersionsArray.find((cpv: any) => cpv._id === value)
            : null;

          onSelectedOptionLoaded({
            campaignId: selected.campaignId,
            clientId: selected.clientId,
          });

          onLoad(selected);
        }
      }
    }
  };

  useEffect(() => {
    if (campaignId && (!campaignVersions || campaignVersions.length === 0)) {
      getCampaignVersions();
    } else if (!value) {
      setCampaignVersions([]);
    }
  }, [campaignId]);

  useEffect(() => {
    if (value && (!campaignVersions || campaignVersions.length === 0)) {
      getCampaignVersions();
    }
  }, [value]);

  const onChangeCampaignVersion = (e: any) => {
    onChange(
      e,
      campaignVersions.find((f: any) => f._id === e.target.value),
    );
  };

  const selectedCampaignVersion = () => {
    const selected = value
      ? campaignVersions.find((cpv: any) => cpv._id === value)
      : null;

    return selected;
  };

  return (
    <Dropdown
      ref={ref}
      filter
      showClear
      filterBy="name"
      id={id}
      value={value}
      onChange={onChangeCampaignVersion}
      options={campaignVersions}
      optionLabel="name"
      placeholder="Select the Campaign Version"
      disabled={disabled}
      className={classNames({
        'p-invalid': error,
      })}
    />
  );
}

export default React.forwardRef(DropdownCampaignVersion);
