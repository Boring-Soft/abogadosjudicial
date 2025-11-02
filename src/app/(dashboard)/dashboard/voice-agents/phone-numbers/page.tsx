import { PhoneNumbersTable } from "@/components/phone-numbers/phone-numbers-table";
import { PhoneNumbersHeader } from "@/components/phone-numbers/phone-numbers-header";

export const metadata = {
  title: "Phone Numbers - Boring Automation",
  description: "Manage your phone numbers",
};

export default function PhoneNumbersPage() {
  return (
    <div className="space-y-6">
      <PhoneNumbersHeader />
      <PhoneNumbersTable />
    </div>
  );
}
