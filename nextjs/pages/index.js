import Layout from "../components/layout";
import Image from "next/image";
import Link from 'next/link';

export default function Home() {
  return (
    <Layout>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1>Hello, click <Link href='/CanadianCustomers'>this link</Link> to see the query. I don't know why it's not working.</h1>
        <Image
          src="/next.svg"
          alt="Next.js Logo"
          width={200}
          height={200}
        />        
        <Image
          src="/vercel.svg"
          alt="Next.js Logo"
          width={200}
          height={200}
        />
      </main>


    </Layout>
  );
}


