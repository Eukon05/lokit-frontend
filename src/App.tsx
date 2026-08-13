import { BrowserRouter, Route, Routes } from 'react-router'
import ProtectedRoutes from './routes/ProtectedRoutes'
import Navbar from './components/Navbar'
import Menu from './components/Menu'
import Home from './pages/Home'
import Users from './pages/Users'

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
                            </Route>
                        </Routes>
                    </div>
                </div>
            </div >
        </BrowserRouter>
    )
}

export default App
