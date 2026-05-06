import CategoryManager from "@/components/admin/CategoryManager";

export default function SubCategoriesPage() {
  return (
    <CategoryManager
      level="sub"
      title="Sub Categories"
      subtitle="Select a main category and manage its subcategories."
    />
  );
}