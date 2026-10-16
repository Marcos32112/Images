import Link from 'next/link';
import { SynthwaveScene } from './components/SynthwaveScene';
import { Template } from './components/Template';

export default function Home() {
  return (
    <Template>
      <main className="home-main">
        <section className="home-hero">
          <div className="home-copy">
            <p className="eyebrow">ImageLite / Arquivo digital</p>
            <h1>Suas imagens, simples de achar.</h1>
            <p>
              Um espaço preciso para guardar, encontrar e revisitar suas imagens.
              Busca rápida, filtros por formato e metadados sempre à mão.
            </p>
            <Link className="action-link primary" href="/galeria">
              Abrir galeria <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <div className="art-frame">
            <span className="art-label">SYNTHWAVE / NIGHT DRIVE</span>
            <SynthwaveScene />
          </div>
        </section>

        <section className="home-notes" aria-label="Recursos da biblioteca">
          <article className="home-note">
            <h2>01 / Busca tática</h2>
            <p>Localize arquivos pelo nome com precisão e rapidez.</p>
          </article>
          <article className="home-note">
            <h2>02 / Filtros claros</h2>
            <p>Separe sua coleção por JPG, PNG, GIF e outros formatos.</p>
          </article>
          <article className="home-note">
            <h2>03 / Metadados</h2>
            <p>Consulte tamanho, extensão e data em cada imagem.</p>
          </article>
        </section>
      </main>
    </Template>
  );
} 