import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { signIn, signOut, useSession } from 'next-auth/client';
import createApolloClient from '../apollo/client';
import Layout from "../components/Layout";
import TerminalLink from "../components/TerminalLink";

const UserQuery = gql`
query UserQuery($id: ID!) {
  user(id: $id) {
    name
  }
}
`;

const Index = ({ date }) => {
    const { data } = useQuery(UserQuery, { variables: { id: 1 }});

    const [ session ] = useSession();

    return (
        <Layout className="mt-5">
            <p>$ hi</p>
            <p>Hi, { data.user.name }</p>
            <p>$ date</p>
            <p>{ date }</p>
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
            <p>$</p>
        </Layout>
    );
};

export async function getStaticProps() {
    const apolloClient = createApolloClient();

    await apolloClient.query({
        query: UserQuery,
        variables: {
            id: 1
        }
    });

    return {
        props: {
            initialApolloState: apolloClient.cache.extract(),
            date: new Date().toISOString(),
        },
    };
}

export default Index;
