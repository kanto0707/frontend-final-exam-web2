import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAvailableExams, getExamHistory } from "../../api/examApi";
import ExamCard, { computeDisplayStatus, formatDateTime } from "../../components/ExamCard";

export default function StudentHome({ user }) {
    const [exams, setExams] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError("");

        Promise.all([getAvailableExams(), getExamHistory()])
            .then(([examsData, historyData]) => {
                if (cancelled) return;
                setExams(examsData || []);
                setHistory(historyData || []);
            })
            .catch((err) => {
                if (!cancelled) {
                    setError(err.message || "Impossible de charger votre tableau de bord.");
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const available = exams.filter((e) => computeDisplayStatus(e) === "available");
    const upcoming = exams.filter((e) => computeDisplayStatus(e) === "upcoming");

    // Aperçu : disponibles en priorité, complétés par les à venir, limité à 3.
    const preview = [...available, ...upcoming].slice(0, 3);
    const recentHistory = history.slice(0, 3);

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <span className="eyebrow">Espace étudiant</span>
                    <h1>Bonjour, {user?.name || "Étudiant"}</h1>
                    <p className="sub">Voici un aperçu de vos examens.</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                {loading ? (
                    <div className="loading-block">
                        <span className="spinner" /> Chargement...
                    </div>
                ) : (
                    <>
                        <div className="stat-row">
                            <div className="stat">
                                <div className="value">{available.length}</div>
                                <div className="label">Disponibles</div>
                            </div>
                            <div className="stat">
                                <div className="value">{upcoming.length}</div>
                                <div className="label">À venir</div>
                            </div>
                            <div className="stat">
                                <div className="value">{history.length}</div>
                                <div className="label">Terminés</div>
                            </div>
                        </div>

                        <div className="section">
                            <div className="section-header">
                                <h3>Examens disponibles</h3>
                                <Link to="/student/exams">Voir tous les examens</Link>
                            </div>

                            {preview.length === 0 ? (
                                <p className="sub">Aucun examen disponible pour le moment.</p>
                            ) : (
                                <div className="exam-grid">
                                    {preview.map((exam) => (
                                        <ExamCard key={exam.id} exam={exam} />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="section">
                            <div className="section-header">
                                <h3>Historique</h3>
                                <Link to="/student/history">Voir l'historique complet</Link>
                            </div>

                            {recentHistory.length === 0 ? (
                                <p className="sub">Aucun examen terminé pour le moment.</p>
                            ) : (
                                <div className="history-list">
                                    {recentHistory.map((result) => (
                                        <Link
                                            key={result.id || result.examId}
                                            to={`/student/exams/${result.examId || result.id}/result`}
                                            className="history-row"
                                        >
                                            <div>
                                                <span className="exam-card-subject">
                                                    {result.subjectName || result.exam?.subjectName}
                                                </span>
                                                <div className="history-title">
                                                    {result.examTitle || result.exam?.title}
                                                </div>
                                            </div>
                                            <div className="history-meta">
                                                <span className="mono">
                                                    {formatDateTime(result.submittedAt)}
                                                </span>
                                                {result.score !== undefined && (
                                                    <span className="status status-done">
                                                        {result.score}/{result.total ?? result.totalQuestions}
                                                    </span>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}