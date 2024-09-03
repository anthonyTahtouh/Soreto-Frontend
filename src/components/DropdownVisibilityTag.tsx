import React from 'react';
import { MultiSelect } from 'primereact/multiselect';

function DropdownVisibilityTag({ id, value, onChange }: any, ref: any) {
  const visibilityTag = [
    { name: 'USER_LOGGED_IN', _id: 'USER_LOGGED_IN' },
    { name: 'USER_NOT_LOGGED_IN', _id: 'USER_NOT_LOGGED_IN' },
    { name: 'USER_RECENTLY_REGISTERED', _id: 'USER_RECENTLY_REGISTERED' },
    { name: 'FAVOURITED_ITEM', _id: 'FAVOURITED_ITEM' },
  ];

  let selectedVisibilityTag = [];

  const onChangeVisibilityTag = (e: any) => {
    onChange(e);
  };

  const getVisibilityTagFromIds = (arrayOfIds: string[]) => {
    const arrayOfVisibilityTags = arrayOfIds.map(visibilityId => {
      return visibilityTag.find(
        (currentVisibility: any) => currentVisibility._id === visibilityId,
      );
    });
    return arrayOfVisibilityTags;
  };

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
    // Array of ids, happens when data comes from the backend
    selectedVisibilityTag = getVisibilityTagFromIds(value);
  }

  return (
    <div>
      <MultiSelect
        ref={ref}
        filter
        showClear
        filterBy="name"
        id={id}
        value={selectedVisibilityTag}
        onChange={onChangeVisibilityTag}
        options={visibilityTag}
        optionLabel="name"
        placeholder="Select the Visibility Tag"
      />
    </div>
  );
}

export default React.forwardRef(DropdownVisibilityTag);
