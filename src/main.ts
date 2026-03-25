import './styles/app.css';
import { createApp } from './app';

const container = document.querySelector<HTMLDivElement>('#app');

if (!container) {
  throw new Error('App root #app was not found.');
}

container.innerHTML = createApp();

