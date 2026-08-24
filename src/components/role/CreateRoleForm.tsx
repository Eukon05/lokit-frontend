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

    const nameHelp = useRef<HTMLParagraphElement>(null);
    const descriptionHelp = useRef<HTMLParagraphElement>(null);

    async function _submitAction() {
        const name = nameInput.current?.value.trim();
        const description = descriptionInput.current?.value.trim();

        const nameInvalid = !name || name.length > 100
        const descriptionInvalid = !description || description.length > 500

        if(nameInvalid){
            nameInput.current?.classList.add("is-danger")
            if(nameHelp.current) nameHelp.current.style.visibility = "visible";
        }
        else {
            nameInput.current?.classList.remove("is-danger")
            if(nameHelp.current) nameHelp.current.style.visibility = "hidden";
        }

        if(descriptionInvalid){
            descriptionInput.current?.classList.add("is-danger")
            if(descriptionHelp.current) descriptionHelp.current.style.visibility = "visible";
        }
        else {
            descriptionInput.current?.classList.remove("is-danger")
            if(descriptionHelp.current) descriptionHelp.current.style.visibility = "hidden";
        }

        if(nameInvalid || descriptionInvalid)
            return;

        const body: CreateRoleRequest = {
            name: name ?? "",
            description: description ?? ""
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
                                    <input className="input" type="text" ref={nameInput} maxLength={100} required/>
                                </div>
                                <p className="help is-danger" style={{visibility: "hidden"}} ref={nameHelp}>The name of the role cannot be empty or exceed 100 characters</p>
                            </div>
                            <div className="field">
                                <label className="label">Description</label>
                                <div className="control">
                                    <input className="input" type="text" ref={descriptionInput} maxLength={500} required/>
                                </div>
                                <p className="help is-danger" style={{visibility: "hidden"}} ref={descriptionHelp}>The description of the role cannot be empty or exceed 500 characters</p>
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