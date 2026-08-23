import { useRef } from 'react'
import useAuthSession from '../../hooks/useAuthSession';
import { useNavigate } from 'react-router';
import type { CreateDeviceRequest } from '../../types/requests/device/CreateDeviceRequest';
import { createDevice } from '../../service/DeviceService';

function CreateDeviceForm() {
    const auth = useAuthSession();
    const navigate = useNavigate();
    const nameInput = useRef<HTMLInputElement>(null);
    const descriptionInput = useRef<HTMLInputElement>(null);
    const physicalAddrInput = useRef<HTMLInputElement>(null);

    const macPattern = '^((([0-9A-Fa-f]{2})(:|-)){5}([0-9A-Fa-f]{2})|([0-9A-Fa-f]{4}\.[0-9A-Fa-f]{4}\.[0-9A-Fa-f]{4}))$';

    async function _submitAction() {
        const name = nameInput.current?.value;
        const desc = descriptionInput.current?.value;
        const phyAddr = physicalAddrInput.current?.value;

        if(!name)
            nameInput.current?.classList.add("is-danger")

        if(!desc)
            descriptionInput.current?.classList.add("is-danger")

        if(!phyAddr || !phyAddr.match(macPattern))
            physicalAddrInput.current?.classList.add("is-danger")

        if(!name || !desc || !phyAddr || !phyAddr.match(macPattern))
            return;

        const body: CreateDeviceRequest = {
            name: name ?? "",
            description: desc ?? "",
            physicalAddress: phyAddr ?? ""
        };

        const deviceId: string = (await createDevice(body, auth.connectedUser.accessToken)).replaceAll("\"", "");
        navigate("/devices/" + deviceId, { replace: true, state: { refreshDevices: Date.now() } });
    }

    return (
        <div>
            <div className="card">
                <div className="card-content">
                    <div className="media-content">
                        <div>
                            <p className='title'>Create a new device</p>
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
                            <div className="field">
                                <label className="label">Physical address (MAC)</label>
                                <div className="control">
                                    <input className="input" type="text" ref={physicalAddrInput} maxLength={17} pattern={macPattern} required/>
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

export default CreateDeviceForm;