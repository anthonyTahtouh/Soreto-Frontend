/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { Column } from 'primereact/column';
import { classNames } from 'primereact/utils';
import {
  DataTable,
  DataTableFilterMeta,
  DataTableProps,
  DataTableSortOrderType,
} from 'primereact/datatable';
import { Message } from 'primereact/message';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { RadioButton } from 'primereact/radiobutton';
import { yupResolver } from '@hookform/resolvers/yup';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { Fieldset } from 'primereact/fieldset';
import { Controller, useForm } from 'react-hook-form';
import { InputTextarea } from 'primereact/inputtextarea';
import { Menu } from 'primereact/menu';
import constants from '../../../shared/constants';
import FeedService from '../../../services/FeedService';
import BrandService from '../../../services/BrandService';
import QueryBuilderHelper from '../../../helpers/QueryBuilderHelper';
import MpFeedOffer from '../../../entities/MpFeedOffer';
import DropdownMpFeedStatus from '../../../components/DropdownMpFeedStatus';
import DropdownMpCategories from '../../../components/DropdownMpCategories';
import DropdownMpFeedBrand from '../../../components/DropdownMpFeedBrand';
import DropdownMpFeedAffiliate from '../../../components/DropdownMpFeedAffiliate';
import DropdownMpBrand from '../../../components/DropdownMpBrand';
import Meta from '../../../components/Meta';
import moment from 'moment';

interface CustomDataTableProps {
  first: number;
  rows: number;
  page: number;
  sortField: string;
  sortOrder: DataTableSortOrderType;
  filters: { ftSearch: { value: string; matchMode: string } };
  status: string;
  type: string;
}

