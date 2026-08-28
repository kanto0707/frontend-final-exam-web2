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

    const submittedResults = results?.results || [];

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
                        <div className="value">{results?.attempt_count ?? 0}</div>
                        <div className="label">Tentatives</div>
                    </div>
                    <div className="stat">
                        <div className="value">{results?.average ?? "—"}</div>
                        <div className="label">Moyenne</div>
                    </div>
                </div>

                {submittedResults.length === 0 ? (
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
                        {submittedResults.map((submission) => (
                            <tr key={submission.student_id}>
                                <td>{submission.name || `Étudiant #${submission.student_id}`}</td>
                                <td className="mono">
                                    {submission.score} / {results.total_points}
                                </td>
                                <td className="mono">{formatDateTime(submission.submitted_at)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
