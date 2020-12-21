import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { signIn, signOut, useSession } from 'next-auth/client';
import Layout from "../components/Layout";
import TerminalLink from "../components/TerminalLink";
import Prompt from "../components/Prompt";

const Index = () => {
    const { data, loading } = useQuery(gql`
query UserQuery($id: ID!) {
  user(id: $id) {
    name
  }
}
`, { variables: { id: 1 }});

    const [ session, sessionLoading ] = useSession();

    if (loading || sessionLoading) {
        return <p>Loading...</p>;
    }

    return (
        <Layout className="mt-5">
            <p>$ hi</p>
            <p>Hi, { data.user.name }</p>
            <p>$ date</p>
            <p>{ new Date().toISOString() }</p>
            <p>$ session</p>
            {
                session
                &&
                <>
                    <p>Not signed in: <TerminalLink label={ "Sign In" } onClick={ signIn } /></p>
                    <p>$ session</p>
                    <p>Signed in as {session.user.name}: <TerminalLink label={ "Sign Out" } onClick={ signOut } /></p>
                </>
            }
            {
                !session
                &&
                <p>Not signed in: <TerminalLink label={ "Sign In" } onClick={ signIn } /></p>
            }
            <Prompt />
        </Layout>
    );
};

export default Index;
