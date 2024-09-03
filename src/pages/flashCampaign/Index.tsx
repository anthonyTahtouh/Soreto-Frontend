/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useRef, useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  DataTable,
  DataTableFilterMeta,
  DataTableProps,
  DataTableSortOrderType,
} from 'primereact/datatable';

import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { classNames } from 'primereact/utils';
import { Tooltip } from 'primereact/tooltip';
import { Fieldset } from 'primereact/fieldset';
import { Calendar } from 'primereact/calendar';
import { ColorPicker } from 'primereact/colorpicker';
import FlashCampaignService from '../../services/FlashCampaignService';
import QueryBuilderHelper from '../../helpers/QueryBuilderHelper';
import MpFlashCampaign from '../../entities/mpFlashCampaign';
import Upload from '../../components/uploadComponent/Upload';
import constants from '../../shared/constants';
import Meta from '../../components/Meta';
import {
  formatDate,
  timezoneOffsetIn,
  timezoneOffsetOut,
} from '../../helpers/dateFormatter';

interface CustomDataTableProps {
  first: number;
  rows: number;
  page: number;
  sortField: string;
  sortOrder: DataTableSortOrderType;
  filters: { name: { value: string; matchMode: string } };
}

function Index() {
  const emptyFlashCampaign: MpFlashCampaign = new MpFlashCampaign();
  const filterDefinition: DataTableFilterMeta = {
    name: { value: '', matchMode: 'contains' },
  };

  const [filters, setFilters] = useState(filterDefinition);
  const [flashCampaigns, setFlashCampaigns] = useState<any[]>([]);
  const [flashCampaign, setFlashCampaign] = useState<any>(emptyFlashCampaign);
  const [selectedUploadAsset, setSelectedUploadAsset] = useState<string>('');
  const [originalAsset, setOriginalAsset] = useState<any>(emptyFlashCampaign);
  const [selectedFlashCampaigns, setSelectedFlashCampaigns] = useState<any>([]);
  const [deleteFlashCampaignDialog, setDeleteFlashCampaignDialog] =
    useState<boolean>(false);

  const [deleteFlashCampaignsDialog, setdeleteFlashCampaignsDialog] =
    useState<boolean>(false);
  const [flashCampaignDialog, setFlashCampaignDialog] =
    useState<boolean>(false);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [editAssetDialogConfirmation, setEditAssetDialogConfirmation] =
    useState(false);
  const [globalFilter, setGlobalFilter] = useState<any>([]);
  const [updateDialog, setUpdateDialog] = useState<boolean>(false);
  const [isUpload, setIsUpload] = useState<boolean>(true);
  const [isUploadMeta, setIsUploadMeta] = useState<boolean>(false);
  const [tableProps, setTableProps] = useState<CustomDataTableProps>({
    first: 0,
    rows: 10,
    page: 0,
    sortField: 'name',
    sortOrder: 1,
    filters: {
      name: { value: '', matchMode: 'custom' },
    },
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(MpFlashCampaign.schemaValidation()),
  });

  // form submit button reference
  const formSubmit = useRef(null);

  const toast = useRef<any>(null);
  const dt = useRef<any>(null);

  const [showTooltip, setShowTooltip] = useState(false);

  const editFlashCampaign = (b: MpFlashCampaign) => {
    if (!b.meta) {
      b.meta = emptyFlashCampaign.meta;
    }

    if (b.startDate && b.endDate) {
      b.startDate = timezoneOffsetOut(b.startDate);
      b.endDate = timezoneOffsetOut(b.endDate);
    }

    if (b.backgroundColor) {
      b.color = b.backgroundColor;
    }

    setIsUpload(false);
    // setIsUpload(false);
    setFlashCampaign({ ...b });
    setOriginalAsset({ ...b });
    reset(b);

    if (!flashCampaignDialog) {
      setFlashCampaignDialog(true);
    }
  };

  const getFlashCampaigns = async () => {
    setLoading(true);
    const query = QueryBuilderHelper.get(tableProps as DataTableProps);

    try {
      const data = await FlashCampaignService.getFlashCampaigns(query);

      if (data?.resultData?.page) {
        setFlashCampaigns(data.resultData?.page);
        setTotalRecords(data.resultData?.totalCount);
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
    getFlashCampaigns();
  }, [tableProps]);

  const getFormErrorMessage = (name: string) => {
    return (
      errors[name] && <small className="p-error">{errors[name]?.message}</small>
    );
  };

  const onGlobalFilterChange = (event: any) => {
    let searchQuery = event?.target?.value || '';
    if (searchQuery.length < 3) searchQuery = '';
    const newTableProp = { ...tableProps };
    newTableProp.filters.name.value = searchQuery;
    setTableProps({ ...newTableProp });
  };

  const header = (
    <div className="table-header">
      <h5 className="p-m-0">Manage Flash Campaign</h5>
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

  const openNew = async () => {
    const newimage = constants.IMAGE.EMPTY_IMAGE_URL;
    emptyFlashCampaign.logoImageUrl = newimage;
    emptyFlashCampaign.coverImageUrl = newimage;

    setFlashCampaign(emptyFlashCampaign);
    setOriginalAsset(emptyFlashCampaign);
    reset(emptyFlashCampaign);
    setFlashCampaignDialog(true);
  };

  const confirmDeleteSelected = () => {
    setdeleteFlashCampaignsDialog(true);
  };

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
          disabled={!selectedFlashCampaigns || !selectedFlashCampaigns.length}
        />
      </>
    );
  };

  const nameBodyTemplate = (rowData: any) => {
    return <>{rowData.name}</>;
  };

  const activeBodyTemplate = (rowData: any) => {
    return (
      <>
        <Checkbox checked={rowData.active} />
      </>
    );
  };

  const startDateBodyTemplate = (rowData: any) => {
    const date = formatDate(rowData.startDate);
    return <>{date}</>;
  };

  const endDateBodyTemplate = (rowData: any) => {
    const date = formatDate(rowData.endDate);
    return <>{date}</>;
  };

  const descriptionBodyTemplate = (rowData: any) => {
    const showDescriptionText = `.description${rowData._id}`;
    const classText = `description${rowData._id} data-pr-tooltip`;
    const text =
      rowData.description.length > 100
        ? `${rowData.description.substring(0, 100)}...`
        : rowData.description;
    return (
      <>
        <Tooltip target={showDescriptionText} content={rowData.description} />
        <span className={classText}>{text}</span>
      </>
    );
  };

  const logoImageBodyTemplate = (rowData: any) => {
    return (
      <img
        src={`${rowData.logoImageUrl}`}
        alt={rowData.logoImageUrl}
        className="product-image"
      />
    );
  };

  const coverImageBodyTemplate = (rowData: any) => {
    return (
      <img
        src={`${rowData.coverImageUrl}`}
        alt={rowData.coverImageUrl}
        className="product-image"
      />
    );
  };

  const hideDeleteFlashCampaignDialog = () => {
    setDeleteFlashCampaignDialog(false);
  };

  const destroySelectedFlashCampaign = async (data: any) => {
    try {
      await FlashCampaignService.deleteFlashCampaign(data);

      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Flash Campaign Deleted',
        life: 3000,
      });
      getFlashCampaigns();
    } catch (error: any) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.friendlyMessage,
        life: 3000,
      });
    }
  };

  const deleteSelectedFlashCampaign = () => {
    destroySelectedFlashCampaign(flashCampaign);
    setDeleteFlashCampaignDialog(false);
    getFlashCampaigns();
  };

  const deleteFalshCampaigns = async () => {
    const selected = flashCampaigns.filter((val: any) =>
      selectedFlashCampaigns.includes(val),
    );
    selected.forEach((val: any) => {
      destroySelectedFlashCampaign(val);
    });

    setdeleteFlashCampaignsDialog(false);
  };

  const isNewAsset = !originalAsset.urlId;

  const deleteFlashCampaignDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteFlashCampaignDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedFlashCampaign}
      />
    </>
  );

  const deleteFlashCampaignsDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteFlashCampaignDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteFalshCampaigns}
      />
    </>
  );

  const confirmDeleteFlashCampaign = (data: any) => {
    setFlashCampaign(data);
    setDeleteFlashCampaignDialog(true);
  };

  const hideDeleteDialog = () => {
    setDeleteFlashCampaignDialog(false);
  };

  const hideDeleteFalshCampaignsDialog = () => {
    setdeleteFlashCampaignsDialog(false);
  };

  const isAssetEditAndNotSaved = () => {
    const editAssetStr = JSON.stringify(flashCampaign);
    const originalAssetStr = JSON.stringify(originalAsset);
    return editAssetStr !== originalAssetStr;
  };

  const hideDialog = () => {
    if (updateDialog) {
      setUpdateDialog(false);
    }

    if (isAssetEditAndNotSaved()) {
      return setEditAssetDialogConfirmation(true);
    }

    // setSubmitted(false);
    return setFlashCampaignDialog(false);
  };

  const findIndexById = (id: any) => {
    let index = -1;
    for (let i = 0; i < flashCampaigns.length; i += 1) {
      // eslint-disable-next-line no-underscore-dangle
      if (flashCampaigns[i]._id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const onSubmit = async () => {
    if (flashCampaign.name.trim()) {
      try {
        const verifyMetaValue =
          flashCampaign.meta &&
          Object.values(flashCampaign.meta).every(i => !i);

        if (verifyMetaValue) {
          flashCampaign.meta = null;
        }

        flashCampaign.startDate = timezoneOffsetIn(flashCampaign.startDate);
        flashCampaign.endDate = timezoneOffsetIn(flashCampaign.endDate);

        if (flashCampaign._id && flashCampaign._id !== null) {
          await FlashCampaignService.saveFlashCampaign(flashCampaign);
        } else {
          await FlashCampaignService.createFlashCampaign(flashCampaign);
        }

        const pps: any[] = [...flashCampaigns];
        const pp: any = { ...flashCampaigns };
        if (flashCampaign._id) {
          const index = findIndexById(flashCampaign._id);

          pps[index] = pp;
          toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Flash Campaign Updated',
            life: 3000,
          });
        } else {
          pps.push(pp);
          toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Flash Campaign Created',
            life: 3000,
          });
        }

        setFlashCampaignDialog(false);
        getFlashCampaigns();
      } catch (error: any) {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: error?.friendlyMessage,
          life: 3000,
        });
      }
    }
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="actions">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-mr-2"
          onClick={() => editFlashCampaign(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteFlashCampaign(rowData)}
        />
      </div>
    );
  };

  const onInputChange = (e: any, name: any) => {
    let val = '';

    if (e.target) {
      if (e.target.type === 'checkbox') {
        val = e.target.checked;
      } else if (e.target.value?._id) {
        val = e.target.value?._id || null;
      } else {
        val = e.target.value || null;
      }
    } else {
      val = e.value;
    }

    const pp = { ...flashCampaign };
    pp[`${name}`] = val;

    if (name === 'urlId') {
      if (pp[`${name}`]) {
        setIsUpload(false);
        setIsUploadMeta(true);
      } else {
        setIsUpload(true);
        setIsUploadMeta(false);
      }
    }

    setFlashCampaign(pp);
    reset(pp);
  };

  const onInputNumberChange = (e: any, name: string) => {
    const val = e.value || 0;
    const pp = { ...flashCampaign };
    pp[`${name}`] = val;

    setFlashCampaign(pp);
    reset(pp);
  };

  const OnMetaInputChange = (e: any, name: string) => {
    let val = e.target.value || '';

    if (name === 'keywords' && val) {
      val = val.split(',').join();
    }

    const newEditedFlashCampaign: any = JSON.parse(
      JSON.stringify(flashCampaign),
    );

    newEditedFlashCampaign.meta[`${name}`] = val;

    reset(newEditedFlashCampaign);
    setFlashCampaign(newEditedFlashCampaign);
  };

  const closeAssetEditDialogAndEditDialog = async () => {
    // setSubmitted(false);
    setFlashCampaignDialog(false);
    setEditAssetDialogConfirmation(false);
  };

  const hideEditAssetConfirmationDialog = () => {
    setEditAssetDialogConfirmation(false);
  };

  const editAssetsDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideEditAssetConfirmationDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={closeAssetEditDialogAndEditDialog}
      />
    </>
  );

  const flashCampaignDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-text"
        onClick={() => (formSubmit.current as any).click()}
      />
    </>
  );

  const onSort = (event: any) => {
    setSelectedFlashCampaigns([]);
    setTableProps({ ...tableProps, ...event });
  };

  const onPage = (event: any) => {
    setSelectedFlashCampaigns([]);
    setTableProps({ ...tableProps, ...event });
  };

  const onFilter = (event: any) => {
    setSelectedFlashCampaigns([]);
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
            value={flashCampaigns}
            selection={selectedFlashCampaigns}
            onSelectionChange={e => setSelectedFlashCampaigns(e.value)}
            lazy
            onSort={onSort}
            onPage={onPage}
            onFilter={onFilter}
            filters={filters}
            dataKey="_id"
            paginator
            rows={tableProps.rows}
            first={tableProps.first}
            rowsPerPageOptions={[5, 10, 25]}
            totalRecords={totalRecords}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} flash campaign"
            globalFilter={globalFilter}
            globalFilterFields={['name']}
            emptyMessage="No flash campaign found."
            header={header}
            loading={loading}
            sortField={tableProps.sortField}
            sortOrder={tableProps.sortOrder}
          >
            <Column selectionMode="multiple" />
            <Column
              field="name"
              header="Name"
              sortable
              body={nameBodyTemplate}
            />
            <Column
              field="active"
              header="Active"
              sortable
              body={activeBodyTemplate}
            />
            <Column
              field="startDate"
              header="Start Date"
              sortable
              body={startDateBodyTemplate}
            />
            <Column
              field="endDate"
              header="End Date"
              sortable
              body={endDateBodyTemplate}
            />
            <Column
              field="description"
              header="Default description"
              sortable
              body={descriptionBodyTemplate}
            />
            <Column
              field="image"
              header="Logo Image"
              body={logoImageBodyTemplate}
            />
            <Column
              field="image"
              header="Cover Image"
              body={coverImageBodyTemplate}
            />
            <Column body={actionBodyTemplate} />
          </DataTable>

          <Dialog
            visible={editAssetDialogConfirmation}
            style={{ width: '500px' }}
            header="Confirm"
            modal
            footer={editAssetsDialogFooter}
            onHide={hideEditAssetConfirmationDialog}
            blockScroll
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle p-mr-3"
                style={{ fontSize: '2rem' }}
              />
              <span>
                There are changes not saved. Are you sure you want to quit?
              </span>
            </div>
          </Dialog>

          <Dialog
            visible={flashCampaignDialog}
            style={{ width: '1500px' }}
            header="Flash Campaign Details"
            modal
            className="p-fluid"
            footer={flashCampaignDialogFooter}
            onHide={hideDialog}
            blockScroll
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              onKeyPress={e => {
                e.key === constants.KEYPRESS.ENTER && e.preventDefault();
              }}
            >
              <div className="formgrid grid">
                <div className="field col">
                  <label htmlFor="Name">Name</label>

                  <Controller
                    name="name"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        {...field}
                        onChange={e => onInputChange(e, 'name')}
                        autoFocus
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage('name')}
                </div>

                <div className="field col">
                  <label htmlFor="MenuLabel">Menu Name</label>

                  <Controller
                    name="menuLabel"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        {...field}
                        onChange={e => onInputChange(e, 'menuLabel')}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage('menuLabel')}
                </div>
                <div className="field col-1 field-checkbox align-items-center">
                  <Checkbox
                    inputId="active"
                    name="active"
                    value={flashCampaign.active}
                    checked={flashCampaign.active}
                    onChange={e => onInputChange(e, 'active')}
                  />
                  <label htmlFor="Active">Active</label>
                </div>
              </div>
              <div className="formgrid grid">
                <div className="field col">
                  <label htmlFor="Url id">Url Id</label>

                  <Controller
                    name="urlId"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        disabled={originalAsset.urlId}
                        {...field}
                        onChange={e => onInputChange(e, 'urlId')}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage('urlId')}
                </div>
                <div className="field col-1">
                  <label htmlFor="backgroundColor">Background</label>
                  <div
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                      marginLeft: '5px',
                    }}
                  >
                    <i
                      className="pi pi-exclamation-circle p-mr-1"
                      style={{ fontSize: '1rem', cursor: 'pointer' }}
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                    />

                    {showTooltip && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: '20px',
                          background: '#ccc',
                          padding: '5px',
                          borderRadius: '5px',
                          zIndex: 2,
                          width: '150px',
                        }}
                      >
                        soreto-pink: #f53855 soreto-grey: #334d5c soreto-green:
                        #46b29d
                      </div>
                    )}
                  </div>
                  <Controller
                    name="backgroundColor"
                    control={control}
                    render={({ field, fieldState }) => (
                      <div style={{ display: 'flex' }}>
                        <InputText
                          id={field.name}
                          {...field}
                          value={field.value}
                          onChange={(e: any) => {
                            onInputChange(e, 'backgroundColor');
                          }}
                          defaultValue=""
                          type="text"
                        />
                        <ColorPicker
                          style={{
                            width: '5px',
                            marginRight: '15px',
                            padding: '5px',
                          }}
                          id={field.name}
                          {...field}
                          onChange={(e: any) => {
                            field.onChange(e.value);
                            onInputChange(e, 'backgroundColor');
                          }}
                          value={
                            !flashCampaign.color
                              ? '#f53855'
                              : flashCampaign.color
                          }
                          format="hex"
                        />
                      </div>
                    )}
                  />
                  {getFormErrorMessage('actionButtonBackgroundColor')}
                </div>

                <div className="p-field col">
                  <label htmlFor="startDate">Start Date</label>
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Calendar
                        id={field.name}
                        {...field}
                        dateFormat="dd/mm/yy"
                        value={flashCampaign.startDate}
                        onChange={e => onInputChange(e, 'startDate')}
                        showOnFocus={false}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                        showIcon
                        showTime
                      />
                    )}
                  />
                  {getFormErrorMessage('startDate')}
                </div>

                <div className="p-field col">
                  <label htmlFor="endDate">End Date</label>
                  <Controller
                    name="endDate"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Calendar
                        dateFormat="dd/mm/yy"
                        id={field.name}
                        {...field}
                        value={flashCampaign.endDate}
                        onChange={e => onInputChange(e, 'endDate')}
                        showOnFocus={false}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                        showIcon
                        showTime
                        showSeconds
                      />
                    )}
                  />
                  {getFormErrorMessage('endDate')}
                </div>
              </div>
              <div className="formgrid grid">
                <div className="p-field p-col">
                  <label htmlFor="Ttiel">Title</label>

                  <Controller
                    name="title"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        {...field}
                        onChange={e => onInputChange(e, 'title')}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage('name')}
                </div>
              </div>
              <Fieldset legend="Descriptions">
                <div className="formgrid grid">
                  <div className="field col">
                    <div className="p-field p-inputtextarea">
                      <label htmlFor="descriptionSmall">Small</label>
                      <Controller
                        name="descriptionSmall"
                        control={control}
                        render={({ field, fieldState }) => (
                          <InputTextarea
                            rows={5}
                            cols={30}
                            id={field.name}
                            {...field}
                            onChange={e => onInputChange(e, 'descriptionSmall')}
                            autoResize
                            className={classNames({
                              'p-invalid': fieldState.invalid,
                            })}
                          />
                        )}
                      />
                      {getFormErrorMessage('descriptionSmall')}
                    </div>
                  </div>
                  <div className="field col">
                    <div className="p-field p-inputtextarea">
                      <label htmlFor="descriptionMedium">Medium</label>
                      <Controller
                        name="descriptionMedium"
                        control={control}
                        render={({ field, fieldState }) => (
                          <InputTextarea
                            rows={5}
                            cols={30}
                            id={field.name}
                            {...field}
                            onChange={e =>
                              onInputChange(e, 'descriptionMedium')
                            }
                            autoResize
                            className={classNames({
                              'p-invalid': fieldState.invalid,
                            })}
                          />
                        )}
                      />
                      {getFormErrorMessage('descriptionMedium')}
                    </div>
                  </div>
                  <div className="field col">
                    <div className="p-field p-inputtextarea">
                      <label htmlFor="description">Default</label>
                      <Controller
                        name="description"
                        control={control}
                        render={({ field, fieldState }) => (
                          <InputTextarea
                            rows={5}
                            cols={30}
                            id={field.name}
                            {...field}
                            onChange={e => onInputChange(e, 'description')}
                            autoResize
                            className={classNames({
                              'p-invalid': fieldState.invalid,
                            })}
                          />
                        )}
                      />
                      {getFormErrorMessage('description')}
                    </div>
                  </div>
                </div>
              </Fieldset>
              <div
                className="p-formgrid p-grid pb-3"
                style={{ margin: '20px' }}
              >
                <div className="p-field p-col">
                  <Controller
                    name="logoImageUrl"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Upload
                        friendlyName="Logo Image"
                        isActive={updateDialog}
                        setIsActive={setUpdateDialog}
                        asset="logoImageUrl"
                        setSelectedAsset={setSelectedUploadAsset}
                        src={field.value}
                        section="flashCampaign"
                        isUploadButtonDisabled={isUpload}
                        originalAssetObj={flashCampaign}
                        setAsset={setFlashCampaign}
                        changedProperty={selectedUploadAsset}
                        resetModal={reset}
                        visible={updateDialog}
                        labelSize="404 x 208"
                      />
                    )}
                  />
                  {getFormErrorMessage('logoImageUrl')}
                </div>

                <div className="p-field p-col">
                  <Controller
                    name="coverImageUrl"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Upload
                        friendlyName="Cover Image"
                        isActive={updateDialog}
                        setIsActive={setUpdateDialog}
                        asset="coverImageUrl"
                        setSelectedAsset={setSelectedUploadAsset}
                        src={field.value}
                        isUploadButtonDisabled={isUpload}
                        section="flashCampaign"
                        originalAssetObj={flashCampaign}
                        setAsset={setFlashCampaign}
                        changedProperty={selectedUploadAsset}
                        resetModal={reset}
                        visible={updateDialog}
                        labelSize="1440 x 300"
                      />
                    )}
                  />
                  {getFormErrorMessage('coverImageUrl')}
                </div>
              </div>
              <Meta
                reset={reset}
                control={control}
                formErrors={errors}
                onChange={OnMetaInputChange}
                classNames={classNames}
                data={{
                  originalAssetObj: flashCampaign,
                  setAsset: setFlashCampaign,
                }}
                section="flashCampaign"
                integration={isUploadMeta}
              />

              <input type="submit" hidden ref={formSubmit} />
            </form>
          </Dialog>
          <Dialog
            visible={deleteFlashCampaignDialog}
            style={{ width: '1000px' }}
            header="Confirm"
            modal
            footer={deleteFlashCampaignDialogFooter}
            onHide={hideDeleteDialog}
            blockScroll
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle p-mr-3"
                style={{ fontSize: '2rem' }}
              />
              {flashCampaign && (
                <span>
                  Are you sure you want to delete <b>{flashCampaign.name}</b>?
                </span>
              )}
            </div>
          </Dialog>
          <Dialog
            visible={deleteFlashCampaignsDialog}
            style={{ width: '1000px' }}
            header="Confirm"
            modal
            footer={deleteFlashCampaignsDialogFooter}
            onHide={hideDeleteFalshCampaignsDialog}
            blockScroll
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle p-mr-3"
                style={{ fontSize: '2rem' }}
              />
              {flashCampaign && (
                <span>
                  Are you sure you want to delete <b>{flashCampaign.name}</b>?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export default Index;
