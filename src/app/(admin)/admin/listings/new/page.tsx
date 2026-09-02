import { ListingForm } from "@/components/admin/ListingForm";

export default function NewListingPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">New listing</h1>
      <div className="mt-6 max-w-2xl">
        <ListingForm />
      </div>
    </div>
  );
}
