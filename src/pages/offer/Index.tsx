/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { Column } from 'primereact/column';
import { classNames } from 'primereact/utils';
import {
  DataTable,
  DataTableFilterMeta,
  DataTableProps,
  DataTableSortOrderType,
} from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { RadioButton } from 'primereact/radiobutton';
import { yupResolver } from '@hookform/resolvers/yup';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Fieldset } from 'primereact/fieldset';
import OfferService from '../../services/OfferService';
import RankService from '../../services/RankService';
import { Controller, useForm } from 'react-hook-form';
import MpOffer from '../../entities/mpOffer';
import QueryBuilderHelper from '../../helpers/QueryBuilderHelper';
import DropdownMpCategories from '../../components/DropdownMpCategories';
import CampaignVersionSelector from '../../components/CampaignVersionSelector';
import DropdownFlashCampaing from '../../components/DropdownFlashCampaign';
import Upload from '../../components/uploadComponent/Upload';
import constants from '../../shared/constants';
import { InputTextarea } from 'primereact/inputtextarea';
import DropdownMpBrand from '../../components/DropdownMpBrand';
import { timezoneOffsetOut } from '../../helpers/dateFormatter';
import Meta from '../../components/Meta';
import { useSearchParams } from 'react-router-dom';

interface CustomDataTableProps {
  first: number;
  rows: number;
  page: number;
  sortField: string;
  sortOrder: DataTableSortOrderType;
  filters: { ftSearch: { value: string; matchMode: string } };
  brandId: string;
}

