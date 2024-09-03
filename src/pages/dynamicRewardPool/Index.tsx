/* eslint-disable */
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import {
  DataTable,
  DataTableFilterMeta,
  DataTableProps,
  DataTableSortOrderType
} from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useRef, useState } from 'react';
import MpDynamicRewardPool from '../../entities/mpDynamicRewardPool';
import QueryBuilderHelper from '../../helpers/QueryBuilderHelper';
import DynamicRewardPoolService from '../../services/DynamicRewardPoolService';
import DynamicRewardPoolModal from './DynamicRewardPoolModal/DynamicRewardPoolModal';

interface CustomDataTableProps {
  first: number;
  rows: number;
  page: number;
  sortField: string;
  sortOrder: DataTableSortOrderType;
  filters: { ftSearch: { value: string; matchMode: string } };
}

const dynamicRewardPoolsPage = () => {
  const emptyDynamicRewardPool: MpDynamicRewardPool = new MpDynamicRewardPool();

  const filterDefinition: DataTableFilterMeta = {
    name: { value: '', matchMode: 'contains' },
  };

  const [dRPDialog, setDRPDialog] = useState<boolean>(false);
  const [deleteDRPDialog, setDeleteDRPDialog] = useState<boolean>(false);
  const [deleteProductsDialog, setDeleteUnitsDialog] = useState<boolean>(false);
  const [singleDRP, setSingleDRP] = useState<any>(emptyDynamicRewardPool);
  const [selectedCategoriesIds, setSelectedCategoriesIds] = useState<string[]>(
    [],
  );
  const [dRPList, setDRPList] = useState<Array<MpDynamicRewardPool>>([]);
  const [filters, setFilters] = useState(filterDefinition);
  const [selectedUnits, setSelectedUnits] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [tableProps, setTableProps] = useState<CustomDataTableProps>({
    first: 0,
    rows: 10,
    page: 0,
    sortField: '',
    sortOrder: 1,
    filters: {
      ftSearch: { value: '', matchMode: 'custom' },
    },
  });

  const toast = useRef<any>(null);

  const dt = useRef<any>(null);

  const getDynamicRewardsPools = async () => {
    // set state as loading
    setLoading(true);

    const query = QueryBuilderHelper.get(tableProps as DataTableProps);

    try {
      // fetch data from api
      const data = await DynamicRewardPoolService.getRewardPoolsDynamic(query);

      if (data?.resultData?.page) {
        setDRPList(data.resultData.page);
        setTotalRecords(data.resultData.totalCount);
      }
    } catch (error: any) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.friendlyMessage,
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDynamicRewardsPools();
  }, [tableProps]);

  const formatDate = (date: any) => {
    let dateFormat = new Date(date);
    return dateFormat.toLocaleDateString('en-GB'); // dd/mm/yyyy
  };

  const openNew = () => {
    setSingleDRP(emptyDynamicRewardPool);
    setDRPDialog(true);
  };

  const hideDialog = () => {
    getDynamicRewardsPools();
    setDRPDialog(false);
  };

  const hideDeleteProductDialog = () => {
    setDeleteUnitsDialog(false);
  };

  const hideDeleteDRPsDialog = () => {
    setDeleteUnitsDialog(false);
  };

  const hideDeleteDRPDialog = () => {
    setDeleteDRPDialog(false);
  };

  const editDRP = (drp: any) => {
    setSingleDRP({ ...drp });
    setDRPDialog(true);
  };

  const confirmDeleteDRP = async (drp: any) => {
    setSingleDRP(drp);
    setDeleteDRPDialog(true);
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const confirmDeleteSelected = () => {
    setDeleteUnitsDialog(true);
  };

  const deleteSingleRPD = async (drpId: any) => {
    try {
      await DynamicRewardPoolService.deleteDRP(drpId);
      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Dynamic Reward Pool Deleted',
        life: 3000,
      });
    } catch (error: any) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.errorMessage,
        life: 3000,
      });
    }
  };

  const deleteOneRPD = async () => {
    setLoading(true);
    setDeleteDRPDialog(false);
    await deleteSingleRPD(singleDRP._id);
    getDynamicRewardsPools();
  };

  //delete from the list of selected DRPs
  const deleteSelectedRPDs = async (
    isMultipleRow = true,
    rewardId?: string,
  ) => {

    setLoading(true);

    if (isMultipleRow) {
      await selectedUnits.forEach(async (singleReward: any) => {
        await deleteSingleRPD(singleReward._id);
      });
    } else {
      deleteSingleRPD(rewardId);
    }
    //close the popup
    hideDeleteProductDialog();

    //Reset select Product
    setSelectedUnits([]);

    //setDeleteProductsDialog(false);
    getDynamicRewardsPools();
  };

  const deleteDRPsDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteDRPDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteOneRPD}
      />
    </>
  );

  useEffect(() => {
    const newDRP = { ...singleDRP };
    newDRP.categoryIds = selectedCategoriesIds;
    setSingleDRP(newDRP);
  }, [selectedCategoriesIds]);

  const leftToolbarTemplate = () => {
    return (
      <>
        <Button
          label="New"
          icon="pi pi-plus"
          className="p-button-success p-mr-2 p-mb-2"
          onClick={openNew}
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          className="p-button-danger p-mb-2"
          onClick={confirmDeleteSelected}
          disabled={!selectedUnits || !selectedUnits.length}
        />
      </>
    );
  };

  const nameBodyTemplate = (rowData: any) => {
    return <>{rowData.name}</>;
  };

  const clientBodyTemplate = (rowData: any) => {
    return <>{rowData.clientName}</>;
  };

  const createdAtBodyTemplate = (rowData: any) => {
    let date = formatDate(rowData.createdAt);
    return <>{date}</>;
  };

  const updatedAtBodyTemplate = (rowData: any) => {
    let date = formatDate(rowData.updatedAt);
    return <>{date}</>;
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="actions">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-mr-2"
          onClick={() => editDRP(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteDRP(rowData)}
        />
      </div>
    );
  };

  const onGlobalFilterChange = (event: any) => {
    let searchQuery = event?.target?.value || '';
    if (searchQuery.length < 3) searchQuery = '';
    const newTableProp = { ...tableProps };
    newTableProp.filters.ftSearch.value = searchQuery;
    setTableProps({ ...newTableProp });
  };

  const header = (
    <div className="table-header">
      <h5 className="p-m-0">Manage Dynamic Reward Pool</h5>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          placeholder="Search..."
          onInput={e => onGlobalFilterChange(e)}
        />
      </span>
    </div>
  );

  const deleteUnitsDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteDRPsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={() => {
          deleteSelectedRPDs(true);
        }}
      />
    </>
  );

  const onPage = (event: any) => {
    setTableProps({ ...tableProps, ...event });
  };

  const onSort = (event: any) => {
    setTableProps({ ...tableProps, ...event });
  };

  return (
    <div className="p-grid crud-demo">
      <div className="p-col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar
            className="p-mb-4 p-toolbar"
            left={leftToolbarTemplate}
          />

          <DataTable
            ref={dt}
            value={dRPList}
            selection={selectedUnits}
            onSelectionChange={e => setSelectedUnits(e.value)}
            lazy
            onSort={onSort}
            onPage={onPage}
            onFilter={onGlobalFilterChange}
            filters={filters}
            dataKey="_id"
            paginator
            rows={tableProps.rows}
            first={tableProps.first}
            rowsPerPageOptions={[5, 10, 25]}
            totalRecords={totalRecords}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Reward Pools"
            emptyMessage="No dynamic rewards pools found!"
            header={header}
            loading={loading}
            sortField={tableProps.sortField}
            sortOrder={tableProps.sortOrder}
          >
            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />

            <Column
              field="name"
              header="Name"
              sortable
              body={nameBodyTemplate}
            />

            <Column
              field="clientName"
              header="Client"
              sortable
              body={clientBodyTemplate}
            />

            <Column
              field="createdAt"
              header="Created At"
              sortable
              body={createdAtBodyTemplate}
            />

            <Column
              field="updatedAt"
              header="Updated At"
              sortable
              body={updatedAtBodyTemplate}
            />

            <Column body={actionBodyTemplate} />
          </DataTable>

          <Dialog
            visible={dRPDialog}
            style={{ width: '100%', height: '100%' }}
            header="Dynamic Reward Pool Details"
            modal
            className="p-fluid"
            onHide={hideDialog}
            blockScroll
          >
            <DynamicRewardPoolModal dRP={singleDRP}></DynamicRewardPoolModal>
          </Dialog>
          <Dialog
            visible={deleteDRPDialog}
            style={{ width: '550px' }}
            header="Confirm"
            modal
            footer={deleteDRPsDialogFooter}
            onHide={hideDeleteDRPDialog}
            blockScroll
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle p-mr-3"
                style={{ fontSize: '2rem' }}
              />
              {singleDRP && (
                <span>
                  Are you sure you want to delete <b>{singleDRP.name}</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteProductsDialog}
            style={{ width: '550px' }}
            header="Confirm"
            modal
            footer={deleteUnitsDialogFooter}
            onHide={hideDeleteDRPsDialog}
            blockScroll
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle p-mr-3"
                style={{ fontSize: '2rem' }}
              />
              {singleDRP && (
                <span>
                  Are you sure you want to delete the selected Reward Pools?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default dynamicRewardPoolsPage;
