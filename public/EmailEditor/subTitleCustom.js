const subTitleToolTemplate = function (values, isViewer = false) {
  return `<h4 class="sor_bc_subTitle">${values.customTitle}</h4>`;
};

unlayer.registerTool({
  name: 'subTitle_tool',
  label: 'Sub. Title',
  icon: 'fa-heading',
  supportedDisplayModes: ['web', 'email'],
  options: {
    productContent: {
      title: "Content",
      position: 1,
      options: {
        customTitle: {
          label: "Sub. Title",
          defaultValue: "Set you message",
          widget: "text"
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
        return subTitleToolTemplate(values, true);
      },
    }),

    exporters: {
      web: function (values) {
          return '<div class="sor_bc_subTitle"></div>';
      },

      email: function (values) {
          return subTitleToolTemplate(values, true);
      },
    },

    head: {
      css: function (values) {
          return `
          .sor_bc_subTitle {
            font-size: 24px !important;
            font-weight: 700;
            line-height: 30px;
            padding-bottom: 20px;
            margin: 0px;
            color: #334d5c;
          }
            `;
        },

      js: function (values) {},
    },
  },
});