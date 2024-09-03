const toolTemplatex = function (values, isViewer = false) {
  return `<div><h3 class="sor_bc_subTitle sor_bc_subTitleColorGray">${values.customTitle}</h3></div>`;
};

unlayer.registerTool({
  name: 'title_tool',
  label: 'Title',
  icon: 'fa-heading',
  supportedDisplayModes: ['web', 'email'],
  options: {
    productContent: {
      title: "Content",
      position: 1,
      options: {
        customTitle: {
          label: "Title",
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
        return toolTemplatex(values, true);
      },
    }),

    exporters: {
      web: function (values) {
          return '<div><h3 class="sor_bc_subTitle sor_bc_subTitleColorGray">Read the latest blog from Soreto</h3></div>';
      },

      email: function (values) {
          return toolTemplatex(values, true);
      },
    },

    head: {
      css: function (values) {
          return `
          .sor_bc_subTitle {
              font-size: 24px;
              font-weight: 700;
              line-height: 30px;
              margin: 0px;
              color: gray;
            }

            .sor_bc_subTitleColorGray {
              color: gray;
            }
            `;
        },

      js: function (values) {},
    },
  },
});