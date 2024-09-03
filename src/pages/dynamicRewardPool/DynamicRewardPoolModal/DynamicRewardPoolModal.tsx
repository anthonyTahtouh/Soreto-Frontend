/* eslint-disable */
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React, { FormEvent, useEffect, useState } from 'react';
import BlockingLoader from '../../../components/BlockingLoader';
import DropdownClients from '../../../components/DropdownClients';
import DynamicRewardPoolService from '../../../services/DynamicRewardPoolService';
import constants from '../../../shared/constants';
import './DynamicRewardPoolModal.scss';
import RewardPoolTable from './RewardPoolTable/RewardPoolTable';

interface DynamicRewardPoolModalProps {
  dRP: any
}

const DynamicRewardPoolModal: React.FC<DynamicRewardPoolModalProps> = ({ dRP }) => {
  const [poolName, setPoolName] = useState('');
  const [clientId, setClientId] = useState('');
  const [poolId, setPoolId] = useState('');
  const [friendPreRewardItems, setFriendPreRewardItems] = useState<any[]>([]);
  const [friendPostRewardItems, setFriendPostRewardItems] = useState<any[]>([]);
  const [sharerPreRewardItems, setSharerPreRewardItems] = useState<any[]>([]);
  const [sharerPostRewardItems, setSharerPostRewardItems] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(false);

  async function getPoolItems() {
    setLoading(true);
    let dynamicPoolId = poolId;
    if (dRP && dRP._id) {
      dynamicPoolId = dRP._id;
    }
    const response = await DynamicRewardPoolService.getDynamicRewardPoolsItems(dynamicPoolId);
    const fullDRP = response?.resultData;
    setFriendPreRewardItems(fullDRP.friend_pre_reward_items);
    setFriendPostRewardItems(fullDRP.friend_post_reward_items);
    setSharerPreRewardItems(fullDRP.sharer_pre_reward_items);
    setSharerPostRewardItems(fullDRP.sharer_post_rewards_items);
    setLoading(false);
  }
  useEffect(() => {
    if ((dRP && dRP._id) || poolId) {
      getPoolItems();
    }
  }, [dRP, poolId]);


  const savePool = async (event: FormEvent) => {
    event.preventDefault();
    if (!disableSave) {
      if (poolId || dRP._id) {
        setLoading(true);
        const response = await DynamicRewardPoolService.saveDRP({ _id: dRP._id || poolId, name: poolName });
        setLoading(false);
      } else {
        setLoading(true);
        const response = await DynamicRewardPoolService.createDRP({ name: poolName, clientId });
        const responseId = response?.resultData[0];
        setPoolId(responseId);
        setLoading(false);
      }
    }
  };

  const disableSave = (!poolName || poolName === dRP.name) || !(dRP.clientId || clientId);



  return (
    <div>
      <BlockingLoader isLoading={isLoading} />
      <form onSubmit={savePool} onKeyPress={e => {
            e.key === constants.KEYPRESS.ENTER && e.preventDefault();
          }}>
        <div className="drp-form">
          <div className="p-field">
            <label htmlFor="name">Name</label>
            <InputText
              defaultValue={dRP.name}
              onChange={e => setPoolName(e.target.value)}
            />

          </div>

          <div className="p-field">
            <DropdownClients id="rewardPoolClient" disabled={dRP.clientId || poolId} value={dRP.clientId || clientId} onChange={(e: any) => !dRP.clientId && setClientId(e.value)} ></DropdownClients>
          </div>
          <div className='submit-button'>
            <Button label="Save" disabled={disableSave} style={{ height: 35 }} type='submit' />
          </div>
        </div>
      </form>
      {(dRP._id || poolId) &&
        <>
          <div className='p-grid'>
            <div className="p-col">
              <RewardPoolTable updateList={getPoolItems} poolId={dRP._id || poolId} clientId={dRP.clientId || clientId} tableName='Sharer Pre Reward' rewardPool={sharerPreRewardItems || []} dRP={dRP} groupName='sharer_pre' />
            </div>
            <div className="p-col">
              <RewardPoolTable updateList={getPoolItems} poolId={dRP._id || poolId} clientId={dRP.clientId || clientId} tableName='Sharer Post Reward' rewardPool={sharerPostRewardItems || []} dRP={dRP} groupName='sharer_post' />
            </div>
          </div>
          <div className='p-grid'>
            <div className="p-col">
              <RewardPoolTable updateList={getPoolItems} poolId={dRP._id || poolId} clientId={dRP.clientId || clientId} tableName='Friend Pre Reward' rewardPool={friendPreRewardItems || []} dRP={dRP} groupName='friend_pre' />
            </div>
            <div className="p-col">
              <RewardPoolTable updateList={getPoolItems} poolId={dRP._id || poolId} clientId={dRP.clientId || clientId} tableName='Friend Post Reward' rewardPool={friendPostRewardItems || []} dRP={dRP} groupName='friend_post' />
            </div>
          </div>
        </>
      }
    </div>
  );
};

export default DynamicRewardPoolModal;
