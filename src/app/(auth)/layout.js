import AuthLeftPanel from "../../components/layout/authLayout/AuthLeftpanel";

export const metadata = {
    title: "Authentication — [APP NAME]",
};

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen flex">

            {/* ── Shared left panel (same for login + signup) ── */}
            <AuthLeftPanel />

            {/* ── Right panel — renders the active page (login / signup) ── */}
            <main className="flex-1 flex flex-col min-h-screen bg-white">
                {children}
            </main>

        </div>
    );
}