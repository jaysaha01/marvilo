"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // ✅ App Router uses this

export const myAuth = () => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('sb-nimjbxvauihbarlkjptg-auth-token');

    console.log("🍟🍟🍟🍟🍟", user);

    if (!user) {
      router.push('/signin'); // ✅ Client-side redirect
    } else {
      setLoading(false); // ✅ Access granted
    }
  }, [router]);

  return { loading };
};
