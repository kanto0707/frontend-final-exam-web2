import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getExam } from "../../api/examApi";
import { formatDateTime } from "../../components/ExamCard";

export default function AdminExam() {
    const { id } = useParams();
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        setLoading(true);
        setError("");
        getExam(id)
            .then((data) => setExam(data))
            .catch((err) => setError(err.message || "Impossible de charger cet examen."))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="page">
                <div className="container loading-block">
                    <span className="spinner" /> Chargement...
                </div>
            </div>
        );
    }

    if (error || !exam) {
        return (
            <div className="page">
                <div className="container">
                    <div className="alert alert-error">{error || "Examen introuvable."}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container">
                <div className="toolbar">
                    <div className="page-header" style={{ marginBottom: 0 }}>
                        <span className="eyebrow">{exam.subjectName}</span>
                        <h1>{exam.title || exam.subjectName}</h1>
                        <p className="sub">{exam.description}</p>
                    </div>
                    <Link to={`/admin/exams/${id}/edit`} className="btn-outline">
                        Modifier cet examen
                    </Link>
                </div>

                <div className="stat-row">
                    <div className="stat">
                        <div className="value mono" style={{ fontSize: "1.1rem" }}>
                            {formatDateTime(exam.startsAt)}
                        </div>
                        <div className="label">Début</div>
                    </div>
                    <div className="stat">
                        <div className="value mono" style={{ fontSize: "1.1rem" }}>
                            {formatDateTime(exam.endsAt)}
                        </div>
                        <div className="label">Fin</div>
                    </div>
                    <div className="stat">
                        <div className="value">{exam.questions?.length || 0}</div>
                        <div className="label">Questions</div>
                    </div>
                </div>

                <h3>Questions et bonnes réponses</h3>
                {(exam.questions || []).map((q, i) => (
                    <div className="question-block" key={q.id}>
                        <span className="question-index">Question {i + 1}</span>
                        <p className="question-text">{q.text}</p>
                        <div className="option-list">
                            {q.options.map((opt) => (
                                <div
                                    key={opt.id}
                                    className={`option-item disabled ${opt.id === q.correctOptionId ? "correct" : ""}`}
                                >
                                    {opt.text}
                                    {opt.id === q.correctOptionId && " — bonne réponse"}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
