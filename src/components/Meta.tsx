/* eslint-disable react/require-default-props */
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { useState } from 'react';

import { Controller } from 'react-hook-form';
import Upload from './uploadComponent/Upload';

interface IMeta {
  formErrors: any;
  control: any;
  onChange: (e: any, name: string) => any;
  classNames: any;
  data?: any;
  reset?: any;
  section?: string;
  integration?: boolean;
}

let errors: any;

const getFormErrorMessage = (name: string) => {
  if (errors.meta) {
    return (
      errors.meta[name] && (
        <small className="p-error">{errors.meta[name].message}</small>
      )
    );
  }

  return null;
};

const Meta = ({
  formErrors,
  reset,
  control,
  onChange,
  classNames,
  data,
  section,
  integration,
}: IMeta) => {
  const [updateDialog, setUpdateDialog] = useState<boolean>(false);
  const [, setSelectedUploadAsset] = useState<string>('');
  const onInputChanges = (e: any, name: string) => {
    onChange(e, name);
  };
  errors = formErrors;

  const isNewAsset = integration ? false : !data.originalAssetObj._id;

  return (
    <Fieldset legend="Meta">
      <div className="p-formgrid p-grid">
        <div className="p-field p-col">
          <Controller
            name="meta.ogImage"
            control={control}
            render={({ field }) => (
              <Upload
                friendlyName="OG Image"
                isActive={updateDialog}
                setIsActive={setUpdateDialog}
                asset="ogImage"
                setSelectedAsset={setSelectedUploadAsset}
                src={field.value}
                isUploadButtonDisabled={isNewAsset}
                section={section}
                originalAssetObj={data.originalAssetObj}
                setAsset={data.setAsset}
                changedProperty="ogImage"
                resetModal={reset}
                visible={updateDialog}
                labelSize="1200 x 627"
              />
            )}
          />
          {getFormErrorMessage('ogImage')}
        </div>
        <div className="col-8">
          <div className="p-formgrid p-grid">
            <div className="p-field p-col-12 p-md-12">
              <label htmlFor="meta.title">Title</label>
              <Controller
                name="meta.title"
                control={control}
                render={({ field, fieldState }) => (
                  <InputText
                    id={field.name}
                    style={{ width: '100%' }}
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...field}
                    onChange={e => onInputChanges(e, 'title')}
                    className={classNames({
                      'p-invalid': fieldState.invalid,
                    })}
                  />
                )}
              />

              {getFormErrorMessage('title')}
            </div>
            <div className="p-field p-col-12 p-md-12">
              <label htmlFor="meta.description">Description</label>
              <Controller
                name="meta.description"
                control={control}
                render={({ field, fieldState }) => (
                  <InputTextarea
                    id={field.name}
                    style={{ width: '100%' }}
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...field}
                    onChange={e => onInputChanges(e, 'description')}
                    className={classNames({
                      'p-invalid': fieldState.invalid,
                    })}
                  />
                )}
              />
              {getFormErrorMessage('description')}
            </div>

            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="meta.headingOne">Tag H1</label>
              <Controller
                name="meta.headingOne"
                control={control}
                render={({ field, fieldState }) => (
                  <InputText
                    id={field.name}
                    style={{ width: '100%' }}
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...field}
                    onChange={e => onInputChanges(e, 'headingOne')}
                    className={classNames({
                      'p-invalid': fieldState.invalid,
                    })}
                  />
                )}
              />
              {getFormErrorMessage('headingOne')}
            </div>

            <div className="p-field p-col-12 p-md-6">
              <label htmlFor="meta.headingTwo">Tag H2</label>
              <Controller
                name="meta.headingTwo"
                control={control}
                render={({ field, fieldState }) => (
                  <InputText
                    id={field.name}
                    style={{ width: '100%' }}
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...field}
                    onChange={e => onInputChanges(e, 'headingTwo')}
                    className={classNames({
                      'p-invalid': fieldState.invalid,
                    })}
                  />
                )}
              />
              {getFormErrorMessage('headingTwo')}
            </div>
          </div>
          <div className="p-formgrid p-grid">
            <div className="p-field p-col-12">
              <label htmlFor="meta.keywords">Keywords</label>
              <Controller
                name="meta.keywords"
                control={control}
                render={({ field, fieldState }) => (
                  <InputText
                    id={field.name}
                    style={{ width: '100%' }}
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...field}
                    onChange={e => onInputChanges(e, 'keywords')}
                    className={classNames({
                      'p-invalid': fieldState.invalid,
                    })}
                  />
                )}
              />
              {getFormErrorMessage('keywords')}
            </div>
          </div>
        </div>
      </div>
    </Fieldset>
  );
};

export default Meta;
