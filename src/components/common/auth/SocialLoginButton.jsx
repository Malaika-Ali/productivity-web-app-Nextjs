"use client";

const PROVIDER_CONFIG = {
    google: {
        label: "Continue with Google",
        icon: (
            <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Yellow - bottom-left arc */}
                <path
                    d="M44.5 20H24v8.5h11.8C34.2 33.6 29.6 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 6 1.1 8.2 3l6-6C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.8 0 20-7.8 20-21 0-1.4-.1-2.7-.5-4z"
                    fill="#FFC107"
                />
                {/* Red - top arc */}
                <path
                    d="M6.3 14.7l7 5.1C15.1 16 19.3 13 24 13c3.1 0 6 1.1 8.2 3l6-6C34.5 5.1 29.5 3 24 3 16.3 3 9.7 7.9 6.3 14.7z"
                    fill="#FF3D00"
                />
                {/* Green - bottom arc */}
                <path
                    d="M24 45c5.4 0 10.3-1.9 14.1-5.1l-6.5-5.5C29.6 36.1 26.9 37 24 37c-5.6 0-10.3-3.4-11.8-8.4l-7 5.4C8.5 41 15.7 45 24 45z"
                    fill="#4CAF50"
                />
                {/* Blue - right bar */}
                <path
                    d="M44.5 20H24v8.5h11.8c-.8 2.3-2.3 4.2-4.3 5.5l6.5 5.5C41.8 36.2 45 30.5 45 24c0-1.4-.2-2.7-.5-4z"
                    fill="#1976D2"
                />
            </svg>
        ),
    },
};

export default function SocialLoginButton({
    provider = "google",
    onClick = () => { },
    className = "",
}) {
    const config = PROVIDER_CONFIG[provider];
    if (!config) return null;

    return (
        <button
            type="button"
            onClick={onClick}
            className={`
        w-full flex items-center justify-center gap-3
        border border-gray-200 rounded-full
        py-3 px-5
        text-[14px] font-semibold text-gray-800
        bg-white hover:bg-gray-50 
        shadow-sm transition-all duration-150
        ${className} cursor-pointer
      `}
        >
            {config.icon}
            {config.label}
        </button>
    );
}