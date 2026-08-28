import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getExams } from "../../api/examApi";
import { getCourses } from "../../api/courseApi";
import { getStudents } from "../../api/studentApi";
import { computeDisplayStatus } from "../../components/ExamCard";

export default function AdminHome({ user }) {
    const [exams, setExams] = useState([]);
    const [subjectCount, setSubjectCount] = useState(0);
    const [studentCount, setStudentCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        setLoading(true);
        setError("");

        Promise.all([getExams(), getCourses(), getStudents()])
            .then(([examsData, coursesData, studentsData]) => {
                setExams(examsData || []);
                setSubjectCount((coursesData || []).length);
                setStudentCount((studentsData || []).length);
            })
            .catch((err) => {
                setError(err.message || "Impossible de charger le tableau de bord.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const available = exams.filter((e) => computeDisplayStatus(e) === "available").length;
    const upcoming = exams.filter((e) => computeDisplayStatus(e) === "upcoming").length;
    const done = exams.filter(
        (e) => computeDisplayStatus(e) === "expired" || computeDisplayStatus(e) === "done"
    ).length;

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <span className="eyebrow">Tableau de bord</span>
                    <h1>Bonjour, {user?.name || "Admin"}</h1>
                    <p className="sub">Vue d'ensemble des examens, matières et étudiants de la plateforme.</p>
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
                                <div className="value">{exams.length}</div>
                                <div className="label">Examens créés</div>
                            </div>
                            <div className="stat">
                                <div className="value">{subjectCount}</div>
                                <div className="label">Cours</div>
                            </div>
                            <div className="stat">
                                <div className="value">{studentCount}</div>
                                <div className="label">Étudiants</div>
                            </div>
                            <div className="stat">
                                <div className="value">{available}</div>
                                <div className="label">Disponibles</div>
                            </div>
                            <div className="stat">
                                <div className="value">{upcoming}</div>
                                <div className="label">À venir</div>
                            </div>
                            <div className="stat">
                                <div className="value">{done}</div>
                                <div className="label">Clôturés</div>
                            </div>
                        </div>

                        <div className="section">
                            <h3 style={{ marginBottom: 16 }}>Accès rapide</h3>
                            <div className="dashboard-shortcuts">
                                <Link to="/admin/exams/create" className="shortcut-card">
                                    <span className="eyebrow">Examens</span>
                                    <h3>Créer un examen</h3>
                                    <p>Définissez matière, dates et questions.</p>
                                </Link>
                                <Link to="/admin/courses" className="shortcut-card">
                                    <span className="eyebrow">Cours</span>
                                    <h3>Gérer les cours</h3>
                                    <p>Ajoutez ou modifiez les cours disponibles.</p>
                                </Link>
                                <Link to="/admin/students" className="shortcut-card">
                                    <span className="eyebrow">Étudiants</span>
                                    <h3>Gérer les étudiants</h3>
                                    <p>Comptes, mots de passe et blocages.</p>
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
