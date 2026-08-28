StudentHome

import { useEffect, useState } from "react";
import { getAvailableExams } from "../../api/examApi";
import ExamCard, { computeDisplayStatus } from "../../components/ExamCard";

export default function StudentHome({ user }) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAvailableExams()
      .then((data) => setExams(data || []))
      .catch((err) => setError(err.message || "Impossible de charger vos examens."))
      .finally(() => setLoading(false));
  }, []);

  const available = exams.filter((e) => computeDisplayStatus(e) === "available");
  const upcoming = exams.filter((e) => computeDisplayStatus(e) === "upcoming");

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <span className="eyebrow">Espace étudiant</span>
          <h1>Bonjour, {user?.name || "vous"}</h1>
          <p className="sub">Voici les examens disponibles.</p>
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
            </div>

            {exams.length === 0 ? (
              <div className="empty-state">Aucun examen ne vous a été assigné pour le moment.</div>
            ) : (
              <div className="grid grid-cards">
                {exams.map((exam) => (
                  <ExamCard key={exam.id} exam={exam} viewer="student" />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}