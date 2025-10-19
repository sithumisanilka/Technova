package com.solekta.solekta.service;

import com.solekta.solekta.model.RentalService;
import com.solekta.solekta.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Component
@Slf4j
public class ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    // CREATE - Add new service
    public RentalService createService(RentalService service) {
        return serviceRepository.save(service);
    }

    public RentalService createServiceWithImage(String serviceName, String description,
            BigDecimal pricePerDay, BigDecimal pricePerHour, String category,
            Boolean isAvailable, Integer minRentalPeriod, Integer maxRentalPeriod,
            MultipartFile imageFile) {

        RentalService service = new RentalService();
        service.setServiceName(serviceName);
        service.setDescription(description);
        service.setPricePerDay(pricePerDay);
        service.setPricePerHour(pricePerHour);
        service.setCategory(category);
        service.setIsAvailable(isAvailable);
        service.setMinRentalPeriod(minRentalPeriod);
        service.setMaxRentalPeriod(maxRentalPeriod);
        
        // Handle image file upload
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                service.setImageData(imageFile.getBytes());
                service.setImageFileName(imageFile.getOriginalFilename());
                service.setImageContentType(imageFile.getContentType());
                log.info("Service image uploaded: {}", imageFile.getOriginalFilename());
            } catch (IOException e) {
                log.error("Failed to process service image file: {}", e.getMessage());
                throw new RuntimeException("Failed to process service image file", e);
            }
        }
        
        return serviceRepository.save(service);
    }

    // READ - Get all services
    public List<RentalService> getAllServices() {
        return serviceRepository.findAllOrderByName();
    }

    // READ - Get available services
    public List<RentalService> getAvailableServices() {
        return serviceRepository.findByIsAvailableTrue();
    }

    // READ - Get service by ID
    public Optional<RentalService> getServiceById(Long id) {
        return serviceRepository.findById(id);
    }

    // READ - Search services by keyword
    public List<RentalService> searchServices(String keyword) {
        return serviceRepository.searchServices(keyword);
    }

    // READ - Get services by category
    public List<RentalService> getServicesByCategory(String category) {
        return serviceRepository.findByCategoryContainingIgnoreCase(category);
    }

    // READ - Get services by price range
    public List<RentalService> getServicesByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return serviceRepository.findByPricePerDayBetween(minPrice, maxPrice);
    }

    // UPDATE - Update existing service
    public RentalService updateService(Long id, RentalService updatedService) {
        return serviceRepository.findById(id)
                .map(service -> {
                    service.setServiceName(updatedService.getServiceName());
                    service.setDescription(updatedService.getDescription());
                    service.setPricePerDay(updatedService.getPricePerDay());
                    service.setPricePerHour(updatedService.getPricePerHour());
                    service.setCategory(updatedService.getCategory());
                    service.setIsAvailable(updatedService.getIsAvailable());
                    service.setMinRentalPeriod(updatedService.getMinRentalPeriod());
                    service.setMaxRentalPeriod(updatedService.getMaxRentalPeriod());
                    return serviceRepository.save(service);
                })
                .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));
    }

    // DELETE - Delete service
    public void deleteService(Long id) {
        serviceRepository.deleteById(id);
    }

    // CHECK - Service exists
    public boolean serviceExists(Long id) {
        return serviceRepository.existsById(id);
    }

    // Helper method to save service
    public RentalService saveService(RentalService service) {
        return serviceRepository.save(service);
    }
}

