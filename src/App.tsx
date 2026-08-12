import { BrowserRouter, Route, Routes } from 'react-router'
import ProtectedRoutes from './routes/ProtectedRoutes'
import Navbar from './components/Navbar'
import Menu from './components/Menu'
import Home from './components/Home'

function App() {
    document.body.classList.add('has-navbar-fixed-top')

    return (
        <div>
            <Navbar />
            <div className="section columns">
                <Menu />
                <div className="column">
                    <BrowserRouter>
                        <Routes>
                            <Route element={<ProtectedRoutes allowedRoles={["LOKIT_ADMIN"]} />}>
                                <Route path='/' element={<Home />} />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </div>
            </div>
        </div>
    )
}

export default App
