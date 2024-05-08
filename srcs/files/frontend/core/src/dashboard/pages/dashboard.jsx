// dashboard component
import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import History from './history.jsx';
import Friends from './friends.jsx';
import Settings from './settings.jsx';


import './dashboard.scss';
import Sidebar from '../components/sidebar.jsx';
import { Outlet } from "react-router-dom"
import { userContext } from "../../contexts/userContext.jsx";
////////////////////////////////////////

const Dashboard = () => {
	return (
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
);
}

export default Dashboard;