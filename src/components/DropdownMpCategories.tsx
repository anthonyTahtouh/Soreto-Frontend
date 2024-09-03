/* eslint-disable no-lonely-if */
import React, { useState, useEffect } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import CategoryService from '../services/CategoryService';

function DropdownMpCategories(
  { id, value, onChange, singleSelect, disabled = false }: any,
  ref: any,
) {
  const [categories, setCategories] = useState<any>([]);

  // fetch avaible categories
  useEffect(() => {
    CategoryService.getCategories('').then(response => {
      setCategories(response?.resultData?.page);
    });
  }, []);

  const onChangeCategories = (e: any) => {
    // Update field values
    onChange(e);
  };

  /// //////////////////////////////////////////////////
  //              Single Select
  /// //////////////////////////////////////////////////

  if (singleSelect) {
    const selectedCategory = value?._id
      ? value
      : categories.find((category: any) => category._id === value);
    return (
      <Dropdown
        filter
        showClear
        filterBy="name"
        id={id}
        disabled={disabled}
        value={selectedCategory}
        onChange={onChangeCategories}
        options={categories}
        optionLabel="name"
        placeholder="Select the Category"
      />
    );
  }

  /// //////////////////////////////////////////////////
  //              MultiSelect
  /// //////////////////////////////////////////////////

  let selectedCategories = [];

  const getCategoriesFromIds = (arrayOfIds: string[]) => {
    const arrayOfCategories = arrayOfIds.map(catId => {
      return categories.find((category: any) => category._id === catId);
    });
    return arrayOfCategories;
  };

  // When data comes from the backend or from the user activity
  // When value = [] or value = [null] (happens when there is no category coming from the backend)
  if (
    !value ||
    !value.length ||
    value[0] === null ||
    (value.length === 1 && !value[0])
  ) {
    selectedCategories = [];
  } else {
    // There is data coming from the component or backend

    // Array of categories, happens when user clicks on categories. Data comes from the component component
    if (value[0]?._id) {
      selectedCategories = value;
    } else {
      // Array of ids, happens when data comes from the backend
      selectedCategories = getCategoriesFromIds(value);
    }
  }
  // When the user removes the last selected item, value is undefined

  return (
    <div>
      <MultiSelect
        ref={ref}
        filter
        showClear
        filterBy="name"
        id={id}
        disabled={disabled}
        value={selectedCategories}
        onChange={onChangeCategories}
        options={categories}
        optionLabel="name"
        placeholder="Select the Categories"
      />
    </div>
  );
}

export default React.forwardRef(DropdownMpCategories);
