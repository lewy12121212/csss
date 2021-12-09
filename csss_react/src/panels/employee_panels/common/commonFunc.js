import { useRef, useEffect } from 'react';

function useDidMount() {
  const didMountRef = useRef(true);
  
  useEffect(() => {
    didMountRef.current = false;
  }, []);
  return didMountRef.current;
};

export { useDidMount };