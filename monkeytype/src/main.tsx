import { createRoot } from 'react-dom/client'
import App from './components/App.tsx'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import {CookiesProvider} from 'react-cookie'
createRoot(document.getElementById('root')!).render(
  <CookiesProvider>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App/>} />
      </Routes>
    </BrowserRouter>
  </CookiesProvider>
)
