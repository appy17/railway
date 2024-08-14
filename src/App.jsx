
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './components/Login'
import QRScanner from './components/QRScanner'

function App() {


  return (
    
<Routes>
  <Route path='/' element={<Login />}/>
  <Route path='/qrScanner' element={<QRScanner />}/>
</Routes>

    
     

  )
}

export default App
