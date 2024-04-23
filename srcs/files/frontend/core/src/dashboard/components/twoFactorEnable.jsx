import React, { useEffect, useState } from "react";
import axiosInstance from "../../axiosAPI.js";

function TwoFactorEnable() {
    const [twoFaStatus, setTwoFaStatus] = useState(false);

    useEffect(() => {
        // Fetch the 2FA status of the user
        const custom_fetch = async () => {
            try 
            {
                const response = await axiosInstance.get('/get_2fa_preference/');
                setTwoFaStatus(response.data.two_factor);
            } catch (error){
                console.log('Error fetching 2FA status: ', error.message);
            }
        }
    }, []);

    custom_fetch();

    return (
        <div>
            <label htmlFor="twoFaSwitch">Enable 2FA:</label>
            <input
                type="checkbox"
                id="twoFaSwitch"
                checked={twoFaStatus}
                onChange={() => setTwoFaStatus(!twoFaStatus)}
            />
        </div>
    );

}

export default TwoFactorEnable;