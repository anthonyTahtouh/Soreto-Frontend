import { TabView, TabPanel } from 'primereact/tabview';
import { useState } from 'react';
import OrderTracking from './tabs/OrderTracking';
import UserTracking from './tabs/UserTracking';

const UserTrackingFlow = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div>
      <TabView
        activeIndex={activeIndex}
        onTabChange={e => setActiveIndex(e.index)}
      >
        <TabPanel header="User tracking">
          <UserTracking />
        </TabPanel>
        <TabPanel header="Order tracking">
          <OrderTracking />
        </TabPanel>
      </TabView>
    </div>
  );
};
export default UserTrackingFlow;
