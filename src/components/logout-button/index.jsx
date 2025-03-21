import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

import "../../app/styles/logout-button.css";

export default function LogoutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <>
      <button className="log-out-btn" onClick={handleSignOut}>
        Log Out
      </button>
    </>
  );
}
