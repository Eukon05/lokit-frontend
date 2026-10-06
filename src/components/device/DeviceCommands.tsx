import type { DeviceCommandsProps } from '../../types/props/DeviceCommandsProps.ts'

function DeviceCommands({ deviceId, commands }: DeviceCommandsProps) {
    const types = new Map<string, string>([
        ["REBOOT", "Reboot the device"],
        ["KEEP_OPEN", "Keep entry open"],
        ["KEEP_CLOSED", "Keep entry closed"],
        ["OPEN", "Open the entry once (simulate permitted card tap)"],
        ["IDLE", "Return device to normal operation"]
    ]);

    const statuses = new Map<string, string>([
        ["SENT", "✈️"],
        ["RECEIVED_ACK", "✅"],
        ["RECEIVED_EXP", "❌"],
        ["EXPIRED", "⏰"]
    ]);

    const commandMapping = commands.map(cm => {
        let finalStatus = cm.status == "SENT" && new Date() > new Date(cm.expiresAt) ? "EXPIRED" : cm.status;

        return (
            <li>
                <div className='box is-flex is-flex-wrap-wrap is-flex-direction-row is-justify-content-space-between m-1'>
                    <span>{types.get(cm.type)}</span>
                    <span>{new Date(cm.issuedAt).toLocaleString()} {statuses.get(finalStatus)}</span>
                </div>
            </li>
        )
    });

    return (
        <div className='box p-5'>
            <div className='is-flex is-flex-wrap-wrap is-flex-direction-row is-justify-content-space-between m-3'>
                <div>
                    <span className="mr-3 title is-6">Recent remote command history</span>
                </div>
                <div>
                    <button className='button is-warning mr-1'>Send a command</button>
                </div>
            </div>
            <div>
                <ul>
                    {commandMapping}
                </ul>
            </div>
        </div>
    )
}

export default DeviceCommands;