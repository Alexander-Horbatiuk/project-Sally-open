import React from 'react';
import App from './src/App';
import {RecoilRoot} from "recoil";

const MenuBuilder: React.FC = (props) => {
  return (
    <>
      <RecoilRoot>
        <App/>
      </RecoilRoot>
    </>
  )

}

export default MenuBuilder;