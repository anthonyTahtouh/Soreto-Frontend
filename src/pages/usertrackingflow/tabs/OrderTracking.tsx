/* eslint-disable */
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Toast } from 'primereact/toast';
import { useState, useRef, useEffect } from 'react';
import supportService from '../../../services/SuportService';
import ExternalTable from '../tableOrder/ExternalOrder';
import InternalTable from '../tableOrder/InternalOrder';
import ExternalUntrackedTable from '../tableOrder/ExternalUntrackedOrder';
import Audit from '../tableOrder/AuditOrder';
import './OrderTracking.scss';

const OrderTracking = () => {
  const toast = useRef<any>(null);
  const dt = useRef<any>(null);

  const [value, setValue] = useState<string>();
  const [isLoading, setLoading] = useState(false);
  const [showContent, setShowContent] = useState<string>('p-d-none');

  const [externalOrderTrackingFlow, setExternalOrderTrackingFlow] = useState(
    [],
  );
  const [externalOrderUntrackedFlow, setExternalOrderUntrackedFlow] = useState(
    [],
  );
  const [internalOrderTrackingFlow, setInternalOrderTrackingFlow] = useState(
    [],
  );

  const [auditOrder, setAuditOrder] = useState([]);
  const [activeIndexes, setActiveIndexes] = useState<number[] | never[]>([]);

  const loader = (
    <div className="loader">
      <div className="loaderIcon" />
    </div>
  );

  const showTost = (friendlyMessage: string) => {
    toast.current.show({
      severity: 'error',
      summary: 'Error',
      detail: friendlyMessage,
      life: 3000,
    });
  };
  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (!value) return;
    setShowContent('p-d-none');
    setLoading(true);
    try {
      // external endpoint
      const externalTrackingFlow = await supportService.getOrderTrackingFlow(
        value,
        'external',
      );
      setExternalOrderTrackingFlow(
        externalTrackingFlow.data?.resultData?.select,
      );
    } catch (e: any) {
      const { friendlyMessage } = e.response.data;
      showTost(friendlyMessage);
    }

    try {
      // external_untracked endpoint
      const externalUntrackedFlow = await supportService.getOrderTrackingFlow(
        value,
        'external_untracked',
      );

      setExternalOrderUntrackedFlow(
        externalUntrackedFlow.data?.resultData?.select,
      );
    } catch (e: any) {
      const { friendlyMessage } = e.response.data;
      showTost(friendlyMessage);
    }

    try {
      // internal endpoint
      const internalTrackingFlow = await supportService.getOrderTrackingFlow(
        value,
        'internal',
      );
      setInternalOrderTrackingFlow(
        internalTrackingFlow.data?.resultData?.select,
      );
    } catch (e: any) {
      const { friendlyMessage } = e.response.data;
      showTost(friendlyMessage);
    }

    try {
      // audit endpoint
      const auditOrderTracking = await supportService.getOrderTrackingFlow(
        value,
        'audit',
      );
      setAuditOrder(auditOrderTracking.data?.resultData?.select);
    } catch (e: any) {
      const { friendlyMessage } = e.response.data;
      showTost(friendlyMessage);
    }

    setShowContent('');
    setLoading(false);
  };

  const noResultsFound =
    externalOrderTrackingFlow.length === 0 &&
    externalOrderUntrackedFlow.length === 0 &&
    internalOrderTrackingFlow.length === 0 &&
    auditOrder.length === 0;

  // Render the component

  useEffect(() => {
    const openTabs = () => {
      const arrayOfOpenTabs = [];
      if (externalOrderTrackingFlow.length !== 0) {
        arrayOfOpenTabs.push(0);
      }
      if (internalOrderTrackingFlow.length !== 0) {
        arrayOfOpenTabs.push(1);
      }
      if (auditOrder.length !== 0) {
        arrayOfOpenTabs.push(2);
      }
      if (externalOrderUntrackedFlow.length !== 0) {
        arrayOfOpenTabs.push(3);
      }
      console.log(arrayOfOpenTabs);
      return arrayOfOpenTabs;
    };

    setActiveIndexes(openTabs());
  }, [
    externalOrderTrackingFlow,
    internalOrderTrackingFlow,
    auditOrder,
    externalOrderUntrackedFlow,
  ]);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="p-formgrid p-grid p-ml-0 p-mt-3 p-mb-3">
          <Toast ref={toast} />
          <div className="p-field">
            <InputText
              ref={dt}
              value={value}
              placeholder="Order"
              className="p-inputtext p-component"
              onChange={e => setValue(e.target.value)}
            />
            <Button label="Search" className="p-ml-2" />
          </div>
        </div>
      </form>

      {isLoading && loader }

      {noResultsFound ? (!isLoading && 
        <div className="noResults">No results</div>
      ) : (!isLoading && 
        <div className={`accordion-demo ${showContent}`}>
          <div className="card">
            <Accordion multiple activeIndex={activeIndexes}>
              <AccordionTab
                header="External"
                contentClassName="external"
                disabled={externalOrderTrackingFlow.length === 0}
              >
                <ExternalTable orders={externalOrderTrackingFlow} />
              </AccordionTab>
              <AccordionTab
                header="Internal"
                contentClassName="external"
                disabled={internalOrderTrackingFlow.length === 0}
              >
                <InternalTable orders={internalOrderTrackingFlow} />
              </AccordionTab>
              <AccordionTab
                header="Audit"
                contentClassName="external"
                disabled={auditOrder.length === 0}
              >
                <Audit orders={auditOrder} />
              </AccordionTab>
              <AccordionTab
                header="External Untracked"
                contentClassName="external"
                disabled={externalOrderUntrackedFlow.length === 0}
              >
                <ExternalUntrackedTable orders={externalOrderUntrackedFlow} />
              </AccordionTab>
            </Accordion>
          </div>
        </div>
      )}
    </>
  );
};
export default OrderTracking;
