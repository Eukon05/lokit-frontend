import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import ProtectedRoutes from './routes/ProtectedRoutes'
import Home from './components/Home'
import Navbar from './components/Navbar'

function App() {
    return (
        <>
            <Navbar />
            <div className='content'>
                <BrowserRouter>
                <Routes>
                    <Route element={<ProtectedRoutes allowedRoles={["LOKIT_ADMIN"]} />}>
                        <Route path='/' element={<Home />} />
                    </Route>
                </Routes>
            </BrowserRouter>
            </div> 
        </>
    )
}

export default App
