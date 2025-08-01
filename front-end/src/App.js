import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.min.js"
import Header from './Components/Header';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Employee from './Pages/Employee';
import Products from './Pages/Products';
import Store from './Pages/Store';
import Category from './Pages/Category';
import PageMain from './Pages/PageMain';
import AddNewStore from './Pages/AddNewStore';
import EditStore from './Pages/EditStore';
import AddNewCategory from './Pages/AddNewCategory';
import EditCategory from './Pages/EditCategory';
import AddNewProduct from './Pages/AddNewProduct';
import EditProduct from './Pages/EditProduct';
import DetailsProduct from './Pages/DetailsProduct';
import ImportAndExport from './Pages/ImportAndExport';
import AddImportExport from './Pages/AddImportExport';
import EditImportExport from './Pages/EditImportExport';
import StoreInventory from './Pages/StoreInventory';
import DetailsImportExport from './Pages/DetailsImportExport';
import { useAuthStore } from "./store/authStore";
import React from 'react';
import AddNewUser from './Pages/AddNewUser';
import EditUser from './Pages/EditUser';
import Medicine from './Pages/Medicine';
import Invoices from './Pages/Invoices';
import AddNewMedicine from './Pages/AddNewMedicine';
import EditMedicine from './Pages/EditMedicine';

// protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  console.log("Is Authenticated:", isAuthenticated); // تحقق من حالة المصادقة  
  console.log("User:", user); // تحقق من بيانات المستخدم  

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return children;
};


function App() {

  const { checkAuth, isAuthenticated, isCheckingAuth } = useAuthStore();
  React.useEffect(() => {
    checkAuth(); // ✅ تحقق من المصادقة عند تحميل التطبيق
  }, []);

  if (isCheckingAuth) {
    return <h2>Loading...</h2>; // ✅ عرض تحميل أثناء التحقق
  }

  return (
    <div className="App">
      <Router>
        {isAuthenticated ? <Header /> : ""}

        <Routes>
          <Route path='/' element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>}>
            <Route path='/' element={<PageMain />} />
            <Route path='employee' element={<Employee />} />
            <Route path='add-new-user' element={<AddNewUser />} />
            <Route path='edit-user/:id' element={<EditUser />} />
            <Route path='store' element={<Store />} />
            <Route path='category' element={<Category />} />
            <Route path='products' element={<Products />} />
            <Route path='importandexport' element={<ImportAndExport />} />
            <Route path='medicine' element={<Medicine />} />
            <Route path='invoices' element={<Invoices />} />
          </Route>

          <Route path='/addnewstore' element={<ProtectedRoute> <AddNewStore /> </ProtectedRoute>} />
          <Route path='/editstore/:id' element={<ProtectedRoute> <EditStore /> </ProtectedRoute>} />
          <Route path="/store/:id/inventory" element={<ProtectedRoute> <StoreInventory /> </ProtectedRoute>} />

          <Route path='/addnewcategory' element={<ProtectedRoute> <AddNewCategory /> </ProtectedRoute>} />
          <Route path='/editcategory/:id' element={<ProtectedRoute> <EditCategory /> </ProtectedRoute>} />

          <Route path='/addnewproduct' element={<ProtectedRoute> <AddNewProduct /> </ProtectedRoute>} />
          <Route path='/editproduct/:id' element={<ProtectedRoute> <EditProduct /> </ProtectedRoute>} />
          <Route path='/detailsproduct/:id' element={<ProtectedRoute> <DetailsProduct /> </ProtectedRoute>} />

          <Route path='/add-import-export' element={<ProtectedRoute> <AddImportExport /> </ProtectedRoute>} />
          <Route path='/edit-import-export/:id' element={<ProtectedRoute> <EditImportExport /> </ProtectedRoute>} />
          <Route path='/details-import-export/:id' element={<ProtectedRoute> <DetailsImportExport /> </ProtectedRoute>} />

          <Route path='/add-new-medicine' element={<ProtectedRoute> <AddNewMedicine /> </ProtectedRoute>} />
          <Route path='/edit-medicine/:id' element={<ProtectedRoute> <EditMedicine /> </ProtectedRoute>} />

          <Route path='/login' element={<Login />} />
          <Route path="*" element={<h2>not found page</h2>} />
        </Routes>
      </Router>

    </div>
  );
}

export default App;
