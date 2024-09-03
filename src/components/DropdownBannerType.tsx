import React from 'react';
import { Dropdown } from 'primereact/dropdown';

function DropdownType({ id, value, onChange }: any, ref: any) {
  const types = [
    { value: 'CONTAINED', id: 'Contained' },
    { value: 'FULLSIZE', id: 'FullSize' },
  ];

  const selectedType = types.find((type: any) => type.id === value);
  const placeHolderType = value || 'Select the type';

  const onChangeType = (e: any) => {
    onChange(e);
  };

  return (
    <div className="p-d-flex p-flex-column">
      <div className="p-formgrid p-grid">
        <>
          <div className="p-field p-col">
            <Dropdown
              ref={ref}
              filter
              showClear
              filterBy="value"
              id={id}
              value={selectedType}
              onChange={onChangeType}
              options={types}
              optionLabel="value"
              placeholder={placeHolderType}
            />
          </div>
        </>
      </div>
    </div>
  );
}

export default React.forwardRef(DropdownType);
