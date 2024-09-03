import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { useState } from 'react';

interface Props {
  orders: any;
}

const Audit = ({ orders }: Props) => {
  const [expandedRows, setExpandedRows] = useState<any[] | undefined>();

  const formatDateWithTime = (date: string) => {
    const dateFormat = new Date(date);

    return `${dateFormat.toLocaleDateString('en-GB', {
      timeZone: 'UTC',
    })} ${dateFormat.toLocaleTimeString('en-GB', {
      timeZone: 'UTC',
    })}`;
  };

  const datetimeOrderBodyTemplate = (rowData: any) => {
    return <span>{formatDateWithTime(rowData.dateOrder)}</span>;
  };

  const valueOrderBodyTemplate = (rowData: any) => {
    return <span>{rowData.value}</span>;
  };

  const clientNameOrderBodyTemplate = (rowData: any) => {
    return <span>{rowData.clientName}</span>;
  };

  const campaignVersionBodyTemplate = (rowData: any) => {
    return <span>{rowData.campaignVersionName}</span>;
  };

  const testModeBodyTemplate = (rowData: any) => {
    let value;

    if (rowData.testMode) {
      value = 'True';
    } else {
      value = 'False';
    }
    return <span>{value}</span>;
  };

  const rowExpansionTemplate = (data: any) => {
    return (
      <div className="internal">
        <Card>
          <div className="p-grid">
            <div className="p-col-12 p-sm-12 p-lg-6 p-xl-3">
              <span>
                <b className="p-mb-4 ">Buyer Email : </b> {data.buyerEmail}
              </span>
            </div>
            <div className="p-col-12 p-sm-12 p-lg-6 p-xl-3">
              {' '}
              <span>
                <b className="p-mb-4">Short Url: </b> {data.shortUrl}
              </span>
            </div>
            <div className="p-col-12 p-sm-12 p-lg-6 p-xl-3">
              {' '}
              <span>
                <b className="p-mb-4">IP : </b> {data.ip}
              </span>
            </div>
            <div className="p-col-12 p-sm-12 p-lg-6 p-xl-3">
              {' '}
              <span>
                <b className="p-mb-4">Shared Url Email : </b> {data.email}
              </span>{' '}
            </div>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <DataTable
      value={orders}
      className="p-datatable-customers"
      dataKey="_id"
      expandedRows={expandedRows}
      rowExpansionTemplate={rowExpansionTemplate}
      onRowToggle={e => setExpandedRows(e.data)}
      responsiveLayout="scroll"
      emptyMessage="No orders found."
    >
      <Column expander headerStyle={{ width: '3em' }} />
      <Column
        field="dateTime"
        header="Date Time"
        body={datetimeOrderBodyTemplate}
        sortable
      />
      <Column
        field="value"
        header="Value"
        body={valueOrderBodyTemplate}
        sortable
      />
      <Column
        field="clientName"
        header="Client Name"
        body={clientNameOrderBodyTemplate}
        sortable
      />
      <Column
        field="campaignVersion"
        header="Campaign Version"
        body={campaignVersionBodyTemplate}
        sortable
      />
      <Column
        field="testMode"
        header="Test Mode"
        body={testModeBodyTemplate}
        sortable
      />
    </DataTable>
  );
};

export default Audit;
