import React, { createContext, useContext, useEffect, useState } from "react";

interface KeonContextProps {
    device: any | null;
    linear: (position: number, duration: number) => void;
    stop: () => void;
}

const KeonContext = createContext<KeonContextProps>({
    device: null,
    linear: () => undefined,
    stop: () => undefined,
});

export const KeonProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
    const [device, setDevice] = useState<any | null>(null);

    useEffect(() => {
        let client: any;
        let buttplug: any;
        async function init() {
            try {
                buttplug = await import("buttplug/dist/web/buttplug.mjs");
                client = new buttplug.ButtplugClient("funscript keon");
                client.on("deviceadded", () => {
                    if (!device && client.devices.length > 0) {
                        setDevice(client.devices[0]);
                    }
                });
                client.on("deviceremoved", () => {
                    if (client.devices.length === 0) setDevice(null);
                });
                await client.connect(new buttplug.ButtplugBrowserWebsocketClientConnector("ws://localhost:12345"));
                if (client.devices.length > 0) setDevice(client.devices[0]);
                await client.startScanning();
            } catch (e) {
                console.error("Failed to connect to Keon", e);
            }
        }
        init();
        return () => {
            client?.disconnect();
        };
    }, []);

    const linear = (position: number, duration: number) => {
        if (device) {
            device.linear(position, duration).catch(() => undefined);
        }
    };

    const stop = () => {
        if (device) {
            device.stop().catch(() => undefined);
        }
    };

    return <KeonContext.Provider value={{ device, linear, stop }}>{children}</KeonContext.Provider>;
};

export const useKeon = () => useContext(KeonContext);
