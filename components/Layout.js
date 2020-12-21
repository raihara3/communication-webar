import Head from 'next/head';
import MacToolbar from "./MacToolbar";

export default function Layout({ children, className }) {
  return (
      <div className={[ className, "w-3/4 h-screen mx-auto font-mono"].join(" ")}>
          <Head>
              <title>Sample Web Application</title>
          </Head>
          <div className="w-full h-3/4 focus:outline-none">
              <MacToolbar label={ "Terminal" } />
              <div className="w-full h-full pl-1 pt-1 text-green-400 bg-black">
                  <main>{ children }</main>
              </div>
          </div>
      </div>
  )
}
