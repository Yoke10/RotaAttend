//@ts-nocheck
import { Route, Routes } from "react-router-dom"
import Signin from "./Pages/Signin"
import Dashboard from "./Pages/Dashboard"
import EvenPage from "./Pages/EvenPage"
import Management from "./Pages/Management"
import ProtectedRoute from './components/ProtectedRoute'
const App = () => {
  return (
      <Routes>
        <Route path='/sign-in' element={<Signin/>}/>
        <Route path='/' element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
        <Route path='/:id' element={<ProtectedRoute><EvenPage/></ProtectedRoute>}/>
        <Route path='/RotractEvent/:id' element={<Management/>}/>



        
      </Routes>
  )
}

export default App