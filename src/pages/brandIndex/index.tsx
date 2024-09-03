import { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import BrandService from '../../services/BrandService';

const Index = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useRef<any>(null);

  const getBrands = async () => {
    setLoading(true);
    try {
      const allBrands = await BrandService.getBrands('?$sort=trendingIndex');
      const allBrandsData = allBrands?.resultData?.page;

      if (allBrandsData) {
        setBrands(allBrands.resultData?.page);
        setBrands(allBrands.resultData?.page);
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
    getBrands();
  }, []);

  const columns = [
    { field: 'name', header: 'Name' },
    { field: 'trendingIndex', header: 'Trending Index' },
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

    const whoChangePosition = e.value[e.dragIndex];
    let startIndex;
    let endIndex;

    if (e.dropIndex > e.dragIndex) {
      // corrects the eror in the component, when drags downwards it adds to the drop index
      if (e.dropIndex === e.dragIndex + 1) {
        return;
      }
      const startElement = e.value[e.dropIndex - 1];
      startIndex = startElement.trendingIndex;
      const endElement = e.value[e.dropIndex - 2];
      endIndex = endElement.trendingIndex;
    } else {
      const startElement = e.value[e.dropIndex];
      startIndex = startElement.trendingIndex;
      const endElement = e.value[e.dropIndex + 1];
      endIndex = endElement.trendingIndex;
    }

    setLoading(true);
    try {
      await BrandService.rankBrands(
        whoChangePosition._id,
        startIndex,
        endIndex,
      );
    } catch (error: any) {
      toast.current.show({
        severity: 'error',
        summary: 'Error while reodering, contact the suport team',
        detail: error,
        life: 3000,
      });
    }

    // reset the offers in the screen with the new configuration
    await getBrands();
    onColReorder();
  };

  return (
    <div>
      <Toast ref={toast} />
      <div className="card">
        <DataTable
          value={brands}
          reorderableColumns
          onRowReorder={onRowReorder}
          onColReorder={onColReorder}
          responsiveLayout="scroll"
          emptyMessage="No brands found."
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
