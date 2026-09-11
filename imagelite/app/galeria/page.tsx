"use client";

import { Template, ImageCard } from '../components';
import { Image } from '../resource/image';
import { useImageService } from '../resource/service';
import { useState } from 'react';

export default function Galeria() {


  const useService = useImageService();
  const [images, setImage] = useState<Image[]>([])

   async function searchImage(){
      const result = await useService.buscar();
      setImage(result);
      console.table(result)
    }

    /*renderizando a imagem na tela*/
  function renderImageCard(image: Image ) {
    return (
      <ImageCard imageName = {image.name} 
                 imageUrl={image.url}
                 imageSize = {image.size}
                 uploadDate={image.uploadDate} />
    )
  }

  function renderImageCards() {
    //return images.map((image) => renderImageCard(image));
    return images.map(renderImageCard);
  }

    

  return (
    //<main>
      <Template>
        <button className="bg-purple-800 hover:bg-purple-950 text-white font-bold py-2 px-4 rounded" onClick={searchImage}>
          Mudar Imagem </button>
        <section className="grid grid-cols-4 gap-4  p-4">
        {
            renderImageCards()
     }
        </section>
      </Template>
    //</main>
  )
}