/* eslint-disable react/require-default-props */
import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import RewardService from '../services/RewardService';
import { Reward } from '../models/Reward';

interface ComponentReward {
  label: string;
  name: string;
  value: string;
  clientId: string | undefined;
}

interface DropdownRewardsProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  clientId?: string | undefined;
  className: string | undefined;
}

function DropdownRewards(
  { id, value, onChange, clientId, className }: DropdownRewardsProps,
  ref: any,
) {
  const [rewards, setRewards] = useState<ComponentReward[]>([]);

  useEffect(() => {
    RewardService.getRewards(clientId).then(data => {
      const databaseRewards: ComponentReward[] = data.page.map(
        (reward: Reward) => ({
          label: `${reward.name} - ${reward._id}`,
          name: reward.name,
          value: reward._id,
          clientId: reward.clientId,
        }),
      );
      setRewards(databaseRewards);
    });
  }, []);

  const getItemTemplate = (item: any) => {
    return (
      <div>
        <div>
          <b>Name:</b> {item.name}
        </div>
        <span>
          <b>ID:</b> {item.value}
        </span>
      </div>
    );
  };

  const onChangeRewards = (e: any) => {
    onChange(e);
  };

  return (
    <Dropdown
      ref={ref}
      filter
      showClear
      filterBy="name"
      id={id}
      itemTemplate={getItemTemplate}
      value={value}
      onChange={onChangeRewards}
      options={rewards}
      optionLabel="name"
      placeholder="Select the Reward"
      className={className}
    />
  );
}

export default React.forwardRef(DropdownRewards);
