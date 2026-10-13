export default function AppLogo({ name = "[APP NAME]" }) {
    return (
        <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                <h2 className="text-white font-bold">H</h2>
            </div>
            <span className="text-white font-extrabold text-[20px]">{name}</span>
        </div>
    );
}