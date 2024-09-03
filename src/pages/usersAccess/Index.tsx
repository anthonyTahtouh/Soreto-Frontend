import { Calendar } from 'primereact/calendar';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { Button } from 'primereact/button';
import DropdownClients from '../../components/DropdownClients';
import DropdownRoles from '../../components/DropdownRoles';
import BaseDynamoService from '../../services/BaseDynamoService';
import './index.scss';

const UsersAccess = () => {
  const [clientId, setClientId] = useState('undefined');
  const [roleName, setRoleName] = useState('undefined');
  const [roleId, setRoleId] = useState('undefined');
  const [startDate, setStartDate] = useState<Date | Date[] | undefined>(
    undefined,
  );
  const [endDate, setEndDate] = useState<Date | Date[] | undefined>(undefined);
  const [userEmail, setUserEmail] = useState('');
  const [email, setEmail] = useState('');
  const [resultData, setResultData] = useState([]);
  const [listData, setListData] = useState([]);
  const [rowsCount, setRowsCount] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(100);

  const dateBodyTemplate = (rowData: any) => {
    const date = moment(Number(rowData.date.N)).format('DD-MM-YYYY HH:mm:ss');

    return <>{date}</>;
  };

  const search = async () => {
    setLoading(true);
    setResultData([]);
    setListData([]);
    setRowsCount(0);
    setFirst(0);

    const queryString = `?$client_id=${clientId}&$email=${email}&$start_date=${startDate}&$end_date=${endDate}&$role=${roleName}`;

    const result = await BaseDynamoService.getAll(queryString);
    if (result) {
      setResultData(result.resultData.Items);
      setListData(result.resultData.Items);
      setRowsCount(result.resultData.Count);
    }

    setLoading(false);
  };

  const clearFilter = () => {
    setClientId('undefined');
    setRoleId('undefined');
    setStartDate(undefined);
    setEndDate(undefined);
    setUserEmail('');
    setEmail('');
    setRowsCount(0);
    setLoading(false);
    setFirst(0);
  };

  const onCustomPage = (event: any) => {
    setFirst(event.first);
    setRows(event.rows);
    setResultData(listData.slice(event.first, event.first + event.rows));
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <div className="card">
      <div className="p-fluid p-formgrid p-grid">
        <div className="p-field p-col-4  p-md-2">
          <label htmlFor="orderPostRewadClient">Client</label>
          <DropdownClients
            id="orderPostRewadClient"
            value={clientId}
            onChange={(e: any) => setClientId(e.value)}
          />
        </div>
        <div className="p-field p-col-4  p-md-2">
          <label htmlFor="role">Role</label>
          <DropdownRoles
            id="role"
            value={roleId}
            onChange={(e: any) => {
              setRoleName(e.target.name);
              setRoleId(e.value);
            }}
          />
        </div>
        <div className="p-field p-col-4  p-md-2">
          <label htmlFor="startDate">Start Date</label>
          <Calendar
            id="startDate"
            value={startDate}
            dateFormat="dd-mm-yy"
            showTime
            onChange={e => {
              if (e.value === null) {
                setStartDate(undefined);
              } else {
                setStartDate(e.value);
              }
            }}
          />
        </div>
        <div className="p-field p-col-4 p-md-2">
          <label htmlFor="endDate">End Date</label>
          <Calendar
            id="endDate"
            value={endDate}
            showTime
            onChange={e => {
              if (e.value === null) {
                setEndDate(undefined);
              } else {
                setEndDate(e.value);
              }
            }}
          />
        </div>
        <div className="p-field p-col-4 p-md-2">
          <label htmlFor="userEmail">User Email</label>
          <InputText
            id="userEmail"
            value={userEmail}
            onBlur={e => setEmail(userEmail)}
            onChange={e => setUserEmail(e.target.value)}
          />
        </div>
        <div className="field col-1 btnFilter">
          <Button label="Search" type="submit" onClick={search} />
        </div>
        <div className="field col-1 btnFilter">
          <Button label="Clear" type="submit" onClick={clearFilter} />
        </div>
      </div>
      <h5>Users Access</h5>
      <DataTable
        value={resultData}
        paginator
        totalRecords={rowsCount}
        lazy
        onPage={onCustomPage}
        dataKey="_id"
        loading={isLoading}
        rows={rows}
        first={first}
        responsiveLayout="scroll"
        emptyMessage="No users access found."
        className="datatable-responsive"
      >
        <Column field="client.S" header="Client Id" />
        <Column field="username.S" header="Name" />
        <Column field="email.S" header="Email" />
        <Column
          field="date.N"
          header="Date"
          body={dateBodyTemplate}
          className="columnSpace"
        />
        <Column field="status.S" header="Status" />
        <Column field="type.S" header="Type" />
        <Column field="role.S" header="Role" />
        <Column field="referrer.S" header="Referrer" />
        <Column field="ip.S" header="IP" />
        <Column field="agent.S" header="Agent" />
      </DataTable>
    </div>
  );
};
export default UsersAccess;
