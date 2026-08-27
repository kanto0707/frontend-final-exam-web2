import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStudents, createStudent, setStudentBlocked } from "../../api/studentApi";
import ConfirmModal from "../../components/ConfirmModal";

function emptyForm() {
    return { name: "", email: "", password: "" };
}

export default function AdminStudents() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showCreate, setShowCreate] = useState(false);
    const [form, setForm] = useState(emptyForm());
    const [pendingBlock, setPendingBlock] = useState(null);

    function load() {
        setLoading(true);
        setError("");
        getStudents()
            .then((data) => setStudents(data || []))
            .catch((err) => setError(err.message || "Impossible de charger les étudiants."))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        load();
    }, []);

    function handleCreate(e) {
        e.preventDefault();
        if (!form.name.trim() || !form.email.trim() || !form.password) {
            setError("Nom, email et mot de passe sont requis.");
            return;
        }
        createStudent(form)
            .then((created) => {
                setStudents((prev) => [...prev, created]);
                setForm(emptyForm());
                setShowCreate(false);
                setError("");
            })
            .catch((err) => setError(err.message || "Création impossible."));
    }

    function confirmToggleBlock() {
        const { student, blocked } = pendingBlock;
        setStudentBlocked(student.id, blocked)
            .then((updated) => {
                setStudents((prev) => prev.map((s) => (s.id === student.id ? updated : s)));
            })
            .catch((err) => setError(err.message || "Action impossible."))
            .finally(() => setPendingBlock(null));
    }

    return (
        <div className="page">
            <div className="container">
                <div className="toolbar">
                    <div className="page-header" style={{ marginBottom: 0 }}>
                        <span className="eyebrow">Gestion</span>
                        <h1>Étudiants</h1>
                    </div>
                    <button className="btn-gold" onClick={() => setShowCreate((v) => !v)}>
                        + Ajouter un étudiant
                    </button>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                {showCreate && (
                    <div className="builder-section">
                        <h3>Nouvel étudiant</h3>
                        <form onSubmit={handleCreate}>
                            <div className="field-row">
                                <div className="field">
                                    <label>Nom</label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    />
                                </div>
                                <div className="field">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <label>Mot de passe initial</label>
                                <input
                                    type="password"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                />
                                <p className="hint">
                                    Seul un Admin peut modifier ce mot de passe par la suite.
                                </p>
                            </div>
                            <button type="submit" className="btn-primary">
                                Créer le compte
                            </button>
                        </form>
                    </div>
                )}

                {loading ? (
                    <div className="loading-block">
                        <span className="spinner" /> Chargement...
                    </div>
                ) : students.length === 0 ? (
                    <div className="empty-state">Aucun étudiant enregistré.</div>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {students.map((student) => (
                            <tr key={student.id}>
                                <td>{student.name}</td>
                                <td>{student.email}</td>
                                <td>
                    <span className={`status ${student.blocked ? "status-blocked" : "status-available"}`}>
                      {student.blocked ? "Bloqué" : "Actif"}
                    </span>
                                </td>
                                <td className="actions-cell">
                                    <Link to={`/admin/students/${student.id}`} className="btn-outline btn-sm">
                                        Détails
                                    </Link>
                                    <button
                                        className={student.blocked ? "btn-outline btn-sm" : "btn-danger btn-sm"}
                                        onClick={() => setPendingBlock({ student, blocked: !student.blocked })}
                                    >
                                        {student.blocked ? "Débloquer" : "Bloquer"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>

            {pendingBlock && (
                <ConfirmModal
                    title={pendingBlock.blocked ? "Bloquer cet étudiant ?" : "Débloquer cet étudiant ?"}
                    message={`${pendingBlock.student.name} ${
                        pendingBlock.blocked
                            ? "ne pourra plus se connecter ni passer d'examen."
                            : "pourra de nouveau se connecter."
                    }`}
                    confirmLabel={pendingBlock.blocked ? "Bloquer" : "Débloquer"}
                    danger={pendingBlock.blocked}
                    onConfirm={confirmToggleBlock}
                    onCancel={() => setPendingBlock(null)}
                />
            )}
        </div>
    );
}
