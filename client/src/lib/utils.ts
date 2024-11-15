import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getPriorityColor = (priority: "low" | "medium" | "high") => {
  switch (priority) {
    case "low":
      return "border-green-700 shadow-green-700";
    case "medium":
      return "border-orange-600 shadow-orange-600";
    case "high":
      return "border-red-700 shadow-red-700";
  } 
}

export const getStatusColor = (priority: "todo" | "inProgress" | "completed" | string) => {
  switch (priority) {
    case "todo":
      return "border-yellow-600 shadow-yellow-600";
    case "inProgress":
      return "border-orange-600 shadow-orange-600";
    case "completed":
      return "border-green-700 shadow-green-700";
  }
}