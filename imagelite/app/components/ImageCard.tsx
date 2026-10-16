import React from 'react'

interface ImageCardProps {
 imageId?: string
 imageUrl?: string
 imageName?: string
 imageSize?: string
 uploadDate?: string
 extension?: string
 tags?: string[]
 onDelete?: (id?: string) => void
}

export const ImageCard: React.FC<ImageCardProps> = ({
 imageId,
 imageUrl,
 imageName,
 imageSize,
 uploadDate,
 extension,
 tags = [],
 onDelete,
}) => {
 function downloadImage() {
   if (!imageUrl) return

   try {
     const link = document.createElement('a')
     link.href = imageUrl
     link.rel = 'noopener'
     link.target = '_blank'

     const isLocalOrSameOrigin = imageUrl.startsWith(window.location.origin) || imageUrl.startsWith('blob:') || imageUrl.startsWith('data:')

     if (isLocalOrSameOrigin) {
       link.download = imageName || 'download-image'
     }

     document.body.appendChild(link)
     link.click()
     document.body.removeChild(link)
   } catch (error) {
     console.error('Erro ao iniciar o download da imagem:', error)
     window.open(imageUrl, '_blank')
   }
 }

 function handleDelete(event: React.MouseEvent<HTMLButtonElement>) {
   event.stopPropagation()

   const confirmed = window.confirm(`Deseja excluir a imagem "${imageName || 'selecionada'}"?`)
   if (!confirmed) return

   onDelete?.(imageId)
 }

 return (
   <article className="image-card">
     <div className="cursor-pointer" onClick={downloadImage} role="button" tabIndex={0} onKeyDown={(event) => event.key === 'Enter' && downloadImage()} aria-label={`Baixar ${imageName || 'imagem'}`}>
       <div className="image-card-media">
         <img
           src={imageUrl}
           alt={imageName || 'Thumbnail'}
         />
         <div className="image-card-overlay" />

         {extension && (
           <span className="image-badge">
             {extension}
           </span>
         )}

         {onDelete && (
           <button
             type="button"
             onClick={handleDelete}
               className="delete-image"
             aria-label="Apagar imagem"
           >
               Excluir
           </button>
         )}
       </div>

         <div className="image-card-body">
           <h2 className="image-card-title">
           {imageName || 'Sem título'}
           </h2>

         {tags.length > 0 && (
             <div className="image-card-tags">
             {tags.map((tag) => (
               <span
                 key={tag}
                   className="image-card-tag"
               >
                 {tag}
               </span>
             ))}
           </div>
         )}

         <div className="image-card-meta">
           <span>{uploadDate || 'Data desconhecida'}</span>
           <span className="image-card-size">
             {formatBytes(Number(imageSize))}
           </span>
         </div>
       </div>
     </div>
   </article>
 )
}

function formatBytes(bytes: number = 0, decimals: number = 2): string {
 if (bytes === 0) return '0 Bytes'

 const k = 1024
 const dm = decimals < 0 ? 0 : decimals
 const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
 const absBytes = Math.abs(bytes)

 const i = Math.min(Math.floor(Math.log(absBytes) / Math.log(k)), sizes.length - 1)
 const formattedValue = parseFloat((bytes / Math.pow(k, i)).toFixed(dm))

 return `${formattedValue} ${sizes[i]}`
}