import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import React, { useEffect, useState } from 'react';
import FlashCampaignService from '../services/FlashCampaignService';

interface IDropdownFlashCampaign {
  id: string;
  value: any;
  onChange(e: Event): void;
  singleSelect: boolean;
}

interface IValue {
  _id: string;
  name: string;
  singleSelect: boolean;
}
const DropdownFlashCampaing = ({
  id,
  value,
  onChange,
  singleSelect,
}: IDropdownFlashCampaign) => {
  const [flashCampaigns, setFlashCampaigns] = useState<IValue[]>([]);
  const getFlashCampaigns = async () => {
    try {
      const listOfFlashCampaign = await FlashCampaignService.getFlashCampaigns(
        '',
      );
      setFlashCampaigns(listOfFlashCampaign.resultData.page);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getFlashCampaigns();
  }, []);

  const onChangeFlashCampaign = (e: any) => {
    onChange(e);
  };

  const getVisibilityTagFromIds = (arrayOfIds: any[]) => {
    if (arrayOfIds.length > 0) {
      const arrayOfVisibilityTags = (arrayOfIds as unknown as IValue[]).map(
        visibilityId => {
          return flashCampaigns.find(
            (currentVisibility: any) => currentVisibility._id === visibilityId,
          );
        },
      );
      return arrayOfVisibilityTags;
    }
    return [];
  };

  if (singleSelect) {
    const selectedFlashCampaign = value?._id
      ? value
      : flashCampaigns.find((item: any) => item._id === value);
    return (
      <Dropdown
        filter
        showClear
        filterBy="name"
        id={id}
        value={selectedFlashCampaign}
        onChange={onChangeFlashCampaign}
        options={flashCampaigns}
        optionLabel="name"
        placeholder="Select flash campaign"
      />
    );
  }

  let selectedVisibilityTag: IValue[] | any;

  if (
    !value ||
    !value.length ||
    value[0] === null ||
    (value.length === 1 && !value[0])
  ) {
    selectedVisibilityTag = [];
  } else if (value[0]?._id) {
    selectedVisibilityTag = value;
  } else {
    selectedVisibilityTag = getVisibilityTagFromIds(value);
  }
  return (
    <div>
      <MultiSelect
        // ref={ref}
        filter
        showClear
        filterBy="name"
        id={id}
        value={selectedVisibilityTag}
        onChange={onChangeFlashCampaign}
        options={flashCampaigns}
        optionLabel="name"
        placeholder="Select flash campaign"
      />
    </div>
  );
};

export default React.forwardRef(DropdownFlashCampaing);
