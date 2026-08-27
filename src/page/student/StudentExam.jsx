import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getExamToTake, submitExam } from "../../api/examApi";
import { formatDateTime } from "../../components/ExamCard";
import Question from "../../components/Question";

export default function StudentExam() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [exam, setExam] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError("");

        getExamToTake(id)
            .then((examData) => {
                if (cancelled) return;
                setExam(examData);
            })
            .catch((err) => {
                if (!cancelled) {
                    setError(err.message || "Impossible de charger cet examen.");
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [id]);

    const handleSelect = useCallback((questionId, optionId) => {
        setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    }, []);

    const questions = exam?.questions || [];
    const answeredCount = Object.keys(answers).length;

    const handleSubmit = () => {
        if (submitting) return;

        if (answeredCount < questions.length) {
            const confirmed = window.confirm(
                `Il vous reste ${questions.length - answeredCount} question(s) sans réponse. Soumettre quand même ?`
            );
            if (!confirmed) return;
        }

        setSubmitting(true);
        setError("");

        const payload = Object.entries(answers).map(([questionId, choiceId]) => ({
            id_question: Number(questionId),
            id_choice: Number(choiceId),
        }));

        submitExam(id, payload)
            .then(() => {
                navigate(`/student/exams/${id}/result`, { replace: true });
            })
            .catch((err) => {
                setError(err.message || "Impossible de soumettre l'examen.");
                setSubmitting(false);
            });
    };

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

    if (error && !exam) {
        return (
            <div className="page">
                <div className="container">
                    <div className="alert alert-error">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container">
                <div className="page-header exam-header">
                    <div>
                        <span className="eyebrow">{exam.subjectName}</span>
                        <h1>{exam.title || exam.subjectName}</h1>
                        {exam.description && <p className="sub">{exam.description}</p>}
                    </div>
                    <span className="deadline-badge">
                        Ouvert jusqu'au {formatDateTime(exam.endsAt)}
                    </span>
                </div>

                <p className="progress-hint">
                    {answeredCount} / {questions.length} question(s) répondue(s)
                </p>

                {error && <div className="alert alert-error">{error}</div>}

                {questions.map((question, index) => (
                    <Question
                        key={question.id}
                        question={question}
                        index={index}
                        selectedOptionId={answers[question.id]}
                        onSelect={handleSelect}
                    />
                ))}

                <div className="exam-submit-bar">
                    <button
                        type="button"
                        className="btn-gold"
                        onClick={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? "Envoi..." : "Soumettre l'examen"}
                    </button>
                </div>
            </div>
        </div>
    );
}