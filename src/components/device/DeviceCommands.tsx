import { useState } from 'react';
import type { DeviceCommandsProps } from '../../types/props/DeviceCommandsProps.ts'
import SendDeviceCommandModal from './SendDeviceCommandModal.tsx';
import { getDeviceCommands, sendDeviceCommand } from '../../service/DeviceService.ts';
import type { SendDeviceCommandRequest } from '../../types/requests/device/SendDeviceCommandRequest.ts';
import useAuthSession from '../../hooks/useAuthSession.ts';
import toast from 'react-hot-toast';

const commandTypes = new Map<string, string>([
    ["REBOOT", "Reboot the device"],
    ["KEEP_OPEN", "Keep entry open"],
    ["KEEP_CLOSED", "Keep entry closed"],
    ["OPEN", "Open the entry once (simulate permitted card tap)"],
    ["IDLE", "Return device to normal operation"]
]);

const commandStatuses = new Map<string, string>([
    ["SENT", "✈️"],
    ["RECEIVED_ACK", "✅"],
    ["RECEIVED_EXP", "❌"],
    ["EXPIRED", "⏰"]
]);

function DeviceCommands({ deviceId, commands }: DeviceCommandsProps) {
    const auth = useAuthSession();
    const [showSendCommandModal, setShowSendCommandModal] = useState<boolean>(false);
    const [deviceCommandHistory, setDeviceCommandHistory] = useState(commands);
    const [isSendingCommand, setIsSendingCommand] = useState(false);

    async function _handleSendCommand(command: string) {
        setIsSendingCommand(true);

        try {
            const body: SendDeviceCommandRequest = { command };
            await sendDeviceCommand(deviceId, body, auth.connectedUser.accessToken);
            setShowSendCommandModal(false);
            toast.success("Sent the command!");

            try {
                const updatedHistory = await getDeviceCommands(deviceId, auth.connectedUser.accessToken);
                setDeviceCommandHistory(updatedHistory);
            } catch (error) {
                console.error("Command sent, but failed to refresh history for device " + deviceId, error);
                toast.error("Command sent, but the command history could not be refreshed.");
            }
        } catch (error) {
            console.error("Failed to send command to device " + deviceId, error);
            toast.error(error instanceof Error ? error.message : "Failed to send the command.");
        } finally {
            setIsSendingCommand(false);
        }
    }

    const commandMapping = deviceCommandHistory.map(cm => {
        const finalStatus = cm.status === "SENT" && new Date() > new Date(cm.expiresAt) ? "EXPIRED" : cm.status;

        return (
            <li key={cm.id}>
                <div className='is-flex is-flex-wrap-wrap is-flex-direction-row is-justify-content-space-between m-1'>
                    <span>{commandTypes.get(cm.type) ?? cm.type}</span>
                    <span>{new Date(cm.issuedAt).toLocaleString()} {commandStatuses.get(finalStatus) ?? finalStatus}</span>
                </div>
            </li>
        )
    });

    return (
        <div>
            <div className='is-flex is-flex-wrap-wrap is-flex-direction-row is-justify-content-space-between mb-3 is-align-items-center'>
                <div>
                    <span className="title is-6">Recent remote command history</span>
                </div>
                <div>
                    <button className='button is-warning mr-1' onClick={() => setShowSendCommandModal(true)}>Send a command</button>
                </div>
            </div>
            <div>
                {deviceCommandHistory.length > 0 ? <ul>{commandMapping}</ul> : <span>No commands sent yet</span>}
            </div>
            <div>
                {showSendCommandModal && <SendDeviceCommandModal
                    commands={commandTypes}
                    confirmDisabled={isSendingCommand}
                    onConfirm={_handleSendCommand}
                    onCancel={() => setShowSendCommandModal(false)}
                />}
            </div>
        </div>
    )
}

export default DeviceCommands;