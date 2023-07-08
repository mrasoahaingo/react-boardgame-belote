import React from 'react';
import { render } from 'react-dom';

import App from './App';

for (let i = 0; i < 4; i++) {
  const rootElement = document.getElementById(`player${i}`);
  render(<App playerID={`${i}`} />, rootElement);
}
