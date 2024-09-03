import React, { useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { classNames } from 'primereact/utils';
import { CSSTransition } from 'react-transition-group';
import { Ripple } from 'primereact/ripple';
import { Tooltip } from 'primereact/tooltip';

const AppSubmenu = (props: any) => {
  const [activeIndex, setActiveIndex] = useState<any>(null);

  const propsLocal = props;

  const getInk = (el: any) => {
    for (let i = 0; i < el.children.length; i += 1) {
      if (
        typeof el.children[i].className === 'string' &&
        el.children[i].className.indexOf('p-ink') !== -1
      ) {
        return el.children[i];
      }
    }
    return null;
  };

  const removeClass = (element: any, className: string) => {
    const elementLocal = element;

    if (element.classList) element.classList.remove(className);
    else
      elementLocal.className = elementLocal.className.replace(
        new RegExp(`(^|\\b)${className.split(' ').join('|')}(\\b|$)`, 'gi'),
        ' ',
      );
  };

  const isHorizontalOrSlim = useCallback(() => {
    return (
      propsLocal.menuMode === 'horizontal' || propsLocal.menuMode === 'slim'
    );
  }, [propsLocal.menuMode]);

  const onMenuItemClick = (event: any, item: any, index: any) => {
    if (item.disabled) {
      event.preventDefault();
      return true;
    }

    if (propsLocal.root && propsLocal.onRootItemClick) {
      propsLocal.onRootItemClick({
        originalEvent: event,
        item,
      });
    }

    // execute command
    if (item.command) {
      item.command({ originalEvent: event, item });
      event.preventDefault();
    }

    if (item.items) {
      setActiveIndex(activeIndex === index ? null : index);
    } else if (propsLocal.menuMode !== 'static') {
      const ink = getInk(event.currentTarget);
      if (ink) {
        removeClass(ink, 'p-ink-active');
      }
    }

    if (propsLocal.onMenuItemClick) {
      propsLocal.onMenuItemClick({
        originalEvent: event,
        item,
      });
    }

    return false;
  };

  const isMobile = useCallback(() => {
    return window.innerWidth < 1025;
  }, []);

  const isHorizontal = () => {
    return propsLocal.menuMode === 'horizontal';
  };
  const isSlim = () => {
    return propsLocal.menuMode === 'slim';
  };

  const onMenuItemMouseEnter = (index: any) => {
    if (
      propsLocal.root &&
      propsLocal.menuActive &&
      isHorizontalOrSlim() &&
      !isMobile()
    ) {
      setActiveIndex(index);
    }
  };

  const visible = (item: any) => {
    return typeof item.visible === 'function'
      ? item.visible()
      : item.visible !== false;
  };

  useEffect(() => {
    if (!propsLocal.menuActive && isHorizontalOrSlim() && !isMobile()) {
      setActiveIndex(null);
    }
  }, [propsLocal.menuActive, isHorizontalOrSlim, isMobile]);

  const getLink = (item: any, index: any) => {
    const menuitemIconClassName = classNames('layout-menuitem-icon', item.icon);
    const badgeClassName = classNames(
      'p-badge p-component p-badge-no-gutter',
      item.badgeClassName,
    );
    const content = (
      <>
        <i className={menuitemIconClassName} />
        <span className="layout-menuitem-text">{item.label}</span>
        {item.badge && <span className={badgeClassName}>{item.badge}</span>}
        {item.items && (
          <i className="pi pi-fw pi-angle-down layout-submenu-toggler" />
        )}
        <Ripple />
      </>
    );
    const commonLinkProps = {
      style: item.style,
      className: classNames(item.className, 'p-ripple tooltip', {
        'p-disabled': item.disabled,
        'p-link': !item.to,
      }),
      target: item.target,
      onClick: (e: React.SyntheticEvent) => onMenuItemClick(e, item, index),
      onMouseEnter: () => onMenuItemMouseEnter(index),
    };

    if (item.url) {
      return (
        <a
          data-pr-tooltip={propsLocal.root && item.label}
          href={item.url}
          rel="noopener noreferrer"
          style={item.style}
          className={classNames(item.className, 'p-ripple tooltip', {
            'p-disabled': item.disabled,
            'p-link': !item.to,
          })}
          target={item.target}
          onClick={(e: React.SyntheticEvent) => onMenuItemClick(e, item, index)}
          onMouseEnter={() => onMenuItemMouseEnter(index)}
        >
          {content}
        </a>
      );
    }
    if (!item.to) {
      return (
        <a
          data-pr-tooltip={propsLocal.root && item.label}
          type="button"
          href={item.href}
          style={item.style}
          className={classNames(item.className, 'p-ripple tooltip', {
            'p-disabled': item.disabled,
            'p-link': !item.to,
          })}
          target={item.target}
          onClick={(e: React.SyntheticEvent) => onMenuItemClick(e, item, index)}
          onMouseEnter={() => onMenuItemMouseEnter(index)}
        >
          {content}
        </a>
      );
    }

    return (
      <NavLink
        data-pr-tooltip={propsLocal.root && item.label}
        to={item.to}
        style={item.style}
        className={classNames(item.className, 'p-ripple tooltip', {
          'p-disabled': item.disabled,
          'p-link': !item.to,
        })}
        target={item.target}
        onClick={(e: React.SyntheticEvent) => onMenuItemClick(e, item, index)}
        onMouseEnter={() => onMenuItemMouseEnter(index)}
      >
        {content}
      </NavLink>
    );
  };

  const getItems = () => {
    const transitionTimeout = propsLocal.root ? 0 : { enter: 1000, exit: 450 };
    return propsLocal.items.map((item: any, i: any) => {
      if (visible(item)) {
        const active = activeIndex === i;
        const styleClass = classNames(
          item.badgeStyleClass,
          { 'active-menuitem': active },
          { 'layout-root-menuitem': propsLocal.root },
        );
        const link = getLink(item, i);
        const tooltip = propsLocal.root && (
          <div>
            <span
              className="layout-menuitem-text"
              style={{ textTransform: 'uppercase' }}
            >
              {item.label}
            </span>
          </div>
        );

        return (
          <li key={item.label || i} className={styleClass} role="menuitem">
            {link}
            {tooltip}
            <CSSTransition
              classNames="layout-submenu-container"
              timeout={transitionTimeout}
              in={
                item.items &&
                (propsLocal.root &&
                !(
                  (isHorizontal() || isSlim()) &&
                  !isMobile() &&
                  (!isSlim() || (isSlim() && activeIndex !== null))
                )
                  ? true
                  : active)
              }
              unmountOnExit
            >
              <AppSubmenu
                items={visible(item) && item.items}
                onMenuItemClick={propsLocal.onMenuItemClick}
                menuMode={propsLocal.menuMode}
                menuActive={propsLocal.menuActive}
                parentMenuItemActive={active}
              />
            </CSSTransition>
          </li>
        );
      }

      return null;
    });
  };

  if (!propsLocal.items) {
    return null;
  }

  const items = getItems();

  return (
    <>
      <ul role="menu" className={propsLocal.className}>
        {items}
      </ul>
      {isSlim() && propsLocal.root && (
        <Tooltip target="li:not(.active-menuitem)>.tooltip" />
      )}
    </>
  );
};

const AppMenu = (props: any) => {
  const propsLocal = props;

  return (
    <AppSubmenu
      items={propsLocal.model}
      className="layout-menu"
      menuActive={propsLocal.active}
      onRootItemClick={propsLocal.onRootMenuItemClick}
      onMenuItemClick={propsLocal.onMenuItemClick}
      root
      menuMode={propsLocal.menuMode}
      parentMenuItemActive
    />
  );
};

export default AppMenu;
