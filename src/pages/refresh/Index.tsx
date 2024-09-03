/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState, useEffect } from 'react';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import RefreshService from '../../services/RefreshService';

function Index() {
  const toast = useRef<any>(null);

  const vanish = async () => {
    try {
      await RefreshService.vanishCollections();
      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Vanish executed',
        life: 3000,
      });
    } catch (error: any) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.message,
        life: 30000,
      });
    }
  };

  const charge = async () => {
    try {
      await RefreshService.fillCollections();
      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'The recharge was requested. It will take a while to finish.',
        life: 3000,
      });
    } catch (error: any) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.message,
        life: 3000,
      });
    }
  };

  const leftToolbarTemplate = () => {
    return (
      <>
        <Button
          label="Vanish"
          icon="pi pi-times"
          className="p-button-danger p-mr-2 p-mb-2"
          onClick={vanish}
        />
        <Button
          label="Charge"
          icon="pi pi-upload"
          className="p-button-success p-mb-2"
          onClick={charge}
        />
      </>
    );
  };

  return (
    <div className="p-grid crud-demo">
      <div className="p-col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar className="p-mb-4 p-toolbar" left={leftToolbarTemplate} />
        </div>
      </div>
    </div>
  );
}

export default Index;
