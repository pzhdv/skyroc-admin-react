import { resetAuth } from '@/features/auth';

const Component = () => {
  return null;
};

export const loader = async () => {
  resetAuth();

  return null;
};
export default Component;