const OfferPage = () => {
  const emptyFeeds: MpFeedOffer = new MpFeedOffer();
  const [isNewAsset, setIsNewAsset] = useState<boolean>(false);
  const [isVisibilityOGImage, setIsVisibilityOGImage] = useState<boolean>(false);

  const filterDefinition: DataTableFilterMeta = {
    name: { value: '', matchMode: 'contains' },
  };

  const [feedDialog, setFeedDialog] = useState<boolean>(false);
  const [updateDialog, setUpdateDialog] = useState<boolean>(false);
  const [rejectDialog, setRejectDialog] =
    useState<boolean>(false);
  const [unrejectDialog, setUnrejectDialog] =
    useState<boolean>(false);
  const [feed, setFeed] = useState<any>(emptyFeeds);
  const [editFeed, setEditFeed] = useState<any>(null);
  const [originalAsset, setOriginalAsset] = useState<any>(emptyFeeds);
  const [feeds, setFeeds] = useState<Array<[]>>([]);
  const [selectedFeeds, setSelectedFeeds] = useState<any>([]);
  const [filters, setFilters] = useState(filterDefinition);
  const [loading, setLoading] = useState(false);
  const [rowOffer, setRowOffer] = useState<any>({});
  const [editAssetDialogConfirmation, setEditAssetDialogConfirmation] =
    useState(false);
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
    status: '',
    type: 'OFFER',
  });
  const [selectedCategoriesIds, setSelectedCategoriesIds] = useState<string[] | undefined>(
    [],
  );

  const filterStatus = [
    { name: 'CREATED', _id: constants.AFFILIATE_STATUS.CREATED },
    { name: 'IN REVIEW', _id: constants.AFFILIATE_STATUS.IN_REVIEW },
    { name: 'REVIEWED', _id: constants.AFFILIATE_STATUS.REVIEWED },
    { name: 'REJECTED', _id: constants.AFFILIATE_STATUS.REJECTED },
    { name: 'BUILT', _id: constants.AFFILIATE_STATUS.BUILT },
    { name: 'BUILD FAILED', _id: constants.AFFILIATE_STATUS.BUILD_FAILED },
    { name: 'BUILD REVIEW', _id: constants.AFFILIATE_STATUS.BUILD_REVIEW },
    { name: 'BUILD APPROVED', _id: constants.AFFILIATE_STATUS.BUILD_APPROVED },
    { name: 'PUBLISHED', _id: constants.AFFILIATE_STATUS.PUBLISHED },
    { name: 'AFFILIATE UPDATE', _id: constants.AFFILIATE_STATUS.AFFILIATE_UPDATE },
  ];

  const [optionsSuggestionCategory, setOptionsSuggestionCategory] = useState<string>();

  const toast = useRef<any>(null);

  const [statusId, setStatusId] = useState();

  const dt = useRef<any>(null);

  const [customOfferType, setCustomOfferType] = useState<boolean>(false);

  const [simpleOfferType, setSimpleOfferType] = useState<boolean>(false);

  const [disableAffiliateBrand, setDisableAffiliateBrand] = useState<boolean>(false);

  const [disableBrand, setDisableBrand] = useState<boolean>(false);

  const [disableSave, setDisableSave] = useState<boolean>(false);

  const allowEdition = [
    constants.AFFILIATE_STATUS.IN_REVIEW,
    constants.AFFILIATE_STATUS.REVIEWED,
    constants.AFFILIATE_STATUS.BUILD_FAILED,
    constants.AFFILIATE_STATUS.BUILT,
    constants.AFFILIATE_STATUS.PUBLISHED
  ];

  const notAllowEdition = [
    constants.AFFILIATE_STATUS.BUILT,
    constants.AFFILIATE_STATUS.PUBLISHED
  ];

  const getFeeds = async () => {
    // set state as loading
    setLoading(true);

    //Reset select Product
    setSelectedFeeds([]);

    const query = QueryBuilderHelper.get(tableProps as DataTableProps);

    try {
      // fetch data from api
      const data = await FeedService.getFeeds(query);

      if (data?.resultData?.page) {
        setFeeds(data.resultData.page);
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

  const getFeedById = async (id: string) => {
    // set state as loading
    setLoading(true);

    try {
      // fetch data from api
      const data = await FeedService.getFeedById(id, tableProps.type);

      if (data) {
        return data.resultData;
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
    getFeeds();
  }, [tableProps]);

  useEffect(() => {
    const newFeed = { ...feed };
    newFeed.categoryIds = selectedCategoriesIds;
    setFeed(newFeed);
  }, [selectedCategoriesIds]);

  const formatDate = (date: any) => {
    let dateFormat = new Date(date);
    return dateFormat.toLocaleDateString('en-GB'); // dd/mm/yyyy
  };

  const isAssetEditAndNotSaved = () => {
    const editAssetStr = JSON.stringify(feed);
    const originalAssetStr = JSON.stringify(originalAsset);
    return editAssetStr !== originalAssetStr;
  };

  const saveRevision = (e: any) => {
    feed.status = constants.AFFILIATE_STATUS.REVIEWED;
    e.click();
  }

  const hideDialog = () => {
    if (updateDialog) {
      return setUpdateDialog(false);
    }

    if (isAssetEditAndNotSaved()) {
      return setEditAssetDialogConfirmation(true);
    }

    setIsVisibilityOGImage(true);

    return setFeedDialog(false);
  };

  const hideDeleteProductDialog = () => {
    setRejectDialog(false);
  };

  const hideRejectDialog = () => {
    setRejectDialog(false);
  };

  const hideUnrejectDialog = () => {
    setUnrejectDialog(false);
  };

  const hideEditAssetConfirmationDialog = () => {
    setEditAssetDialogConfirmation(false);
  };

  async function populateFeedOffer(feed: any) {
    setIsNewAsset(false);

    if (notAllowEdition.includes(feed.status)) {
      setDisableSave(true);
    }
    else {
      setDisableSave(false);
    }

    if (allowEdition.includes(feed.status) || (feed.status === 'CREATED' && !feed.automatic)) {
      await getFeedById(feed._id).then(response => {
        if(response?.errors) {
          emptyFeeds.errors = response?.errors.page;
        }
        
        emptyFeeds.name = response.revisionForm.name;
        emptyFeeds.startDate = new Date(response.revisionForm.startDate);
        emptyFeeds.endDate = new Date(response.revisionForm.endDate);
        emptyFeeds.type = response.revisionForm.type;
        emptyFeeds.feedId = response._id;
        emptyFeeds.cardTitle = response.revisionForm.cardTitle;
        emptyFeeds.title = response.revisionForm.title;
        emptyFeeds.subtitle = response.revisionForm.subtitle;
        emptyFeeds.condition = response.revisionForm.condition;
        emptyFeeds.urlId = response.revisionForm.urlId;
        emptyFeeds.categoryIds = response.revisionForm.categoryIds;
        emptyFeeds.brandName = response.revisionForm.brandName;
        emptyFeeds.brandUrlId = response.revisionForm.brandUrlId;
        emptyFeeds.promotionTrackingLink = response.revisionForm.promotionTrackingLink;
        emptyFeeds.status = constants.AFFILIATE_STATUS.IN_REVIEW;
        emptyFeeds.affiliateBrand = response.revisionForm.affiliateBrand;
        emptyFeeds.affiliateBrandName = feed.affiliateBrandName;
        emptyFeeds.brandId = response.revisionForm.brandId;
        emptyFeeds.affiliate = feed.affiliate;
        emptyFeeds.note = feed.revisionForm.note;

        if(emptyFeeds.affiliateBrand) {
          setDisableBrand(true)
        }
        if (emptyFeeds.type === 'CUSTOM') {
          emptyFeeds.customSettings.cardButtonField = response.revisionForm.customSettings.cardButtonField;
          emptyFeeds.customSettings.modalButtomField = response.revisionForm.customSettings.modalButtomField;
          setCustomOfferType(true);
        }
        if (emptyFeeds.type === 'SIMPLE') {
          emptyFeeds.promotionCode = feed.revisionForm.promotionCode;
          setSimpleOfferType(true)
        }

        if (response.revisionForm.meta) {
          emptyFeeds.meta.title = response.revisionForm.meta.title;
          emptyFeeds.meta.description = response.revisionForm.meta.description;
          emptyFeeds.meta.keywords = response.revisionForm.meta.keywords;
          emptyFeeds.meta.ogImage = response.revisionForm.meta.ogImage;
          emptyFeeds.meta.tag = response.revisionForm.meta.tag;
          emptyFeeds.meta.headingOne = response.revisionForm.meta.headingOne;
          emptyFeeds.meta.headingTwo = response.revisionForm.meta.headingTwo;
        }

        setEditFeed(response._id);
      });
    }
    else {
      emptyFeeds.startDate = new Date(feed.startDate);
      emptyFeeds.endDate = new Date(feed.endDate);
      emptyFeeds.type = feed.promotionType;
      emptyFeeds.feedId = feed._id;
      emptyFeeds.cardTitle = feed.promotionTitle;
      emptyFeeds.title = feed.promotionTitle;
      emptyFeeds.subtitle = feed.promotionDescription;
      emptyFeeds.condition = feed.promotionTerms;
      emptyFeeds.affiliateBrand = undefined; 
      emptyFeeds.brandName = feed.affiliateBrandName;
      emptyFeeds.promotionTrackingLink = feed.promotionTrackingLink;
      emptyFeeds.promotionCode = feed.promotionCode;
      emptyFeeds.status = constants.AFFILIATE_STATUS.IN_REVIEW;
      emptyFeeds.affiliate = feed.affiliate;
    }

   if (emptyFeeds.type === 'SIMPLE') {
     setSimpleOfferType(true)
   }

    if (feed.affiliateMerchantId) {
      let brand = await BrandService.getBrandByMerchantId(feed.affiliateMerchantId, feed.affiliate);
      if (brand.data?.length >= 1) {
        emptyFeeds.brandId = brand.data[0]._id;
        setDisableAffiliateBrand(true);
        setDisableBrand(false);
      }
    }

    if (emptyFeeds.brandId) {
      setDisableAffiliateBrand(true);
    }

    let dynamicSuggestionCategory = '';
    if( Array.isArray(feed.promotionCategories?.category)){
      dynamicSuggestionCategory = feed.promotionCategories?.category?.length ? feed.promotionCategories.category.join(', ') : 'No Suggestion';
    }else {
      dynamicSuggestionCategory = feed.promotionCategories?.category;
    }
    setOptionsSuggestionCategory(dynamicSuggestionCategory);

    if (emptyFeeds.urlId && emptyFeeds.brandUrlId) {
      setIsVisibilityOGImage(true);
    }
    else {
      setIsVisibilityOGImage(false);
    }

    setFeed({ ...emptyFeeds });
    reset(emptyFeeds);
  }

  const loadingFeed = (feed: any) => {
    populateFeedOffer(feed);
    setOriginalAsset({ ...feed });
    setFeedDialog(true);
    setDisableAffiliateBrand(false);
    setDisableBrand(false);
  };

  const openNew = async() => {
    let emptyFeed: MpFeedOffer = new MpFeedOffer();
    emptyFeed.status = constants.AFFILIATE_STATUS.IN_REVIEW;
    emptyFeed.affiliateBrandName = '';

    setOptionsSuggestionCategory('No Suggestion');
    setIsVisibilityOGImage(false);
    setFeed({ ...emptyFeed });
    setOriginalAsset({ ...emptyFeed });
    reset(emptyFeeds);

    setIsNewAsset(true);
    setFeedDialog(true);
    setDisableAffiliateBrand(false);
    setDisableBrand(false);
  };

  const confirmRejectSelected = () => {
    setRejectDialog(true);
  };

  const confirmUnrejectSelected = () => {
    setUnrejectDialog(true);
  };

  const rejectSingleFeed = async (feedId: any) => {
    try {
      await FeedService.reprove(feedId, tableProps.type);
      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Offer rejected',
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

  const unrejectSingleFeed = async (feedId: any) => {
    try {
      await FeedService.unreject(feedId, tableProps.type);
      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Offer rejected',
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

  const publishOffer = async (feedId: any) => {
    try {
      await FeedService.publish(feedId, tableProps.type);
      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Offer set as published',
        life: 3000,
      });
    } catch (error: any) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.friendlyMessage,
        life: 3000,
      });
    } finally {
      await getFeeds();
    }
  };

  const buildOffer = async (feedId: any) => {
    try {
      await FeedService.buildOffer(feedId);
      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Offer built!',
        life: 3000,
      });
    } catch (error: any) {
      console.log('Error');
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.friendlyMessage,
        life: 3000,
      });
    }finally {
      await getFeeds();
    }
  };

  const buildReview = async (feedId: any) => {
    try {
      await FeedService.buildReview(feedId, tableProps.type);
      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Offer built!',
        life: 3000,
      });
    } catch (error: any) {
      console.log('Error');
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.friendlyMessage,
        life: 3000,
      });
    }finally {
      await getFeeds();
    }
  };

  const buildApproved = async (feedId: any) => {
    try {
      await FeedService.buildApproved(feedId, tableProps.type);
      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Offer built!',
        life: 3000,
      });
    } catch (error: any) {
      console.log('Error');
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.friendlyMessage,
        life: 3000,
      });
    }finally {
      await getFeeds();
    }
  };

  const unrejectOffer = async (feedId: any) => {
    try {
      await FeedService.unreject(feedId, 'OFFER');
      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Offer unrejected!',
        life: 3000,
      });
    } catch (error: any) {
      console.log('Error');
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.friendlyMessage,
        life: 3000,
      });
    }finally {
      await getFeeds();
    }
  };

  const closeAssetEditDialogAndEditDialog = async () => {
    let emptyFeedOffer: MpFeedOffer = new MpFeedOffer();
    setFeed({ ...emptyFeedOffer });
    reset(emptyFeedOffer);

    setIsVisibilityOGImage(true);
    setCustomOfferType(false);
    setSimpleOfferType(false);
    await getFeeds();
    setFeedDialog(false);
    setEditAssetDialogConfirmation(false);
  };

  //reject from the list of selected feeds
  const rejectSelectedFeeds = async (
    isMultipleRow = true,
    feedId?: string,
  ) => {
    if (isMultipleRow) {
      await selectedFeeds.forEach(async (feedId: any) => {
        await rejectSingleFeed(feedId._id);
      });
    } else {
      rejectSingleFeed(feedId);
    }
    //close the popup
    hideDeleteProductDialog();

    //Reset select Product
    setSelectedFeeds([]);

    //setRejectDialog(false);
    getFeeds();
  };

  const unrejectSelectedFeeds = async () => {
    let notRejectedRows = selectedFeeds.filter((sf: any) => sf.status !== constants.AFFILIATE_STATUS.REJECTED);
    let rejectedRows = selectedFeeds.filter((sf: any) => sf.status === constants.AFFILIATE_STATUS.REJECTED);

    if(!rejectedRows || rejectedRows.length === 0) {
      toast.current.show({
        severity: 'warn',
        summary: 'Warn',
        detail: 'No rejected rows selected',
        life: 5000,
      });

      //close the popup
      hideUnrejectDialog();
      return;
    } 

   if(notRejectedRows && notRejectedRows.length > 1) {
      toast.current.show({
        severity: 'warn',
        summary: 'Warn',
        detail: 'Some selected rows were not rejected and were ignored',
        life: 5000,
      });
    }

    for(let row of rejectedRows) {
      await unrejectSingleFeed(row._id);
    }

    //close the popup
    hideUnrejectDialog();

    //Reset select Product
    setSelectedFeeds([]);

    //setRejectDialog(false);
    getFeeds();
  };

  const onInputChange = (e: any, name: string) => {
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

    const newEditedOffer: any = { ...feed };
    if (name === 'startDate' || name === 'endDate') {
      let date = new Date(val);
      newEditedOffer[`${name}`] = date;
    } else if (name === 'affiliateBrand') {
      newEditedOffer[`${name}`] = e.target.value || undefined;
    }
    else {
      newEditedOffer[`${name}`] = val;
    }

    if (newEditedOffer[`${name}`] === 'SIMPLE') {
      setCustomOfferType(false);
      setSimpleOfferType(true);
      newEditedOffer.customSettings.cardButtonField = '';
      newEditedOffer.customSettings.modalButtomField = '';
    }

    if (newEditedOffer[`${name}`] === 'CUSTOM') {
      setSimpleOfferType(false);
      setCustomOfferType(true);
      newEditedOffer.promotionCode = '';
    }

    if (newEditedOffer[`${name}`] === 'PROMOTION') {
      setSimpleOfferType(false);
      setCustomOfferType(false);
      newEditedOffer.promotionCode = '';
      newEditedOffer.customSettings.cardButtonField = '';
      newEditedOffer.customSettings.modalButtomField = '';
    }

    if (name === 'brandId' || name === 'urlId') {
      newEditedOffer[`affiliateBrandName`] = (name === 'brandId' && !newEditedOffer['affiliateBrandName'] && e.target.value ? 
                                              e.target.value.name : newEditedOffer[`affiliateBrandName`]);
      let field = name === 'brandId' ? 'urlId' : 'brandId';
      if (newEditedOffer[`${name}`] && newEditedOffer[field]) {
        setIsVisibilityOGImage(true);
      }
      else
      {
        setIsVisibilityOGImage(false);
        newEditedOffer[`${name}`] = (newEditedOffer[`${name}`]).toLowerCase();
        newEditedOffer.meta.ogImage = ''
      }

      newEditedOffer['brandUrlId'] = e.target.value?.urlId;
    }

    reset(newEditedOffer);
    setFeed(newEditedOffer);
  };

  const OnCustomInputChange = (e: any, name: string) => {
    let val = e.target.value || '';
    const newEditedOffer: any = { ...feed };

    if (name === 'type') {
      newEditedOffer[`${name}`] = val;
    } else if (name === 'cardButtonField') {
      newEditedOffer.customSettings.cardButtonField = val;
    }
    else {
      newEditedOffer.customSettings.modalButtomField = val;
    }

    reset(newEditedOffer);
    setFeed(newEditedOffer);
    setCustomOfferType(true);
  }

  const onMetaInputChange = (e: any, name: string) => {
    let val = e.target.value || '';

    if (name === 'keywords' && val) {
      val = val.split(',').join();
    }

    const newEditedOffer: any = feed;

    newEditedOffer.meta[`${name}`] = val;

    reset(newEditedOffer);
    setFeed(newEditedOffer);
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

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(MpFeedOffer.schemaValidation()),
  });

  // form submit button reference
  const formSubmit = useRef(null);

  const onSubmit = async () => {
    try {
      let pp: any = { ...feed };
      // removed feedId from the body
      delete pp['feedId']
      pp = {...pp}

      if (pp.brandName?.name) {
        pp.brandName = pp.brandName.name;
      }

      pp.startDate = moment(pp.startDate).format('YYYY-MM-DD HH:mm:ss');
      pp.endDate = moment(pp.endDate).format('YYYY-MM-DD HH:mm:ss');

      await FeedService.save(feed.feedId, pp, tableProps.type);
      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Offer Saved',
        life: 3000,
      });

      setFeedDialog(false);

      let emptyFeed: MpFeedOffer = new MpFeedOffer();
      setFeed(emptyFeed);
      reset(emptyFeed);

      return await getFeeds();
    } catch (error: any) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.friendlyMessage,
        life: 3000,
      });
    }
    // update feeds
    getFeeds();
  };

  const leftToolbarTemplate = () => {
    return (
      <>
        <Button
          label="Add Offer Manually"
          icon="pi pi-plus"
          className="p-button-success p-mr-2 p-mb-2"
          onClick={openNew}
        />
        <Button
          label="Reject"
          icon="pi pi-fw pi-thumbs-down"
          className="p-button-danger p-mr-2 p-mb-2"
          onClick={confirmRejectSelected}
          disabled={!selectedFeeds || !selectedFeeds.length}
        />
        <Button
          label="Unreject"
          icon="pi pi-fw pi-thumbs-up"
          className="p-button-warning p-mb-2"
          onClick={confirmUnrejectSelected}
          disabled={!selectedFeeds || !selectedFeeds.length}
        />
      </>

    );
  };

  const affiliateBodyTemplate = (rowData: any) => {
    return <>{rowData.affiliate}</>;
  };

  const promotionTitleBodyTemplate = (rowData: any) => {
    return <>{rowData.promotionTitle}</>;
  };

  const promotionDescriptionBodyTemplate = (rowData: any) => {
    return <>{rowData.promotionDescription}</>;
  };

  const promotionTypeBodyTemplate = (rowData: any) => {
    return <>{rowData.promotionType}</>;
  };

  const promotionTermsBodyTemplate = (rowData: any) => {
    return <>{rowData.promotionTerms}</>;
  };

  const statusBodyTemplate = (rowData: any) => {
    return <>{rowData.status}</>;
  };

  const activeBodyTemplate = (rowData: any) => {
    return (
      <>
        <Checkbox disabled={true} checked={rowData.exclusive} />
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

  const createDateBodyTemplate = (rowData: any) => {
    let date = formatDate(rowData.createdAt);
    return <>{date}</>;
  };

  const brandNameBodyTemplate = (rowData: any) => {
    return <>{rowData.affiliateBrandName}</>;
  };

  const actionBodyTemplate = (rowData: any) => {
    const menuLocal: any = React.createRef();
    let editFeedButton = true;
    let buildButton = true;
    let reviewButton = true;
    let buildApprovedButton = true;
    let publishButton = true;
    let viewOfferButton = true;
    let simulateCampaign = true;
    let editOffer = true;
    
    switch (rowData.status) {
      case constants.AFFILIATE_STATUS.CREATED:
        editFeedButton = false;
        break;
      case constants.AFFILIATE_STATUS.IN_REVIEW:
        editFeedButton = false;
        break;
      case constants.AFFILIATE_STATUS.REVIEWED:
        editFeedButton = false;
        buildButton = false;
        break;
      case constants.AFFILIATE_STATUS.BUILD_FAILED:
        editFeedButton = false;
        break;
      case constants.AFFILIATE_STATUS.REJECTED:
        break;
      case constants.AFFILIATE_STATUS.BUILT:
        reviewButton = false;
        simulateCampaign = false;
        editOffer = false;
        break;
      case constants.AFFILIATE_STATUS.BUILD_REVIEW:
        editOffer = false;
        buildApprovedButton = false;
        simulateCampaign = false;
        break;
      case constants.AFFILIATE_STATUS.BUILD_APPROVED:
        editOffer = false;
        simulateCampaign = false;
        publishButton = false;        
        break;
      case constants.AFFILIATE_STATUS.PUBLISHED:
        viewOfferButton = false;
        editOffer = false;
        break;
      case constants.AFFILIATE_STATUS.AFFILIATE_UPDATE:
        break;
      case constants.AFFILIATE_STATUS.BUILD_UPDATE_REQUIRED:
        reviewButton = false;
        break;       
      default:
    }

    const menuModel = [
      { label: 'Edit', disabled: editFeedButton, command:()=>{loadingFeed(rowOffer)} }, 
      { label: 'Build', disabled: buildButton,  command:()=>{buildOffer(rowOffer._id)} },
      { label: 'Simulate campaign', disabled: simulateCampaign, command:()=>{
          FeedService.simulateOffer(rowOffer);
          toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Offer simulate with success!',
            life: 3000,
          });
        } 
      },
      { label: 'Send to final approval', disabled: reviewButton, command:()=>{buildReview(rowOffer._id)} },
      { label: 'Approve campaign', disabled: buildApprovedButton, command:()=>{buildApproved(rowOffer._id)} },
      { label: 'Publish', disabled: publishButton, command:()=>{publishOffer(rowOffer._id)} },
      { label:  '---------------------------------------', disabled: true },
      { label: 'Edit offer', disabled: editOffer, target: '_blank', url: `../offers?mpOfferId=${rowOffer.mpOfferId}`},
      { label: 'View offer', disabled: viewOfferButton, command:()=>{
          FeedService.viewOffer(rowOffer);
          toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Brand redirect with success!',
            life: 3000,
          });
        } 
      }
    ];

    return (
      <>
        <div>
          <Button type="button" 
            icon="pi pi-ellipsis-h" 
            className="p-button-rounded p-button-text p-button-plain" 
            onClick={(event) => {
              setRowOffer(rowData); 
              menuLocal.current.toggle(event);
            }}>

          </Button>
          
          <Menu ref={menuLocal} 
            popup model={menuModel}>

          </Menu>
        </div>
      </>
    );
  };

  const getFormErrorMessage = (name: string) => {
    return (
      errors[name] && <small className="p-error">{errors[name]?.message}</small>
    );
  };

  const onGlobalFilterChange = (event: any) => {
    let searchQuery = event?.target?.value || '';
    if (searchQuery.length < 3) searchQuery = '';
    const newTableProp = { ...tableProps };

    if (event.target.id === 'status') {
      newTableProp.status = searchQuery._id;
      setStatusId(searchQuery);
    } else {
      newTableProp.filters.ftSearch.value = searchQuery;
    }

    setTableProps(newTableProp);
  };

  const header = (
    <div className="table-header">
      <div>
        <h5 className="p-m-0">Manage Feeds</h5>
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
          <DropdownMpFeedStatus
            id="status"
            value={statusId}
            className="w-full"
            options={filterStatus}
            onChange={(e: any) => onGlobalFilterChange(e)}
            placeholder="Select Status"
          />
        </div>
      </div>
    </div>
  );

  const feedDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
   { !disableSave && (
   <>
      <Button
        label="Save"
        type="submit"
        icon="pi pi-check"
        className="p-button-text"
        onClick={() => (formSubmit.current as any).click()}
      />
      <Button
        label="Save & Finish Revision"
        type="submit"
        icon="pi pi-check"
        className="p-button-text"
        onClick={() => saveRevision(formSubmit.current as any)}
      />
      </>
  )}
    </>
  );

  const rejectDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideRejectDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={() => {
          rejectSelectedFeeds(true);
        }}
      />
    </>
  );

  const unrejectDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideUnrejectDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={() => {
          unrejectSelectedFeeds();
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

  const handleSelectedCategories = (arrayOfCategories: MpFeedOffer[]) => {
    if (arrayOfCategories && arrayOfCategories.length) {
      const arrayOfCategoryIds = arrayOfCategories.map(selectedBrand => {
        return selectedBrand._id;
      });
      return setSelectedCategoriesIds(arrayOfCategoryIds);
    }
    return setSelectedCategoriesIds(undefined);
  };

  return (
    <div className="p-grid crud-demo">
      <div className="p-col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar className="p-mb-4 p-toolbar" left={leftToolbarTemplate} />

          <DataTable
            ref={dt}
            value={feeds}
            selection={selectedFeeds}
            onSelectionChange={e => setSelectedFeeds(e.value)}
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
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} feeds"
            emptyMessage="No promotion feeds found."
            header={header}
            loading={loading}
            sortField={tableProps.sortField}
            sortOrder={tableProps.sortOrder}
          >
            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />

            <Column
              field="affiliate"
              header="Affiliate"
              sortable
              body={affiliateBodyTemplate}
            />

            <Column
              field="affiliateBrandName"
              header="Brand Name"
              sortable
              body={brandNameBodyTemplate}
            />

            <Column
              field="exclusive"
              header="Exclusive"
              sortable
              body={activeBodyTemplate}
            />

            <Column
              field="promotionTitle"
              header="Promotion Title"
              sortable
              body={promotionTitleBodyTemplate}
            />

            <Column
              field="promotionDescription"
              header="Promotion Description"
              sortable
              body={promotionDescriptionBodyTemplate}
            />

            <Column
              field="promotionType"
              header="Promotion Type"
              sortable
              body={promotionTypeBodyTemplate}
            />

            <Column
              field="createdAt"
              header="Created"
              sortable
              body={createDateBodyTemplate}
            />

            <Column field="status" header="Status" sortable body={statusBodyTemplate} />

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

          <Column body={actionBodyTemplate} />
          </DataTable>

          {/* 
            ---------------------------
            Feed edition dialog
            ---------------------------          
          */}
          <Dialog
            visible={feedDialog}
            style={{ width: '1200px' }}
            header="Promotion feed Details"
            modal
            className="p-fluid"
            footer={feedDialogFooter}
            onHide={hideDialog}
            blockScroll
          >

            <form onSubmit={handleSubmit(onSubmit)} onKeyPress={(e) => { e.key === constants.KEYPRESS.ENTER && e.preventDefault(); }} autoComplete="off">
              {feed && feed.errors && (
                <>
                  <div className="p-formgrid p-grid">
                    <div className="p-field p-col-12">
                    <Accordion>
                      <AccordionTab header="There was an error building the offer">
                        <div className="p-formgrid p-grid">
                          <div className="p-field p-col-12">
                            <div style={{maxHeight: '200px', overflowY: 'scroll'}}>
                              <DataTable value={feed.errors} responsiveLayout="scroll">
                                <Column field="createdAt" header="Created At" headerStyle={{color:'red'}} body={createDateBodyTemplate}></Column>
                                <Column field="error" header="Error" headerStyle={{color:'red'}}></Column>
                              </DataTable>
                            </div>
                          </div>
                        </div>
                      </AccordionTab>
                    </Accordion>
                    </div>
                  </div>
                </>
              )}
              {
                feed && feed.note && (
                  
                  <><Message severity="info" text={feed.note} /><br /><br /></>
                )
              }
              <div className="p-formgrid p-grid">
                <div className="p-field p-col-6">
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
                <div className="p-field p-col">
                  <label htmlFor="startDate">Start Date</label>
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Calendar
                        id={field.name}
                        {...field}
                         dateFormat="dd/mm/yy"
                        disabled={!isNewAsset}
                        value={feed.startDate}
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
                        disabled={!isNewAsset}
                        {...field}
                        value={feed.endDate}
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
                  </Fieldset>
                </div>

                <div className="p-md-6">
                  <Fieldset legend="Offer Page/Modal">
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
              <div className="p-formgrid p-col-12">
                <Fieldset legend="Offer type">
                  <div className="p-grid">
                    <div className="p-col-12 p-md-4">
                      <div className="p-field-radiobutton">
                        <RadioButton
                          inputId="type"
                          name="type"
                          value="SIMPLE"
                          checked={feed.type === 'SIMPLE'}
                          onChange={e => onInputChange(e, 'type')}
                        />
                        <label htmlFor="category1">Simple</label>
                      </div>
                    </div>
                    <div className="p-col-12 p-md-4">
                      <div className="p-field-radiobutton">
                        <RadioButton
                          inputId="promotion"
                          name="type"
                          value="PROMOTION"
                          checked={feed.type === 'PROMOTION'}
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
                          checked={feed.type === 'CUSTOM'}
                          onChange={e => onInputChange(e, 'type')}
                        />
                        <label htmlFor="CUSTOM">Custom</label>
                      </div>
                    </div>
                    {getFormErrorMessage('type')}
                  </div>
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

                  <div hidden={!simpleOfferType} className="p-field p-col p-md-6">
                    <label htmlFor="promotionCode">Promotion Code</label>
                    <Controller
                      name="promotionCode"
                      control={control}
                      render={({ field, fieldState }) => (
                        <InputText
                          id={field.name}
                          {...field}
                          maxLength={500}
                          onChange={e => onInputChange(e, 'promotionCode')}
                          className={classNames({
                            'p-invalid': fieldState.invalid,
                          })}
                        />
                      )}
                    />
                    {getFormErrorMessage('promotionCode')}
                  </div>
                </Fieldset>
              </div>
                <Fieldset legend="Offer Tracking">
                    <div className="p-formgrid p-grid">
                      <div className="p-field p-col-2">
                        <label htmlFor="affiliate">Affiliate</label>
                        <Controller
                          name="affiliate"
                          control={control}
                          render={({ field, fieldState }) => (
                            <DropdownMpFeedAffiliate
                              id={field.name}
                              {...field}
                              value={field.value}
                              onChange={(e: void) => onInputChange(e, 'affiliate')}
                              className={classNames({
                                'p-invalid': fieldState.invalid,
                              })}
                              disabled={!isNewAsset}
                            />
                          )}
                        />
                        {getFormErrorMessage('affiliate')}
                      </div>
                      <div className="p-field p-col">
                        <label htmlFor="promotionTrackingLink">Promotion Tracking Link</label>
                        <Controller
                          name="promotionTrackingLink"
                          control={control}
                          render={({ field, fieldState }) => (
                            <InputText
                              id={field.name}
                              {...field}
                              onChange={e => onInputChange(e, 'promotionTrackingLink')}
                              className={classNames({
                                'p-invalid': fieldState.invalid,
                              })}
                            />
                          )}
                        />
                        {getFormErrorMessage('promotionTrackingLink')}
                      </div>
                    </div>
                </Fieldset>

              <br /><br />
              <div className="p-formgrid p-grid">
                <div className="p-field p-col-12">
                  <label htmlFor="categoryIds">Categories</label>
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
                  <div className="p-field" style={{ marginTop: '5px' }}>
                    <span style={{ fontWeight: 'bold', float: 'left', whiteSpace: 'pre-wrap' }}>Suggestion Affiliate Category: </span>
                    <span style={{ fontStyle: 'italic', marginRight: '5px' }}>{optionsSuggestionCategory}</span>
                  </div>
                </div>
              </div>
              <Fieldset legend="Offer Tracking">
                <div className="p-formgrid p-grid">
                  <div className="p-field p-col-6">
                    <label htmlFor="brandId">Brand</label>
                    <Controller
                      name="brandId"
                      control={control}
                      render={({ field, fieldState }) => (
                        <DropdownMpBrand
                          id={field.name}
                          {...field}
                          disabled={disableBrand}
                          value={field.value}
                          onChange={(e: any) => {
                            onInputChange(e, 'brandId');
                            if (e.target.value?._id) {
                              setDisableAffiliateBrand(true);
                            }
                            else
                            {
                              setDisableAffiliateBrand(false);
                            }
                          }}
                          className={classNames({
                            'p-invalid': fieldState.invalid,
                          })}
                        />
                      )}
                    />
                    {getFormErrorMessage('brandId')}
                    <div className="p-field" style={{ marginTop: '5px' }}>
                    <span style={{ fontWeight: 'bold', float: 'left', whiteSpace: 'pre-wrap' }}>The brand field must be selected to enabled the final revision.</span>
                  </div>
                  </div>
                  <div className="p-field p-col-6">
                    <label htmlFor="affiliateBrand">Feed Brand</label>
                    <Controller
                      name="affiliateBrand"
                      control={control}
                      render={({ field, fieldState }) => (
                        <DropdownMpFeedBrand
                          id={field.name}
                          {...field}
                          disabled={disableAffiliateBrand}
                          value={field.value}
                          onChange={(e: any) => {
                            if (e.target.value?._id) {
                              setDisableBrand(true);
                            }
                            else {
                              setDisableBrand(false);
                            }
                            onInputChange(e, 'affiliateBrand');
                          }}
                          className={classNames({
                            'p-invalid': fieldState.invalid,
                          })}
                        />
                      )}
                    />
                    {getFormErrorMessage('affiliateBrand')}
                  </div>
                </div>
              </Fieldset>
              <br></br>
              
              <div className="p-formgrid">
                <Meta control={control} formErrors={errors}
                onChange={onMetaInputChange}
                classNames={classNames}
                data={{ originalAssetObj: feed, setAsset: setFeed }}
                reset={reset}
                section="offer"
                integration={isVisibilityOGImage} />
              </div>
              <br />
              <div className="p-formgrid p-grid">
                <div className="p-field p-col">
                  <label htmlFor="note">Notes</label>
                  <Controller
                    name="note"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputTextarea
                        id={field.name}
                        {...field}
                        onChange={e => onInputChange(e, 'note')}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                      />
                    )}
                  />
                </div>
              </div>

              <input type="submit" hidden ref={formSubmit} />
            </form>
          </Dialog>
          {/* 
            ---------------------------
            (END) Feed edition dialog
            ---------------------------          
          */}

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
              {feed && (
                <span>
                  There are changes not saved. Are you sure you want to quit?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={rejectDialog}
            style={{ width: '500px' }}
            header="Confirm"
            modal
            footer={rejectDialogFooter}
            onHide={hideRejectDialog}
            blockScroll
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle p-mr-3"
                style={{ fontSize: '2rem' }}
              />
              {feed && (
                <span>
                  Are you sure you want to REJECT the selected promotion feed?
                </span>
              )}
            </div>
          </Dialog>
          <Dialog
            visible={unrejectDialog}
            style={{ width: '500px' }}
            header="Confirm"
            modal
            footer={unrejectDialogFooter}
            onHide={hideUnrejectDialog}
            blockScroll
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle p-mr-3"
                style={{ fontSize: '2rem' }}
              />
              {feed && (
                <span>
                  Are you sure you want to UNREJECT the selected offer feed?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default OfferPage;