/* eslint-disable camelcase */
/* eslint-disable react/jsx-no-bind */
import { FormEvent, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Button } from 'primereact/button';
import './UserTracking.scss';
import SupportService from '../../../services/SuportService';
import { formatDateWithTime } from '../../../helpers/dateFormatter';

const loader = (
  <div className="loader">
    <div className="loaderIcon" />
  </div>
);

const UserTracking = () => {
  const [trackingFlow, setTrackingFlow] = useState<UserTrackingInterface[]>([]);
  const [email, setEmail] = useState('');
  const [activeBrand, setActiveBrand] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState<any[] | undefined>(
    undefined,
  );
  const [expandedSuaRows, setExpandedSuaRows] = useState<any[] | undefined>(
    undefined,
  );
  async function callService(e: FormEvent) {
    e.preventDefault();
    if (email.trim().length < 1) {
      return;
    }
    setLoading(true);
    setTrackingFlow([]);
    const x = await SupportService.getUserTrackingFlow(email);
    const data: UserTrackingInterface[] = x.data.resultData || [];
    setLoading(false);
    setTrackingFlow(data);
  }

  function getTableData(sus: SharedUrl[]) {
    let data: any = [];
    data = sus.map(t => {
      const suas = t.suas?.map(sua => {
        const orders = sua.orders?.map(o => {
          return {
            ...o,
            created_at: formatDateWithTime(o.created_at),
            browser: o?.userAgent,
          };
        });
        const external_orders = sua.external_orders?.map(eo => {
          return {
            ...eo,
            created_at: formatDateWithTime(eo.created_at),
            browser: eo?.userAgent,
          };
        });
        return {
          ...sua,
          external_orders_quantity: external_orders?.length || 0,
          orders_quantity: orders?.length || 0,
          orders,
          external_orders,
          browser: sua?.userAgent,
          created_at: formatDateWithTime(sua.created_at),
        };
      });
      return {
        ...t,
        key: t._id,
        created_at: formatDateWithTime(t.created_at),
        accesses: t.suas?.length || 0,
        ip: t?.ipAddress || '',
        browser: t?.userAgent,
        suas,
      };
    });
    return data;
  }

  const suaRowExpansionTemplate = (data: SharedUrlAccess) => {
    return (
      <>
        <div className="external-orders-subtable">
          <h5>External Orders</h5>
          <DataTable
            value={data.external_orders}
            responsiveLayout="scroll"
            emptyMessage="No external order found."
            sortField="created_at"
            sortOrder={-1}
          >
            <Column field="created_at" header="Created At" sortable />
            <Column field="status" header="Status" />
            <Column field="client_order_id" header="Client Order Id" />
            <Column field="meta.ipAddress" header="IP" />
            <Column field="userAgent" header="Browser" />
          </DataTable>
        </div>
        <div className="orders-subtable">
          <h5>Internal Orders</h5>
          <DataTable
            value={data.orders}
            responsiveLayout="scroll"
            emptyMessage="No internal order found."
            sortField="created_at"
            sortOrder={-1}
          >
            <Column field="created_at" header="Created At" sortable />
            <Column field="status" header="Status" />
            <Column field="client_order_id" header="Client Order Id" />
            <Column field="meta.ipAddress" header="IP" />
            <Column field="browser" header="Browser" />
          </DataTable>
        </div>
      </>
    );
  };
  const rowExpansionTemplate = (data: SharedUrl) => {
    return (
      <div className="access-subtable">
        <h5>Access for {data.cv_alias}</h5>
        <DataTable
          value={data.suas}
          responsiveLayout="scroll"
          emptyMessage="No shared URL access found."
          rowExpansionTemplate={suaRowExpansionTemplate}
          expandedRows={expandedSuaRows}
          onRowToggle={e => setExpandedSuaRows(e.data)}
          sortField="created_at"
          sortOrder={-1}
        >
          <Column expander />
          <Column field="created_at" header="Created At" sortable />
          <Column
            field="external_orders_quantity"
            header="External Orders"
            sortable
          />
          <Column field="orders_quantity" header="Orders" sortable />
          <Column field="ipAddress" header="IP" />
          <Column field="browser" header="Browser" />
        </DataTable>
      </div>
    );
  };

  return (
    <div>
      <form onSubmit={callService}>
        <InputText
          value={email}
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
        />
        <Button label="Find" type="submit" className="findButton" />
      </form>
      {isLoading
        ? loader
        : trackingFlow.length === 0 && (
            <div className="noResults">No results</div>
          )}
      <Accordion
        activeIndex={activeBrand}
        onTabChange={e => setActiveBrand(e.index)}
      >
        {trackingFlow.map(tf => (
          <AccordionTab header={tf.clientName} key={tf.clientId}>
            <div className="sua-container">
              <h5>Shared Urls</h5>
              <DataTable
                value={getTableData(tf.su)}
                dataKey="_id"
                rowExpansionTemplate={rowExpansionTemplate}
                emptyMessage="No shared URL found."
                expandedRows={expandedRows}
                onRowToggle={e => setExpandedRows(e.data)}
                sortField="created_at"
                sortOrder={-1}
              >
                <Column expander />
                <Column header="Creation Date" field="created_at" sortable />
                <Column header="Accesses" field="accesses" sortable />
                <Column header="Campaing Version" field="cv_alias" />
                <Column header="Type" field="type" sortable />
                <Column header="IP" field="ip" />
                <Column
                  header="Source Client Order Id"
                  field="source_client_order_id"
                />
                <Column header="Browser" field="browser" />
                <Column header="Short url" field="short_url" />
              </DataTable>
            </div>
          </AccordionTab>
        ))}
      </Accordion>
    </div>
  );
};
export default UserTracking;
