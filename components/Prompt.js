import gql from 'graphql-tag';
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";

const UserMutation = gql`
  mutation UserMutation($id: ID!, $name: String!) {
    addUser(id: $id, name: $name) {
      id
      name
    }
  }
`;

const Prompt = () => {
    const [characters, setCharacters] = useState([]);

    const [addUser] = useMutation(UserMutation)

    useEffect(() => {
        const onKeyDown = (e) => {
            e.preventDefault();

            switch (e.key) {
                case "Backspace":
                    setCharacters((prev) => prev.slice(0, -1));
                    break;
                case "Enter":
                    addUser({ variables: { id: 1, name: "foo" }});
                    setCharacters([]);
                    break;
                case "Alt":
                case "Control":
                case "Shift":
                    break;
                case "Space":
                    setCharacters((prev) => prev.concat([" "]));
                    break;
                default:
                    setCharacters((prev) => prev.concat([e.key]));
            }
        }

        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
        }
    }, []);

    return (
        <p className="break-all">$ { characters.join("") }</p>
    );
};

export default Prompt;
