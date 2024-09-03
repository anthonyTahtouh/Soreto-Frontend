const emptyTemplate = _.template(`
<div style="padding: 15px; border: 2px dashed #CCC; background-color: #EEE; color: #999; text-align: center;">
  Empty Image Group
</div>
`);

const accordionTemplate = _.template(`
<div class="sor_bc_imgTableRow">
  <% _.forEach(items, function(item,index) { %>
    <a>
        <img class="sor_bc_imgSize" src="<%= item.url %>" />
    </a>
  <% }); %>
</div>
`);

const editorImageGroupTemplate = _.template(`
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
        <button class="p-button" data-index="<%= index %>" onclick="document.getElementById('<%= id %>').click()">Upload Image
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

<div class="add-btn" data-index="<%= id %>">
  <a style="display: block;  text-align: center;  padding: 5px; cursor: pointer;">
    Add New Row
  </a>
</div>
`);

unlayer.registerTool({
  name: 'image_group_tool',
  label: 'Img group',
  icon: 'fa-images',
  supportedDisplayModes: ["web", "email"],
  options: {
    default: {
      title: null,
    },
    menu: {
      title: 'Mult. Images',
      position: 1,
      options: {
        accordionRow: {
          label: 'Mult. Images',
          defaultValue: {
            items: [],
          },
          widget: 'image_group_editor', // Custom Property Editor
        },
      },
    },
  },
  renderer: {
    Viewer: unlayer.createViewer({
      render(values) {
        // If the user has added no items yet, show empty placeholder template
        if (values.accordionRow.items.length == 0) return emptyTemplate();

        return accordionTemplate({ items: values.accordionRow.items });
      },
    }),
    exporters: {
      web: function (values) {
        return accordionTemplate({ items: values.accordionRow.items });
      },
      email: function (values) {
        return accordionTemplate({ items: values.accordionRow.items });
      },
    },
    head: {
      css: function (values) {
        return `
        .add-btn {
          color: #ffffff;
          background: #F53855;
          border: 0 none;
          padding: 0.643rem 0.75rem;
          font-size: 1rem;
          transition: background-color 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.2s, background-size 0.2s cubic-bezier(0.64, 0.09, 0.08, 1);
          border-radius: 4px;
          margin: 10px;
        }
        .p-card {
          padding: 0 0 15px;
          box-shadow: 0 2px 1px -1px rgb(0 0 0 / 20%), 0 1px 1px 0 rgb(0 0 0 / 14%), 0 1px 3px 0 rgb(0 0 0 / 12%);
          margin: 0 0 15px;
        }
        .sor_bc_imgSizeContent {
          width: 380px;
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
        .sor_bc_imgSize {
          max-width: 100%;
          max-height: 100%;
        }
        
        .sor_bc_imgTableRow {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          column-gap: 10px;
          max-width: 100%;
          max-height: 100%;
        } 
        @media screen and (min-width: 1220px) {
          .sor_bc_imgTableRow {
            flex-wrap: inherit;
          }
        }  
          `;
      },
      js: function (values) {
        return `async function handleClick(item){ 

          let panel = item.nextElementSibling
          if (panel.style.display === "block") {
            panel.style.display = "none";
          } else {
            panel.style.display = "block";
          }

        }`;
      },
    },
  },
});

unlayer.registerPropertyEditor({
  name: 'image_group_editor',
  layout: 'bottom',
  Widget: unlayer.createWidget({
    render(value, updateValue, data) {
      return editorImageGroupTemplate({ items: value.items, id: value.id });
    },
    mount(node, value, updateValue, data) {      
      var addButton = node.querySelector('.add-btn');
      addButton.onclick = function (e) {

        const itemIndex = GenerateIndex();
        var newItems = value.items.slice(0);
        newItems.push({
          index: itemIndex,
          url: '',
        });
        updateValue({ items: newItems, id: itemIndex});
      };

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
            const imagePreview = document.createElement('img');
            imagePreview.className = 'sor_bc_imgSizeContent';
            imagePreview.src = imageData;
            
            const imgObj = {
              body: imageData,
              index: itemIndex,
              items: value.items,
              action: 'saveImgGroup'
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
        if ((e.data.action !== 'loadImgGroup') || (value.id !== e.data.index)) return;
      
        // Get the item and update its value
        let updatedItems = e.data.items.map(function (item, i) {
          if (item.index == e.data.index) {
            return {
              index: e.data.index,
              url: e.data.url,
            };
          }
      
          return {
            index: item.index,
            url: item.url,
          };
        });
      
        updateValue({ items: updatedItems, id: e.data.index });
      });
    },
  }),
});

