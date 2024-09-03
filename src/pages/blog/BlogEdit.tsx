/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable array-callback-return */
/* eslint-disable no-case-declarations */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { classNames } from 'primereact/utils';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { yupResolver } from '@hookform/resolvers/yup';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { Controller, useForm } from 'react-hook-form';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
import { TabPanel, TabView } from 'primereact/tabview';
import BlogService from '../../services/BlogService';
import UploadService from '../../services/UploadService';
import MpBlog from '../../entities/mpBlog';
import DropdownMpBrand from '../../components/DropdownMpBrand';
import Upload from '../../components/uploadComponent/Upload';
import constants from '../../shared/constants';
import Meta from '../../components/Meta';
import RankService from '../../services/RankService';
import EmailEditorComponent from './tabs/EmailEditorComponent';
import DropdownFlashCampaing from '../../components/DropdownFlashCampaign';

const BlogsPage = () => {
  const emptyBlog: MpBlog = new MpBlog();

  const [blog, setBlog] = useState<any>(emptyBlog);
  const [loading, setLoading] = useState(false);
  const [updateDialog, setUpdateDialog] = useState<boolean>(false);
  const [selectedUploadAsset, setSelectedUploadAsset] = useState<string>('');
  const [originalAsset, setOriginalAsset] = useState<any>(emptyBlog);
  const [uploading, setUploading] = useState<boolean>(false);
  const bodySourceUploadRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const emailEditorRef: any = useRef(null);
  const toast = useRef<any>(null);
  const formSubmit = useRef(null);
  const bodyContentInitial = useRef<any>('');
  const navigate = useNavigate();
  const [designContent, setDesignContent] = useState<string>();

  const { blogId } = useParams();

  useEffect(() => {
    window.addEventListener('message', function (e) {
      if (e.data.action === 'saveImg' || e.data.action === 'saveImgGroup') {
        const dataImage = e.data.body;
        fetch(dataImage)
          .then(res => {
            res.blob().then(async data => {
              const resultUrl = await UploadService.uploadFile(
                blog,
                'blog',
                'cardImageUrl',
                data,
              );

              const imgObj = {
                url: resultUrl,
                index: e.data.index,
                items: e.data.items,
                action:
                  e.data.action === 'saveImg' ? 'loadImg' : 'loadImgGroup',
              };

              const myIframe = document.getElementsByTagName('iframe')[0];
              myIframe?.contentWindow?.postMessage(imgObj, '*');
            });
          })
          .then(console.log);
      }
    });
  }, []);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(MpBlog.schemaValidation()),
  });

  const fillInBlog = (blogToBeEdited: MpBlog) => {
    if (!blogToBeEdited.meta) {
      // eslint-disable-next-line no-param-reassign
      blogToBeEdited.meta = emptyBlog.meta;
    }

    setBlog({ ...blogToBeEdited });
    reset(blogToBeEdited);
  };

  const getBlog = async () => {
    // set state as loading
    if (!blogId) {
      const trendingIndex = await RankService.getLastTrendingIndex('/blogs');
      emptyBlog.cardImageUrl = constants.IMAGE.EMPTY_IMAGE_URL;
      emptyBlog.coverImageUrl = constants.IMAGE.EMPTY_IMAGE_URL;
      emptyBlog.trendingIndex = trendingIndex.resultData.trendingIndex + 1;
      fillInBlog(emptyBlog);
      return;
    }

    setLoading(true);

    try {
      // fetch data from api
      const data = await BlogService.getBlog(blogId);
      fillInBlog(data.resultData);
      bodyContentInitial.current = data.resultData.bodyContent;
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

  const onInputChange = (e: any, name: string) => {
    let val;

    /**
     * The category, brand and offer dropdown use the whole object,
     * not just the _id, hence  val = ..._id if it's an object.
     * The '|| null' part is because the backend won't update the field if its undefined.
     */
    if (e.target) {
      if (e.target.type === 'checkbox') {
        val = e.target.checked;
      } else if (e.target.value?._id) {
        val = e.target.value?._id || null;
      } else if (Array.isArray(e.target.value)) {
        const arrayOfFlashCampaignIds = e.target.value.map(
          (selectedFlashCampaign: { _id: any }) => {
            return selectedFlashCampaign._id;
          },
        );

        val = arrayOfFlashCampaignIds;
      } else {
        val = e.target.value || null;
      }
    }

    const newEditedBlog: any = { ...blog };

    if (name === 'startDate' || name === 'endDate') {
      const date = new Date(val).toISOString();
      newEditedBlog[`${name}`] = date;
    } else {
      newEditedBlog[`${name}`] = val;
    }

    reset(newEditedBlog);
    setBlog(newEditedBlog);
  };

  const onInputNumberChange = (e: any, name: string) => {
    const newEditedBlog: any = { ...blog };

    const val = e.value || 0;
    newEditedBlog[`${name}`] = val;

    setBlog(newEditedBlog);
    reset(newEditedBlog);
  };

  const OnMetaInputChange = (e: any, name: string) => {
    let val = e.target.value || '';

    if (name === 'keywords' && val) {
      val = val.split(',').join();
    }

    const newEditedBlog: any = JSON.parse(JSON.stringify(blog));

    newEditedBlog.meta[`${name}`] = val;

    reset(newEditedBlog);
    setBlog(newEditedBlog);
  };

  const sanitize = (blog: any) => {
    const blogRef = JSON.parse(JSON.stringify(blog));
    if (
      blogRef.flashCampaignIds &&
      typeof blogRef.flashCampaignIds !== 'string'
    ) {
      blogRef.flashCampaignIds = JSON.stringify(blogRef.flashCampaignIds);
    }

    return blogRef;
  };

  const saveBlogService = async () => {
    setLoading(true);
    try {
      const newBlog = await BlogService.createBlog(sanitize(blog));

      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Blog Created',
        life: 3000,
      });

      // go to the edition page after sucess creation
      navigate(`/marketplace/blogs/${newBlog.resultData._id}`, {
        replace: true,
        state: { successMsg: true, blogId: newBlog.resultData._id },
      });
    } catch (error: any) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.friendlyMessage,
        life: 10000,
      });
    } finally {
      setLoading(false);
    }
  };

  const editBlogService = async () => {
    setLoading(true);
    try {
      await BlogService.saveBlog(sanitize(blog));
      toast.current.show({
        severity: 'success',
        summary: 'Successful',
        detail: 'Blog Updated',
        life: 3000,
      });
    } catch (error: any) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.friendlyMessage,
        life: 10000,
      });
    }
  };

  const [isReady, setReady] = useState(false);
  const onReady = () => {
    // editor is ready
    // you can load your template here;
    if (!isReady) {
      setReady(true);

      if (emailEditorRef?.current?.editor && blog.designContent) {
        emailEditorRef?.current?.editor?.loadDesign(
          JSON.parse(blog.designContent),
        );
        setDesignContent(blog.designContent);
      }
    }
  };

  useEffect(() => {
    if (isReady && emailEditorRef?.current) {
      emailEditorRef.current.addEventListener(
        'design:updated',
        function (data: any) {
          if (emailEditorRef) {
            emailEditorRef.current.editor.exportHtml((data: any) => {
              const { design } = data;

              setDesignContent(JSON.stringify(design));
            });
          }
        },
      );
    }
  }, [emailEditorRef, isReady]);

  function addCSSTagToHTMLString(htmlString: string, cssClass: string): string {
    const openTagRegex = /<a(\s+[^>]*)>/;

    const match = openTagRegex.exec(htmlString);

    if (match) {
      const openTag = match[0];
      const updatedOpenTag = openTag.replace('>', ` class='${cssClass}'>`);
      const updatedHTMLString = htmlString.replace(openTag, updatedOpenTag);

      return updatedHTMLString;
    }

    return htmlString;
  }

  const ganerateImage = (
    imageClassName: string,
    divClassName: string,
    values: any,
  ) => {
    const imgElement = document.createElement('img');
    imgElement.className = imageClassName;
    imgElement.src = values.src.url;

    const divElement = document.createElement('div');
    divElement.className = divClassName;

    if (values.action.values.href) {
      const aElement = document.createElement('a');
      aElement.setAttribute('cb-url', '');
      aElement.setAttribute('href', values.action.values.href);
      aElement.setAttribute('target', values.action.values.target);

      aElement.appendChild(imgElement);
      return aElement;
    }
    divElement.appendChild(imgElement);
    return divElement;
  };

  const generateBlogHTML = async () => {
    if (designContent) {
      blog.designContent = designContent;
      const mainElement = document.createElement('main');
      mainElement.className = 'BC_content';

      const design = JSON.parse(blog.designContent);

      design.body.rows.map(async (row: any) => {
        if (row.columns[0].contents.length <= 0) return;
        if (row.columns && row.columns.length >= 2) {
          const divImageRowElement = document.createElement('div');
          divImageRowElement.className = 'BC_imgTableRow';

          // eslint-disable-next-line no-restricted-syntax
          row.columns.map((column: any) => {
            if (column.contents.length <= 0) return;

            const image = ganerateImage(
              'imgSize',
              '',
              column.contents[0].values,
            );

            divImageRowElement.appendChild(image);
          });

          await mainElement.appendChild(divImageRowElement);
        } else {
          switch (row.columns[0].contents[0].type) {
            case 'image':
              const image = ganerateImage(
                'BC_imgFullSize',
                'BC_imgContent',
                row.columns[0].contents[0].values,
              );

              mainElement.appendChild(image);
              break;
            case 'text':
              const divParagraphRowElement = document.createElement('div');
              divParagraphRowElement.className = 'BC_row BC_paragraph';
              const value: string = row.columns[0].contents[0].values.text;

              const tag = 'BC_link';
              const updatedHTMLString = addCSSTagToHTMLString(value, tag);

              divParagraphRowElement.innerHTML = updatedHTMLString;
              mainElement.appendChild(divParagraphRowElement);
              break;
            case 'heading':
              const divTitleRowElement = document.createElement('div');
              divTitleRowElement.className = 'BC_row';
              const newElement = document.createElement('div');

              if (row.columns[0].contents[0].values.headingType === 'h1') {
                const headerText = document.createElement('h3');
                headerText.textContent = row.columns[0].contents[0].values.text;
                headerText.className = 'BC_title BC_colorGray';

                newElement.appendChild(headerText);
              } else if (
                row.columns[0].contents[0].values.headingType === 'h2'
              ) {
                const divSubTitleElement = document.createElement('div');
                divSubTitleElement.className = 'BC_subTitle';

                divSubTitleElement.innerHTML =
                  row.columns[0].contents[0].values.text;

                newElement.appendChild(divSubTitleElement);
              }

              divTitleRowElement.appendChild(newElement);

              mainElement.appendChild(divTitleRowElement);
              break;
            default:
              break;
          }
        }
      });

      const style = `
      <style>
      .BC_content {
        text-align: left;
        margin: auto;
        padding-top: 50px;
        font-family: Apercu;
        color: #334d5c;
        font-size: 18px;
        font-weight: 400;
        line-height: 25px;
        letter-spacing: 0em;
      }

      .BC_paragraph {
        text-align: left;
        font-family: Apercu;
        color: #334d5c;
        font-size: 18px;
        font-weight: 400;
        line-height: 25px;
        letter-spacing: 0em;
      }
  
      .blogSection {
        margin-bottom: 50px;
      }
  
      .BC_title {
        font-size: 24px;
        font-weight: 700;
        line-height: 30px;
        margin: 0px;
      }
      .BC_subTitle {
        font-size: 24px;
        font-weight: 700;
        line-height: 30px;
        margin: 0px;
        margin-top: 15px;
      }
      .BC_colorGray {
        color: gray;
      }

      .BC_imgContent {
        text-align: center;
        max-width: 100%;
        max-height: 100%;
        padding-bottom: 50px;
      }

      .BC_imgFullSize {
        width: 100%;
      }
  
      .BC_link {
        color: #f53855;
      }
  
      .imgSize {
        max-width: 100%;
        max-height: 100%;
      }
  
      .BC_imgTableRow {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        column-gap: 10px;
        max-width: 100%;
        max-height: 100%;
        justify-content: space-evenly;
      }
  
      .bulletList {
        line-height: 30px;
        padding: 0px;
      }
  
      ul {
        margin: 0px;
        padding-bottom: 20px;
      }
  
      .blogRow {
        margin: 0px;
        margin-bottom: 20px;
      }
  
      @media screen and (min-width: 768px) {
        .BC_content {
          width: 80%;
        }
      }
  
      @media screen and (min-width: 1220px) {
        .BC_content {
          max-width: 1180px;
        }
        .BC_imgTableRow {
          flex-wrap: inherit;
        }
      }  
      </style>
      `;

      mainElement.insertAdjacentHTML('afterbegin', style);
      blog.bodyContent = mainElement.outerHTML;
    }
  };

  const previewHtml = () => {
    BlogService.viewBlog(blog);
    toast.current.show({
      severity: 'success',
      summary: 'Successful',
      detail: 'Blog redirect with success!',
      life: 3000,
    });
  };

  // form submit button reference
  const onSubmit = async () => {
    const verifyMetaValue =
      blog.meta && Object.values(blog.meta).every(i => !i);

    if (verifyMetaValue) {
      blog.meta = null;
    }

    await generateBlogHTML();

    // If there is a blog ID, means that we are in editing and existing one else it is a new blog
    if (blogId) {
      editBlogService();
    } else {
      saveBlogService();
    }
  };

  const getFormErrorMessage = (name: string) => {
    return (
      errors[name] && <small className="p-error">{errors[name]?.message}</small>
    );
  };

  const bodySourceUpload = async (e: any) => {
    // set state as loading
    setUploading(true);

    try {
      const newObj = { ...blog };

      const file = e.files[0];
      const resultUrl = await UploadService.uploadFile(
        newObj,
        'blog',
        'bodySourceHtml',
        file,
      );

      newObj.bodySourceUrl = resultUrl;

      reset(newObj);
      setBlog(newObj);

      bodySourceUploadRef.current.clear();

      toast.current.show({
        severity: 'info',
        summary: 'Success',
        detail: 'File Uploaded',
      });
    } catch (error: any) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: error?.friendlyMessage,
        life: 3000,
      });
    } finally {
      if (bodySourceUploadRef.current?.clear) {
        bodySourceUploadRef.current.clear();
      }

      setUploading(false);
    }
  };

  useEffect(() => {
    getBlog();
  }, [blogId]);

  return (
    <div className="p-grid crud-demo">
      <div className="p-col-12">
        <div className="card">
          <Toast ref={toast} />
          <h5 className="p-m-0">{blogId ? 'Edit Blog' : 'New Blog'}</h5>
          <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyPress={e => {
              e.key === constants.KEYPRESS.ENTER && e.preventDefault();
            }}
            className="p-field p-col-12 p-md-12"
          >
            <div className="card">
              {/* if is edit, accordion is closed, if new blog, accordion is open */}
              <Accordion multiple activeIndex={blogId ? [] : [0]}>
                <AccordionTab header="Blog details">
                  <div className="p-formgrid p-grid">
                    <div className="p-field p-col-12  p-md-6">
                      <label htmlFor="name">Name</label>
                      <Controller
                        name="name"
                        control={control}
                        render={({ field, fieldState }) => (
                          <InputText
                            id={field.name}
                            style={{ width: '100%', display: 'block' }}
                            {...field}
                            autoFocus
                            onChange={e => onInputChange(e, 'name')}
                            className={classNames({
                              'p-invalid': fieldState.invalid,
                            })}
                          />
                        )}
                      />
                      {getFormErrorMessage('name')}
                    </div>

                    <div className="p-field p-col-12 p-md-6">
                      <label htmlFor="title">Title</label>
                      <Controller
                        name="title"
                        control={control}
                        render={({ field, fieldState }) => (
                          <InputText
                            id={field.name}
                            style={{ width: '100%', display: 'block' }}
                            {...field}
                            onChange={e => onInputChange(e, 'title')}
                            className={classNames({
                              'p-invalid': fieldState.invalid,
                            })}
                          />
                        )}
                      />
                      {getFormErrorMessage('title')}
                    </div>

                    <div className="p-field p-col-12 p-md-12">
                      <label htmlFor="description">Description</label>
                      <Controller
                        name="description"
                        control={control}
                        render={({ field, fieldState }) => (
                          <InputText
                            id={field.name}
                            style={{ width: '100%', display: 'block' }}
                            {...field}
                            onChange={e => onInputChange(e, 'description')}
                            className={classNames({
                              'p-invalid': fieldState.invalid,
                            })}
                          />
                        )}
                      />
                      {getFormErrorMessage('description')}
                    </div>
                  </div>

                  <div className="p-formgrid p-grid">
                    <div className="p-field p-col-1">
                      <label htmlFor="publishedDate">Is blog active</label>
                      <div className="p-field-checkbox">
                        <Checkbox
                          inputId="active"
                          name="active"
                          value={blog.active}
                          checked={blog.active}
                          onChange={e => onInputChange(e, 'active')}
                        />
                        <label htmlFor="active">Active</label>
                      </div>
                    </div>
                    <div className="p-field p-col">
                      <label htmlFor="publishedDate">Is blog invisible</label>
                      <div className="p-field-checkbox">
                        <Checkbox
                          inputId="invisible"
                          name="invisible"
                          value={blog.invisible}
                          checked={blog.invisible}
                          onChange={e => onInputChange(e, 'invisible')}
                        />
                        <label htmlFor="invisible">Invisible</label>
                      </div>
                    </div>

                    <div className="p-field p-col">
                      <label
                        htmlFor="Index"
                        className="p-mr-2"
                        style={{ display: 'block' }}
                      >
                        Trending index
                      </label>
                      <Controller
                        name="trendingIndex"
                        control={control}
                        render={({ field, fieldState }) => (
                          <InputNumber
                            id={field.name}
                            {...field}
                            value={blog.trendingIndex}
                            onValueChange={e =>
                              onInputNumberChange(e, 'trendingIndex')
                            }
                            mode="decimal"
                            useGrouping={false}
                            showButtons
                            className={classNames({
                              'p-invalid': fieldState.invalid,
                            })}
                          />
                        )}
                      />
                      {getFormErrorMessage('trendingIndex')}
                    </div>

                    <div className="p-field p-col">
                      <div className="p-field p-col">
                        <label
                          htmlFor="publishedDate"
                          style={{ display: 'block' }}
                        >
                          Published Date
                        </label>
                        <Controller
                          name="publishedDate"
                          control={control}
                          render={({ field, fieldState }) => (
                            <Calendar
                              dateFormat="dd/mm/yy"
                              id="publishedDate"
                              value={
                                blog.publishedDate &&
                                new Date(blog.publishedDate)
                              }
                              onChange={e => onInputChange(e, 'publishedDate')}
                              showOnFocus={false}
                              className={classNames({
                                'p-invalid': fieldState.invalid,
                              })}
                              showIcon
                            />
                          )}
                        />
                        {getFormErrorMessage('publishedDate')}
                      </div>
                    </div>
                    <div className="p-field p-col">
                      <label htmlFor="brandId" style={{ display: 'block' }}>
                        Brand
                      </label>
                      <Controller
                        name="brandId"
                        control={control}
                        render={({ field, fieldState }) => (
                          <DropdownMpBrand
                            id={field.name}
                            style={{ width: '100%', display: 'block' }}
                            {...field}
                            value={field.value}
                            onChange={(e: any) => {
                              onInputChange(e, 'brandId');
                            }}
                            className={classNames({
                              'p-invalid': fieldState.invalid,
                            })}
                          />
                        )}
                      />
                      {getFormErrorMessage('brandId')}
                    </div>
                    <div className="p-field p-col">
                      <label htmlFor="visibilityTags">Flash Campaign</label>
                      <Controller
                        name="flashCampaignIds"
                        control={control}
                        render={({ field }) => (
                          <DropdownFlashCampaing
                            id={field.name}
                            {...field}
                            value={field.value}
                            onChange={(e: any) => {
                              field.onChange(e.target.value);
                              onInputChange(e, 'flashCampaignIds');
                            }}
                            singleSelect={false}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="p-formgrid p-grid">
                    <div className="p-field p-col-12  p-md-5">
                      <label htmlFor="bodySourceUrl">Body Source URL</label>
                      <div className="p-inputgroup">
                        <Controller
                          name="bodySourceUrl"
                          control={control}
                          render={({ field, fieldState }) => (
                            <InputText
                              id={field.name}
                              style={{ width: '100%', display: 'block' }}
                              {...field}
                              onChange={e => onInputChange(e, 'bodySourceUrl')}
                              className={classNames({
                                'p-invalid': fieldState.invalid,
                              })}
                            />
                          )}
                        />

                        <div className="flex align-items-center">
                          {blog.bodySourceUrl && (
                            <a
                              href={blog.bodySourceUrl}
                              className="m-2 cursor-pointer"
                              target="_blank"
                              rel="noreferrer"
                            >
                              <span className="pi pi-arrow-up-right" />
                            </a>
                          )}
                        </div>

                        <div className="flex align-items-center">
                          <FileUpload
                            ref={bodySourceUploadRef}
                            chooseOptions={{
                              label: 'choose',
                              iconOnly: false,
                              icon: 'pi pi-upload',
                            }}
                            mode="basic"
                            name="bodySourceUrl"
                            accept=".html"
                            maxFileSize={1000000}
                            uploadHandler={bodySourceUpload}
                            customUpload
                            disabled={blog._id == null}
                          />
                        </div>
                      </div>

                      {getFormErrorMessage('bodySourceUrl')}
                    </div>

                    <div className="p-field p-col-12  p-md-6">
                      <label htmlFor="urlId">URL ID</label>
                      <Controller
                        name="urlId"
                        control={control}
                        render={({ field, fieldState }) => (
                          <InputText
                            id={field.name}
                            disabled={blogId != null}
                            style={{ width: '100%', display: 'block' }}
                            {...field}
                            onChange={e => onInputChange(e, 'urlId')}
                            className={classNames({
                              'p-invalid': fieldState.invalid,
                            })}
                          />
                        )}
                      />
                      {getFormErrorMessage('urlId')}
                    </div>

                    <div className="p-field p-col-12  p-md-6">
                      <label htmlFor="coverTitle">Cover title</label>
                      <Controller
                        name="coverTitle"
                        control={control}
                        render={({ field, fieldState }) => (
                          <InputText
                            id={field.name}
                            style={{ width: '100%', display: 'block' }}
                            {...field}
                            onChange={e => onInputChange(e, 'coverTitle')}
                            className={classNames({
                              'p-invalid': fieldState.invalid,
                            })}
                          />
                        )}
                      />
                      {getFormErrorMessage('coverTitle')}
                    </div>

                    <div className="p-field p-col-12  p-md-6">
                      <label htmlFor="coverDescription">
                        Cover Description
                      </label>
                      <Controller
                        name="coverDescription"
                        control={control}
                        render={({ field, fieldState }) => (
                          <InputText
                            id={field.name}
                            style={{ width: '100%', display: 'block' }}
                            {...field}
                            onChange={e => onInputChange(e, 'coverDescription')}
                            className={classNames({
                              'p-invalid': fieldState.invalid,
                            })}
                          />
                        )}
                      />
                      {getFormErrorMessage('coverDescription')}
                    </div>
                  </div>

                  <div className="p-formgrid p-grid pt-2">
                    <div className="p-field col-offset-2 p-col-4">
                      <Controller
                        name="cardImageUrl"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Upload
                            friendlyName="Blog Card Image Url"
                            isActive={updateDialog}
                            setIsActive={setUpdateDialog}
                            asset="cardImageUrl"
                            setSelectedAsset={setSelectedUploadAsset}
                            src={field.value}
                            isUploadButtonDisabled={!blog._id}
                            openDialog={setUpdateDialog}
                            brandUrlId={blog.brandUrlId}
                            section="blog"
                            originalAssetObj={blog}
                            setAsset={setBlog}
                            changedProperty={selectedUploadAsset}
                            resetModal={reset}
                            labelSize="380 x 380"
                          />
                        )}
                      />
                      {getFormErrorMessage('cardImageUrl')}
                    </div>

                    <div className="p-field p-col-4">
                      <Controller
                        name="coverImageUrl"
                        control={control}
                        render={({ field, fieldState }) => (
                          <Upload
                            friendlyName="Blog Cover Image Url"
                            isActive={updateDialog}
                            setIsActive={setUpdateDialog}
                            asset="coverImageUrl"
                            setSelectedAsset={setSelectedUploadAsset}
                            src={field.value}
                            isUploadButtonDisabled={!blog._id}
                            openDialog={setUpdateDialog}
                            brandUrlId={blog.brandUrlId}
                            section="blog"
                            originalAssetObj={blog}
                            setAsset={setBlog}
                            changedProperty={selectedUploadAsset}
                            resetModal={reset}
                            labelSize="1440 x 300"
                          />
                        )}
                      />
                      {getFormErrorMessage('coverImageUrl')}
                    </div>
                  </div>
                </AccordionTab>
              </Accordion>
            </div>
            <div>
              <TabView
                activeIndex={activeIndex}
                onTabChange={e => setActiveIndex(e.index)}
              >
                <TabPanel header="Blog Template">
                  <EmailEditorComponent
                    emailEditorRef={emailEditorRef}
                    onReady={onReady}
                  />
                </TabPanel>
              </TabView>
            </div>
            <Meta
              control={control}
              formErrors={errors}
              onChange={OnMetaInputChange}
              classNames={classNames}
              data={{ originalAssetObj: blog, setAsset: setBlog }}
              section="blog"
              reset={reset}
            />
            {/* Submit Bar */}
            <div className="p-col-12 p-justify-center">
              <Toolbar
                className="p-mb-12 p-toolbar p-justify-center"
                right={
                  <Button
                    label="Submit"
                    icon="pi pi-check"
                    // type="submit"
                    className="btn btn-primary"
                    onClick={() => (formSubmit.current as any).click()}
                  />
                }
                left={
                  <Button
                    disabled={!blog._id}
                    style={{ margin: '15px' }}
                    label="Preview"
                    type="button"
                    icon="pi pi-check"
                    className="btn btn-primary"
                    onClick={previewHtml}
                  />
                }
              />
            </div>
            <input type="button" hidden ref={formSubmit} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;
