import HabitreaLoader from "../../components/common/loader/HabitreaLoader";

export default function Loading() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white">

            <HabitreaLoader />

            <div className="mt-2 text-center">
                <h2 className="text-lg font-semibold text-slate-800">
                    Preparing your space
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                    Your AI coach is getting things ready...
                </p>
            </div>

        </div>
    );
}