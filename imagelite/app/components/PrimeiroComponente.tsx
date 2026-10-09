'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface PrimeiroComponenteProps {
    mensagem?: string;
    mensagemBotao?: string;
}

export const PrimeiroComponente = ({
    mensagem,
    mensagemBotao,
}: PrimeiroComponenteProps) => {
    const [montado, setMontado] = useState(false);

    useEffect(() => {
        setMontado(true);
    }, []);

    if (!montado) {
        return null;
    }

    return createPortal(
        <main className="fixed inset-0 z-[9999] flex h-screen w-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#06143f] via-[#123fc7] to-[#6417a8]">

            {/* Brilho azul no canto superior esquerdo */}
            <div className="pointer-events-none absolute -left-40 -top-40 h-[550px] w-[550px] rounded-full bg-cyan-400/25 blur-[130px]" />

            {/* Brilho azul no centro */}
            <div className="pointer-events-none absolute left-[35%] top-[20%] h-[450px] w-[450px] rounded-full bg-blue-400/20 blur-[140px]" />

            {/* Brilho roxo no canto inferior direito */}
            <div className="pointer-events-none absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-fuchsia-500/25 blur-[140px]" />

            {/* Brilho roxo suave */}
            <div className="pointer-events-none absolute bottom-[10%] left-[10%] h-[300px] w-[300px] rounded-full bg-purple-400/15 blur-[100px]" />

            {/* Pontinhos decorativos */}
            <div className="pointer-events-none absolute left-[15%] top-[20%] h-2 w-2 rounded-full bg-white/80 shadow-[0_0_20px_6px_rgba(255,255,255,0.25)]" />

            <div className="pointer-events-none absolute right-[18%] top-[28%] h-1.5 w-1.5 rounded-full bg-cyan-200 shadow-[0_0_20px_5px_rgba(103,232,249,0.4)]" />

            <div className="pointer-events-none absolute bottom-[22%] left-[25%] h-1.5 w-1.5 rounded-full bg-purple-200 shadow-[0_0_20px_5px_rgba(216,180,254,0.4)]" />

            {/* Conteúdo */}
            <div className="relative z-10 flex w-full flex-col items-center justify-center px-6 text-center">

                {/* Título */}
                <h1 className="text-5xl font-black tracking-tight text-white drop-shadow-2xl sm:text-6xl md:text-7xl">
                    GALERIA (HOME)
                </h1>

                {/* Mensagem */}
                {mensagem && (
                    <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-blue-100 sm:text-xl">
                        {mensagem}
                    </p>
                )}

                {/* Botão */}
                <a
                    href="/galeria"
                    className="group mt-10 inline-flex items-center gap-3 rounded-2xl border border-white/30 bg-white px-8 py-4 text-lg font-bold text-blue-700 shadow-2xl shadow-black/30 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-50 hover:shadow-blue-950/50 active:scale-95"
                >
                    <span>
                        {mensagemBotao || 'PAGINA DA GALERIA'}
                    </span>

                    <span className="text-xl transition-transform duration-300 group-hover:translate-x-1">
                        →
                    </span>
                </a>
            </div>
        </main>,
        document.body
    );
};
