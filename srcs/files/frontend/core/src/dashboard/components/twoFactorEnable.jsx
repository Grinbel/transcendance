import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import {axiosInstance} from "../../axiosAPI.js";
import { userContext } from "../../contexts/userContext.jsx";

import Switch from "./switch.jsx";

function TwoFactorEnable() {
    const [twoFaStatus, setTwoFaStatus] = useState(false);
    const navigate = useNavigate();

    const userinfo = useContext(userContext);

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
            if (error.response.status  === 400)
                {
                    userinfo.setUser();
                    navigate('/login');
                }
        }
    }

    const handle2Fa = () => {
        console.log('handle2Fa');
        setTwoFaStatus(!twoFaStatus);

        const sendFastatus = async () => {
            try {
                const response = await axiosInstance.post('/2fa/', {
                    "two_factor": twoFaStatus
                });
                const old_user = userinfo.user;
                userinfo.setUser({...old_user, 'two_factor':twoFaStatus})
                console.log('user after 2fa activation: ', userinfo.user);
            } catch (error) {
                console.log('Error enabling 2FA: ', error.message);
                console.log('Error status: ', error.response.status);
                if (error.response.status  === 400)
                {
                    userinfo.setUser();
                    navigate('/login');
                }
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