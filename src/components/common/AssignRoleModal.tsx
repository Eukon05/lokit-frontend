import { useState, useEffect } from 'react'
import useAuthSession from '../../hooks/useAuthSession';
import type { RoleResponse } from '../../types/responses/role/RoleResponse';
import { useLocation } from 'react-router';
import { getAllRoles } from '../../service/RoleService';
import type { AssignRoleModalProps } from '../../types/props/AssignRoleModalProps';

function AssignRoleModal({ excludeRoles, onConfirm, onCancel }: AssignRoleModalProps) {
    const auth = useAuthSession();
    const location = useLocation();
    const [roles, setRoles] = useState<RoleResponse[]>();
    const [selectedRoleId, setSelectedRoleId] = useState("");

    useEffect(() => {
        let isActive = true;

        async function loadRoles() {
            try {
                let allRoles = await getAllRoles(auth.connectedUser.accessToken);
                if (excludeRoles)
                    allRoles = allRoles.filter(r => !excludeRoles.some(excludedRole => excludedRole.id === r.id))
                        .sort((o, t) => o.name.localeCompare(t.name));

                if (isActive) {
                    setRoles(allRoles);
                    setSelectedRoleId(allRoles[0]?.id ?? "");
                }
            } catch (error) {
                console.error("Failed to load roles", error);
            }
        }

        void loadRoles();

        return () => {
            isActive = false;
        };
    }, [auth.connectedUser.accessToken, location.state?.refreshRoles, excludeRoles])

    const roleSelector = roles && roles.length > 0 ? (
        <div className="field">
            <div className="control">
                <div className='select'>
                    <select value={selectedRoleId}
                        onChange={(event) => setSelectedRoleId(event.target.value)}>
                        {roles?.sort((o, t) => o.name.localeCompare(t.name))
                            .map(u => {
                                return <option key={u.id} value={u.id}>{u.name}</option>
                            })}
                    </select>
                </div>
            </div>
        </div>
    ) : <p>There are no roles left to assign</p>

    return (
        <div className="modal is-active">
            <div className="modal-background"></div>
            <div className="modal-content">
                <div className="box">
                    <p className="title is-4">Which role would you like to assign?</p>
                    {roleSelector}
                    <div className="is-flex is-flex-direction-row is-flex-justify-content-space-between">
                        <button className="button is-danger mr-1" disabled={!selectedRoleId} onClick={() => {
                            const selectedRole = roles?.find((role) => role.id === selectedRoleId);
                            if (selectedRole) onConfirm(selectedRole);
                        }}>Confirm</button>
                        <button className="button" onClick={onCancel}>Cancel</button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default AssignRoleModal;