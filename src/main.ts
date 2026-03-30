import './styles/app.css';
import { mountApp } from './app';

const container = document.querySelector<HTMLDivElement>('#app');

if (!container) {
  throw new Error('App root #app was not found.');
}

void mountApp(container);
