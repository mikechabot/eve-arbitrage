import { useLocation } from 'react-router';

export const Orders = () => {
  const state = useLocation();
  console.log(state);
  return <span>Hello</span>;
};
