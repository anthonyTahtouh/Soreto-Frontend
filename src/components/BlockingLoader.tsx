import Loader from './Loader/Loader';

interface LoaderProps {
  isLoading: boolean;
}

// eslint-disable-next-line react/prop-types
const BlockingLoader: React.FC<LoaderProps> = ({ isLoading }) => {
  return isLoading ? (
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: '#00000066',
        zIndex: 99,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        left: 0,
      }}
    >
      <Loader isLoading={isLoading} />
    </div>
  ) : (
    <></>
  );
};

export default BlockingLoader;
