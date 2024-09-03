/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
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
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toolbar } from 'primereact/toolbar';
import { Checkbox } from 'primereact/checkbox';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import CategoryService from '../../services/CategoryService';
import QueryBuilderHelper from '../../helpers/QueryBuilderHelper';
import MpCategory from '../../entities/mpCategory';
import Meta from '../../components/Meta';
import RankService from '../../services/RankService';
import constants from '../../shared/constants';

interface CustomDataTableProps {
  first: number;
  rows: number;
  page: number;
  sortField: string;
  sortOrder: DataTableSortOrderType;
  filters: { name: { value: string; matchMode: string } };
}

const Index = () => {
  const emptyCategory: MpCategory = new MpCategory();

  const [categories, setCategories] = useState<any>(null);
  const [categoryDialog, setCategoryDialog] = useState<boolean>(false);
  const [deleteCategorytDialog, setDeleteCategorytDialog] =
    useState<boolean>(false);
  const [deleteCategoriesDialog, setDeleteCategoriesDialog] =
    useState<boolean>(false);
  const [category, setCategory] = useState<any>(emptyCategory);
  const [selectedCategories, setSelectedCategories] = useState<any>(null);
  const [globalFilter, setGlobalFilter] = useState<any>(null);
  const toast = useRef<any>(null);
  const dt = useRef<any>(null);

  /// ///////////
  // data table
  // ////////////
  const filterDefinition: DataTableFilterMeta = {
    name: { value: '', matchMode: 'contains' },
  };
  const [filters, setFilters] = useState(filterDefinition);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
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

  const isNewAsset = !category._id;

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(MpCategory.schemaValidation()),
  });

  // form submit button reference
  const formSubmit = useRef(null);

  /**
   * Get categories
   */
  const getCategories = async () => {
    // set the state as loading
    setLoading(true);

    const query = QueryBuilderHelper.get(tableProps as DataTableProps);

    try {
      // fetch data from api
      const data = await CategoryService.getCategories(query);

      if (data?.resultData?.page) {
        setCategories(data.resultData.page);
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
    getCategories();
  }, [tableProps]);

  const openNew = async () => {
    const index = await RankService.getLastTrendingIndex('/categories');

    emptyCategory.showCategoryMenuIndex =
      index.resultData.showCategoryMenuIndex + 1;
    emptyCategory.showFooterMenuIndex =
      index.resultData.showFooterMenuIndex + 1;
    emptyCategory.showHeaderMenuIndex =
      index.resultData.showHeaderMenuIndex + 1;
    emptyCategory.showTabPanelMenuIndex =
      index.resultData.showTabPanelMenuIndex + 1;

    setCategory(emptyCategory);
    reset(emptyCategory);
    setCategoryDialog(true);
  };

  const hideDialog = () => {
    setCategoryDialog(false);
  };

  const hideDeleteCategorytDialog = () => {
    setDeleteCategorytDialog(false);
  };

  const hideDeleteCategoriessDialog = () => {
    setDeleteCategoriesDialog(false);
  };

  const editCategory = (c: any) => {
    if (!c.meta) {
      // eslint-disable-next-line no-param-reassign
      c.meta = emptyCategory.meta;
    }

    setCategory({ ...c });
    reset(c);
    setCategoryDialog(true);
  };

  const confirmDeleteCategory = (productx: any) => {
    setCategory(productx);
    setDeleteCategorytDialog(true);
  };

  const deleteCategory = async () => {
    try {
      await CategoryService.deleteCategory(category);

      const pps = categories.filter((val: any) => val._id !== category._id);
      setCategories(pps);
      setDeleteCategorytDialog(false);
      setCategory(emptyCategory);

      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Category Deleted',
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

  const findIndexById = (id: any) => {
    let index = -1;
    for (let i = 0; i < categories.length; i += 1) {
      if (categories[i]._id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const confirmDeleteSelected = () => {
    setDeleteCategorytDialog(true);
  };

  const deleteSelectedProducts = () => {
    const pps = categories.filter(
      (val: any) => !selectedCategories.includes(val),
    );
    setCategories(pps);
    setDeleteCategoriesDialog(false);
    setSelectedCategories(null);
    toast.current.show({
      severity: 'success',
      summary: 'Successful',
      detail: 'Category Deleted',
      life: 3000,
    });
  };

  const onInputChange = (e: any, name: string) => {
    let val = '';

    if (e.target) {
      if (e.target.type === 'checkbox') {
        val = e.target.checked;
      } else {
        val = e.target.value || '';
      }
    }
    const pp: any = { ...category };
    pp[`${name}`] = val;

    setCategory(pp);
    reset(pp);
  };

  const onInputNumberChange = (e: any, name: string) => {
    const val = e.value || 0;
    const pp: any = { ...category };
    pp[`${name}`] = val;

    setCategory(pp);
    reset(pp);
  };

  const OnMetaInputChange = (e: any, name: string) => {
    let val = e.target.value || null;

    if (name === 'keywords' && val) {
      val = val.split(',').join();
    }

    const newEditedCategory: any = JSON.parse(JSON.stringify(category));

    newEditedCategory.meta[`${name}`] = val;

    reset(newEditedCategory);
    setCategory(newEditedCategory);
  };

  const onSubmit = async (data: any) => {
    let newCategory;
    try {
      const verifyMetaValue =
        category.meta && Object.values(category.meta).every(i => !i);

      if (verifyMetaValue) {
        category.meta = null;
      }

      if (category._id) {
        await CategoryService.saveCategory(category);
      } else {
        const result = await CategoryService.createCategory(category);
        newCategory = result.resultData;
      }

      const pps: any[] = [...categories];
      const pp: any = { ...category };
      if (category._id) {
        const index = findIndexById(category._id);

        pps[index] = pp;
        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Category Updated',
          life: 3000,
        });
      } else {
        pps.push(pp);
        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Category Created',
          life: 3000,
        });
      }

      if (!isNewAsset) {
        setCategories(pps);
        setCategoryDialog(false);
        setCategory(emptyCategory);
      } else {
        editCategory(newCategory);
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
          disabled={!selectedCategories || !selectedCategories.length}
        />
      </>
    );
  };

  const nameBodyTemplate = (rowData: any) => {
    return <>{rowData.name}</>;
  };

  const showOnHeaderMenu = (rowData: any) => {
    return (
      <>
        <Checkbox checked={rowData.showOnHeaderMenu} />
      </>
    );
  };

  const showHeaderMenuIndex = (rowData: any) => {
    return <>{rowData.showHeaderMenuIndex}</>;
  };

  const showOnTabPanelMenu = (rowData: any) => {
    return (
      <>
        <Checkbox checked={rowData.showOnTabPanelMenu} />
      </>
    );
  };

  const showTabPanelMenuIndex = (rowData: any) => {
    return <>{rowData.showTabPanelMenuIndex}</>;
  };

  const showOnCategoryMenu = (rowData: any) => {
    return (
      <>
        <Checkbox checked={rowData.showOnCategoryMenu} />
      </>
    );
  };

  const showCategoryMenuIndex = (rowData: any) => {
    return <>{rowData.showCategoryMenuIndex}</>;
  };

  const showOnFooterMenu = (rowData: any) => {
    return (
      <>
        <Checkbox checked={rowData.showOnFooterMenu} />
      </>
    );
  };

  const showFooterMenuIndex = (rowData: any) => {
    return <>{rowData.showFooterMenuIndex}</>;
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="actions">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-mr-2"
          onClick={() => editCategory(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteCategory(rowData)}
        />
      </div>
    );
  };

  const getFormErrorMessage = (name: string) => {
    return <small className="p-error">{errors[name]?.message}</small>;
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
      <h5 className="p-m-0">Manage Categories</h5>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={e => onGlobalFilterChange(e)}
          placeholder="Search..."
        />
      </span>
    </div>
  );

  const categorytDialogFooter = (
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
  const deleteCategoriesDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteCategorytDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteCategory}
      />
    </>
  );
  const deleteCategoriessDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteCategoriessDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedProducts}
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
            value={categories}
            selection={selectedCategories}
            onSelectionChange={e => setSelectedCategories(e.value)}
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
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} categories"
            globalFilter={globalFilter}
            globalFilterFields={['name']}
            emptyMessage="No categories found."
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
              filter
              body={nameBodyTemplate}
            />

            <Column
              field="showOnHeaderMenu"
              header="Header Menu"
              sortable
              body={showOnHeaderMenu}
            />

            <Column
              field="showHeaderMenuIndex"
              header="Header Menu Index"
              sortable
              body={showHeaderMenuIndex}
            />

            <Column
              field="showOnTabPanelMenu"
              header="Tab Panel"
              sortable
              body={showOnTabPanelMenu}
            />

            <Column
              field="showTabPanelMenuIndex"
              header="Tab Panel Menu Index"
              sortable
              body={showTabPanelMenuIndex}
            />

            <Column
              field="showOnCategoryMenu"
              header="Category Menu"
              sortable
              body={showOnCategoryMenu}
            />

            <Column
              field="showCategoryMenuIndex"
              header="Category Menu Index"
              sortable
              body={showCategoryMenuIndex}
            />

            <Column
              field="showOnFooterMenu"
              header="Footer Menu"
              sortable
              body={showOnFooterMenu}
            />

            <Column
              field="showFooterMenuIndex"
              header="Footer Menu Index"
              sortable
              body={showFooterMenuIndex}
            />

            <Column body={actionBodyTemplate} />
          </DataTable>

          <Dialog
            visible={categoryDialog}
            style={{ width: '550px' }}
            header="Category Details"
            modal
            className="p-fluid"
            footer={categorytDialogFooter}
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
                <label htmlFor="name">Name</label>

                <Controller
                  name="name"
                  control={control}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      {...field}
                      autoFocus
                      onChange={e => onInputChange(e, 'name')}
                      className={classNames({
                        'p-invalid': fieldState.invalid,
                      })}
                    />
                  )}
                />
                {getFormErrorMessage('name')}
              </div>

              <div className="p-field-checkbox">
                <Checkbox
                  inputId="active"
                  name="active"
                  value={category.active}
                  checked={category.active}
                  onChange={e => onInputChange(e, 'active')}
                />
                <label htmlFor="active">Active</label>
              </div>

              <div className="p-formgrid p-grid">
                <div className="p-field p-col">
                  <label htmlFor="price">Static Id</label>
                  <Controller
                    name="staticId"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        {...field}
                        onChange={e => onInputChange(e, 'staticId')}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage('staticId')}
                </div>
                <div className="p-field p-col">
                  <label htmlFor="price">Url Id</label>
                  <Controller
                    name="urlId"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
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
              </div>

              <div className="p-field">
                <label htmlFor="category1" className="p-mb-3">
                  Header Menu
                </label>
                <div className="p-formgrid p-grid">
                  <div className="p-field-checkbox p-col-6">
                    <Checkbox
                      inputId="showOnHeaderMenu"
                      name="showOnHeaderMenu"
                      value={category.showOnHeaderMenu}
                      checked={category.showOnHeaderMenu}
                      onChange={e => onInputChange(e, 'showOnHeaderMenu')}
                    />
                    <label htmlFor="category1">Show</label>
                  </div>
                  <div className="p-field-checkbox p-col-6">
                    <label htmlFor="showHeaderMenuIndex" className="p-mr-2">
                      Index
                    </label>

                    <Controller
                      name="showHeaderMenuIndex"
                      control={control}
                      render={({ field, fieldState }) => (
                        <InputNumber
                          id={field.name}
                          mode="decimal"
                          useGrouping={false}
                          showButtons
                          {...field}
                          onChange={e =>
                            onInputNumberChange(e, 'showHeaderMenuIndex')
                          }
                          className={classNames({
                            'p-invalid': fieldState.invalid,
                          })}
                        />
                      )}
                    />
                  </div>
                </div>
                {getFormErrorMessage('showHeaderMenuIndex')}
              </div>

              <div className="p-field">
                <label htmlFor="category1" className="p-mb-3">
                  Tab Panel Menu
                </label>
                <div className="p-formgrid p-grid">
                  <div className="p-field-checkbox p-col-6">
                    <Checkbox
                      inputId="showOnTabPanelMenu"
                      name="showOnTabPanelMenu"
                      value={category.showOnTabPanelMenu}
                      checked={category.showOnTabPanelMenu}
                      onChange={e => onInputChange(e, 'showOnTabPanelMenu')}
                    />
                    <label htmlFor="category1">Show</label>
                  </div>
                  <div className="p-field-checkbox p-col-6">
                    <label htmlFor="showTabPanelMenuIndex" className="p-mr-2">
                      Index
                    </label>
                    <Controller
                      name="showTabPanelMenuIndex"
                      control={control}
                      render={({ field, fieldState }) => (
                        <InputNumber
                          id={field.name}
                          mode="decimal"
                          useGrouping={false}
                          showButtons
                          {...field}
                          onChange={e =>
                            onInputNumberChange(e, 'showTabPanelMenuIndex')
                          }
                          className={classNames({
                            'p-invalid': fieldState.invalid,
                          })}
                        />
                      )}
                    />
                  </div>
                </div>
                {getFormErrorMessage('showTabPanelMenuIndex')}
              </div>

              <div className="p-field">
                <label htmlFor="category1" className="p-mb-3">
                  Category Menu
                </label>
                <div className="p-formgrid p-grid">
                  <div className="p-field-checkbox p-col-6">
                    <Checkbox
                      inputId="showOnCategoryMenu"
                      name="showOnCategoryMenu"
                      value={category.showOnCategoryMenu}
                      checked={category.showOnCategoryMenu}
                      onChange={e => onInputChange(e, 'showOnCategoryMenu')}
                    />
                    <label htmlFor="category1">Show</label>
                  </div>
                  <div className="p-field-checkbox p-col-6">
                    <label htmlFor="showCategoryMenuIndex" className="p-mr-2">
                      Index
                    </label>
                    <Controller
                      name="showCategoryMenuIndex"
                      control={control}
                      render={({ field, fieldState }) => (
                        <InputNumber
                          id={field.name}
                          mode="decimal"
                          useGrouping={false}
                          showButtons
                          {...field}
                          onChange={e =>
                            onInputNumberChange(e, 'showCategoryMenuIndex')
                          }
                          className={classNames({
                            'p-invalid': fieldState.invalid,
                          })}
                        />
                      )}
                    />
                  </div>
                </div>
                {getFormErrorMessage('showCategoryMenuIndex')}
              </div>

              <div className="p-field">
                <label htmlFor="category1" className="p-mb-3">
                  Footer Menu
                </label>
                <div className="p-formgrid p-grid">
                  <div className="p-field-checkbox p-col-6">
                    <Checkbox
                      inputId="showOnFooterMenu"
                      name="showOnFooterMenu"
                      value={category.showOnFooterMenu}
                      checked={category.showOnFooterMenu}
                      onChange={e => onInputChange(e, 'showOnFooterMenu')}
                    />
                    <label htmlFor="category1">Show</label>
                  </div>
                  <div className="p-field-checkbox p-col-6">
                    <label htmlFor="showFooterMenuIndex" className="p-mr-2">
                      Index
                    </label>
                    <Controller
                      name="showFooterMenuIndex"
                      control={control}
                      render={({ field, fieldState }) => (
                        <InputNumber
                          id={field.name}
                          mode="decimal"
                          useGrouping={false}
                          showButtons
                          {...field}
                          onChange={e =>
                            onInputNumberChange(e, 'showFooterMenuIndex')
                          }
                          className={classNames({
                            'p-invalid': fieldState.invalid,
                          })}
                        />
                      )}
                    />
                  </div>
                </div>
                {getFormErrorMessage('showFooterMenuIndex')}
              </div>

              <Meta
                control={control}
                formErrors={errors}
                onChange={OnMetaInputChange}
                classNames={classNames}
                data={{ originalAssetObj: category, setAsset: setCategory }}
                reset={reset}
                section="category"
              />
              <input type="submit" hidden ref={formSubmit} />
            </form>
          </Dialog>

          <Dialog
            visible={deleteCategorytDialog}
            style={{ width: '550px' }}
            header="Confirm"
            modal
            footer={deleteCategoriesDialogFooter}
            onHide={hideDeleteCategorytDialog}
            blockScroll
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle p-mr-3"
                style={{ fontSize: '2rem' }}
              />
              {category && (
                <span>
                  Are you sure you want to delete <b>{category.name}</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteCategoriesDialog}
            style={{ width: '550px' }}
            header="Confirm"
            modal
            footer={deleteCategoriessDialogFooter}
            onHide={hideDeleteCategoriessDialog}
            blockScroll
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle p-mr-3"
                style={{ fontSize: '2rem' }}
              />
              {category && (
                <span>
                  Are you sure you want to delete the selected categories?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Index;
