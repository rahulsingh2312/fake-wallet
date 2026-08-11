import { RegisterSW } from "@/components/RegisterSW";
import { WalletApp } from "@/components/WalletApp";
import { WalletProvider } from "@/lib/store";

export default function Page() {
  return (
    <WalletProvider>
      <WalletApp />
      <RegisterSW />
    </WalletProvider>
  );
}
