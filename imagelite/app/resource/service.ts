import { Image } from "./image";

export class ImageService {

  baseURL: string = 'http://localhost:8080/images';

  async buscar(query: string = '', extension: string = ''): Promise<Image[]> {
    const url = `${this.baseURL}?query=${encodeURIComponent(query)}&extension=${encodeURIComponent(extension)}`;

    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.text();
      console.error('Erro do backend:', error);
      throw new Error(`Erro HTTP ${response.status}: ${error}`);
    }

    const result = await response.json();

    if (!Array.isArray(result)) {
      throw new Error('O backend não retornou uma lista de imagens');
    }

    return result;
  }
  async enviar(file: File, name: string, tags: string[]): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', name);
  tags.forEach((tag) => formData.append('tags', tag));

  const response = await fetch(this.baseURL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(
      `Falha ao enviar imagem: ${response.status} ${response.statusText}`,
    );
  }
  
}
  async deletar(id?: string): Promise<void> {
    if (!id) {
      throw new Error('Não foi possível identificar a imagem para remover.')
    }

    const response = await fetch(`${this.baseURL}/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(`Falha ao apagar imagem: ${response.status} ${response.statusText}`)
    }
  }
}

export const useImageService = () => new ImageService();