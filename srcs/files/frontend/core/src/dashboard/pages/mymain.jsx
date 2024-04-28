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

import './mymain.scss';
import { userContext } from "../../contexts/userContext.jsx";

//import components
import {ProfilePreview, Victories, Losses, BestScore, WorstScore, RecentTournaments, RecentFriends, RecentGames} from "../components/profileComponents.jsx";
////////////////////////////////////////



const MyMain = () => {
	return (
		<div className="mymain">
			<div className="component component1"> <ProfilePreview /> </div>
			<div className="component component2"> <Victories /> </div>
			<div className="component component3"> <Losses /> </div>
			<div className="component component4"> <BestScore/> </div>
			<div className="component component5"> <WorstScore/> </div>
			<div className="component component6"> <RecentTournaments/> </div>
			<div className="component component7"> <RecentFriends/></div>
			<div className="component component8"> <RecentGames/></div>
		</div>
	);
}
export default MyMain;