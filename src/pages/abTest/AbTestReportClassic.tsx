/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import _ from 'lodash';
import { Panel } from 'primereact/panel';
import { DataTable } from 'primereact/datatable';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { Column } from 'primereact/column';
import { Chip } from 'primereact/chip';
import { OrderList } from 'primereact/orderlist';
import { Knob } from 'primereact/knob';
import moment from 'moment';
import { Timeline } from 'primereact/timeline';
import { Chart } from 'primereact/chart';
import { Toast } from 'primereact/toast';
import AbTestModel from '../../entities/DTO/abTest';
import AbTestService from '../../services/AbTestService';
import ReportService from '../../services/ReportService';
import { formatPercent } from './shared/formattingUtils';
import { getChartColor } from './shared/chartColorUtil';
import {
  calculateDifferences,
  handleStatsResults,
  reportBaseFields,
} from './shared/statsReportUtils';
import { getMiddleDay } from '../../helpers/dateFormatter';

const textColor = '#495057';
const textColorSecondary = '#6c757d';
const surfaceBorder = '#e9ecef';
const soretoPink = '#f53855';
const soretoGrey = '#334d5c';
const soretoGreen = '#46b29d';

const optionsBarChart = {
  maintainAspectRatio: false,
  aspectRatio: 0.6,
  plugins: {
    legend: {
      labels: {
        fontColor: textColor,
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: textColorSecondary,
        font: {
          weight: 500,
        },
      },
      grid: {
        display: false,
        drawBorder: false,
      },
    },
    y: {
      ticks: {
        color: textColorSecondary,
      },
      grid: {
        color: surfaceBorder,
        drawBorder: false,
      },
    },
  },
};

