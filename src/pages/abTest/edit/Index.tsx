/* eslint-disable react/jsx-props-no-spreading */
import './index.scss';
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { classNames } from 'primereact/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Calendar } from 'primereact/calendar';
import { RadioButton } from 'primereact/radiobutton';
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Chip } from 'primereact/chip';
import moment from 'moment';
import { Fieldset } from 'primereact/fieldset';
import AbTest from '../../../entities/abTest';
import AbTestService from '../../../services/AbTestService';
import CampaignVersionSelector from '../../../components/CampaignVersionSelector';
import { timezoneOffsetIn } from '../../../helpers/dateFormatter';
import DropdownResponsible from '../../../components/DropdownResponsible';

const getFormErrorMessage = (name: string, errors: any) => {
  return <small className="p-error">{errors[name]?.message}</small>;
};

const AbTestEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const emptyAbTest: AbTest = new AbTest();
  const [abTest, setAbTest] = useState<any>(emptyAbTest);
  const [kpis] = useState([
    { label: 'SHARE', value: 'SHARE' },
    { label: 'SHARE-RATE', value: 'SHARE-RATE' },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCampaignVersions, setSelectedCampaignVersions] = useState<
    any[]
  >([]);
  const [campaignVersionId, setCampaignVersionId] = useState<string | null>(
    null,
  );
  const [campaignVersion, setCampaignVersion] = useState<any>(null);
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [selectorKey, setSelectorKey] = useState(0);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(AbTest.schemaValidation()),
  });

  const formSubmit = useRef(null);

  const getAbTestById = async (paramId: string) => {
    AbTestService.getAbTest(paramId)
      .then(abTestPayload => {
        if (abTestPayload && abTestPayload.campaignVersions) {
          const abTestValue = {
            ...abTestPayload,
            startDate: new Date(abTestPayload.startDate),
            endDate: new Date(abTestPayload.endDate),
            campaignVersions: abTestPayload.campaignVersions,
            campaignVersionIds: abTestPayload.campaignVersions.map(
              (cv: any) => cv.campaignVersionId,
            ),
          };
          setAbTest(abTestValue);
          reset(abTestValue);

          setSelectedCampaignVersions(
            abTestPayload.campaignVersions.map((cv: any) => ({
              id: cv.campaignVersionId || 'default-id',
              name: cv.campaignVersionName || 'default-name',
            })),
          );
          setIsTableVisible(abTestPayload.campaignVersions.length > 0);
        } else {
          console.error(
            'campaignVersions is undefined or missing from resultData',
          );
          setSelectedCampaignVersions([]);
          setIsTableVisible(false);
        }
      })
      .catch(error => {
        console.error('Error fetching AB test data:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (id && id !== 'new') {
      getAbTestById(id);
    } else {
      setIsLoading(false);
    }
  }, [id, reset]);

  useEffect(() => {
    reset(abTest);
  }, [abTest, reset]);

  const pageHandleSubmit = async () => {
    try {
      if (selectedCampaignVersions.length === 0) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Please add at least one campaign version',
          life: 3000,
        });

        return;
      }

      const updatedAbTest = {
        ...abTest,
        campaignVersionIds: selectedCampaignVersions.map(version => version.id),
      };
      if (id === 'new') {
        const response = await AbTestService.createAbTest(updatedAbTest);
        navigate(`/abTest/${response.data.resultData._id}`);
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'AB Test created successfully',
          life: 3000,
        });
      } else {
        const isDuplicate = selectedCampaignVersions.some(
          version => version.id === campaignVersionId,
        );
        if (!isDuplicate) {
          await AbTestService.updateAbTest(id!, updatedAbTest);
          getAbTestById(updatedAbTest._id);
          toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: 'AB Test updated successfully',
            life: 3000,
          });
        }
      }

      setAbTest(updatedAbTest);
    } catch (error) {
      console.error(error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'An error occurred',
        life: 3000,
      });
    }
  };

  const handleAddCampaignVersion = () => {
    if (campaignVersionId && campaignVersion) {
      const isDuplicate = selectedCampaignVersions.some(
        version => version.id === campaignVersionId,
      );

      if (isDuplicate) {
        toast.current?.show({
          severity: 'warn',
          summary: 'Duplicate Entry',
          detail: 'This campaign version is already added.',
          life: 3000,
        });
        return;
      }

      const newCampaignVersion = {
        id: campaignVersionId,
        name: campaignVersion.name,
      };

      setSelectedCampaignVersions(prevVersions => {
        const updatedVersions = [...prevVersions, newCampaignVersion];

        setIsTableVisible(true);
        setCampaignVersionId(null);
        setCampaignVersion(null);
        setSelectorKey(prevKey => prevKey + 1);
        return updatedVersions;
      });
    }
  };

  const handleRemoveCampaignVersion = (idToRemove: string) => {
    setSelectedCampaignVersions(prevVersions => {
      const updatedVersions = prevVersions.filter(
        version => version.id !== idToRemove,
      );

      setIsTableVisible(updatedVersions.length > 0);
      return updatedVersions;
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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

  return (
    <div>
      <Toast ref={toast} />
      <div className="dashboard">
        <h1>{id === 'new' ? 'Create New Test' : `Edit Test`}</h1>
        <form onSubmit={handleSubmit(pageHandleSubmit)}>
          <div className="form-section">
            <div className="row">
              <div className="column-50">
                <div className="form-field">
                  <label htmlFor="name">Name</label>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        {...field}
                        autoFocus
                        value={abTest.name}
                        onChange={e =>
                          setAbTest({ ...abTest, name: e.target.value })
                        }
                        className={`${classNames({
                          'p-invalid': fieldState.invalid,
                        })} input-text`}
                      />
                    )}
                  />
                  {getFormErrorMessage('name', errors)}
                </div>
              </div>
              <div className="column-50">
                <div className="form-field">
                  <label htmlFor="description">Description</label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputTextarea
                        id={field.name}
                        {...field}
                        maxLength={500}
                        value={abTest.description}
                        onChange={e =>
                          setAbTest({ ...abTest, description: e.target.value })
                        }
                        rows={2}
                        className={`${classNames({
                          'p-invalid': fieldState.invalid,
                        })} input-textarea`}
                      />
                    )}
                  />
                  {getFormErrorMessage('description', errors)}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="column-25">
                <div className="form-field">
                  <label htmlFor="startDate">Start Date</label>
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Calendar
                        dateFormat="dd/mm/yy"
                        id={field.name}
                        {...field}
                        value={timezoneOffsetIn(abTest.startDate)}
                        onChange={e => {
                          setAbTest({ ...abTest, startDate: e.value });
                          field.onChange(e.value);
                        }}
                        // showOnFocus={false}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                        showIcon
                      />
                    )}
                  />
                  {getFormErrorMessage('startDate', errors)}
                </div>
              </div>
              <div className="column-25">
                <div className="form-field">
                  <label htmlFor="endDate">End Date</label>
                  <Controller
                    name="endDate"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Calendar
                        dateFormat="dd/mm/yy"
                        id={field.name}
                        {...field}
                        value={timezoneOffsetIn(abTest.endDate)}
                        onChange={e => {
                          setAbTest({ ...abTest, endDate: e.value });
                          field.onChange(e.value);
                        }}
                        // showOnFocus={false}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                        showIcon
                      />
                    )}
                  />
                  {getFormErrorMessage('endDate', errors)}
                </div>
              </div>
              <div className="column-25">
                <div className="form-field">
                  <label htmlFor="responsibleUserIds">Owner</label>
                  <Controller
                    name="responsibleUserIds"
                    control={control}
                    render={({ field, fieldState }) => (
                      <DropdownResponsible
                        id={field.name}
                        {...field}
                        value={abTest.responsibleUserIds}
                        onChange={(e: any) =>
                          setAbTest({
                            ...abTest,
                            responsibleUserIds: e.value,
                          })
                        }
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage('responsibleUserIds', errors)}
                </div>
              </div>
              <div className="column-25">
                <div className="form-field">
                  <label htmlFor="kpis">Metrics Context</label>
                  <Controller
                    name="kpis"
                    control={control}
                    render={({ field, fieldState }) => (
                      <MultiSelect
                        id={field.name}
                        value={abTest.kpis}
                        options={kpis}
                        onChange={e => setAbTest({ ...abTest, kpis: e.value })}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage('kpis', errors)}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="column-20">
                <div className="type-status-section">
                  <div className="type">
                    <label className="topLabel" htmlFor="type">
                      Type
                    </label>
                    <div className="p-field-radiobutton">
                      <RadioButton
                        inputId="classic"
                        name="classic"
                        value="CLASSIC"
                        checked={abTest.type === 'CLASSIC'}
                        onChange={() =>
                          setAbTest({ ...abTest, type: 'CLASSIC' })
                        }
                      />
                      <label htmlFor="classic">
                        <span>Classic</span>
                      </label>
                    </div>
                    <div className="p-field-radiobutton">
                      <RadioButton
                        inputId="iaManaged"
                        name="iaManaged"
                        value="IA_MANAGED"
                        checked={abTest.type === 'IA_MANAGED'}
                        onChange={() =>
                          setAbTest({ ...abTest, type: 'IA_MANAGED' })
                        }
                      />
                      <label htmlFor="iaManaged">
                        <span>IA Managed</span>
                      </label>
                    </div>
                  </div>

                  <div className="status">
                    <label className="topLabel" htmlFor="status">
                      Status
                    </label>
                    <div id="status" className="status-text">
                      {getStatus(abTest?.status || 'New')}
                    </div>
                  </div>
                </div>
              </div>
              <div className="column-80">
                {abTest.type === 'CLASSIC' && (
                  <>
                    <Fieldset legend="Campaign Version" ref={null}>
                      <div className="p-formgrid">
                        <div className="p-d-flex p-flex-column">
                          <div className="p-formgrid p-grid">
                            <CampaignVersionSelector
                              key={selectorKey}
                              id="campaignVersionId"
                              editionMode
                              offer={{} as any}
                              useClientAsBrand={false}
                              onChange={(
                                newCampaignVersionId: any,
                                campaign: any,
                                newCampaignVersion: any,
                              ) => {
                                setCampaignVersionId(newCampaignVersionId);
                                setCampaignVersion(newCampaignVersion);
                              }}
                            />
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'flex-end',
                              }}
                              className="p-field p-col"
                            >
                              <Button
                                icon="pi pi-plus"
                                className={`addCPVToList ${
                                  !(campaignVersionId && campaignVersion)
                                    ? 'disabled'
                                    : ''
                                }`}
                                onClick={handleAddCampaignVersion}
                                disabled={
                                  !campaignVersionId || !campaignVersion
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Fieldset>
                  </>
                )}
                {isTableVisible && (
                  <div className="campaignVersionTable">
                    <div className="tableHeader">
                      <div className="headerCell">Campaign Version ID</div>
                      <div className="headerCell">Campaign Version Name</div>
                      <div className="headerCell">Actions</div>
                    </div>
                    <div className="tableBody">
                      {selectedCampaignVersions.map(version => (
                        <div key={version.id} className="tableRow">
                          <div className="tableCell">{version.id}</div>
                          <div className="tableCell">{version.name}</div>
                          <div className="tableCell">
                            <Button
                              icon="pi pi-times"
                              className="remove-button"
                              onClick={() =>
                                handleRemoveCampaignVersion(version.id)
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="form-actions">
              <Button
                label="Cancel"
                icon="pi pi-times"
                className="p-button-secondary"
                onClick={() => navigate('/abTest')}
              />
              <Button
                label="Submit"
                icon="pi pi-check"
                onClick={handleSubmit(pageHandleSubmit)}
                ref={formSubmit}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AbTestEdit;
