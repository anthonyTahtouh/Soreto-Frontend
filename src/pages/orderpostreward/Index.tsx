import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { Column } from 'primereact/column';
import { DataTable, DataTableSortOrderType } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import DropdownClients from '../../components/DropdownClients';
import { formatDateWithTime } from '../../helpers/dateFormatter';
import SupportService from '../../services/SuportService';

const OrderPostReward = () => {
  const [clientId, setClientId] = useState('');
  const [startDate, setStartDate] = useState<Date | Date[] | undefined>(
    undefined,
  );
  const [endDate, setEndDate] = useState<Date | Date[] | undefined>(undefined);
  const [userEmail, setUserEmail] = useState('');
  const [rewardRetrieved, setRewardRetrieved] = useState(false);

  const [oprData, setOPRData] = useState([]);
  const [rowsCount, setRowsCount] = useState(0);
  const [isLoading, setLoading] = useState(false);

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [page, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('oprCreatedAt');
  const [sortOrder, setSortOrder] = useState<DataTableSortOrderType>(-1);

  const searchOrderPostRewards = useCallback(
    async (event?: FormEvent) => {
      setLoading(true);
      if (event) {
        event.preventDefault();
      }
      let query = `?limit=${rows}&offset=${(page - 1) * rows}`;
      query = query.concat(`&sortField=${sortField}&sortOrder=${sortOrder}`);
      if (clientId) {
        query = query.concat(`&clientId=${clientId}`);
      }
      if (startDate) {
        if (!Array.isArray(startDate)) {
          query = query.concat(`&startDate=${startDate.toISOString()}`);
        }
      }
      if (endDate) {
        if (!Array.isArray(endDate)) {
          query = query.concat(`&endDate=${endDate.toISOString()}`);
        }
      }
      if (userEmail) {
        query = query.concat(`&userEmail=${encodeURI(userEmail)}`);
      }
      if (rewardRetrieved) {
        query = query.concat(`&rewardRetrieved=${rewardRetrieved}`);
      }
      const response = await SupportService.getOrderPostReward(query);
      const { resultData } = response.data;
      const { countRows } = resultData;
      setOPRData(resultData.rows);
      setRowsCount(countRows[0].count);
      setLoading(false);
    },
    [
      rows,
      page,
      sortField,
      sortOrder,
      clientId,
      startDate,
      endDate,
      userEmail,
      rewardRetrieved,
    ],
  );

  const onCustomPage = (event: any) => {
    setFirst(event.first);
    setRows(event.rows);
    setCurrentPage(event.page + 1);
  };

  const onSort = (event: any) => {
    setSortField(event.sortField);
    setSortOrder(event.sortOrder);
  };

  useEffect(() => {
    searchOrderPostRewards();
  }, [searchOrderPostRewards]);

  return (
    <div className="card">
      <form
        onSubmit={searchOrderPostRewards}
        className="p-fluid p-formgrid p-grid"
      >
        <div className="p-field p-col-4  p-md-2">
          <label htmlFor="orderPostRewadClient">Client</label>
          <DropdownClients
            id="orderPostRewadClient"
            value={clientId}
            onChange={(e: any) => setClientId(e.value)}
          />
        </div>
        <div className="p-field p-col-4  p-md-2">
          <label htmlFor="startDate">Start Date</label>
          <Calendar
            id="startDate"
            value={startDate}
            onChange={e => setStartDate(e.value)}
          />
        </div>
        <div className="p-field p-col-4 p-md-2">
          <label htmlFor="endDate">End Date</label>
          <Calendar
            id="endDate"
            value={endDate}
            onChange={e => setEndDate(e.value)}
          />
        </div>
        <div className="p-field p-col-4 p-md-2">
          <label htmlFor="userEmail">User Email</label>
          <InputText
            id="userEmail"
            value={userEmail}
            onChange={e => setUserEmail(e.target.value)}
          />
        </div>
        <div
          className="p-field p-col-4 p-md-2"
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', paddingBottom: 7 }}
          >
            <label htmlFor="rewardRetrieved" style={{ marginRight: 5 }}>
              Reward Retrieved
            </label>
            <Checkbox
              inputId="rewardRetrieved"
              checked={rewardRetrieved}
              onChange={e => setRewardRetrieved(e.checked)}
            />
          </div>
        </div>
      </form>
      <h5>Order Post Reward</h5>
      <DataTable
        value={oprData}
        paginator
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
        totalRecords={rowsCount}
        lazy
        onPage={onCustomPage}
        dataKey="_id"
        loading={isLoading}
        rows={rows}
        first={first}
        rowsPerPageOptions={[10, 20, 50]}
        responsiveLayout="scroll"
        emptyMessage="No order post reward found."
        onSort={onSort}
        sortField={sortField}
        sortOrder={sortOrder}
        className="datatable-responsive"
      >
        <Column
          field="oprCreatedAt"
          header="Harvest Date"
          sortable
          body={obj => formatDateWithTime(obj.oprCreatedAt)}
        />
        <Column
          field="orderDate"
          header="Order date"
          sortable
          body={obj => formatDateWithTime(obj.orderDate)}
        />
        <Column field="clientName" sortable header="Client" />
        <Column
          field="campaingVersionName"
          sortable
          header="Campaign Version Name"
        />
        <Column field="userEmail" header="User Email" sortable />
        <Column field="orderUserRole" header="User Order Role" sortable />
        <Column field="rewardName" header="Reward Name" sortable />
        <Column field="status" header="Status" sortable />
        <Column field="rewardRetrieved" header="Reward Retrieved" sortable />
      </DataTable>
    </div>
  );
};
export default OrderPostReward;
