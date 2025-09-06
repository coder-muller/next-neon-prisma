import Link from "next/link";
import { Book } from "lucide-react";
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Decorative gradients */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-[-10%] top-[-15%] h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-indigo-500/20 via-violet-500/20 to-fuchsia-500/20 blur-3xl" />
        <div className="absolute left-[-10%] bottom-[-10%] h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-emerald-400/20 to-teal-500/20 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 border-b border-border bg-background/60 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2 text-foreground">
          <Book className="h-6 w-6" />
          <span className="text-lg font-bold">Books</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/profile">
            <Button variant="default">
              Abrir App
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl flex flex-col items-center justify-center gap-4 px-6 py-24 text-center sm:py-28 md:py-32 min-h-screen">
        <h1 className="bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl md:text-6xl">
          Todos os seus livros, organizados de forma elegante
        </h1>
        <p className="max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
          Acompanhe sua leitura, gerencie sua biblioteca e mantenha-se por dentro do seu próximo livro favorito.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/profile"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 ring-1 ring-black/5 transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
          >
            Ir para Biblioteca
          </Link>
          <a
            href="#features"
            className="inline-flex items-center justify-center rounded-xl border border-border bg-background/60 px-4 py-2 text-sm font-semibold text-foreground/90 backdrop-blur hover:bg-background/80 focus:outline-none focus:ring-2 focus:ring-foreground/20"
          >
            Saiba mais
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-6 pb-16 sm:grid-cols-2 lg:grid-cols-3">
        <div className="group rounded-2xl border border-border bg-background/60 p-6 shadow-sm transition-colors hover:border-foreground/20">
          <div className="inline-grid h-8 w-8 place-items-center rounded-full bg-gradient-to-tr from-yellow-300 to-orange-500 font-bold text-black ring-1 ring-black/10">
            1
          </div>
          <h3 className="mt-3 text-base font-semibold">Criar e organizar</h3>
          <p className="mt-1 text-sm text-muted-foreground">Adicione novos livros facilmente e mantenha sua coleção organizada.</p>
        </div>
        <div className="group rounded-2xl border border-border bg-background/60 p-6 shadow-sm transition-colors hover:border-foreground/20">
          <div className="inline-grid h-8 w-8 place-items-center rounded-full bg-gradient-to-tr from-sky-300 to-indigo-500 font-bold text-black ring-1 ring-black/10">
            2
          </div>
          <h3 className="mt-3 text-base font-semibold">Busca poderosa</h3>
          <p className="mt-1 text-sm text-muted-foreground">Encontre qualquer livro instantaneamente com busca rápida e inteligente.</p>
        </div>
        <div className="group rounded-2xl border border-border bg-background/60 p-6 shadow-sm transition-colors hover:border-foreground/20">
          <div className="inline-grid h-8 w-8 place-items-center rounded-full bg-gradient-to-tr from-emerald-300 to-teal-500 font-bold text-black ring-1 ring-black/10">
            3
          </div>
          <h3 className="mt-3 text-base font-semibold">Ações inteligentes</h3>
          <p className="mt-1 text-sm text-muted-foreground">Atualize ou remova livros em um clique com uma interface limpa.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 pb-8 text-center text-sm text-muted-foreground">
        Construído com Next.js • Feito para leitores
      </footer>
    </main>
  );
}