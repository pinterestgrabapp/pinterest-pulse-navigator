
import { parseISO as dateFnsParseISO, format, isAfter as dateFnsIsAfter } from "date-fns";

// Export date-fns functions
export const parseISO = dateFnsParseISO;
export const isAfter = dateFnsIsAfter;

// Helper function to format chart data
export const formatChartData = (data: any[] = []) => {
  if (!data || !Array.isArray(data)) return [];
  
  return data.map(item => ({
    x: typeof item.date === 'string' ? format(parseISO(item.date), 'MMM d') : item.date,
    y: item.value
  }));
};

// Export function for analytics data
export const exportAnalytics = () => {
  console.log("Exporting analytics data...");
  // This would typically download a CSV or Excel file
  alert("Analytics data exported successfully!");
};

// Function to handle PIN board fetch
export const fetchUserBoards = async (userId: string) => {
  // This would typically fetch from an API
  console.log("Fetching boards for user:", userId);
  
  // Return sample data for now
  return [
    { id: "board1", name: "Marketing Ideas" },
    { id: "board2", name: "Product Showcase" },
    { id: "board3", name: "Inspiration" },
  ];
};
