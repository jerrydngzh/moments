import React from 'react'
import ReactDOM from 'react-dom/client'
import Page from './App.tsx'
import "./index.css"


//NOTE - why is page the entry point instead of <App/>?
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Page />
  </React.StrictMode>,
)
