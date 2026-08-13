import { BrowserRouter, Route, Routes } from 'react-router'
import ProtectedRoutes from './routes/ProtectedRoutes'
import Navbar from './components/Navbar'
import Menu from './components/Menu'
import Home from './pages/Home'
import Users from './pages/Users'
import Roles from './pages/Roles'
import Devices from './pages/Devices'
import Rooms from './pages/Rooms'
import Cards from './pages/Cards'

function App() {
    document.body.classList.add('has-navbar-fixed-top')

    return (
        <BrowserRouter>
            <div>
                <Navbar />
                <div className="section columns">
                    <Menu />
                    <div className="column">
                        <Routes>
                            <Route element={<ProtectedRoutes allowedRoles={["LOKIT_ADMIN"]} />}>
                                <Route path='/' element={<Home />} />
                                <Route path="/users" element={<Users />} />
                                <Route path="/roles" element={<Roles />} />
                                <Route path="/rooms" element={<Rooms />} />
                                <Route path="/cards" element={<Cards />} />
                                <Route path="/devices" element={<Devices />} />
                            </Route>
                        </Routes>
                    </div>
                </div>
            </div >
        </BrowserRouter>
    )
}

export default App
