import Link from 'next/link';
import Layout from "../components/Layout";
import TerminalLink from "../components/TerminalLink";

const Index = ()  => {
  return (
      <Layout className="mt-5">
          <p>$ links</p>
          <p>
              <Link href="/csr">
                  <TerminalLink label={ "CSR" } />
              </Link>{' '}
              <Link href="/isr">
                  <TerminalLink label={ "ISR" } />
              </Link>{' '}
              <Link href="/ssg">
                  <TerminalLink label={ "SSG" } />
              </Link>{' '}
              <Link href="/ssr">
                  <TerminalLink label={ "SSR" } />
              </Link>{' '}
          </p>
      </Layout>
  );
};

export default Index;