const OffersPage = () => {
  const emptyOffer: MpOffer = new MpOffer();
  const  [searchParams]  = useSearchParams();
  const offerIdQuery = searchParams.get('mpOfferId');
  const filterDefinition: DataTableFilterMeta = {
    name: { value: '', matchMode: 'contains' },
  };
  const [campaignWarning, setCampaignWarning] = useState<boolean>(false);
  const [campaignVersionWarning, setCampaignVersionWarning] = useState<boolean>(false);
  const [campaignDialog, setCampaignDialog] = useState<boolean>(false);
  const [offerDialog, setOfferDialog] = useState<boolean>(false);
  const [updateDialog, setUpdateDialog] = useState<boolean>(false);
  const [selectedUploadAsset, setSelectedUploadAsset] = useState<string>('');
  const [deleteOffertDialog, setDeleteOffertDialog] = useState<boolean>(false);
  const [deleteProductsDialog, setDeleteProductsDialog] =
    useState<boolean>(false);
  const [offer, setOffer] = useState<any>(emptyOffer);
  const [originalAsset, setOriginalAsset] = useState<any>(emptyOffer);
  const [selectedCategoriesIds, setSelectedCategoriesIds] = useState<string[]>(
    [],
  );
  const [offers, setOffers] = useState<Array<MpOffer>>([]);
  const [selectedProducts, setSelectedProducts] = useState<any>([]);
  const [filters, setFilters] = useState(filterDefinition);
  const [loading, setLoading] = useState(false);
  const [editAssetDialogConfirmation, setEditAssetDialogConfirmation] =
    useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [clientId, setClientId] = useState(emptyOffer.clientId);
  const [selectedCampaignVersion, setSelectedCampaignVersion] = useState(null);
  const [tableProps, setTableProps] = useState<CustomDataTableProps>({
    first: 0,
    rows: 10,
    page: 0,
    sortField: 'trendingIndex',
    sortOrder: 1,
    filters: {
      ftSearch: { value: '', matchMode: 'custom' },
    },
    brandId: '',
  });
  const [typeForm, setTypeForm] = useState<string>();

  const [customOfferType, setCustomOfferType] = useState<boolean>(false);

  const [brandId, setBrandId] = useState();

  const toast = useRef<any>(null);

  const dt = useRef<any>(null);

  const getOffers = async () => {
    // set state as loading
    setLoading(true);

    const query = QueryBuilderHelper.get(tableProps as DataTableProps);

    try {
      // fetch data from api
      const data = await OfferService.getOffers(query);

      if (data?.resultData?.page) {
        setOffers(data.resultData.page);
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

  const getOfferById = async (offerIdQuery: string) => {
    setLoading(true);

    try {
      const data = await OfferService.getByOfferId(offerIdQuery);
      const offerResult = data.resultData;
      let categoriesId = '';
  
      if (offerResult.categories) {
        categoriesId = offerResult.categories.map((categoriiesId:any) => {
          return categoriiesId.mpCategoryId;
        });
      }
  
      const myCategories = {...offerResult, categoryIds:categoriesId}
      editOffer(myCategories);
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

  }

  useEffect(() => {
    getOffers();
    if (offerIdQuery) {
      getOfferById(offerIdQuery)
      setTypeForm('edit');
    }
  }, []);

  useEffect(() => {
    getOffers();
  }, [tableProps]);

  const handleSelectedCategories = (arrayOfCategories: MpOffer[]) => {
    if (arrayOfCategories && arrayOfCategories.length) {
      const arrayOfCategoryIds = arrayOfCategories.map(selectedOffer => {
        return selectedOffer._id;
      });
      return setSelectedCategoriesIds(arrayOfCategoryIds);
    }
    return setSelectedCategoriesIds([]);
  };

  const formatDate = (date: any) => {
    let dateFormat = new Date(date);
    return dateFormat.toLocaleDateString('en-GB'); // dd/mm/yyyy
  };

  const openNew = async() => {
    const trendingIndex = await RankService.getLastTrendingIndex('/offer');
    const newimage = constants.IMAGE.EMPTY_IMAGE_URL;
    emptyOffer.cardImageUrl = newimage;
    emptyOffer.shareHeroImageUrl = newimage;
    emptyOffer.shareHeroSmallImageUrl = newimage;
    emptyOffer.trendingIndex = trendingIndex.resultData.trendingIndex ? trendingIndex.resultData.trendingIndex + 1 : trendingIndex.resultData;

    setOffer(emptyOffer);
    setOriginalAsset(emptyOffer);
    reset(emptyOffer);
    setOfferDialog(true);
    setTypeForm('create');
  };

  const isAssetEditAndNotSaved = () => {
    
    let offerCheck = {...offer};
    offerCheck.trackingLink = null;

    const editAssetStr = JSON.stringify(offerCheck);
    const originalAssetStr = JSON.stringify(originalAsset);
    return editAssetStr !== originalAssetStr;
  };

  const hideDialog = () => {
    if (updateDialog) {
      return setUpdateDialog(false);
    }

    if (isAssetEditAndNotSaved()) {
      return setEditAssetDialogConfirmation(true);
    }
    return setOfferDialog(false);
  };

  const hideWarningDialog = () => {
      setCampaignDialog(false);
  }

  const hideDeleteProductDialog = () => {
    setDeleteProductsDialog(false);
  };

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };

  const hideDeleteOffertDialog = () => {
    setDeleteOffertDialog(false);
  };

  const hideEditAssetConfirmationDialog = () => {
    setEditAssetDialogConfirmation(false);
  };

  const editOffer = (offer: MpOffer) => {
    if (!offer.meta) {
      offer.meta = emptyOffer.meta;
    }

    setCustomOfferType(false);
    if (offer.type === 'CUSTOM') {
      setCustomOfferType(true);
    }
    setOffer({ ...offer });
    setOriginalAsset({ ...offer });
    reset(offer);
    setOfferDialog(true);
    setTypeForm('edit');
  };

  const confirmDeleteProduct = async (offer: any) => {
    setOffer(offer);
    setDeleteOffertDialog(true);
  };

  const findIndexById = (id: any) => {
    let index = -1;
    for (let i = 0; i < offers.length; i += 1) {
      if (offers[i]._id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  };

  const deleteSingleOffer = async (offerId: any) => {
    try {
      await OfferService.deleteOffer(offerId);
      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Offer Deleted',
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

  const deleteOneOffer = async () => {
    await deleteSingleOffer(offer._id);
    getOffers();
    setDeleteOffertDialog(false);
  };

  const closeAssetEditDialogAndEditDialog = async () => {
    await getOffers();
    setOfferDialog(false);
    setEditAssetDialogConfirmation(false);
  };

  const isNewAsset = !originalAsset._id;

  //delete from the list of selected offers
  const deleteSelectedOffers = async (
    isMultipleRow = true,
    offerId?: string,
  ) => {
    if (isMultipleRow) {
      await selectedProducts.forEach(async (offerId: any) => {
        await deleteSingleOffer(offerId._id);
      });
    } else {
      deleteSingleOffer(offerId);
    }
    //close the popup
    hideDeleteProductDialog();

    //Reset select Product
    setSelectedProducts([]);

    //setDeleteProductsDialog(false);
    getOffers();
  };

  const onInputChange = (e: any, name: string) => {
    let val;

    if (e.target) {
      if (e.target.type === 'checkbox') {
        val = e.target.checked;
      } else {
        val = e.target.value || '';
      }
    }

    const newEditedOffer: any = { ...offer };

    if (name === 'startDate' || name === 'endDate') {
      let date = new Date(val);
      newEditedOffer[`${name}`] = date;
    } else {
      newEditedOffer[`${name}`] = val;
    }

    if (name === 'urlId' && newEditedOffer[`${name}`]) {
      newEditedOffer[`${name}`] = (newEditedOffer[`${name}`]).toLowerCase();
    }

    if (newEditedOffer[`${name}`] === 'SIMPLE' ||
        newEditedOffer[`${name}`] === 'PROMOTION' ||
        newEditedOffer[`${name}`] === 'SHARING') {
      setCustomOfferType(false);
      if (newEditedOffer.customSettings) {
        newEditedOffer.customSettings.cardButtonField = '';
        newEditedOffer.customSettings.modalButtomField = '';
      }
    }

    reset(newEditedOffer);
    setOffer(newEditedOffer);
  };

  const OnCustomInputChange = (e: any, name: string) => {
    let val = e.target.value || '';

    const newEditedOffer: any = JSON.parse(JSON.stringify(offer));

    if (name === 'type') {
      newEditedOffer[`${name}`] = val;
      const emptyOfferWithCustomSettings = new  MpOffer();
      newEditedOffer.customSettings = emptyOfferWithCustomSettings.customSettings;
    } else if (name === 'cardButtonField') {
      newEditedOffer.customSettings[`${name}`] = val;
    }
    else {
      newEditedOffer.customSettings[`${name}`] = val;
    }

    reset(newEditedOffer);
    setOffer(newEditedOffer);
    setCustomOfferType(true);
  }

  const OnMetaInputChange = (e: any, name: string) => {

    let val = e.target.value || null;
    if (name === 'keywords' && val) {
      val = val.split(',').join();
    }

    const newEditedOffer: any = JSON.parse(JSON.stringify(offer));
    Object.values(newEditedOffer.meta).every(i => !i)
    newEditedOffer.meta[`${name}`] = val;

    reset(newEditedOffer);
    setOffer(newEditedOffer);
  }

  const setCampaignVersion = (campaignVersion: any) => {
    let editedOffer = { ...offer };
    if (campaignVersion) {
      editedOffer.campaignVersionId = campaignVersion._id;
      editedOffer.trackingLink = campaignVersion.trackingLink;
    }
    else
    {
      editedOffer.campaignVersionId = null;
      editedOffer.trackingLink = null;
    }

    reset(editedOffer);
    setOffer(editedOffer);
  };

  const setTrackingLink = (campaignVersion: any) => {

    let editedOffer = { ...offer };

    if (campaignVersion && campaignVersion.trackingLink) {
      editedOffer.trackingLink = campaignVersion.trackingLink;
    }
    else
    {
      editedOffer.trackingLink = null;
    }

    setOffer(editedOffer);
    reset(editedOffer);
  };

  const setExpiryDate = (startDate: string, endDate: string) => {
    const editedOffer: any = { ...offer };
    if (startDate && endDate) {
      editedOffer['startDate'] = new Date(startDate);
      editedOffer['endDate'] = new Date(endDate);
    }
    else
    {
      editedOffer['startDate'] = '';
      editedOffer['endDate'] = '';
    }

    reset(editedOffer);
    setOffer(editedOffer);
  };

  const onInputNumberChange = (e: any, name: string) => {
    const val = e.value || 0;
    const pp: any = { ...offer };
    pp[`${name}`] = val;

    setOffer(pp);
    reset(pp);
  };

  const handleSelectedFlashCampaign = (arrayOfFlashCampaign: MpOffer[]) => {
    const objOffer: any = {...offer};
    if (arrayOfFlashCampaign && arrayOfFlashCampaign.length) {
      const arrayOfFlashCampaignIds = arrayOfFlashCampaign.map(
        selectedFlashCampaign => {
          return selectedFlashCampaign._id;
        },
      );
      return setOffer({...objOffer, flashCampaignIds: arrayOfFlashCampaignIds})
    }
    return setOffer({...objOffer, flashCampaignIds: []})
  };

  const confirmOfferWithClientDisabled = async () => {
    setCampaignWarning(false);
    setCampaignVersionWarning(false);
    setCampaignDialog(false);

    return;
  };

  const deleteOffersDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteOffertDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteOneOffer}
      />
    </>
  );

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

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(MpOffer.schemaValidation()),
  });

  // form submit button reference
  const formSubmit = useRef(null);

  useEffect(() => {
    const newOffer = { ...offer };
    newOffer.categoryIds = selectedCategoriesIds;
    setOffer(newOffer);
  }, [selectedCategoriesIds]);

  useEffect(() => {
    const editedOffer = { ...offer };
    let originalClientId = originalAsset.clientId;
    if(originalClientId !== clientId && typeForm === 'edit') {
      editedOffer.brandUrlId = clientId;
      editedOffer.clientId = clientId;
      editedOffer.meta.ogImage = '';
      editedOffer.cardImageUrl = '';
      editedOffer.shareHeroImageUrl = '';
      editedOffer.shareHeroSmallImageUrl = '';
      reset(editedOffer)
      setOffer(editedOffer);
    }
  }, [clientId]);

  const onSubmit = async () => {
    let newOffer;
    try {
      const verifyFlashCampaign = offer.flashCampaignIds && offer.flashCampaignIds.length > 0;

      if (!verifyFlashCampaign) {
        offer.flashCampaignIds = null;
      } else {
        if (typeof offer.flashCampaignIds !== 'string') {
          offer.flashCampaignIds = JSON.stringify(offer.flashCampaignIds);
        }
      }

      const verifyMetaValue = offer.meta && Object.values(offer.meta).every(i => !i);

      if (verifyMetaValue) {
        offer.meta = null
      }

       if (offer.active && (campaignWarning || campaignVersionWarning)) {
        setCampaignDialog(true);
        return;
      }

      const pps: any[] = [...offers];
      const pp: any = { ...offer };
      delete offer['clientId'];

      if (offer._id) {
        await OfferService.saveOffer(offer);
        const index = findIndexById(offer._id);
        pps[index] = pp;
        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Offer Updated',
          life: 3000,
        });
      } else {
        const result = await OfferService.createOffer(offer);
        newOffer = result.resultData;
        pps.push(pp);
        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Offer Created',
          life: 3000,
        });
      }

      setCampaignWarning(false);
      setCampaignVersionWarning(false);

      // if is not a new asset, close the edition dialog
      if (!isNewAsset) {
        setOfferDialog(false);
        setOffer(emptyOffer);
        return await getOffers();
      }
      // if it is a new asset, keep it open edit dialog to upload the images
      editOffer(newOffer);
    } catch (error: any) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.friendlyMessage,
        life: 3000,
      });
    }
    // update offers
    getOffers();
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
          disabled={!selectedProducts || !selectedProducts.length}
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
    let date = formatDate(rowData.startDate);
    return <>{date}</>;
  };

  const endDateBodyTemplate = (rowData: any) => {
    let date = formatDate(rowData.endDate);
    return <>{date}</>;
  };

  const cardImageBodyTemplate = (rowData: any) => {
    return (
      <>
        <img
          src={rowData.cardImageUrl}
          alt={rowData.cardImageUrl}
          className="product-image"
        />
      </>
    );
  };

  const typeBodyTemplate = (rowData: any) => {
    return <>{rowData.type}</>;
  };

  const cardTitleBodyTemplate = (rowData: any) => {
    return <>{rowData.cardTitle}</>;
  };

  const offerConditionBodyTemplate = (rowData: any) => {
    return <>{rowData.condition}</>;
  };

  const urlIdBodyTemplate = (rowData: any) => {
    return <>{rowData.urlId}</>;
  };

  const trendingIndexBodyTemplate = (rowData: any) => {
    return <>{rowData.trendingIndex}</>;
  };

  const brandNameBodyTemplate = (rowData: any) => {
    return <>{rowData.brandName}</>;
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="actions">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-mr-2"
          onClick={() => editOffer(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteProduct(rowData)}
        />
      </div>
    );
  };

  const getFormErrorMessage = (name: string) => {
    return (<small className="p-error">{errors[name]?.message}</small>
    );
  };

  const onGlobalFilterChange = (event: any) => {
    let searchQuery = event?.target?.value || '';
    if (searchQuery.length < 3) searchQuery = '';
    const newTableProp = { ...tableProps };

    // IF is selecting brand name
    if (event.target.id === 'brandId') {
      newTableProp.brandId = searchQuery._id;
      setBrandId(searchQuery);
    } else {
      newTableProp.filters.ftSearch.value = searchQuery;
    }
    setTableProps({ ...newTableProp });
  };

  const header = (
    <div className="table-header">
      <div>
        <h5 className="p-m-0">Manage Offers</h5>
      </div>
      <div className="p-formgrid p-grid p-col-6">
        <div className="p-col-6">
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
        <div className="p-col-6">
          <DropdownMpBrand
           id="brandId"
           value={brandId}
           className="w-full"
           onChange={(e: any) => onGlobalFilterChange(e)}
           placeholder="Select Brand"
          />
        </div>
      </div>
    </div>
  );

  const offertDialogFooter = (
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
        onClick={() => {
          deleteSelectedOffers(true);
        }}
      />
    </>
  );

  const campaignDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideWarningDialog}
      />
      <Button
        label="Save"
        type="submit"
        icon="pi pi-check"
        className="p-button-text"
        onClick={async () => {
          await confirmOfferWithClientDisabled();
          (formSubmit.current as any).click()
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
          <Toolbar className="p-mb-4 p-toolbar" left={leftToolbarTemplate} />

          <DataTable
            ref={dt}
            value={offers}
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
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} offers"
            emptyMessage="No offers found."
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
              field="cardImageUrl"
              header="Card Image Url"
              body={cardImageBodyTemplate}
            />

            <Column
              field="type"
              header="Type"
              sortable
              body={typeBodyTemplate}
            />

            <Column
              field="cardTitle"
              header="Card Title"
              body={cardTitleBodyTemplate}
            />

            <Column field="urlId" header="URL ID" body={urlIdBodyTemplate} />

            <Column
              field="trendingIndex"
              header="Trending Index"
              sortable
              body={trendingIndexBodyTemplate}
            />

            <Column
              field="brandName"
              header="Brand Name"
              sortable
              body={brandNameBodyTemplate}
            />

            <Column body={actionBodyTemplate} />
          </DataTable>

          <Dialog
            visible={offerDialog}
            style={{ width: '1200px' }}
            header="Offer Details"
            modal
            className="p-fluid"
            footer={offertDialogFooter}
            onHide={hideDialog}
            blockScroll
          >
            <form onSubmit={handleSubmit(onSubmit)} onKeyPress={(e) => { e.key === constants.KEYPRESS.ENTER && e.preventDefault(); }}>
              
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

              <div className="p-formgrid p-grid">
                <div className="p-field-checkbox p-col">
                  <Checkbox
                    inputId="active"
                    name="active"
                    value={offer.active}
                    checked={offer.active}
                    onChange={e => onInputChange(e, 'active')}
                  />
                  <label htmlFor="active">Active</label>
                </div>

                <div className="p-field p-col">
                  <label htmlFor="trendingIndex">Trending Index</label>
                  <Controller
                    name="trendingIndex"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputNumber
                        id={field.name}
                        mode="decimal"
                        useGrouping={false}
                        showButtons
                        {...field}
                        onChange={e => onInputNumberChange(e, 'trendingIndex')}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage('trendingIndex')}
                </div>

                <div className="p-field p-col">
                  <label htmlFor="startDate">Start Date</label>
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Calendar
                        //viewDate={offer.startDate}
                         dateFormat="dd/mm/yy"
                        //id={field.name}
                        id="startDate"
                        disabled={true}
                        //{...field}
                        value={timezoneOffsetOut(offer.startDate)}
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

                <div className="p-field p-col">
                  <label htmlFor="endDate">End Date</label>
                  <Controller
                    name="endDate"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Calendar
                        dateFormat="dd/mm/yy"
                        id={field.name}
                        disabled={true}
                        {...field}
                        value={timezoneOffsetOut(offer.endDate)}
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

              <div className="p-formgrid p-grid">
                <div className="p-field p-col">
                  <label htmlFor="price">Url Id</label>
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
              </div>

              <div className="p-formgrid p-grid">
                <div className="p-field p-col">
                  <label htmlFor="trackingLink">Tracking Link</label>
                  <Controller
                    name="trackingLink"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        disabled={!offer.campaignVersionId}
                        {...field}
                        onChange={e => onInputChange(e, 'trackingLink')}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage('trackingLink')}
                </div>
              </div>

              <div className="p-formgrid p-grid">
                <div className="p-field p-col">
                  <Controller
                    name="campaignVersionId"
                    control={control}
                    render={({ field, fieldState }) => (
                      <CampaignVersionSelector
                        id={field.name}
                        editionMode={typeForm != 'edit'}
                        offer={offer}
                        useClientAsBrand
                        onChange={(campaignVersionId: any, campaign: any, campaignVersion: any, clientId: any) => {
                          
                          if (campaign !== null) {
                            setExpiryDate(campaign.startDate, campaign.expiry);
                          }
                          if (campaign && !campaign.active) {
                            setCampaignWarning(true);
                          }
                          if (campaignVersion) {
                            
                            if(!campaignVersion.active){
                              setCampaignVersionWarning(true);
                            }
                          }                          
                          if (clientId !== '' && !campaign && !campaignVersion) {
                            setClientId(clientId);
                          }

                          if(campaignVersionId || (!campaignVersion && !campaign && !clientId)){
                            setCampaignVersion(campaignVersion);
                          }
    
                        }}
                        onLoad={(campaignVersion: any) => {
                          setTrackingLink(campaignVersion);
                        }}
                        campaignType="marketplace"
                        error={fieldState.invalid}
                      />
                    )}
                  />
                  {getFormErrorMessage('campaignVersionId')}
                </div>
              </div>

              <div className="p-grid">
                <div className="p-md-6">
                  <Fieldset legend="Card">
                    <div className="p-field p-col">
                      <label htmlFor="cardTitle">Card Title</label>
                      <Controller
                        name="cardTitle"
                        control={control}
                        render={({ field, fieldState }) => (
                          <InputText
                            id={field.name}
                            {...field}
                            onChange={e => onInputChange(e, 'cardTitle')}
                            className={classNames({
                              'p-invalid': fieldState.invalid,
                            })}
                          />
                        )}
                      />
                      {getFormErrorMessage('cardTitle')}
                    </div>

                    <div className="p-field p-col">
                      <label htmlFor="cardSubtitle">Card Subtitle</label>
                      <Controller
                        name="cardSubtitle"
                        control={control}
                        render={({ field, fieldState }) => (
                          <InputText
                            id={field.name}
                            {...field}
                            onChange={e => onInputChange(e, 'cardSubtitle')}
                            className={classNames({
                              'p-invalid': fieldState.invalid,
                            })}
                          />
                        )}
                      />
                      {getFormErrorMessage('cardSubtitle')}
                    </div>
                  </Fieldset>
                </div>

                <div className="p-md-6">
                  <Fieldset legend="Offer page/Modal">
                    <div className="p-field p-col">
                      <label htmlFor="title">Title</label>
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
                      {getFormErrorMessage('title')}
                    </div>

                    <div className="p-field p-col">
                      <label htmlFor="subtitle">Subtitle</label>
                      <Controller
                        name="subtitle"
                        control={control}
                        render={({ field, fieldState }) => (
                          <InputText
                            id={field.name}
                            {...field}
                            onChange={e => onInputChange(e, 'subtitle')}
                            className={classNames({
                              'p-invalid': fieldState.invalid,
                            })}
                          />
                        )}
                      />
                      {getFormErrorMessage('subtitle')}
                    </div>
                  </Fieldset>
                </div>
              </div>

              <div className="p-formgrid p-grid">
                <div className="p-field p-col">
                  <label htmlFor="condition">Offer Condition</label>
                  <Controller
                    name="condition"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputTextarea
                        id={field.name}
                        {...field}
                        maxLength={500}
                        onChange={e => onInputChange(e, 'condition')}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage('condition')}
                </div>
              </div>

              <div className="p-formgrid">
                <Fieldset legend="Offer type">
                  <div className="p-grid">
                    <div className="p-col-12 p-md-3">
                      <div className="p-field-radiobutton">
                        <RadioButton
                          inputId="type"
                          name="type"
                          value="SIMPLE"
                          checked={offer.type === 'SIMPLE'}
                          onChange={e => onInputChange(e, 'type')}
                        />
                        <label htmlFor="category1">Simple</label>
                      </div>
                    </div>
                    <div className="p-col-12 p-md-3">
                      <div className="p-field-radiobutton">
                        <RadioButton
                          inputId="sharing"
                          name="type"
                          value="SHARING"
                          checked={offer.type === 'SHARING'}
                          onChange={e => onInputChange(e, 'type')}
                        />
                        <label htmlFor="SHARING">Sharing</label>
                      </div>
                    </div>
                    <div className="p-col-12 p-md-3">
                      <div className="p-field-radiobutton">
                        <RadioButton
                          inputId="promotion"
                          name="type"
                          value="PROMOTION"
                          checked={offer.type === 'PROMOTION'}
                          onChange={e => onInputChange(e, 'type')}
                        />
                        <label htmlFor="PROMOTION">Promotion</label>
                      </div>
                    </div>
                    <div className="p-col-12 p-md-3">
                      <div className="p-field-radiobutton">
                        <RadioButton
                          inputId="custom"
                          name="type"
                          value="CUSTOM"
                          checked={offer.type === 'CUSTOM'}
                          onChange={e => OnCustomInputChange(e, 'type')}
                        />
                        <label htmlFor="CUSTOM">Custom</label>
                      </div>
                    </div>
                    {getFormErrorMessage('type')}
                  </div>

                  {/* aqui */}

                  <div hidden={!customOfferType} className="p-field p-col p-md-6">
                      <label htmlFor="customSettings.cardButtonField">Card Button Text</label>
                      <Controller
                        name="customSettings.cardButtonField"
                        control={control}
                        render={({ field, fieldState }) => (
                          <InputText
                            id={field.name}
                            {...field}
                            onChange={e => OnCustomInputChange(e, 'cardButtonField')}
                            className={classNames({
                              'p-invalid': fieldState.invalid,
                            })}
                          />
                        )}
                      />
                      {getFormErrorMessage('customNameCardBtn')}
                  </div>

                  <div hidden={!customOfferType} className="p-field p-col  p-md-6">
                    <label htmlFor="customSettings.modalButtomField">Modal Button Text</label>
                    <Controller
                      name="customSettings.modalButtomField"
                      control={control}
                      render={({ field, fieldState }) => (
                        <InputText
                          id={field.name}
                          {...field}
                          onChange={e => OnCustomInputChange(e, 'modalButtomField')}
                          className={classNames({
                            'p-invalid': fieldState.invalid,
                          })}
                        />
                      )}
                    />
                    {getFormErrorMessage('customNameLightboxBtn')}
                  </div>

                  {/* aqui */}
                </Fieldset>
              </div>

              <div className="p-formgrid p-grid" style={{ margin: '20px' }}>
                <div className="p-field p-col-12 p-md-4 p-lg-4">
                  <Controller
                    name="shareHeroImageUrl"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Upload
                        friendlyName="Offer Share Hero Image"
                        isActive={updateDialog}
                        setIsActive={setUpdateDialog}
                        asset="shareHeroImageUrl"
                        setSelectedAsset={setSelectedUploadAsset}
                        src={field.value}
                        isUploadButtonDisabled={isNewAsset}
                        brandUrlId={offer.brandUrlId}
                        section={'offer'}
                        originalAssetObj={offer}
                        setAsset={setOffer}
                        changedProperty={selectedUploadAsset}
                        resetModal={reset}
                        visible={updateDialog}
                        labelSize='400 x 500'
                      />
                    )}
                  />
                  {getFormErrorMessage('shareHeroImageUrl')}
                </div>

                <div className="p-field p-col-12 p-md-4 p-lg-4">
                  <Controller
                    name="shareHeroSmallImageUrl"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Upload
                        friendlyName="Offer Share Hero Small Image"
                        isActive={updateDialog}
                        setIsActive={setUpdateDialog}
                        asset="shareHeroSmallImageUrl"
                        setSelectedAsset={setSelectedUploadAsset}
                        src={field.value}
                        isUploadButtonDisabled={isNewAsset}
                        brandUrlId={offer.brandUrlId}
                        section={'offer'}
                        originalAssetObj={offer}
                        setAsset={setOffer}
                        changedProperty={selectedUploadAsset}
                        resetModal={reset}
                        visible={updateDialog}
                        labelSize='500 x 360'
                      />
                    )}
                  />
                  {getFormErrorMessage('shareHeroSmallImageUrl')}
                </div>

                <div className="p-field p-col-12 p-md-4 p-lg-4">
                  <Controller
                    name="cardImageUrl"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Upload
                        friendlyName="Offer Card Image"
                        isActive={updateDialog}
                        setIsActive={setUpdateDialog}
                        asset="cardImageUrl"
                        setSelectedAsset={setSelectedUploadAsset}
                        src={field.value}
                        isUploadButtonDisabled={isNewAsset}
                        brandUrlId={offer.brandUrlId}
                        section={'offer'}
                        originalAssetObj={offer}
                        setAsset={setOffer}
                        changedProperty={selectedUploadAsset}
                        resetModal={reset}
                        visible={updateDialog}
                        labelSize='380 x 220'
                      />
                    )}
                  />
                  {getFormErrorMessage('cardImageUrl')}
                </div>
              </div>

              <div className="p-field">
                <label htmlFor="offerCategories">Categories</label>
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
                {getFormErrorMessage('categoryIds')}
              </div>

              <div className="p-field">
                <label htmlFor="visibilityTags">Flash Campaign</label>
                <Controller
                  name="flashCampaignIds"
                  control={control}
                  render={({ field }) => (
                    <DropdownFlashCampaing
                      id={field.name}
                      {...field}
                      value={field.value}
                      onChange={(e: any) => {
                        field.onChange(e.target.value);
                        handleSelectedFlashCampaign(e.target.value);
                      }}
                      singleSelect={false}
                    />
                  )}
                />
              </div>

              <Meta
                control={control}
                formErrors={errors}
                onChange={OnMetaInputChange}
                classNames={classNames}
                data={{ originalAssetObj: offer, setAsset: setOffer }}
                reset={reset}
                section="offer"
              />

              <input type="submit" hidden ref={formSubmit} />
            </form>
          </Dialog>
          <Dialog
            visible={deleteOffertDialog}
            style={{ width: '500px' }}
            header="Confirm"
            modal
            footer={deleteOffersDialogFooter}
            onHide={hideDeleteOffertDialog}
            blockScroll
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle p-mr-3"
                style={{ fontSize: '2rem' }}
              />
              {offer && (
                <span>
                  Are you sure you want to delete <b>{offer.name}</b>?
                </span>
              )}
            </div>
          </Dialog>

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
              {offer && (
                <span>
                  There are changes not saved. Are you sure you want to quit?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteProductsDialog}
            style={{ width: '500px' }}
            header="Confirm"
            modal
            footer={deleteProductsDialogFooter}
            onHide={hideDeleteProductsDialog}
            blockScroll
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle p-mr-3"
                style={{ fontSize: '2rem' }}
              />
              {offer && (
                <span>
                  Are you sure you want to delete the selected Offers?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={campaignDialog}
            style={{ width: '500px' }}
            header="Confirm"
            modal
            footer={campaignDialogFooter}
            onHide={hideWarningDialog}
            blockScroll>
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle p-mr-3"
                style={{ fontSize: '2rem' }}
              />
              <span>
                You are about save an active offer having its Campaign or Campaign version inactive, are you sure you want this?
              </span>
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default OffersPage;
