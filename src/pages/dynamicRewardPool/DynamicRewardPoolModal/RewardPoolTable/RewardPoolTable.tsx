/* eslint-disable */
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Tag } from 'primereact/tag';
import React, { FormEvent, useState } from 'react';
import BlockingLoader from '../../../../components/BlockingLoader';
import DropdownRewards from '../../../../components/DropdownRewards'
import DynamicRewardPoolService from '../../../../services/DynamicRewardPoolService';
import './RewardPoolTable.scss';
import constants from '../../../../shared/constants';

interface RewardPoolTableProps {
  tableName: string
  rewardPool: any[];
  dRP: any,
  groupName: string,
  clientId: string,
  poolId: string,
  updateList: () => void
}

const RewardPoolTable: React.FC<RewardPoolTableProps> = ({ tableName, rewardPool, groupName, poolId, dRP, clientId, updateList }) => {
  const [addFormActive, setAddForm] = useState(false);
  const [deletionId, setDeletionId] = useState('');
  const [editionId, setEditionId] = useState('');
  const [rewardId, setRewardId] = useState('');
  const [alias, setAlias] = useState('');
  const [rules, setRules] = useState('');
  const [aliasError, setAliasError] = useState('');
  const [rulesError, setRulesError] = useState('');
  const [rewardActive, setRewardActive] = useState(false);
  const [rewardVisible, setRewardVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);

  function resetForm() {
    setEditionId('');
    setRewardId('');
    setAlias('');
    setRules('');
    setRewardActive(false);
    setRewardVisible(false);
  }

  async function deleteRewardItemGroup(id: string) {
    setLoading(true);
    const response = await DynamicRewardPoolService.deleteDynamicRewardPoolsItem(id);
    setLoading(false);
    if (response && response.resultData) {
      updateList();
    }
  }
  const tableButtons = (tableName: string, rewardItem: any) => {

    async function setEdition(item: any) {
      setAddForm(true);
      setEditionId(item._id);
      setRewardId(item.reward_id);
      setAlias(item.alias);
      setRules(JSON.stringify(item.rules));
      setRewardActive(item.active);
      setRewardVisible(item.visible);
    }

    return (<div style={{ display: "flex", justifyContent: 'space-around' }}>
      <Button icon="pi pi-pencil" className="p-button-rounded p-button-success" type='button' onClick={() => setEdition(rewardItem)}></Button>
      <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" type='button' onClick={() => setDeletionId(rewardItem._id)}></Button>
    </div>)
  }

  async function submitForm(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    resetForm();
    setAddForm(false);
    let rulesJSON = {};
    try {
      rulesJSON = JSON.parse(rules);
    } catch (error) {
      //log
    }
    const drpItem = {
      reward_id: rewardId,
      alias,
      rules: rulesJSON,
      active: rewardActive,
      visible: rewardVisible,
      type: groupName,
      reward_pool_dynamic_id: poolId
    };
    if (editionId) {
      const response = await DynamicRewardPoolService.updatetDynamicRewardPoolsItem(editionId, drpItem);
      if (response && response.resultData && response.resultData[0]) {
        const newPool = [...rewardPool];
        const poolIndex = newPool.findIndex(item => item._id === editionId);
        newPool[poolIndex] = response.resultData[0];
        updateList();
      }
      setLoading(false);
    } else {
      const response = await DynamicRewardPoolService.saveDynamicRewardPoolsItem(drpItem);
      if (response && response.resultData) {
        updateList();
      }
      setLoading(false);
    }
  }

  function validateAlias() {
    const regex = /^\w+$/;
    if (regex.test(alias)) {
      setAliasError('');
    } else {
      setAliasError('Invalid alias');
    }

    const aliasAlreadyUsed = rewardPool.findIndex(rewardItem => {
      if (alias === rewardItem._id) {
        return false;
      }
      return alias === rewardItem.alias;
    }) > -1;
    if (aliasAlreadyUsed) {
      setAliasError('Alias already in use');
    }
  }

  function validateRules() {
    try {
      let item;
      if (rules) {
        item = JSON.parse(rules);
        console.log(item);
        if (typeof item !== "object" || item === null) {
          setRulesError('Invalid JSON');
        }
        setRulesError('');
      } else {
        setRulesError('');
      }
    } catch (error) {
      setRulesError('Invalid JSON');
    }
  }

  const disableFormSubmition = function () {
    const rewardAlreadyUsed = rewardPool.findIndex(rewardItem => {
      if (editionId === rewardItem._id) {
        return false;
      }
      return rewardId === rewardItem.reward_id;
    }) > -1;

    if (!rewardId || rewardAlreadyUsed || aliasError || rulesError) return true;

  };

  return (


    <div>
      <BlockingLoader isLoading={isLoading} />
      <h4>{tableName}</h4>
      <DataTable value={rewardPool} paginator className="p-datatable-customers" rows={5}
        dataKey="id" rowHover
        filterDisplay="menu" responsiveLayout="scroll"
        emptyMessage="No rewards found.">
        <Column field="name" header="Reward Name" sortable />
        <Column field="alias" header="Alias" sortable />
        <Column field="rules" header="Rules" sortable body={data => JSON.stringify(data.rules)} />
        <Column field="active" header="Active" sortable body={(data) => data.active ? (<Tag className="mr-2" severity="success" value="True" />) : (<Tag className="mr-2" severity="warning" value="False"></Tag>)} />
        <Column field="visible" header="Visible" sortable body={(data) => data.visible ? (<Tag className="mr-2" severity="success" value="True" />) : (<Tag className="mr-2" severity="warning" value="False"></Tag>)} />
        <Column header="Edit/Remove" body={tableButtons.bind(this, 'sharerPreReward')} />
      </DataTable>
      <div className='formBox'>
        <Button type='button' className="openFormButton" onClick={() => { resetForm(); setAddForm(!addFormActive); }}>{addFormActive ? 'Close' : 'Add'}</Button>
        {addFormActive &&
          <form onSubmit={submitForm} onKeyPress={e => {
            e.key === constants.KEYPRESS.ENTER && e.preventDefault();
          }} className='p-grid' style={{ marginTop: 10 }}>
            <div className="p-col">
              <span className="p-float-label">
                <DropdownRewards id='rewardId' value={rewardId} className='' onChange={(e: any) => { setRewardId(e.value) }} clientId={clientId}></DropdownRewards>
              </span>
            </div>
            <div className="p-col">
              <span className="p-float-label">
                <InputText id='alias' className={aliasError && 'p-invalid'} value={alias} onChange={e => setAlias(e.target.value)} onBlur={validateAlias} />
                <label htmlFor="alias">Alias</label>
                <small id="username2-help" className="p-error block">{aliasError}</small>
              </span>
            </div>
            <div className="p-col">
              <span className="p-float-label">
                <InputText id='rules' className={rulesError && 'p-invalid'} value={rules} onChange={e => setRules(e.target.value)} onBlur={validateRules} />
                <label htmlFor="rules">Rules</label>
                <small id="username2-help" className="p-error block">{rulesError}</small>
              </span>
            </div>
            <div className="p-col checkboxCol">
              <Checkbox inputId="active" value="active" onChange={(e) => setRewardActive(!rewardActive)} checked={rewardActive}></Checkbox>
              <label htmlFor="active" className='p-checkbox-label'>Active</label>
            </div >
            <div className="p-col checkboxCol">
              <Checkbox inputId="visible" value="visible" onChange={(e) => setRewardVisible(!rewardVisible)} checked={rewardVisible}></Checkbox>
              <label htmlFor="visible" className='p-checkbox-label'>Visible</label>
            </div>
            <Button className='submitFormButton' disabled={disableFormSubmition()} type='submit'>{editionId ? 'Save' : 'Add'}</Button>
          </form >}
      </div>
      <ConfirmDialog visible={!!deletionId} onHide={() => setDeletionId('')} message="Are you sure you want to delete?"
        header="Confirmation" icon="pi pi-exclamation-triangle" accept={() => deleteRewardItemGroup(deletionId)} reject={() => setDeletionId('')} />

    </div >
  );
};

export default RewardPoolTable;
