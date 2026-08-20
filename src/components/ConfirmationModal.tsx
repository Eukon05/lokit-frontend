import type { ConfirmationModalProps } from "../types/props/ConfirmationModalProps";

function ConfirmationModal({ text, subtext, onConfirm, onCancel}: ConfirmationModalProps) {
    return (
        <div className="modal is-active">
            <div className="modal-background"></div>
            <div className="modal-content">
                <div className="box">
                    <p className="title is-4">{text}</p>
                    <p className="subtitle is-5">{subtext}</p>
                    <div className="is-flex is-flex-direction-row is-flex-justify-content-space-between">
                        <button className="button is-danger mr-1" onClick={onConfirm}>Confirm</button>
                        <button className="button" onClick={onCancel}>Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationModal;