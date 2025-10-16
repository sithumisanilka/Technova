package com.solekta.solekta.controller;

import com.solekta.solekta.model.Service;
import com.solekta.solekta.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class ServiceController {

    @Autowired

    private ServiceService serviceService;

    // CREATE - Add new service
    @PostMapping
    public ResponseEntity<Service> createService(@RequestBody Service service) {
        try {
            Service savedService = serviceService.createService(service);
            return ResponseEntity.ok(savedService);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // READ - Get all services
    @GetMapping
    public ResponseEntity<List<Service>> getAllServices() {
        List<Service> services = serviceService.getAllServices();
        return ResponseEntity.ok(services);
    }

    // READ - Get service by ID
    @GetMapping("/{id}")
    public ResponseEntity<Service> getServiceById(@PathVariable Integer id) {
        return serviceService.getServiceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // READ - Search services
    @GetMapping("/search")
    public ResponseEntity<List<Service>> searchServices(@RequestParam String name) {
        List<Service> services = serviceService.searchServices(name);
        return ResponseEntity.ok(services);
    }

    // UPDATE - Update service
    @PutMapping("/{id}")
    public ResponseEntity<Service> updateService(@PathVariable Integer id, @RequestBody Service service) {
        try {
            Service updatedService = serviceService.updateService(id, service);
            return ResponseEntity.ok(updatedService);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE - Delete service
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Integer id) {
        try {
            serviceService.deleteService(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
