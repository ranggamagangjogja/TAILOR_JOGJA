import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function AdminGuard({ children }: any) {
  const [allowed, setAllowed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        navigate("/admin/login");
      } else {
        setAllowed(true);
      }
    });
  }, [navigate]);

  if (!allowed) return <p>Loading...</p>;

  return children;
}
