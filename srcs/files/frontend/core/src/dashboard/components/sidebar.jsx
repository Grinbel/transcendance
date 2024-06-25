import "./sidebar.scss"
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { sidebar } from "../../data.jsx";


const Sidebar = () => {
	const { t } = useTranslation();
	return (
		<div className="sidebar">
			{/* //map over elements in sidebar array */}
			{sidebar.map((item) => (
				<div className="item" key={item.id}>
					<span className="itemTitle">{item.title}</span>
					{item.listItems.map((listItem) => (
						<div className="subItem" key={listItem.id}>
							<Link to={listItem.url} className="linker">
								{/* <listItem.icon className="icon" /> */}
								<span><listItem.icon/></span>
								<span className="text">{t(listItem.title)}</span>
							</Link>
						</div>
					))}
				</div>
			))}
		</div>
	);
}
export default Sidebar;




// return (
// 	<div className="sidebar">
// 		<div className="item">
// 			<span className="itemTitle" > Dashboard</span>
// 			<div className="subItem">
// 				<Link to="/dashboard" className="linker">
// 					<RiHomeHeartFill className="icon"/>
// 					<span className="text">Home</span>
// 				</Link>
// 			</div>
// 			<div className="subItem">
// 				<Link to="settings" className="linker">
// 					<IoSettingsOutline className="icon"/>
// 					<span className="text">Settings</span>
// 				</Link>
// 			</div>
// 			<div className="subItem">
// 				<Link to="friends" className="linker">
// 					<TbFriends className="icon"/>
// 					<span className="text">Friends</span>
// 				</Link>
// 			</div>
// 		</div>
// 	</div>
// );