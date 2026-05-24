import { Bell, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
    const today = new Date();
    const dateStr = today.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="flex items-center justify-between bg-dashboard-background px-6 py-4 w-full">
            {/* Left: Date + Greeting */}
            <div className="flex flex-col">
                <span className="text-[12px] text-gray-400 font-medium mb-0.5">
                    {dateStr}
                </span>
                <h1 className="text-[22px] font-extrabold text-gray-900 leading-tight tracking-tight">
                    Good morning, Maya
                </h1>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
                {/* Search Button */}
                <Button
                    variant="outline"
                    className="flex items-center gap-2 rounded-full bg-white border border-gray-200 text-gray-500 text-[13px] font-medium px-4 py-2 h-9 shadow-none hover:bg-gray-50"
                >
                    <Search className="h-3.5 w-3.5 text-gray-400" />
                    Search
                </Button>

                {/* Bell Icon */}
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-white border border-gray-200 h-9 w-9 shadow-none hover:bg-gray-50"
                >
                    <Bell className="h-4 w-4 text-gray-500" />
                </Button>

                {/* Add Button */}
                <Button className="flex items-center gap-1.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-[13px] font-semibold px-4 h-9 shadow-none">
                    <Plus className="h-4 w-4" />
                    Add
                </Button>
            </div>
        </div>
    );
}