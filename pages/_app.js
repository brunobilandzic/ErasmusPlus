// Import the Layout component
import Layout from "@/components/Layout";
// Import global CSS styles
import "@/styles/globals.css";

// Define the main App component
export default function App({ Component, pageProps }) {
  // Wrap the Component with the Layout component
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
