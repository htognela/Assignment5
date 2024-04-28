import React, { useState } from 'react';
import Layout from '../components/layout';

const AddCustomer = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address_id: '',
        inventoryId: '',
        dateOfRental: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const customerData = {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            address_id: formData.address_id,
        };

        try {
            // First, add the customer
            const customerResponse = await fetch('http://localhost:8000/add-customer/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(customerData)
            });
            const customerResult = await customerResponse.json();
            if (!customerResponse.ok) {
                throw new Error(customerResult.message || 'Failed to add customer');
            }

            // If the customer is added successfully, rent the videos
            const rentalData = {
                customer_id: customerResult.customer_id, // Assuming the customer ID is returned after adding
                inventory_ids: [parseInt(formData.inventoryId)] // Assuming you handle the inventory ID directly
            };

            const rentalResponse = await fetch('http://localhost:8000/rent-videos/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rentalData)
            });
            const rentalResult = await rentalResponse.json();
            if (!rentalResponse.ok) {
                throw new Error(rentalResult.message || 'Failed to rent videos');
            }

            alert('Customer and rental added successfully!');
            console.log(rentalResult);
            setFormData({ firstName: '', lastName: '', email: '', address_id: '', inventoryId: '', dateOfRental: '' });

        } catch (error) {
            console.error('Failed to process transaction:', error);
            alert(error.message);
        }
    };

    return (
        <Layout>
            <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-r from-purple-500 to-pink-500">
                <h1 className="text-4xl font-bold text-white mb-4">Add New Customer and Rental Details</h1>
                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-lg">
                    <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="input-field" />
                    <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="input-field" />
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="input-field" />
                    <input type="text" name="address_id" placeholder="Address ID" value={formData.address_id} onChange={handleChange} className="input-field" />
                    <input type="text" name="inventoryId" placeholder="Inventory ID" value={formData.inventoryId} onChange={handleChange} className="input-field" />
                    <input type="date" name="dateOfRental" value={formData.dateOfRental} onChange={handleChange} className="input-field" />
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Submit Details
                    </button>
                </form>
            </div>
        </Layout>
    );
};

export default AddCustomer;
