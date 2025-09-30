package com.solekta.solekta.service;

import com.solekta.solekta.model.Service;
import com.solekta.solekta.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    // CREATE - Add new service
    public Service createService(Service service) {
        return serviceRepository.save(service);
    }

    // READ - Get all services
    public List<Service> getAllServices() {
        return serviceRepository.findAllOrderByName();
    }

    // READ - Get service by ID
    public Optional<Service> getServiceById(Integer id) {
        return serviceRepository.findById(id);
    }

    // READ - Search services by name
    public List<Service> searchServices(String serviceName) {
        return serviceRepository.findByServiceNameContainingIgnoreCase(serviceName);
    }

    // UPDATE - Update existing service
    public Service updateService(Integer id, Service updatedService) {
        return serviceRepository.findById(id)
                .map(service -> {
                    service.setServiceName(updatedService.getServiceName());
                    service.setDescription(updatedService.getDescription());
                    service.setPrice(updatedService.getPrice());
                    return serviceRepository.save(service);
                })
                .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));
    }

    // DELETE - Delete service
    public void deleteService(Integer id) {
        serviceRepository.deleteById(id);
    }

    // CHECK - Service exists
    public boolean serviceExists(Integer id) {
        return serviceRepository.existsById(id);
    }
}

