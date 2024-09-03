import { EmailEditor } from 'react-email-editor';

interface Props {
  emailEditorRef: any;
  onReady: any;
}

const EmailEditorComponent = ({ emailEditorRef, onReady }: Props) => {
  return (
    <>
      <div>
        <EmailEditor
          projectId={170187}
          ref={emailEditorRef}
          onReady={onReady}
          minHeight={900}
          tools={{
            image: { enabled: true },
            divider: { enabled: false },
            button: { enabled: false },
            form: { enabled: false },
            heading: { enabled: true },
            text: { enabled: true },
            html: { enabled: false },
            menu: { enabled: false },
            video: { enabled: false },
            rows: { enabled: true },
            'custom#product_tool': {
              data: {
                products: [''],
              },
            } as any,
          }}
          options={{
            displayMode: 'web',
            features: {
              imageEditor: false,
              audit: false,
              ai: false,
              smartMergeTags: false,
              stockImages: false,
              preview: true,
              textEditor: undefined,
              undoRedo: false,
            },
            blocks: [],
            // customJS: [
            //   `${window.location.protocol}//${window.location.host}/EmailEditor/titleCustom.js`,
            //   `${window.location.protocol}//${window.location.host}/EmailEditor/subTitleCustom.js`,
            //   `${window.location.protocol}//${window.location.host}/EmailEditor/paragraphCustom.js`,
            //   `${window.location.protocol}//${window.location.host}/EmailEditor/imageCustom.js`,
            //   `${window.location.protocol}//${window.location.host}/EmailEditor/imageGroupCustom.js`,
            //   `${window.location.protocol}//${window.location.host}/EmailEditor/utils/utils.js`,
            // ],
            customCSS: [
              `
                  .tab-content {
                    display: block;
                  }
                  .tab-blocks {
                    display: none;
                  }
                  .tab-body {
                    display: none;
                  }                                
                  .container {
                    max-width: 900px !important; 
                  }
                  .u_body {
                    background-color: white !important;
                  }
                  .BC_content {
                    text-align: justify;
                    margin: auto;
                    padding: 30px 10px 0px 10px;
                    font-family: Apercu;
                    color: #334d5c;
                    font-size: 14px;
                    font-weight: 400;
                    line-height: 22px;
                    letter-spacing: 0em;
                    max-width: 1180px;
                  }
              `,
            ],
          }}
        />
      </div>
    </>
  );
};

export default EmailEditorComponent;
