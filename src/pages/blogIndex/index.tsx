import { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import BlogService from '../../services/BlogService';

const Index = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useRef<any>(null);

  const getBlogs = async () => {
    setLoading(true);
    try {
      const allBlogs = await BlogService.getBlogs('?$sort=trendingIndex');
      const allBlogsData = allBlogs?.resultData?.page;

      if (allBlogsData) {
        setBlogs(allBlogs.resultData?.page);
        setBlogs(allBlogs.resultData?.page);
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
    getBlogs();
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
      await BlogService.rankBlogs(whoChangePosition._id, startIndex, endIndex);
    } catch (error: any) {
      toast.current.show({
        severity: 'error',
        summary: 'Error while reodering, contact the suport team',
        detail: error,
        life: 3000,
      });
    }

    // reset the offers in the screen with the new configuration
    await getBlogs();
    onColReorder();
  };

  return (
    <div>
      <Toast ref={toast} />
      <div className="card">
        <DataTable
          value={blogs}
          reorderableColumns
          onRowReorder={onRowReorder}
          onColReorder={onColReorder}
          responsiveLayout="scroll"
          emptyMessage="No blogs found."
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
