import { useRef } from 'react'
import useAuthSession from '../../hooks/useAuthSession';
import { useNavigate } from 'react-router';
import type { CreateDeviceRequest } from '../../types/requests/device/CreateDeviceRequest';
import { createDevice } from '../../service/DeviceService';
import toast from 'react-hot-toast';

function CreateDeviceForm() {
    const auth = useAuthSession();
    const navigate = useNavigate();
    const nameInput = useRef<HTMLInputElement>(null);
    const descriptionInput = useRef<HTMLInputElement>(null);
    const physicalAddrInput = useRef<HTMLInputElement>(null);

    const nameHelp = useRef<HTMLParagraphElement>(null);
    const descriptionHelp = useRef<HTMLParagraphElement>(null);
    const physicalAddrHelp = useRef<HTMLParagraphElement>(null);

    const macPattern = '^((([0-9A-Fa-f]{2})(:|-)){5}([0-9A-Fa-f]{2})|([0-9A-Fa-f]{4}\.[0-9A-Fa-f]{4}\.[0-9A-Fa-f]{4}))$';

    async function _submitAction() {
        const name = nameInput.current?.value.trim();
        const desc = descriptionInput.current?.value.trim();
        const phyAddr = physicalAddrInput.current?.value.trim();

        const nameInvalid = !name || name.length > 100;
        const descriptionInvalid = !desc || desc.length > 500;
        const physicalAddrInvalid = !phyAddr || !phyAddr.match(macPattern);

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

        if(physicalAddrInvalid){
            physicalAddrInput.current?.classList.add("is-danger")
            if(physicalAddrHelp.current) physicalAddrHelp.current.style.visibility = "visible";
        }
        else {
            physicalAddrInput.current?.classList.remove("is-danger")
            if(physicalAddrHelp.current) physicalAddrHelp.current.style.visibility = "hidden";
        }

        if(nameInvalid || descriptionInvalid || physicalAddrInvalid)
            return;

        const body: CreateDeviceRequest = {
            name: name ?? "",
            description: desc ?? "",
            physicalAddress: phyAddr ?? ""
        };

        const deviceId: string = (await createDevice(body, auth.connectedUser.accessToken)).replaceAll("\"", "");
        toast.success("Device created!");
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
                                <p className="help is-danger" style={{visibility: "hidden"}} ref={nameHelp}>The name of the device cannot be empty or exceed 100 characters</p>
                            </div>
                            <div className="field">
                                <label className="label">Description</label>
                                <div className="control">
                                    <input className="input" type="text" ref={descriptionInput} maxLength={500} required/>
                                </div>
                                <p className="help is-danger" style={{visibility: "hidden"}} ref={descriptionHelp}>The description of the device cannot be empty or exceed 500 characters</p>
                            </div>
                            <div className="field">
                                <label className="label">Physical address (MAC)</label>
                                <div className="control">
                                    <input className="input" type="text" ref={physicalAddrInput} maxLength={17} pattern={macPattern} required/>
                                </div>
                                <p className="help is-danger" style={{visibility: "hidden"}} ref={physicalAddrHelp}>The physical address must be a valid MAC address</p>
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