import type { ReactNode } from "react"

export type ConfirmationModalProps = {
    text: string,
    subtext?: string,
    onConfirm: () => void,
    onCancel: () => void,
    confirmDisabled?: boolean,
    children?: ReactNode | ReactNode[]
}