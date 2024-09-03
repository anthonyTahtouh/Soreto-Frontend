/* eslint-disable no-lonely-if */
import React, { useState, useEffect } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { Dropdown } from 'primereact/dropdown';
import ResponsibleService from '../services/ResponsibleService';

function DropdownResponsible(
  { id, value, onChange, singleSelect, disabled = false }: any,
  ref: any,
) {
  const [responsible, setResponsible] = useState<any>([]);

  useEffect(() => {
    ResponsibleService.getAllOwner('')
      .then(response => {
        if (response) {
          const data: any[] = response.data.map((result: any) => ({
            name: `${result.firstName} ${result.lastName}`,
            value: result._id,
          }));

          setResponsible(data);
        }
      })
      .catch(error => {
        console.warn(error);
      });
  }, []);

  const onChangeResponsible = (e: any) => {
    onChange(e);
  };

  /// //////////////////////////////////////////////////
  //              Single Select
  /// //////////////////////////////////////////////////

  if (singleSelect) {
    const selectedResponsible =
      value || responsible.find((resp: any) => resp.value === value);
    return (
      <Dropdown
        filter
        showClear
        filterBy="name"
        id={id}
        disabled={disabled}
        value={selectedResponsible}
        onChange={onChangeResponsible}
        options={responsible}
        optionLabel="name"
        placeholder="Select One"
      />
    );
  }

  /// //////////////////////////////////////////////////
  //              MultiSelect
  /// //////////////////////////////////////////////////

  let selectedIdsResponsible = [];

  const getIds = (arrayOfIds: string[]) => {
    if (responsible.length === 0) return [];
    const arrayOfResponsible = arrayOfIds.map(_id => {
      return responsible.find((resp: any) => resp.value === _id).value;
    });

    return arrayOfResponsible;
  };

  if (
    !value ||
    !value.length ||
    value[0] === null ||
    (value.length === 1 && !value[0])
  ) {
    selectedIdsResponsible = [];
  } else {
    if (value[0]?._id) {
      selectedIdsResponsible = value;
    } else {
      selectedIdsResponsible = getIds(value);
    }
  }

  return (
    <MultiSelect
      ref={ref}
      filter
      showClear
      filterBy="name"
      id={id}
      disabled={disabled}
      value={selectedIdsResponsible}
      onChange={onChangeResponsible}
      options={responsible}
      optionLabel="name"
      placeholder="Select one or more"
    />
  );
}

export default React.forwardRef(DropdownResponsible);
