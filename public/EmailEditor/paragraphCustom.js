const textToolTemplate = function (values, isViewer = false) {
  return `
    <div class="sor_bc_row">
      ${values.customTitle}
    </div>`;
};

unlayer.registerTool({
  name: 'paragraph_tool',
  label: 'Paragraph',
  icon: 'fa-paragraph',
  supportedDisplayModes: ['web', 'email'],
  options: {
    productContent: {
      title: "Content",
      position: 1,
      options: {
        customTitle: {
          label: "Text",
          defaultValue: "Set you message",
          widget: "rich_text"
        },
      }
    }
  },
  transformer: (values, source) => {
    // Transform the values here
    // We will update selected values in property editor here
    let newValues = {
            ...values
          };

    // Return updated values
    return newValues;
  },
  values: {},
  renderer: {
    Viewer: unlayer.createViewer({
      render(values) {
        return textToolTemplate(values, true);
      },
    }),

    exporters: {
      web: function (values) {
          return `
            <div class="sor_bc_row">
              ${values.customTitle}
            </div>`;
      },

      email: function (values) {
          return textToolTemplate(values, true);
      },
    },

    head: {
      css: function (values) {
          return `
          .sor_bc_row {
            text-align: left;
            font-family: Apercu;
            color: #334d5c;
            font-size: 18px;
            font-weight: 400;
            line-height: 25px;
            letter-spacing: 0em;
          }
            `;
        },

      js: function (values) {},
    },
  },
});