const { REACT_APP_LEGACY_ADM_URL } = process.env;
export default class MenuService {
  static buildByUserRole(role?: string) {
    return [
      // {
      //   label: 'Marketplace',
      //   icon: 'pi pi-fw pi-home',
      //   items: [
      //     {
      //       label: 'Dashboard',
      //       icon: 'pi pi-fw pi-home',
      //       to: '/',
      //     },
      //     {
      //       label: 'Categories',
      //       icon: 'pi pi-fw pi-pencil',
      //       to: '/marketplace/categories',
      //       badgeClassName: 'p-badge-info',
      //     },
      //     {
      //       label: 'Categories Index',
      //       icon: 'pi pi-fw pi-pencil',
      //       to: '/marketplace/categoriesIndex',
      //       badgeClassName: 'p-badge-info',
      //     },
      //     {
      //       label: 'Brands',
      //       icon: 'pi pi-fw pi-pencil',
      //       to: '/marketplace/brands',
      //       badgeClassName: 'p-badge-info',
      //     },
      //     {
      //       label: 'Brands Index',
      //       icon: 'pi pi-fw pi-pencil',
      //       to: '/marketplace/brandsIndex',
      //       badgeClassName: 'p-badge-info',
      //     },
      //     {
      //       label: 'Offers',
      //       icon: 'pi pi-fw pi-pencil',
      //       to: '/marketplace/offers',
      //       badgeClassName: 'p-badge-warning',
      //     },
      //     {
      //       label: 'Offers Index',
      //       icon: 'pi pi-fw pi-pencil',
      //       to: '/marketplace/offersIndex',
      //       badgeClassName: 'p-badge-warning',
      //     },
      //     {
      //       label: 'Banners',
      //       icon: 'pi pi-fw pi-pencil',
      //       to: '/marketplace/banners',
      //       badgeClassName: 'p-badge-info',
      //     },
      //     {
      //       label: 'Blogs',
      //       icon: 'pi pi-fw pi-pencil',
      //       to: '/marketplace/blogs',
      //       badgeClassName: 'p-badge-warning',
      //     },
      //     {
      //       label: 'Blogs Index',
      //       icon: 'pi pi-fw pi-pencil',
      //       to: '/marketplace/blogsIndex',
      //       badgeClassName: 'p-badge-warning',
      //     },
      //     {
      //       label: 'Notifications',
      //       icon: 'pi pi-fw pi-pencil',
      //       to: '/marketplace/notifications',
      //       badge: '3',
      //       badgeClassName: 'p-badge-warning',
      //     },
      //     {
      //       label: 'Wizard',
      //       icon: 'pi pi-fw pi-pencil',
      //       to: '/marketplace/wizard',
      //     },
      //     {
      //       label: 'Flash Campaign',
      //       icon: 'pi pi-fw pi-pencil',
      //       to: '/marketplace/flashCampaign',
      //       badgeClassName: 'p-badge-info',
      //     },
      //     {
      //       label: 'Refresh',
      //       icon: 'pi pi-fw pi-refresh',
      //       to: '/marketplace/refresh',
      //     },
      //     {
      //       label: 'Operations',
      //       icon: 'pi pi-fw pi-bars',
      //       badgeClassName: 'p-badge-warning',
      //       items: [
      //         {
      //           label: 'Feeds',
      //           icon: 'pi pi-fw pi-pencil',
      //           to: '/marketplace/operations/feeds',
      //           badgeClassName: 'p-badge-warning',
      //         },
      //       ],
      //     },
      //   ],
      // },
      {
        label: 'Statistics',
        icon: 'pi pi-fw pi-star',
        items: [
          {
            label: 'Client Stats',
            icon: 'pi pi-fw pi-id-card',
            href: `${REACT_APP_LEGACY_ADM_URL}/admin/reports/liveStats`,
            badgeClassName: 'p-badge-warning',
          },
          {
            label: 'Tracking',
            icon: 'pi pi-fw pi-id-card',
            href: `/statistics/tracking`,
            badgeClassName: 'p-badge-warning',
          },
        ],
      },
      {
        label: 'Support',
        icon: 'pi pi-fw pi-star',
        items: [
          {
            label: 'Client Explorer',
            icon: 'pi pi-fw pi-id-card',
            href: `${REACT_APP_LEGACY_ADM_URL}/admin/explorer`,
            badge: '6',
            badgeClassName: 'p-badge-info',
          },
          {
            label: 'User Tracking Flow',
            icon: 'pi pi-fw pi-id-card',
            href: `/support/usertrackingflow`,
          },
          {
            label: 'Dynamic Reward Pool',
            icon: 'pi pi-fw pi-pencil',
            to: '/support/dynamicRewardPool',
          },
          {
            label: 'Order Post Reward',
            icon: 'pi pi-fw pi-id-card',
            to: '/support/orderpostreward',
          },
          {
            label: 'Users Access',
            icon: 'pi pi-fw pi-list',
            href: `/support/usersAccess`,
          },
        ],
      },
      {
        label: 'Monitoring',
        icon: 'pi pi-fw pi-star',
        items: [
          {
            label: 'Test Suite',
            icon: 'pi pi-fw pi-id-card',
            href: `/abTest`,
            badgeClassName: 'p-badge-warning',
          },
        ],
      },
    ];
  }
}
