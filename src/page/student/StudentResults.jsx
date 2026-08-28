import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getExamHistory } from "../../api/examApi";
import { formatDateTime } from "../../components/ExamCard";

export default function StudentResults() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getExamHistory()
      .then((data) => setHistory(data || []))
      .catch((err) => setError(err.message || "Impossible de charger votre historique."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <span className="eyebrow">Historique</span>
          <h1>Mes résultats</h1>
          <p className="sub">
            Un examen non soumis avant sa date de fin apparaît avec une note de 0.
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {loading ? (
          <div className="loading-block">
            <span className="spinner" /> Chargement...
          </div>
        ) : history.length === 0 ? (
          <div className="empty-state">Vous n'avez pas encore d'examen dans votre historique.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Matière</th>
                <th>Examen</th>
                <th>Note</th>
                <th>Soumis le</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry) => (
                <tr key={entry.examId}>
                  <td>{entry.subjectName}</td>
                  <td>{entry.title || entry.subjectName}</td>
                  <td className="mono">
                    {entry.score}/{entry.total}
                  </td>
                  <td className="mono">
                    {entry.submittedAt ? formatDateTime(entry.submittedAt) : "—"}
                  </td>
                  <td>
                    <div className="history-row-status">
                      <span className={`status ${entry.submittedAt ? "status-done" : "status-expired"}`}>
                        {entry.submittedAt ? "Soumis" : "Non soumis"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <Link to={`/student/exams/${entry.examId}/result`} className="btn-outline btn-sm">
                      Détails
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}