import { TabView, TabPanel } from 'primereact/tabview';
import { useState } from 'react';
import Tracking from './tabs/Tracking';

const TrackingIndex = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div>
      <TabView
        activeIndex={activeIndex}
        onTabChange={e => setActiveIndex(e.index)}
      >
        <TabPanel header="Tracking">
          <Tracking />
        </TabPanel>
      </TabView>
    </div>
  );
};
export default TrackingIndex;
