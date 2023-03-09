import logo from './logo.svg';
import './App.css';
import MainRouter from './routers';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
    <MainRouter />
    <Toaster />
    </>
  );
}

export default App;
