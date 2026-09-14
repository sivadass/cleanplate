import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'cleanplate/dist/index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
