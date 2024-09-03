import React from 'react';
import { Dropdown } from 'primereact/dropdown';

function DropdownMpFeedStatus(
  { id, value, onChange, className, options }: any,
  ref: any,
) {
  const onChangeStatus = (e: any) => {
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
      onChange={onChangeStatus}
      options={options}
      optionLabel="name"
      placeholder="Select the Status"
      className={className}
    />
  );
}

export default React.forwardRef(DropdownMpFeedStatus);
