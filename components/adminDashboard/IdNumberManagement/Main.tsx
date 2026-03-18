import IdNumberEdit from './IdNumberEdit';

export default function Main() {
  return (
    <section className="p-6">
      <div className="mx-auto max-w-[600px]">
        <div className="rounded-2xl bg-white p-6 shadow-md">
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-gray-800">
              Product ID Settings
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage the next ID number that will be assigned to new products.
            </p>
          </div>

          <div className="mb-6 h-px bg-gray-200" />

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Next Product ID
              </label>

              <IdNumberEdit />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
