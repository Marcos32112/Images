
package io.spring.image.demo.application;

import io.spring.image.demo.domain.entity.Image;
import io.spring.image.demo.domain.service.ImageService;
import io.spring.image.demo.domain.enums.ImageExtension;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/images")
@Slf4j
@RequiredArgsConstructor
@CrossOrigin("*")
public class ImagesController {

    private final ImageService service;
    private final ImageMapper mapper;

    @PostMapping
    public ResponseEntity save(
            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam("tags") List<String> tags
    ) throws IOException {

        log.info("Recebendo tentativa de upload do arquivo: {}", file.getOriginalFilename());

        Image image = mapper.mapToImage(file, name, tags);
        Image savedImage = service.save(image);

        URI imageUri = buildImageURL(savedImage);

        return ResponseEntity.created(imageUri).build();
    }

    @GetMapping("{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable("id") String id) {

        var possibleImage = service.getById(id);

        if (possibleImage.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        var image = possibleImage.get();

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(image.getExtension().getMediaType());
        headers.setContentLength(image.getSize());

        headers.setContentDispositionFormData(
                "inline; filename=\"" + image.getFileName() + "\"",
                image.getFileName()
        );

        return new ResponseEntity<>(
                image.getFile(),
                headers,
                HttpStatus.OK
        );
    }

    @GetMapping
    public ResponseEntity<List<ImageDTO>> search(
            @RequestParam(value = "extension", required = false, defaultValue = "") String extension,
            @RequestParam(value = "query", required = false) String query
    ) throws InterruptedException {

        Thread.sleep(3000L);

        var result = service.search(
                ImageExtension.ofName(extension),
                query
        );

        var images = result.stream()
                .map(image -> {
                    var url = buildImageURL(image);
                    return mapper.imageToDTO(image, url.toString());
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(images);
    }


    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteImage(@PathVariable("id") String id) {

        service.deleteById(id);

        return ResponseEntity.noContent().build();
    }

    private URI buildImageURL(Image image) {

        String imagePath = "/" + image.getId();

        return ServletUriComponentsBuilder
                .fromCurrentRequestUri()
                .path(imagePath)
                .build()
                .toUri();
    }
}