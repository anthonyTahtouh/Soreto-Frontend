import { memo } from 'react';

/* eslint-disable jsx-a11y/iframe-has-title */
const LightboxIframe = ({ blob, width, height }: any) => {
  if (!blob) return <div />;
  return (
    <iframe
      src={URL.createObjectURL(
        new Blob([blob], {
          type: 'text/html; charset=utf-8',
        }),
      )}
      height={height}
      width={width}
      style={{ position: 'sticky', top: 0 }}
      frameBorder="0"
    />
  );
};

export default memo(LightboxIframe);
