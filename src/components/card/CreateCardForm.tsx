import { useEffect, useRef, useState } from 'react'
import type { CreateCardRequest } from '../../types/requests/card/CreateCardRequest';
import { createCard } from '../../service/CardService';
import useAuthSession from '../../hooks/useAuthSession';
import { useNavigate } from 'react-router';
import { getIdPAllUsers } from '../../service/UserService';
import type { UserResponse } from '../../types/responses/user/UserResponse';

function CreateCardForm() {
    const auth = useAuthSession();
    const navigate = useNavigate();
    const idInput = useRef<HTMLInputElement>(null);
    const nameInput = useRef<HTMLInputElement>(null);
    const userIdInput = useRef<HTMLSelectElement>(null);
    const [users, setUsers] = useState<UserResponse[]>();

    const nameHelp = useRef<HTMLParagraphElement>(null);
    const idHelp = useRef<HTMLParagraphElement>(null);
    const userIdHelp = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        let isActive = true;

        async function loadUsers() {
            try {
                const idpUsers = await getIdPAllUsers(auth.connectedUser.accessToken);

                if (isActive) {
                    setUsers(idpUsers);
                }
            } catch (error) {
                console.error("Failed to load users", error);
            }
        }

        void loadUsers();

        return () => {
            isActive = false;
        };
    }, []);

    async function _submitAction() {
        const name = nameInput.current?.value.trim();
        const id = idInput.current?.value.trim();
        const userId = userIdInput.current?.value.trim();

        const nameInvalid = !name || name.length > 100;
        const idInvalid = !id || id.length != 8;
        const userIdInvalid = !userId;

        if (nameInvalid) {
            nameInput.current?.classList.add("is-danger")
            if (nameHelp.current) nameHelp.current.style.visibility = "visible";
        } else {
            nameInput.current?.classList.remove("is-danger")
            if (nameHelp.current) nameHelp.current.style.visibility = "hidden";
        }

        if (userIdInvalid) {
            userIdInput.current?.classList.add("is-danger")
            if (userIdHelp.current) userIdHelp.current.style.visibility = "visible";
        } else {
            userIdInput.current?.classList.remove("is-danger")
            if (userIdHelp.current) userIdHelp.current.style.visibility = "hidden";
        }

        if (idInvalid) {
            idInput.current?.classList.add("is-danger")
            if (idHelp.current) idHelp.current.style.visibility = "visible";
        } else {
            idInput.current?.classList.remove("is-danger")
            if (idHelp.current) idHelp.current.style.visibility = "hidden";
        }

        if (nameInvalid || idInvalid || userIdInvalid)
            return;

        const body: CreateCardRequest = {
            name: name ?? "",
            id: id ?? "",
            userId: userId ?? ""
        };

        const cardId: string = (await createCard(body, auth.connectedUser.accessToken)).replaceAll("\"", "");
        navigate("/cards/" + cardId, { replace: true, state: { refreshCards: Date.now() } });
    }

    return (
        <div>
            <div className="card">
                <div className="card-content">
                    <div className="media-content">
                        <div>
                            <p className='title'>Create a new card</p>
                        </div>
                        <div>
                            <div className="field">
                                <label className="label">Name</label>
                                <div className="control">
                                    <input className="input" type="text" ref={nameInput} maxLength={100} required />
                                </div>
                                <p className="help is-danger" style={{visibility: "hidden"}} ref={nameHelp}>The name of the card cannot be empty or exceed 100 characters</p>
                            </div>
                            <div className="field">
                                <label className="label">Card ID</label>
                                <div className="control">
                                    <input className="input" type="text" ref={idInput} maxLength={8} required />
                                </div>
                                <p className="help is-danger" style={{visibility: "hidden"}} ref={idHelp}>The ID of the card must be exactly 8 characters long</p>
                            </div>
                            <div className="field">
                                <label className="label">Owner</label>
                                <div className="control">
                                    <div className='select'>
                                        <select ref={userIdInput}>
                                            {users?.sort((o, t) => o.firstName.localeCompare(t.firstName))
                                            .map(u => {
                                                return <option key={u.id} value={u.id}>{u.firstName + " " + u.lastName + "(" + u.email + ")"}</option>
                                            })}
                                        </select>
                                    </div>
                                </div>
                                <p className="help is-danger" style={{visibility: "hidden"}} ref={userIdHelp}>Please select an owner for the card</p>
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

export default CreateCardForm;