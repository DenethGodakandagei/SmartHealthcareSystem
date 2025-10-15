export const generateCSV = (metrics: string[], reportData: any) => {
  let csv = metrics.join(",") + "\n";

  // Simple CSV generation, you can expand
  for (let i = 0; i < 10; i++) {
    csv += metrics.map(() => Math.floor(Math.random() * 100)).join(",") + "\n";
  }

  return csv;
};
