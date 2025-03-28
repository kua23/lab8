package com.mit.controller;

import com.mit.entity.CustomerDetails;
import com.mit.service.CustomerService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/customer")
public class CustomerController {

	@Autowired
	private CustomerService customerService;

	@GetMapping
	public List<CustomerDetails> getAllCustomers() {
		return customerService.getAllCustomers();
	}

	@GetMapping("/{id}")
	public ResponseEntity<CustomerDetails> getCustomerById(@PathVariable Long id) {
		return customerService.getCustomerById(id)
				.map(item -> new ResponseEntity<>(item, HttpStatus.OK))
				.orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	@PostMapping
	public ResponseEntity<CustomerDetails> createCustomer(@RequestBody CustomerDetails newCustomerDetails) {
		System.out.println("Creating customer...");
		CustomerDetails savedCustomerDetails = customerService.createCustomer(newCustomerDetails);
		return new ResponseEntity<>(savedCustomerDetails, HttpStatus.CREATED);
	}

	@PutMapping("/{id}")
	public ResponseEntity<CustomerDetails> updateCustomer(@PathVariable Long id,
			@RequestBody CustomerDetails newCustomerDetails) {
		try {
			CustomerDetails updatedCustomerDetails = customerService.updateCustomer(id, newCustomerDetails);
			return new ResponseEntity<>(updatedCustomerDetails, HttpStatus.OK);
		} catch (RuntimeException e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
		try {
			customerService.deleteCustomer(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (RuntimeException e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
}