import React from 'react';
import Layout from './Layout/Layout';

import classes from './App.module.scss';

function App() {
  return (
    <Layout>
      <div className={classes.App}>
        <h1>Application place</h1>
      </div>
    </Layout>

  );
}

export default App;
