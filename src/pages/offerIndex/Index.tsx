import { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Calendar } from 'primereact/calendar';
import OfferService from '../../services/OfferService';
import { formatDateMinutes } from '../../helpers/dateFormatter';
import './index.scss';

const Index = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<
    Date | Date[] | any | undefined
  >(null);
  const [checked, setChecked] = useState(false);
  const toast = useRef<any>(null);

  const handleClick = () => {
    if (checked) {
      setChecked(false);
    } else {
      setChecked(true);
    }
  };

  const changeDate = (e: any) => {
    setSelectedDate(e.value);
  };

  const mountOfferObj = (offerList: any) => {
    const offersI = offerList;

    offersI.map((field: any) => {
      const fieldI = field;
      if (fieldI.active) {
        fieldI.active = 'Active';
      } else {
        fieldI.active = 'Inactive';
      }

      fieldI.startDate = formatDateMinutes(fieldI.startDate);
      fieldI.endDate = formatDateMinutes(fieldI.endDate);
      return fieldI;
    });

    return offersI;
  };

  const getOffers = async () => {
    setLoading(true);
    try {
      const allOffers = await OfferService.getOffers('?$sort=trendingIndex');

      if (allOffers?.resultData?.page) {
        const objOffer = mountOfferObj(allOffers.resultData?.page);
        setOffers(objOffer);
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

  const filterOffers = async () => {
    setLoading(true);
    try {
      let period;
      let offer;

      if (selectedDate) {
        const date = new Date(selectedDate).toISOString().split('T')[0];
        const minutes = new Date(selectedDate).toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        });
        period = `&startDate_$lte=${date} ${minutes}&endDate_$gt=${date} ${minutes}`;
      } else {
        period = '';
      }

      const allOffers = await OfferService.getOffers(
        `?$sort=trendingIndex${period}`,
      );
      const allOffersData = allOffers?.resultData?.page;

      if (allOffersData) {
        const objOffer = mountOfferObj(allOffers.resultData?.page);

        if (checked) {
          offer = objOffer.filter((val: any) => val.active !== 'Inactive');
        } else {
          offer = objOffer;
        }

        setOffers(offer);
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
    getOffers();
  }, []);

  const rowClass = (data: any) => {
    return {
      'row-inactive': data.active === 'Inactive',
    };
  };

  const columns = [
    { field: 'brandName', header: 'Brand' },
    { field: 'name', header: 'Name' },
    { field: 'startDate', header: 'Start Date' },
    { field: 'endDate', header: 'End Date' },
    { field: 'active', header: 'Active' },
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

    // If is Active only return

    if (checked || selectedDate) {
      toast.current.show({
        severity: 'error',
        summary:
          'You cannot reorder the rows when the result is filtered. Please go back to the full result',
        life: 5000,
      });
      return;
    }
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
      const offerId = whoChangePosition._id;
      await OfferService.rankOffers(startIndex, endIndex, offerId);
    } catch (error: any) {
      toast.current.show({
        severity: 'error',
        summary: 'Error while reordering, contact the suport team',
        detail: error,
        life: 3000,
      });
    }

    // reset the offers in the screen with the new configuration
    await getOffers();
    onColReorder();
  };

  const header = (
    <div className="table-header">
      <div>
        <h5 className="p-m-0">Offers Index</h5>
      </div>
      <div className="p-formgrid p-grid">
        <div className="p-field p-col">
          <Calendar
            showTime
            dateFormat="dd/mm/yy"
            id="startDate"
            value={selectedDate}
            onChange={e => changeDate(e)}
            showOnFocus={false}
            showIcon
          />
        </div>
        <div className="p-field-checkbox p-col-4">
          <Checkbox
            inputId="binary"
            checked={checked}
            onChange={() => handleClick()}
          />
          <label htmlFor="binary">Active only</label>
        </div>
        <div className="p-field-checkbox">
          <Button label="Filter all" onClick={filterOffers} />
        </div>
      </div>
    </div>
  );
  return (
    <div>
      <div className="p-grid crud-demo">
        <div className="p-col-12">
          <Toast ref={toast} />
          <div className="card">
            <DataTable
              value={offers}
              reorderableColumns
              onRowReorder={onRowReorder}
              onColReorder={onColReorder}
              responsiveLayout="scroll"
              emptyMessage="No offers found."
              lazy
              loading={loading}
              rowClassName={rowClass}
              header={header}
            >
              <Column rowReorder style={{ width: '3em' }} />
              {dynamicColumns}
            </DataTable>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Index;
