/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState, useContext } from 'react';
import { classNames } from 'primereact/utils';

import PrimeReact from 'primereact/api';
import MenuService from './services/MenuService';
import SoretoRoutes from './routes/SoretoRoutes';
import AppTopbar from './AppTopbar';
import AppBreadcrumb from './AppBreadcrumb';
import AppMenu from './AppMenu';
import AppConfig from './AppConfig';
import AppRightMenu from './AppRightMenu';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './App.scss';

export const RTLContext = React.createContext(false);

const App = () => {
  const [menuMode, setMenuMode] = useState('static');
  const [inlineMenuPosition, setInlineMenuPosition] = useState('bottom');
  const [desktopMenuActive, setDesktopMenuActive] = useState(true);
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const [activeTopbarItem, setActiveTopbarItem] = useState(null);
  const [colorMode, setColorMode] = useState('light');
  const [rightMenuActive, setRightMenuActive] = useState(false);
  const [menuActive, setMenuActive] = useState(false);
  const [inputStyle, setInputStyle] = useState('filled');
  const [isRTL, setRTL] = useState<boolean>(false);
  const [ripple, setRipple] = useState(true);
  const [mobileTopbarActive, setMobileTopbarActive] = useState(false);
  const [menuTheme, setMenuTheme] = useState('light');
  const [topbarTheme, setTopbarTheme] = useState('white');
  const [theme, setTheme] = useState('soreto');
  const [isInputBackgroundChanged, setIsInputBackgroundChanged] =
    useState(false);
  const [inlineMenuActive, setInlineMenuActive] = useState<any>({});
  const [newThemeLoaded, setNewThemeLoaded] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const currentInlineMenuKey = useRef('');
  PrimeReact.ripple = true;

  let searchClick: boolean;
  let topbarItemClick: boolean;
  let menuClick: boolean;
  let inlineMenuClick: boolean;

  const routes = [
    { parent: 'Marketplace', label: 'Dashboard' },
    { parent: 'Marketplace', label: 'Categories' },
    { parent: 'Marketplace', label: 'Categories Index' },
    { parent: 'Marketplace', label: 'Brands' },
    { parent: 'Marketplace', label: 'Brands Index' },
    { parent: 'Marketplace', label: 'Offers' },
    { parent: 'Marketplace', label: 'Offers Index' },
    { parent: 'Marketplace', label: 'Banners' },
    { parent: 'Marketplace', label: 'Blogs' },
    { parent: 'Marketplace', label: 'Blogs Index' },
    { parent: 'Marketplace', label: 'Notifications' },
    { parent: 'Marketplace', label: 'Wizard' },
    { parent: 'Marketplace', label: 'Dynamic Reward Pool' },
    { parent: 'Marketplace', label: 'Refresh' },
    { parent: 'Marketplace', label: 'Feeds' },
    { parent: 'Support', label: 'User Tracking Flow' },
    { parent: 'Support', label: 'Dynamic Reward Pool' },
    { parent: 'Support', label: 'Users Access' },
    { parent: 'Statistics', label: 'Tracking' },
  ];

  const hideOverlayMenu = () => {
    setMobileMenuActive(false);
    setDesktopMenuActive(false);
  };

  const isDesktop = () => {
    return window.innerWidth > 1024;
  };

  const isHorizontal = () => {
    return menuMode === 'horizontal';
  };

  const isSlim = () => {
    return menuMode === 'slim';
  };

  const isIE = () => {
    return /(MSIE|Trident\/|Edge\/)/i.test(window.navigator.userAgent);
  };

  const onMenuThemeChange = (themex: string) => {
    setMenuTheme(themex);
  };

  const onTopbarThemeChange = (themex: string) => {
    setTopbarTheme(themex);
  };

  const replaceLink = (linkElement: any, href: string, callback?: any) => {
    if (isIE()) {
      linkElement.setAttribute('href', href);

      if (callback) {
        callback();
      }
    } else {
      const id = linkElement.getAttribute('id');
      const cloneLinkElement = linkElement.cloneNode(true);

      cloneLinkElement.setAttribute('href', href);
      cloneLinkElement.setAttribute('id', `${id}-clone`);

      linkElement.parentNode.insertBefore(
        cloneLinkElement,
        linkElement.nextSibling,
      );

      cloneLinkElement.addEventListener('load', () => {
        linkElement.remove();
        cloneLinkElement.setAttribute('id', id);

        if (callback) {
          callback();
        }
      });
    }
  };

  const onThemeChange = (themex: string) => {
    setTheme(themex);
    const themeLink = document.getElementById('theme-css');
    const themeHref = `assets/theme/${themex}/theme-${colorMode}.css`;
    replaceLink(themeLink, themeHref);
  };

  const onColorModeChange = (mode: string) => {
    setColorMode(mode);
    setIsInputBackgroundChanged(true);

    if (isInputBackgroundChanged) {
      if (mode === 'dark') {
        setInputStyle('filled');
      } else {
        setInputStyle('outlined');
      }
    }

    if (mode === 'dark') {
      setMenuTheme('dark');
      setTopbarTheme('dark');
    } else {
      setMenuTheme('bluegrey');
      setTopbarTheme('white');
    }

    const layoutLink = document.getElementById('layout-css');
    const layoutHref = `/assets/layout/css/layout-${mode}.css`;
    replaceLink(layoutLink, layoutHref);

    const themeLink = document.getElementById('theme-css') as HTMLInputElement;
    const urlTokens = (themeLink.getAttribute('href') as string).split('/');
    urlTokens[urlTokens.length - 1] = `theme-${mode}.css`;
    const newURL = urlTokens.join('/');

    replaceLink(themeLink, newURL, () => {
      setNewThemeLoaded(true);
    });
  };

  const onInputStyleChange = (inputStylex: string) => {
    setInputStyle(inputStylex);
  };

  const onRipple = (e: any) => {
    PrimeReact.ripple = e.value;
    setRipple(e.value);
  };

  const onInlineMenuPositionChange = (mode: string) => {
    setInlineMenuPosition(mode);
  };

  const onMenuModeChange = (mode: string) => {
    setMenuMode(mode);
  };

  const onRTLChange = () => {
    setRTL(prevState => !prevState);
  };

  const onMenuClick = (event: any) => {
    menuClick = true;
  };

  const onMenuButtonClick = (event: Event) => {
    menuClick = true;

    if (isDesktop()) setDesktopMenuActive(prevState => !prevState);
    else setMobileMenuActive(prevState => !prevState);

    event.preventDefault();
  };

  const onTopbarItemClick = (event: any) => {
    topbarItemClick = true;
    if (activeTopbarItem === event.item) setActiveTopbarItem(null);
    else {
      setActiveTopbarItem(event.item);
    }

    event.originalEvent.preventDefault();
  };

  const onSearch = (event: any) => {
    searchClick = true;
    setSearchActive(event);
  };

  const onMenuItemClick = (event: any) => {
    if (!event.item.items && (menuMode === 'overlay' || !isDesktop())) {
      hideOverlayMenu();
    }

    if (!event.item.items && (isHorizontal() || isSlim())) {
      setMenuActive(false);
    }
  };

  const onRootMenuItemClick = (event: any) => {
    setMenuActive(prevState => !prevState);
  };

  const onRightMenuButtonClick = () => {
    setRightMenuActive(prevState => !prevState);
  };

  const onMobileTopbarButtonClick = (event: any) => {
    setMobileTopbarActive(prevState => !prevState);
    event.preventDefault();
  };

  const onDocumentClick = (event: any) => {
    if (!searchClick && event.target.localName !== 'input') {
      setSearchActive(false);
    }

    if (!topbarItemClick) {
      setActiveTopbarItem(null);
    }

    if (!menuClick && (menuMode === 'overlay' || !isDesktop())) {
      if (isHorizontal() || isSlim()) {
        setMenuActive(false);
      }
      hideOverlayMenu();
    }

    if (inlineMenuActive[currentInlineMenuKey.current] && !inlineMenuClick) {
      const menuKeys = { ...inlineMenuActive };
      menuKeys[currentInlineMenuKey.current] = false;
      setInlineMenuActive(menuKeys);
    }

    if (!menuClick && (isSlim() || isHorizontal())) {
      setMenuActive(false);
    }

    searchClick = false;
    topbarItemClick = false;
    inlineMenuClick = false;
    menuClick = false;
  };

  const onInlineMenuClick = (e: any, key: any) => {
    const menuKeys = { ...inlineMenuActive };
    if (key !== currentInlineMenuKey.current && currentInlineMenuKey.current) {
      menuKeys[currentInlineMenuKey.current] = false;
    }

    menuKeys[key] = !menuKeys[key];
    setInlineMenuActive(menuKeys);
    currentInlineMenuKey.current = key;
    inlineMenuClick = true;
  };

  useEffect(() => {
    if (menuMode === 'overlay') {
      hideOverlayMenu();
    }
    if (menuMode === 'static') {
      setDesktopMenuActive(true);
    }
  }, [menuMode]);

  useEffect(() => {
    onColorModeChange(colorMode);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const appLogoLink = document.getElementById('app-logo') as HTMLInputElement;

    if (
      topbarTheme === 'white' ||
      topbarTheme === 'yellow' ||
      topbarTheme === 'amber' ||
      topbarTheme === 'orange' ||
      topbarTheme === 'lime'
    ) {
      appLogoLink.src = '/assets/layout/images/soreto-logo-dark.svg';
    } else {
      appLogoLink.src = '/assets/layout/images/soreto-logo-light.svg';
    }
  }, [topbarTheme]);

  const layoutContainerClassName = classNames(
    'layout-wrapper ',
    `layout-menu-${menuTheme} layout-topbar-${topbarTheme}`,
    {
      'layout-menu-static': menuMode === 'static',
      'layout-menu-overlay': menuMode === 'overlay',
      'layout-menu-slim': menuMode === 'slim',
      'layout-menu-horizontal': menuMode === 'horizontal',
      'layout-menu-active': desktopMenuActive,
      'layout-menu-mobile-active': mobileMenuActive,
      'layout-topbar-mobile-active': mobileTopbarActive,
      'layout-rightmenu-active': rightMenuActive,
      'p-input-filled': inputStyle === 'filled',
      'p-ripple-disabled': !ripple,
      'layout-rtl': isRTL,
    },
  );

  return (
    <RTLContext.Provider value={isRTL}>
      <div
        role="button"
        tabIndex={0}
        className={layoutContainerClassName}
        onClick={onDocumentClick}
        onKeyDown={onDocumentClick}
      >
        <AppTopbar
          horizontal={isHorizontal()}
          activeTopbarItem={activeTopbarItem}
          onMenuButtonClick={onMenuButtonClick}
          onTopbarItemClick={onTopbarItemClick}
          onRightMenuButtonClick={onRightMenuButtonClick}
          onMobileTopbarButtonClick={onMobileTopbarButtonClick}
          mobileTopbarActive={mobileTopbarActive}
          searchActive={searchActive}
          onSearch={onSearch}
        />

        <div
          role="button"
          tabIndex={0}
          className="menu-wrapper"
          onClick={onMenuClick}
          onKeyDown={onMenuClick}
        >
          <div className="layout-menu-container">
            <AppMenu
              model={MenuService.buildByUserRole()}
              onMenuItemClick={onMenuItemClick}
              onRootMenuItemClick={onRootMenuItemClick}
              menuMode={menuMode}
              active={menuActive}
            />
          </div>
        </div>

        <div className="layout-main">
          <AppBreadcrumb routes={routes} />
          <div className="layout-content">
            <SoretoRoutes
              colorMode={colorMode}
              newThemeLoaded={newThemeLoaded}
              setNewThemeLoaded={setNewThemeLoaded}
            />
          </div>

          {/* <AppFooter colorMode={colorMode} /> */}
        </div>

        <AppConfig
          inputStyle={inputStyle}
          onInputStyleChange={onInputStyleChange}
          rippleEffect={ripple}
          onRippleEffect={onRipple}
          menuMode={menuMode}
          onMenuModeChange={onMenuModeChange}
          inlineMenuPosition={inlineMenuPosition}
          onInlineMenuPositionChange={onInlineMenuPositionChange}
          colorMode={colorMode}
          onColorModeChange={onColorModeChange}
          menuTheme={menuTheme}
          onMenuThemeChange={onMenuThemeChange}
          topbarTheme={topbarTheme}
          onTopbarThemeChange={onTopbarThemeChange}
          theme={theme}
          onThemeChange={onThemeChange}
          isRTL={isRTL}
          onRTLChange={onRTLChange}
        />

        <AppRightMenu
          rightMenuActive={rightMenuActive}
          onRightMenuButtonClick={onRightMenuButtonClick}
        />

        {mobileMenuActive && <div className="layout-mask modal-in" />}
      </div>
      )
    </RTLContext.Provider>
  );
};

export default App;
