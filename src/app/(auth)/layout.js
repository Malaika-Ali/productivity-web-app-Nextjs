import AuthLeftPanel from "@/components/layout/authLayout/AuthLeftpanel";
import { Toaster } from "sonner";

// export const metadata = {
//     title: "Authentication",
// };

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen flex">
            <AuthLeftPanel />
            <main className="flex-1 flex flex-col min-h-screen bg-white">
                {children}
                <Toaster />
            </main>
        </div>
    );
}