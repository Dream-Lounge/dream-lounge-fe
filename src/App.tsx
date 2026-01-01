import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

function App() {
  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <Header />
      <main className="container mx-auto py-8 flex-1">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">Welcome to Dream Lounge</h1>
          <p className="text-muted-foreground">Select a club or explore events.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
