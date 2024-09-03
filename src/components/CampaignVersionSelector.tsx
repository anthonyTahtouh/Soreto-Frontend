/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/require-default-props */
import React, { useEffect, useState } from 'react';
import { Fieldset } from 'primereact/fieldset';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import DropdownCampaign from './DropDownCampaign';
import DropdownClients from './DropdownClients';
import MpOffer from '../entities/mpOffer';
import DropdownCampaignVersion from './DropdownCampaignVersion';
import DropdownMpBrand from './DropdownMpBrand';

interface IProps {
  id: string;
  onChange: any;
  onLoad?: any;
  offer: MpOffer;
  campaignType?: string | undefined;
  editionMode: boolean;
  error?: any | undefined;
  useClientAsBrand?: boolean;
}

function CampaignVersionSelector({
  id,
  onChange,
  onLoad,
  offer,
  campaignType,
  editionMode,
  useClientAsBrand = false,
  error,
}: IProps) {
  const [clientId, setClient] = useState<string | undefined>(offer.clientId);
  const [campaignId, setCampaign] = useState<string | undefined>();
  const [campaignVersionId, setCampaignVersion] = useState<string | null>();
  const [edit, setEdit] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [warningMessage, setWarningMessage] = useState(false);

  useEffect(() => {
    if (warningMessage) {
      setWarningMessage(false);
    }
  }, [clientId]);

  useEffect(() => {
    if (editionMode) {
      setEdit(true);
    }

    // se campaign version into the session
    setCampaignVersion(offer.campaignVersionId);
  }, [edit]);

  const confirmChange = () => {
    setShowDialog(false);
    setWarningMessage(true);
  };

  // when one of the fields changes
  // they trigger thios endpoint
  const onInputChange = (e: any, campaign: any, campaignVersion: any) => {
    // was a client change?
    if (e.target.id === 'clientId') {
      if (useClientAsBrand) {
        setClient(e.target.value?.clientId);
        onChange('', '', '', e.target.value?.clientId);
        setCampaignVersion('');
      } else {
        setClient(e.target.value);
      }
      setCampaign('');
    }

    // was a campaign change?
    if (e.target.id === 'campaignId') {
      setCampaign(e.target.value);

      if (e.target.value) {
        onChange(null, campaign, null);
      } else {
        onChange('', '', '');
        setCampaignVersion(e.target.value ? e.target.value : '');
      }
    }

    // was a campaign version change?
    if (e.target.id === 'campaignVersionId') {
      onChange(e.target.value ? e.target.value : '', null, campaignVersion);
      setCampaignVersion(e.target.value ? e.target.value : '');
    }
  };

  const onChangeClient = (e: any) => {
    // If is edit form and is not confirmed popup, open confirmation modal
    if (!editionMode && !warningMessage) {
      setShowDialog(true);
    } else {
      onInputChange(e, null, null);
    }
  };

  const handleEdit = () => {
    setEdit(!edit);
  };

  const editClientDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={() => {
          setShowDialog(false);
        }}
      />
      <Button
        label="OK"
        icon="pi pi-check"
        className="p-button-text"
        onClick={confirmChange}
      />
    </>
  );

  return (
    <>
      <Dialog
        visible={showDialog}
        style={{ width: '500px' }}
        header="Warn"
        modal
        footer={editClientDialogFooter}
        onHide={() => {
          setShowDialog(false);
        }}
        blockScroll
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle p-mr-3"
            style={{ fontSize: '2rem' }}
          />
          {offer && (
            <span>
              If you change the client, it will be required to make the image
              upload again. Do you wish to continue?
            </span>
          )}
        </div>
      </Dialog>
      <>
        {/*

                Client Dropdown

              */}
        {edit && (
          <div className="p-field p-col">
            <label htmlFor="client">Client</label>
            {useClientAsBrand ? (
              <DropdownMpBrand
                id="clientId"
                clientId={clientId}
                onChange={(e: void) => onChangeClient(e)}
                disabled={!edit}
              />
            ) : (
              <DropdownClients
                id="clientId"
                value={clientId}
                onChange={(e: void) => onInputChange(e, null, null)}
                disabled={!edit}
              />
            )}
          </div>
        )}

        {/*

                Campaign Dropdown

              */}
        {edit && (
          <div className="p-field p-col">
            <label htmlFor="campaign">Campaign</label>
            <DropdownCampaign
              id="campaignId"
              value={campaignId}
              clientId={clientId}
              onChange={(e: void, campaign: any) =>
                onInputChange(e, campaign, null)
              }
              disabled={!edit}
              typeCampaign={campaignType}
            />
          </div>
        )}
      </>

      <div className="p-field p-col">
        <label htmlFor="Campaign Version">
          {edit ? 'Campaign Version' : ''}
        </label>

        {/*

                Campaign Version Dropdown

              */}
        <DropdownCampaignVersion
          id={id}
          value={campaignVersionId}
          campaignId={campaignId}
          onChange={(e: void, campaignVersion: any) =>
            onInputChange(e, null, campaignVersion)
          }
          onLoad={onLoad}
          disabled={!edit}
          onSelectedOptionLoaded={(opts: any) => {
            setCampaign(opts.campaignId);
            setClient(opts.clientId);
          }}
          error={error}
        />
      </div>

      {/*

                Edition (pencil) button

            */}
      {!edit ? (
        <div className="p-d-flex">
          <button
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
            type="button"
            onClick={handleEdit}
          >
            <i className="pi pi-pencil" style={{ color: 'red' }} />
          </button>
        </div>
      ) : (
        ''
      )}
    </>
  );
}

export default React.forwardRef(CampaignVersionSelector);
