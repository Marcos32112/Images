package io.spring.image.demo.application;

import io.spring.image.demo.domain.entity.Image; import io.spring.image.demo.domain.enums.ImageExtension; import org.springframework.http.MediaType; import org.springframework.stereotype.Component; import org.springframework.web.multipart.MultipartFile;

import java.io.IOException; import java.util.List;

@Component public class ImageMapper {

    public Image mapToImage( MultipartFile file, String name, List<String> tags ) throws IOException {

        String contentType = file.getContentType();

        if (contentType == null) { throw new IllegalArgumentException( "Não foi possível identificar o formato da imagem." ); }

        ImageExtension extension = ImageExtension.valueOf( MediaType.valueOf(contentType) );

        return Image.builder() .name(name) .tags(tags == null ? "" : String.join(",", tags)) .size(file.getSize()) .extension(extension) .file(file.getBytes()) .build(); }

    public ImageDTO imageToDTO(Image image, String url) {

        return ImageDTO.builder()
                .url(url)
                .extension( image.getExtension() != null ? image.getExtension().name() : null )
                .name(image.getName()) .size(image.getSize())
                .uploadDate( image.getUploadDate() != null ? image.getUploadDate().toLocalDate() : null ) .build();
    }
}