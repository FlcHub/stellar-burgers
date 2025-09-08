import React, { FC, ReactNode } from 'react';

type TProps = {
  children?: ReactNode;
};

export const TextUI: FC<TProps> = ({ children }) => (
  <span className='text text_type_main-medium p-4'>{children}</span>
);
