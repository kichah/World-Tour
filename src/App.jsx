import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
//files
import Product from './pages/Product';
import Pricing from './pages/Pricing';
import Homepage from './pages/Homepage';
import PageNotFound from './pages/PageNotFound';
import AppLayout from './pages/AppLayout';
import Login from './pages/Login';
import CityList from './components/CityList';
import City from './components/City';
import CountryList from './components/CountryList';
import Form from './components/Form';
const BASE_URL = 'http://localhost:9000';
function App() {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const response = await fetch(`${BASE_URL}/cities`);
        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error('Error fetching cities:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route index path='/' element={<Homepage />} />
        <Route path='pricing' element={<Pricing />} />
        <Route path='product' element={<Product />} />
        <Route path='login' element={<Login />} />
        <Route path='*' element={<PageNotFound />} />
        <Route path='app' element={<AppLayout />}>
          <Route index element={<Navigate replace to='cities' />} />
          <Route
            path='cities'
            element={<CityList cities={cities} isLoading={isLoading} />}
          />
          <Route path='cities/:id' element={<City />} />
          <Route
            path='countries'
            element={<CountryList isLoading={isLoading} cities={cities} />}
          />
          <Route path='form' element={<Form />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
