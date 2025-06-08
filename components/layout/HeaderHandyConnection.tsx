import React from "react";
import { MdWifiTethering, MdReport } from "react-icons/md";
import { useKeon } from "lib/hooks/useKeon";

const HeaderHandyConnection = (): JSX.Element => {
    const { device } = useKeon();
    return (
        <div className="flex items-center gap-2">
            {device ? (
                <>
                    <span className="text-green-400">Keon Connected</span>
                    <MdWifiTethering className="text-2xl text-green-400" />
                </>
            ) : (
                <>
                    <span className="text-red-400">No Keon Connected</span>
                    <MdReport className="text-2xl text-red-400" />
                </>
            )}
        </div>
    );
};

export default HeaderHandyConnection;
