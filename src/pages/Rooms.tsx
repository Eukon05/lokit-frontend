import { useEffect, useState } from "react";
import { getAllRooms } from "../service/RoomService";
import useAuthSession from "../hooks/useAuthSession";
import SearchableList from "../components/common/SearchableList";
import type { RoomResponse } from "../types/responses/room/RoomResponse";
import RoomDetails from "../components/room/RoomDetails";
import { NavLink, useLocation, useNavigate, useParams } from "react-router";
import CreateRoomForm from "../components/room/CreateRoomForm";

function Rooms() {
    const auth = useAuthSession();
    const navigate = useNavigate();
    const location = useLocation();
    const {roomId} = useParams();
    const [rooms, setRooms] = useState<RoomResponse[]>([]);
    const [query, setQuery] = useState<string>("");
    const isCreateRoomPath = location.pathname === "/rooms/new";

    useEffect(() => {
        let isActive = true;

        async function loadRooms() {
            try {
                const allRooms = await getAllRooms(auth.connectedUser.accessToken);

                if (isActive) {
                    setRooms(allRooms);
                }
            } catch (error) {
                console.error("Failed to load rooms", error);
            }
        }

        void loadRooms();

        return () => {
            isActive = false;
        };
    }, [auth.connectedUser.accessToken, location.state?.refreshRooms])

    const roomBlocks = rooms.filter(room => room.name.toLowerCase().includes(query.toLowerCase()) || room.description.toLowerCase().includes(query.toLowerCase()))
        .sort((o, t) => o.name.localeCompare(t.name))
        .map(room => (
            <div className="panel-block" key={room.id}>
                <NavLink to={"/rooms/" + room.id}>{room.name}</NavLink>
            </div>
        ));

    const roomView = isCreateRoomPath ? <CreateRoomForm /> : roomId ? <RoomDetails roomId={roomId} /> : (
        <div className="block">
            <p className="title has-text-centered">Select a room to view details</p>
        </div>
    )


    return (
        <div className="columns">
            <div className="column is-4">
                <SearchableList
                    title="Room list"
                    query={query}
                    onQueryChange={setQuery}
                    emptyText="No matching rooms found"
                    button={
                        {
                            text: "Create new",
                            bulmaStyle: "is-warning",
                            onClick: () => { navigate("/rooms/new") }
                        }
                    }
                >
                    {roomBlocks}
                </SearchableList>
            </div>
            <div className="column">
                {roomView}
            </div>
        </div>
    )
}

export default Rooms;