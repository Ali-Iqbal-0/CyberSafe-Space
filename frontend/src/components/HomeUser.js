import React from "react";
import Topbar from "./page/Topbar";
import "./home.css";
import Post from "./page/post";
import RecommendPeople from './page/RecommendPeople';
import SideBar from './page/Sidenav';

export default function Home() {
  return (
    <>
      <div className="Topbar">
        <Topbar />
      </div>
      <div className="mainContainer">
        <div className="LeftBar">
          <SideBar/>
        </div>
        <div className="Centre">
          <div className="Post">
            <Post />
          </div>
        </div>
        <div className="RightBar">
          <RecommendPeople/>
        </div>
      </div>
    </>
  );
}
