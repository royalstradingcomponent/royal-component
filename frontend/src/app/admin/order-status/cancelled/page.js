import OrderStatusPage from "@/components/admin/OrderStatusPage";

export default function CancelledOrdersPage() {
  return (
    <OrderStatusPage
      title="Cancelled Orders"
      status="Cancelled"
    />
  );
}