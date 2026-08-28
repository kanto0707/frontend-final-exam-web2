import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getExams, deleteExam } from "../../api/examApi";
import ExamCard from "../../components/ExamCard";
import ConfirmModal from "../../components/ConfirmModal";

export default function AdminExams() {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [pendingDelete, setPendingDelete] = useState(null);

    function load() {
        setLoading(true);
        setError("");
        getExams()
            .then((data) => setExams(data || []))
            .catch((err) => setError(err.message || "Impossible de charger les examens."))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        load();
    }, []);

    function confirmDelete() {
        if (!pendingDelete) return;
        deleteExam(pendingDelete.id)
            .then(() => {
                setExams((prev) => prev.filter((e) => e.id !== pendingDelete.id));
            })
            .catch((err) => setError(err.message || "Suppression impossible."))
            .finally(() => setPendingDelete(null));
    }

    return (
        <div className="page">
            <div className="container">
                <div className="toolbar">
                    <div className="page-header" style={{ marginBottom: 0 }}>
                        <span className="eyebrow">Gestion</span>
                        <h1>Examens</h1>
                    </div>
                    <Link to="/admin/exams/create" className="btn-gold">
                        + Créer un examen
                    </Link>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                {loading ? (
                    <div className="loading-block">
                        <span className="spinner" /> Chargement...
                    </div>
                ) : exams.length === 0 ? (
                    <div className="empty-state">Aucun examen n'a encore été créé.</div>
                ) : (
                    <div className="grid grid-cards">
                        {exams.map((exam) => (
                            <div key={exam.id}>
                                <ExamCard exam={exam} viewer="admin" />
                                <div className="actions-cell" style={{ marginTop: 10 }}>
                                    <Link to={`/admin/exams/${exam.id}/questions`} className="btn-outline btn-sm">
                                        Questions
                                    </Link>
                                    <Link to={`/admin/exams/${exam.id}/results`} className="btn-outline btn-sm">
                                        Résultats
                                    </Link>
                                    <button className="btn-danger btn-sm" onClick={() => setPendingDelete(exam)}>
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {pendingDelete && (
                <ConfirmModal
                    title="Supprimer l'examen ?"
                    message={`Cette action supprimera définitivement l'examen "${pendingDelete.title || pendingDelete.subjectName}".`}
                    confirmLabel="Supprimer"
                    danger
                    onConfirm={confirmDelete}
                    onCancel={() => setPendingDelete(null)}
                />
            )}
        </div>
    );
}
