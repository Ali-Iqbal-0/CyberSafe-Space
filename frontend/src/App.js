import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Registration from './components/RegistrationForm';
import Login from './components/LoginForm';
import HomeUser from './components/HomeUser';
import HomeAdmin from './components/HomeAdmin'
import HomeDoctor from './components/HomeDoctor'
import ForgotPasswordPage from './components/forgetpassword';
import ResetPassword from './components/Resetpassword';
import ProfileSettings from './components/ProfileSettings'
import PasswordAndSecurity from './components/PasswordAndSecurity'
import AdminReport from './components/page/Report'
import PendingReq from './components/page/PendingReq'
import Resources from './components/adminpages/Resources'
import ReportComment from './components/adminpages/ReportComment'
import Drinfo from './components/page/Dr_info'
import SearchProfileUser from './components/page/SearchProfileUser'
import SearchDoctorUser from './components/page/SearchProfileDoc'
import DoctorList from './components/page/DoctorList'
import Messages from './components/Messages'
import AdminUserManagement from './components/adminpages/AdminUserManagement';
import Adminpost from './components/page/Adminpost';
const App = () => {
  return (
    <Router>
      <Routes>
		<Route path="/login" element={<Login/>} />
    <Route path="/register" element={<Registration/>} />
	  <Route path="/homeUser" element={<HomeUser />} />
    <Route path='/homeAdmin' element={<HomeAdmin/>}/> 
    <Route path='/homeDoctor' element={<HomeDoctor/>}/>
    <Route path="/forgotpassword" element={<ForgotPasswordPage/>} />
    <Route path="/reset-password/:userID/:token" element={<ResetPassword/>} />
    <Route path="/profilesettings" element={<ProfileSettings/>} />
    <Route path="/passwordandsecurity" element={<PasswordAndSecurity/>} />
    <Route path="/AdminReport" element={<AdminReport/>} />
    <Route path="/pendingReq" element={<PendingReq/>} />
    <Route path="/resources" element={<Resources/>} />
    <Route path="/ReportedComment" element={<ReportComment/>} />
    <Route path="/doctor-info" element={<Drinfo/>} />
    <Route path="/profile/:userId" element={<SearchProfileUser />} />
    <Route path="/Doctors" element={<DoctorList />} />
    <Route path="/doctorProfile/:userId" element={<SearchDoctorUser />} />
    <Route path="/Messages" element={<Messages />} />
    <Route path="/admin/users" element={<AdminUserManagement />} />

    <Route path="/adminpost" element={<Adminpost />} />

      </Routes>
    </Router>
  );
}

export default App;