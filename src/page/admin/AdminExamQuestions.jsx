import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getExam, getExamQuestions, addExamQuestion, deleteExamQuestion } from "../../api/examApi";
import QuestionForm from "../../components/QuestionForm";
import ConfirmModal from "../../components/ConfirmModal";

function emptyQuestion() {
    return {
        id: crypto.randomUUID(),
        text: "",
        points: 1,
        correctOptionId: null,
        options: [
            { id: crypto.randomUUID(), text: "" },
            { id: crypto.randomUUID(), text: "" },
        ],
    };
}

export default function AdminExamQuestions() {
    const { id } = useParams();
    const [exam, setExam] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [draft, setDraft] = useState(emptyQuestion());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [pendingDelete, setPendingDelete] = useState(null);

    function load() {
        setLoading(true);
        setError("");
        Promise.all([getExam(id), getExamQuestions(id)])
            .then(([examData, questionsData]) => {
                setExam(examData);
                setQuestions(questionsData || []);
            })
            .catch((err) => setError(err.message || "Impossible de charger cet examen."))
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        load();
    }, [id]);

    function handleAddQuestion() {
        if (!draft.text.trim() || !draft.correctOptionId || !draft.points || draft.points < 1 || draft.options.some((o) => !o.text.trim())) {
            setError("Complétez l'énoncé, les points, les propositions et la bonne réponse.");
            return;
        }
        setError("");
        addExamQuestion(id, draft)
            .then((created) => {
                setQuestions((prev) => [...prev, created]);
                setDraft(emptyQuestion());
            })
            .catch((err) => setError(err.message || "Impossible d'ajouter la question."));
    }

    function confirmDeleteQuestion() {
        deleteExamQuestion(pendingDelete.id)
            .then(() => {
                setQuestions((prev) => prev.filter((q) => q.id !== pendingDelete.id));
            })
            .catch((err) =>
                setError(err.message || "Suppression impossible (des tentatives existent peut-être déjà).")
            )
            .finally(() => setPendingDelete(null));
    }

    if (loading) {
        return (
            <div className="page">
                <div className="container loading-block">
                    <span className="spinner" /> Chargement...
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container">
                <div className="toolbar">
                    <div className="page-header" style={{ marginBottom: 0 }}>
                        <span className="eyebrow">{exam?.subjectName || exam?.courseName}</span>
                        <h1>Questions — {exam?.title}</h1>
                    </div>
                    <Link to="/admin/exams" className="btn-outline">
                        Retour aux examens
                    </Link>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <h3>Questions existantes ({questions.length})</h3>
                {questions.length === 0 ? (
                    <div className="empty-state">Aucune question pour le moment.</div>
                ) : (
                    questions.map((q, i) => (
                        <div className="question-block" key={q.id}>
                            <div className="toolbar" style={{ marginBottom: 8 }}>
                                <span className="question-index">Question {i + 1}</span>
                                <span>{q.points} point(s)</span>
                                <button className="btn-danger btn-sm" onClick={() => setPendingDelete(q)}>
                                    Supprimer
                                </button>
                            </div>
                            <p className="question-text">{q.statement}</p>
                            <div className="option-list">
                                {(q.choices || []).map((choice) => (
                                    <div
                                        key={choice.id}
                                        className={`option-item disabled ${choice.is_correct ? "correct" : ""}`}
                                    >
                                        {choice.text}
                                        {choice.is_correct && " — bonne réponse"}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}

                <h3 style={{ marginTop: 32 }}>Ajouter une question</h3>
                <QuestionForm
                    question={draft}
                    index={questions.length}
                    onChange={setDraft}
                    onRemove={() => setDraft(emptyQuestion())}
                />
                <button className="btn-primary" onClick={handleAddQuestion}>
                    Ajouter cette question
                </button>
            </div>

            {pendingDelete && (
                <ConfirmModal
                    title="Supprimer cette question ?"
                    message="Cette question et ses propositions seront définitivement supprimées."
                    confirmLabel="Supprimer"
                    danger
                    onConfirm={confirmDeleteQuestion}
                    onCancel={() => setPendingDelete(null)}
                />
            )}
        </div>
    );
}
