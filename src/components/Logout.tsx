"use client";
import { supabase } from "../../service/supabase";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Button variant="contained"
        onClick={handleLogout}
        className="logoutbutton"
      >
        Logout
      </Button>
    </div>
  );
}
