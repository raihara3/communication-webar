import TerminalLink from "./TerminalLink";

export default {
  title: 'TerminalLink',
};

export const Sample = (args) => <TerminalLink{ ...args } />;
Sample.args = {
  label: 'Sample',
};
