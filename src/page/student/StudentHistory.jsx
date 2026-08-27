import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getExamHistory } from "../../api/examApi";
import { formatDateTime } from "../../components/ExamCard";

export default function StudentHistory() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError("");

        getExamHistory()
            .then((data) => {
                if (cancelled) return;
                setHistory(data || []);
            })
            .catch((err) => {
                if (!cancelled) {
                    setError(err.message || "Impossible de charger votre historique.");
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <span className="eyebrow">Historique</span>
                    <h1>Mes résultats</h1>
                    <p className="sub">
                        Un examen non soumis avant sa date de fin apparaît avec une note de 0.
                    </p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                {loading ? (
                    <div className="loading-block">
                        <span className="spinner" /> Chargement...
                    </div>
                ) : history.length === 0 ? (
                    <p className="sub">Aucun résultat pour le moment.</p>
                ) : (
                    <table className="results-table">
                        <thead>
                            <tr>
                                <th>Matière</th>
                                <th>Examen</th>
                                <th>Note</th>
                                <th>Soumis le</th>
                                <th>Statut</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((result) => {
                                const examId = result.examId || result.exam?.id;
                                const total = result.total ?? result.totalQuestions;

                                return (
                                    <tr key={result.id || examId}>
                                        <td>{result.subjectName || result.exam?.subjectName}</td>
                                        <td>{result.examTitle || result.exam?.title}</td>
                                        <td>
                                            {result.score}/{total}
                                        </td>
                                        <td className="mono">{formatDateTime(result.submittedAt)}</td>
                                        <td>
                                            <span className="status status-submitted">Soumis</span>
                                        </td>
                                        <td>
                                            <Link to={`/student/exams/${examId}/result`}>Détails</Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}