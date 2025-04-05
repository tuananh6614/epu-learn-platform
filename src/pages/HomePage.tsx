
import { FC } from 'react';
import Index from './Index';

// This is a simple wrapper component around the existing Index component
// to maintain backward compatibility with the new import structure
export const HomePage: FC = () => {
  return <Index />;
};

export default HomePage;
