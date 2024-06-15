import { useState , createContext, useContext} from 'react'; 
import tournament from '../main/tournament';

const userContext = createContext(null);

function  UserProvider({children}){
	const [user, setUser] = useState({username:"default", 
	token:"" , 
	isLogged:false, 
	two_factor:false, 
	avatar:null, 
	tournament:"default",
	alias:"",
	tournamentIsLaunching:false,
	email:"default",
	uuid:"default",
	isStaff:false,
	id:'default',
	isActive:false ,
	exp:0,
	iat:0,
});
	
	return (
		<userContext.Provider value={{user, setUser}}>
			{children}
		</userContext.Provider>
	);
}

export {userContext, UserProvider};