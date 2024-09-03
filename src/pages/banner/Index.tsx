/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-self-compare */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/destructuring-assignment */
import React, { useState, useRef, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// React Prime
import {
  DataTable,
  DataTableProps,
  DataTableSortOrderType,
} from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Tooltip } from 'primereact/tooltip';
import { classNames } from 'primereact/utils';
import { Fieldset } from 'primereact/fieldset';
import { InputNumber } from 'primereact/inputnumber';
import DropdownMpCategories from '../../components/DropdownMpCategories';
import DropdownFlashCampaing from '../../components/DropdownFlashCampaign';

// service
import BannerService from '../../services/BannerService';

import QueryBuilderHelper from '../../helpers/QueryBuilderHelper';
import MpBanner from '../../entities/mpBanner';
import DropdownMpBrand from '../../components/DropdownMpBrand';
import DropdownMpOffer from '../../components/DropdownMpOffer';
import Upload from '../../components/uploadComponent/Upload';
import constants from '../../shared/constants';
import DropdownBannerTag from '../../components/DropdownBannerTag';
import DropdownVisibilityTag from '../../components/DropdownVisibilityTag';
import {
  timezoneOffsetOut,
  timezoneOffsetIn,
} from '../../helpers/dateFormatter';
import DropdownBannerType from '../../components/DropdownBannerType';

interface BannerProps {
  _id?: string;
  name: string;
  title: string;
  description: string | undefined;
  buttonLabel: string | null;
  active: boolean;
  coverImageUrl: string;
  coverImageTabletUrl: string;
  coverImageMobileUrl: string;
  tag: string;
  targetMpOfferId: string | null;
  targetMpBrandId: string | null;
  targetMpCategoryId: string | null;
  type: string | null;
  offerName: string | null;
  brandName: string | null;
  categoryName: string | null;
  targetTagId: string | null;
  targetMpBrandTagId: string | null;
  targetMpCategoryTagId: string | null;
  visibilityTags: string | null;
  customUrlTarget: string | null;
  startDate: Date | Date[] | undefined;
  endDate: Date | Date[] | undefined;
  targetTypeId: string | null;
}

interface CustomDataTableProps {
  first: number;
  rows: number;
  page: number;
  sortField: string;
  sortOrder: DataTableSortOrderType;
  filters: { ftSearch: { value: string; matchMode: string } };
}

