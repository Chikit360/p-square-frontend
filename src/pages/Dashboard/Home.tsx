import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import PageMeta from "../../components/common/PageMeta";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../features/store";
import { toast } from "react-toastify";

export default function Home() {
  const { error, success, message } = useSelector((state: RootState) => state.auth);
  useEffect(() => {
      if (error) {
        toast.error(message);
        // Optionally, clear the error state here if needed
      }
    
      if (success && message) {
        toast.success(message);
        // Optionally, reset success state here if needed
      }
    }, [error, success, message]);
  return (
    <>
      <PageMeta
        title="TG Dashboard | Chikit-Thundergits - React.js Admin Dashboard Template"
        description="This is TG Dashboard page for Chikit-Thundergits - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />

          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        {/* <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div> */}

        {/* <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div> */}
      </div>
    </>
  );
}
