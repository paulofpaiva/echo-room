import { Button } from "@/components/ui/button";

function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-semibold">Echo Room</h1>
      <p className="text-muted-foreground">React + Vite + shadcn/ui</p>
      <Button>Get started</Button>
    </div>
  );
}

export default App;
