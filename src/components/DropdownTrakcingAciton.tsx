import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';

function DropdownTrakcingAciton({ id, onChange, className }: any, ref: any) {
  const actions = [{ name: 'page-view', _id: 'page-view' }];
  const [selectedAction, setSelectedAction] = useState<any>(actions[0]);

  const onChangeAction = (e: any) => {
    setSelectedAction(e.target.value);
    onChange(e);
  };

  return (
    <Dropdown
      ref={ref}
      filter
      showClear
      filterBy="name"
      id={id}
      value={selectedAction}
      onChange={onChangeAction}
      options={actions}
      optionLabel="name"
      placeholder="Select the Action"
      className={className}
    />
  );
}

export default React.forwardRef(DropdownTrakcingAciton);
