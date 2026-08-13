import { useEffect, useState } from "react";
import { getAllDevices } from "../service/DeviceService";
import useAuthSession from "../hooks/useAuthSession";
import SearchableList from "../components/SearchableList";
import type { DeviceResponse } from "../types/responses/device/DeviceResponse";

function Devices() {
    const auth = useAuthSession();
    const [devices, setDevices] = useState<DeviceResponse[]>([]);
    const [query, setQuery] = useState<string>("");

    useEffect(() => {
        let isActive = true;

        async function loadRoles() {
            try {
                const allDevices = await getAllDevices(auth.connectedUser.accessToken);

                if (isActive) {
                    setDevices(allDevices);
                }
            } catch (error) {
                console.error("Failed to load devices", error);
            }
        }

        void loadRoles();

        return () => {
            isActive = false;
        };
    }, [auth.connectedUser.accessToken])

    const deviceBlocks = devices.filter(device => device.name.toLowerCase().includes(query.toLowerCase()) || device.description.toLowerCase().includes(query.toLowerCase()))
        .sort((o, t) => o.name.localeCompare(t.name))
        .map(device => (
            <div className="panel-block" key={device.id}>
                <a>{device.name}</a>
            </div>
        ));

    return (
        <div className="columns">
            <div className="column is-4">
                <SearchableList
                    title="Device list"
                    query={query}
                    onQueryChange={setQuery}
                    emptyText="No matching devices found"
                >
                    {deviceBlocks}
                </SearchableList>
            </div>
            <div className="column">
                <div className="block">
                    <p className="title">Some device view</p>
                </div>
            </div>
        </div>
    )
}

export default Devices;