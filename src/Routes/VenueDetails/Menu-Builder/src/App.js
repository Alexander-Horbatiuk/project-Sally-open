import { useEffect } from 'react';
import './App.css';

import Tabs from './components/Tabs';
import MenuSection from './components/MenuSection';
import { useRecoilState } from 'recoil';
import { menuObj } from './components/Atoms/atoms';
import agent from './agent';
import { useParams } from 'react-router-dom';

function App() {
  let [menu, setMenu] = useRecoilState(menuObj);

  const { id } = useParams()

  useEffect(() => {
    fetch()

    async function fetch() {
      try {
        let menu = await agent.getMenu(id);
        if (Array.isArray(menu)) {
          menu = { "Food": menu.map((item, i) => item[i + 1]) };
        }
        setMenu(menu);
      } catch (err) {
        console.log(err);
      }
    }
  }, [id, setMenu])

  if (!menu) return (
    <div className="center-screen">
      <div className="spinner" />
    </div>
  )

  return (
    <Tabs>
      {Object.keys(menu).map((section, i) => (
        <MenuSection path={[section]} key={i} title={section} categories={menu[section]} />
      ))}
    </Tabs>
  );
}

export default App;
