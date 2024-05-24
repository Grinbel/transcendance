// dashboard component
import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

import History from './history.jsx';
import Friends from './friends.jsx';
import Settings from './settings.jsx';


import './dashboard.scss';
import { useState, useContext } from "react";
import Sidebar from '../components/sidebar.jsx';
import { Outlet } from "react-router-dom"
import { userContext } from "../../contexts/userContext.jsx";
////////////////////////////////////////


const Dashboard = () => {
	const userinfo = useContext(userContext);

	return (
		<div>
			{userinfo.user && userInfo.user.isLogged ? (
			<div className="dashboard">
					<div className="container">
						<div className="sidebarContainer">
							<Sidebar/>
						</div>
						<div className="pageContainer">
							<Outlet/>
						</div>
					</div>
				</div>
			) : (
				<Navigate to='/login'/>
			)};
		</div>
)}

export default Dashboard;