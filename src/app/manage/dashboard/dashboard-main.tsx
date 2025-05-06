"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueLineChart } from "@/app/manage/dashboard/revenue-line-chart";
import { DishBarChart } from "@/app/manage/dashboard/dish-bar-chart";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetDashboardQuery } from "@/queries/useDashboard";
import { useState } from "react";
import { endOfDay, format, startOfDay } from "date-fns";
import { formatCurrency } from "@/lib/utils";

const initFromDate = startOfDay(new Date());
const initToDate = endOfDay(new Date());

export default function DashboardMain() {
  const [fromDate, setFromDate] = useState(initFromDate);
  const [toDate, setToDate] = useState(initToDate);

  const dashboardQuery = useGetDashboardQuery({ fromDate, toDate });
  const revenueData = dashboardQuery.data?.payload.data.revenueByDate ?? [];
  const dishData = dashboardQuery.data?.payload.data.dishIndicator ?? [];

  const resetDateFilter = () => {
    setFromDate(initFromDate);
    setToDate(initToDate);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center">
          <span className="mr-2">Từ</span>
          <Input
            type="datetime-local"
            placeholder="Từ ngày"
            className="text-sm"
            value={format(fromDate, "yyyy-MM-dd HH:mm").replace(" ", "T")}
            onChange={(event) => setFromDate(new Date(event.target.value))}
          />
        </div>
        <div className="flex items-center">
          <span className="mr-2">Đến</span>
          <Input
            type="datetime-local"
            placeholder="Đến ngày"
            value={format(toDate, "yyyy-MM-dd HH:mm").replace(" ", "T")}
            onChange={(event) => setToDate(new Date(event.target.value))}
          />
        </div>
        <Button className="" variant={"outline"} onClick={resetDateFilter}>
          Reset
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng doanh thu
            </CardTitle>
            {/* Add SVG here */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                dashboardQuery.data?.payload.data.revenue as number
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách</CardTitle>
            {/* Add SVG here */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardQuery.data?.payload.data.guestCount}
            </div>
            <p className="text-xs text-muted-foreground">Gọi món</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đơn hàng</CardTitle>
            {/* Add SVG here */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardQuery.data?.payload.data.orderCount}
            </div>
            <p className="text-xs text-muted-foreground">Đã thanh toán</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bàn đang phục vụ
            </CardTitle>
            {/* Add SVG here */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardQuery.data?.payload.data.servingTableCount}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <RevenueLineChart chartData={revenueData} />
        </div>
        <div className="lg:col-span-3">
          <DishBarChart chartData={dishData} />
        </div>
      </div>
    </div>
  );
}
