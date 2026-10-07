export type SendDeviceCommandModalProps = {
    commands: Map<string, string>,
    confirmDisabled?: boolean,
    onConfirm: (command: string) => void,
    onCancel: () => void;
}