/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useRef } from 'react';
import { Column } from 'primereact/column';
import { classNames } from 'primereact/utils';
import {
  DataTable,
  DataTableProps,
  DataTableSortOrderType,
} from 'primereact/datatable';
import { confirmPopup } from 'primereact/confirmpopup'; // To use confirmPopup method
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { Tooltip } from 'primereact/tooltip';
import { yupResolver } from '@hookform/resolvers/yup';
import { Dialog } from 'primereact/dialog';
import { Controller, useForm } from 'react-hook-form';
import NotificationService from '../../services/NotificationService';
import MpNotification from '../../entities/mpNotification';
import QueryBuilderHelper from '../../helpers/QueryBuilderHelper';
import DropdownMpOffer from '../../components/DropdownMpOffer';
import DropdownMpCategories from '../../components/DropdownMpCategories';
import DropdownMpBrand from '../../components/DropdownMpBrand';
import constants from '../../shared/constants';

interface CustomDataTableProps {
  first: number;
  rows: number;
  page: number;
  sortField: string;
  sortOrder: DataTableSortOrderType;
  filters: { message: { value: string; matchMode: string } };
}

const NotificationPage = () => {
  const emptyNotification: MpNotification = new MpNotification();

  const [notificationDialog, setNotificationDialog] = useState<boolean>(false);
  const [deleteNotificationtDialog, setDeleteNotificationtDialog] =
    useState<boolean>(false);
  const [deleteNotificationsDialog, setDeleteNotificationsDialog] =
    useState<boolean>(false);
  const [notification, setNotification] = useState<any>(emptyNotification);
  const [notifications, setNotifications] = useState<Array<MpNotification>>([]);
  const [selectedNotification, setSelectedNotification] = useState<any>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    message: { value: '', matchMode: 'custom' },
  });
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [tableProps, setTableProps] = useState<CustomDataTableProps>({
    first: 0,
    rows: 10,
    page: 0,
    sortField: 'publishedAt',
    sortOrder: 1,
    filters: {
      message: { value: '', matchMode: 'custom' },
    },
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(MpNotification.schemaValidation()),
  });

  const toast = useRef<any>(null);

  const dt = useRef<any>(null);

  const getNotifications = async () => {
    // set state as loading
    setLoading(true);

    const query = QueryBuilderHelper.get(tableProps as DataTableProps);

    try {
      // fetch data from api
      const data = await NotificationService.getNotifications(query);

      if (data?.resultData?.page) {
        setNotifications(data.resultData.page);
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
    getNotifications();
  }, [tableProps]);

  const deleteSingleNotification = async (notificationId: any) => {
    try {
      await NotificationService.deleteNotification(notificationId);
      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Notification Deleted',
        life: 3000,
      });
    } catch (error: any) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.friendlyMessage,
        life: 3000,
      });
    }
  };

  const openNew = () => {
    setNotification(emptyNotification);
    reset({ notification });
    setSubmitted(false);
    setNotificationDialog(true);
  };

  const hideDeleteNotificationtDialog = () => {
    setDeleteNotificationtDialog(false);
  };

  const confirmDeleteOneNotification = (n: any) => {
    setNotification(n);
    setDeleteNotificationtDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setNotificationDialog(false);
  };

  const hideDeleteNotificationDialog = () => {
    setDeleteNotificationsDialog(false);
  };

  const hideDeleteNotificationsDialog = () => {
    setDeleteNotificationsDialog(false);
  };

  const editNotification = (ntf: MpNotification) => {
    setNotification({ ...ntf });
    reset(ntf);
    setNotificationDialog(true);
  };

  const confirmDeleteNotification = async (notificationId: string) => {
    await deleteSingleNotification(notificationId);
    getNotifications();
  };

  const findIndexById = (id: string) => {
    let index = -1;
    for (let i = 0; i < notifications.length; i += 1) {
      if (notifications[i]._id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const publishNotifications = () => {
    setLoading(true);

    confirmPopup({
      message:
        'Are you sure you want to proceed? This operation cannot be undone.',
      icon: 'pi pi-exclamation-triangle',
      dismissable: false,
      accept: async () => {
        try {
          const sentNotifications =
            await NotificationService.publishNotifications(
              selectedNotification.map((n: any) => n._id),
            );

          const pps: any[] = [...notifications];

          sentNotifications.forEach((sentNot: any) => {
            const index = findIndexById(sentNot._id);
            pps[index] = sentNot;
          });

          setNotifications(pps);
          setSelectedNotification([]);

          setLoading(false);

          toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Notifications Published',
            life: 3000,
          });
        } catch (error: any) {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: error?.friendlyMessage,
            life: 3000,
          });

          setLoading(false);
        }
      },
      reject: () => {
        setLoading(false);
      },
    });
  };

  const confirmDeleteSelected = () => {
    setDeleteNotificationsDialog(true);
  };

  const deleteOneNotification = async () => {
    await deleteSingleNotification(notification._id);
    getNotifications();
    setDeleteNotificationtDialog(false);
  };

  // delete from the list of selected notifications
  const deleteSelectedNotifications = async (
    isMultipleRow = true,
    notificationId?: string,
  ) => {
    if (isMultipleRow) {
      await selectedNotification.forEach(async (ntf: MpNotification) => {
        await deleteSingleNotification(ntf._id);
      });
    } else {
      deleteSingleNotification(notificationId);
    }
    // close the popup
    hideDeleteNotificationDialog();

    // Reset select Notification
    setSelectedNotification([]);

    getNotifications();
  };

  const onInputChange = (e: any, name: string) => {
    let val;

    /**
     * The category, brand and offer dropdown use the whole object,
     * not just the _id, hence  val = ..._id if it's an object.
     * The '|| null' part is because the backend won't update the field if its undefined.
     */
    if (e.target) {
      if (e.target.type === 'checkbox') {
        val = e.target.checked;
      } else if (e.target.value?._id) {
        val = e.target.value?._id || null;
      } else {
        val = e.target.value || null;
      }
    }

    const newNotification: any = { ...notification };

    newNotification[`${name}`] = !val || val.trim() === '' ? null : val;

    setNotification(newNotification);
    reset(newNotification);
  };

  // form submit button reference
  const formSubmit = useRef(null);

  const onSubmit = async (data: any) => {
    try {
      const pps: any[] = [...notifications];
      const pp: any = { ...notification };

      if (notification._id) {
        await NotificationService.saveNotification(notification);
        const index = findIndexById(notification._id);
        pps[index] = pp;
        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Notification Updated',
          life: 3000,
        });
      } else {
        try {
          await NotificationService.createNotification(notification);
          pps.push(pp);
          toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Notification Created',
            life: 3000,
          });
        } catch (error: any) {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: error?.message,
            life: 10000,
          });
        }
      }
      setNotificationDialog(false);
      setNotification(emptyNotification);
    } catch (error: any) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.errorMessage,
        life: 3000,
      });
    }
    // update notifications
    getNotifications();
  };

  const formatDate = (date: any) => {
    if (!date) {
      return '';
    }

    const dateFormat = new Date(date);
    return dateFormat.toLocaleDateString('en-GB'); // dd/mm/yyyy
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
          disabled={!selectedNotification || !selectedNotification.length}
        />
      </>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <>
        <Button
          label="Publish"
          icon="pi pi-envelope"
          className="p-button-help"
          onClick={publishNotifications}
          disabled={
            !(
              selectedNotification &&
              selectedNotification.length > 0 &&
              !selectedNotification.some((sn: any) => sn.publishedAt)
            )
          }
        />
      </>
    );
  };

  const typeBodyTemplate = (rowData: any) => {
    return <>{rowData.type}</>;
  };

  const messageBodyTemplate = (rowData: any) => {
    return <>{rowData.message}</>;
  };

  const redirectUrlBodyTemplate = (rowData: any) => {
    return <>{rowData.redirectUrl}</>;
  };

  const publishedAtBodyTemplate = (rowData: any) => {
    return <>{formatDate(rowData.publishedAt)}</>;
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="actions">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-mr-2"
          onClick={() => editNotification(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteOneNotification(rowData)}
        />
      </div>
    );
  };

  const deleteNotificationDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteNotificationtDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteOneNotification}
      />
    </>
  );

  const getTargetType = (obj: any) => {
    if (obj.targetMpBrandId && obj.targetMpBrandId !== null) {
      return {
        targetId: obj.targetMpBrandId,
        type: 'BRAND',
      };
    }

    if (obj.targetMpOfferId && obj.targetMpOfferId !== null) {
      return {
        targetId: obj.targetMpOfferId,
        type: 'OFFER',
      };
    }

    if (obj.targetMpCategoryId && obj.targetMpCategoryId !== null) {
      return {
        targetId: obj.targetMpCategoryId,
        type: 'CATEGORY',
      };
    }

    return {
      targetId: 'SORETO',
      type: 'SORETO',
    };
  };

  const targetType = (rowData: any) => {
    const showTargetType = `.targetType_${rowData._id}`;
    const type = `targetType_${rowData._id} data-pr-tooltip`;
    const typeTarget = getTargetType(rowData);

    return (
      <>
        <Tooltip
          target={showTargetType}
          content={typeTarget.targetId}
          mouseTrack
          mouseTrackLeft={50}
          position="top"
        />
        <p className={type}>{typeTarget.type}</p>
      </>
    );
  };

  const getFormErrorMessage = (name: string) => {
    return <small className="p-error">{errors[name]?.message}</small>;
  };

  const onGlobalFilterChange = (event: any) => {
    let searchQuery = event?.target?.value || '';
    if (searchQuery.length < 3) searchQuery = '';
    const newTableProp = { ...tableProps };
    newTableProp.filters.message.value = searchQuery;
    setTableProps({ ...newTableProp });
  };

  const header = (
    <div className="table-header">
      <h5 className="p-m-0">Manage Notifications</h5>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={e => {
            onGlobalFilterChange(e);
          }}
          placeholder="Search by message"
        />
      </span>
    </div>
  );

  const notificationDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="Save"
        type="submit"
        icon="pi pi-check"
        className="p-button-text"
        onClick={() => (formSubmit.current as any).click()}
      />
    </>
  );

  const deleteNotificationsDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteNotificationsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={() => {
          deleteSelectedNotifications(true);
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

  const onFilter = (event: any) => {
    // setTableProps({ ...tableProps, ...event });
  };

  return (
    <div className="p-grid crud-demo">
      <div className="p-col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar
            className="p-mb-4 p-toolbar"
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          />

          <DataTable
            ref={dt}
            value={notifications}
            selection={selectedNotification}
            onSelectionChange={e => setSelectedNotification(e.value)}
            lazy
            onSort={onSort}
            onPage={onPage}
            onFilter={onFilter}
            dataKey="_id"
            paginator
            rows={tableProps.rows}
            first={tableProps.first}
            rowsPerPageOptions={[5, 10, 25]}
            totalRecords={totalRecords}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} notifications"
            emptyMessage="No notifications found."
            header={header}
            loading={loading}
            sortField={tableProps.sortField}
            sortOrder={tableProps.sortOrder}
          >
            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />

            <Column
              field="type"
              header="Type"
              sortable
              body={typeBodyTemplate}
            />

            <Column
              field="message"
              header="Message"
              sortable
              body={messageBodyTemplate}
            />

            <Column
              field="targetMPOfferId"
              header="Target Type"
              sortable
              body={targetType}
            />

            <Column
              field="publishedAt"
              header="Published At"
              sortable
              body={publishedAtBodyTemplate}
            />

            <Column
              field="redirectUrl"
              header="Redirect Url"
              sortable
              body={redirectUrlBodyTemplate}
            />

            <Column body={actionBodyTemplate} />
          </DataTable>

          <Dialog
            visible={notificationDialog}
            style={{ width: '550px' }}
            header="Notification Details"
            modal
            className="p-fluid"
            footer={notificationDialogFooter}
            onHide={hideDialog}
            blockScroll
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              onKeyPress={e => {
                e.key === constants.KEYPRESS.ENTER && e.preventDefault();
              }}
            >
              <div className="p-field">
                <label htmlFor="type">Type</label>

                <Controller
                  name="type"
                  control={control}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      {...field}
                      autoFocus
                      onChange={e => onInputChange(e, 'type')}
                      className={classNames({
                        'p-invalid': fieldState.invalid,
                      })}
                    />
                  )}
                />
                {getFormErrorMessage('type')}
              </div>

              <div className="p-field">
                <label htmlFor="message">Message</label>

                <Controller
                  name="message"
                  control={control}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      {...field}
                      onChange={e => onInputChange(e, 'message')}
                      className={classNames({
                        'p-invalid': fieldState.invalid,
                      })}
                    />
                  )}
                />
                {getFormErrorMessage('message')}
              </div>

              <div className="p-field">
                <label htmlFor="targetMpOfferId">Offer</label>
                <Controller
                  name="targetMpOfferId"
                  control={control}
                  render={({ field, fieldState }) => (
                    <DropdownMpOffer
                      id={field.name}
                      {...field}
                      value={field.value}
                      onChange={(e: any) => {
                        onInputChange(e, 'targetMpOfferId');
                      }}
                      className={classNames({
                        'p-invalid': fieldState.invalid,
                      })}
                    />
                  )}
                />
                {getFormErrorMessage('targetMpOfferId')}
              </div>

              <div className="p-field">
                <label htmlFor="targetMpBrandId">Brand</label>
                <Controller
                  name="targetMpBrandId"
                  control={control}
                  render={({ field, fieldState }) => (
                    <DropdownMpBrand
                      id={field.name}
                      {...field}
                      value={field.value}
                      onChange={(e: any) => {
                        onInputChange(e, 'targetMpBrandId');
                      }}
                      className={classNames({
                        'p-invalid': fieldState.invalid,
                      })}
                    />
                  )}
                />
                {getFormErrorMessage('targetMpBrandId')}
              </div>

              <div className="p-field">
                <label htmlFor="TargetMpCategoryId">Category</label>

                <Controller
                  name="targetMpCategoryId"
                  control={control}
                  render={({ field, fieldState }) => (
                    <DropdownMpCategories
                      id={field.name}
                      {...field}
                      value={field.value}
                      onChange={(e: any) => {
                        onInputChange(e, 'targetMpCategoryId');
                      }}
                      className={classNames({
                        'p-invalid': fieldState.invalid,
                      })}
                      singleSelect
                    />
                  )}
                />
                {getFormErrorMessage('targetMpCategoryId')}
              </div>

              <div className="p-field">
                <label htmlFor="redirectUrl">redirectUrl</label>

                <Controller
                  name="redirectUrl"
                  control={control}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      {...field}
                      onChange={e => onInputChange(e, 'redirectUrl')}
                      className={classNames({
                        'p-invalid': fieldState.invalid,
                      })}
                    />
                  )}
                />
                {getFormErrorMessage('redirectUrl')}
              </div>

              <input type="submit" hidden ref={formSubmit} />
            </form>
          </Dialog>

          <Dialog
            visible={deleteNotificationtDialog}
            style={{ width: '550px' }}
            header="Confirm"
            modal
            footer={deleteNotificationDialogFooter}
            onHide={hideDeleteNotificationtDialog}
            blockScroll
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle p-mr-3"
                style={{ fontSize: '2rem' }}
              />
              {notification && (
                <span>
                  Are you sure you want to delete <b>{notification.type}</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteNotificationsDialog}
            style={{ width: '550px' }}
            header="Confirm"
            modal
            footer={deleteNotificationsDialogFooter}
            onHide={hideDeleteNotificationsDialog}
            blockScroll
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle p-mr-3"
                style={{ fontSize: '2rem' }}
              />
              {notification && (
                <span>
                  Are you sure you want to delete the selected notifications?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
