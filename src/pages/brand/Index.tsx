/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-self-compare */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/destructuring-assignment */
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
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { classNames } from 'primereact/utils';
import { Tooltip } from 'primereact/tooltip';
import { Fieldset } from 'primereact/fieldset';
import { useSearchParams } from 'react-router-dom';
import DropdownClients from '../../components/DropdownClients';
import DropdownMpCategories from '../../components/DropdownMpCategories';
import BrandService from '../../services/BrandService';
import QueryBuilderHelper from '../../helpers/QueryBuilderHelper';
import MpBrand from '../../entities/mpBrand';
import Upload from '../../components/uploadComponent/Upload';
import constants from '../../shared/constants';
import Meta from '../../components/Meta';
import RankService from '../../services/RankService';

interface CustomDataTableProps {
  first: number;
  rows: number;
  page: number;
  sortField: string;
  sortOrder: DataTableSortOrderType;
  filters: { name: { value: string; matchMode: string } };
}

function Index() {
  const emptyBrand: MpBrand = new MpBrand();
  const [searchParams] = useSearchParams();
  const brandIdQuery = searchParams.get('mpBrandId');
  const filterDefinition: DataTableFilterMeta = {
    name: { value: '', matchMode: 'contains' },
  };

  const [filters, setFilters] = useState(filterDefinition);
  const [brands, setBrands] = useState<any[]>([]);
  const [brand, setBrand] = useState<any>(emptyBrand);
  const [selectedCategoriesIds, setSelectedCategoriesIds] = useState<string[]>(
    [],
  );
  const [selectedBrands, setSelectedBrands] = useState<any>([]);
  const [originalAsset, setOriginalAsset] = useState<any>(emptyBrand);
  const [selectedUploadAsset, setSelectedUploadAsset] = useState<string>('');
  const [deleteBrandsDialog, setDeleteBrandsDialog] = useState<boolean>(false);
  const [deleteBrandtDialog, setDeleteBrandtDialog] = useState<boolean>(false);
  const [brandDialog, setBrandDialog] = useState<boolean>(false);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [editAssetDialogConfirmation, setEditAssetDialogConfirmation] =
    useState(false);
  const [globalFilter, setGlobalFilter] = useState<any>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [updateDialog, setUpdateDialog] = useState<boolean>(false);
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
    resolver: yupResolver(MpBrand.schemaValidation()),
  });

  // form submit button reference
  const formSubmit = useRef(null);

  const toast = useRef<any>(null);
  const dt = useRef<any>(null);

  const editBrand = (b: any) => {
    if (!b.meta) {
      // eslint-disable-next-line no-param-reassign
      b.meta = emptyBrand.meta;
    }

    setBrand({ ...b });
    setOriginalAsset({ ...b });
    reset(b);

    if (!brandDialog) {
      setBrandDialog(true);
    }
  };

  const getBrands = () => {
    setLoading(true);
    BrandService.getBrands(QueryBuilderHelper.get(tableProps as DataTableProps))
      .then(data => {
        if (data?.resultData?.page) {
          setBrands(data.resultData?.page);
          setTotalRecords(data.resultData?.totalCount);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getBrandById = async (brandId: string) => {
    setLoading(true);

    try {
      const data = await BrandService.getByBrandId(brandId);
      const brandResult = data.resultData;
      let categoriesId = '';

      if (brandResult.categories) {
        categoriesId = brandResult.categories.map((categoriiesId: any) => {
          return categoriiesId.mpCategoryId;
        });
      }

      const myCategories = { ...brandResult, categoryIds: categoriesId };
      editBrand(myCategories);
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
    getBrands();
    if (brandIdQuery) {
      getBrandById(brandIdQuery);
      // setTypeForm('edit');
    }
  }, []);

  useEffect(() => {
    getBrands();
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
      <h5 className="p-m-0">Manage Brands</h5>
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
    const trendingIndex = await RankService.getLastTrendingIndex('/brand');
    const newimage = constants.IMAGE.EMPTY_IMAGE_URL;
    emptyBrand.logoImageUrl = newimage;
    emptyBrand.coverImageUrl = newimage;
    emptyBrand.cardImageUrl = newimage;
    emptyBrand.trendingIndex = trendingIndex.resultData.trendingIndex + 1;

    setBrand(emptyBrand);
    setOriginalAsset(emptyBrand);
    reset(emptyBrand);
    setSubmitted(false);
    setBrandDialog(true);
  };

  const confirmDeleteSelected = () => {
    setDeleteBrandtDialog(true);
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
          disabled={!selectedBrands || !selectedBrands.length}
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

  const descriptionBodyTemplate = (rowData: any) => {
    const showDescriptionText = `.brandDescription${rowData._id}`;
    const classText = `brandDescription${rowData._id} data-pr-tooltip`;
    const text =
      rowData.brandDescription.length > 100
        ? `${rowData.brandDescription.substring(0, 100)}...`
        : rowData.brandDescription;
    return (
      <>
        <Tooltip
          target={showDescriptionText}
          content={rowData.brandDescription}
        />
        <span className={classText}>{text}</span>
      </>
    );
  };

  const mobileDescriptionBodyTemplate = (rowData: any) => {
    const showDescriptionText = `.mobileBrandDescription${rowData._id}`;
    const classText = `mobileBrandDescription${rowData._id} data-pr-tooltip`;
    const text =
      rowData.mobileBrandDescription.length > 100
        ? `${rowData.mobileBrandDescription.substring(0, 100)}...`
        : rowData.mobileBrandDescription;
    return (
      <>
        <Tooltip
          target={showDescriptionText}
          content={rowData.mobileBrandDescription}
        />
        <span className={classText}>{text}</span>
      </>
    );
  };

  const tabletDescriptionBodyTemplate = (rowData: any) => {
    const showDescriptionText = `.tabletBrandDescription${rowData._id}`;
    const classText = `tabletBrandDescription${rowData._id} data-pr-tooltip`;
    const text =
      rowData.tabletBrandDescription.length > 100
        ? `${rowData.tabletBrandDescription$.substring(0, 100)}...`
        : rowData.tabletBrandDescription;
    return (
      <>
        <Tooltip
          target={showDescriptionText}
          content={rowData.tabletBrandDescription}
        />
        <span className={classText}>{text}</span>
      </>
    );
  };

  const cardImageBodyTemplate = (rowData: any) => {
    return (
      <img
        src={`${rowData.cardImageUrl}`}
        alt={rowData.cardImageUrl}
        className="product-image"
      />
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

  const hideDeleteBrandssDialog = () => {
    setDeleteBrandsDialog(false);
  };

  const destroySelectedBrand = async (data: any) => {
    try {
      await BrandService.deleteBrand(data);

      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Brand Deleted',
        life: 3000,
      });
      getBrands();
    } catch (error: any) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.friendlyMessage,
        life: 3000,
      });
    }
  };

  const deleteSelectedBrands = () => {
    destroySelectedBrand(brand);
    setDeleteBrandsDialog(false);
    getBrands();
  };

  const isNewAsset = !originalAsset.urlId;

  const deleteBrandssDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteBrandssDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedBrands}
      />
    </>
  );

  const confirmDeleteCategory = (productx: any) => {
    setBrand(productx);
    setDeleteBrandsDialog(true);
  };

  const hideDeleteBrandtDialog = () => {
    setDeleteBrandtDialog(false);
  };

  const hideDeleteBrandsDialog = () => {
    setDeleteBrandsDialog(false);
  };

  const hideDeleteBrandytDialog = () => {
    setDeleteBrandtDialog(false);
  };

  const isAssetEditAndNotSaved = () => {
    const editAssetStr = JSON.stringify(brand);
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

    setSubmitted(false);
    return setBrandDialog(false);
  };

  const findIndexById = (id: any) => {
    let index = -1;
    for (let i = 0; i < brands.length; i += 1) {
      // eslint-disable-next-line no-underscore-dangle
      if (brands[i]._id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  useEffect(() => {
    const newBrand = { ...brand };
    newBrand.categoryIds = selectedCategoriesIds;
    setBrand(newBrand);
  }, [selectedCategoriesIds]);

  const onSubmit = async () => {
    setSubmitted(true);
    let newBrand;

    if (brand.name.trim()) {
      try {
        const verifyMetaValue =
          brand.meta && Object.values(brand.meta).every(i => !i);

        if (verifyMetaValue) {
          brand.meta = null;
        }

        if (brand._id && brand._id !== null) {
          await BrandService.saveBrand(brand);
        } else {
          const result = await BrandService.createBrand(brand);
          newBrand = result.resultData;
        }

        const pps: any[] = [...brands];
        const pp: any = { ...brands };
        if (brand._id) {
          const index = findIndexById(brand._id);

          pps[index] = pp;
          toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Brand Updated',
            life: 3000,
          });
        } else {
          pps.push(pp);
          toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Brand Created',
            life: 3000,
          });
        }

        // if is not a new asset, close the edition dialog
        if (!isNewAsset) {
          setBrandDialog(false);
          getBrands();
          return;
        }

        // if it is a new asset, keep it open edit dialog to upload the images
        editBrand(newBrand);
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
          onClick={() => editBrand(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteCategory(rowData)}
        />
      </div>
    );
  };

  const onInputChange = (e: any, name: any) => {
    let val = '';

    if (e.target) {
      if (e.target.type === 'checkbox') {
        val = e.target.checked;
      } else {
        val = e.target.value || '';
      }
    }
    const pp = { ...brand };
    pp[`${name}`] = val;

    setBrand(pp);
    reset(pp);
  };

  const onInputNumberChange = (e: any, name: string) => {
    const val = e.value || 0;
    const pp = { ...brand };
    pp[`${name}`] = val;

    setBrand(pp);
    reset(pp);
  };

  const OnMetaInputChange = (e: any, name: string) => {
    let val = e.target.value || '';

    if (name === 'keywords' && val) {
      val = val.split(',').join();
    }

    const newEditedBrand: any = JSON.parse(JSON.stringify(brand));

    newEditedBrand.meta[`${name}`] = val;

    reset(newEditedBrand);
    setBrand(newEditedBrand);
  };

  const closeAssetEditDialogAndEditDialog = async () => {
    setSubmitted(false);
    setBrandDialog(false);
    setEditAssetDialogConfirmation(false);
  };

  const deleteBrands = async () => {
    const selected = brands.filter((val: any) => selectedBrands.includes(val));
    selected.forEach((val: any) => {
      destroySelectedBrand(val);
    });

    setDeleteBrandtDialog(false);
  };

  const deleteBrandsDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteBrandtDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteBrands}
      />
    </>
  );

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

  const brandtDialogFooter = (
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
    setSelectedBrands([]);
    setTableProps({ ...tableProps, ...event });
  };

  const onPage = (event: any) => {
    setSelectedBrands([]);
    setTableProps({ ...tableProps, ...event });
  };

  const onFilter = (event: any) => {
    setSelectedBrands([]);
    setTableProps({ ...tableProps, ...event });
  };

  const handleSelectedCategories = (arrayOfCategories: MpBrand[]) => {
    if (arrayOfCategories && arrayOfCategories.length) {
      const arrayOfCategoryIds = arrayOfCategories.map(selectedBrand => {
        return selectedBrand._id;
      });
      return setSelectedCategoriesIds(arrayOfCategoryIds);
    }
    return setSelectedCategoriesIds([]);
  };

  return (
    <div className="p-grid crud-demo">
      <div className="p-col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar className="p-mb-4 p-toolbar" left={leftToolbarTemplate} />
          <DataTable
            ref={dt}
            value={brands}
            selection={selectedBrands}
            onSelectionChange={e => setSelectedBrands(e.value)}
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
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} brands"
            globalFilter={globalFilter}
            globalFilterFields={['name']}
            emptyMessage="No brands found."
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
              field="brandDescription"
              header="Default description"
              sortable
              body={descriptionBodyTemplate}
            />
            <Column
              field="image"
              header="Card Image"
              body={cardImageBodyTemplate}
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
            visible={brandDialog}
            style={{ width: '1500px' }}
            header="Brand Details"
            modal
            className="p-fluid"
            footer={brandtDialogFooter}
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
                  <label htmlFor="Index" className="p-mr-2">
                    Trending index
                  </label>
                  <Controller
                    name="trendingIndex"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputNumber
                        id={field.name}
                        {...field}
                        value={brand.trendingIndex}
                        onValueChange={e =>
                          onInputNumberChange(e, 'trendingIndex')
                        }
                        mode="decimal"
                        useGrouping={false}
                        showButtons
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage('trendingIndex')}
                </div>
                <div className="field col-1 field-checkbox align-items-center">
                  <Checkbox
                    inputId="active"
                    name="active"
                    value={brand.active}
                    checked={brand.active}
                    onChange={e => onInputChange(e, 'active')}
                  />
                  <label htmlFor="Active">Active</label>
                </div>
              </div>

              <div className="formgrid grid">
                <div className="field col">
                  <label htmlFor="clientId">Client</label>

                  <Controller
                    name="clientId"
                    control={control}
                    render={({ field, fieldState }) => (
                      <DropdownClients
                        id={field.name}
                        value={field.value}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                        onChange={(e: any) => onInputChange(e, 'clientId')}
                      />
                    )}
                  />
                  {getFormErrorMessage('clientId')}
                </div>

                <div className="field col">
                  <label htmlFor="Short Name">Short Name</label>

                  <Controller
                    name="shortName"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        {...field}
                        onChange={e => onInputChange(e, 'shortName')}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage('shortName')}
                </div>
                <div className="field col">
                  <label htmlFor="Short Url">Short Url</label>

                  <Controller
                    name="shortUrl"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        {...field}
                        onChange={e => onInputChange(e, 'shortUrl')}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage('shortUrl')}
                </div>
              </div>

              <Fieldset legend="Descriptions">
                <div className="formgrid grid">
                  <div className="field col">
                    <div className="p-field p-inputtextarea">
                      <label htmlFor="brandDescriptionSmall">Small</label>
                      <Controller
                        name="brandDescriptionSmall"
                        control={control}
                        render={({ field, fieldState }) => (
                          <InputTextarea
                            rows={5}
                            cols={30}
                            id={field.name}
                            {...field}
                            onChange={e =>
                              onInputChange(e, 'brandDescriptionSmall')
                            }
                            autoResize
                            className={classNames({
                              'p-invalid': fieldState.invalid,
                            })}
                          />
                        )}
                      />
                      {getFormErrorMessage('brandDescriptionSmall')}
                    </div>
                  </div>
                  <div className="field col">
                    <div className="p-field p-inputtextarea">
                      <label htmlFor="brandDescriptionMedium">Medium</label>
                      <Controller
                        name="brandDescriptionMedium"
                        control={control}
                        render={({ field, fieldState }) => (
                          <InputTextarea
                            rows={5}
                            cols={30}
                            id={field.name}
                            {...field}
                            onChange={e =>
                              onInputChange(e, 'brandDescriptionMedium')
                            }
                            autoResize
                            className={classNames({
                              'p-invalid': fieldState.invalid,
                            })}
                          />
                        )}
                      />
                      {getFormErrorMessage('brandDescriptionMedium')}
                    </div>
                  </div>
                  <div className="field col">
                    <div className="p-field p-inputtextarea">
                      <label htmlFor="description">Default</label>
                      <Controller
                        name="brandDescription"
                        control={control}
                        render={({ field, fieldState }) => (
                          <InputTextarea
                            rows={5}
                            cols={30}
                            id={field.name}
                            {...field}
                            onChange={e => onInputChange(e, 'brandDescription')}
                            autoResize
                            className={classNames({
                              'p-invalid': fieldState.invalid,
                            })}
                          />
                        )}
                      />
                      {getFormErrorMessage('brandDescription')}
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
                    name="cardImageUrl"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Upload
                        friendlyName="Brand Card Image"
                        isActive={updateDialog}
                        setIsActive={setUpdateDialog}
                        asset="cardImageUrl"
                        setSelectedAsset={setSelectedUploadAsset}
                        src={field.value}
                        isUploadButtonDisabled={isNewAsset}
                        brandUrlId={brand.urlId}
                        section="brand"
                        originalAssetObj={brand}
                        setAsset={setBrand}
                        changedProperty={selectedUploadAsset}
                        resetModal={reset}
                        visible={updateDialog}
                        labelSize="380 x 210"
                      />
                    )}
                  />
                  {getFormErrorMessage('cardImageUrl')}
                </div>

                <div className="p-field p-col">
                  <Controller
                    name="logoImageUrl"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Upload
                        friendlyName="Brand Logo Image"
                        isActive={updateDialog}
                        setIsActive={setUpdateDialog}
                        asset="logoImageUrl"
                        setSelectedAsset={setSelectedUploadAsset}
                        src={field.value}
                        isUploadButtonDisabled={isNewAsset}
                        brandUrlId={brand.urlId}
                        section="brand"
                        originalAssetObj={brand}
                        setAsset={setBrand}
                        changedProperty={selectedUploadAsset}
                        resetModal={reset}
                        visible={updateDialog}
                        labelSize="150 x 150"
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
                        friendlyName="Brand Cover Image"
                        isActive={updateDialog}
                        setIsActive={setUpdateDialog}
                        asset="coverImageUrl"
                        setSelectedAsset={setSelectedUploadAsset}
                        src={field.value}
                        isUploadButtonDisabled={isNewAsset}
                        brandUrlId={brand.urlId}
                        section="brand"
                        originalAssetObj={brand}
                        setAsset={setBrand}
                        changedProperty={selectedUploadAsset}
                        resetModal={reset}
                        visible={updateDialog}
                        labelSize="1440 x 300"
                      />
                    )}
                  />
                  {getFormErrorMessage('coverImageUrl')}
                </div>

                <div className="p-field p-col">
                  <Controller
                    name="offerCardFallbackImage"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Upload
                        friendlyName="Offer card fallback"
                        isActive={updateDialog}
                        setIsActive={setUpdateDialog}
                        asset="offerCardFallbackImage"
                        setSelectedAsset={setSelectedUploadAsset}
                        src={field.value}
                        isUploadButtonDisabled={isNewAsset}
                        brandUrlId={brand.urlId}
                        section="brand"
                        originalAssetObj={brand}
                        setAsset={setBrand}
                        changedProperty={selectedUploadAsset}
                        resetModal={reset}
                        visible={updateDialog}
                        labelSize="380 x 210"
                      />
                    )}
                  />
                  {getFormErrorMessage('offerCardFallbackImage')}
                </div>
              </div>

              <div className="p-field">
                <label htmlFor="brandCategories">Categories</label>
                <Controller
                  name="categoryIds"
                  control={control}
                  render={({ field, fieldState }) => (
                    <DropdownMpCategories
                      id={field.name}
                      {...field}
                      value={field.value}
                      setSelectedCategoriesIds={setSelectedCategoriesIds}
                      onChange={(e: any) => {
                        field.onChange(e.target.value);
                        handleSelectedCategories(e.target.value);
                      }}
                      className={classNames({
                        'p-invalid': fieldState.invalid,
                      })}
                    />
                  )}
                />
                {getFormErrorMessage('brandCategories')}
              </div>

              <Meta
                reset={reset}
                control={control}
                formErrors={errors}
                onChange={OnMetaInputChange}
                classNames={classNames}
                data={{ originalAssetObj: brand, setAsset: setBrand }}
                section="brand"
              />

              <input type="submit" hidden ref={formSubmit} />
            </form>
          </Dialog>
          <Dialog
            visible={deleteBrandtDialog}
            style={{ width: '1000px' }}
            header="Confirm"
            modal
            footer={deleteBrandsDialogFooter}
            onHide={hideDeleteBrandtDialog}
            blockScroll
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle p-mr-3"
                style={{ fontSize: '2rem' }}
              />
              {brand && (
                <span>
                  Are you sure you want to delete <b>{brand.name}</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteBrandsDialog}
            style={{ width: '1000px' }}
            header="Confirm"
            modal
            footer={deleteBrandssDialogFooter}
            onHide={hideDeleteBrandsDialog}
            blockScroll
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle p-mr-3"
                style={{ fontSize: '2rem' }}
              />
              {brand && (
                <span>
                  Are you sure you want to delete <b>{brand.name}</b>?
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
