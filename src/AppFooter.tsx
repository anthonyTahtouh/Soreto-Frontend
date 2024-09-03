import React, { useContext } from 'react';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { RTLContext } from './App';

const AppFooter = (props: any) => {
  const isRTL = useContext(RTLContext);

  const propsLocal = props;

  return (
    <div className="layout-footer p-d-flex p-ai-center p-p-3 p-shadow-2">
      <img
        height="40"
        id="footer-logo"
        src={`/assets/layout/images/soreto-logo-${
          propsLocal.colorMode === 'light' ? 'dark' : 'light'
        }.svg`}
        alt="soreto-footer-logo"
      />
      <Button
        type="button"
        icon="pi pi-facebook fs-large"
        className={classNames('p-button-rounded p-button-text p-button-plain', {
          'p-ml-auto p-mr-2': !isRTL,
          'p-ml-2': isRTL,
        })}
      />
      <Button
        type="button"
        icon="pi pi-twitter fs-large"
        className={classNames('p-button-rounded p-button-text p-button-plain', {
          'p-mr-2': !isRTL,
          'p-ml-2': isRTL,
        })}
      />
    </div>
  );
};

export default AppFooter;
