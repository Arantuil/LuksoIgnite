const CustomButton = ({ disabled, btnType, title, handleClick, styles }) => {
    return (
        disabled === true || disabled === 'true' ? (
            <button
                disabled={disabled}
                type={btnType}
                className={`${styles} font-semibold text-[14px] text-white px-4 rounded-xl`}
                onClick={handleClick}
            >
                {title}
            </button>
        ) : (
            <button
                type={btnType}
                className={`${styles} font-semibold text-[14px] text-white px-4 rounded-xl`}
                onClick={handleClick}
            >
                {title}
            </button>
        )
    );
};

export default CustomButton;
