import React from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import HeaderTopCategories from './HeaderTopCategories';

const Index = () => {
  return (
    <TabView>
      <TabPanel header="Header Menu">
        <HeaderTopCategories
          tab="showOnHeaderMenu"
          tabField="showHeaderMenuIndex"
        />
      </TabPanel>
      <TabPanel header="Tab Panel">
        <HeaderTopCategories
          tab="showOnTabPanelMenu"
          tabField="showTabPanelMenuIndex"
        />
      </TabPanel>
      <TabPanel header="Category Menu">
        <HeaderTopCategories
          tab="showOnCategoryMenu"
          tabField="showCategoryMenuIndex"
        />
      </TabPanel>
      <TabPanel header="Footer Menu">
        <HeaderTopCategories
          tab="showOnFooterMenu"
          tabField="showFooterMenuIndex"
        />
      </TabPanel>
    </TabView>
  );
};
export default Index;
