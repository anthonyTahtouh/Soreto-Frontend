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
import { Message } from 'primereact/message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Fieldset } from 'primereact/fieldset';
import { Dropdown } from 'primereact/dropdown';
import { Menu } from 'primereact/menu';
import { Controller, useForm } from 'react-hook-form';
import { InputTextarea } from 'primereact/inputtextarea';
import FeedService from '../../../services/FeedService';
import ClientService from '../../../services/ClientService';
import QueryBuilderHelper from '../../../helpers/QueryBuilderHelper';
import MpFeeds from '../../../entities/mpFeeds';
import DropdownMpFeedStatus from '../../../components/DropdownMpFeedStatus';
import MpFeedBrand from '../../../entities/mpFeedBrand';
import DropdownMpCategories from '../../../components/DropdownMpCategories';
import DropdownClients from '../../../components/DropdownClients';
import Meta from '../../../components/Meta';
import DropdownMpFeedAffiliate from '../../../components/DropdownMpFeedAffiliate';
import constants from '../../../shared/constants';
import { Accordion, AccordionTab } from 'primereact/accordion';

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

const BrandPage = () => {
  const emptyFeeds: MpFeedBrand = new MpFeedBrand();

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
  const [feeds, setFeeds] = useState<Array<MpFeeds>>([]);
  const [selectedFeeds, setSelectedFeeds] = useState<any>([]);
  const [filters, setFilters] = useState(filterDefinition);
  const [loading, setLoading] = useState(false);
  const [rowBrand, setRowBrand] = useState<any>({});
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
    type: 'BRAND'
  });
  const [selectedCategoriesIds, setSelectedCategoriesIds] = useState<string[] | undefined>(
    [],
  );
  const [isAutomatic, setIsAutomatic] = useState<boolean>(false);
  const [isNewAsset, setIsNewAsset] = useState<boolean>(false);
  const [isVisibilityOGImage, setIsVisibilityOGImage] = useState<boolean>(false);

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

  const tiers = [
    { name: 'Tier 1', _id: 'Tier1' },
    { name: 'Tier 2', _id: 'Tier2' },
    { name: 'Tier 3', _id: 'Tier3' },
  ];

  const industries = [
    { name: 'Accessories', _id: 'Accessories' },
    { name: 'Health & Beauty', _id: 'Health & Beauty' },
    { name: 'Home & Garden', _id: 'Home & Garden' },
    { name: 'Fashion', _id: 'Fashion' },
    { name: 'Other', _id: 'Other' },
    { name: 'Technology', _id: 'Technology' },
  ];

  const toast = useRef<any>(null);

  const [statusId, setStatusId] = useState();

  const [tierId, setTierId] = useState<any | undefined>();
  const [industryId, setIndustryId] = useState<any | undefined>();

  const dt = useRef<any>(null);

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

  const [clientMatch, setClientMatch] = useState<boolean>(false);

  const [disabledClient, setDisabledClient] = useState<boolean>(false);

  const getFeeds = async () => {
    setLoading(true);

    setSelectedFeeds([]);

    const query = QueryBuilderHelper.get(tableProps as DataTableProps);

    try {
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
    setLoading(true);

    try {
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

    return setFeedDialog(false);
  };

  const hideDeleteFeedDialog = () => {
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

  async function populateFeedBrand(feed: any) {

    try {
      // always take the feed reference from API
      let feedFresh = await getFeedById(feed._id)

      setIsNewAsset(false);
      setIsAutomatic(feedFresh.automatic);

      if (notAllowEdition.includes(feedFresh.status)) {
        setDisableSave(true);
      }
      else {
        setDisableSave(false);
      }

      if (allowEdition.includes(feedFresh.status) ||
        (feedFresh.status === 'CREATED' && !feedFresh.automatic)) {

          if(feedFresh?.errors) {
            emptyFeeds.errors = feedFresh?.errors.page;
          }

          emptyFeeds.name = feedFresh.revisionForm.name;
          emptyFeeds.urlId = feedFresh.revisionForm.urlId.toLowerCase();
          emptyFeeds.feedId = feedFresh._id;
          emptyFeeds.tierId = feedFresh.revisionForm.tierId;
          emptyFeeds.website = feedFresh.revisionForm.website;
          emptyFeeds.shortUrl = feedFresh.revisionForm.shortUrl;
          emptyFeeds.shortName = feedFresh.revisionForm.shortName;
          emptyFeeds.categoryIds = feedFresh.revisionForm.categoryIds;
          emptyFeeds.contactEmail = feedFresh.revisionForm.contactEmail;
          emptyFeeds.brandDescription = feedFresh.revisionForm.brandDescription;
          emptyFeeds.percentCommission = feedFresh.revisionForm.percentCommission;
          emptyFeeds.brandDescriptionSmall = feedFresh.revisionForm.brandDescriptionSmall;
          emptyFeeds.customerServicesEmail = feedFresh.revisionForm.customerServicesEmail;
          emptyFeeds.industry = feedFresh.revisionForm.industry;
          emptyFeeds.brandDescriptionMedium = feedFresh.revisionForm.brandDescriptionMedium;
          emptyFeeds.clientId = feedFresh.revisionForm.clientId;
          emptyFeeds.note = feedFresh.revisionForm.note;

          if (emptyFeeds.clientId ) {
            setClientMatch(true);
            setDisabledClient(false);
          }
          else
          {
            setClientMatch(false);
            setDisabledClient(true);
          }

          emptyFeeds.merchantId = feedFresh.revisionForm.merchantId;
          emptyFeeds.status = constants.AFFILIATE_STATUS.IN_REVIEW;
          emptyFeeds.clientName = feedFresh.revisionForm.clientName;
          emptyFeeds.affiliate = feedFresh.affiliate;

          let tier = tiers.find(f => f._id == feedFresh.revisionForm.tierId);

          if (feedFresh.revisionForm.meta) {
            emptyFeeds.meta.title = feedFresh.revisionForm.meta.title;
            emptyFeeds.meta.description = feedFresh.revisionForm.meta.description;
            emptyFeeds.meta.keywords = feedFresh.revisionForm.meta.keywords;
            emptyFeeds.meta.ogImage = feedFresh.revisionForm.meta.ogImage;
            emptyFeeds.meta.tag = feedFresh.revisionForm.meta.tag;
            emptyFeeds.meta.headingOne = feedFresh.revisionForm.meta.headingOne;
            emptyFeeds.meta.headingTwo = feedFresh.revisionForm.meta.headingTwo;
          }
          setTierId(tier);
          setEditFeed(feedFresh._id);
      }
      else {
        emptyFeeds.name = feedFresh.name;
        emptyFeeds.feedId = feedFresh._id;
        emptyFeeds.brandDescriptionSmall = feedFresh.description.substring(0, 90);
        emptyFeeds.brandDescriptionMedium = feedFresh.description.substring(0, 140);
        emptyFeeds.brandDescription = feedFresh.description.substring(0, 210);
        emptyFeeds.merchantId = feedFresh.merchantId;
        emptyFeeds.shortUrl = buildShortUrlSuggestion(feedFresh.siteUrl);
        emptyFeeds.brandUrlId = feedFresh.name;
        emptyFeeds.status = constants.AFFILIATE_STATUS.IN_REVIEW;
        emptyFeeds.affiliate = feedFresh.affiliate;
        emptyFeeds.urlId = '';
        emptyFeeds.shortName = '';
        emptyFeeds.meta.ogImage = '';
        emptyFeeds.meta.title = '';
        emptyFeeds.meta.description = '';
        emptyFeeds.meta.keywords = ''
        emptyFeeds.meta.tag = '';
        emptyFeeds.meta.headingOne = '';
        emptyFeeds.meta.headingTwo = '';
        emptyFeeds.clientId = '';
        emptyFeeds.clientName = '';
        emptyFeeds.contactEmail = '';
        emptyFeeds.percentCommission = '';
        emptyFeeds.website = '';
        emptyFeeds.customerServicesEmail = '';
        emptyFeeds.industry = '';
        emptyFeeds.note = '';

        setTierId(null);

        let client = await ClientService.getClientByMerchantId(feedFresh.merchantId, feedFresh.affiliate);
        if (client.data?.length >= 1) {
          emptyFeeds.clientId = client.data[0]._id;
          setClientMatch(true);
          setDisabledClient(false);
        }
        else
        {
          emptyFeeds.clientId = '';
          emptyFeeds.clientName = '';
          emptyFeeds.website = feedFresh.siteUrl;
          setClientMatch(false);
          setDisabledClient(true);
        }
      }

      setIsVisibilityOGImage(true);
      setFeed({ ...emptyFeeds });
      reset(emptyFeeds);  
    } catch (error) {

      console.log(JSON.stringify(error))
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'There was an error opening the feed record',
        life: 3000
      });

      setFeed({});
      reset({});
      await getFeeds();
      setFeedDialog(false);
      setEditAssetDialogConfirmation(false);
    }
  }

  const loadingFeed = (feed: any) => {
    populateFeedBrand(feed);
    setOriginalAsset({ ...feed });
    setFeedDialog(true);
  };

  const openNew = async() => {
    let emptyFeed: MpFeedBrand = new MpFeedBrand();
    emptyFeed.status = constants.AFFILIATE_STATUS.IN_REVIEW;

    setFeed({ ...emptyFeed });
    setOriginalAsset({ ...emptyFeed });
    reset(emptyFeeds);

    setIsNewAsset(true);
    setIsAutomatic(false);
    setIsVisibilityOGImage(false);
    setFeedDialog(true);
    setClientMatch(false)
    setDisabledClient(false);
  }

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
        detail: 'Brand Rejected',
        life: 3000,
      });
    } catch (error: any) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.friendlyMessage,
        life: 3000
      });
    }
  };

  const unrejectSingleFeed = async (feedId: any) => {
    try {
      await FeedService.unreject(feedId, tableProps.type);
      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Brand Rejected',
        life: 3000,
      });
    } catch (error: any) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.friendlyMessage,
        life: 3000
      });
    }
  };

  const publishBrand = async (feedId: any) => {
    try {
      await FeedService.publish(feedId, tableProps.type);
      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Brand set as published',
        life: 3000,
      });

      await getFeeds();
    } catch (error: any) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.friendlyMessage,
        life: 3000,
      });
    }
  };

  const buildBrand = async (feedId: any) => {
    try {
      await FeedService.buildClientBrand(feedId);
      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Brand Built',
        life: 3000,
      });
    } catch (error: any) {
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
        detail: 'Brand Review',
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
        detail: 'Brand Approved',
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
    await getFeeds();
    setFeedDialog(false);
    setEditAssetDialogConfirmation(false);
    setFeed({});
    reset({});
  };

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
    hideDeleteFeedDialog();

    //Reset select Product
    setSelectedFeeds([]);

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

    getFeeds();
  };

  const onInputChange = (e: any, name: string) => {
    let val = e.target.value || ''

    const newEditedFeed: any = { ...feed };

    if (name === 'tierId') {
      newEditedFeed[`${name}`] = val._id;
      setTierId(val);
    }else if (name === 'industry'){
      newEditedFeed[`${name}`] = val._id;
      setIndustryId(val);
    }
    else {
      newEditedFeed[`${name}`] = val;
    }

    if (name === 'urlId' && newEditedFeed[`${name}`]) {
      setIsVisibilityOGImage(true);
      newEditedFeed[`${name}`] = (newEditedFeed[`${name}`]).toLowerCase();
    }
    else if (name === 'urlId' && !newEditedFeed[`${name}`]) {
      setIsVisibilityOGImage(false);
    }

    if (name === 'clientId' && newEditedFeed[`${name}`]) {
      newEditedFeed['clientName'] = '';
      newEditedFeed['contactEmail'] = '';
      newEditedFeed['percentCommission'] = '';
      newEditedFeed['website'] = '';
      newEditedFeed['customerServicesEmail'] = '';
      newEditedFeed['industry'] = '';
      newEditedFeed['tierId'] = '';
      setTierId(null);
    }

    reset(newEditedFeed);
    setFeed(newEditedFeed);
  };

  const onMetaInputChange = (e: any, name: string) => {
    let val = e.target.value || '';

    if (name === 'keywords' && val) {
      val = val.split(',').join();
    }

    const newEditedOffer: any = JSON.parse(JSON.stringify(feed));

    newEditedOffer.meta[`${name}`] = val;

    reset(newEditedOffer);
    setFeed(newEditedOffer);
  };

  const buildShortUrlSuggestion = (brandUrlFromFeed: string) => {

    try {
      const requiredProtocol = ['https://', 'http://'];
      if(requiredProtocol.some(p => brandUrlFromFeed.includes(p))){
        return (new URL(brandUrlFromFeed)).hostname.replaceAll('www.', '');
      }else {
        return brandUrlFromFeed.replaceAll('www.', '');
      }
    } catch (error) {
      return brandUrlFromFeed;
    }
  }

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
    resolver: yupResolver(MpFeedBrand.schemaValidation()),
  });

  // form submit button reference
  const formSubmit = useRef(null);

  const onSubmit = async () => {
    try {

      let pp: any = { ...feed };
      // removed feedId from the body
      delete pp['feedId'];
      delete pp['errors'];
      pp = {...pp};

      await FeedService.save(feed.feedId, pp, tableProps.type);
      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Brand saved',
        life: 3000,
      });

      setFeedDialog(false);
      
      let emptyFeed: MpFeedBrand = new MpFeedBrand();
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
          label="Add Brand Manually"
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

  const descriptionBodyTemplate = (rowData: any) => {
    return <>{rowData.description}</>;
  };

  const statusBodyTemplate = (rowData: any) => {
    return <>{rowData.status}</>;
  };

  const affiliateStatusBodyTemplate = (rowData: any) => {
    return <>{rowData.affiliateStatus}</>;
  };

  const merchantIdBodyTemplate = (rowData: any) => {
    return <>{rowData.merchantId}</>;
  };

  const createDateBodyTemplate = (rowData: any) => {
    let date = formatDate(rowData.createdAt);
    return <>{date}</>;
  };

  const nameBodyTemplate = (rowData: any) => {
    return <>{rowData.name}</>;
  };

  const actionBodyTemplate = (rowData: any) => {

    const menuLocal: any = React.createRef();

    let editFeedButton = true;
    let buildButton = true;
    let buildReviewButton = true;
    let buildApprovedButton = true;
    let publishButton = true;
    let brandViewButton = true;
    let simulateCampaign = true;
    let editBrandButton = true;
    
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
        buildReviewButton = false;
        simulateCampaign = false;
        editBrandButton = false;
        break;
      case constants.AFFILIATE_STATUS.BUILD_REVIEW:
        buildApprovedButton = false;
        simulateCampaign = false;
        editBrandButton = false;
        break;        
      case constants.AFFILIATE_STATUS.BUILD_APPROVED:
        publishButton = false;
        simulateCampaign = false;
        editBrandButton = false;
        break; 
      case constants.AFFILIATE_STATUS.PUBLISHED:
        brandViewButton = false;
        break;
      case constants.AFFILIATE_STATUS.AFFILIATE_UPDATE:
        break;
      case constants.AFFILIATE_STATUS.BUILD_UPDATE_REQUIRED:
        buildReviewButton = false;
        break;       
      default:
        break;
    }

    const menuModel = [
      { label: 'Edit', disabled: editFeedButton, command:()=>{ loadingFeed(rowBrand)} }, 
      { label: 'Build', disabled: buildButton,  command:()=>{buildBrand(rowBrand._id)} },
      { label: 'Simulate campaign', disabled: simulateCampaign, command:()=>{
          FeedService.simulateBrand(rowBrand);
          toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Brand simulate with success!',
            life: 3000,
          });
          } 
      },
      { label: 'Send to final approval', disabled: buildReviewButton, command:()=>{buildReview(rowBrand._id)} },
      { label: 'Approve campaign', disabled: buildApprovedButton, command:()=>{buildApproved(rowBrand._id)} },
      { label: 'Publish', disabled: publishButton, command:()=>{publishBrand(rowBrand._id)} },
      { label: '---------------------------------------', disabled: true },
      { label: 'Edit brand', disabled: editBrandButton, target: '_blank', url: `../brands?mpBrandId=${rowBrand.brandId}`},
      { label: 'View brand', disabled: brandViewButton, command:()=>{
          FeedService.viewBrand(rowBrand);
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
          <Button 
            type="button" 
            icon="pi pi-ellipsis-h" 
            className="p-button-rounded p-button-text p-button-plain" 
            onClick={(event) => {setRowBrand(rowData); menuLocal.current.toggle(event);}}>

          </Button>
          
          <Menu 
            ref={menuLocal} 
            popup 
            model={menuModel}>
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

    setTableProps({ ...newTableProp });
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

  const handleSelectedCategories = (arrayOfCategories: MpFeedBrand[]) => {
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
              field="name"
              header="Name"
              sortable
              body={nameBodyTemplate}
            />

            <Column
              field="description"
              header="Description"
              sortable
              body={descriptionBodyTemplate}
            />

            <Column
              field="createdAt"
              header="Created"
              sortable
              body={createDateBodyTemplate}
            />

            <Column field="status" header="Status" sortable body={statusBodyTemplate} />

            <Column field="affiliateStatus" header="Affiliate Status" sortable body={affiliateStatusBodyTemplate} />

            <Column
              field="merchantId"
              header="Merchant Id"
              sortable
              body={merchantIdBodyTemplate}
            />

          <Column body={actionBodyTemplate} />
          </DataTable>

          <Dialog
            visible={feedDialog}
            style={{ width: '1200px' }}
            header="Feed Details"
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
                      <AccordionTab header="There was an error building the brand">
                        <div className="p-formgrid p-grid">
                          <div className="p-field p-col-12">
                            <div style={{maxHeight: '200px', overflowY: 'scroll',}}>
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
              </div>
              <div className="formgrid grid">
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

              <Fieldset legend="Client">
                <div className="formgrid grid">
                  <div className="field col-6">
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
                          onChange={(e: any) => {
                            onInputChange(e, 'clientId');
                            setClientMatch(e.target.value ? true : false);
                          }}
                          disabled={disabledClient}
                        />
                      )}
                    />
                    {getFormErrorMessage('clientId')}
                  </div>
                  <div className="field col-6">
                    <label htmlFor="Client Name">Client Name</label>

                    <Controller
                      name="clientName"
                      control={control}
                      render={({ field, fieldState }) => (
                        <InputText
                          id={field.name}
                          {...field}
                          onChange={e => {
                            onInputChange(e, 'clientName');
                            setDisabledClient(e.target.value ? true : false);
                          }}
                          disabled={clientMatch}
                          className={classNames({
                            'p-invalid': fieldState.invalid,
                          })}
                        />
                      )}
                    />
                    {getFormErrorMessage('clientName')}
                  </div>
                  <div className="field col-4">
                    <label htmlFor="Contact Email">Contact Email</label>

                    <Controller
                      name="contactEmail"
                      control={control}
                      render={({ field, fieldState }) => (
                        <InputText
                          id={field.name}
                          {...field}
                          onChange={e => onInputChange(e, 'contactEmail')}
                          disabled={clientMatch}
                          className={classNames({
                            'p-invalid': fieldState.invalid,
                          })}
                        />
                      )}
                    />
                    {getFormErrorMessage('contactEmail')}
                  </div>
                  <div className="field col-2">
                    <label htmlFor="Percent commission">Percent commission</label>

                    <Controller
                      name="percentCommission"
                      control={control}
                      render={({ field, fieldState }) => (
                        <InputText
                          id={field.name}
                          {...field}
                          onChange={e => onInputChange(e, 'percentCommission')}
                          disabled={clientMatch}
                          className={classNames({
                            'p-invalid': fieldState.invalid,
                          })}
                        />
                      )}
                    />
                    {getFormErrorMessage('percentCommission')}
                  </div>
                  <div className="field col-3">
                    <label htmlFor="website">Website</label>

                    <Controller
                      name="website"
                      control={control}
                      render={({ field, fieldState }) => (
                        <InputText
                          id={field.name}
                          {...field}
                          onChange={e => onInputChange(e, 'website')}
                          disabled={clientMatch}
                          className={classNames({
                            'p-invalid': fieldState.invalid,
                          })}
                        />
                      )}
                    />
                    {getFormErrorMessage('website')}
                  </div>
                  <div className="field col-3">
                  <label htmlFor="tierId">Tier</label>

                    <Controller
                    name="tierId"
                    control={control}
                    render={({ field, fieldState }) => (
                    <Dropdown
                      filter
                      showClear
                      filterBy="name"
                      id={field.name}
                      value={tierId}
                      onChange={e => onInputChange(e, 'tierId')}
                      options={tiers}
                      disabled={clientMatch}
                      optionLabel="name"
                      placeholder="Select the Tier"
                      className={classNames({
                        'p-invalid': fieldState.invalid,
                      })}
                    />
                    )}
                    />
                  </div>
                  <div className="field col-6">
                    <label htmlFor="customerServicesEmail">Customer Services email</label>

                    <Controller
                      name="customerServicesEmail"
                      control={control}
                      render={({ field, fieldState }) => (
                        <InputText
                          id={field.name}
                          {...field}
                          onChange={e => onInputChange(e, 'customerServicesEmail')}
                          disabled={clientMatch}
                          className={classNames({
                            'p-invalid': fieldState.invalid,
                          })}
                        />
                      )}
                    />
                    {getFormErrorMessage('customerServicesEmail')}
                  </div>
                  <div className='field col-6'>
                    <label htmlFor="industry">Industry</label>
                    <Controller
                        name="industry"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Dropdown
                            filter
                            showClear
                            filterBy="name"
                            id={field.name}
                            value={industryId}
                            onChange={e => onInputChange(e, 'industry')}
                            options={industries}
                            disabled={clientMatch}
                            optionLabel="name"
                            placeholder="Select the Industry"
                            className={classNames({
                              'p-invalid': fieldState.invalid,
                            })}
                          />
                        )}
                      />
                      {getFormErrorMessage('industry')}
                  </div>
                </div>                
              </Fieldset>
              <Fieldset legend="Affiliate">
                <div className="formgrid grid">
                  <div className="p-field col-6">
                    <label htmlFor="affiliate">Affiliate</label>
                    <Controller
                      name="affiliate"
                      control={control}
                      render={({ field, fieldState }) => (
                        <DropdownMpFeedAffiliate
                          id={field.name}
                          value={field.value}
                          onChange={(e: void) => onInputChange(e, 'affiliate')}
                          disabled={(isAutomatic && !isNewAsset) || (!isAutomatic && !isNewAsset)}
                          className={classNames({
                            'p-invalid': fieldState.invalid,
                          })}
                        />
                      )}
                    />
                    {getFormErrorMessage('affiliate')}
                  </div>

                  <div className="field col-6">
                    <label htmlFor="merchantId">Merchant Id</label>
                    <Controller
                      name="merchantId"
                      control={control}
                      render={({ field, fieldState }) => (
                        <InputText
                          disabled={(isAutomatic && !isNewAsset) || (!isAutomatic && !isNewAsset)}
                          id={field.name}
                          {...field}
                          onChange={e => onInputChange(e, 'merchantId')}
                          className={classNames({
                            'p-invalid': fieldState.invalid,
                          })}
                        />
                      )}
                    />
                    {getFormErrorMessage('merchantId')}
                  </div>
                </div>
              </Fieldset>
              <br/>
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

              <div className="p-formgrid">
                <Meta control={control} formErrors={errors}
                onChange={onMetaInputChange}
                classNames={classNames}
                data={{ originalAssetObj: feed, setAsset: setFeed }}
                reset={reset}
                section="brand"
                integration={isVisibilityOGImage}  />
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
                  Are you sure you want to UNREJECT the selected brand feed?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default BrandPage;