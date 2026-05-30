export default function StatCard({
    icon,
    iconBg,
    iconBorder,
    borderColor,
    badge,
    badgeClass,
    value,
    valueSuffix,
    valueTotal,
    label,
}) {
    return (
        <div className={`bg-white rounded-2xl border-2 border-b-8 ${borderColor} p-5 flex-1 min-w-47.5 flex flex-col gap-3 `}>

            {/* Top row: icon + badge */}
            <div className="flex justify-between items-start">
                <div className={`w-10 h-10 border-b-4 ${iconBorder} rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
                    {icon}
                </div>
                {badge && (
                    <span className={`text-xs font-extrabold rounded-full px-2.5 py-1.5 whitespace-nowrap ${badgeClass}`}>
                        {badge}
                    </span>
                )}
            </div>

            {/* Value + label */}
            <div>
                <div className="flex items-baseline gap-0.5">
                    <span className="text-[34px] font-extrabold text-gray-900 tracking-tight leading-none">
                        {value}
                    </span>
                    {valueTotal && (
                        <span className="text-base font-extrabold text-gray-400 ml-0.5">
                            /{valueTotal}
                        </span>
                    )}
                    {valueSuffix && (
                        <span className="text-sm font-semibold text-gray-400 ml-0.5">
                            {valueSuffix}
                        </span>
                    )}
                </div>
                <p className="mt-1.5 text-[13px] font-bold text-gray-500 leading-snug">
                    {label}
                </p>
            </div>

        </div>
    );
}