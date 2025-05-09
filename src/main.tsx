import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { FirebaseProvider } from './lib/context.tsx'
import { Toaster } from "./components/ui/sonner"
import { ToastContainer} from 'react-toastify';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <FirebaseProvider>
    <App />
    <Toaster />
    <ToastContainer />
    </FirebaseProvider>
    </BrowserRouter>
  </StrictMode>,
)
