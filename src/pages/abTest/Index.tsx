/* eslint-disable */
import './index.scss';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Column } from 'primereact/column';
import {
  DataTable,
  DataTableFilterMeta,
  DataTableProps,
  DataTableSortOrderType,
} from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ProgressBar } from 'primereact/progressbar';
import { Tooltip } from 'primereact/tooltip';
import AbTestService from '../../services/AbTestService';
import AbTest from '../../entities/abTest';
import QueryBuilderHelper from '../../helpers/QueryBuilderHelper';

interface CustomDataTableProps {
  first: number;
  rows: number;
  page: number;
  sortField: string;
  sortOrder: DataTableSortOrderType;
  filters: { ftSearch: { value: string; matchMode: string } };
  brandId: string;
}

const AbTestList = () => {
  const filterDefinition: DataTableFilterMeta = {
    name: { value: '', matchMode: 'contains' },
  };
  const navigate = useNavigate();
  const [deleteAbTestDialog, setDeleteAbTestDialog] = useState<boolean>(false);
  const [deleteProductsDialog, setDeleteProductsDialog] =
    useState<boolean>(false);
  const [abTests, setAbTests] = useState<Array<AbTest>>([]);
  const [selectedProducts, setSelectedProducts] = useState<any>([]);
  const [filters, setFilters] = useState(filterDefinition);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [tableProps, setTableProps] = useState<CustomDataTableProps>({
    first: 0,
    rows: 10,
    page: 0,
    sortField: 'createdAt',
    sortOrder: 1,
    filters: {
      ftSearch: { value: '', matchMode: 'custom' },
    },
    brandId: '',
  });
  const [abTestToDelete, setAbTestToDelete] = useState<AbTest | null>(null);

  const toast = useRef<any>(null);

  const dt = useRef<any>(null);

  const clearData = () => {
    setAbTests([]);
    setSelectedProducts([]);
    setTotalRecords(0);
  }

  const getAbTests = async () => {
    setLoading(true);

    const query = QueryBuilderHelper.get(tableProps as DataTableProps);

    try {
      const data = await AbTestService.getAbTests(query);

      if (data?.resultData?.page) {
        setAbTests(data.resultData.page);
        setTotalRecords(data.resultData.totalCount);
      }
      else {
        clearData();
      }
    } catch (error: any) {
      if (error?.status === 404) {
        clearData();
        toast?.current?.show({ 
          severity: 'warn',
          summary: 'Warning',
          detail: 'No AB Tests found',
          life: 15000,
        });
      } else {
      toast?.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'An error occurred while fetching the data',
        life: 15000,
      });
    }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAbTests();
  }, [tableProps]);

  const hideDeleteProductDialog = () => {
    setDeleteProductsDialog(false);
  };

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };

  const hideDeleteAbTestDialog = () => {
    setDeleteAbTestDialog(false);
  };

  const confirmDeleteAbTest = async (abTest: any) => {
    setAbTestToDelete(abTest);
    setDeleteAbTestDialog(true);
  };

  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  };

  const deleteSingleAbTest = async (abTestId: any) => {
    try {
      const response = await AbTestService.deleteAbTest(abTestId);
  
      // Check for success response
      if (response?.status === 200) {
        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'AbTest Deleted',
          life: 3000,
        });
      } else if (response?.status === 404) {
        // Handle 404 case
        toast.current.show({
          severity: 'warn',
          summary: 'Warning',
          detail: 'AbTest not found or already deleted',
          life: 3000,
        });
      } else {
        // Handle other errors
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'An unexpected error occurred',
          life: 3000,
        });
      }
    } catch (error: any) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.friendlyMessage,
        life: 3000,
      });
    }
  };
  
  const deleteOneAbTest = async () => {
    if (abTestToDelete) {
      await deleteSingleAbTest(abTestToDelete._id);
      setAbTestToDelete(null);
      getAbTests();
    }
    setDeleteAbTestDialog(false);
  };

  const deleteSelectedAbTests = async () => {
    const deleteRequests = selectedProducts.map(async (abTest: any) => {
      await deleteSingleAbTest(abTest._id);
    });

    await Promise.all(deleteRequests);

    hideDeleteProductDialog();
    setSelectedProducts([]);
    getAbTests();
  };

  const getTestCompletion = (abTest: any) => {
    const now = new Date();
    const startDate = new Date(abTest.startDate);
    const endDate = new Date(abTest.endDate);

    if (now < startDate) {
      return 0; // Start Date is in the future
    }
    if (now > endDate) {
      return 100; // End Date is in the past
    }

    const totalDuration = endDate.getTime() - startDate.getTime();
    const elapsedDuration = now.getTime() - startDate.getTime();
    const completion = (elapsedDuration / totalDuration) * 100;

    return Math.round(completion); // Return the rounded percentage
  };

  const progressBodyTemplate = (rowData: any) => {
    const completion = getTestCompletion(rowData);
    const progressBarId = `progress-bar-${rowData._id}`;
    const status = rowData.status;

    // Determine class based on status
    const progressBarClass = status === 'FAILED' ? 'progress-bar-failed' : 'progress-bar-normal';

    return (
      <div className="progress-container">
        <Tooltip target={`#${progressBarId}`} content={status === 'FAILED' ? "Not all the Campaign Versions are active" : ''} />
        <ProgressBar
          id={progressBarId}
          value={completion}
          showValue
          className={`progress-bar ${progressBarClass}`}
        />
      </div>
    );
  }

  // Utility function to manually format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2); 
    return `${day}/${month}/${year}`;
  };

  const deleteAbTestsDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteAbTestDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteOneAbTest}
      />
    </>
  );

  const leftToolbarTemplate = () => {
    return (
      <>
        <Button
          label="New"
          icon="pi pi-plus"
          className="p-button-success p-mr-2 p-mb-2"
          onClick={() => navigate('/abTest/new')} 
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          className="p-button-danger p-mb-2"
          onClick={confirmDeleteSelected}
          disabled={!selectedProducts || !selectedProducts.length}
        />
      </>
    );
  };

  const nameBodyTemplate = (rowData: any) => {
    return <>{rowData.name}</>;
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="actions">
        <Button
          icon="pi pi-bookmark"
          className="p-button-rounded p-button-help p-mr-2"
          onClick={() => navigate(`/abTest/abTestReportClassic/${rowData._id}`)}
        />
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-mr-2"
          onClick={() => navigate(`/abTest/${rowData._id}`)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteAbTest(rowData)}
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
      <div>
        <h5 className="p-m-0">AB Tests</h5>
      </div>
      <div className="p-col-4">
          <div className="p-input-icon-left w-full">
            <i className="pi pi-search" />
            <InputText
              type="search"
              placeholder="Search..."
              className="w-full"
              onInput={e => onGlobalFilterChange(e)}
            />
          </div>
      </div>
    </div>
  );

  const deleteProductsDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteProductsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedAbTests}
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
          <Toolbar className="p-mb-4 p-toolbar" left={leftToolbarTemplate} />

          <DataTable
            ref={dt}
            value={abTests}
            selection={selectedProducts}
            onSelectionChange={e => setSelectedProducts(e.value)}
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
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} AbTests"
            emptyMessage="No abtests found."
            header={header}
            loading={loading}
            sortField={tableProps.sortField}
            sortOrder={tableProps.sortOrder}
          >
            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
            <Column field="name" header="Name" sortable body={nameBodyTemplate} />
            <Column field="description" header="Description" sortable />
            <Column field="startDate" header="Start Date" sortable body={(rowData) => formatDate(rowData.startDate)} />
            <Column field="endDate" header="End Date" sortable body={(rowData) => formatDate(rowData.endDate)} />
            <Column field="type" header="Type" sortable />
            <Column body={progressBodyTemplate} header="Progress" sortable />
            <Column body={actionBodyTemplate} headerStyle={{ width: '12rem' }}/>
          </DataTable>

          <Dialog
            visible={deleteProductsDialog}
            style={{ width: '450px' }}
            header="Confirm"
            modal
            footer={deleteProductsDialogFooter}
            onHide={hideDeleteProductsDialog}
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle p-mr-3"
                style={{ fontSize: '2rem' }}
              />
              {selectedProducts && (
                <span>
                  Are you sure you want to delete the selected abTests?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteAbTestDialog}
            style={{ width: '450px' }}
            header="Confirm"
            modal
            footer={deleteAbTestsDialogFooter}
            onHide={hideDeleteAbTestDialog}
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle p-mr-3"
                style={{ fontSize: '2rem' }}
              />
              {abTestToDelete && (
                <span>Are you sure you want to delete {abTestToDelete.name}?</span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AbTestList;
