export type Task = {
    _id: string;
    title: string;
    description: string;
    dueDate: Date | null | undefined;
    priority: "low" | "medium" | "high";
    status: "todo" | "inProgress" | "completed" | string
}