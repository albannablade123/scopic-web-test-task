import Link from "next/link";
import ItemTable from "../../components/ItemTable";

export default async function admin() {
  return (
    <section className=" py-12 md:py-16 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Item Table</h1>
          <Link href="/admin/add">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Create Item
            </button>
          </Link>
        </div>
        <ItemTable />
      </div>
    </section>
  );
}
