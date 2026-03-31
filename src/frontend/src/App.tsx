import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import AppLayout from "./components/AppLayout";
import LandingPage from "./components/LandingPageNew";
import LoginPage from "./components/LoginPageNew";

export type AppPage = "landing" | "login" | "app";

export default function App() {
  const [page, setPage] = useState<AppPage>(() => {
    if (localStorage.getItem("finhealth_logged_in") === "true") return "app";
    return "landing";
  });

  useEffect(() => {
    if (
      page === "app" &&
      localStorage.getItem("finhealth_logged_in") !== "true"
    ) {
      setPage("landing");
    }
  }, [page]);

  const navigate = (to: AppPage) => setPage(to);

  return (
    <div className="app-bg">
      {page === "landing" && <LandingPage navigate={navigate} />}
      {page === "login" && <LoginPage navigate={navigate} />}
      {page === "app" && <AppLayout navigate={navigate} />}
      <Toaster position="bottom-right" theme="dark" />
    </div>
  );
}
