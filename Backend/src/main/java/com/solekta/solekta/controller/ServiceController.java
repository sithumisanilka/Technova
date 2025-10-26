package com.solekta.solekta.controller;

import com.solekta.solekta.model.RentalService;
import com.solekta.solekta.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class ServiceController {

    @Autowired
    private ServiceService serviceService;

    // CREATE - Add new service
    @PostMapping
    public ResponseEntity<RentalService> createService(@RequestBody RentalService service) {
        try {
            RentalService savedService = serviceService.createService(service);
            return ResponseEntity.ok(savedService);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping(value = "/with-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RentalService> createServiceWithImage(
            @RequestParam("serviceName") String serviceName,
            @RequestParam("description") String description,
            @RequestParam("pricePerDay") BigDecimal pricePerDay,
            @RequestParam(value = "pricePerHour", required = false) BigDecimal pricePerHour,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "isAvailable", defaultValue = "true") Boolean isAvailable,
            @RequestParam(value = "minRentalPeriod", defaultValue = "1") Integer minRentalPeriod,
            @RequestParam(value = "maxRentalPeriod", defaultValue = "720") Integer maxRentalPeriod,
            @RequestParam(value = "imageFile", required = false) MultipartFile imageFile) {

        RentalService service = serviceService.createServiceWithImage(
                serviceName, description, pricePerDay, pricePerHour, category,
                isAvailable, minRentalPeriod, maxRentalPeriod, imageFile);
        
        return ResponseEntity.ok(service);
    }

    // READ - Get all services
    @GetMapping
    public ResponseEntity<List<RentalService>> getAllServices() {
        List<RentalService> services = serviceService.getAllServices();
        return ResponseEntity.ok(services);
    }

    @GetMapping("/available")
    public List<RentalService> getAvailableServices() {
        return serviceService.getAvailableServices();
    }

    // READ - Get service by ID
    @GetMapping("/{id}")
    public ResponseEntity<RentalService> getServiceById(@PathVariable Long id) {
        return serviceService.getServiceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // READ - Search services
    @GetMapping("/search")
    public ResponseEntity<List<RentalService>> searchServices(@RequestParam String keyword) {
        List<RentalService> services = serviceService.searchServices(keyword);
        return ResponseEntity.ok(services);
    }

    @GetMapping("/category/{category}")
    public List<RentalService> getServicesByCategory(@PathVariable String category) {
        return serviceService.getServicesByCategory(category);
    }

    @GetMapping("/price-range")
    public List<RentalService> getServicesByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice) {
        return serviceService.getServicesByPriceRange(minPrice, maxPrice);
    }

    // UPDATE - Update service
    @PutMapping("/{id}")
    public ResponseEntity<RentalService> updateService(@PathVariable Long id, @RequestBody RentalService service) {
        try {
            RentalService updatedService = serviceService.updateService(id, service);
            return ResponseEntity.ok(updatedService);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE - Delete service
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        try {
            serviceService.deleteService(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getServiceImage(@PathVariable Long id) {
        try {
            Optional<RentalService> serviceOpt = serviceService.getServiceById(id);
            
            if (serviceOpt.isEmpty() || serviceOpt.get().getImageData() == null) {
                return ResponseEntity.notFound().build();
            }

            RentalService service = serviceOpt.get();
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType(service.getImageContentType()));
            headers.setContentDispositionFormData("inline", service.getImageFileName());
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(service.getImageData());
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
