import { TimeFrame } from './useProgressTimeFrame'; // Import TimeFrame if needed for future filtering

// Define type (Consider moving to a dedicated types file)
// Assuming the chart data structure is specific to the chart library
export interface ProgressChartData {
    labels: string[];
    datasets: { data: number[] }[];
}


// Example data - in a real app, this would be fetched and filtered based on timeFrame
const MOCK_CHART_DATA: ProgressChartData = {
  labels: ['1', '5', '10', '15', '20', '25', '30'], // Example labels for 1M
  datasets: [{
    data: [74.5, 74.3, 74.0, 73.8, 73.5, 73.2, 73.0],
  }],
};

// Accept timeFrame as arg for future use, even if not used in mock data
export const useProgressChartData = (timeFrame: TimeFrame) => {
    // TODO: Implement actual fetching/filtering based on timeFrame
    const chartData = MOCK_CHART_DATA;
    const isLoading = false; // Add loading/error states if fetching is async
    const error = null;

    return {
        chartData,
        isLoading,
        error,
    };
}; 