/* eslint-disable react/require-default-props */
import React, { useRef, useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import ClientService from '../services/ClientService';

interface IDropdownClient {
  id: string;
  value?: string;
  onChange?: any;
  className?: any;
  disabled?: boolean;
  placeholder?: string;
}

function DropdownClients(
  { id, value, onChange, className, disabled, placeholder }: IDropdownClient,
  ref: any,
) {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    ClientService.getAllClients('?$sort=name').then(response => {
      const clientsArray = response.data.map((client: any) => ({
        ...client,
        label: client.name,
        value: client._id,
      }));
      setClients(clientsArray);
    });
  }, []);

  const onChangeClient = (e: any) => {
    onChange(e);
  };

  return (
    <div className="w-full">
      <Dropdown
        ref={ref}
        filter
        showClear
        filterBy="name"
        id={id}
        value={value}
        disabled={disabled}
        onChange={onChangeClient}
        options={clients}
        optionLabel="name"
        className={className}
        placeholder={
          placeholder && placeholder !== '' ? placeholder : 'Select One'
        }
      />
    </div>
  );
}

export default React.forwardRef(DropdownClients);
