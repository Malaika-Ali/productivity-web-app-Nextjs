export default function OrDivider({ label = "OR" }) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[11.5px] font-bold text-gray-400 tracking-widest">{label}</span>
            <div className="flex-1 h-px bg-gray-200" />
        </div>
    );
}