import { dateStr } from "@/lib/todaysDate";

export const navbarConfig = {
    "/dashboard/today": {
        // title: "Good morning",
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
        actionEvent: "open-add-habit",
    },
    "/dashboard/tasks": {
        title: "My Tasks",
        showSearch: false,
        searchPlaceholder: "Search habits...",
        action: "Add Task",
        actionEvent: "open-add-task",
    },
};