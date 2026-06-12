"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { btnPrimary, input, label } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      setErro("E-mail ou senha incorretos.");
      setCarregando(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-bg px-4">
      <form
        onSubmit={entrar}
        className="w-full max-w-sm rounded-2xl border border-edge bg-surface p-8"
      >
        <p className="font-serif text-[34px] font-bold leading-none text-gold">
          GMF
        </p>
        <h1 className="mt-1.5 text-xs font-bold uppercase tracking-[0.4em] text-goldeep">
          Estofados
        </h1>
        <p className="mt-4 text-sm text-mute">Painel de gestão</p>

        <div className="mt-7 space-y-4">
          <div>
            <label className={label}>E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={input}
            />
          </div>
          <div>
            <label className={label}>Senha</label>
            <input
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className={input}
            />
          </div>
        </div>

        {erro && <p className="mt-4 text-sm text-danger">{erro}</p>}

        <button
          type="submit"
          disabled={carregando}
          className={`mt-7 w-full ${btnPrimary} py-2.5`}
        >
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
