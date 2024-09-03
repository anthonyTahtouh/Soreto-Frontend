/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import moment from 'moment';
import TrackingService from '../../../services/TrackingService';
import DropdownUTMCampaign from '../../../components/DropdownUTMCampaign';
import DropdownResponsible from '../../../components/DropdownResponsible';

const loader = (
  <div className="loader">
    <div className="loaderIcon" />
  </div>
);

interface TrackingInterface {
  hits: number;
  lifetimeUsers: number;
}

const valueFormattedUK = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
});

const { REACT_APP_LEGACY_ADM_URL } = process.env;

const Tracking = () => {
  const [trackingApiResult, setTrackingApiResult] = useState<any>();
  const [utmCampaign, setUtmCamping] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [actionId, setActionId] = useState('');
  const [ignoreLoggedUser, setIgnoreLoggedUser] = useState(true);
  const [selectedKPI, setSelectedKPI] = useState('');
  const [selectedUtm, setSelectedUtm] = useState('');
  const [selectedKPIBreakdown, setSelectedKPIBreakdown] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [selectedUTMCampaignsIds, setSelectedUTMCampaignsIds] = useState<
    string[]
  >([]);
  const [blog, setBlog] = useState<any>();

  const onSubmit = async () => {
    setLoading(true);
    const result = await TrackingService.getTrackingFlow(
      utmCampaign,
      actionId,
      ignoreLoggedUser,
      startDate,
      endDate,
      selectedUTMCampaignsIds,
    );

    setLoading(false);
    setSelectedKPI('');
    setTrackingApiResult(result.data);
  };

  const setSelectedStatsColumn = (e: any) => {
    const selKPI = e.currentTarget.getAttribute('data-sor-kpi');
    const selUtm = e.currentTarget.getAttribute('data-sor-utm');

    if (selKPI === selectedKPI && selUtm === selectedUtm) {
      setSelectedKPI('');

      return;
    }

    setSelectedKPI(selKPI);

    setSelectedUtm(selUtm);

    setSelectedKPIBreakdown(
      JSON.parse(e.currentTarget.getAttribute('data-sor-kpi-breakdown')),
    );
  };

  const selectedKPIColumnClasses = (
    kpiColumn: string,
    iutmCampaign: string,
  ) => {
    return `left p-d-flex p-flex-column cursor-pointer ${
      selectedKPI === kpiColumn && selectedUtm === iutmCampaign
        ? 'bg-orange-200'
        : ''
    }`;
  };

  const onInputChange = (e: any, name: string) => {
    if (name === 'startDate') {
      setStartDate(e.target.value);
    } else {
      setEndDate(e.target.value);
    }

    return null;
  };

  const handleSelectedUTMCampaigns = (arrayOfUTMCampaigns: any[]) => {
    if (arrayOfUTMCampaigns && arrayOfUTMCampaigns.length) {
      const arrayOfCategoryIds = arrayOfUTMCampaigns.map(selected => {
        return selected;
      });
      return setSelectedUTMCampaignsIds(arrayOfCategoryIds);
    }
    return setSelectedUTMCampaignsIds([]);
  };

  return (
    <div>
      <div className="card p-fluid">
        <div className="formgrid grid">
          <div className="field col">
            <DropdownResponsible
              id="utmCampaign"
              value={blog}
              singleSelect
              onChange={(e: any) => {
                setBlog(e.target.value);
              }}
            />
          </div>
          <div className="field col">
            <label htmlFor="orderPostRewadClient">UTM Campaign</label>
            <DropdownUTMCampaign
              id="utmCampaign"
              value={selectedUTMCampaignsIds}
              setSelectedCategoriesIds={setSelectedUTMCampaignsIds}
              onChange={(e: any) => {
                handleSelectedUTMCampaigns(e.target.value);
              }}
            />
          </div>
          <div className="field col">
            <label htmlFor="orderPostRewadClient">UTM_Campaign...</label>
            <InputText
              value={utmCampaign}
              type="search"
              placeholder="UTM_Campaign..."
              className="w-full"
              onChange={e => setUtmCamping(e.target.value)}
            />
          </div>
        </div>
        <div className="formgrid grid">
          <div className="field col-3">
            <label htmlFor="publishedDate">Start Date</label>
            <Calendar
              dateFormat="dd/mm/yy"
              id="startDate"
              value={startDate}
              onChange={e => onInputChange(e, 'startDate')}
              showOnFocus={false}
              showIcon
              showTime
              showSeconds
            />
          </div>
          <div className="field col-3">
            <label htmlFor="publishedDate">End Date</label>
            <Calendar
              dateFormat="dd/mm/yy"
              id="endDate"
              value={endDate}
              onChange={e => onInputChange(e, 'endDate')}
              showOnFocus={false}
              showIcon
              showTime
              showSeconds
            />
          </div>
        </div>
        <div className="field col-2">
          <Button label="Search" type="submit" onClick={onSubmit} />
        </div>
      </div>

      {isLoading ? loader : !trackingApiResult && <div className="noResults" />}

      {trackingApiResult &&
        !isLoading &&
        trackingApiResult.map((cp: any) => (
          <div className="p-grid dashboard">
            {/* TESTE CARD SEM COR E COM DIVISÃO */}
            <div className="p-col-12 p-md-12">
              <div className="card widget-social">
                <div className="p-d-flex p-jc-between p-ai-center p-p-3">
                  <div className="info p-d-flex p-flex-column">
                    <span className="value">{cp.utm_campaign}</span>
                  </div>
                  <div className="info p-d-flex p-flex-column">
                    <span className="value">
                      <a
                        href={`${REACT_APP_LEGACY_ADM_URL}/admin/reports/liveStatsMarketplace?utm_campaign=${
                          cp.utm_campaign
                        }&startDate=${moment(startDate).format(
                          'YYYY-MM-DD',
                        )}&endDate=${moment(endDate).format('YYYY-MM-DD')}`}
                        className="cursor-pointer"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <i
                          className="pi pi-external-link"
                          style={{ fontSize: '1em' }}
                        />
                      </a>
                    </span>
                  </div>
                </div>

                <div className="stats p-d-flex p-jc-between p-mt-1 bg-orange-400">
                  <div className="left p-d-flex p-flex-column ">
                    <span className="title">Clicks</span>
                    <span className="value p-mb-2">{cp.lands}</span>
                  </div>
                  <div className="left p-d-flex p-flex-column">
                    <span className="title">Page Views</span>
                    <span className="value p-mb-2">{cp.pageViews}</span>
                  </div>
                  <div className="left p-d-flex p-flex-column">
                    <span className="title">New Users</span>
                    <span className="value p-mb-2">{cp.lifetime}</span>
                  </div>
                  <div className="left p-d-flex p-flex-column">
                    <span className="title">Returing Users</span>
                    <span className="value p-mb-2">{cp.utm_campaign_swap}</span>
                  </div>
                  <div className="left p-d-flex p-flex-column">
                    <span className="title">Sign Up</span>
                    <span className="value p-mb-2">{cp.signUpCount}</span>
                  </div>
                  <div className="left p-d-flex p-flex-column">
                    <span className="title">Added to wishlist</span>
                    <span className="value p-mb-2">{cp.wishlistOffer}</span>
                  </div>
                  <div className="left p-d-flex p-flex-column">
                    <span className="title">Follow Brand</span>
                    <span className="value p-mb-2">{cp.followBrand}</span>
                  </div>

                  <div
                    className={selectedKPIColumnClasses(
                      'promotion_offer_view',
                      cp.utm_campaign,
                    )}
                    onClick={setSelectedStatsColumn}
                    data-sor-utm={cp.utm_campaign}
                    aria-hidden="true"
                    data-sor-kpi="promotion_offer_view"
                    data-sor-kpi-breakdown={JSON.stringify(
                      cp.simpleOfferView.offers,
                    )}
                  >
                    <span className="title">Promotion Offer View</span>
                    <span className="value p-mb-2">
                      {cp.simpleOfferView.total}
                    </span>
                    <i className="pi pi-chevron-down mt-auto" />
                  </div>

                  <div
                    className={selectedKPIColumnClasses(
                      'custom_offer_view',
                      cp.utm_campaign,
                    )}
                    onClick={setSelectedStatsColumn}
                    data-sor-utm={cp.utm_campaign}
                    aria-hidden="true"
                    data-sor-kpi="custom_offer_view"
                    data-sor-kpi-breakdown={JSON.stringify(
                      cp.customOfferView.offers,
                    )}
                  >
                    <span className="title">Custom Offer View</span>
                    <span className="value p-mb-2">
                      {cp.customOfferView.total}
                    </span>
                    <i className="pi pi-chevron-down mb-0" />
                  </div>

                  <div
                    className={selectedKPIColumnClasses(
                      'code_offer_view',
                      cp.utm_campaign,
                    )}
                    onClick={setSelectedStatsColumn}
                    data-sor-utm={cp.utm_campaign}
                    aria-hidden="true"
                    data-sor-kpi="code_offer_view"
                    data-sor-kpi-breakdown={JSON.stringify(
                      cp.codeOfferView.offers,
                    )}
                  >
                    <span className="title">Code Offer View</span>
                    <span className="value p-mb-2">
                      {cp.codeOfferView.total}
                    </span>
                    <i className="pi pi-chevron-down mt-auto" />
                  </div>

                  <div className="left p-d-flex p-flex-column">
                    <span className="title">Revealed offer code</span>
                    <span className="value p-mb-2">{cp.codeOfferRedeem}</span>
                  </div>

                  <div
                    className={selectedKPIColumnClasses(
                      'sharing_offer_view',
                      cp.utm_campaign,
                    )}
                    onClick={setSelectedStatsColumn}
                    data-sor-utm={cp.utm_campaign}
                    aria-hidden="true"
                    data-sor-kpi="sharing_offer_view"
                    data-sor-kpi-breakdown={JSON.stringify(
                      cp.sharingOfferView.offers,
                    )}
                  >
                    <span className="title">Sharing Offer View</span>
                    <span className="value p-mb-2">
                      {cp.sharingOfferView.total}
                    </span>
                    <i className="pi pi-chevron-down mt-auto" />
                  </div>

                  <div className="left p-d-flex p-flex-column">
                    <span className="title">Shared offer clicks</span>
                    <span className="value p-mb-2">{cp.offerShares}</span>
                  </div>
                  <div
                    className={selectedKPIColumnClasses(
                      'click_banner',
                      cp.utm_campaign,
                    )}
                    onClick={setSelectedStatsColumn}
                    data-sor-utm={cp.utm_campaign}
                    aria-hidden="true"
                    data-sor-kpi="click_banner"
                    data-sor-kpi-breakdown={JSON.stringify(
                      cp.clickBanner.banners,
                    )}
                  >
                    <span className="title">Banner Clicks</span>
                    <span className="value p-mb-2">{cp.clickBanner.total}</span>
                    <i className="pi pi-chevron-down mt-auto" />
                  </div>
                </div>

                {selectedKPI &&
                  cp.utm_campaign === selectedUtm &&
                  selectedKPIBreakdown &&
                  selectedKPIBreakdown.length > 0 && (
                    <div className="p-d-flex p-jc-between bg-orange-200">
                      <div className="left p-d-flex p-flex-column border-transparent">
                        <DataTable
                          value={selectedKPIBreakdown}
                          responsiveLayout="scroll"
                        >
                          <Column field="source" header="Offer Source" />
                          <Column field="hits" header="Count" />
                        </DataTable>
                      </div>
                      {/* <ul>
                        {selectedKPIBreakdown.map((e: any) => (
                          <li>
                            <span>{e.source}</span>:<span>{e.hits}</span>
                          </li>
                        ))}
                      </ul> */}
                    </div>
                  )}

                {selectedKPI &&
                  cp.utm_campaign === selectedUtm &&
                  selectedKPIBreakdown &&
                  selectedKPIBreakdown.length === 0 && (
                    <div className="p-d-flex p-jc-between bg-orange-200">
                      No details available
                    </div>
                  )}

                <div className="stats p-d-flex p-jc-between p-mt-1 bg-cyan-400">
                  <div className="left p-d-flex p-flex-column pt-7">
                    <span className="title">Share lightbox load</span>
                    <span className="value p-mb-2">{cp.lightboxLoad}</span>
                  </div>
                  <div className="left p-d-flex p-flex-column pt-7">
                    <span className="title">All unique shared links</span>
                    <span className="value p-mb-2">{cp.shares}</span>
                  </div>
                  {/* <div className="left p-d-flex p-flex-column pt-7">
                    <span className="title">Int. Views</span>
                    <span className="value p-mb-2">{cp.interstitialLoad}</span>
                  </div> */}
                  <div className="left p-d-flex p-flex-column p-0 pt-3">
                    <span className="title">Orders</span>
                    <span className="value p-mb-2">{cp.order}</span>
                    <div className="stats p-d-flex p-jc-between p-mt-1 bg-cyan-400">
                      <div className="left p-d-flex p-flex-column">
                        <span className="title">Revenue</span>
                        <span className="value p-mb-2">
                          {valueFormattedUK.format(cp.orderRevenue_GBP)}
                        </span>
                      </div>
                      <div className="right p-d-flex p-flex-column">
                        <span className="title">Commission</span>
                        <span className="value p-mb-2">
                          {valueFormattedUK.format(cp.orderCommission_GBP)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="right p-d-flex p-flex-column p-0 pt-3">
                    <span className="title">Ex. Orders</span>
                    <span className="value p-mb-2">{cp.externalOrder}</span>
                    <div className="stats p-d-flex p-jc-between p-mt-1 bg-cyan-400">
                      <div className="left p-d-flex p-flex-column">
                        <span className="title">Revenue</span>
                        <span className="value p-mb-2">
                          {valueFormattedUK.format(cp.externalOrderRevenue_GBP)}
                        </span>
                      </div>
                      <div className="right p-d-flex p-flex-column">
                        <span className="title">Commission</span>
                        <span className="value p-mb-2">
                          {valueFormattedUK.format(
                            cp.externalOrderCommission_GBP,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};
export default Tracking;
