import React from "react";
import { useKeon } from "lib/hooks/useKeon";

const AppCycler = (): JSX.Element => {
    const { device } = useKeon();
    return (
        <div className="flex flex-col items-center justify-center h-full">
            {device ? <p>Device connected: {device.Name}</p> : <p>No Keon connected</p>}
            <p>Cycler mode is not implemented for the Keon.</p>
        </div>
    );
};

export default AppCycler;
