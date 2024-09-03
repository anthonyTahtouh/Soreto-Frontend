/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { MegaMenu } from 'primereact/megamenu';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { CSSTransition } from 'react-transition-group';
import { RTLContext } from './App';

const AppTopbar = (props: any) => {
  const propLocal = props;
  const isRTL = useContext(RTLContext);
  const navigate = useNavigate();

  // Fixed for 6.1.0
  // eslint-disable-next-line
  const searchPanel = useRef<any>(null)

  // useEffect(() => {
  //   // Fixed for 6.1.0
  //   /* if (props.searchActive) {
  //           searchPanel.current.element.focus();
  //       } */
  // }, [props.searchActive]);

  const onInputKeydown = (event: any) => {
    const key = event.which;

    // escape, tab and enter
    if (key === 27 || key === 9 || key === 13) {
      propLocal.onSearch(false);
    }
  };

  const model = [{}];

  return (
    <div className="layout-topbar p-shadow-4">
      <div className="layout-topbar-left">
        <button
          type="button"
          style={{ cursor: 'pointer' }}
          className="layout-topbar-logo p-link"
          onClick={() => navigate('/', { replace: true })}
        >
          <img
            id="app-logo"
            src="assets/layout/images/logo-light.svg"
            alt="ultima-layout"
            style={{ height: '2.75rem' }}
          />
        </button>
        <button
          type="button"
          className="layout-menu-button p-shadow-6 p-link"
          onClick={propLocal.onMenuButtonClick}
        >
          <i className="pi pi-chevron-right" />
        </button>
        <button type="button" className="layout-topbar-mobile-button p-link">
          <i
            className="pi pi-ellipsis-v fs-large"
            onClick={propLocal.onMobileTopbarButtonClick}
            onKeyDown={propLocal.onMobileTopbarButtonClick}
            role="button"
            tabIndex={0}
          >
            {}
          </i>
        </button>
      </div>

      <div
        className={classNames('layout-topbar-right', {
          'layout-topbar-mobile-active': propLocal.mobileTopbarActive,
        })}
      >
        <div className="layout-topbar-actions-left">
          <MegaMenu model={model} className="layout-megamenu" />
        </div>
        <div className="layout-topbar-actions-right">
          <ul className="layout-topbar-items">
            <li className="layout-topbar-item layout-search-item">
              <CSSTransition
                classNames="p-toggleable"
                timeout={{ enter: 1000, exit: 450 }}
                in={propLocal.searchActive}
                unmountOnExit
              >
                <div className="layout-search-panel p-inputgroup">
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-search" />
                  </span>
                  <InputText
                    type="text"
                    placeholder="Search"
                    onKeyDown={onInputKeydown}
                  />
                  <span className="p-inputgroup-addon">
                    <Button
                      type="button"
                      icon="pi pi-times"
                      className="p-button-rounded p-button-text p-button-plain"
                      onClick={() => propLocal.onSearch(false)}
                    />
                  </span>
                </div>
              </CSSTransition>
            </li>

            <li className="layout-topbar-item notifications">
              <button
                type="button"
                className="layout-topbar-action rounded-circle p-link"
                onClick={event =>
                  propLocal.onTopbarItemClick({
                    originalEvent: event,
                    item: 'notifications',
                  })
                }
              >
                <span className="p-overlay-badge">
                  <i className="pi pi-bell fs-large" />
                  <span className="p-badge p-badge-warning p-badge-dot" />
                </span>
              </button>

              <CSSTransition
                classNames="p-toggleable"
                timeout={{ enter: 1000, exit: 450 }}
                in={propLocal.activeTopbarItem === 'notifications'}
                unmountOnExit
              >
                <ul className="layout-topbar-action-panel p-shadow-6 fadeInDown">
                  <li className="p-mb-3">
                    <span className="p-px-3 fs-small">
                      You have <b>4</b> new notifications
                    </span>
                  </li>
                  <li className="layout-topbar-action-item">
                    <div className="p-d-flex p-flex-row p-ai-center">
                      <img
                        src="assets/demo/images/avatar/avatar-1.png"
                        alt=""
                      />
                      <div
                        className={classNames('p-d-flex p-flex-column', {
                          'p-ml-3': !isRTL,
                          'p-mr-3': isRTL,
                        })}
                        style={{ flexGrow: 1 }}
                      >
                        <div className="p-d-flex p-ai-center p-jc-between p-mb-1">
                          <span className="fs-small p-text-bold">
                            Jerome Bell
                          </span>
                          <small>42 mins ago</small>
                        </div>
                        <span className="fs-small">
                          How to write content about your photographs?
                        </span>
                      </div>
                    </div>
                  </li>
                  <li className="layout-topbar-action-item">
                    <div className="p-d-flex p-flex-row p-ai-center">
                      <img
                        src="assets/demo/images/avatar/avatar-2.png"
                        alt=""
                      />
                      <div
                        className={classNames('p-d-flex p-flex-column', {
                          'p-ml-3': !isRTL,
                          'p-mr-3': isRTL,
                        })}
                        style={{ flexGrow: 1 }}
                      >
                        <div className="p-d-flex p-ai-center p-jc-between p-mb-1">
                          <span className="fs-small p-text-bold">
                            Cameron Williamson
                          </span>
                          <small>48 mins ago</small>
                        </div>
                        <span className="fs-small">
                          Start a blog to reach your creative peak.
                        </span>
                      </div>
                    </div>
                  </li>
                  <li className="layout-topbar-action-item">
                    <div className="p-d-flex p-flex-row p-ai-center">
                      <img
                        src="assets/demo/images/avatar/avatar-3.png"
                        alt=""
                      />
                      <div
                        className={classNames('p-d-flex p-flex-column', {
                          'p-ml-3': !isRTL,
                          'p-mr-3': isRTL,
                        })}
                        style={{ flexGrow: 1 }}
                      >
                        <div className="p-d-flex p-ai-center p-jc-between p-mb-1">
                          <span className="fs-small p-text-bold">
                            Anna Miles
                          </span>
                          <small>1 day ago</small>
                        </div>
                        <span className="fs-small">
                          Caring is the new marketing
                        </span>
                      </div>
                    </div>
                  </li>
                  <li className="layout-topbar-action-item">
                    <div className="p-d-flex p-flex-row p-ai-center">
                      <img
                        src="assets/demo/images/avatar/avatar-4.png"
                        alt=""
                      />
                      <div
                        className={classNames('p-d-flex p-flex-column', {
                          'p-ml-3': !isRTL,
                          'p-mr-3': isRTL,
                        })}
                        style={{ flexGrow: 1 }}
                      >
                        <div className="p-d-flex p-ai-center p-jc-between p-mb-1">
                          <span className="fs-small p-text-bold">
                            Arlene Mccoy
                          </span>
                          <small>4 day ago</small>
                        </div>
                        <span className="fs-small">
                          Starting your traveling blog with Vasco.
                        </span>
                      </div>
                    </div>
                  </li>
                </ul>
              </CSSTransition>
            </li>
            <li className="layout-topbar-item app">
              <button
                type="button"
                className="layout-topbar-action rounded-circle p-link"
                onClick={event =>
                  propLocal.onTopbarItemClick({
                    originalEvent: event,
                    item: 'apps',
                  })
                }
              >
                <i className="pi pi-table fs-large" />
              </button>

              <CSSTransition
                classNames="p-toggleable"
                timeout={{ enter: 1000, exit: 450 }}
                in={propLocal.activeTopbarItem === 'apps'}
                unmountOnExit
              >
                <div className="layout-topbar-action-panel p-shadow-6">
                  <div className="p-grid p-nogutter">
                    <div className="layout-topbar-action-item p-col-4">
                      <button
                        type="button"
                        className="p-d-flex p-ai-center p-flex-column text-color p-link"
                      >
                        <i className="pi pi-image action indigo-bgcolor white-color" />
                        <span>Products</span>
                      </button>
                    </div>
                    <div className="layout-topbar-action-item p-col-4">
                      <button
                        type="button"
                        className="p-d-flex p-ai-center p-flex-column text-color p-link"
                      >
                        <i className="pi pi-file-pdf action orange-bgcolor white-color" />
                        <span>Reports</span>
                      </button>
                    </div>
                    <div className="layout-topbar-action-item p-col-4">
                      <button
                        type="button"
                        className="p-d-flex p-ai-center p-flex-column text-color p-link"
                      >
                        <i className="pi pi-dollar action teal-bgcolor white-color" />
                        <span>Balance</span>
                      </button>
                    </div>
                    <div className="layout-topbar-action-item p-col-4">
                      <button
                        type="button"
                        className="p-d-flex p-ai-center p-flex-column text-color p-link"
                      >
                        <i className="pi pi-cog action pink-bgcolor white-color" />
                        <span>Settings</span>
                      </button>
                    </div>
                    <div className="layout-topbar-action-item p-col-4">
                      <button
                        type="button"
                        className="p-d-flex p-ai-center p-flex-column text-color p-link"
                      >
                        <i className="pi pi-key action bluegrey-bgcolor white-color" />
                        <span>Credentials</span>
                      </button>
                    </div>
                    <div className="layout-topbar-action-item p-col-4">
                      <button
                        type="button"
                        className="p-d-flex p-ai-center p-jc-center p-flex-column text-color p-link"
                      >
                        <i className="pi pi-sitemap action cyan-bgcolor white-color" />
                        <span>Sitemap</span>
                      </button>
                    </div>
                  </div>
                </div>
              </CSSTransition>
            </li>
            <li className="layout-topbar-item">
              <button
                type="button"
                className="layout-topbar-action p-d-flex p-dir-row p-jc-center p-ai-center p-px-2 rounded-circle p-link"
                onClick={event =>
                  propLocal.onTopbarItemClick({
                    originalEvent: event,
                    item: 'profile',
                  })
                }
              >
                <img
                  src="/assets/demo/images/avatar/amyelsner.png"
                  alt="avatar"
                  style={{ width: '32px', height: '32px' }}
                />
              </button>

              <CSSTransition
                classNames="p-toggleable"
                timeout={{ enter: 1000, exit: 450 }}
                in={propLocal.activeTopbarItem === 'profile'}
                unmountOnExit
              >
                <ul className="layout-topbar-action-panel p-shadow-6">
                  <li className="layout-topbar-action-item">
                    <button
                      type="button"
                      className="p-d-flex p-flex-row p-ai-center p-link"
                    >
                      <i
                        className={classNames('pi pi-cog', {
                          'p-mr-2': !isRTL,
                          'p-ml-2': isRTL,
                        })}
                      />
                      <span>Settings</span>
                    </button>
                  </li>
                  <li className="layout-topbar-action-item">
                    <button
                      type="button"
                      className="p-d-flex p-flex-row p-ai-center p-link"
                    >
                      <i
                        className={classNames('pi pi-file-o', {
                          'p-mr-2': !isRTL,
                          'p-ml-2': isRTL,
                        })}
                      />
                      <span>Terms of Usage</span>
                    </button>
                  </li>
                  <li className="layout-topbar-action-item ">
                    <button
                      type="button"
                      className="p-d-flex p-flex-row p-ai-center p-link"
                    >
                      <i
                        className={classNames('pi pi-compass', {
                          'p-mr-2': !isRTL,
                          'p-ml-2': isRTL,
                        })}
                      />
                      <span>Support</span>
                    </button>
                  </li>
                  <li className="layout-topbar-action-item">
                    <button
                      type="button"
                      className="p-d-flex p-flex-row p-ai-center p-link"
                    >
                      <i
                        className={classNames('pi pi-power-off', {
                          'p-mr-2': !isRTL,
                          'p-ml-2': isRTL,
                        })}
                      />
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              </CSSTransition>
            </li>
            <li className="layout-topbar-item">
              <button
                type="button"
                className="layout-topbar-action rounded-circle p-link"
                onClick={propLocal.onRightMenuButtonClick}
              >
                <i className="pi fs-large pi-arrow-left" />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AppTopbar;
