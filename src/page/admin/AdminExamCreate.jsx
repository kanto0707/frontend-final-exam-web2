import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExamForm from "../../components/ExamForm";
import { createExam } from "../../api/examApi";
import { getSubjects } from "../../api/subjectApi";

export default function AdminExamCreate() {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        getSubjects()
            .then((data) => setSubjects(data || []))
            .catch((err) => setError(err.message || "Impossible de charger les matières."))
            .finally(() => setLoading(false));
    }, []);

    function handleSubmit(examData) {
        setError("");
        createExam(examData)
            .then((created) => navigate(`/admin/exams/${created.id}`))
            .catch((err) => setError(err.message || "Impossible de créer l'examen."));
    }

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <span className="eyebrow">Nouvel examen</span>
                    <h1>Créer un examen</h1>
                    <p className="sub">
                        Choisissez une matière, définissez la période d'accès et ajoutez vos questions.
                    </p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                {loading ? (
                    <div className="loading-block">
                        <span className="spinner" /> Chargement des matières...
                    </div>
                ) : subjects.length === 0 ? (
                    <div className="empty-state">
                        Vous devez d'abord créer une matière avant de pouvoir créer un examen.
                    </div>
                ) : (
                    <ExamForm subjects={subjects} onSubmit={handleSubmit} submitLabel="Créer l'examen" />
                )}
            </div>
        </div>
    );
}
