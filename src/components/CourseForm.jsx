import { useState } from "react";

export default function CourseForm({ initialValue, onSubmit, onCancel, submitLabel = "Créer" }) {
    const [code, setCode] = useState(initialValue?.code || "");
    const [name, setName] = useState(initialValue?.name || "");
    const [description, setDescription] = useState(initialValue?.description || "");
    const [error, setError] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        if (!code.trim() || !name.trim()) {
            setError("Le code et le nom du cours sont requis.");
            return;
        }
        setError("");
        onSubmit({ code: code.trim(), name: name.trim(), description: description.trim() });
    }

    return (
        <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-error">{error}</div>}

            <div className="field-row">
                <div className="field">
                    <label>Code du cours</label>
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Ex : PROG2"
                        autoFocus
                    />
                </div>
                <div className="field">
                    <label>Nom du cours</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex : Programmation 2"
                    />
                </div>
            </div>

            <div className="field">
                <label>Description (optionnel)</label>
                <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="modal-actions" style={{ justifyContent: "flex-start" }}>
                <button type="submit" className="btn-primary">
                    {submitLabel}
                </button>
                {onCancel && (
                    <button type="button" className="btn-outline" onClick={onCancel}>
                        Annuler
                    </button>
                )}
            </div>
        </form>
    );
}
