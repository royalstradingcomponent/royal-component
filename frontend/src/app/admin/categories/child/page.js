import CategoryManager from "@/components/admin/CategoryManager";

export default function ChildCategoriesPage() {
  return (
    <CategoryManager
      level="child"
      title="Child Categories"
      subtitle="Select main and subcategory, then manage child categories."
    />
  );
}