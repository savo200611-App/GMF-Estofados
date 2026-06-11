"use client";

import { useRef, useState } from "react";

import { createClient } from "@/lib/supabase/client";

// Upload de imagem direto para o bucket 'catalogo' do Supabase Storage.
// Guarda a URL publica num input hidden enviado junto com o form.
export function ImageUpload({
  pasta,
  defaultUrl,
  name = "foto_url",
}: {
  pasta: "modelos" | "tecidos";
  defaultUrl?: string | null;
  name?: string;
}) {
  const [url, setUrl] = useState(defaultUrl ?? "");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function aoSelecionar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setErro(null);
    setEnviando(true);
    const supabase = createClient();

    const ext = file.name.split(".").pop() ?? "jpg";
    const caminho = `${pasta}/${crypto.randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from("catalogo")
      .upload(caminho, file, { upsert: false });

    if (error) {
      setErro("Falha no upload da imagem.");
      setEnviando(false);
      return;
    }

    const { data } = supabase.storage.from("catalogo").getPublicUrl(caminho);
    setUrl(data.publicUrl);
    setEnviando(false);
  }

  return (
    <div>
      <input type="hidden" name={name} value={url} readOnly />
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs text-neutral-400">sem foto</span>
          )}
        </div>
        <div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={enviando}
            className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-60"
          >
            {enviando ? "Enviando..." : url ? "Trocar foto" : "Enviar foto"}
          </button>
          {erro && <p className="mt-1 text-sm text-red-600">{erro}</p>}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={aoSelecionar}
        className="hidden"
      />
    </div>
  );
}
