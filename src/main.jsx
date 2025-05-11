// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '~/App.jsx'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from '~/theme'

//Cau hinh reactToastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

//Cau hinh MUI Dialog
import { ConfirmProvider } from 'material-ui-confirm'

//Cau hinh Redux store
import { store } from '~/redux/store'
import { Provider } from 'react-redux'

//Cấu hình react-router-dom voi BrowserRouter
import { BrowserRouter } from 'react-router-dom'

// Cấu hình Redux-Persist
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import { injectStore } from '~/utils/authorizeAxios'
const persistor = persistStore(store)

//Ky thuat InjectStore
injectStore(store)


ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter basename='/'>
        <CssVarsProvider theme={theme}>
          <ConfirmProvider defaultOptions={{
            allowClose: false,
            dialogProps: { maxWidth: 'xs' },
            confirmationButtonProps: { color: 'secondary', variant: 'outlined' },
            buttonOrder: ['confirm', 'cancel'],
            cancellationButtonProps: { color: 'inherit' }
            // autoFocus: true
          }}>
            <GlobalStyles styles={{
              a: {
                textDecoration: 'none'
              }
            }} />
            <CssBaseline />
            <App />
            <ToastContainer theme='colored' position='bottom-left' />
          </ConfirmProvider>
        </CssVarsProvider>
      </BrowserRouter >
    </PersistGate>
  </Provider>
)
