import { DiffWorkspace } from "@/components/diff/diff-workspace";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.14),transparent_32rem),linear-gradient(180deg,hsl(var(--background)),hsl(var(--background)))]">
      <Navbar />
      <DiffWorkspace />
      <Footer />
    </main>
  );
}
