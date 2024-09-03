import { useContext } from 'react';
import StoreContext from '../store/Context';

const useStore = () => {
  return useContext(StoreContext);
};

export default useStore;
