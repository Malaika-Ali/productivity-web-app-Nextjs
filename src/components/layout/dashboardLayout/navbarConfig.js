import { supabase } from "@/lib/supabase/browserClient";

const {data:{user}}=await supabase.auth.getUser()
console.log(user)
const username=user?.user_metadata?.full_name


const today = new Date();
const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
});

export const navbarConfig = {
    "/dashboard/today": {
        title: `Good morning, ${username}`,
        subtitle: `${dateStr}`,
        showSearch: false,
        // searchPlaceholder: "Search",
        // action: "add",
    },

    "/dashboard/habits": {
        title: "My Habits",
        showSearch: false,
        searchPlaceholder: "Search habits...",
        action: "Add Habit",
    },
};