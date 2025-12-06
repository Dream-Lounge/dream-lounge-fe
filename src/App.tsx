import { Header } from "@/components/layout/Header";

function App() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      <main className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary mb-4">Welcome to Dream Lounge</h1>
          <p className="text-muted-foreground">Select a club or explore events.</p>
        </div>
      </main>
    </div>
  )
}

export default App
