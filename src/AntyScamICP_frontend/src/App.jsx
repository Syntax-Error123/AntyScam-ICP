import './App.css';
import HomePage from './pages/Home';
import Signup from './pages/Signup';
import AboutUs from './pages/AboutUs';
import Careers from './pages/Careers';
import UserGuide from './pages/UserGuide';
import LearnHow from './pages/LearnHow';
import UserPanel from './pages/UserPanel';
import {ErrorHandler} from './components/reusable/CustomError';
import { Routes, Route } from 'react-router-dom';
import { NotAvailable } from './components/reusable/NotAvailable';

function App() {
  return (
    <div className="App" style={{display:'inline-list-item'}}>
      <ErrorHandler/>
        <Routes>
          <Route path='*' element={<NotAvailable/>}/>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/u-panel' element={<UserPanel/>}/>
          <Route path='/sign-up' element={<Signup/>}/>
          <Route path='/abt-us' element={<AboutUs/>}/>
          <Route path='/career' element={<Careers/>}/>
          <Route path='/guide' element={<UserGuide/>}/>
          <Route path='/how' element={<LearnHow/>}/>
        </Routes>
    </div>
  );
}

export default App;
