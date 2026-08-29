function StatCard({
                      title,
                      value,
                      description
                  }) {

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">

            <p className="text-sm font-medium text-slate-500">
                {title}
            </p>

            <h3 className="mt-2 text-2xl font-bold text-slate-900">
                {value}
            </h3>

            {description && (
                <p className="mt-2 text-sm text-slate-500">
                    {description}
                </p>
            )}

        </div>
    );
}

export default StatCard;