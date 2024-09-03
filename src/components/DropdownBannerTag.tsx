import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import DropdownMpBrand from './DropdownMpBrand';
import DropdownMpCategories from './DropdownMpCategories';
import DropdownFlashCampaing from './DropdownFlashCampaign';

function DropdownTag(
  {
    id,
    idCategory,
    idBrand,
    idFlashCampaign,
    value,
    onChange,
    hideDropDown,
  }: any,
  ref: any,
) {
  const tags = [
    // Menu card banners
    { name: 'MENU_CATEGORY', id: 'MENU_CATEGORY' },
    { name: 'MENU_CATEGORY_FALLBACK', id: 'MENU_CATEGORY_FALLBACK' },
    { name: 'MENU_BRANDS', id: 'MENU_BRANDS' },
    { name: 'MENU_BRANDS_FALLBACK', id: 'MENU_BRANDS_FALLBACK' },

    // Home page banners
    { name: 'HP_SECTION1', id: 'HP_SECTION1' },
    { name: 'HP_SECTION2', id: 'HP_SECTION2' },

    // Brand page banners
    {
      name: 'BRAND_PAGE_SECTION1_{brand_url_id}',
      id: 'BRAND_PAGE_SECTION1_{brand_url_id}',
    },
    { name: 'BRAND_PAGE_SECTION2', id: 'BRAND_PAGE_SECTION2' },

    // All Brands page banners
    { name: 'ALL_BRAND_PAGE_SECTION1', id: 'ALL_BRAND_PAGE_SECTION1' },

    // All CATEGORY page banners
    { name: 'ALL_CATEGORY_PAGE_SECTION1', id: 'ALL_CATEGORY_PAGE_SECTION1' },

    // Top offers page banners
    { name: 'TOP_OFFER_PAGE_SECTION1', id: 'TOP_OFFER_PAGE_SECTION1' },

    // HERO banners
    { name: 'HERO_MAIN_PAGE', id: 'HERO_MAIN_PAGE' },
    {
      name: 'HERO_MAIN_PAGE_FALLBACK',
      id: 'HERO_MAIN_PAGE_FALLBACK',
    },
    { name: 'HERO_TOP_OFFER_PAGE', id: 'HERO_TOP_OFFER_PAGE' },
    {
      name: 'HERO_TOP_OFFER_PAGE_FALLBACK',
      id: 'HERO_TOP_OFFER_PAGE_FALLBACK',
    },
    { name: 'HERO_ALL_BRANDS_PAGE', id: 'HERO_ALL_BRANDS_PAGE' },
    {
      name: 'HERO_ALL_BRANDS_PAGE_FALLBACK',
      id: 'HERO_ALL_BRANDS_PAGE_FALLBACK',
    },
    { name: 'HERO_ALL_BLOGS_PAGE', id: 'HERO_ALL_BLOGS_PAGE' },
    {
      name: 'HERO_ALL_BLOGS_PAGE_FALLBACK',
      id: 'HERO_ALL_BLOGS_PAGE_FALLBACK',
    },
    {
      name: 'HERO_CATEGORY_PAGE_{category_url_id}',
      id: 'HERO_CATEGORY_PAGE_{category_url_id}',
    },
    { name: 'HERO_CATEGORY_PAGE_FALLBACK', id: 'HERO_CATEGORY_PAGE_FALLBACK' },

    // CONTACT_US banners
    { name: 'CONTACT_US_PAGE1', id: 'CONTACT_US_PAGE1' },
    { name: 'CONTACT_US_PAGE2', id: 'CONTACT_US_PAGE2' },

    // All The Edits page banners
    { name: 'THEEDIT_SECTION1', id: 'THEEDIT_SECTION1' },

    // FLASH CAMPAIN bottom banner
    { name: 'HERO_FLASH_CAMPAIGN', id: 'HERO_FLASH_CAMPAIGN' },
    {
      name: 'HERO_FLASH_CAMPAIGN_FALLBACK',
      id: 'HERO_FLASH_CAMPAIGN_FALLBACK',
    },
    {
      name: 'FLASH_CAMPAIGN_PAGE_SECTION1_{flash_campaign_url_id}',
      id: 'FLASH_CAMPAIGN_PAGE_SECTION1_{flash_campaign_url_id}',
    },

    // ABOUT_US banners
    { name: 'HERO_ABOUT_US', id: 'HERO_ABOUT_US' },
    { name: 'ABOUT_US_PAGE2', id: 'ABOUT_US_PAGE2' },

    // SIGN UP PAGE
    { name: 'SIGN_UP_STATIC_PAGE', id: 'SIGN_UP_STATIC_PAGE' },
  ];

  const [brandValue, setBrandId] = useState<string | null>();
  const [categoryValue, setCategoryId] = useState<string | null>();
  const [flashCampaignValue, setFlashCampaignId] = useState<string | null>();
  const [disabledCategory, setCategoryVisible] = useState(false);
  const [disabledBrand, setBrandVisible] = useState(false);
  const [disableFlashCampaign, setFlashCampaignVisible] = useState(false);
  const selectedTag = tags.find((tag: any) => tag.id === value);
  const placeHolderTag = value || 'Select the Tag';

  const onChangeTag = (e: any) => {
    setCategoryVisible(false);
    setBrandVisible(false);
    setFlashCampaignVisible(false);

    if (e.value !== undefined) {
      switch (e.value.id) {
        case 'BRAND_PAGE_SECTION1_{brand_url_id}':
          setBrandVisible(true);
          break;
        case 'HERO_CATEGORY_PAGE_{category_url_id}':
          setCategoryVisible(true);
          break;
        case 'FLASH_CAMPAIGN_PAGE_SECTION1_{flash_campaign_url_id}':
          setFlashCampaignVisible(true);
          break;
        default:
          setBrandId('');
          setCategoryId('');
          setFlashCampaignId('');
      }
    }

    onChange(e, 'targetTagId');
  };

  const onChangeGeneric = (e: any, name: string) => {
    switch (name) {
      case 'targetMpCategoryTagId':
        setCategoryId(e.target.value?._id);
        break;
      case 'targetMpBrandTagId':
        setBrandId(e.target.value?._id);
        break;
      case 'targetMpFlashCampaignTagId':
        setFlashCampaignId(e.target.value?._id);
        break;
      default:
    }

    onChange(e, name);
  };

  return (
    <div className="p-d-flex p-flex-column">
      <div className="p-formgrid p-grid">
        <>
          <div className="p-field p-col">
            <Dropdown
              ref={ref}
              filter
              showClear
              filterBy="name"
              id={id}
              value={selectedTag}
              onChange={onChangeTag}
              options={tags}
              optionLabel="name"
              placeholder={placeHolderTag}
            />
          </div>
          {disabledCategory && hideDropDown && selectedTag && (
            <div className="p-field p-col">
              <DropdownMpCategories
                id={idCategory}
                value={categoryValue}
                onChange={(e: any) => {
                  onChangeGeneric(e, 'targetMpCategoryTagId');
                }}
                singleSelect
              />
            </div>
          )}
          {disabledBrand && hideDropDown && (
            <div className="p-field p-col">
              <DropdownMpBrand
                id={idBrand}
                value={brandValue}
                onChange={(e: any) => {
                  onChangeGeneric(e, 'targetMpBrandTagId');
                }}
              />
            </div>
          )}
          {disableFlashCampaign && hideDropDown && (
            <div className="p-field p-col">
              <DropdownFlashCampaing
                id={idFlashCampaign}
                value={flashCampaignValue}
                onChange={(e: any) => {
                  onChangeGeneric(e, 'targetMpFlashCampaignTagId');
                }}
                singleSelect
              />
            </div>
          )}
        </>
      </div>
    </div>
  );
}

export default React.forwardRef(DropdownTag);
