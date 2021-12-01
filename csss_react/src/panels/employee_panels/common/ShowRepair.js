import React, {useEffect} from 'react';

function ShowRepair(props) {

  useEffect(() => {
    const handleInvalidToken = e => {
      if (e.key === 'token' && e.oldValue && !e.newValue) {
        props.history.push('/');
      }
    }
    window.addEventListener('storage', handleInvalidToken)
    return function cleanup() {
      window.removeEventListener('storage', handleInvalidToken)
    }
  }, [props])

  return (
    <div className="">
      Ło panie
      {props.match.params.id}
    </div>
  );
}

export default ShowRepair;