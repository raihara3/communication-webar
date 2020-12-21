import PropTypes from 'prop-types';

const TerminalLink = ({ onClick, label }) => {
    return (
        <a className="underline hover:no-underline" href="" onClick={ onClick }>{ label }</a>
    );
};

TerminalLink.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
};

TerminalLink.defaults = {
    onClick: undefined,
};

export default TerminalLink;
