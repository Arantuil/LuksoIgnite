import { loader } from "../assets";

const Loader = () => {
    return (
        <div className="fixed inset-0 z-10 h-screen bg-[rgba(0,0,0,0.7)] flex items-center justify-center flex-col">
            <img
                src={loader}
                alt="loader"
                className="w-[120px] h-[120px] object-contain"
            />
            <p className="mt-[20px] font-bold text-[20px] text-center text-white">
                {" "}
                Transaction in Progress, please Wait...
            </p>
        </div>
    );
};

export default Loader;
