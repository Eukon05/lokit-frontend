import { useState } from "react";

type EditDetailsModalProps = {
    title: string,
    initialName?: string,
    initialDescription?: string,
    includeDescription?: boolean,
    onConfirm: (changes: { name?: string, description?: string }) => void,
    onCancel: () => void,
};

function EditDetailsModal({ title, initialName = "", initialDescription = "", includeDescription = true, onConfirm, onCancel }: EditDetailsModalProps) {
    const [name, setName] = useState(initialName);
    const [description, setDescription] = useState(initialDescription);

    const hasChanges = name !== initialName || (includeDescription && description !== initialDescription);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const updatePayload: { name?: string, description?: string } = {};
        const trimmedName = name.trim();
        const trimmedDescription = description.trim();

        if (trimmedName !== (initialName ?? "").trim()) {
            updatePayload.name = trimmedName;
        }

        if (includeDescription && trimmedDescription !== (initialDescription ?? "").trim()) {
            updatePayload.description = trimmedDescription;
        }

        onConfirm(updatePayload);
    }

    return (
        <div className="modal is-active">
            <div className="modal-background" onClick={onCancel}></div>
            <div className="modal-content">
                <div className="box">
                    <p className="title is-5">{title}</p>
                    <form onSubmit={handleSubmit}>
                        <div className="field">
                            <label className="label">Name</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="text"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    maxLength={100}
                                />
                            </div>
                        </div>

                        {includeDescription && <div className="field">
                            <label className="label">Description</label>
                            <div className="control">
                                <input
                                    className="input"
                                    type="text"
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value)}
                                    maxLength={500}
                                />
                            </div>
                        </div>}

                        <div className="is-flex is-justify-content-flex-end">
                            <button type="button" className="button mr-2" onClick={onCancel}>Cancel</button>
                            <button type="submit" className="button is-primary" disabled={!hasChanges}>Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditDetailsModal;
