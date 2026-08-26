import { useEffect, useState } from "react";
import { getSubjects, createSubject, updateSubject, deleteSubject } from "../../api/subjectApi";
import SubjectForm from "../../components/SubjectForm";
import ConfirmModal from "../../components/ConfirmModal";

export default function AdminSubjects() {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showCreate, setShowCreate] = useState(false);
    const [editing, setEditing] = useState(null);
    const [pendingDelete, setPendingDelete] = useState(null);

    function load() {
        setLoading(true);
        setError("");
        getSubjects()
            .then((data) => setSubjects(data || []))
            .catch((err) => setError(err.message || "Impossible de charger les matières."))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        load();
    }, []);

    function handleCreate(data) {
        createSubject(data)
            .then((created) => {
                setSubjects((prev) => [...prev, created]);
                setShowCreate(false);
            })
            .catch((err) => setError(err.message || "Création impossible."));
    }

    function handleUpdate(data) {
        updateSubject(editing.id, data)
            .then((updated) => {
                setSubjects((prev) => prev.map((s) => (s.id === editing.id ? updated : s)));
                setEditing(null);
            })
            .catch((err) => setError(err.message || "Modification impossible."));
    }

    function confirmDelete() {
        deleteSubject(pendingDelete.id)
            .then(() => {
                setSubjects((prev) => prev.filter((s) => s.id !== pendingDelete.id));
            })
            .catch((err) =>
                setError(err.message || "Suppression impossible. Cette matière est peut-être utilisée par un examen.")
            )
            .finally(() => setPendingDelete(null));
    }

    return (
        <div className="page">
            <div className="container">
                <div className="toolbar">
                    <div className="page-header" style={{ marginBottom: 0 }}>
                        <span className="eyebrow">Gestion</span>
                        <h1>Matières</h1>
                    </div>
                    <button className="btn-gold" onClick={() => setShowCreate(true)}>
                        + Nouvelle matière
                    </button>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                {showCreate && (
                    <div className="builder-section">
                        <h3>Nouvelle matière</h3>
                        <SubjectForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} submitLabel="Créer" />
                    </div>
                )}

                {editing && (
                    <div className="builder-section">
                        <h3>Modifier « {editing.name} »</h3>
                        <SubjectForm
                            initialValue={editing}
                            onSubmit={handleUpdate}
                            onCancel={() => setEditing(null)}
                            submitLabel="Enregistrer"
                        />
                    </div>
                )}

                {loading ? (
                    <div className="loading-block">
                        <span className="spinner" /> Chargement...
                    </div>
                ) : subjects.length === 0 ? (
                    <div className="empty-state">Aucune matière pour le moment.</div>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {subjects.map((subject) => (
                            <tr key={subject.id}>
                                <td>{subject.name}</td>
                                <td>{subject.description || "—"}</td>
                                <td className="actions-cell">
                                    <button className="btn-outline btn-sm" onClick={() => setEditing(subject)}>
                                        Modifier
                                    </button>
                                    <button className="btn-danger btn-sm" onClick={() => setPendingDelete(subject)}>
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {pendingDelete && (
                <ConfirmModal
                    title="Supprimer la matière ?"
                    message={`« ${pendingDelete.name} » sera définitivement supprimée.`}
                    confirmLabel="Supprimer"
                    danger
                    onConfirm={confirmDelete}
                    onCancel={() => setPendingDelete(null)}
                />
            )}
        </div>
    );
}
