import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getExam, getExamResults } from "../../api/examApi";
import { formatDateTime } from "../../components/ExamCard";

export default function AdminExamResults() {
    const { id } = useParams();
    const [exam, setExam] = useState(null);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        Promise.all([getExam(id), getExamResults(id)])
            .then(([examData, resultsData]) => {
                setExam(examData);
                setResults(resultsData);
            })
            .catch((err) => setError(err.message || "Impossible de charger les résultats."))
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

    if (error) {
        return (
            <div className="page">
                <div className="container">
                    <div className="alert alert-error">{error}</div>
                </div>
            </div>
        );
    }

    const students = results?.students || [];

    return (
        <div className="page">
            <div className="container">
                <div className="toolbar">
                    <div className="page-header" style={{ marginBottom: 0 }}>
                        <span className="eyebrow">{exam?.subjectName || exam?.courseName}</span>
                        <h1>Résultats — {exam?.title}</h1>
                    </div>
                    <Link to="/admin/exams" className="btn-outline">
                        Retour aux examens
                    </Link>
                </div>

                <div className="stat-row">
                    <div className="stat">
                        <div className="value">{results?.attemptCount ?? 0}</div>
                        <div className="label">Tentatives</div>
                    </div>
                    <div className="stat">
                        <div className="value">{results?.average ?? 0}</div>
                        <div className="label">Moyenne</div>
                    </div>
                </div>

                {students.length === 0 ? (
                    <div className="empty-state">Aucun étudiant n'a encore passé cet examen.</div>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>Étudiant</th>
                            <th>Note</th>
                            <th>Soumis le</th>
                        </tr>
                        </thead>
                        <tbody>
                        {students.map((s) => (
                            <tr key={s.studentId}>
                                <td>{s.studentName || s.studentId}</td>
                                <td className="mono">{s.score}</td>
                                <td className="mono">{formatDateTime(s.submittedAt)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
