'use client';

import { Template, ImageCard } from '@/components';
import { ImageService } from '@/resource/service';
import { Image } from '@/resource/image';
import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function Galeria() {
  const [imageService] = useState(() => new ImageService());
  const [images, setImages] = useState<Image[]>([]);
  const [query, setQuery] = useState('');
  const [extension, setExtension] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    let active = true;

    imageService.buscar()
      .then((result) => {
        if (active) setImages(result);
      })
      .catch((cause: unknown) => {
        console.error('Erro ao carregar imagens:', cause);
        if (active) setError('Não foi possível carregar as imagens. Confira a conexão com o servidor.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [imageService]);

  async function searchImages(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await imageService.buscar(query, extension);
      setImages(result);
    } catch (cause) {
      console.error('Erro ao buscar imagens:', cause);
      setError('Não foi possível buscar imagens. Confira a conexão com o servidor.');
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteImage(id?: string) {
    try {
      await imageService.deletar(id);
      setImages((currentImages) => currentImages.filter((image) => image.id !== id));
    } catch (cause) {
      console.error('Erro ao excluir imagem:', cause);
      window.alert('Não foi possível excluir a imagem.');
    }
  }

  function renderImageCard(image: Image) {
    return (
      <ImageCard
        key={image.id ?? image.url}
        imageId={image.id}
        imageName={image.name}
        imageUrl={image.url}
        imageSize={image.size}
        uploadDate={image.uploadDate}
        extension={image.extension}
        onDelete={deleteImage}
      />
    );
  }

  function renderGalleryContent() {
    if (isLoading && images.length === 0) return <p className="gallery-message">Carregando sua biblioteca...</p>;
    if (error && images.length === 0) return <p className="gallery-message" role="alert">{error}</p>;
    if (images.length === 0) return <p className="gallery-message">Nenhuma imagem encontrada. Ajuste os filtros ou adicione uma imagem.</p>;
    return images.map(renderImageCard);
  }

  return (
    <Template>
      <main className="gallery-main">
        <div className="gallery-heading">
          <div>
            <p className="eyebrow">Arquivo visual / 01</p>
            <h1>Galeria</h1>
            <p>Encontre e organize suas imagens em um só lugar.</p>
          </div>
          <button className="action-link" type="button" onClick={() => router.push('/upload')}>
            <span aria-hidden="true">+</span> Adicionar imagem
          </button>
        </div>

        <form className="gallery-controls" onSubmit={searchImages}>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Pesquisar por nome..."
            aria-label="Pesquisar imagens por nome"
          />
          <select
            value={extension}
            onChange={(event) => setExtension(event.target.value)}
            aria-label="Filtrar por formato"
          >
            <option value="">Todos os formatos</option>
            <option value="JPG">JPG</option>
            <option value="PNG">PNG</option>
            <option value="JPEG">JPEG</option>
            <option value="GIF">GIF</option>
          </select>
          <button type="submit" disabled={isLoading}>Buscar</button>
        </form>
        {(isLoading || error) && images.length > 0 && (
          <p className="gallery-status" role={error ? 'alert' : 'status'}>
            {error || 'Atualizando resultados...'}
          </p>
        )}

        <section className="image-grid" aria-label="Imagens da galeria">
          {renderGalleryContent()}
        </section>
      </main>
    </Template>
  );
}