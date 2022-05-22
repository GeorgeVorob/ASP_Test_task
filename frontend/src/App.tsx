import './App.css';

import * as pages from './pages'
import * as RB from 'react-bootstrap'

import { Header } from './components';
import { Projects } from './pages';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <RB.Container fluid>
        <RB.Row>
          <Header></Header>
        </RB.Row>
        <RB.Row style={{ justifyContent: "center", alignContent: "baseline" }}>
          <Routes>
            <Route path="/projects" element={<pages.Projects />} />
            <Route path="/workers" element={<pages.Workers />} />
          </Routes>
        </RB.Row>
      </RB.Container>
    </div>
  );
}

export default App;