function Index() {
  const emptyBanner: MpBanner = new MpBanner();

  const newimage = constants.IMAGE.EMPTY_IMAGE_URL;
  emptyBanner.coverImageUrl = newimage;

  const [selectedVisibilityTagsIds, setSelectedVisibilityTagsIds] = useState<
    string[]
  >([]);
  const [hideDropdown, setHideDropdown] = useState<boolean>(true);
  const [banners, setBanners] = useState<any>(null);
  const [banner, setBanner] = useState<any>(emptyBanner);
  const [bannerDialog, setBannerDialog] = useState<boolean>(false);
  const [updateDialog, setUpdateDialog] = useState<boolean>(false);
  const [selectedUploadAsset, setSelectedUploadAsset] = useState<string>('');
  const [selectedTabletUploadAsset, setSelectedTabletUploadAsset] =
    useState<string>('');
  const [selectedMobileUploadAsset, setSelectedMobileUploadAsset] =
    useState<string>('');
  const [deleteBannertDialog, setDeleteBannertDialog] =
    useState<boolean>(false);
  const [deleteBannersDialog, setDeleteBannersDialog] =
    useState<boolean>(false);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<any>(null);
  const [selectedBanners, setSelectedBanners] = useState<any>(null);
  const [originalAsset, setOriginalAsset] = useState<any>(emptyBanner);
  const [editAssetDialogConfirmation, setEditAssetDialogConfirmation] =
    useState(false);
  const [tableProps, setTableProps] = useState<CustomDataTableProps>({
    first: 0,
    rows: 10,
    page: 0,
    sortField: 'name',
    sortOrder: 1,
    filters: {
      ftSearch: { value: '', matchMode: 'custom' },
    },
  });

  const [labelSize, setLabelSize] = useState<any>('');
  const tagsValueSize = [
    // Menu card banners
    { name: 'MENU_CATEGORY', value: '900 x 300' },
    { name: 'MENU_CATEGORY_FALLBACK', value: '900 x 300' },
    { name: 'MENU_BRANDS', value: '650 x 300' },
    { name: 'MENU_BRANDS_FALLBACK', value: '650 x 300' },

    // Home page banners
    { name: 'HP_SECTION1', value: '1180 x 300' },
    { name: 'HP_SECTION2', value: '1180 x 300' },

    // Brand page banners
    {
      name: 'BRAND_PAGE_SECTION1_{brand_url_id}',
      value: '1180 x 300',
    },
    { name: 'BRAND_PAGE_SECTION2', value: '1180 x 300' },

    // All Brands page banners
    { name: 'ALL_BRAND_PAGE_SECTION1', value: '1180 x 300' },

    // All CATEGORY page banners
    { name: 'ALL_CATEGORY_PAGE_SECTION1', value: '1180 x 300' },

    // Top offers page banners
    { name: 'TOP_OFFER_PAGE_SECTION1', value: '1180 x 300' },

    // HERO banners
    { name: 'HERO_MAIN_PAGE', value: '1440 x 300' },
    {
      name: 'HERO_MAIN_PAGE_FALLBACK',
      value: '1440 x 300',
    },
    { name: 'HERO_TOP_OFFER_PAGE', value: '1440 x 300' },
    {
      name: 'HERO_TOP_OFFER_PAGE_FALLBACK',
      value: '1440 x 300',
    },
    { name: 'HERO_ALL_BRANDS_PAGE', value: '1440 x 300' },
    {
      name: 'HERO_ALL_BRANDS_PAGE_FALLBACK',
      value: '1440 x 300',
    },
    { name: 'HERO_ALL_BLOGS_PAGE', value: '1440 x 300' },
    {
      name: 'HERO_ALL_BLOGS_PAGE_FALLBACK',
      value: '1440 x 300',
    },
    {
      name: 'HERO_CATEGORY_PAGE_{category_url_id}',
      value: '1440 x 300',
    },
    {
      name: 'HERO_CATEGORY_PAGE_FALLBACK',
      value: '1440 x 300',
    },

    // CONTACT_US banners
    { name: 'CONTACT_US_PAGE1', value: '1180 x 300' },
    { name: 'CONTACT_US_PAGE2', value: '1180 x 300' },

    // All The Edits page banners
    { name: 'THEEDIT_SECTION1', value: '1180 x 300' },

    // FLASH CAMPAIN bottom banner
    { name: 'HERO_FLASH_CAMPAIGN', value: '1440 x 300' },
    {
      name: 'HERO_FLASH_CAMPAIGN_FALLBACK',
      value: '1440 x 300',
    },
    {
      name: 'FLASH_CAMPAIGN_PAGE_SECTION1_{flash_campaign_url_id}',
      value: '1440 x 420',
    },
  ];

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(MpBanner.schemaValidation()),
  });

  const getFormErrorMessage = (name: string) => {
    return (
      (errors[name] || errors['']?.type === name) && (
        <small className="p-error">
          {errors[name]?.message || errors['']?.message}
        </small>
      )
    );
  };

  const toast = useRef<any>(null);
  const dt = useRef<any>(null);
  // form submit button reference
  const formSubmit = useRef(null);

  const getBanners = async () => {
    setLoading(true);

    const query = QueryBuilderHelper.get(tableProps as DataTableProps);

    try {
      const data = await BannerService.getBanners(query);

      if (data?.resultData?.page) {
        setBanners(data.resultData.page);
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
    getBanners();
  }, [tableProps]);

  useEffect(() => {
    const pp = { ...banner };
    pp.visibilityTags = selectedVisibilityTagsIds;
    setBanner(pp);
  }, [selectedVisibilityTagsIds]);

  const handleSelectedVisibilityTags = (arrayOfVisibilityTags: MpBanner[]) => {
    if (arrayOfVisibilityTags && arrayOfVisibilityTags.length) {
      const arrayOfCategoryIds = arrayOfVisibilityTags.map(
        selectedVisibility => {
          return selectedVisibility._id;
        },
      );
      return setSelectedVisibilityTagsIds(arrayOfCategoryIds);
    }
    return setSelectedVisibilityTagsIds([]);
  };

  const handleSelectedFlashCampaign = (arrayOfFlashCampaign: MpBanner[]) => {
    const objBanner: any = { ...banner };
    if (arrayOfFlashCampaign && arrayOfFlashCampaign.length > 0) {
      const arrayOfFlashCampaignIds = arrayOfFlashCampaign.map(
        selectedFlashCampaign => {
          return selectedFlashCampaign._id;
        },
      );
      return setBanner({
        ...objBanner,
        flashCampaignIds: arrayOfFlashCampaignIds,
      });
    }
    return setBanner({ ...objBanner, flashCampaignIds: [] });
  };

  const openNew = () => {
    setBanner(emptyBanner);
    setOriginalAsset(emptyBanner);
    reset({ banner });
    setBannerDialog(true);
  };

  const findIndexById = (id: string) => {
    let index = -1;
    for (let i = 0; i < banners.length; i += 1) {
      // eslint-disable-next-line no-underscore-dangle
      if (banners[i]._id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const onInputChange = (e: any, name: string) => {
    setHideDropdown(true);
    let val = '';
    const asset = e.value;

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
    } else {
      val = e.value;
    }
    const pp = { ...banner };
    pp[`${name}`] = val;

    if (asset) {
      switch (name) {
        case 'targetTagId':
        case 'targetMpBrandTagId':
        case 'targetMpFlashCampaignTagId':
        case 'targetMpCategoryTagId':
          pp.tagCategoryUrlId = null;
          pp.tagBrandUrlId = null;
          pp.tagFlashCampaignUrlId = null;

          if (name === 'targetTagId') {
            pp.targetTagId = asset.id;
          }
          if (name === 'targetMpBrandTagId') {
            pp.tagBrandUrlId = asset.urlId;
          }
          if (name === 'targetMpFlashCampaignTagId') {
            pp.tagFlashCampaignUrlId = asset.urlId;
          }
          if (name === 'targetMpCategoryTagId') {
            pp.tagCategoryUrlId = asset.urlId;
          }
          break;
        default:
          break;
      }

      pp.offerUrlId = null;
      pp.brandUrlId = null;
      pp.categoryUrlId = null;

      if (name === 'targetMpOfferId') {
        pp.offerUrlId = asset.urlId;
      }
      if (name === 'targetMpBrandId') {
        pp.brandUrlId = asset.urlId;
      }
      if (name === 'targetMpCategoryId') {
        pp.categoryUrlId = asset.urlId;
      }
    } else {
      if (name === 'targetMpOfferId') {
        pp.offerUrlId = null;
      }
      if (name === 'targetMpBrandId') {
        pp.brandUrlId = null;
      }
      if (name === 'targetMpCategoryId') {
        pp.categoryUrlId = null;
      }
      if (name === 'targetTagId') {
        pp.targetTagId = null;
      }
      if (name === 'targetMpBrandTagId') {
        pp.tagBrandUrlId = null;
      }
      if (name === 'targetMpFlashCampaignTagId') {
        pp.tagFlashCampaignUrlId = null;
      }
      if (name === 'targetMpCategoryTagId') {
        pp.tagCategoryUrlId = null;
      }
    }

    setBanner(pp);
    reset(pp);
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
      <h5 className="p-m-0">Manage Brands</h5>
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

  const confirmDeleteSelected = () => {
    setDeleteBannertDialog(true);
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
          disabled={!selectedBanners || !selectedBanners.length}
        />
      </>
    );
  };

  const onSort = (event: any) => {
    setSelectedBanners([]);
    setTableProps({ ...tableProps, ...event });
  };

  const onPage = (event: any) => {
    setSelectedBanners([]);
    setTableProps({ ...tableProps, ...event });
  };

  const onFilter = (event: any) => {
    setSelectedBanners([]);
    setTableProps({ ...tableProps, ...event });
  };

  const activeBodyTemplate = (rowData: any) => {
    return (
      <>
        {/* <span className="p-column-title">show On Header Menu</span> */}
        <Checkbox checked={rowData.active} />
      </>
    );
  };

  const startDateBodyTemplate = (rowData: any) => {
    return (
      <>
        {/* <span className="p-column-title">Start Date</span> */}
        <span> {new Date(rowData.startDate).toISOString().slice(0, 10)}</span>
      </>
    );
  };

  const endDateBodyTemplate = (rowData: any) => {
    return (
      <>
        {/* <span className="p-column-title">End Date</span> */}
        {new Date(rowData.endDate).toISOString().slice(0, 10)}
      </>
    );
  };

  const editBanner = (b: BannerProps) => {
    setHideDropdown(false);
    const editBannerProps = { ...b };
    editBannerProps.targetTagId = editBannerProps.tag;

    editBannerProps.startDate = timezoneOffsetOut(b.startDate);
    editBannerProps.endDate = timezoneOffsetOut(b.endDate);

    setBanner({ ...editBannerProps });
    setOriginalAsset({ ...editBannerProps });
    reset(editBannerProps);
    setBannerDialog(true);
  };

  const confirmDeleteCategory = (item: any) => {
    setBanner(item);
    setDeleteBannersDialog(true);
  };

  const hideDeleteBannerssDialog = () => {
    setDeleteBannersDialog(false);
    // setBrand(emptyBrand);
  };

  const destroySelectedBanner = async (data: BannerProps) => {
    try {
      await BannerService.deleteBanner(data);

      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Banner Deleted',
        life: 3000,
      });
      getBanners();
    } catch (error: any) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.friendlyMessage,
        life: 3000,
      });
    }
  };

  const closeAssetEditDialogAndEditDialog = async () => {
    setBannerDialog(false);
    setEditAssetDialogConfirmation(false);
  };

  const deleteSelectedBanners = () => {
    destroySelectedBanner(banner);
    setDeleteBannersDialog(false);
  };

  const hideEditAssetConfirmationDialog = () => {
    setEditAssetDialogConfirmation(false);
  };

  const deleteBannerssDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteBannerssDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedBanners}
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

  const actionBodyTemplate = (rowData: BannerProps) => {
    return (
      <div className="actions">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-mr-2"
          onClick={() => editBanner(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteCategory(rowData)}
        />
      </div>
    );
  };

  const descriptionText = (obj: BannerProps) => {
    const showDescriptionText = `.description_${obj._id}`;
    const description = `description_${obj._id} data-pr-tooltip`;
    const text =
      obj.description != null && obj.description.length > 70
        ? `${obj.description.substring(0, 70)}...`
        : obj.description;
    return (
      <>
        <Tooltip target={showDescriptionText} content={obj.description} />
        <span className={description}>{text}</span>
      </>
    );
  };

  const getTargetType = (obj: BannerProps) => {
    if (obj.targetMpBrandId && obj.targetMpBrandId !== null) {
      return {
        targetId: obj.targetMpBrandId,
        targetName: obj.brandName,
        type: 'BRAND',
      };
    }

    if (obj.targetMpOfferId && obj.targetMpOfferId !== null) {
      return {
        targetId: obj.targetMpOfferId,
        targetName: obj.offerName,
        type: 'OFFER',
      };
    }

    if (obj.targetMpCategoryId && obj.targetMpCategoryId !== null) {
      return {
        targetId: obj.targetMpCategoryId,
        targetName: obj.categoryName,
        type: 'CATEGORY',
      };
    }

    if (obj.customUrlTarget && obj.customUrlTarget !== null) {
      return {
        targetId: obj.customUrlTarget,
        targetName: '',
        type: 'CUSTOM',
      };
    }

    return {
      targetId: 'ADVERTISEMENT',
      targetName: '',
      type: 'ADVERTISEMENT',
    };
  };

  const targetType = (rowData: BannerProps) => {
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

  const isAssetEditAndNotSaved = () => {
    const editAssetStr = JSON.stringify(banner);
    const originalAssetStr = JSON.stringify(originalAsset);
    return editAssetStr !== originalAssetStr;
  };

  const targetName = (rowData: BannerProps) => {
    const target = getTargetType(rowData);
    return target.targetName;
  };

  // eslint-disable-next-line consistent-return
  const hideDialog = () => {
    setBanner(emptyBanner);

    if (updateDialog) {
      setUpdateDialog(false);
    }

    if (isAssetEditAndNotSaved()) {
      return setEditAssetDialogConfirmation(true);
    }

    setBannerDialog(false);
  };

  const hideDeleteBannertDialog = () => {
    setDeleteBannertDialog(false);
  };

  const hideDeleteBannersDialog = () => {
    setDeleteBannersDialog(false);
  };

  const bannertDialogFooter = (
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

  const deleteBanners = async () => {
    const selected = banners.filter((val: any) =>
      selectedBanners.includes(val),
    );
    selected.forEach((val: any) => {
      destroySelectedBanner(val);
    });

    setDeleteBannertDialog(false);
  };

  const coverImageUrlTemplate = (rowData: any) => {
    return (
      <img
        src={`${rowData.coverImageUrl}`}
        // onError={e => (e.target.src = rowData.coverImageUrl)}
        alt={rowData.coverImageUrl}
        className="product-image"
      />
    );
  };

  const deleteBannersDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteBannertDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteBanners}
      />
    </>
  );

  const isNewAsset = !originalAsset._id;

  const onSubmit = async () => {
    let newBanner;

    if (banner.name.trim()) {
      try {
        if (
          banner.targetTagId !== undefined &&
          banner.targetTagId.includes('_{')
        ) {
          if (banner.tagBrandUrlId) {
            banner.tag = banner.targetTagId.replace(
              '{brand_url_id}',
              banner.tagBrandUrlId,
            );
          } else if (banner.tagFlashCampaignUrlId) {
            banner.tag = banner.targetTagId.replace(
              '{flash_campaign_url_id}',
              banner.tagFlashCampaignUrlId,
            );
          } else {
            banner.tag = banner.targetTagId.replace(
              '{category_url_id}',
              banner.tagCategoryUrlId,
            );
          }
        } else {
          banner.tag = banner.targetTagId;
        }

        if (banner.visibilityTags && banner.visibilityTags.length >= 1) {
          if (typeof banner.visibilityTags !== 'string') {
            banner.visibilityTags = JSON.stringify(banner.visibilityTags);
          }
        } else {
          banner.visibilityTags = null;
        }

        banner.startDate = timezoneOffsetIn(banner.startDate);
        banner.endDate = timezoneOffsetIn(banner.endDate);

        const verifyFlashCampaign =
          banner.flashCampaignIds && banner.flashCampaignIds.length > 0;

        if (!verifyFlashCampaign) {
          banner.flashCampaignIds = null;
        } else if (typeof banner.flashCampaignIds !== 'string') {
          banner.flashCampaignIds = JSON.stringify(banner.flashCampaignIds);
        }

        if (banner._id && banner._id !== null) {
          await BannerService.saveBanner(banner);
        } else {
          const result = await BannerService.createBanner(banner);
          newBanner = result;

          newBanner.offerUrlId = banner.offerUrlId;
          newBanner.brandUrlId = banner.brandUrlId;
          newBanner.categoryUrlId = banner.categoryUrlId;
        }

        const pps: any[] = [...banners];
        const pp: any = { ...banners };
        if (banner._id) {
          const index = findIndexById(banner._id);

          pps[index] = pp;
          toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Banner Updated',
            life: 3000,
          });
        } else {
          pps.push(pp);
          toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Banner Created',
            life: 3000,
          });
        }

        // if is not a new asset, close the edition dialog
        if (!isNewAsset) {
          setBannerDialog(false);
          getBanners();
          return;
        }

        // if it is a new asset, keep it open edit dialog to upload the images
        editBanner(newBanner);
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

  return (
    <div className="p-grid crud-demo">
      <div className="p-col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar className="p-mb-4 p-toolbar" left={leftToolbarTemplate} />

          <DataTable
            ref={dt}
            value={banners}
            selection={selectedBanners}
            onSelectionChange={e => setSelectedBanners(e.value)}
            lazy
            onSort={onSort}
            onPage={onPage}
            onFilter={onFilter}
            // filters={filters}
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
            emptyMessage="No banners found."
            header={header}
            loading={loading}
            sortField={tableProps.sortField}
            sortOrder={tableProps.sortOrder}
            // scrollable
          >
            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
            <Column
              field="name"
              header="Name"
              sortable
              // body={nameBodyTemplate}
            />
            <Column
              field="title"
              header="Title"
              sortable
              // body={nameBodyTemplate}
            />
            <Column
              field="description"
              header="Description"
              sortable
              body={descriptionText}
            />
            <Column
              field="buttonLabel"
              header="Button label"
              sortable
              // body={nameBodyTemplate}
            />
            <Column
              field="startDate"
              header="Start Date"
              sortable
              body={startDateBodyTemplate}
            />

            <Column
              field="endDate"
              header="End date"
              sortable
              body={endDateBodyTemplate}
            />
            <Column
              field="active"
              header="Active"
              sortable
              body={activeBodyTemplate}
            />
            <Column
              field="coverImageUrl"
              header="Cover image url"
              sortable
              body={coverImageUrlTemplate}
            />
            <Column field="tag" header="Tag" sortable />
            <Column
              field="targetMpOfferId"
              body={targetType}
              header="Target Type"
              sortable
            />
            <Column
              field="targetName"
              body={targetName}
              header="Target Name"
              sortable
            />
            <Column body={actionBodyTemplate} />
          </DataTable>

          <Dialog
            visible={bannerDialog}
            style={{ width: '1000px' }}
            header="Banner Details"
            modal
            className="p-fluid"
            footer={bannertDialogFooter}
            onHide={hideDialog}
            blockScroll
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              onKeyPress={e => {
                e.key === constants.KEYPRESS.ENTER && e.preventDefault();
              }}
            >
              <div className="p-field p-col">
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
              <div className="p-formgrid p-grid">
                <div className="p-field p-col">
                  <label htmlFor="Start Date">Start Date</label>

                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Calendar
                        id={field.name}
                        {...field}
                        onChange={e => onInputChange(e, 'startDate')}
                        value={banner.startDate}
                        dateFormat="dd/mm/yy"
                        showTime
                        showIcon
                        showOnFocus={false}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
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
                        id={field.name}
                        {...field}
                        onChange={e => onInputChange(e, 'endDate')}
                        value={banner.endDate}
                        dateFormat="dd/mm/yy"
                        showIcon
                        showTime
                        showOnFocus={false}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage('endDate')}
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
                        onChange={e => onInputChange(e, 'trendingIndex')}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage('trendingIndex')}
                </div>
              </div>
              <div className="p-field">
                <label htmlFor="Title">Title</label>

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
              </div>
              <div className="p-field p-inputtextarea">
                <label htmlFor="Description">Description</label>

                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <InputTextarea
                      maxLength={500}
                      rows={5}
                      cols={30}
                      id={field.name}
                      {...field}
                      onChange={e => onInputChange(e, 'description')}
                      autoResize
                    />
                  )}
                />
              </div>
              <div className="p-field-checkbox p-col">
                <Checkbox
                  inputId="active"
                  name="active"
                  value={banner.active}
                  checked={banner.active}
                  onChange={e => onInputChange(e, 'active')}
                />
                <label htmlFor="Active">Active</label>
              </div>
              <div className="p-field">
                <label htmlFor="Button Label">Button Label</label>

                <Controller
                  name="buttonLabel"
                  control={control}
                  render={({ field }) => (
                    <InputText
                      id={field.name}
                      {...field}
                      onChange={e => onInputChange(e, 'buttonLabel')}
                    />
                  )}
                />
              </div>
              {(banner.targetTypeId === 'CONTAINED' ||
                !banner.targetTypeId) && (
                <div className="p-formgrid p-grid" style={{ margin: '0px' }}>
                  <div className="p-field col-offset-3 p-col p-col-6">
                    <Controller
                      name="coverImageUrl"
                      control={control}
                      render={({ field }) => (
                        <Upload
                          friendlyName="Banner Cover Image"
                          isActive={updateDialog}
                          setIsActive={setUpdateDialog}
                          asset="coverImageUrl"
                          setSelectedAsset={setSelectedUploadAsset}
                          src={field.value}
                          isUploadButtonDisabled={isNewAsset}
                          brandUrlId="offer.brandUrlId"
                          section="banner"
                          originalAssetObj={banner}
                          setAsset={setBanner}
                          changedProperty={selectedUploadAsset}
                          resetModal={reset}
                          visible={updateDialog}
                          labelSize={labelSize}
                        />
                      )}
                    />
                    {getFormErrorMessage('coverImageUrl')}
                  </div>
                </div>
              )}

              {banner.targetTypeId === 'FULLSIZE' && (
                <div
                  className="p-formgrid p-grid pb-3"
                  style={{ margin: '20px' }}
                >
                  <div className="p-field p-col">
                    <Controller
                      name="coverImageUrl"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Upload
                          friendlyName="Banner Cover Image"
                          isActive={updateDialog}
                          setIsActive={setUpdateDialog}
                          asset="coverImageUrl"
                          setSelectedAsset={setSelectedUploadAsset}
                          src={field.value}
                          isUploadButtonDisabled={isNewAsset}
                          brandUrlId="offer.brandUrlId"
                          section="brand"
                          originalAssetObj={banner}
                          setAsset={setBanner}
                          changedProperty={selectedUploadAsset}
                          resetModal={reset}
                          visible={updateDialog}
                          labelSize="1200 x 300"
                        />
                      )}
                    />
                    {getFormErrorMessage('coverImageUrl')}
                  </div>

                  <div className="p-field p-col">
                    <Controller
                      name="coverImageTabletUrl"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Upload
                          friendlyName="Banner Cover Image"
                          isActive={updateDialog}
                          setIsActive={setUpdateDialog}
                          asset="coverImageTabletUrl"
                          setSelectedAsset={setSelectedTabletUploadAsset}
                          src={field.value}
                          isUploadButtonDisabled={isNewAsset}
                          brandUrlId="offer.brandUrlId"
                          section="brand"
                          originalAssetObj={banner}
                          setAsset={setBanner}
                          changedProperty={selectedTabletUploadAsset}
                          resetModal={reset}
                          visible={updateDialog}
                          labelSize="768 x 300"
                        />
                      )}
                    />
                    {getFormErrorMessage('coverImageTabletUrl')}
                  </div>

                  <div className="p-field p-col">
                    <Controller
                      name="coverImageMobileUrl"
                      control={control}
                      render={({ field, fieldState }) => (
                        <Upload
                          friendlyName="Banner Cover Image"
                          isActive={updateDialog}
                          setIsActive={setUpdateDialog}
                          asset="coverImageMobileUrl"
                          setSelectedAsset={setSelectedMobileUploadAsset}
                          src={field.value}
                          isUploadButtonDisabled={isNewAsset}
                          brandUrlId="offer.brandUrlId"
                          section="brand"
                          originalAssetObj={banner}
                          setAsset={setBanner}
                          changedProperty={selectedMobileUploadAsset}
                          resetModal={reset}
                          visible={updateDialog}
                          labelSize="767 x 300"
                        />
                      )}
                    />
                    {getFormErrorMessage('coverImageMobileUrl')}
                  </div>
                </div>
              )}

              <div className="p-field">
                <label htmlFor="targetTypeId">Select Type</label>
                <Controller
                  name="targetTypeId"
                  control={control}
                  render={({ field, fieldState }) => (
                    <DropdownBannerType
                      id={field.name}
                      {...field}
                      value={field.value}
                      onChange={(e: any) => {
                        onInputChange(e, 'targetTypeId');
                      }}
                      className={classNames({
                        'p-invalid': fieldState.invalid,
                      })}
                      hideDropDown={hideDropdown}
                    />
                  )}
                />
              </div>
              <div className="p-field">
                <label htmlFor="targetTagId">Tags</label>
                <Controller
                  name="targetTagId"
                  control={control}
                  render={({ field, fieldState }) => (
                    <DropdownBannerTag
                      id={field.name}
                      {...field}
                      value={field.value}
                      onChange={(e: any, name: string) => {
                        setLabelSize(
                          tagsValueSize.find(f => f.name === e.value.name)
                            ?.value,
                        );
                        onInputChange(e, name);
                      }}
                      className={classNames({
                        'p-invalid': fieldState.invalid,
                      })}
                      hideDropDown={hideDropdown}
                    />
                  )}
                />
                {getFormErrorMessage('targetTagId')}
                {getFormErrorMessage('only-tag')}
              </div>
              <div className="p-field">
                <label htmlFor="visibilityTags">Visibility Tag</label>
                <Controller
                  name="visibilityTags"
                  control={control}
                  render={({ field }) => (
                    <DropdownVisibilityTag
                      id={field.name}
                      {...field}
                      value={field.value}
                      setSelectedVisibilityTagsIds={
                        setSelectedVisibilityTagsIds
                      }
                      onChange={(e: any) => {
                        field.onChange(e.target.value);
                        handleSelectedVisibilityTags(e.target.value);
                      }}
                    />
                  )}
                />
              </div>
              <Fieldset legend="Banner Target">
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
                  {getFormErrorMessage('only-offer-brand-category-custom')}
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
                  {getFormErrorMessage('only-offer-brand-category-custom')}
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
                  {getFormErrorMessage('only-offer-brand-category-custom')}
                </div>

                <div className="p-field">
                  <label htmlFor="flashCampaignIds">Flash Campaign</label>
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
                  {getFormErrorMessage('flashCampaignIds')}
                  {getFormErrorMessage('only-offer-brand-category-custom')}
                </div>

                <div className="p-field">
                  <label htmlFor="customUrlTarget">Custom Url</label>
                  <Controller
                    name="customUrlTarget"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        {...field}
                        onChange={e => onInputChange(e, 'customUrlTarget')}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage('customUrlTarget')}
                  {getFormErrorMessage('only-offer-brand-category-custom')}
                </div>
              </Fieldset>
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

              <span>
                There are changes not saved. Are you sure you want to quit?
              </span>
            </div>
          </Dialog>

          <Dialog
            visible={deleteBannertDialog}
            style={{ width: '1000px' }}
            header="Confirm"
            modal
            footer={deleteBannersDialogFooter}
            onHide={hideDeleteBannertDialog}
            blockScroll
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle p-mr-3"
                style={{ fontSize: '2rem' }}
              />
              {banner && (
                <span>
                  Are you sure you want to delete <b>{banner.name}</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteBannersDialog}
            style={{ width: '1000px' }}
            header="Confirm"
            modal
            footer={deleteBannerssDialogFooter}
            onHide={hideDeleteBannersDialog}
            blockScroll
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle p-mr-3"
                style={{ fontSize: '2rem' }}
              />
              {banner && (
                <span>
                  Are you sure you want to delete <b>{banner.name}</b>?
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
