import AuthPanel from "@/components/layout/authLayout/AuthPanel";
import { Toaster } from "sonner";

// export const metadata = {
//     title: "Authentication",
// };

export default function layout({ children }) {
    return (
        <div className="min-h-screen flex">
            <aside>
                <AuthPanel />
            </aside>
            <main className="flex-1 flex flex-col min-h-screen bg-white">
                {children}
                <Toaster />
            </main>
        </div>
    );
}