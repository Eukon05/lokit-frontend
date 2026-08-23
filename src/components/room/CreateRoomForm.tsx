import { useRef } from 'react'
import type { CreateRoomRequest } from '../../types/requests/room/CreateRoomRequest';
import { createRoom } from '../../service/RoomService';
import useAuthSession from '../../hooks/useAuthSession';
import { useNavigate } from 'react-router';

function CreateRoomForm() {
    const auth = useAuthSession();
    const navigate = useNavigate();
    const nameInput = useRef<HTMLInputElement>(null);
    const descriptionInput = useRef<HTMLInputElement>(null);

    async function _submitAction() {
        const name = nameInput.current?.value;
        const desc = descriptionInput.current?.value;

        if(!name)
            nameInput.current?.classList.add("is-danger")

        if(!desc)
            descriptionInput.current?.classList.add("is-danger")

        if(!name || !desc)
            return;

        const body: CreateRoomRequest = {
            name: name ?? "",
            description: desc ?? ""
        };

        const roomId: string = (await createRoom(body, auth.connectedUser.accessToken)).replaceAll("\"", "");
        navigate("/rooms/" + roomId, { replace: true, state: { refreshRooms: Date.now() } });
    }

    return (
        <div>
            <div className="card">
                <div className="card-content">
                    <div className="media-content">
                        <div>
                            <p className='title'>Create a new room</p>
                        </div>
                        <div>
                            <div className="field">
                                <label className="label">Name</label>
                                <div className="control">
                                    <input className="input" type="text" ref={nameInput} maxLength={100} required/>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Description</label>
                                <div className="control">
                                    <input className="input" type="text" ref={descriptionInput} maxLength={500} required/>
                                </div>
                            </div>
                            <div className='field'>
                                <div className="control">
                                    <button className="button is-link" onClick={_submitAction}>Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateRoomForm;