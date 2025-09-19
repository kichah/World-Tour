import { createContext, useEffect, useContext, useReducer } from 'react';
const BASE_URL = 'http://localhost:9000';

const CitiesContext = createContext();
const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: '',
};
function reducer(state, action) {
  switch (action.type) {
    case 'loading':
      return { ...state, isLoading: true };
    case 'cities/loaded':
      return { ...state, isLoading: false, cities: action.payLoad };
    case 'city/loaded':
      return { ...state, isLoading: false, currentCity: action.payLoad };
    case 'city/created':
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payLoad],
        currentCity: action.payLoad,
      };
    case 'city/deleted':
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payLoad),
      };
    case 'rejected':
      return { ...state, isLoading: false, error: action.payLoad };

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}
// eslint-disable-next-line react/prop-types
function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: 'loading' });
      try {
        const response = await fetch(`${BASE_URL}/cities`);
        const data = await response.json();
        dispatch({ type: 'cities/loaded', payLoad: data });
      } catch {
        dispatch({
          type: 'rejected',
          payLoad: 'There was an error loading data...',
        });
      }
    }
    fetchCities();
  }, []);
  // load the city
  async function getCity(id) {
    console.log(id, currentCity.id);
    if (Number(id) === currentCity.id) return;
    dispatch({ type: 'loading' });
    try {
      const response = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await response.json();
      dispatch({
        type: 'city/loaded',
        payLoad: data,
      });
    } catch {
      dispatch({
        type: 'rejected',
        payLoad: 'There was an error loading data...',
      });
    }
  }
  //create city
  async function createCity(newCity) {
    dispatch({ type: 'loading' });
    try {
      const response = await fetch(`${BASE_URL}/cities`, {
        method: 'POST',
        body: JSON.stringify(newCity),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      dispatch({ type: 'city/created', payLoad: data });
    } catch (error) {
      dispatch({
        type: 'rejected',
        payLoad: 'There was an error creating city.',
      });
    }
  }
  // delete city
  async function deleteCity(id) {
    dispatch({ type: 'loading' });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: 'DELETE',
      });

      dispatch({ type: 'city/deleted', payLoad: id });
    } catch {
      dispatch({
        type: 'rejected',
        payLoad: 'There was an error deleting city...',
      });
    }
  }
  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}
function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) {
    throw new Error('CitiesContext was used outside of its Provider');
  }
  return context;
}
export { CitiesProvider, useCities };
