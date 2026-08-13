import { useEffect, useState } from "react";
import { getAllRooms } from "../service/RoomService";
import useAuthSession from "../hooks/useAuthSession";
import SearchableList from "../components/SearchableList";
import type { RoomResponse } from "../types/responses/room/RoomResponse";

function Rooms() {
    const auth = useAuthSession();
    const [rooms, setRooms] = useState<RoomResponse[]>([]);
    const [query, setQuery] = useState<string>("");

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
    }, [auth.connectedUser.accessToken])

    const roomBlocks = rooms.filter(room => room.name.toLowerCase().includes(query.toLowerCase()) || room.description.toLowerCase().includes(query.toLowerCase()))
        .sort((o, t) => o.name.localeCompare(t.name))
        .map(room => (
            <div className="panel-block" key={room.id}>
                <a>{room.name}</a>
            </div>
        ));

    return (
        <div className="columns">
            <div className="column is-4">
                <SearchableList
                    title="Room list"
                    query={query}
                    onQueryChange={setQuery}
                    emptyText="No matching rooms found"
                >
                    {roomBlocks}
                </SearchableList>
            </div>
            <div className="column">
                <div className="block">
                    <p className="title">Some room view</p>
                </div>
            </div>
        </div>
    )
}

export default Rooms;