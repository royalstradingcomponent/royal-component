import Link from "next/link";

const serviceItems = [
  {
    title: "ezBill",
    description: "View and manage your order invoices",
    href: "/ezbill",
    image: "/service-icons/ezbill.png",
  },
  {
    title: "ezBuy",
    description: "Buy on account, custom part numbers, & more",
    href: "/ezbuy",
    image: "/service-icons/ezbuy.png",
  },
  {
    title: "ezReview",
    description: "Track your supply chain and inventory",
    href: "/ezreview",
    image: "/service-icons/ezreview.png",
  },
  {
    title: "Quote Request",
    description: "Work directly with a Royal Component specialist",
    href: "/quote-request",
    image: "/service-icons/QuoteRequest.jpeg",
  },
  {
    title: "Order Status",
    description: "Find details on your orders",
    href: "/order-status",
    image: "/service-icons/ordrstatus.webp",
  },
];

export default function ServiceLinks() {
  return (
    <section className="bg-[#eef1f4] py-14 md:py-16">
      <div className="container-royal">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-5">
          {serviceItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group flex flex-col items-center text-center"
            >
              <div className="flex h-[140px] w-[140px] items-center justify-center md:h-[160px] md:w-[160px]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-[110px] w-[110px] object-contain transition-transform duration-300 group-hover:scale-105 md:h-[130px] md:w-[130px]"
                />
              </div>

              <h3 className="mt-2 text-[18px] font-semibold text-[#0054a6] transition-colors duration-300 group-hover:text-[#003f7d] md:text-[20px]">
                {item.title}
              </h3>

              <p className="mt-2 max-w-[240px] text-[15px] leading-7 text-[#0054a6]">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}