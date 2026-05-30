import { Bell, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import ButtonWithIcon from "../common/buttons/ButtonWithIcon";

export default function Navbar() {
    const today = new Date();
    const dateStr = today.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="flex items-center justify-between bg-dashboard-background px-6 py-8 w-full">
            {/* Left: Date + Greeting */}
            <div className="flex flex-col">
                <span className="text-[14px] text-gray-500 font-medium mb-0.5">
                    {dateStr}
                </span>
                <h1 className="text-[32px] font-extrabold text-gray-900 leading-tight tracking-tight">
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
                    className="rounded-xl bg-white border border-gray-300 h-11 w-11 shadow-none hover:bg-gray-50 cursor-pointer"
                >
                    <Bell className="text-gray-700" size={34} />
                </Button>

                {/* Add Button */}
                {/* <Button className="flex items-center gap-1.5 rounded-xl bg-purple-600 border-b-4 border-purple-800 hover:bg-purple-700 text-white text-[13px] font-semibold px-4 py-5 shadow-none">
                    <Plus className="h-4 w-4" color="white" fill="white"/>
                    Add
                </Button> */}
                <ButtonWithIcon text="Add" Icon={Plus} />
            </div>
        </div>
    );
}