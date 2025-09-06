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
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import {
  ProtectedRoute,
  ProtectedFromAuthorizedRoute,
  Layout,
  Modal,
  OrderInfo,
  IngredientDetails
} from '@components';

import { useDispatch } from '../../services/store';
import { getUserThunk } from '../../services/shopSlice';
import { useEffect } from 'react';

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserThunk());
  }, [dispatch]);

  const handleOnClose = () => {
    navigate(-1);
  };

  const location = useLocation();
  const background = location.state?.background;
  return (
    <div className={styles.app}>
      <Routes location={background || location}>
        <Route path='*' element={<NotFound404 />} />
        <Route path='/' element={<Layout />}>
          <Route index element={<ConstructorPage />} />
          <Route path='feed' element={<Feed />} />
          <Route path='feed/:number' element={<OrderInfo />} />
          <Route path='ingredients/:id' element={<IngredientDetails />} />
          <Route element={<ProtectedFromAuthorizedRoute />}>
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='forgot-password' element={<ForgotPassword />} />
            <Route path='reset-password' element={<ResetPassword />} />
          </Route>
          <Route path='profile' element={<ProtectedRoute pathname='profile' />}>
            <Route index element={<Profile />} />
          </Route>
          <Route
            path='profile/orders'
            element={<ProtectedRoute pathname='profile/orders' />}
          >
            <Route index element={<ProfileOrders />} />
          </Route>
          <Route
            path='profile/orders/:number'
            element={<ProtectedRoute pathname='profile/orders' />}
          >
            <Route index element={<OrderInfo />} />
          </Route>
        </Route>
      </Routes>
      {background && (
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
          <Route element={<ProtectedRoute pathname='/profile/orders' />}>
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
