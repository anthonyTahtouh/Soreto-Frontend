import classes from './Loader.module.scss';

interface LoaderProps {
  isLoading: boolean;
}

// eslint-disable-next-line react/prop-types
const Loader: React.FC<LoaderProps> = ({ isLoading }) => {
  return isLoading ? <div className={classes.loader} /> : <></>;
};

export default Loader;
