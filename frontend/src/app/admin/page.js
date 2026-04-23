import Link from "next/link";

const adminSections = [
  {
    title: "Products",
    description: "Add, edit, delete and manage all products.",
    href: "/admin/products",
    stats: "Manage catalog",
  },
  {
    title: "Categories",
    description: "Create and control product categories.",
    href: "/admin/categories",
    stats: "Organize items",
  },
  {
    title: "Orders",
    description: "Track, update and manage customer orders.",
    href: "/admin/orders",
    stats: "Order workflow",
  },
  {
    title: "Customers",
    description: "View users and customer activity.",
    href: "/admin/customers",
    stats: "User management",
  },
  {
    title: "Banners",
    description: "Control homepage banners and promotional sections.",
    href: "/admin/banners",
    stats: "Marketing assets",
  },
  {
    title: "Inventory",
    description: "Manage stock, availability and product quantities.",
    href: "/admin/inventory",
    stats: "Stock control",
  },
  {
    title: "Homepage CMS",
    description: "Control homepage sections, hero, featured blocks and layout.",
    href: "/admin/homepage",
    stats: "Content control",
  },
  {
    title: "Settings",
    description: "Manage site settings, branding and configurations.",
    href: "/admin/settings",
    stats: "Site controls",
  },
];

export default function AdminPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #f8fbff 0%, #eef5ff 50%, #f7faff 100%)",
        padding: "32px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #dbe7ff",
            borderRadius: "24px",
            padding: "28px",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
            marginBottom: "28px",
          }}
        >
          <span
            style={{
              display: "inline-block",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              background: "#e8f1ff",
              color: "#1d4ed8",
              padding: "8px 12px",
              borderRadius: "999px",
              marginBottom: "14px",
            }}
          >
            Royal Component Admin
          </span>

          <h1
            style={{
              margin: 0,
              fontSize: "36px",
              lineHeight: 1.2,
              color: "#0f172a",
              fontWeight: 800,
            }}
          >
            Admin Dashboard
          </h1>

          <p
            style={{
              marginTop: "12px",
              marginBottom: 0,
              fontSize: "16px",
              lineHeight: 1.7,
              color: "#475569",
              maxWidth: "860px",
            }}
          >
            Yahin se aage tumhare pure Royal Component store ka control hoga —
            products, categories, orders, customers, banners, inventory aur
            homepage sections sab admin se manage karenge. Abhi yeh dashboard
            base ready kar rahe hain, phir next step me har section ka real
            admin page banayenge.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
          }}
        >
          {adminSections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #dbe7ff",
                  borderRadius: "22px",
                  padding: "22px",
                  height: "100%",
                  boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: "90px",
                    padding: "8px 12px",
                    borderRadius: "999px",
                    background: "#eff6ff",
                    color: "#2563eb",
                    fontSize: "12px",
                    fontWeight: 700,
                    marginBottom: "14px",
                  }}
                >
                  {section.stats}
                </div>

                <h2
                  style={{
                    margin: 0,
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  {section.title}
                </h2>

                <p
                  style={{
                    marginTop: "12px",
                    marginBottom: "18px",
                    color: "#475569",
                    fontSize: "15px",
                    lineHeight: 1.7,
                  }}
                >
                  {section.description}
                </p>

                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#1d4ed8",
                    fontWeight: 700,
                    fontSize: "14px",
                  }}
                >
                  Open Section →
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div
          style={{
            marginTop: "28px",
            background: "#ffffff",
            border: "1px solid #dbe7ff",
            borderRadius: "24px",
            padding: "24px",
            boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "22px",
              color: "#0f172a",
              fontWeight: 700,
            }}
          >
            Next Step
          </h3>

          <p
            style={{
              marginTop: "12px",
              marginBottom: 0,
              color: "#475569",
              fontSize: "15px",
              lineHeight: 1.8,
            }}
          >
            Abhi yeh admin dashboard build issue fix karega. Iske baad hum ek-ek
            karke real admin pages banayenge:
            <strong> Products</strong>, <strong>Categories</strong>,
            <strong> Orders</strong>, <strong>Customers</strong>,
            <strong> Banners</strong>, <strong> Homepage CMS</strong> aur
            <strong> Inventory</strong>.
          </p>
        </div>
      </div>
    </main>
  );
}