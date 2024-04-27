import React, { useState } from 'react';
import Layout from '../components/layout';

const AddCustomer = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        city: '',
        movieTitle: '',
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
        console.log(formData); // Debug output to console
        alert('Customer and rental details added!'); // Placeholder action
        setFormData({ firstName: '', lastName: '', email: '', city: '', movieTitle: '', dateOfRental: '' }); // Reset form
    };

    return (
        <Layout>
            <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-r from-purple-500 to-pink-500">
                <h1 className="text-4xl font-bold text-white mb-4">Add New Customer and Rental Details</h1>
                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-lg">
                    <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} className="input-field" />
                    <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="input-field" />
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="input-field" />
                    <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} className="input-field" />
                    <input type="text" name="movieTitle" placeholder="Movie Title" value={formData.movieTitle} onChange={handleChange} className="input-field" />
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
