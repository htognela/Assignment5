import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from "../components/layout";  // If you want to keep the layout during redirect

const CanadianCustomers = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/'); // Redirect users to the homepage
  }, [router]);

  return null;  // Return null while redirecting
};

export default CanadianCustomers;

