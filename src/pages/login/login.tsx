import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';

import { useDispatch, useSelector } from '../../services/store';
import { getIsLoginedSelector, loginUserThunk } from '../../services/shopSlice';
import { useNavigate } from 'react-router-dom';

export const Login: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLogined = useSelector(getIsLoginedSelector);

  useEffect(() => {
    if (isLogined) {
      navigate('/');
    }
  }, [isLogined]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    // залогиниться
    dispatch(
      loginUserThunk({
        email: email,
        password: password
      })
    );
  };

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
