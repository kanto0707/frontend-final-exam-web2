import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ExamForm from "../../components/ExamForm";
import { createExam } from "../../api/examApi";
import { getCourses } from "../../api/courseApi";

export default function AdminExamCreate() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        getCourses()
            .then((data) => setCourses(data || []))
            .catch((err) => setError(err.message || "Impossible de charger les cours."))
            .finally(() => setLoading(false));
    }, []);

    function handleSubmit(examData) {
        setError("");
        createExam(examData)
            .then((created) => navigate(`/admin/exams/${created.id}/questions`))
            .catch((err) => setError(err.message || "Impossible de créer l'examen."));
    }

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <span className="eyebrow">Nouvel examen</span>
                    <h1>Créer un examen</h1>
                    <p className="sub">
                        Choisissez un cours et définissez la période d'accès. Vous ajouterez les questions
                        à l'étape suivante.
                    </p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                {loading ? (
                    <div className="loading-block">
                        <span className="spinner" /> Chargement des cours...
                    </div>
                ) : courses.length === 0 ? (
                    <div className="empty-state">
                        Vous devez d'abord créer un cours avant de pouvoir créer un examen.
                    </div>
                ) : (
                    <ExamForm courses={courses} onSubmit={handleSubmit} submitLabel="Créer et ajouter les questions" />
                )}
            </div>
        </div>
    );
}
