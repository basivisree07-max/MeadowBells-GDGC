import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { playSound } from './sound';
import './index.css';

const root = document.createElement('div');
root.id = 'studio-app';
document.body.append(root);
if (location.pathname === '/studio') document.body.classList.add('studio-page');
const activate = (role?: 'customer' | 'admin') => {
  history.pushState({}, '', '/studio');
  root.classList.add('studio-active');
  document.body.classList.add('studio-page');
  if (role) window.dispatchEvent(new CustomEvent('studio-auth', { detail: role }));
  window.scrollTo(0, 0);
};
document.addEventListener('click', (event) => {
  if ((event.target as HTMLElement).closest('button')) playSound('click');
  const target = (event.target as HTMLElement).closest('#btnLoginCustomer, #btnLoginAdmin, #navJoinBtn');
  if (!target) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  activate(target.id === 'btnLoginAdmin' ? 'admin' : 'customer');
}, true);
window.addEventListener('popstate', () => { const active=location.pathname==='/studio';root.classList.toggle('studio-active',active);document.body.classList.toggle('studio-page',active); });
createRoot(root).render(<App />);
