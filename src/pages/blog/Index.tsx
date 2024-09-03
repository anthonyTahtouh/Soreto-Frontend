/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useRef } from 'react';
import { Column } from 'primereact/column';
import {
  DataTable,
  DataTableFilterMeta,
  DataTableProps,
  DataTableSortOrderType,
} from 'primereact/datatable';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { Dialog } from 'primereact/dialog';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { useForm } from 'react-hook-form';
import { Tooltip } from 'primereact/tooltip';
import BlogService from '../../services/BlogService';
import MpBlog from '../../entities/mpBlog';
import QueryBuilderHelper from '../../helpers/QueryBuilderHelper';
import DropdownMpBrand from '../../components/DropdownMpBrand';

interface CustomDataTableProps {
  first: number;
  rows: number;
  page: number;
  sortField: string;
  sortOrder: DataTableSortOrderType;
  filters: { name: { value: string; matchMode: string } };
  brandId: string;
}

const BlogsPage = () => {
  const emptyBlog: MpBlog = new MpBlog();
  const navigate = useNavigate();

  const filterDefinition: DataTableFilterMeta = {
    name: { value: '', matchMode: 'contains' },
  };

  // TODO: Get sucess message to display toast
  // const { state } = useLocation();
  // const sucessMsg =
  // typeof state === 'object' && state.SucessMsg ? state.SucessMsg : false;

  const [deleteBlogDialog, setDeleteBlogDialog] = useState<boolean>(false);
  const [deleteBlogsDialog, setDeleteBlogsDialog] = useState<boolean>(false);
  const [blog, setBlog] = useState<MpBlog>(emptyBlog);
  const [blogs, setBlogs] = useState<Array<MpBlog>>([]);
  const [selectedBlogs, setSelectedBlogs] = useState<Array<MpBlog>>([]);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<any>(null);
  const [filters, setFilters] = useState(filterDefinition);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [tableProps, setTableProps] = useState<CustomDataTableProps>({
    first: 0,
    rows: 10,
    page: 0,
    sortField: 'name',
    sortOrder: 1,
    filters: {
      name: { value: '', matchMode: 'custom' },
    },
    brandId: '',
  });

  const [brandId, setBrandId] = useState();

  const toast = useRef<any>(null);

  const dt = useRef<any>(null);

  const getBlogs = async () => {
    // set state as loading
    setLoading(true);

    const query = QueryBuilderHelper.get(tableProps as DataTableProps);

    try {
      // fetch data from api
      const data = await BlogService.getBlogs(query);

      if (data?.resultData?.page) {
        setBlogs(data.resultData.page);
        setTotalRecords(data.resultData.totalCount);
      }
    } catch (error: any) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.friendlyMessage,
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBlogs();
  }, [tableProps]);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(MpBlog.schemaValidation()),
  });

  const formatDate = (date: any) => {
    const dateFormat = new Date(date);
    return dateFormat.toLocaleDateString('en-GB'); // dd/mm/yyyy
  };

  const openNew = () => {
    setBlog(emptyBlog);
    reset({ blog });
    setSubmitted(false);
    navigate(`/marketplace/blogs/newBlog`, { replace: true });
  };

  const hideDeleteBlogDialog = () => {
    setDeleteBlogDialog(false);
  };

  const hideDeleteBlogsDialog = () => {
    setDeleteBlogsDialog(false);
  };

  const editBlog = (blogToBeEdited: MpBlog) => {
    navigate(`/marketplace/blogs/${blogToBeEdited._id}`, { replace: true });
  };

  const deleteSingleBlog = async (BlogId: any) => {
    try {
      await BlogService.deleteBlog(BlogId);
      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Blog Deleted',
        life: 3000,
      });
    } catch (error: any) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.friendlyMessage,
        life: 3000,
      });
    }
  };

  const openSingleBlogDialog = () => {
    setDeleteBlogDialog(true);
  };

  const confirmDeleteSelected = () => {
    setDeleteBlogsDialog(true);
  };

  // delete from the list of selected offers
  const deleteSelectedBlogs = async (isMultipleRow = true, blogId?: string) => {
    if (isMultipleRow) {
      selectedBlogs.forEach(async singleOfferFromSelection => {
        await deleteSingleBlog(singleOfferFromSelection._id);
      });
      await getBlogs();
    } else {
      await deleteSingleBlog(blogId);
    }

    // close the popupus
    hideDeleteBlogDialog();
    hideDeleteBlogsDialog();

    // Reset select Product
    setSelectedBlogs([]);

    // get all remaining blogs
    await getBlogs();
  };

  const leftToolbarTemplate = () => {
    return (
      <>
        <Button
          label="New"
          icon="pi pi-plus"
          className="p-button-success p-mr-2 p-mb-2"
          onClick={openNew}
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          className="p-button-danger p-mb-2"
          onClick={confirmDeleteSelected}
          disabled={!selectedBlogs || !selectedBlogs.length}
        />
      </>
    );
  };

  const nameBodyTemplate = (rowData: MpBlog) => {
    const showNameText = `.name${rowData._id}`;
    const classText = `name${rowData._id} data-pr-tooltip`;
    const text =
      rowData.name.length > 40
        ? `${rowData.name.substring(0, 40)}...`
        : rowData.name;
    return (
      <>
        <Tooltip target={showNameText} content={rowData.name} />
        <span className={classText}>{text}</span>
      </>
    );
  };

  const titleBodyTemplate = (rowData: MpBlog) => {
    const showTitleText = `.title${rowData._id}`;
    const classText = `title${rowData._id} data-pr-tooltip`;
    const text =
      rowData.title.length > 40
        ? `${rowData.title.substring(0, 40)}...`
        : rowData.title;
    return (
      <>
        <Tooltip target={showTitleText} content={rowData.title} />
        <span className={classText}>{text}</span>
      </>
    );
  };

  const descriptionBodyTemplate = (rowData: MpBlog) => {
    const showDescriptionText = `.description_${rowData._id}`;
    const classText = `description_${rowData._id} data-pr-tooltip`;
    const text =
      rowData.description.length > 50
        ? `${rowData.description.substring(0, 50)}...`
        : rowData.description;
    return (
      <>
        <Tooltip target={showDescriptionText} content={rowData.description} />
        <span className={classText}>{text}</span>
      </>
    );
  };

  const activeBodyTemplate = (rowData: MpBlog) => {
    return (
      <>
        <Checkbox checked={rowData.active} />
      </>
    );
  };

  const publishDateBodyTemplate = (rowData: MpBlog) => {
    const date = formatDate(rowData.publishedDate);
    return <>{date}</>;
  };

  const cardImageBodyTemplate = (rowData: MpBlog) => {
    return (
      <>
        <img
          src={rowData.cardImageUrl}
          alt={rowData.cardImageUrl}
          className="product-image"
        />
      </>
    );
  };

  const urlIdBodyTemplate = (rowData: MpBlog) => {
    return <>{rowData.urlId}</>;
  };

  const coverTitleBodyTemplate = (rowData: MpBlog) => {
    return <>{rowData.coverTitle}</>;
  };

  const coverDescriptionBodyTemplate = (rowData: MpBlog) => {
    const showCoverDescriptionText = `.coverDescription${rowData._id}`;
    const classText = `coverDescription${rowData._id} data-pr-tooltip`;
    const text =
      rowData.coverDescription.length > 100
        ? `${rowData.coverDescription.substring(0, 100)}...`
        : rowData.coverDescription;
    return (
      <>
        <Tooltip
          target={showCoverDescriptionText}
          content={rowData.coverDescription}
        />
        <span className={classText}>{text}</span>
      </>
    );
  };

  const coverImageUrlBodyTemplate = (rowData: MpBlog) => {
    return (
      <>
        <img
          src={rowData.coverImageUrl}
          alt={rowData.coverImageUrl}
          className="product-image"
        />
      </>
    );
  };

  const brandIdBodyTemplate = (rowData: MpBlog) => {
    return <>{rowData.brandId}</>;
  };

  const brandNameBodyTemplate = (rowData: MpBlog) => {
    return <>{rowData.brandName}</>;
  };

  const actionBodyTemplate = (rowData: MpBlog) => {
    return (
      <div className="actions">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success p-mr-2"
          onClick={() => editBlog(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => {
            setBlog(rowData);
            openSingleBlogDialog();
          }}
        />
      </div>
    );
  };

  const onGlobalFilterChange = (event: any) => {
    let searchQuery = event?.target?.value || '';
    if (searchQuery.length < 3) searchQuery = '';
    const newTableProp = { ...tableProps };

    // IF is selecting brand name
    if (event.target.id === 'clientId') {
      newTableProp.brandId = searchQuery._id;
      setBrandId(searchQuery);
    } else {
      newTableProp.filters.name.value = searchQuery;
    }
    setTableProps({ ...newTableProp });
  };

  const header = (
    <div className="table-header">
      <div>
        <h5 className="p-m-0">Manage Blogs</h5>
      </div>
      <div className="p-formgrid p-grid">
        <div className="p-field-checkbox p-col">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              type="search"
              placeholder="Search..."
              onInput={e => onGlobalFilterChange(e)}
            />
          </span>
        </div>
        <div className="p-field-checkbox p-col">
          <DropdownMpBrand
            id="clientId"
            value={brandId}
            onChange={(e: any) => onGlobalFilterChange(e)}
            placeholder="Select Brand"
          />
        </div>
      </div>
    </div>
  );

  const deleteBlogDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteBlogDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={async () => {
          await deleteSelectedBlogs(false, blog._id);
        }}
      />
    </>
  );

  const deleteBlogsDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteBlogsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={async () => {
          await deleteSelectedBlogs();
        }}
      />
    </>
  );

  const onPage = (event: any) => {
    setTableProps({ ...tableProps, ...event });
  };

  const onSort = (event: any) => {
    setTableProps({ ...tableProps, ...event });
  };

  const onFilter = (event: any) => {
    setTableProps({ ...tableProps, ...event });
  };

  return (
    <div className="p-grid crud-demo">
      <div className="p-col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar className="p-mb-4 p-toolbar" left={leftToolbarTemplate} />

          <DataTable
            ref={dt}
            value={blogs}
            selection={selectedBlogs}
            onSelectionChange={e => setSelectedBlogs(e.value)}
            lazy
            onSort={onSort}
            onPage={onPage}
            onFilter={onFilter}
            filters={filters}
            dataKey="_id"
            paginator
            rows={tableProps.rows}
            first={tableProps.first}
            rowsPerPageOptions={[5, 10, 25]}
            totalRecords={totalRecords}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} blogs"
            emptyMessage="No blogs found."
            globalFilter={globalFilter}
            globalFilterFields={['name', 'title']}
            header={header}
            loading={loading}
            sortField={tableProps.sortField}
            sortOrder={tableProps.sortOrder}
          >
            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />

            <Column
              field="name"
              header="Name"
              sortable
              body={nameBodyTemplate}
            />

            <Column
              field="title"
              header="Title"
              sortable
              body={titleBodyTemplate}
            />

            <Column
              field="description"
              header="Description"
              sortable
              body={descriptionBodyTemplate}
            />

            <Column
              field="active"
              header="Active"
              sortable
              body={activeBodyTemplate}
            />

            <Column
              field="publishedDate"
              header="Published Date"
              sortable
              body={publishDateBodyTemplate}
            />

            <Column
              field="cardImageUrl"
              header="Card Image Url"
              body={cardImageBodyTemplate}
            />

            <Column field="urlId" header="URL ID" body={urlIdBodyTemplate} />

            <Column
              field="coverTitle"
              header="Cover Title"
              body={coverTitleBodyTemplate}
            />

            <Column
              field="coverDescription"
              header="Cover Description"
              body={coverDescriptionBodyTemplate}
            />

            <Column
              field="coverImageUrl"
              header="Cover Image URL"
              body={coverImageUrlBodyTemplate}
            />

            <Column
              field="brandId"
              header="Brand ID"
              body={brandIdBodyTemplate}
            />

            <Column
              field="brandName"
              header="Brand Name"
              body={brandNameBodyTemplate}
              sortable
            />

            <Column body={actionBodyTemplate} />
          </DataTable>

          <Dialog
            visible={deleteBlogDialog}
            style={{ width: '550px' }}
            header="Confirm"
            modal
            footer={deleteBlogDialogFooter}
            onHide={hideDeleteBlogDialog}
            blockScroll
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle p-mr-3"
                style={{ fontSize: '2rem' }}
              />
              {blog && (
                <span>Are you sure you want to delete the selected blog?</span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteBlogsDialog}
            style={{ width: '550px' }}
            header="Confirm"
            modal
            footer={deleteBlogsDialogFooter}
            onHide={hideDeleteBlogsDialog}
            blockScroll
          >
            <div className="confirmation-content">
              <i
                className="pi pi-exclamation-triangle p-mr-3"
                style={{ fontSize: '2rem' }}
              />
              {blog && (
                <span>Are you sure you want to delete the selected blogs?</span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;
