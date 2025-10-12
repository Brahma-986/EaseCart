import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import { AppProvider } from './context/AppContext'
import App from './App.jsx'
import './index.css'

const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppProvider>
        <BrowserRouter future={router.future}>
          <App />
        </BrowserRouter>
      </AppProvider>
    </Provider>
  </React.StrictMode>
)
