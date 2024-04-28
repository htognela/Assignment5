import Layout from "../components/layout";
import Image from "next/image";
import Link from 'next/link';

export default function Home() {
    return (
        <Layout>
            <main className="min-h-screen flex flex-col items-center justify-center bg-gray-200 p-10">
                <h1 className="text-2xl font-bold text-center">Welcome to SuperFlix DVD Rentals!</h1>
                <p className="mt-3 text-lg text-gray-600">Explore our extensive collection and rent your favorite DVDs today.</p>
                <div className="mt-5 space-x-4">
                    <Link href="/browse" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Browse DVDs
                    </Link>
                    <Link href="/new-customer" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Add Customer
                    </Link>
                    <Link href="/american-customers" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        American Customers
                    </Link>
                </div>
                <div className="mt-10 flex space-x-5">
                    <Image
                        src="/next.svg"
                        alt="Next.js Logo"
                        width={200}
                        height={200}
                    />
                    <Image
                        src="/vercel.svg"
                        alt="Vercel Logo"
                        width={200}
                        height={200}
                    />
                </div>
            </main>
        </Layout>
    );
}