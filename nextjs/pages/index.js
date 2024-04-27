import Layout from "../components/layout";
import Image from "next/image";
import Link from 'next/link';

export default function Home() {
    return (
        <Layout>
            <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-r from-cyan-500 to-blue-500">
                <h1 className="text-4xl font-bold text-white mb-4">Welcome to Our DVD Rental Store</h1>
                <Link href='/AddCustomer' className="text-lg text-indigo-200 hover:text-indigo-100">
                    Add New Customer
                </Link>
            </main>
        </Layout>
    );
}



