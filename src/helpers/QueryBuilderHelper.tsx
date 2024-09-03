import { DataTableFilterMetaData } from 'primereact/datatable';

export default class QueryBuilderHelper {
  /**
   * This is the basic get function
   * @param endpoint
   * @param query
   * @returns
   */
  static get(props: any) {
    let queryString = '?';

    if (props?.sortField && props.sortOrder) {
      queryString += `$sort=${props.sortOrder > 0 ? '' : '-'}${
        props?.sortField
      }`;
    }

    if (props.filters) {
      queryString += '&';
      let clientQuery = '';
      Object.keys(props.filters).forEach((fieldName: any) => {
        if (!props.filters) return;
        const field: DataTableFilterMetaData = props.filters[
          fieldName
        ] as DataTableFilterMetaData;

        if (field.value === '' && props.brandId === '') return;

        if (props.brandId && props.brandId !== '') {
          clientQuery = `&brandId_$eq=${props.brandId}`;
        }

        if (props.status && props.status !== '') {
          clientQuery = `&status_$eq=${props.status}`;
        }

        if (props.type && props.type !== '') {
          clientQuery += `&type=${props.type}`;
        }

        const encodedFieldValue = encodeURIComponent(field.value);

        switch (field.matchMode) {
          case 'contains':
            queryString += `$${fieldName}_$like=%${encodedFieldValue}%`;
            break;
          case 'equals':
            queryString += `&$${fieldName}_$eq=${encodedFieldValue}`;
            break;
          case 'custom':
            queryString += `&$search=${encodedFieldValue}${clientQuery}`;
            break;
          default:
        }
      });
    }

    if (props.page !== undefined) {
      queryString += `&$offset=${props.page * props.rows}&$limit=${props.rows}`;
    }

    return queryString;
  }
}
