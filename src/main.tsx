import { createRoot } from 'react-dom/client'
import './i18n/index'
import App from './App.tsx'
import './index.css'

// Hide initial loader when React mounts
const hideInitialLoader = () => {
  const loader = document.getElementById('initial-loader');
  if (loader) {
    console.log('🚀 React mounted - hiding initial loader');
    loader.style.display = 'none';
  }
};

// Create root and render app
const root = createRoot(document.getElementById("root")!);
root.render(<App />);

// Hide loader after React renders
setTimeout(hideInitialLoader, 100);
