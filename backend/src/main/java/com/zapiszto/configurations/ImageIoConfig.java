package com.zapiszto.configurations;

import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;
import javax.imageio.spi.IIORegistry;
import com.twelvemonkeys.imageio.plugins.webp.WebPImageReaderSpi;

@Configuration
public class ImageIoConfig {

  @PostConstruct
  public void registerWebPReader() {
    IIORegistry.getDefaultInstance().registerServiceProvider(new WebPImageReaderSpi());
    System.out.println("✅ WebP ImageReader registered successfully!");
  }
}