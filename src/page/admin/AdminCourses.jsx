import { useEffect, useState } from "react";
import { getCourses, createCourse, updateCourse, deleteCourse } from "../../api/courseApi";
import CourseForm from "../../components/CourseForm";
import ConfirmModal from "../../components/ConfirmModal";

export default function AdminCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showCreate, setShowCreate] = useState(false);
    const [editing, setEditing] = useState(null);
    const [pendingDelete, setPendingDelete] = useState(null);

    function load() {
        setLoading(true);
        setError("");
        getCourses()
            .then((data) => setCourses(data || []))
            .catch((err) => setError(err.message || "Impossible de charger les cours."))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        load();
    }, []);

    function handleCreate(data) {
        createCourse(data)
            .then((created) => {
                setCourses((prev) => [...prev, created]);
                setShowCreate(false);
            })
            .catch((err) => setError(err.message || "Création impossible."));
    }

    function handleUpdate(data) {
        updateCourse(editing.id, data)
            .then((updated) => {
                setCourses((prev) => prev.map((c) => (c.id === editing.id ? updated : c)));
                setEditing(null);
            })
            .catch((err) => setError(err.message || "Modification impossible."));
    }

    function confirmDelete() {
        deleteCourse(pendingDelete.id)
            .then(() => {
                setCourses((prev) => prev.filter((c) => c.id !== pendingDelete.id));
            })
            .catch((err) =>
                setError(err.message || "Suppression impossible. Ce cours possède peut-être des examens.")
            )
            .finally(() => setPendingDelete(null));
    }

    return (
        <div className="page">
            <div className="container">
                <div className="toolbar">
                    <div className="page-header" style={{ marginBottom: 0 }}>
                        <span className="eyebrow">Gestion</span>
                        <h1>Cours</h1>
                    </div>
                    <button className="btn-gold" onClick={() => setShowCreate(true)}>
                        + Nouveau cours
                    </button>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                {showCreate && (
                    <div className="builder-section">
                        <h3>Nouveau cours</h3>
                        <CourseForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} submitLabel="Créer" />
                    </div>
                )}

                {editing && (
                    <div className="builder-section">
                        <h3>Modifier « {editing.name} »</h3>
                        <CourseForm
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
                ) : courses.length === 0 ? (
                    <div className="empty-state">Aucun cours pour le moment.</div>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>Code</th>
                            <th>Nom</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {courses.map((course) => (
                            <tr key={course.id}>
                                <td className="mono">{course.code}</td>
                                <td>{course.name}</td>
                                <td>{course.description || "—"}</td>
                                <td className="actions-cell">
                                    <button className="btn-outline btn-sm" onClick={() => setEditing(course)}>
                                        Modifier
                                    </button>
                                    <button className="btn-danger btn-sm" onClick={() => setPendingDelete(course)}>
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
                    title="Supprimer le cours ?"
                    message={`« ${pendingDelete.name} » sera définitivement supprimé.`}
                    confirmLabel="Supprimer"
                    danger
                    onConfirm={confirmDelete}
                    onCancel={() => setPendingDelete(null)}
                />
            )}
        </div>
    );
}
