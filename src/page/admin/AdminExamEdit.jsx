import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ExamForm from "../../components/ExamForm";
import { getExam, updateExam } from "../../api/examApi";
import { getSubjects } from "../../api/subjectApi";

export default function AdminExamEdit() {
    const { id } = useParams();
    const [exam, setExam] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        Promise.all([getExam(id), getSubjects()])
            .then(([examData, subjectsData]) => {
                setExam(examData);
                setSubjects(subjectsData || []);
            })
            .catch((err) => setError(err.message || "Impossible de charger cet examen."))
            .finally(() => setLoading(false));
    }, [id]);

    function handleSubmit(examData) {
        setError("");
        updateExam(id, examData)
            .then(() => navigate(`/admin/exams/${id}`))
            .catch((err) => setError(err.message || "Impossible de modifier l'examen."));
    }

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <span className="eyebrow">Modification</span>
                    <h1>Modifier l'examen</h1>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                {loading ? (
                    <div className="loading-block">
                        <span className="spinner" /> Chargement...
                    </div>
                ) : exam ? (
                    <ExamForm
                        subjects={subjects}
                        initialValue={exam}
                        onSubmit={handleSubmit}
                        submitLabel="Enregistrer les modifications"
                    />
                ) : (
                    <div className="empty-state">Examen introuvable.</div>
                )}
            </div>
        </div>
    );
}
