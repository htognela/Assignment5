import Layout from "../components/layout";
import React, { useState } from 'react';
import styles from './NewCustomer.module.css';

export default function NewCustomer() {
    const [customer, setCustomer] = useState({
        store_id: 1,
        first_name: '',
        last_name: '',
        email: '',
        address_id: '',
    });

    const [inventoryIds, setInventoryIds] = useState('');
    const [message, setMessage] = useState('');

    const handleCustomerSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch('http://localhost:8000/add-customer/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(customer),
        });
        const data = await response.json();
        setMessage(data.message);
    };

    const handleRentalSubmit = async (event) => {
        event.preventDefault();
        const ids = inventoryIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
        const response = await fetch('http://localhost:8000/rent-videos/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                customer_id: parseInt(customer.customer_id || 1),
                inventory_ids: ids,
            }),
        });
        const data = await response.json();
        setMessage(`${data.message}. Return date: ${data.return_date}`);
    };

    return (
        <Layout>
            <div className={styles.formContainer}>
                <h1>Add New Customer</h1>
                <form onSubmit={handleCustomerSubmit} className={styles.form}>
                    <input
                        type="text"
                        value={customer.first_name}
                        onChange={e => setCustomer({ ...customer, first_name: e.target.value })}
                        placeholder="First Name"
                        required
                        className={styles.inputField}
                    />
                    <input
                        type="text"
                        value={customer.last_name}
                        onChange={e => setCustomer({ ...customer, last_name: e.target.value })}
                        placeholder="Last Name"
                        required
                        className={styles.inputField}
                    />
                    <input
                        type="email"
                        value={customer.email}
                        onChange={e => setCustomer({ ...customer, email: e.target.value })}
                        placeholder="Email"
                        required
                        className={styles.inputField}
                    />
                    <input
                        type="number"
                        value={customer.address_id}
                        onChange={e => setCustomer({ ...customer, address_id: e.target.value })}
                        placeholder="Address ID"
                        required
                        className={styles.inputField}
                    />
                    <button type="submit" className={styles.submitButton}>Add Customer</button>
                </form>
                <h1>Rent Videos</h1>
                <form onSubmit={handleRentalSubmit} className={styles.form}>
                    <input
                        type="text"
                        value={inventoryIds}
                        onChange={e => setInventoryIds(e.target.value)}
                        placeholder="Inventory IDs (comma-separated)"
                        required
                        className={styles.inputField}
                    />
                    <button type="submit" className={styles.submitButton}>Rent Videos</button>
                </form>
                {message && <p className={styles.message}>{message}</p>}
            </div>
        </Layout>
    );
}
