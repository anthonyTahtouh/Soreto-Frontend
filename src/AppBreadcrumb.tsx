import React, { useRef } from 'react';
import { Button } from 'primereact/button';
import { BreadCrumb } from 'primereact/breadcrumb';
import { useLocation } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import useStore from './hooks/useStore';

const AppBreadcrumb = (props: any) => {
  const propsLocal = props;
  const toast = useRef<any>(null);
  const { logout } = useStore();

  const location = useLocation();
  const pathname =
    location.pathname === '/'
      ? ['', '']
      : location.pathname.split('/').slice(1);

  const activeRoute = propsLocal.routes.filter((route: any) => {
    return (
      route.parent.replace(/\s/g, '').toLowerCase() === pathname[0] &&
      route.label.replace(/\s/g, '').toLowerCase() === pathname[1].toLowerCase()
    );
  });

  let model;

  if (!activeRoute.length) {
    model = [{ label: '' }];
  } else {
    model =
      activeRoute[0].parent === '' && activeRoute[0].label === ''
        ? [{ label: 'Dashboard' }]
        : [{ label: activeRoute[0].parent }, { label: activeRoute[0].label }];
  }

  const home = { icon: 'pi pi-home', url: '/' };

  const logoutUser = async () => {
    try {
      logout();
    } catch (err: any) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: err?.response?.data?.message,
        life: 30000,
      });
    }
  };

  return (
    <div className="layout-breadcrumb-container p-d-flex p-jc-between p-ai-center p-shadow-1">
      <Toast ref={toast} />
      <BreadCrumb
        model={model}
        home={home}
        className="layout-breadcrumb p-pl-4 p-py-2"
      />

      <div className="layout-breadcrumb-buttons p-d-flex p-ai-center p-pr-3">
        <Button
          type="button"
          icon="pi pi-cloud-upload"
          className="p-button p-button-rounded p-button-text p-button-plain p-mr-1"
        />
        <Button
          type="button"
          icon="pi pi-bookmark"
          className="p-button p-button-rounded p-button-text p-button-plain p-mr-1"
        />
        <Button
          type="button"
          icon="pi pi-power-off"
          className="p-button p-button-rounded p-button-text p-button-plain p-mr-1"
          onClick={() => {
            logoutUser();
          }}
        />
      </div>
    </div>
  );
};

export default AppBreadcrumb;
