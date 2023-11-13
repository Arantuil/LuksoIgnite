const FormField = ({
    labelName,
    placeholder,
    inputType,
    isTextArea,
    value,
    handleChange,
    disabled,
    styles,
    id
}) => {
    return (
        <label className="flex-1 w-full flex flex-col">
            {labelName && (
                <span className="font-medium text-[14px] leading-[22px] text-midGrey mb-2">
                    {labelName}
                </span>
            )}
            {isTextArea ? (
                <textarea
                    disabled={disabled}
                    required
                    value={value}
                    onChange={handleChange}
                    rows={15}
                    placeholder={placeholder}
                    className={`${styles} min-h-[55px] py-4 sm:px-6 px-4 outline-none border-[1px] border-midGrey bg-transparent text-[14px] placeholder:text-[#75787e] rounded-lg sm:min-w-[300px]`}
                />
            ) : (
                <input
                    id={id}
                    disabled={disabled}
                    required
                    value={value}
                    onChange={handleChange}
                    type={inputType}
                    step="0.1"
                    placeholder={placeholder}
                    className={`${styles} py-4 sm:px-6 px-4 outline-none border-[1px] border-midGrey bg-transparent text-[14px] placeholder:text-[#75787e] rounded-lg sm:min-w-[300px]`}
                />
            )}
        </label>
    );
};

export default FormField;
