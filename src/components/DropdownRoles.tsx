/* eslint-disable react/require-default-props */
import React, { useRef, useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import RoleService from '../services/RoleService';

interface IDropdownRoles {
  id: string;
  value?: string;
  onChange?: any;
  className?: any;
  disabled?: boolean;
  placeholder?: string;
  name?: string;
}

function DropdownRoles(
  {
    id,
    value,
    onChange,
    name,
    className,
    disabled,
    placeholder,
  }: IDropdownRoles,
  ref: any,
) {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    RoleService.getAll('').then(response => {
      const rolesArray = response.data.map((role: any) => ({
        ...role,
        label: role.name,
        value: role._id,
      }));
      setRoles(rolesArray);
    });
  }, []);

  const onChangeRole = (e: any) => {
    const currentName: any = roles.find((role: any) => role._id === e.value);
    e.target.name = currentName?.name;
    onChange(e);
  };

  return (
    <div className="w-full">
      <Dropdown
        ref={ref}
        filter
        showClear
        name={name}
        filterBy="name"
        id={id}
        value={value}
        disabled={disabled}
        onChange={onChangeRole}
        options={roles}
        optionLabel="name"
        className={className}
        placeholder={
          placeholder && placeholder !== '' ? placeholder : 'Select One'
        }
      />
    </div>
  );
}

export default React.forwardRef(DropdownRoles);
