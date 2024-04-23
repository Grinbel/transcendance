import "./sidebar.scss"
import { Link } from "react-router-dom";
import { IoSettingsOutline } from "react-icons/io5";
import { TbFriends } from "react-icons/tb";
import { AiOutlineHistory } from "react-icons/ai";
import { RiHomeHeartFill } from "react-icons/ri";


const Sidebar = () => {
	  return (
	<div className="sidebar">
		<div className="item">
			<span className="itemTitle" > Dashboard</span>
			<div className="subItem">
				<Link to="/dashboard" className="linker">
					<RiHomeHeartFill className="icon"/>
					<span className="text">Home</span>
				</Link>
			</div>
			<div className="subItem">
				<Link to="settings" className="linker">
					<IoSettingsOutline className="icon"/>
					<span className="text">Settings</span>
				</Link>
			</div>
			<div className="subItem">
				<Link to="friends" className="linker">
					<TbFriends className="icon"/>
					<span className="text">Friends</span>
				</Link>
			</div>
		</div>
      {/* Add more links as needed */}

	</div>
  );
}

export default Sidebar;