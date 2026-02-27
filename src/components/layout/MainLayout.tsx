import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";
import { Header } from "./Header";

const MAX_WIDTH = "max-w-3xl";

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-amber-50/60">
      <div className={`${MAX_WIDTH} w-full mx-auto flex flex-col min-h-screen border-x border-border bg-background`}>
        <Header />
        <main className="flex-1 px-4 py-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
