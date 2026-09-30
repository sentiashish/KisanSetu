import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LabourApp from './LabourApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LabourApp />
  </StrictMode>,
)
