import React, { useEffect, useState } from "react";
import {axiosInstance} from "../../axiosAPI.js";
import Switch from "./switch.jsx";

function TwoFactorEnable() {
    const [twoFaStatus, setTwoFaStatus] = useState(false);

    console.log('TwoFactorEnable component');
    console.log('twoFaStatus', twoFaStatus);

    const custom_fetch = async () => {
        console.log('TwoFactorEnable: custom_fetch');
        try 
        {
            const response = await axiosInstance.get('/getprofile/');
            setTwoFaStatus(response.data.two_factor);
        } catch (error){
            console.log('Error fetching 2FA status: ', error.message);
        }
    }

    const handle2Fa = () => {
        console.log('TwoFactorEnable: handle2Fa');
        setTwoFaStatus(!twoFaStatus);

        const sendFastatus = async () => {
            try {
                const response = await axiosInstance.post('/2fa/', {
                    "two_factor": twoFaStatus
                });
                
            } catch (error) {
                console.log('Error enabling 2FA: ', error.message);
            }
        }
        sendFastatus();
    }

    useEffect(() => {
        // Fetch the 2FA status of the user
        console.log('TwoFactorEnable: useEffect');
        custom_fetch();
    }, []);


    return (
        <div>
            <Switch
                name="2FA Authentication"
                status={twoFaStatus}
                handleSwitch={handle2Fa}
                // onColor={'red'}    
            />
        </div>
    );

}

export default TwoFactorEnable;