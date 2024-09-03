import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import { useState } from 'react';

interface Props {
  orders: any;
}

const ExternalUntrackedTable = ({ orders }: Props) => {
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

  const affiliateOrderBodyTemplate = (rowData: any) => {
    return <span>{rowData.affiliate}</span>;
  };

  const clientNameOrderBodyTemplate = (rowData: any) => {
    return <span>{rowData.clientName}</span>;
  };

  const valueOrderBodyTemplate = (rowData: any) => {
    return <span>{rowData.value}</span>;
  };

  const fallbackTypeOrderBodyTemplate = (rowData: any) => {
    return <span>{rowData.fallbackType}</span>;
  };

  const unresolvedOrderBodyTemplate = (rowData: any) => {
    let value;

    if (rowData.unresolved) {
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
            <div className="p-col">
              {' '}
              <span>
                <b className="p-mb-4 e">Meta: </b>{' '}
                {JSON.stringify(data.orderMeta)}
              </span>
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
        field="affiliate"
        header="Affiliate"
        body={affiliateOrderBodyTemplate}
        sortable
      />
      <Column
        field="clientName"
        header="Client Name"
        body={clientNameOrderBodyTemplate}
        sortable
      />
      <Column
        field="fallbackType"
        header="Fallback Type"
        body={fallbackTypeOrderBodyTemplate}
        sortable
      />
      <Column
        field="unresolved"
        header="Unresolved"
        body={unresolvedOrderBodyTemplate}
        sortable
      />
    </DataTable>
  );
};

export default ExternalUntrackedTable;
