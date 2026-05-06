import CategoryManager from "@/components/admin/CategoryManager";

export default function MainCategoriesPage() {
  return (
    <CategoryManager
      level="main"
      title="Main Categories"
      subtitle="Manage top-level categories like Semiconductors, Automation, Switchgear."
    />
  );
}