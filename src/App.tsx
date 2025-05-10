//@ts-nocheck
import { Route, Routes } from "react-router-dom"
import Signin from "./Pages/Signin"
import Dashboard from "./Pages/Dashboard"
import EvenPage from "./Pages/EvenPage"
import Management from "./Pages/Management"

const App = () => {
  return (
      <Routes>
        <Route path='/sign-in' element={<Signin/>}/>
        <Route path='/' element={<Dashboard/>}/>
        <Route path='/:id' element={<EvenPage/>}/>
        <Route path='/RotractEvent/:id' element={<Management/>}/>



        
      </Routes>
  )
}

export default App