const AbTestReportClassic = () => {
  const [loading, setLoading] = useState(true);
  const [loadingReportData, setLoadingReportData] = useState(true);
  const toast = useRef<Toast>(null);

  /**
   * Share context chart data
   */
  const [
    shareContextLineComparisonChartData,
    setShareContextLineComparisonChartData,
  ] = useState({});
  const [
    shareContextSocialPlatformChartData,
    setShareContextSocialPlatformChartData,
  ] = useState({});
  const [shareContextDeviceChartData, setShareContextDeviceChartData] =
    useState({});

  /**
   * Models
   */
  const [abTest, setAbTest] = useState<AbTestModel>();
  const [abTestReportClassic, setAbTestReportClassic] = useState<any>();
  const [abTestReportTotal, setAbTestReportTotal] = useState<any>();

  /**
   * Get the abTestId from the URL
   */
  const { abTestId } = useParams();
  const ownersValue = abTest?.responsibleUsers.map(
    (item: any) => `${item.first_name} ${item.last_name}`,
  );
  const events: any[] = getEvents(abTest);

  /**
   * Get AbTest from the API
   */
  const getAbTest = async () => {
    if (!abTestId) {
      return;
    }

    // set state as loading
    setLoading(true);
    setLoadingReportData(true);

    try {
      // fetch data from api
      const data: any = await AbTestService.getAbTest(abTestId);
      setAbTest(data);
    } catch (error: any) {
      toast?.current?.show({
        severity: 'error',
        summary: 'Error',
        detail:
          error?.status === 404
            ? 'AB Test Not Found'
            : 'An error occurred while fetching the data',
        life: 15000,
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get AbTest report from the API
   */
  const getAbTestReportClassic = async () => {
    if (!abTest?._id) {
      return;
    }

    // validations before taking the report
    if (!abTest.campaignVersions || abTest.campaignVersions.length === 0) {
      toast?.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'There is no campaign version attached to this test',
        life: 15000,
      });

      setLoadingReportData(false);

      return;
    }
    if (abTest.status === 'TO_START') {
      toast?.current?.show({
        severity: 'info',
        summary: 'Future',
        detail: 'This test has not started yet',
        life: 15000,
      });

      setLoadingReportData(false);

      return;
    }

    try {
      // pick the campaignVersionIds from the abTest object
      const campaignVersionIds =
        abTest.campaignVersions.map(
          (campaignVersion: any) => campaignVersion.campaignVersionId,
        ) || [];

      const baseSearch = {
        ...{
          groupBy: 'daily',
          groupFields: ['campaignVersion'],
          $date_$gte: abTest.startDate,
          $date_$lte: abTest.endDate,
        },
        ...(campaignVersionIds && { campaignVersionIds }),
      };

      // fetch data from api
      const reportClassicData: any = await ReportService.getStatsV2(baseSearch);
      const resultsByCampaignVersion: any = [];
      let count = 0;

      if (
        reportClassicData.campaignVersion &&
        reportClassicData.campaignVersion.length > 0
      ) {
        for (const result of reportClassicData.campaignVersion) {
          resultsByCampaignVersion.push(handleStatsResults(result, count));
          count += 1;
        }
      }

      if (
        resultsByCampaignVersion.length === 0 ||
        resultsByCampaignVersion.length >= 3
      ) {
        // When more than 2 campaigns are selected, the comparison is not possible
        setAbTestReportTotal([]);
      } else {
        setAbTestReportTotal(
          calculateDifferences(
            resultsByCampaignVersion[1] || [],
            resultsByCampaignVersion[0] || [],
          ),
        );
      }

      const labelCharts = reportClassicData.dayGroup.map((item: any) =>
        moment(item.name, 'YYYY-MM-DD').format('DD-MM-YYYY'),
      );

      setShareContextLineComparisonChartData(
        buildShareContextLineComparisonChart(reportClassicData, labelCharts),
      );

      setShareContextSocialPlatformChartData(
        buildShareContextChartVertical(reportClassicData, 'aggShareChannel'),
      );

      setShareContextDeviceChartData(
        buildShareContextChartVertical(reportClassicData, 'aggShareDevice'),
      );

      setAbTestReportClassic(resultsByCampaignVersion);
    } catch (error: any) {
      toast?.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'An error occurred while fetching the data',
        life: 3000,
      });
    } finally {
      setLoadingReportData(false);
    }
  };

  useEffect(() => {
    getAbTest();
  }, [abTestId]);

  useEffect(() => {
    getAbTestReportClassic();
  }, [abTest]);

  /**
   * Summary footer table
   */
  const summaryFooterTable = (
    <ColumnGroup>
      <Row>
        <Column
          key="total"
          footer="A/B"
          style={{ color: soretoPink, height: '60px' }}
          colSpan={1}
        />
        {Object.keys(reportBaseFields).map(
          key =>
            key !== 'name' &&
            key !== 'id' && (
              <Column
                key={key}
                field={key}
                style={{
                  color: returnPositiveOrNegative(
                    abTestReportTotal?.[key] || 0,
                  ),
                }}
                footer={
                  abTestReportTotal && abTestReportTotal?.[key]
                    ? formatPercent(abTestReportTotal?.[key] / 100)
                    : '-'
                }
              />
            ),
        )}
      </Row>
    </ColumnGroup>
  );

  /**
   * Summary table
   */
  const summaryTable = (
    <DataTable
      value={abTestReportClassic}
      paginator={false}
      className="p-datatable-gridlines"
      showGridlines
      rows={10}
      dataKey="id"
      loading={loadingReportData}
      responsiveLayout="scroll"
      footerColumnGroup={summaryFooterTable}
      emptyMessage="No records found."
    >
      <Column field="name" header="Name" style={{ minWidth: '15rem' }} />
      {Object.keys(reportBaseFields).map(key => (
        <Column
          key={key}
          field={key}
          header={reportBaseFields[key].header}
          style={{ minWidth: '10rem' }}
          body={rowData => reportBaseFields[key].formatter(rowData[key])}
        />
      ))}
    </DataTable>
  );

  return (
    <>
      <div className="grid nested-grid">
        <Toast ref={toast} />
        {/* First column with two cards vertical */}
        <div className="col-7">
          <div className="grid">
            {/* Details card from the first column */}
            <div className="col-12">
              <Card className="p-2" style={{ height: '100%' }}>
                {loading ? (
                  // Render loading indicator
                  <div
                    className="p-d-flex p-jc-center p-ai-center"
                    style={{ height: '200px' }}
                  >
                    <ProgressSpinner />
                  </div>
                ) : (
                  <div className="col-12">
                    <h5>Details</h5>
                    <div className="grid grid-nogutter">
                      <div className="col-9">
                        <p>
                          The Test Suite - <b>{abTest?.name}</b> is currently in
                          status:{'  '}
                          {getStatus(abTest?.status || '')}
                        </p>
                        <div className="my-3">
                          <b>Name: </b>
                          <span className="vertical-align-middle m-0">
                            {abTest?.name}
                          </span>
                        </div>
                        <div className="my-3">
                          <b>Description: </b>
                          <span className="vertical-align-middle m-0">
                            {abTest?.description}
                          </span>
                        </div>
                        <div className="my-3">
                          <b>Test period: </b>
                          <span className="vertical-align-middle m-0">
                            {moment(abTest?.startDate).format('DD-MM-YYYY')}
                            {' to '}
                            {moment(abTest?.endDate).format('DD-MM-YYYY')}
                          </span>
                        </div>
                        <div className="my-3">
                          <b>Test type: </b>
                          <span className="vertical-align-middle m-0">
                            {abTest?.type}
                          </span>
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="flex justify-content-center">
                          <Knob
                            value={getTestCompletude(abTest)}
                            readOnly
                            valueTemplate="{value}%"
                            size={130}
                            valueColor="#26d151"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Owner card from the first column */}
            <div className="col-12 mb-2">
              <Card className="p-2" style={{ height: '100%' }}>
                {loading ? (
                  // Render loading indicator
                  <div
                    className="p-d-flex p-jc-center p-ai-center"
                    style={{ height: '200px' }}
                  >
                    <ProgressSpinner />
                  </div>
                ) : (
                  <div className="col-12">
                    <h5>Owner</h5>
                    <p>
                      The owners of the test will be notified by the alert
                      system at the following events
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {ownersValue &&
                        ownersValue.map(name => (
                          <Chip key={name} label={name} icon="pi pi-user" />
                        ))}
                    </div>
                    <div className="p-5">
                      <Timeline
                        value={events}
                        align="left"
                        layout="horizontal"
                        className="customized-timeline"
                        marker={customizedMarker}
                        content={customizedContent}
                      />
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>

        {/* Second column */}
        <div className="col-5 mb-2">
          <Card className="p-2" style={{ height: '100%' }}>
            <div className="col-12">
              <h5>A/B settings</h5>
              <p>These are the campaigns that will be compared in the test</p>
              <OrderList
                className="p-orderlist-responsive"
                dataKey="id"
                value={abTestReportClassic}
                itemTemplate={item => <div>{item.name}</div>}
                onChange={e => {
                  setAbTestReportClassic(e.value);
                  if (e.value.length === 0 || e.value.length >= 3) return;
                  setAbTestReportTotal(
                    calculateDifferences(e.value[1], e.value[0]),
                  );
                }}
              />
            </div>
          </Card>
        </div>

        {/* KPI section */}
        <div className="col-12">
          <Card className="p-2" style={{ height: '100%' }}>
            <div className="col-12">
              <h5>KPI Overview</h5>
              <p>The summary comparison values among the KPIs</p>
              <div>{summaryTable}</div>
            </div>
          </Card>
        </div>

        {/* Share data section */}
        <div className="col-12">
          <Card className="p-2" style={{ height: '100%' }}>
            <div className="grid col-12">
              <div className="col-12">
                <h5>Enrolment context</h5>
                <p className="m-0">Share performance comparison by day</p>
                <br />
                <div className="flex flex-column gap-3 border-round-md border-1 surface-border p-4">
                  {loadingReportData ? (
                    // Render loading indicator
                    <div
                      className="p-d-flex p-jc-center p-ai-center"
                      style={{ minHeight: '400px' }}
                    >
                      <ProgressSpinner />
                    </div>
                  ) : (
                    <Chart
                      type="line"
                      data={shareContextLineComparisonChartData}
                      options={{
                        maintainAspectRatio: false,
                        aspectRatio: 0.6,
                        plugins: {
                          legend: {
                            labels: {
                              color: soretoGrey,
                            },
                          },
                        },
                        scales: {
                          x: {
                            ticks: {
                              color: soretoGrey,
                              maxRotation: 65,
                              minRotation: 65,
                            },
                          },
                          y: {
                            ticks: {
                              color: soretoGrey,
                              stepSize: 1,
                              precision: 0,
                            },
                          },
                        },
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="col-12 md:col-6 xl:col-6">
                <div className="flex flex-column gap-3 border-round-md border-1 h-full surface-border p-4">
                  <div className="flex justify-content-between align-items-center">
                    <div className="flex align-items-center gap-3">
                      <div>
                        <i className="pi pi-chart-bar text-primary text-3xl" />
                      </div>
                      <div className="flex flex-column justify-content-between gap-1">
                        <span className="font-bold text-900">
                          Enrolment by platform
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-column gap-2 h-full relative">
                    {loadingReportData ? (
                      // Render loading indicator
                      <div
                        className="p-d-flex p-jc-center p-ai-center"
                        style={{ minHeight: '400px' }}
                      >
                        <ProgressSpinner />
                      </div>
                    ) : (
                      <Chart
                        type="bar"
                        data={shareContextSocialPlatformChartData}
                        options={optionsBarChart}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="col-12 md:col-6 xl:col-6">
                <div className="flex flex-column gap-3 border-round-md border-1 h-full surface-border p-4">
                  <div className="flex justify-content-between align-items-center">
                    <div className="flex align-items-center gap-3">
                      <div>
                        <i className="pi pi-chart-bar text-primary text-3xl" />
                      </div>
                      <div className="flex flex-column justify-content-between gap-1">
                        <span className="font-bold text-900">
                          Enrolment by device
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-column gap-2 h-full relative">
                    {loadingReportData ? (
                      // Render loading indicator
                      <div
                        className="p-d-flex p-jc-center p-ai-center"
                        style={{ minHeight: '400px' }}
                      >
                        <ProgressSpinner />
                      </div>
                    ) : (
                      <Chart
                        type="bar"
                        data={shareContextDeviceChartData}
                        options={optionsBarChart}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

const returnPositiveOrNegative = (value: number) => {
  if (value < 0) {
    return soretoPink;
  }

  return soretoGreen;
};

const getTestCompletude = (abTest: any) => {
  if (!abTest?.startDate || !abTest?.endDate) {
    return 0;
  }

  const startDate = moment(abTest?.startDate).utc();
  const endDate = moment(abTest?.endDate).utc();
  const currentDate = moment().utc();

  const totalHours = endDate.diff(startDate, 'hours');
  const hoursLeft = endDate.diff(currentDate, 'hours');
  const hoursPast = totalHours - hoursLeft;

  const completude = (hoursPast / totalHours) * 100;

  if (endDate.isBefore(currentDate)) {
    return 100;
  }
  if (startDate.isAfter(currentDate)) {
    return 0;
  }

  return Math.round(completude);
};

const customizedMarker = (item: any) => {
  return (
    <span className="flex w-2rem h-2rem align-items-center justify-content-center border-circle z-1 shadow-1">
      <i className={item.icon} />
    </span>
  );
};

const customizedContent = (item: any) => {
  return (
    <>
      <div>
        <i>
          <small>{item.date}</small>
        </i>
      </div>
      <div>
        <small>{item.status}</small>
      </div>
    </>
  );
};

const buildShareContextLineComparisonChart = (
  data: any,
  labelCharts: any = [],
): any => {
  if (data.campaignVersion.length <= 0) {
    return;
  }

  const listCharts = [];
  let count = 0;
  for (const campaignVersion of data.campaignVersion) {
    listCharts.push({
      label: campaignVersion.name,
      data: data.dayGroup
        .map((dayGroup: any) => ({
          ...dayGroup,
          campaignVersion: dayGroup.campaignVersion.filter(
            (campaign: any) => campaign.name === campaignVersion.name,
          ),
        }))
        .map((d: any) => {
          if (!d.campaignVersion || d.campaignVersion.length === 0) {
            return 0;
          }
          return d.campaignVersion[0].shareCountTotal || 0;
        }),
      fill: false,
      backgroundColor: getChartColor(count),
      borderColor: getChartColor(count),
      tension: 0.4,
    });

    count += 1;
  }

  const chartDataSet = {
    labels: labelCharts,
    datasets: listCharts,
  };

  return chartDataSet;
};

const buildShareContextChartVertical = (data: any, nameAgg: any): any => {
  if (data.campaignVersion) {
    let diffSocialPlatform: any[] = [];

    for (const campaignVersion of data.campaignVersion) {
      if (campaignVersion[nameAgg]) {
        diffSocialPlatform = diffSocialPlatform.concat(
          campaignVersion[nameAgg].map((item: any) => item.name),
        );
      }
    }

    diffSocialPlatform = _.uniq(diffSocialPlatform);

    const listCharts = [];
    let count = 0;
    for (const campaignVersion of data.campaignVersion) {
      const values: any = [];
      diffSocialPlatform.forEach((item: any) => {
        if (!campaignVersion[nameAgg]) {
          values.push(0);
          return;
        }
        const index = campaignVersion[nameAgg].findIndex(
          (channel: any) => channel.name === item,
        );

        if (index !== -1) {
          values.push(campaignVersion[nameAgg][index].shareCountTotal);
        } else {
          values.push(0);
        }
      });

      listCharts.push({
        label: campaignVersion.name,
        data: values,
        fill: false,
        backgroundColor: getChartColor(count),
        borderColor: getChartColor(count),
        tension: 0.4,
      });

      count += 1;
    }

    const dataPlatform = {
      labels: diffSocialPlatform,
      datasets: listCharts,
    };

    return dataPlatform;
  }
};

const getStatus = (status: string): any => {
  const statusMap: any = {
    IN_PROGRESS: (
      <Chip
        label="Running"
        icon="pi pi-spin pi-spinner"
        style={{ backgroundColor: '#3979f0', color: 'white' }}
      />
    ),
    TO_START: <Chip label="Future" icon="pi pi-calendar-times" />,
    FAILED: (
      <Chip
        label="Failed"
        icon="pi pi-thumbs-down"
        style={{ backgroundColor: 'red', color: 'white' }}
      />
    ),
    DONE: (
      <Chip
        label="Completed"
        icon="pi pi-check-circle"
        style={{ backgroundColor: 'green', color: 'white' }}
      />
    ),
  };

  return statusMap[status.toUpperCase()] || <Chip label={status} />;
};

const getEvents = (abTest?: AbTestModel) => {
  if (!abTest) {
    return [];
  }

  return [
    {
      status: 'Created',
      date: moment.utc(abTest.createdAt).format('DD/MM/YYYY'),
      icon: 'pi pi-calendar-times',
    },
    {
      status: 'Start alert',
      date: moment.utc(abTest.startDate).format('DD/MM/YYYY'),
      icon: 'pi pi-envelope',
    },
    {
      status: 'Processing alert',
      date: getMiddleDay(abTest.startDate, abTest.endDate).format('DD/MM/YYYY'),
      icon: 'pi pi-envelope',
    },
    {
      status: 'Finished',
      date: moment.utc(abTest.endDate).format('DD/MM/YYYY'),
      icon: 'pi pi-envelope',
    },
  ];
};

export default AbTestReportClassic;
