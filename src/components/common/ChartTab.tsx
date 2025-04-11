export type ChartRange = "daily" | "monthly" | "yearly";

interface ChartTabProps {
  selected: ChartRange;
  onChange: (range: ChartRange) => void;
}

const ChartTab: React.FC<ChartTabProps> = ({ selected, onChange }) => {
 
  

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
      <button
        onClick={() => onChange("daily")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${selected === "daily"
          ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
          : "text-gray-500 dark:text-gray-400"}`}
      >
        Daily
      </button>

      <button
        onClick={() => onChange("monthly")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${selected === "monthly"
          ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
          : "text-gray-500 dark:text-gray-400"}`}
      >
        Monthly
      </button>

      <button
        onClick={() => onChange("yearly")}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${selected === "yearly"
          ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
          : "text-gray-500 dark:text-gray-400"}`}
      >
        Yearly
      </button>
    </div>
  );
};

export default ChartTab;
