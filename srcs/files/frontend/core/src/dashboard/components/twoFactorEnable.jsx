import React, { useEffect, useState } from "react";
import {axiosInstance} from "../../axiosAPI.js";
import Switch from "./switch.jsx";

function TwoFactorEnable() {
    const [twoFaStatus, setTwoFaStatus] = useState(false);

    const custom_fetch = async () => {
        try 
        {
            const response = await axiosInstance.get('/get_2fa_preference/');
            setTwoFaStatus(response.data.two_factor);
        } catch (error){
            console.log('Error fetching 2FA status: ', error.message);
        }
    }
    useEffect(() => {
        // Fetch the 2FA status of the user
        custom_fetch();
    }, []);


    return (
        <div>
            <Switch
                name="2FA Authentication"
                status={twoFaStatus}
                handleSwitch={() => setTwoFaStatus(!twoFaStatus)}
                // onColor={'red'}    
            />
        </div>
    );

}

export default TwoFactorEnable;