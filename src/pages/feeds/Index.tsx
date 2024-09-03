import { TabView, TabPanel } from 'primereact/tabview';
import { useState } from 'react';
import BrandPage from './tabs/Brand';
import OfferPage from './tabs/Offer';

const FeedsPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div>
      <TabView
        activeIndex={activeIndex}
        onTabChange={e => setActiveIndex(e.index)}
      >
        <TabPanel header="Feeds Offer">
          <OfferPage />
        </TabPanel>
        <TabPanel header="Feeds Brand">
          <BrandPage />
        </TabPanel>
      </TabView>
    </div>
  );
};

export default FeedsPage;
