import './App.css';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './components/Header';
import Footer from './components/Footer';
import ListProducts from './components/ListProducts';
import AddProduct from './components/AddProduct';
import Product from './components/Product';
import UpdateProduct from './components/UpdateProduct';
import DeleteProduct from './components/DeleteProduct';
import Login from './components/Login';
import Register from './components/Register';
import OAuth2RedirectHandler from './components/OAuth2RedirectHandler';
import { ToastProvider } from './components/ToastContext';
import { ThemeProvider } from './components/ThemeContext';

/**
 * Route protection wrapper. Inspects our Redux Auth slice state.
 * If user holds no token (isAuth=false), they are forcefully ejected back to /login.
 */
const ProtectedRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, so render the app layout and active route component
  return (
    <div className="app-layout">
      <Header />
      <main className="app-main">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <Routes>
            {/* Public Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />

            {/* Protected Application Routes wrapped in ProtectedRoute */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<ListProducts />} />
              <Route path="/productsList" element={<Navigate to="/" replace />} />
              <Route path="/addproduct" element={<AddProduct />} />
              <Route path="/viewProduct/:id" element={<Product />} />
              <Route path="/updateProduct/:id" element={<UpdateProduct />} />
              <Route path="/deleteProduct/:id" element={<DeleteProduct />} />
            </Route>
            
            {/* Fallback routing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
