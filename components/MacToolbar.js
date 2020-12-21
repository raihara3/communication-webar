import PropTypes from 'prop-types';

const MacToolbar = ({ label }) => {
    return (
        <div className="flex h-6 text-black bg-gray-100 rounded-t text-center items-center">
            <div className="w-3 h-3 ml-1 bg-red-500 rounded-full" />
            <div className="w-3 h-3 ml-2 bg-yellow-500 rounded-full" />
            <div className="w-3 h-3 ml-2 bg-green-500 rounded-full" />
            <div className="mx-auto pr-14">
                <p className="text-sm text-center">{label}</p>
            </div>
        </div>
    );
};

MacToolbar.propTypes = {
    label: PropTypes.string.isRequired,
};

export default MacToolbar;
