import React, { useState, useEffect, useContext } from 'react';
import { classNames } from 'primereact/utils';
import { RadioButton } from 'primereact/radiobutton';
import { InputSwitch } from 'primereact/inputswitch';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { RTLContext } from './App';

const AppConfig = (props: any) => {
  const propsLocal = props;

  const [active, setActive] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(13);
  const isRTL = useContext(RTLContext);
  const scales = [12, 13, 14, 15, 16];

  const themes = [
    { name: 'indigo', color: '#2f8ee5' },
    { name: 'pink', color: '#E91E63' },
    { name: 'purple', color: '#9C27B0' },
    { name: 'deeppurple', color: '#673AB7' },
    { name: 'blue', color: '#2196F3' },
    { name: 'lightblue', color: '#03A9F4' },
    { name: 'cyan', color: '#00BCD4' },
    { name: 'teal', color: '#009688' },
    { name: 'green', color: '#4CAF50' },
    { name: 'lightgreen', color: '#8BC34A' },
    { name: 'lime', color: '#CDDC39' },
    { name: 'yellow', color: '#FFEB3B' },
    { name: 'amber', color: '#FFC107' },
    { name: 'orange', color: '#FF9800' },
    { name: 'deeporange', color: '#FF5722' },
    { name: 'brown', color: '#795548' },
    { name: 'bluegrey', color: '#607D8B' },
  ];

  const menuThemes = [
    { name: 'light', color: '#FDFEFF' },
    { name: 'dark', color: '#434B54' },
    { name: 'indigo', color: '#1A237E' },
    { name: 'bluegrey', color: '#37474F' },
    { name: 'brown', color: '#4E342E' },
    { name: 'cyan', color: '#006064' },
    { name: 'green', color: '#2E7D32' },
    { name: 'deeppurple', color: '#4527A0' },
    { name: 'deeporange', color: '#BF360C' },
    { name: 'pink', color: '#880E4F' },
    { name: 'purple', color: '#6A1B9A' },
    { name: 'teal', color: '#00695C' },
  ];

  const topbarThemes = [
    { name: 'lightblue', color: '#2E88FF' },
    { name: 'dark', color: '#363636' },
    { name: 'white', color: '#FDFEFF' },
    { name: 'blue', color: '#1565C0' },
    { name: 'deeppurple', color: '#4527A0' },
    { name: 'purple', color: '#6A1B9A' },
    { name: 'pink', color: '#AD1457' },
    { name: 'cyan', color: '#0097A7' },
    { name: 'teal', color: '#00796B' },
    { name: 'green', color: '#43A047' },
    { name: 'lightgreen', color: '#689F38' },
    { name: 'lime', color: '#AFB42B' },
    { name: 'yellow', color: '#FBC02D' },
    { name: 'amber', color: '#FFA000' },
    { name: 'orange', color: '#FB8C00' },
    { name: 'deeporange', color: '#D84315' },
    { name: 'brown', color: '#5D4037' },
    { name: 'grey', color: '#616161' },
    { name: 'bluegrey', color: '#546E7A' },
    { name: 'indigo', color: '#3F51B5' },
  ];

  const decrementScale = () => {
    setScale(prevState => prevState - 1);
  };

  const incrementScale = () => {
    setScale(prevState => prevState + 1);
  };

  const applyScale = () => {
    document.documentElement.style.fontSize = `${scale}px`;
  };

  useEffect(() => {
    applyScale();
  }, [scale]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Sidebar
        appendTo="self"
        visible={active}
        onHide={() => setActive(false)}
        position={isRTL ? 'left' : 'right'}
        blockScroll
        showCloseIcon={false}
        baseZIndex={1000}
        className="layout-config p-sidebar-sm fs-small p-p-0"
      >
        <div className="layout-config-panel p-d-flex p-flex-column">
          <div className="p-px-3 p-pt-3">
            <h5>Theme Customization</h5>
            <span>
              Ultima offers different themes for layout, topbar, menu etc.
            </span>
          </div>

          <hr className="p-mb-0" />

          <div className="layout-config-options p-p-3">
            <h6>Layout/Theme Scale</h6>
            <div className="p-d-flex p-ai-center">
              <Button
                type="button"
                icon="pi pi-minus"
                onClick={() => decrementScale()}
                className="p-button-rounded p-button-text"
                disabled={scale === scales[0]}
              />
              {scales.map((s, i) => {
                return (
                  <i
                    key={s.toString()}
                    className={classNames('pi pi-circle-on p-m-1 scale-icon', {
                      'scale-active': s === scale,
                    })}
                  />
                );
              })}
              <Button
                type="button"
                icon="pi pi-plus"
                onClick={() => incrementScale()}
                className="p-button-rounded p-button-text"
                disabled={scale === scales[scales.length - 1]}
              />
            </div>

            <h6>Layout Mode</h6>

            <div className="p-d-flex">
              <div className="p-d-flex p-ai-center">
                <RadioButton
                  id="light"
                  name="darkMenu"
                  value="light"
                  checked={propsLocal.colorMode === 'light'}
                  onChange={e => propsLocal.onColorModeChange(e.value)}
                />
                <label
                  htmlFor="light"
                  className={classNames({ 'p-ml-2': !isRTL, 'p-mr-2': isRTL })}
                >
                  Light
                </label>
              </div>
              <div
                className={classNames('p-d-flex p-ai-center', {
                  'p-ml-4': !isRTL,
                  'p-mr-4': isRTL,
                })}
              >
                <RadioButton
                  id="dark"
                  name="darkMenu"
                  value="dark"
                  checked={propsLocal.colorMode === 'dark'}
                  onChange={e => propsLocal.onColorModeChange(e.value)}
                />
                <label
                  htmlFor="dark"
                  className={classNames({ 'p-ml-2': !isRTL, 'p-mr-2': isRTL })}
                >
                  Dark
                </label>
              </div>
            </div>

            <h6>Menu Mode</h6>
            <div className="p-d-flex">
              <div className="p-d-flex p-flex-column">
                <div className="p-d-flex p-ai-center">
                  <RadioButton
                    id="static"
                    name="menuMode"
                    value="static"
                    checked={propsLocal.menuMode === 'static'}
                    onChange={e => propsLocal.onMenuModeChange(e.value)}
                  />
                  <label
                    htmlFor="static"
                    className={classNames({
                      'p-ml-2': !isRTL,
                      'p-mr-2': isRTL,
                    })}
                  >
                    Static
                  </label>
                </div>
                <div className="p-d-flex p-ai-center p-mt-3">
                  <RadioButton
                    id="horizontal"
                    name="menuMode"
                    value="horizontal"
                    checked={propsLocal.menuMode === 'horizontal'}
                    onChange={e => propsLocal.onMenuModeChange(e.value)}
                  />
                  <label
                    htmlFor="horizontal"
                    className={classNames({
                      'p-ml-2': !isRTL,
                      'p-mr-2': isRTL,
                    })}
                  >
                    Horizontal
                  </label>
                </div>
              </div>
              <div
                className={classNames('p-d-flex p-flex-column', {
                  'p-ml-4': !isRTL,
                  'p-mr-4': isRTL,
                })}
              >
                <div className="p-d-flex p-ai-center">
                  <RadioButton
                    id="overlay"
                    name="menuMode"
                    value="overlay"
                    checked={propsLocal.menuMode === 'overlay'}
                    onChange={e => propsLocal.onMenuModeChange(e.value)}
                  />
                  <label
                    htmlFor="overlay"
                    className={classNames({
                      'p-ml-2': !isRTL,
                      'p-mr-2': isRTL,
                    })}
                  >
                    Overlay
                  </label>
                </div>
                <div className="p-d-flex p-ai-center p-mt-3">
                  <RadioButton
                    id="slim"
                    name="menuMode"
                    value="slim"
                    checked={propsLocal.menuMode === 'slim'}
                    onChange={e => propsLocal.onMenuModeChange(e.value)}
                  />
                  <label
                    htmlFor="slim"
                    className={classNames({
                      'p-ml-2': !isRTL,
                      'p-mr-2': isRTL,
                    })}
                  >
                    Slim
                  </label>
                </div>
              </div>
            </div>

            <h6>Inline Menu Position</h6>
            <div className="p-d-flex">
              <div className="p-d-flex p-ai-center">
                <RadioButton
                  id="top"
                  name="inlineMenuPosition"
                  value="top"
                  checked={propsLocal.inlineMenuPosition === 'top'}
                  onChange={e => propsLocal.onInlineMenuPositionChange(e.value)}
                />
                <label
                  htmlFor="top"
                  className={classNames({ 'p-ml-2': !isRTL, 'p-mr-2': isRTL })}
                >
                  Top
                </label>
              </div>
              <div
                className={classNames('p-d-flex p-ai-center', {
                  'p-ml-4': !isRTL,
                  'p-mr-4': isRTL,
                })}
              >
                <RadioButton
                  id="bottom"
                  name="inlineMenuPosition"
                  value="bottom"
                  checked={propsLocal.inlineMenuPosition === 'bottom'}
                  onChange={e => propsLocal.onInlineMenuPositionChange(e.value)}
                />
                <label
                  htmlFor="bottom"
                  className={classNames({ 'p-ml-2': !isRTL, 'p-mr-2': isRTL })}
                >
                  Bottom
                </label>
              </div>
              <div
                className={classNames('p-d-flex p-ai-center', {
                  'p-ml-4': !isRTL,
                  'p-mr-4': isRTL,
                })}
              >
                <RadioButton
                  id="both"
                  name="inlineMenuPosition"
                  value="both"
                  checked={propsLocal.inlineMenuPosition === 'both'}
                  onChange={e => propsLocal.onInlineMenuPositionChange(e.value)}
                />
                <label
                  htmlFor="both"
                  className={classNames({ 'p-ml-2': !isRTL, 'p-mr-2': isRTL })}
                >
                  Both
                </label>
              </div>
            </div>

            <h6>Input Background</h6>
            <div className="p-formgroup-inline">
              <div className="p-d-flex">
                <div className="p-d-flex p-ai-center">
                  <RadioButton
                    id="input_outlined"
                    name="inputstyle"
                    value="outlined"
                    checked={propsLocal.inputStyle === 'outlined'}
                    onChange={e => propsLocal.onInputStyleChange(e.value)}
                  />
                  <label
                    htmlFor="input_outlined"
                    className={classNames({
                      'p-ml-2': !isRTL,
                      'p-mr-2': isRTL,
                    })}
                  >
                    Outlined
                  </label>
                </div>
                <div
                  className={classNames('p-d-flex p-ai-center', {
                    'p-ml-4': !isRTL,
                    'p-mr-4': isRTL,
                  })}
                >
                  <RadioButton
                    id="input_filled"
                    name="inputstyle"
                    value="filled"
                    checked={propsLocal.inputStyle === 'filled'}
                    onChange={e => propsLocal.onInputStyleChange(e.value)}
                  />
                  <label
                    htmlFor="input_filled"
                    className={classNames({
                      'p-ml-2': !isRTL,
                      'p-mr-2': isRTL,
                    })}
                  >
                    Filled
                  </label>
                </div>
              </div>
            </div>

            <h6>Ripple Effect</h6>
            <InputSwitch
              checked={propsLocal.rippleEffect}
              onChange={propsLocal.onRippleEffect}
            />

            <h6>RTL</h6>
            <InputSwitch
              checked={propsLocal.isRTL}
              onChange={propsLocal.onRTLChange}
            />

            <h6>Menu Themes</h6>
            {propsLocal.colorMode !== 'dark' && (
              <div className="p-grid">
                {menuThemes.map((t, i) => {
                  return (
                    <div key={t.name} className="p-col p-col-fixed">
                      <button
                        type="button"
                        style={{ cursor: 'pointer' }}
                        onClick={() => propsLocal.onMenuThemeChange(t.name)}
                        className="layout-config-color-option p-link"
                        title={t.name}
                      >
                        <span
                          className="color"
                          style={{ backgroundColor: t.color }}
                        />
                        {propsLocal.menuTheme === t.name && (
                          <span className="check p-d-flex p-ai-center p-jc-center">
                            <i
                              className="pi pi-check"
                              style={{ color: 'var(--menu-text-color)' }}
                            />
                          </span>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            {propsLocal.colorMode === 'dark' && (
              <p>
                Menu themes are only available in light mode by design as large
                surfaces can emit too much brightness in dark mode.
              </p>
            )}

            <h6>Topbar Themes</h6>
            <div className="p-grid">
              {topbarThemes.map((t, i) => {
                return (
                  <div key={t.name} className="p-col p-col-fixed">
                    <button
                      type="button"
                      style={{ cursor: 'pointer' }}
                      onClick={() => propsLocal.onTopbarThemeChange(t.name)}
                      className="layout-config-color-option p-link"
                      title={t.name}
                    >
                      <span
                        className="color"
                        style={{ backgroundColor: t.color }}
                      />
                      {propsLocal.topbarTheme === t.name && (
                        <span className="check p-d-flex p-ai-center p-jc-center">
                          <i
                            className="pi pi-check"
                            style={{ color: 'var(--topbar-text-color)' }}
                          />
                        </span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            <h6>Component Themes</h6>
            <div className="p-grid">
              {themes.map((t, i) => {
                return (
                  <div key={t.name} className="p-col p-col-fixed">
                    <button
                      type="button"
                      style={{ cursor: 'pointer' }}
                      onClick={() => propsLocal.onThemeChange(t.name)}
                      className="layout-config-color-option p-link"
                      title={t.name}
                    >
                      <span
                        className="color"
                        style={{ backgroundColor: t.color }}
                      />
                      {propsLocal.theme === t.name && (
                        <span className="check p-d-flex p-ai-center p-jc-center">
                          <i
                            className="pi pi-check"
                            style={{ color: 'var(--primary-color-text)' }}
                          />
                        </span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Sidebar>
      {!active && (
        <Button
          className="layout-config-button"
          icon="pi pi-cog p-button-icon"
          type="button"
          onClick={() => setActive(true)}
        />
      )}
    </>
  );
};

export default AppConfig;
