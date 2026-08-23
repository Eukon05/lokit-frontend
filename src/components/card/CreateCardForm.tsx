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
        const name = nameInput.current?.value;
        const id = idInput.current?.value;
        const userId = userIdInput.current?.value;

        if (!name)
            nameInput.current?.classList.add("is-danger")

        if (!userId)
            userIdInput.current?.classList.add("is-danger")

        if (!id)
            idInput.current?.classList.add("is-danger")

        if (!name || !id || !userId)
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
                            </div>
                            <div className="field">
                                <label className="label">Card ID</label>
                                <div className="control">
                                    <input className="input" type="text" ref={idInput} maxLength={8} required />
                                </div>
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