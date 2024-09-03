const imageEmptyTemplate = _.template(`
<div style="padding: 15px; border: 2px dashed #CCC; background-color: #EEE; color: #999; text-align: center;">
  Empty Image
</div>
`);

const imageToolTemplate = _.template(`
  <div class="sor_bc_imgContent">
    <% _.forEach(items, function(item,index) { %>
    <img class="sor_bc_imgFullSize" src="<%= item.url %>" />
    <% }); %>  
  </div>
`);

unlayer.registerTool({
  name: "image_tool",
  label: "Image block",
  icon: "fa-image-landscape",
  supportedDisplayModes: ["web", "email"],
  options: {
    productContent: {
      title: "Content",
      position: 2,
      options: {
        productImage: {
          label: "Image",
          defaultValue: {
            items: [{
              url: 'https://soreto-dev.s3.sa-east-1.amazonaws.com/noimage.jpg'
            }
            ],
          },
          widget: "image_editor"
        },
      }
    }
  },
  values: {},

  renderer: {
    Viewer: unlayer.createViewer({
      render(values) {
        // If the user has added no items yet, show empty placeholder template
        if (values.productImage.items.length == 0) return imageEmptyTemplate();

        return imageToolTemplate({ items: values.productImage.items, id: values.productImage.id });
      }
    }),
    exporters: {
      web: function (values) {
        return imageToolTemplate({ items: values.productImage.items });
      },
      email: function (values) {
        return imageToolTemplate({ items: values.productImage.items });
      }
    },
    head: {
      // As we need custom styling in export as well that's why we put those styles here
      css: function (values) {
        return `
        .p-card {
          padding: 0 0 15px;
          box-shadow: 0 2px 1px -1px rgb(0 0 0 / 20%), 0 1px 1px 0 rgb(0 0 0 / 14%), 0 1px 3px 0 rgb(0 0 0 / 12%);
          margin: 0 0 15px;
        }
        .p-button {
          color: #ffffff;
          background: #F53855;
          border: 0 none;
          padding: 0.643rem 0.75rem;
          font-size: 1rem;
          transition: background-color 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s, background-size 0.2s cubic-bezier(0.64, 0.09, 0.08, 1);
          border-radius: 4px;
          margin-top: 15px !important;
        }
        .align-items-center {
          align-items: center !important;
        }
        .justify-content-center {
          justify-content: center !important;
        }        
        .flex {
          display: flex !important;
        }
        .p-card-header {
          font-weight: 600;
        }  
        .sor_bc_imgFullSize {
          width: 100%;
        }
        .sor_bc_imgContent {
          text-align: center;
          max-width: 100%;
          max-height: 100%;
        }
        `;
      },
      js: function (values) {
      }
    }
  }
});

const imageEditorTemplate = _.template(`
<% _.forEach(items, function(item, index) { %>
  <div class="p-card p-component h-full">
	<div class="p-card-header">
		<div class="flex align-items-center justify-content-center pt-1">
			<h5 style="font-weight: bold">Blog Card Image Url</h5>
		</div>
	</div>
	<div>
		<div>
			<div id="imagePreviewDiv" data-index="<%= index %>" class="flex align-items-center justify-content-center" style="min-height: 180px;">
				<img src="<%= !item.url ? 'https://soreto-dev.s3.sa-east-1.amazonaws.com/noimage.jpg' : item.url %>  " alt="asset" style="max-width: 100%; max-height: 100%;">
			</div>
		</div>
		<div id="imageUpload" class="p-card-footer">
      <div class="flex align-items-center justify-content-center">
        <button class="p-button" onclick="document.getElementById('<%= id %>').click()">Upload Image
          <input type='file' id="<%= id %>" data-index="<%= id %>" style="display:none"  accept="image/*">      
        <span class="p-button-icon p-c p-button-icon-left pi pi-upload"></span>
        </button>
      </div>
      <a class="delete-btn" data-index="<%= index %>" style="display: inline-block; cursor: pointer; color: red; margin-top: 10px; font-size: 12px; margin-left: 10px">
        Delete Item
      </a>
		</div>
	</div>
</div>
<% }); %>
`);

unlayer.registerPropertyEditor({
  name: 'image_editor',
  layout: 'bottom',
  Widget: unlayer.createWidget({
    render(value, updateValue, data) {
      if (!value.id) {
        value.id = GenerateIndex();
      }

      return imageEditorTemplate({ items: value.items, id: value.id });
    },
    mount(node, value, updateValue, data) {
      // URL Change
      // Look for inputs with class imageUpload and attach onchange event
      node.querySelectorAll('#imageUpload').forEach(function (item) {
        item.onchange = function (e) {
          let file = e.target.files[0];
          
          // Get index of item being updated
          const itemIndex = e.target.dataset.index;

          const reader = new FileReader();
        
          reader.onload = function(event) {
            const imageData = event.target.result;
            
            const imgObj = {
              body: imageData,
              index: itemIndex,
              items: value.items,
              action: 'saveImg'
            };

            window.parent.postMessage(imgObj, '*')
          };

          reader.readAsDataURL(file);
        };
      });

      // Delete
      node.querySelectorAll('.delete-btn').forEach(function (item) {
        item.onclick = function (e) {
          // Get index of item being deleted
          var itemIndex = e.target.dataset.index;
          var updatedItems = value.items
            .map(function (item, i) {
              if (i == itemIndex) {
                return false;
              }

              return {
                url: item.url,
              };
            })
            .filter(function (item) {
              return item;
            });

          updateValue({ items: updatedItems });
        };
      });

      window.addEventListener('message', function (e) { 
        if ((e.data.action !== 'loadImg') || (value.id !== e.data.index)) return;

        updateValue({ items: [{ url: e.data.url }], id: e.data.index });
      });

    },
  }),
});