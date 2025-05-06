"use client";

import { useAppStore } from "@/components/app-provider";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { OrderStatus } from "@/constants/type";
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils";
import { useGuestGetListOrderQuery } from "@/queries/useGuest";
import {
  PayGuestOrdersResType,
  UpdateOrderResType,
} from "@/schemaValidations/order.schema";
import Image from "next/image";
import { useEffect, useMemo } from "react";

export default function OrdersCart() {
  const socket = useAppStore((state) => state.socket);
  const { data, refetch } = useGuestGetListOrderQuery();
  const orders = useMemo(() => data?.payload.data ?? [], [data]);

  const { waitingForPaying, paid } = useMemo(() => {
    return orders.reduce(
      (result, order) => {
        if (
          order.status === OrderStatus.Delivered ||
          order.status === OrderStatus.Pending ||
          order.status === OrderStatus.Processing
        ) {
          return {
            ...result,
            waitingForPaying: {
              price:
                result.paid.price + order.dishSnapshot.price * order.quantity,
              quantity: result.paid.quantity + order.quantity,
            },
          };
        } else if (order.status === OrderStatus.Paid) {
          return {
            ...result,
            paid: {
              price:
                result.paid.price + order.dishSnapshot.price * order.quantity,
              quantity: result.paid.quantity + order.quantity,
            },
          };
        }
        return result;
      },
      {
        waitingForPaying: {
          quantity: 0,
          price: 0,
        },
        paid: {
          quantity: 0,
          price: 0,
        },
      }
    );
  }, [orders]);

  useEffect(() => {
    if (socket?.connected) {
      onConnect();
    }

    function onConnect() {
      console.log(socket?.id);
    }

    function onDisconnect() {
      console.log("disconect");
    }

    function onUpdateOrder(data: UpdateOrderResType["data"]) {
      console.log(data);
      const {
        dishSnapshot: { name },
        quantity,
      } = data;
      toast({
        description: `Món ${name} (số lượng :${quantity}) vừa được cập nhập sang trang thái ${getVietnameseOrderStatus(
          data.status
        )}`,
      });
      refetch();
    }
    function onPayment(data: PayGuestOrdersResType["data"]) {
      const { guest } = data[0];

      toast({
        description: `${guest?.name} tại bàn ${guest?.tableNumber} thanh toán thành công ${data.length} đơn.`,
      });
      refetch();
    }

    socket?.on("update-order", onUpdateOrder);
    socket?.on("payment", onPayment);

    socket?.on("connect", onConnect);
    socket?.on("disconnect", onDisconnect);

    return () => {
      socket?.off("connect", onConnect);
      socket?.off("disconnect", onDisconnect);
      socket?.off("update-order", onUpdateOrder);
      socket?.off("payment", onPayment);
    };
  }, [refetch, socket]);
  return (
    <>
      {orders.map((order) => (
        <div key={order.id} className="flex gap-4 ">
          <div className="flex-shrink-0 relative">
            <Image
              src={order.dishSnapshot.image}
              alt={order.dishSnapshot.name}
              height={100}
              width={100}
              quality={100}
              className="object-cover w-[80px] h-[80px] rounded-md"
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm">{order.dishSnapshot.name}</h3>
            <p className="text-xs font-semibold">
              {formatCurrency(order.dishSnapshot.price)} x {order.quantity}
            </p>
          </div>
          <div className="flex-shrink-0 ml-auto flex justify-center items-center">
            <Badge variant={"outline"}>
              {getVietnameseOrderStatus(order.status)}
            </Badge>
          </div>
        </div>
      ))}
      {paid.quantity !== 0 && (
        <div className="sticky bottom-0">
          <Badge className="text-sm justify-center items-center flex space-x-4">
            <span>Đơn Đã Thanh Toán · {paid.quantity} món</span>
            <span>{formatCurrency(paid.price)}</span>
          </Badge>
        </div>
      )}
      {waitingForPaying.quantity !== 0 && (
        <div className="sticky bottom-0">
          <Badge className="text-sm justify-center items-center flex space-x-4">
            <span>Đơn Chưa Thanh Toán · {waitingForPaying.quantity} món</span>
            <span>{formatCurrency(waitingForPaying.price)}</span>
          </Badge>
        </div>
      )}
      {waitingForPaying.quantity === 0 && paid.quantity === 0 && (
        <div className="sticky bottom-0">
          <Badge className="text-sm flex flex-col space-y-1">
            <span>Chưa Có Đơn Hàng Nào Được Đặt.</span>
            <span>Chọn Vào Menu Để Đặt Món!</span>
          </Badge>
        </div>
      )}
    </>
  );
}
