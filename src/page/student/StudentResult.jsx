import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getExamResult } from "../../api/examApi";
import Question from "../../components/Question";

export default function StudentResult() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getExamResult(id)
      .then((data) => setResult(data))
      .catch((err) =>
        setError(err.message || "Résultat introuvable. Avez-vous déjà soumis cet examen ?")
      )
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="page">
        <div className="container loading-block">
          <span className="spinner" /> Chargement du résultat...
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="page">
        <div className="container">
          <div className="alert alert-error">{error || "Résultat introuvable."}</div>
          <Link to="/student/exams" className="btn-outline">
            Retour aux examens
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <span className="eyebrow">{result.subjectName}</span>
          <h1>Résultat</h1>
        </div>

        <div className="result-hero">
          <div className="result-score mono">
            {result.score}
            <span> / {result.total}</span>
          </div>
          <p className="result-sub">
            {result.score} point(s) obtenu(s) sur {result.total} point(s)
          </p>
        </div>

        <h3>Correction</h3>
        {(result.questions || []).map((q, i) => (
          <Question
            key={q.id}
            question={q}
            index={i}
            review
            selectedOptionId={q.selectedOptionId}
            correctOptionId={q.correctOptionId}
          />
        ))}

        <Link to="/student/results" className="btn-outline">
          Voir mes résultats
        </Link>
      </div>
    </div>
  );
}