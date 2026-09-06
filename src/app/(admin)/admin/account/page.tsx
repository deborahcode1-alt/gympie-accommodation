import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";

export default function AdminAccountPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Account</h1>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Change password</h2>
        <div className="mt-3">
          <ChangePasswordForm />
        </div>
      </section>
    </div>
  );
}
