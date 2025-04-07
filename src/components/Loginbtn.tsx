"use client";
import { supabase } from "../../service/supabase";

export default function Home() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`, 
      },
    });

    if (error) {
      console.error("Login error:", error.message);
    }
  };

  return (
    <div className="googlebutton" onClick={handleGoogleLogin}>
      <button>
        <img src="./google.png" /> Login With Google
      </button>
    </div>
  );
}
