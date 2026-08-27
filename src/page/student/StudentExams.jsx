import { useEffect, useState } from "react";
import { getAvailableExams } from "../../api/examApi";
import ExamCard from "../../components/ExamCard";

export default function StudentExams() {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError("");

        getAvailableExams()
            .then((examsData) => {
                if (cancelled) return;
                setExams(examsData || []);
            })
            .catch((err) => {
                if (!cancelled) {
                    setError(err.message || "Impossible de charger vos examens.");
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
                    <span className="eyebrow">Vos examens</span>
                    <h1>Examens</h1>
                    <p className="sub">
                        Un examen n'est accessible que pendant sa période d'ouverture. Une fois
                        soumis, il ne peut pas être repassé.
                    </p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                {loading ? (
                    <div className="loading-block">
                        <span className="spinner" /> Chargement...
                    </div>
                ) : exams.length === 0 ? (
                    <p className="sub">Aucun examen pour le moment.</p>
                ) : (
                    <div className="exam-grid">
                        {exams.map((exam) => (
                            <ExamCard key={exam.id} exam={exam} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}