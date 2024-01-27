import { useEffect, useState } from 'react';

/**
 * Returns a stateful value represeting "is mounted" state.
 * Useful when you want your component to update, or side effects to run on mount
 */
export const useIsMountedEffect = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!isMounted) setIsMounted(true);
  }, []);

  return isMounted;
};
