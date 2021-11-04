//Opis komponentu - będzie zawierał części wspólne dla paneli użytkowników
import React from 'react';

import '../index.scss';

function AccessDenied(props) {

  return (
    <div>
      [Access Denied]
      Zawartość nie przeznaczona dla ciebie...
    </div>
  );
}

export default AccessDenied;