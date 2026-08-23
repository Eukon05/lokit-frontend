import { useRef } from 'react'
import type { CreateRoleRequest } from '../../types/requests/role/CreateRoleRequest';
import { createRole } from '../../service/RoleService';
import useAuthSession from '../../hooks/useAuthSession';
import { useNavigate } from 'react-router';

function CreateRoleForm() {
    const auth = useAuthSession();
    const navigate = useNavigate();
    const nameInput = useRef<HTMLInputElement>(null);
    const descriptionInput = useRef<HTMLInputElement>(null);

    async function _submitAction() {
        const name = nameInput.current?.value;
        const desc = descriptionInput.current?.value;

        const body: CreateRoleRequest = {
            name: name ?? "",
            description: desc ?? ""
        };

        const roleId: string = (await createRole(body, auth.connectedUser.accessToken)).replaceAll("\"", "");
        navigate("/roles/" + roleId, { replace: true, state: { refreshRoles: Date.now() } });
    }

    return (
        <div>
            <div className="card">
                <div className="card-content">
                    <div className="media-content">
                        <div>
                            <p className='title'>Create a new role</p>
                        </div>
                        <div>
                            <div className="field">
                                <label className="label">Name</label>
                                <div className="control">
                                    <input className="input" type="text" ref={nameInput} />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Description</label>
                                <div className="control">
                                    <input className="input" type="text" ref={descriptionInput} />
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

export default CreateRoleForm;