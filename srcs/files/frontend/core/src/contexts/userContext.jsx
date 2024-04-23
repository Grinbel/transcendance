import { useState , createContext, useContext} from 'react'; 

const userContext = createContext(null);

function  UserProvider({children}){
	const [user, setUser] = useState({username:"default", token:"" , isLogged:false, two_factor:false, avatar:null});
	
	return (
		<userContext.Provider value={{user, setUser}}>
			{children}
		</userContext.Provider>
	);
}

export {userContext, UserProvider};