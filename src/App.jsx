import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { Login, Signup, Home, MyItems, ListItems, NotFoundPage, ItemDetails, FooterPages, Results, EditProfile, Feedback, WelcomeScreen } from './Pages'
import { SearchProvider } from './context/searchContext'
import PrivateRoute from './context/PrivateRoute'
import AdminRoute from './context/AdminRoute'
import { Provider } from 'react-redux'
import store from './redux/store'
import { useState, useEffect } from 'react'
import Layout from './Layout'
import { Capacitor } from '@capacitor/core'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<Layout />} >
        <Route index element={<PrivateRoute> <Home /> </PrivateRoute>} />
        <Route path='myitems' element={<AdminRoute> <MyItems /> </AdminRoute>} />
        <Route path='listitem' element={<AdminRoute> <ListItems /> </AdminRoute>} />
        <Route path='edititem/:id' element={<AdminRoute> <ListItems /> </AdminRoute>} />
        <Route path='allItems/:itemId' element={<PrivateRoute> <ItemDetails /> </PrivateRoute>} />
        <Route path='myItems/:itemId' element={<PrivateRoute> <ItemDetails /> </PrivateRoute>} />
        <Route path='cetagories/:cetagory' element={<PrivateRoute> <Home /> </PrivateRoute>} />
        <Route path="/contact" element={<FooterPages />} />
        <Route path="/results" element={<Results />} />
        <Route path="/profile" element={<PrivateRoute> <EditProfile /> </PrivateRoute>} />
        <Route path="/about" element={<FooterPages />} />
        <Route path="/privacy-policy" element={<FooterPages />} />
        <Route path="/terms-and-conditions" element={<FooterPages />} />
        <Route path="/feedback" element={<PrivateRoute> <Feedback /> </PrivateRoute>} />
      </Route>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Signup />} />
      <Route path="*" element={<NotFoundPage />} />
    </>
  )
);

function App() {
  const [searchQuery, updateSearchQuery] = useState("");
  const [hasSwiped, setHasSwiped] = useState(false);

  useEffect(() => {
    let backButtonListener = null;

    const setupBackButton = async () => {
      if (Capacitor.getPlatform() !== 'web') {
        const { App: CapApp } = await import('@capacitor/app');
        backButtonListener = await CapApp.addListener('backButton', () => {
          const currentPath = router.state.location.pathname;
          if (currentPath === '/' || currentPath === '/login' || currentPath === '/register') {
            if (window.confirm("Are you sure you want to exit the app?")) {
              CapApp.exitApp();
            }
          } else {
            window.history.back();
          }
        });
      }
    };

    setupBackButton();

    return () => {
      if (backButtonListener) {
        backButtonListener.remove();
      }
    };
  }, []);

  if (!hasSwiped) {
    return <WelcomeScreen onSwipeUp={() => setHasSwiped(true)} />;
  }

  return (
    <>
      <Provider store={store}>
        <SearchProvider value={{ searchQuery, updateSearchQuery }}>
          <RouterProvider router={router} />
        </SearchProvider>
      </Provider>
    </>
  );
}

export default App;
