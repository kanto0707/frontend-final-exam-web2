import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getExamResult } from "../../api/examApi";
import Question from "../../components/Question";

export default function StudentResults() {
    const { id } = useParams();

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError("");

        getExamResult(id)
            .then((data) => {
                if (cancelled) return;
                setResult(data);
            })
            .catch((err) => {
                if (!cancelled) {
                    setError(err.message || "Impossible de charger ce résultat.");
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [id]);

    if (loading) {
        return (
            <div className="page">
                <div className="container">
                    <div className="loading-block">
                        <span className="spinner" /> Chargement...
                    </div>
                </div>
            </div>
        );
    }

    if (error || !result) {
        return (
            <div className="page">
                <div className="container">
                    <div className="alert alert-error">
                        {error || "Résultat introuvable."}
                    </div>
                </div>
            </div>
        );
    }

    const questions = result.questions || [];
    const score = result.score ?? 0;
    const total = result.total ?? result.totalQuestions ?? questions.length;

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1>Résultat</h1>
                </div>

                <div className="score-card">
                    <div className="score-value">
                        {score}
                        <span className="score-total">/{total}</span>
                    </div>
                    <p className="sub">
                        {score} bonne(s) réponse(s) sur {total} question(s)
                    </p>
                </div>

                <div className="section">
                    <h3 style={{ marginBottom: 16 }}>Correction</h3>

                    {questions.map((question, index) => (
                        <Question
                            key={question.id}
                            question={question}
                            index={index}
                            review
                            selectedOptionId={question.selectedOptionId}
                            correctOptionId={question.correctOptionId}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}