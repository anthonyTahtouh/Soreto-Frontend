/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useState, useEffect, memo } from 'react';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { ColorPicker } from 'primereact/colorpicker';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { classNames } from 'primereact/utils';
import { ProgressSpinner } from 'primereact/progressspinner';
import DropdownClients from '../../components/DropdownClients';
import DropdownCountries from '../../components/DropdownCountries';
import DropdownMpCategories from '../../components/DropdownMpCategories';
import WizardService from '../../services/WizardService';
import ClientService from '../../services/ClientService';
import WizardSchemaValidation from './WizardSchemaValidation';
import WizardPayloadBuilder from './WizardPayloadBuilder';
import constants from '../../shared/constants';

function Index() {
  const [templateCampaigns, setTemplateCampaigns] = useState([]);
  const [isLoadingClient, setIsLoadingClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useRef<any>(null);

  const emptyFormObject = {
    selectedClient: undefined,
    clientName: '',
    clientCustomIdentifier: '',
    clientSite: '',
    clientSiteShortUrl: '',
    clientProductUrl: '',
    clientAbout: '',
    campaignDescription: '',
    campaignVersionName: '',
    selectedCountry: undefined,
    sharerRewardName: '',
    sharerRewardLiteralDescription: '',
    sharerRewardValueAmount: '',
    sharerRewardCode: '',
    friendRewardName: '',
    friendRewardLiteralDescription: '',
    friendRewardValueAmount: '',
    friendRewardCode: '',
    brandShortName: '',
    brandDescription: '',
    brandUrlId: '',
    offerType: 'SIMPLE',
    offerCardDescription: '',
    condition: '',
    offerUrlId: '',
    actionButtonBackgroundColor: '0B2D61',
    actionButtonTextColor: '1B2D99',
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    getValues,
    setValue,
    trigger,
    resetField,
  } = useForm({
    resolver: yupResolver(WizardSchemaValidation.schemaValidation()),
  });

  const onSubmit = () => {
    const formValues = getValues();
    setIsSubmitting(true);
    WizardService.submit(
      formValues.selectedTemplateCampaign.clientCustomIdentifier,
      formValues.selectedTemplateCampaign.description,
      WizardPayloadBuilder.buildPayload(formValues),
    )
      .then(() => {
        toast.current.show({
          severity: 'success',
          summary: 'Success!',
          detail: 'Setup completed with success!',
          life: 10000,
        });

        reset(emptyFormObject, {
          keepValues: false,
        });
        setValue('selectedClient', null);
        resetField('selectedClient');
        setValue('selectedCountry', null);
        resetField('selectedCountry');
        resetField('brandCategories');
        resetField('offerCategories');
        setValue('brandCategories', []);
        setValue('offerCategories', []);
      })
      .catch(e => {
        if (e.response?.data?.code === 400) {
          toast.current.show(
            e.response.data.fieldValidation.map((error: any) => {
              return {
                severity: 'error',
                summary: error.field,
                detail: error.message,
                life: 6000,
              };
            }),
          );
        } else {
          toast.current.show({
            severity: 'error',
            summary: 'error',
            detail: e.response?.data?.message,
            life: 6000,
          });
        }
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  useEffect(() => {
    WizardService.getTemplateCampaigns().then(response => {
      setTemplateCampaigns(response.data.page);
    });
    setValue('actionButtonBackgroundColor', '0B2D61');
    setValue('actionButtonTextColor', '1B2D99');
    setValue('offerType', 'SIMPLE');
  }, []);

  const getFormErrorMessage = (
    name: string,
    objectProp: string | undefined = undefined,
  ) => {
    if (objectProp) {
      let message = '';

      if (errors[name]) {
        const error: any = errors[name];

        message = error[objectProp]?.message;
      }
      return <small className="p-error">{message}</small>;
    }
    return (
      errors[name] && <small className="p-error">{errors[name]?.message}</small>
    );
  };

  return (
    <div>
      <Toast ref={toast} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyPress={e => {
          e.key === constants.KEYPRESS.ENTER && e.preventDefault();
        }}
      >
        <div className="p-grid ">
          {/* Template Selection */}
          <div className="p-col-12 p-md-12">
            <div className="card p-fluid">
              <h4>Template Selection</h4>
              {/* Template Campaign */}
              <div className="p-fluid p-formgrid p-grid">
                <div className="p-field p-col-12 p-md-12">
                  <label
                    className="required"
                    htmlFor="selectedTemplateCampaign"
                  >
                    Template Campaign
                  </label>
                  <Controller
                    name="selectedTemplateCampaign"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        id={field.name}
                        {...field}
                        value={field.value}
                        onChange={e => field.onChange(e.value)}
                        options={templateCampaigns}
                        optionLabel="description"
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                        placeholder="Select One"
                      />
                    )}
                  />
                  {getFormErrorMessage('selectedTemplateCampaign', '_id')}
                </div>
              </div>
            </div>
          </div>
          {/* Client */}
          <div className="p-col-12 p-md-6">
            <div className="card p-fluid">
              <div
                className="p-formgroup-inline"
                style={{ marginBottom: '-15px' }}
              >
                <h4>
                  <div className="p-field">Client</div>
                </h4>
                <div className="p-field">
                  {isLoadingClient && (
                    <ProgressSpinner
                      style={{ width: '20px', height: '20px' }}
                    />
                  )}
                </div>
              </div>
              <div className="p-fluid p-formgrid p-grid">
                <div className="p-field p-col-12 p-md-6">
                  <label className="required" htmlFor="selectedClient">
                    Client
                  </label>
                  <Controller
                    name="selectedClient"
                    control={control}
                    render={({ field, fieldState }) => (
                      <DropdownClients
                        id={field.name}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                        value={field.value}
                        onChange={(e: any) => {
                          field.onChange(e.value);
                          setIsLoadingClient(true);
                          if (!e.value || !e.value._id) {
                            setIsLoadingClient(false);
                            setValue('clientName', '');
                            setValue('clientCustomIdentifier', '');
                            setValue('clientSite', '');
                          } else {
                            ClientService.getClient(e.value._id).then(
                              (response: any) => {
                                const databaseClient = response.data;
                                setValue('clientName', databaseClient.name);
                                setValue(
                                  'clientCustomIdentifier',
                                  databaseClient.customIdentifier,
                                );
                                setValue(
                                  'clientSite',
                                  databaseClient.referer[0],
                                );
                                trigger([
                                  'clientName',
                                  'clientCustomIdentifier',
                                  'clientSite',
                                ]);
                                setIsLoadingClient(false);
                              },
                            );
                          }
                        }}
                      />
                    )}
                  />
                  {getFormErrorMessage('selectedClient', '_id')}
                </div>
                <div className="p-field p-col-12 p-md-6">
                  <label className="required" htmlFor="clientName">
                    Name
                  </label>
                  <Controller
                    name="clientName"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        {...field}
                        value={field.value}
                        onChange={e => field.onChange(e.target.value)}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                        type="text"
                      />
                    )}
                  />
                  {getFormErrorMessage('clientName')}
                </div>
                <div className="p-field p-col-12 p-md-6">
                  <label className="required" htmlFor="clientCustomIdentifier">
                    Custom Identifier
                  </label>
                  <Controller
                    name="clientCustomIdentifier"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        {...field}
                        value={field.value}
                        onChange={e => field.onChange(e.target.value)}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                        type="text"
                      />
                    )}
                  />
                  {getFormErrorMessage('clientCustomIdentifier')}
                </div>

                <div className="p-field p-col-12 p-md-6">
                  <label className="required" htmlFor="clientSite">
                    Site
                  </label>
                  <Controller
                    name="clientSite"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        {...field}
                        value={field.value}
                        onChange={e => field.onChange(e.target.value)}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                        type="text"
                      />
                    )}
                  />
                  {getFormErrorMessage('clientSite')}
                </div>

                <div className="p-field p-col-12 p-md-6">
                  <label className="required" htmlFor="clientSiteShortUrl">
                    Site Short URL
                  </label>
                  <Controller
                    name="clientSiteShortUrl"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        {...field}
                        value={field.value}
                        onChange={e => field.onChange(e.target.value)}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                        type="text"
                      />
                    )}
                  />
                  {getFormErrorMessage('clientSiteShortUrl')}
                </div>

                <div className="p-field p-col-12 p-md-6">
                  <label className="required" htmlFor="clientProductUrl">
                    Product URL
                  </label>
                  <Controller
                    name="clientProductUrl"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        {...field}
                        value={field.value}
                        onChange={e => field.onChange(e.target.value)}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                        type="text"
                      />
                    )}
                  />
                  {getFormErrorMessage('clientProductUrl')}
                </div>
                <div className="p-field p-col-12 p-md-12">
                  <label className="required" htmlFor="clientAbout">
                    About
                  </label>
                  <Controller
                    name="clientAbout"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputTextarea
                        id={field.name}
                        {...field}
                        value={field.value}
                        onChange={e => field.onChange(e.target.value)}
                        rows={1}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage('clientAbout')}
                </div>
              </div>
            </div>
          </div>
          {/* Campaign */}

          <div className="p-col-12 p-md-6">
            <div className="card p-fluid">
              <h4>Campaign</h4>
              <div className="p-fluid p-formgrid p-grid">
                <div className="p-field p-col-12 p-md-6">
                  <label className="required" htmlFor="campaignDescription">
                    Description
                  </label>
                  <Controller
                    name="campaignDescription"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        {...field}
                        value={field.value}
                        onChange={e => field.onChange(e.target.value)}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                        type="text"
                      />
                    )}
                  />
                  {getFormErrorMessage('campaignDescription')}
                </div>
                <div className="p-field p-col-12 p-md-6">
                  <label className="required" htmlFor="selectedCountry">
                    Country
                  </label>
                  <Controller
                    name="selectedCountry"
                    control={control}
                    render={({ field, fieldState }) => (
                      <DropdownCountries
                        id={field.name}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                        value={field.value}
                        onChange={(e: any) => field.onChange(e.value)}
                      />
                    )}
                  />
                  {getFormErrorMessage('selectedCountry', '_id')}
                </div>
                <div className="p-field p-col-12 p-md-6">
                  <label className="required" htmlFor="campaignStartDate">
                    Start Date
                  </label>
                  <Controller
                    name="campaignStartDate"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Calendar
                        id={field.name}
                        {...field}
                        onChange={(e: any) => field.onChange(e.value)}
                        dateFormat="dd/mm/yy"
                        showIcon
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage('campaignStartDate')}
                </div>
                <div className="p-field p-col-12 p-md-6">
                  <label className="required" htmlFor="campaignExpiryDate">
                    Expiry
                  </label>
                  <Controller
                    name="campaignExpiryDate"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Calendar
                        id={field.name}
                        {...field}
                        onChange={(e: any) => field.onChange(e.value)}
                        dateFormat="dd/mm/yy"
                        showIcon
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage('campaignExpiryDate')}
                </div>
                <div className="p-field p-col-12 p-md-6">
                  <label
                    className="required"
                    htmlFor="actionButtonBackgroundColor"
                  >
                    Action Button Background Color
                  </label>
                  <Controller
                    name="actionButtonBackgroundColor"
                    control={control}
                    render={({ field, fieldState }) => (
                      <div style={{ display: 'flex' }}>
                        <InputText
                          id={field.name}
                          {...field}
                          value={field.value}
                          className={classNames({
                            'p-invalid': fieldState.invalid,
                          })}
                          defaultValue="0B2D61"
                          type="text"
                        />
                        <ColorPicker
                          style={{
                            marginTop: '6px',
                            width: '10px',
                            marginRight: '12px',
                          }}
                          id={field.name}
                          {...field}
                          onChange={(e: any) => {
                            field.onChange(e.value);
                          }}
                          value="0B2D61"
                          defaultValue="0B2D61"
                          className={classNames({
                            'p-invalid': fieldState.invalid,
                          })}
                        />
                      </div>
                    )}
                  />
                  {getFormErrorMessage('actionButtonBackgroundColor')}
                </div>
                <div className="p-field p-col-12 p-md-6">
                  <label className="required" htmlFor="actionButtonTextColor">
                    Action Button Text Color
                  </label>
                  <Controller
                    name="actionButtonTextColor"
                    control={control}
                    render={({ field, fieldState }) => (
                      <div style={{ display: 'flex' }}>
                        <InputText
                          id={field.name}
                          {...field}
                          value={field.value}
                          className={classNames({
                            'p-invalid': fieldState.invalid,
                          })}
                          defaultValue="1B2D99"
                          type="text"
                        />
                        <ColorPicker
                          style={{
                            marginTop: '6px',
                            width: '10px',
                            marginRight: '12px',
                          }}
                          id={field.name}
                          {...field}
                          onChange={(e: any) => {
                            field.onChange(e.value);
                          }}
                          value="1B2D99"
                          className={classNames({
                            'p-invalid': fieldState.invalid,
                          })}
                        />
                      </div>
                    )}
                  />
                  {getFormErrorMessage('actionButtonTextColor')}
                </div>

                <div className="p-field p-col-12 p-md-12">
                  <label className="required" htmlFor="campaignVersionName">
                    Campaign Version Name
                  </label>
                  <Controller
                    name="campaignVersionName"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        {...field}
                        value={field.value}
                        onChange={e => field.onChange(e.target.value)}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                        type="text"
                      />
                    )}
                  />
                  {getFormErrorMessage('campaignVersionName')}
                </div>
              </div>
            </div>
          </div>

          <div className="p-col-12 p-md-6">
            <div className="card p-fluid">
              <h5>Sharer Reward</h5>
              <div className="p-fluid p-formgrid p-grid">
                <div className="p-field p-col-12 p-md-6">
                  <label className="required" htmlFor="sharerRewardName">
                    Name
                  </label>
                  <Controller
                    name="sharerRewardName"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        {...field}
                        value={field.value}
                        onChange={e => field.onChange(e.target.value)}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                        type="text"
                      />
                    )}
                  />
                  {getFormErrorMessage('sharerRewardName')}
                </div>

                <div className="p-field p-col-12 p-md-6">
                  <label
                    className="required"
                    htmlFor="sharerRewardLiteralDescription"
                  >
                    Literal Description
                  </label>
                  <Controller
                    name="sharerRewardLiteralDescription"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        {...field}
                        value={field.value}
                        onChange={e => field.onChange(e.target.value)}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                        type="text"
                      />
                    )}
                  />
                  {getFormErrorMessage('sharerRewardLiteralDescription')}
                </div>
              </div>
              <h5>Discount Code</h5>
              <div className="p-fluid p-formgrid p-grid">
                <div className="p-field p-col-12 p-md-6">
                  <label className="required" htmlFor="sharerRewardValueAmount">
                    Value Amount
                  </label>
                  <Controller
                    name="sharerRewardValueAmount"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        {...field}
                        value={field.value}
                        onChange={e => field.onChange(e.target.value)}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                        type="number"
                      />
                    )}
                  />
                  {getFormErrorMessage('sharerRewardValueAmount')}
                </div>
                <div className="p-field p-col-12 p-md-6">
                  <label className="required" htmlFor="sharerRewardCode">
                    Code
                  </label>
                  <Controller
                    name="sharerRewardCode"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        {...field}
                        value={field.value}
                        onChange={e => field.onChange(e.target.value)}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                        type="text"
                      />
                    )}
                  />
                  {getFormErrorMessage('sharerRewardCode')}
                </div>

                <div className="p-field p-col-12 p-md-6">
                  <label className="required" htmlFor="sharerRewardValidFrom">
                    Valid From
                  </label>
                  <Controller
                    name="sharerRewardValidFrom"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Calendar
                        id={field.name}
                        {...field}
                        onChange={(e: any) => field.onChange(e.value)}
                        dateFormat="dd/mm/yy"
                        showIcon
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage('sharerRewardValidFrom')}
                </div>

                <div className="p-field p-col-12 p-md-6">
                  <label htmlFor="sharerRewardValidTo">Valid To</label>
                  <Controller
                    name="sharerRewardValidTo"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Calendar
                        id={field.name}
                        {...field}
                        onChange={(e: any) => field.onChange(e.value)}
                        dateFormat="dd/mm/yy"
                        showIcon
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage('sharerRewardValidTo')}
                </div>
              </div>
            </div>
          </div>

          <div className="p-col-12 p-md-6">
            <div className="card p-fluid">
              <h5>Friends Reward</h5>
              <div className="p-fluid p-formgrid p-grid">
                <div className="p-field p-col-12 p-md-6">
                  <label className="required" htmlFor="friendRewardName">
                    Name
                  </label>
                  <Controller
                    name="friendRewardName"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        {...field}
                        value={field.value}
                        onChange={e => field.onChange(e.target.value)}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                        type="text"
                      />
                    )}
                  />
                  {getFormErrorMessage('friendRewardName')}
                </div>

                <div className="p-field p-col-12 p-md-6">
                  <label
                    className="required"
                    htmlFor="friendRewardLiteralDescription"
                  >
                    Literal Description
                  </label>
                  <Controller
                    name="friendRewardLiteralDescription"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        {...field}
                        value={field.value}
                        onChange={e => field.onChange(e.target.value)}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                        type="text"
                      />
                    )}
                  />
                  {getFormErrorMessage('friendRewardLiteralDescription')}
                </div>
              </div>
              <h5>Discount Code</h5>
              <div className="p-fluid p-formgrid p-grid">
                <div className="p-field p-col-12 p-md-6">
                  <label className="required" htmlFor="friendRewardValueAmount">
                    Value Amount
                  </label>
                  <Controller
                    name="friendRewardValueAmount"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        {...field}
                        value={field.value}
                        onChange={e => field.onChange(e.target.value)}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                        type="number"
                      />
                    )}
                  />
                  {getFormErrorMessage('friendRewardValueAmount')}
                </div>
                <div className="p-field p-col-12 p-md-6">
                  <label className="required" htmlFor="friendRewardCode">
                    Code
                  </label>
                  <Controller
                    name="friendRewardCode"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        {...field}
                        value={field.value}
                        onChange={e => field.onChange(e.target.value)}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                        type="text"
                      />
                    )}
                  />
                  {getFormErrorMessage('friendRewardCode')}
                </div>

                <div className="p-field p-col-12 p-md-6">
                  <label className="required" htmlFor="friendRewardValidFrom">
                    Valid From
                  </label>
                  <Controller
                    name="friendRewardValidFrom"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Calendar
                        id={field.name}
                        {...field}
                        onChange={(e: any) => field.onChange(e.value)}
                        dateFormat="dd/mm/yy"
                        showIcon
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage('friendRewardValidFrom')}
                </div>

                <div className="p-field p-col-12 p-md-6">
                  <label htmlFor="friendRewardValidTo">Valid To</label>
                  <Controller
                    name="friendRewardValidTo"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Calendar
                        id={field.name}
                        {...field}
                        onChange={(e: any) => field.onChange(e.value)}
                        dateFormat="dd/mm/yy"
                        showIcon
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage('friendRewardValidTo')}
                </div>
              </div>
            </div>
          </div>

          <div className="p-col-12 p-md-6">
            <div className="card p-fluid">
              <div
                className="p-formgroup-inline"
                style={{ marginBottom: '-15px' }}
              >
                <h4>
                  <div className="p-field">Brand</div>
                </h4>
                <div className="p-field">
                  {isLoadingClient && (
                    <ProgressSpinner
                      style={{ width: '20px', height: '20px' }}
                    />
                  )}
                </div>
              </div>
              <div className="p-fluid p-formgrid p-grid">
                <div className="p-field p-col-12 p-md-6">
                  <label className="required" htmlFor="brandShortName">
                    Short Name
                  </label>
                  <Controller
                    name="brandShortName"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        {...field}
                        value={field.value}
                        onChange={e => field.onChange(e.target.value)}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                        type="text"
                      />
                    )}
                  />
                  {getFormErrorMessage('brandShortName')}
                </div>
                <div className="p-field p-col-12 p-md-6">
                  <label htmlFor="brandDescription">Description</label>
                  <Controller
                    name="brandDescription"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        {...field}
                        value={field.value}
                        onChange={e => field.onChange(e.target.value)}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                        type="text"
                      />
                    )}
                  />
                  {getFormErrorMessage('brandDescription')}
                </div>

                <div className="p-field p-col-12 p-md-6">
                  <label className="required" htmlFor="brandUrlId">
                    URL id
                  </label>
                  <Controller
                    name="brandUrlId"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        {...field}
                        value={field.value}
                        onChange={e => field.onChange(e.target.value)}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                        type="text"
                      />
                    )}
                  />
                  {getFormErrorMessage('brandUrlId')}
                </div>

                <div className="p-field p-col-12 p-md-6">
                  <label htmlFor="brandCategories">Categories</label>
                  <Controller
                    name="brandCategories"
                    control={control}
                    render={({ field, fieldState }) => (
                      <DropdownMpCategories
                        id={field.name}
                        {...field}
                        value={field.value}
                        onChange={(e: any) => field.onChange(e.target.value)}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage('brandCategories')}
                </div>
              </div>
            </div>
          </div>

          <div className="p-col-12 p-md-6">
            <div className="card p-fluid">
              <div
                className="p-formgroup-inline"
                style={{ marginBottom: '-15px' }}
              >
                <h4>
                  <div className="p-field">Offer</div>
                </h4>
                <div className="p-field">
                  {isLoadingClient && (
                    <ProgressSpinner
                      style={{ width: '20px', height: '20px' }}
                    />
                  )}
                </div>
              </div>
              <div className="p-fluid p-formgrid p-grid">
                <div className="p-field p-col-12 p-md-6">
                  <label htmlFor="offerStartDate">Start Date</label>
                  <Controller
                    name="offerStartDate"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Calendar
                        id={field.name}
                        {...field}
                        onChange={(e: any) => field.onChange(e.value)}
                        dateFormat="dd/mm/yy"
                        showIcon
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage('offerStartDate')}
                </div>

                <div className="p-field p-col-12 p-md-6">
                  <label htmlFor="offerEndDate">End Date</label>
                  <Controller
                    name="offerEndDate"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Calendar
                        id={field.name}
                        {...field}
                        onChange={(e: any) => field.onChange(e.value)}
                        dateFormat="dd/mm/yy"
                        showIcon
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage('offerEndDate')}
                </div>

                <div className="p-field p-col-12 p-md-6">
                  <label htmlFor="offerType">Type</label>
                  <Controller
                    name="offerType"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        id={field.name}
                        {...field}
                        options={['SIMPLE', 'SHARING']}
                        onChange={(e: any) => field.onChange(e.value)}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage('offerType')}
                </div>

                <div className="p-field p-col-12 p-md-6">
                  <label htmlFor="offerCardDescription">Card Description</label>
                  <Controller
                    name="offerCardDescription"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        {...field}
                        value={field.value}
                        onChange={e => field.onChange(e.target.value)}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                        type="text"
                      />
                    )}
                  />
                  {getFormErrorMessage('offerCardDescription')}
                </div>

                <div className="p-field p-col-12 p-md-6">
                  <label htmlFor="offerCondition">Offer Condition</label>
                  <Controller
                    name="offerCondition"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        {...field}
                        value={field.value}
                        onChange={e => field.onChange(e.target.value)}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                        type="text"
                      />
                    )}
                  />
                  {getFormErrorMessage('offerCondition')}
                </div>

                <div className="p-field p-col-12 p-md-6">
                  <label className="required" htmlFor="offerUrlId">
                    URL id
                  </label>
                  <Controller
                    name="offerUrlId"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        {...field}
                        value={field.value}
                        onChange={e => field.onChange(e.target.value)}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                        type="text"
                      />
                    )}
                  />
                  {getFormErrorMessage('offerUrlId')}
                </div>

                <div className="p-field p-col-12 p-md-6">
                  <label htmlFor="offerCategories">Categories</label>
                  <Controller
                    name="offerCategories"
                    control={control}
                    render={({ field, fieldState }) => (
                      <DropdownMpCategories
                        id={field.name}
                        {...field}
                        value={field.value}
                        onChange={(e: any) => field.onChange(e.target.value)}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage('offerCategories')}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Bar */}
          <div className="p-col-12 p-justify-center">
            <Toolbar
              className="p-mb-12 p-toolbar p-justify-center"
              right={
                <Button
                  label="Submit"
                  icon="pi pi-check"
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                />
              }
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default Index;
