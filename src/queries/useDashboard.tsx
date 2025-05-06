import dashboardApiRequest from "@/apiRequest/dashboard";
import { DashboardIndicatorQueryParamsType } from "@/schemaValidations/indicator.schema";
import { useQuery } from "@tanstack/react-query";

export const useGetDashboardQuery = (
  queryParams: DashboardIndicatorQueryParamsType
) => {
  return useQuery({
    queryFn: () => dashboardApiRequest.getDashboard(queryParams),
    queryKey: ["dashboard", queryParams],
  });
};
