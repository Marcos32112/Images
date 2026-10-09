'use client'

//import { Template } from '../components/Template';
//import { ImageCard } from '../components/Image';
import { Template, ImageCard,  } from '@/components';
import { ImageService, useImageService } from '@/resource/service';
import { Image } from '@/resource/image'; 
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components';





export default function Galeria() {
  
  const useService = useImageService()
  const[images, setImages] = useState<Image[]>([])
  const [query,setQuery] = useState<string>('')
  const [extension, setExtension] = useState<string> ('')
  const router = useRouter();

  async function searchImages() {
  try {
    const result = await useService.buscar(query, extension);
    setImages(result);
    console.log(query, extension);
  } catch (error) {
    console.error('Erro ao buscar imagens:', error);
    setImages([]);
  }
}

  function renderImageCard(image: Image) {
    return (
      <ImageCard key = {image.url}
                 imageName = {image.name} 
                 imageUrl = {image.url}
                 imageSize = {image.size}
                 uploadDate = {image.uploadDate}
                 extension = {image.extension}
      />
    )
  }

  function renderImageCards() {
    return images.map(renderImageCard);
  }

  return (
   
      <Template>

        <section className="flex flex-col items-center justify-center my-5">
            <div className="flex space-x-4">
              <input type="text" 
              onChange={(e) => setQuery(e.target.value)}
              className="border px-4 py-2 rounded-lg text-White-900" placeholder="Buscar imagens..." />
              <select onChange={(e) => setExtension(e.target.value)} className="border px-4 py-2 rounded-lg text-White-900">
                <option value="">All formats</option>
                <option value="JPG">JPG</option>
                <option value="PNG">PNG</option>
                <option value="JPEG">JPEG</option>
                <option value="GIF">GIF</option>
              </select>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" onClick={searchImages}>Search </button>
              <Button
                  type="button"
                  variant="danger"
                  onClick={() => router.push('/upload')}
                  >
                  Add New
              </Button>
            </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
            {renderImageCards()}
        </section>
          
      </Template>
   
  )
}