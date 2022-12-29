// ===================== React Packages ============================

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

// ==================== Components ======================
import Home from './Pages/Home';
import Login from './Pages/Login';
import VoterLogin from './Pages/VoterPages/VoterLogin';
import PALogin from './Pages/PAPages/PALogin';
import AdminLogin from './Pages/AdminPages/AdminLogin';
import Register from './Pages/Register'
import VoterRegister from './Pages/VoterPages/VoterRegister';
import PARegister from './Pages/PAPages/PARegister';
import AdminRegister from './Pages/AdminPages/AdminRegister';
import VoterProfile from './Pages/VoterPages/VoterProfile';
import AdminProfile from './Pages/AdminPages/AdminProfile';
import PAProfile from './Pages/PAPages/PAProfile';
import AdminPolls from './Pages/AdminPages/AdminPolls';
import VoterPolls from './Pages/VoterPages/VoterPolls';
import PACampaigns from './Pages/PAPages/PACampaigns';
import VoterFeeds from './Pages/VoterPages/VoterFeeds';
import VoterPublishedPolls from './Pages/VoterPages/VoterPublishedPolls';
import AdminPublishedPolls from './Pages/AdminPages/AdminPublishedPolls';




function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
        <Route exact path = '' element={<Home/>}/>
          <Route exact path = '/login' element={<Login/>}/>
          <Route exact path = '/login/voter' element={<VoterLogin/>}/>
          <Route exact path = '/login/partyambassador' element={<PALogin/>}/>
          <Route exact path = '/login/admin' element={<AdminLogin/>}/>
          <Route exact path = '/register' element={<Register/>}/>
          <Route exact path = '/register/voter' element={<VoterRegister/>}/>
          <Route exact path = '/register/partyambassador' element={<PARegister/>}/>
          <Route exact path = '/register/admin' element={<AdminRegister/>}/>
          <Route exact path = '/voter/profile' element={<VoterProfile/>}/>
          <Route exact path = '/admin/profile' element={<AdminProfile/>}/>
          <Route exact path = '/partyambassador/profile' element={<PAProfile/>}/>
          <Route exact path = '/admin/polls' element={<AdminPolls/>}/>
          <Route exact path = '/voter/polls' element={<VoterPolls/>}/>
          <Route exact path = '/partyambassador/campaigns' element={<PACampaigns/>}/>
          <Route exact path = '/voter/feeds' element={<VoterFeeds/>}/>
          <Route exact path = '/voter/publishedpolls' element={<VoterPublishedPolls/>}/>
          <Route exact path = '/admin/publishedpolls' element={<AdminPublishedPolls/>}/>
        </Routes>
      </Router>  
    </div>
  )
}

export default App;