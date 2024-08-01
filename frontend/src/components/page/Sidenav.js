import React from 'react';
import { FaUser } from "react-icons/fa";
import { MdLockPerson, MdOutlinePendingActions } from "react-icons/md";
import { FaUserDoctor, FaMessage } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import "./sidenav.css";

const Sidebar = () => {
  return (
    <div className="sidebar-container">
      <div>
        <ul className="sidebar-list">
          <li className="sidebar-item">
            <Link to="/profilesettings" className="navLink">
              <FaUser className="navIco" />
              Profile
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/Doctors" className="navLink">
              <FaUserDoctor className="navIco" />
              Doctors
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/pendingReq" className="navLink">
              <MdOutlinePendingActions className="navIco" />
              Pending Request
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/Messages" className="navLink">
              <FaMessage className="navIco" />
              Messages
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/passwordandsecurity" className="navLink">
              <MdLockPerson className="navIco" />
              Password and Security
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/adminpost" className="navLink">
              <MdLockPerson className="navIco" />
              Admin Post & Resources
            </Link>
          </li>
        </ul>
        <hr className="sidebar-divider" />
      </div>
    </div>
  );
};

export default Sidebar;
