function ConfirmationModal({ open, title = "Confirm action", message, confirmLabel = "Confirm", onConfirm, onCancel }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true" aria-labelledby="confirmation-title">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                <h2 id="confirmation-title" className="text-lg font-semibold text-slate-900">{title}</h2>
                <p className="mt-2 text-sm text-slate-600">{message}</p>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onCancel} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
                    <button onClick={onConfirm} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">{confirmLabel}</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModal;
