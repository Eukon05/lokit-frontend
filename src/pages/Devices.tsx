import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router";
import { getAllDevices } from "../service/DeviceService";
import useAuthSession from "../hooks/useAuthSession";
import SearchableList from "../components/common/SearchableList";
import type { DeviceResponse } from "../types/responses/device/DeviceResponse";
import DeviceDetails from "../components/device/DeviceDetails";
import CreateDeviceForm from "../components/device/CreateDeviceForm";

function Devices() {
    const auth = useAuthSession();
    const navigate = useNavigate();
    const location = useLocation();
    const { deviceId } = useParams();
    const [devices, setDevices] = useState<DeviceResponse[]>([]);
    const [query, setQuery] = useState<string>("");
    const isCreateDevicePath = location.pathname === "/devices/new";

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
    }, [auth.connectedUser.accessToken, location.state?.refreshDevices])

    const deviceBlocks = devices.filter(device => device.name.toLowerCase().includes(query.toLowerCase()) || device.description.toLowerCase().includes(query.toLowerCase()) || device.physicalAddress.toLowerCase().includes(query.toLowerCase()) || device.roomId.toLowerCase().includes(query.toLowerCase()))
        .sort((o, t) => o.name.localeCompare(t.name))
        .map(device => (
            <div className="panel-block" key={device.id}>
                <NavLink to={"/devices/" + device.id}>{device.name}</NavLink>
            </div>
        ));

    const deviceView = isCreateDevicePath ? <CreateDeviceForm /> : deviceId ? <DeviceDetails deviceId={deviceId} /> : (
        <div className="block">
            <p className="title has-text-centered">Select a device to view details</p>
        </div>
    )

    return (
        <div className="columns">
            <div className="column is-4">
                <SearchableList
                    title="Device list"
                    query={query}
                    onQueryChange={setQuery}
                    emptyText="No matching devices found"
                    button={
                        {
                            text: "Create new",
                            bulmaStyle: "is-warning",
                            onClick: () => { navigate("/devices/new") }
                        }
                    }
                >
                    {deviceBlocks}
                </SearchableList>
            </div>
            <div className="column">
                {deviceView}
            </div>
        </div>
    )
}

export default Devices;