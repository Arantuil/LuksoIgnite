import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { money } from "../assets";
import CustomButton from "../components/CustomButton";
import FormField from "../components/FormField";
import Loader from "../components/Loader";
import { weiToEther, etherToWei } from '../utils/index';

import { connect } from '../redux/blockchain/blockchainActions';
import { useSelector, useDispatch } from 'react-redux';

import { db } from '../firebase';
import { onValue, ref } from 'firebase/database';

const EditCampaign = () => {
    const { id } = useParams();

    const blockchain = useSelector((state) => state.blockchain);
    const dispatch = useDispatch();

    const [CONFIG, SET_CONFIG] = useState({
        CONTRACT_ADDRESS: "",
        NETWORK: {
            NAME: "",
            SYMBOL: "",
            ID: null
        },
        GAS_LIMIT: null
    });

    const getConfig = async () => {
        const configResponse = await fetch('/config/config.json', {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
        const config = await configResponse.json();
        SET_CONFIG(config);
    };

    useEffect(() => {
        getConfig();
    }, []);

    // ------------------------------------------------

    const [currentCampaign, setCurrentCampaign] = useState([])
    useEffect(() => {
        onValue(ref(db), snapshot => {
            const data = snapshot.val();
            setCurrentCampaign(data[id])
        });
    }, [id]);

    const [form, setForm] = useState({
        name: "",
        title: "",
        description: "",
        target: "",
        deadline: "",
        image: "",
    });

    useEffect(() => {
        setForm({
            name: currentCampaign.username,
            title: currentCampaign.title,
            description: currentCampaign.description,
            target: currentCampaign.target,
            deadline: currentCampaign.deadline,
            image: currentCampaign.image,
        });
    }, [currentCampaign]);

    // ------------------------------------------------------------

    function unixTimestampToDate(timestamp) { const date = new Date(timestamp*1000); const year = date.getUTCFullYear(); const month = String(date.getUTCMonth() + 1).padStart(2, '0'); const day = String(date.getUTCDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function unixTimestampToTime(timestamp) { 
        const date = new Date(timestamp * 1000);
        const hours = String(date.getUTCHours()).padStart(2, '0');
        return hours;
    };

    const [datePart, setDatePart] = useState('');
    const [timePart, setTimePart] = useState('');
    useEffect(() => {
        setDatePart(unixTimestampToDate(currentCampaign.deadline));
        setTimePart(unixTimestampToTime(currentCampaign.deadline));
    }, [currentCampaign]);

    const [isLoading, setIsloading] = useState(false);

    const handleFormFieldChange = (fieldName, e) => {
        if (fieldName === 'target' && parseFloat(e.target.value) > 0) {
            setForm({ ...form, [fieldName]: etherToWei(String(e.target.value)) });
        } 
        else if (fieldName === 'target' && parseFloat(e.target.value) === 0 ) {
            return null
        } 
        else {
            setForm({ ...form, [fieldName]: e.target.value });
        }
    };

    function dateAndTimeToUnixTimestamp(dateStr, hourStr) {
        const combinedDateTimeStr = dateStr + 'T' + hourStr + ':00:00';
        const unixTimestamp = new Date(combinedDateTimeStr).getTime() / 1000;
        return unixTimestamp;
    }

    useEffect(() => {
        if (form.name !== '' && form.title !== undefined) {
            setForm({ ...form, ['deadline']: dateAndTimeToUnixTimestamp(datePart,timePart) });
        }
    }, [datePart, timePart])

    const handleDateChange = (e) => { setDatePart(e.target.value) };
    const handleTimeChange = (e) => { setTimePart(e.target.value) };

    console.log(form)

    const submitEditedCampaign = (e) => {
        console.log(form)
        e.preventDefault();
        setIsloading(true);

        blockchain.smartContract.methods
            .editCampaign(
                id,
                form.title,
                form.description,
                String(form.target),
                form.deadline,
                form.image
            )
            .send({
                gasPrice: 100000000,
                to: CONFIG.CONTRACT_ADDRESS,
                from: blockchain.account,
                value: 0,
            })
            .then((receipt) => {
                console.log(receipt)
                setTimeout(function() {
                    setIsloading(false);
                }, 1000);
            })
            .catch((error) => {
                console.error(error);
                setTimeout(function() {
                    setIsloading(false);
                }, 1000);
            });
    };

    return (
        blockchain.account === "" || blockchain.account === null ? (
        <div className="p-2 sm:p-4 md:p-6 lg:p-8 lg:px-20 xl:px-44 2xl:px-72 
        xs:ml-[10px] ml-[16px] sm:ml-[20px] 3xs:w-[calc(100%-50px-10px)] 2xs:w-[calc(100%-60px-10px)] xs:w-[calc(100%-70px-10px)] w-[calc(100%-80px-16px)] sm:w-[calc(100%-80px-20px)] 
        bg-offBlack rounded-xl 3xs:mt-[calc(16px+32px)] 2xs:mt-[calc(16px+40px)] xs:mt-[calc(16px+50px)] mt-[calc(16px+60px)] flex justify-center content-start flex-row flex-wrap">
            <div className='flex flex-col'>
                <div className="mb-4 sm:mb-8 md:mb-12 mt-6 sm:mt-8 p-4 bg-offBlackDarker rounded-[10px]">
                    <h1 className="font-semibold text-[18px] sm:text-[22px] leading-[38px] text-secondary">
                        To start a crowdfunding campaign you first have to connect
                    </h1>
                </div>
                <CustomButton
                    btnType="button"
                    title="Connect"
                    styles="text-lg sm:text-xl md:text-2xl flex justify-center items-center p-[16px] sm:min-w-[380px] bg-primary rounded-[10px] animate-pulseSlow hover:brightness-110 bg-primary xs:mr-1 mr-2 sm:mr-4"
                    handleClick={() => {
                        dispatch(connect());
                    }}
                />
            </div>
        </div>
        ) : (
        <div className="p-2 sm:p-4 md:p-6 lg:p-8 lg:px-20 xl:px-44 2xl:px-72 
        xs:ml-[10px] ml-[16px] sm:ml-[20px] 3xs:w-[calc(100%-50px-10px)] 2xs:w-[calc(100%-60px-10px)] xs:w-[calc(100%-70px-10px)] w-[calc(100%-80px-16px)] sm:w-[calc(100%-80px-20px)] 
        bg-offBlack rounded-xl 3xs:mt-[calc(16px+32px)] 2xs:mt-[calc(16px+40px)] xs:mt-[calc(16px+50px)] mt-[calc(16px+60px)] flex justify-center content-start flex-row flex-wrap">
            {isLoading && <Loader />}
            <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-primary rounded-[10px]">
                <h1 className="font-bold text-[18px] sm:text-[22px] leading-[38px] text-secondary">
                    Edit your crowdfunding campaign
                </h1>
            </div>
            <form
                className="w-full mt-[65px] flex flex-col gap-[30px]"
            >
                <div className="flex flex-wrap gap-[40px]">
                    <FormField
                        disabled={true}
                        labelName="Your universal profile name *"
                        placeholder="Username"
                        inputType="text"
                        value={form.name}
                        handleChange={(e) => handleFormFieldChange("name", e)}
                        styles={'text-secondary'}
                    />
                    <FormField
                        disabled={false}
                        labelName="Campaign Title *"
                        placeholder="Write a title"
                        inputType="text"
                        value={form.title}
                        handleChange={(e) => handleFormFieldChange("title", e)}
                        styles={'text-secondary'}
                    />
                </div>
                <FormField
                    disabled={false}
                    labelName="Description *"
                    placeholder="write your campaign's description"
                    isTextArea
                    value={form.description}
                    handleChange={(e) => handleFormFieldChange("description", e)}
                    styles={'text-secondary'}
                />

                <div className="w-full flex justify-center items-center p-4 bg-primary h-[100px] rounded-[10px]">
                    <img
                        src={money}
                        alt="money"
                        className="w-[40px] h-[40px] object-contain"
                    />
                    <h4 className="font-bold text-[18px] sm:text-[22px] text-secondary ml-[20px]">
                        You will get 95% of the final raised amount
                    </h4>
                </div>
                <div className="flex flex-wrap gap-[40px]">
                    {form.target !== undefined ? (
                    <FormField
                        disabled={false}
                        labelName="Goal (in LYX) *"
                        placeholder="100"
                        inputType="text"
                        value={weiToEther(String(form.target))}
                        handleChange={(e) => handleFormFieldChange("target", e)}
                        styles={'text-secondary'}
                    />
                    ) : (
                        <></>
                    )}
                    <div className="flex flex-wrap gap-[40px]">
                            <FormField
                                disabled={false}
                                labelName="End Date *"
                                placeholder="End Date"
                                inputType="date"
                                value={datePart}
                                handleChange={(e) => handleDateChange(e)}
                                styles={'text-secondary'}
                                id='dateValue'
                            />
                            <FormField
                                disabled={false}
                                labelName="End Hour *"
                                placeholder="0"
                                inputType="text"
                                value={timePart}
                                handleChange={handleTimeChange}
                                styles={'text-secondary'}
                            />
                    </div>
                </div>
                <FormField
                    disabled={false}
                    labelName="Campaign image *"
                    placeholder="Place image URL of your campaign"
                    inputType="url"
                    value={form.image}
                    handleChange={(e) => handleFormFieldChange("image", e)}
                    styles={'text-secondary'}
                />
                <p className='text-secondary text-[12px]'>For best image compatibility: use a horizontal rectangle image where the main content is mostly in the middle of the image, also make sure the image url is a direct url to the image.</p>
                <div className="flex justify-center items-center mt-[30px]">
                    <CustomButton
                        btnType="submit"
                        title={`${isLoading ? 'Submitting edited campaign...' : 'Submit edited campaign'}`}
                        styles={`${isLoading ? 'grayscale bg-primary h-[50px]' : 'bg-primary h-[50px]'}`}
                        handleClick={submitEditedCampaign}
                    />
                </div>
            </form>
        </div>
        )
    );
};

export default EditCampaign;
