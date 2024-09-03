import React, { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { Tooltip } from 'primereact/tooltip';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { ProgressSpinner } from 'primereact/progressspinner';
import uploadService from '../../services/UploadService';
import constants from '../../shared/constants';

const Upload: React.FC<any> = ({
  isActive,
  setIsActive,
  asset,
  setSelectedAsset,
  friendlyName,
  src,
  isUploadButtonDisabled,
  section,
  originalAssetObj,
  changedProperty,
  setAsset,
  resetModal,
  labelSize,
}) => {
  const toast = useRef<any>(null);
  const [totalSize, setTotalSize] = useState(0);
  const fileUploadRef = useRef<any>(null);
  const [isUploading, setUploading] = useState(false);
  const [visibleI, setVisible] = useState(false);

  const sendImage = (e: any) => {
    e.preventDefault();
    setIsActive(!isActive);
    setSelectedAsset(asset);
    setVisible(true);
  };

  const handleUpload = async (e: any) => {
    // set state as loading
    setUploading(true);

    try {
      const newObj = { ...originalAssetObj };

      const file = e.files[0];
      const resultUrl = await uploadService.uploadFile(
        newObj,
        section,
        asset,
        file,
      );

      if (changedProperty === 'ogImage') {
        newObj.meta[changedProperty] = resultUrl;
      } else {
        newObj[changedProperty] = resultUrl;
      }
      setAsset(newObj);
      resetModal({ ...newObj });

      toast.current.show({
        severity: 'info',
        summary: 'Success',
        detail: 'File Uploaded',
      });

      // eslint-disable-next-line no-param-reassign
      setVisible(false);
    } catch (error: any) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.friendlyMessage,
        life: 3000,
      });
    } finally {
      setUploading(false);
    }
  };

  const onTemplateSelect = (e: any) => {
    let _totalSize = totalSize;

    // eslint-disable-next-line no-restricted-syntax
    for (const f of e.files) {
      _totalSize += f.size;
    }

    setTotalSize(_totalSize);
  };

  const headerTemplate = (options: any) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;
    const value = totalSize / 10000;
    const formatedValue =
      fileUploadRef && fileUploadRef.current
        ? fileUploadRef.current.formatSize(totalSize)
        : '0 B';

    return (
      <div
        className={className}
        style={{
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {!isUploading && chooseButton}
        {!isUploading && uploadButton}
        {!isUploading && cancelButton}

        <ProgressBar
          value={value}
          displayValueTemplate={() => `${formatedValue} / 1 MB`}
          style={{ width: '300px', height: '20px', marginLeft: 'auto' }}
        />
      </div>
    );
  };

  const chooseOptions = {
    icon: 'pi pi-fw pi-images',
    iconOnly: true,
    className: 'custom-choose-btn p-button-rounded p-button-outlined',
  };
  const uploadOptions = {
    icon: 'pi pi-fw pi-cloud-upload',
    iconOnly: true,
    className:
      'custom-upload-btn p-button-success p-button-rounded p-button-outlined',
  };
  const cancelOptions = {
    icon: 'pi pi-fw pi-times',
    iconOnly: true,
    className:
      'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined',
  };

  const header = (
    <>
      <div className="flex align-items-center justify-content-center pt-1">
        <h5>{friendlyName}</h5>
      </div>
      <div className="flex align-items-center justify-content-center">
        {labelSize}
      </div>
    </>
  );
  const footer = (
    <div className="flex align-items-center justify-content-center ">
      <Button
        label="Upload Image"
        icon="pi pi-upload"
        className="p-button p-component p-fileupload-choose"
        onClick={sendImage}
        disabled={isUploadButtonDisabled}
      />
    </div>
  );

  return (
    <>
      <Card footer={footer} header={header} className="h-full">
        <div
          className="flex align-items-center justify-content-center"
          style={{ minHeight: '180px' }}
        >
          <img
            src={
              src && src.length && src.length !== 0
                ? src
                : constants.IMAGE.EMPTY_IMAGE_URL
            }
            alt="asset"
            style={{
              maxWidth: '60%',
              maxHeight: '60%',
            }}
          />
        </div>
      </Card>
      <Dialog
        onHide={() => {
          // eslint-disable-next-line no-param-reassign
          setVisible(false);
        }}
        appendTo="self"
        maskStyle={{ backgroundColor: 'black' }}
        minX={0}
        modal
        showHeader
        visible={visibleI}
        header={<h2>Image Upload</h2>}
        style={{ width: '50vw' }}
      >
        <Toast ref={toast} />

        <div className="card">
          {isUploading && (
            <ProgressSpinner style={{ width: '20px', height: '20px' }} />
          )}
          <h5>{friendlyName}</h5>
          <FileUpload
            ref={fileUploadRef}
            name="demo[]"
            accept="image/*"
            maxFileSize={1000000}
            onSelect={onTemplateSelect}
            // progressBarTemplate={progressbar}
            headerTemplate={headerTemplate}
            chooseOptions={chooseOptions}
            uploadOptions={uploadOptions}
            cancelOptions={cancelOptions}
            customUpload
            uploadHandler={handleUpload}
          />
        </div>
      </Dialog>
    </>
  );
};

export default Upload;
