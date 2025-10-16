export const API_BASE_URL = "http://localhost:5000/api";

export const generateReport = async (reportData: any) => {
  const res = await fetch(`${API_BASE_URL}/reports/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reportData),
  });
  return res.json();
};

export const fetchReports = async () => {
  const res = await fetch(`${API_BASE_URL}/reports`);
  return res.json();
};
