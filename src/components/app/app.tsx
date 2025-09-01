import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';

import '../../index.css';
import styles from './app.module.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import {
  ProtectedRoute,
  Layout,
  Modal,
  OrderInfo,
  IngredientDetails
} from '@components';

import { useDispatch } from '../../services/store';
import {
  fetchFeeds,
  fetchIngredients,
  getUserThunk
} from '../../services/shopSlice';
import { useEffect } from 'react';

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchFeeds());
    dispatch(getUserThunk());
  }, [dispatch]);

  const location = useLocation();

  const handleOnClose = () => {
    console.log('x');
  };

  const backgroundLocation = location.state?.backgroundLocation;
  return (
    <div className={styles.app}>
      <Routes>
        <Route path='*' element={<NotFound404 />} />
        <Route path='/' element={<Layout />}>
          <Route index element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />
          <Route element={<ProtectedRoute />}>
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='forgot-password' element={<ForgotPassword />} />
            <Route path='reset-password' element={<ResetPassword />} />
            <Route path='profile' element={<Profile />} />
            <Route path='profile/orders' element={<ProfileOrders />} />
          </Route>
        </Route>
      </Routes>
      <Routes location={backgroundLocation || location}>
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/profile/orders/:number' element={<OrderInfo />} />
        </Route>
      </Routes>
      {backgroundLocation && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='' onClose={() => handleOnClose()}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='' onClose={() => handleOnClose()}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route element={<ProtectedRoute />}>
            <Route
              path='/profile/orders/:number'
              element={
                <Modal title='' onClose={() => handleOnClose()}>
                  <OrderInfo />
                </Modal>
              }
            />
          </Route>
        </Routes>
      )}
    </div>
  );
};

export default App;
