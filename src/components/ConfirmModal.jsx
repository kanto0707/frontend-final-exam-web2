export default function ConfirmModal({
                                         title,
                                         message,
                                         confirmLabel = "Confirmer",
                                         cancelLabel = "Annuler",
                                         danger = false,
                                         onConfirm,
                                         onCancel,
                                     }) {
    return (
        <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onCancel}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                <h3>{title}</h3>
                <p>{message}</p>
                <div className="modal-actions">
                    <button className="btn-outline" onClick={onCancel}>
                        {cancelLabel}
                    </button>
                    <button className={danger ? "btn-danger" : "btn-primary"} onClick={onConfirm}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
