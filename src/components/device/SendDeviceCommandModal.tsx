import { useState } from "react";
import type { SendDeviceCommandModalProps } from "../../types/props/SendDeviceCommandModalProps";
import ConfirmationModal from "../common/ConfirmationModal";

function SendDeviceCommandModal({commands, confirmDisabled, onConfirm, onCancel}: SendDeviceCommandModalProps) {
    const [selectedCommand, setSelectedCommand] = useState<string>(() => commands.keys().next().value ?? "");

    const commandSelector = (
        <div className="field">
            <div className="control">
                <div className='select'>
                    <select value={selectedCommand}
                        onChange={(event) => setSelectedCommand(event.target.value)}>
                        {Array.from(commands.entries())
                            .map(([key, value]) => {
                                return <option key={key} value={key}>{value}</option>
                            })}
                    </select>
                </div>
            </div>
        </div>
    )

    return (
        <ConfirmationModal
            text="Which command would you like to send?"
            confirmDisabled={confirmDisabled || !selectedCommand}
            children={commandSelector}
            onConfirm={() => onConfirm(selectedCommand)}
            onCancel={onCancel}
        />
    )
}

export default SendDeviceCommandModal;