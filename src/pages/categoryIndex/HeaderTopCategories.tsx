/*eslint-disable */
/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import CategoryService from '../../services/CategoryService';
import QueryBuilderHelper from '../../helpers/QueryBuilderHelper';

interface TabContent {
  tab:
    | 'showOnFooterMenu'
    | 'showOnHeaderMenu'
    | 'showOnTabPanelMenu'
    | 'showOnCategoryMenu';
  tabField: string;
}

interface FilterObj {
  sortField: string;
  sortOrder: number;
  filters: Filters;
}

interface Filters {
  active?: {};
  showOnHeaderMenu?: {};
  showOnTabPanelMenu?: {};
  showOnCategoryMenu?: {};
  showOnFooterMenu?: {};
}

const Index: React.FC<TabContent> = ({ tab, tabField }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useRef<any>(null);

  const getCategories = async () => {
    const obj: FilterObj = {
      sortField: tabField,
      sortOrder: 1,
      filters: {},
    };

    obj.filters[tab] = { value: true, matchMode: 'equals' };
    obj.filters['active'] = { value: true, matchMode: 'equals' };

    const query = QueryBuilderHelper.get(obj);

    //Work around of the typescript, should filters non active categories
    // const query = QueryBuilderHelper.get({});

    setLoading(true);

    try {
      const allCategories = await CategoryService.getCategories(query);
      const allCategoriesData = allCategories?.resultData?.page;

      if (allCategoriesData) {
        setOffers(allCategories.resultData?.page);
      }
    } catch (error: any) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.friendlyMessage,
        life: 3000,
      });
    }

    setLoading(false);
  };

  const onColReorder = () => {
    toast.current.show({
      severity: 'success',
      summary: 'Rows Reordered',
      life: 3000,
    });
  };

  useEffect(() => {
    getCategories();
  }, []);

  const columns = [
    { field: 'name', header: 'Name' },
    { field: tabField, header: 'Trending Index' },
  ];
  const dynamicColumns = columns.map(col => {
    return (
      <Column
        key={col.field}
        columnKey={col.field}
        field={col.field}
        header={col.header}
      />
    );
  });

  const onRowReorder = async (e: any) => {

    if (e.dropIndex === e.dragIndex) {
      return;
    }

    let startIndex;
    let endIndex;
    let categoryId;

    if (e.dropIndex > e.dragIndex) {

      // corrects the eror in the component, when drags downwards it adds to the drop index
      if (e.dropIndex === e.dragIndex + 1) {
        return;
      }
      const startElement = e.value[e.dropIndex - 1];
      categoryId = startElement._id;
      startIndex = startElement[tabField];
      const endElement = e.value[e.dropIndex - 2];
      endIndex = endElement[tabField];
    } else {
      const startElement = e.value[e.dropIndex];
      categoryId = startElement._id;
      startIndex = startElement[tabField];
      const endElement = e.value[e.dropIndex + 1];
      endIndex = endElement[tabField];
    }

    setLoading(true);

    try {
      await CategoryService.rankCategories(startIndex, endIndex, tabField,categoryId);


    } catch (error: any) {
      toast.current.show({
        severity: 'error',
        summary: 'Error while reodering, contact the suport team',
        life: 3000,
      });
    }

    // reset the offers in the screen with the new configuration
    await getCategories();

    onColReorder();
  };

  return (
    <div>
      <Toast ref={toast} />
      <div className="card">
        <DataTable
          value={offers}
          reorderableColumns
          onRowReorder={onRowReorder}
          onColReorder={onColReorder}
          responsiveLayout="scroll"
          emptyMessage="No categories found."
          lazy
          loading={loading}
        >
          <Column rowReorder style={{ width: '3em' }} />
          {dynamicColumns}
        </DataTable>
      </div>
    </div>
  );
};
export default Index;
