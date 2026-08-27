import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getExamToTake, submitExam } from "../../api/examApi";
import Question from "../../components/Question";
import ConfirmModal from "../../components/ConfirmModal";
import { formatDateTime } from "../../components/ExamCard";

export default function StudentExam() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [exam, setExam] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    useEffect(() => {
        getExamToTake(id)
            .then((data) => setExam(data))
            .catch((err) => setError(err.message || "Cet examen n'est pas accessible en ce moment."))
            .finally(() => setLoading(false));
    }, [id]);

    function selectAnswer(questionId, optionId) {
        setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    }

    function handleConfirmSubmit() {
        setConfirmOpen(false);
        setSubmitting(true);
        setError("");

        const payload = exam.questions.map((q) => ({
            questionId: q.id,
            optionId: answers[q.id] || null,
        }));

        submitExam(id, payload)
            .then(() => {
                navigate(`/student/exams/${id}/result`, { replace: true });
            })
            .catch((err) => {
                setError(err.message || "Impossible de soumettre l'examen. Réessayez.");
                setSubmitting(false);
            });
    }

    if (loading) {
        return (
            <div className="page">
                <div className="container loading-block">
                    <span className="spinner" /> Chargement de l'examen...
                </div>
            </div>
        );
    }

    if (error && !exam) {
        return (
            <div className="page">
                <div className="container">
                    <div className="alert alert-error">{error}</div>
                    <Link to="/student/exams" className="btn-outline">
                        Retour aux examens
                    </Link>
                </div>
            </div>
        );
    }

    const answeredCount = Object.keys(answers).length;

    return (
        <div className="page">
            <div className="container">
                <div className="exam-take-header">
                    <div>
                        <span className="eyebrow">{exam.subjectName}</span>
                        <h1>{exam.title || exam.subjectName}</h1>
                        <p className="sub">{exam.description}</p>
                    </div>
                    <div className="timer-chip">Ouvert jusqu'au {formatDateTime(exam.endsAt)}</div>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <p className="exam-progress">
                    {answeredCount} / {exam.questions.length} question(s) répondue(s)
                </p>

                {exam.questions.map((q, i) => (
                    <Question
                        key={q.id}
                        question={q}
                        index={i}
                        selectedOptionId={answers[q.id]}
                        onSelect={selectAnswer}
                    />
                ))}

                <button className="btn-primary" disabled={submitting} onClick={() => setConfirmOpen(true)}>
                    {submitting ? "Envoi..." : "Soumettre l'examen"}
                </button>
            </div>

            {confirmOpen && (
                <ConfirmModal
                    title="Soumettre l'examen ?"
                    message={
                        answeredCount < exam.questions.length
                            ? `Vous n'avez répondu qu'à ${answeredCount} question(s) sur ${exam.questions.length}. Les questions sans réponse valent 0 point. Vous ne pourrez plus modifier vos réponses après soumission.`
                            : "Vous ne pourrez plus modifier vos réponses après soumission."
                    }
                    confirmLabel="Soumettre"
                    onConfirm={handleConfirmSubmit}
                    onCancel={() => setConfirmOpen(false)}
                />
            )}
        </div>
    );
}