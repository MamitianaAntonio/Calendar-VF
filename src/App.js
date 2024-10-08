import './App.css';
import Home from './components/Home';
import Dashboard from './Dashboard/Dashboard';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import CourForm from './Dashboard/Link/CourForm';
import ReunionForm from './Dashboard/Link/ReunionForm';
import Admin from './Dashboard/Link/Admin';
import { AuthProvider } from './components/AuthContext';



function App() {
  
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/cour" element={<CourForm />} />
          <Route path="/reunion" element={<ReunionForm />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

