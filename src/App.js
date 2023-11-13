import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import store from './redux/store';
import { Provider } from 'react-redux';
import { useState, useEffect } from 'react';

// pages
import Home from './pages/Home';
import CreateCampaign from './pages/CreateCampaign';
import EditCampaign from './pages/EditCampaign';
import CampaignDetails from './pages/CampaignDetails';
import Profile from './pages/Profile';

import Offline from './pages/Offline';

// components
import Navbar from "./components/NavBar";
import Sidebar from "./components/Sidebar";
import Footer from './components/Footer';

function App() {
  const [isOffline, setIsOffline] = useState(false);

  const [currentTimestamp, setCurrentTimestamp] = useState(Math.floor(Date.now() / 1000));
  
  //const openTimestamp = 1692054800
  const openTimestamp = 1693054800 // launch date

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000))
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    isOffline === false && currentTimestamp > openTimestamp ? (
    <div>
      <div className="flex flex-row relative bg-offBlackDarker 
      xs:px-2 px-3 sm:px-6 md:px-8 
      xs:pt-2 pt-3 sm:pt-6 md:pt-8 
      xs:pb-2 pb-3 sm:pb-3 md:pb-4 

      xs:min-h-[calc(100vh-40px)] 
      min-h-[calc(100vh-48px)] 
      sm:min-h-[calc(100vh-56px)] 
      md:min-h-[calc(100vh-64px)]">
        <Provider store={store}>
          <Router>
            <Sidebar />
            <Navbar />
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/create-campaign" element={<CreateCampaign />} />
              <Route path="/edit-campaign/:id" element={<EditCampaign />} />
              <Route path="/campaigns/:id" element={<CampaignDetails />} />
              <Route exact path="/profile" element={<Profile />} />
            </Routes>
          </Router>
        </Provider>
      </div>
      <Footer />
    </div>
    ) : (
      <div className="xs:px-2 px-3 sm:px-6 md:px-8 relative justify-center bg-offBlackDarker min-h-[100%] flex flex-row">
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<Offline difference={openTimestamp-currentTimestamp} />} />
          </Routes>
        </Router>
      </Provider>
    </div>
    )
  );
}

export default App;
