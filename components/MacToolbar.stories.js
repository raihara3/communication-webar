import MacToolbar from "./MacToolbar";

export default {
  title: 'MacToolbar',
};

export const Terminal = (args) => <MacToolbar{...args} />;
Terminal.args = {
  label: 'Terminal',
};
