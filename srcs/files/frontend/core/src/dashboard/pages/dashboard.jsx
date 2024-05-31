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
	console.log('Dashboard component');
	const userinfo = useContext(userContext);
	if (userinfo.user) {
		console.log('userinfo.user', userinfo.user);
		console.log('userinfo.user.islogged ?', userinfo.user.isLogged);
	}
	return (
		<div>
			{userinfo.user && userinfo.user.isLogged ? (
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