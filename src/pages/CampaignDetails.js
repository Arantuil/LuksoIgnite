import { calculateBarPercentage, hoursLeft, daysLeft, minutesLeft } from "../utils";
import CustomButton from "../components/CustomButton";
import { useState, useEffect, useRef, useCallback } from 'react';
import ReactCanvasConfetti from 'react-canvas-confetti';
import { useParams } from 'react-router-dom';
import AccountIcon from '../components/AccountIcon';
import { useSelector, useDispatch } from 'react-redux';
import { connect } from '../redux/blockchain/blockchainActions';
import { weiToEther } from '../utils/index';
import Loader from "../components/Loader";

import { db } from '../firebase';
import { onValue, ref } from 'firebase/database';

const CampaignDetails = () => {
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

    // -----------------------

    const { id } = useParams();

    const currentTimestamp = Number((Date.now()/1000).toFixed(0));

    const [sortedCampaigns, setSortedCampaigns] = useState([])
    useEffect(() => {
        onValue(ref(db), snapshot => {
            const data = snapshot.val();
            if (data) {
                const campaignsArray = Object.values(data);
                const targetCampaign = campaignsArray.find(campaign => campaign.campaignId === parseInt(id));
                setSortedCampaigns(targetCampaign);
            }
        });
    }, [id]);

    const [contributorEntries, setContributorEntries] = useState([]);
    useEffect(() => {
        try {
            const contributionsData = sortedCampaigns.contributions

            const aggregatedContributions = {};

            for (const key in contributionsData) {
                const contribution = contributionsData[key];
                const contributor = contribution.contributor;
                const amount = contribution.contribution;

                if (aggregatedContributions[contributor]) {
                    aggregatedContributions[contributor] += amount;
                } else {
                    aggregatedContributions[contributor] = amount;
                }
            }

            let sortedFunderEntries = Object.entries(aggregatedContributions).sort((a, b) => b[1] - a[1]);
            setContributorEntries(sortedFunderEntries);
        } catch (error) {
            console.error("Error:", error);
        }

    }, [sortedCampaigns]);

    const [fundButtonOn, setFundButtonOn] = useState(false);
    const [amount, setAmount] = useState(0);
    function setNewAmount() {
        let newAmountToSet = document.getElementById('currentFundAmount').value
        setAmount(newAmountToSet);
    }

    useEffect(() => {
        if (amount > 0) {
            setFundButtonOn(true)
        }
    }, [amount])

    const canvasStyles = {
        position: 'absolute',
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
        top: '0%',
        left: '0%'
    }

    const refAnimationInstance = useRef(null);

    const getInstance = useCallback((instance) => {
        refAnimationInstance.current = instance;
    }, []);

    const makeShot = useCallback((particleRatio, opts) => {
        refAnimationInstance.current &&
            refAnimationInstance.current({
                ...opts,
                origin: { y: 0.7 },
                particleCount: Math.floor(200 * particleRatio)
            });
    }, []);

    const fire = useCallback(() => {
        makeShot(0.1, {
            spread: 35,
            startVelocity: 25,
            decay: 0.94,
            scalar: 1.0
        });
        makeShot(0.13, {
            spread: 45,
            startVelocity: 45,
            decay: 0.93,
            scalar: 1.0
        });
        makeShot(0.15, {
            spread: 55,
            startVelocity: 35,
            decay: 0.95,
            scalar: 1.0
        });
    }, [makeShot]);

    const truncateAddress = (address, charsToShow) => {
        if (!address) return '';
        const prefix = address.substring(0, charsToShow);
        const suffix = address.substring(address.length - charsToShow);
        return `${prefix}...${suffix}`;
    };

    const [showingAllEntries, setShowingAllEntries] = useState(false);
    const [contributionInProcess, setContributionInProcess] = useState(false);

    const [userContributionTotal, setUserContributionTotal] = useState(0);
    function getUserContributionTotal() {
        if (userContributionTotal === 0) {
            for (let i = 0; i < contributorEntries.length; i++) {
                try {
                    if ((contributorEntries[i][0]).toLowerCase() === (blockchain.account).toLowerCase()) {
                        setUserContributionTotal(userContributionTotal+contributorEntries[i][1])
                    }
                } catch {continue}
            }
        }
    }
    useEffect(() => {
        getUserContributionTotal();
    }, [contributorEntries, blockchain.account]);

    const [isloading, setIsLoading] = useState(false);
    const handleDonate = () => {
        setContributionInProcess(true);
        setIsLoading(true)
        blockchain.smartContract.methods
            .contributeToCampaign(
                id
            )
            .send({
                gasPrice: 100000000,
                to: CONFIG.CONTRACT_ADDRESS,
                from: blockchain.account,
                value: amount * 1e18,
            })
            .then((receipt) => {
                setUserContributionTotal(0);
                getUserContributionTotal();
                console.log(receipt)
                setContributionInProcess(false);
                setTimeout(fire, 1000);
                setIsLoading(false)
            })
            .catch((error) => {
                console.error(error);
                setContributionInProcess(false);
                setIsLoading(false)
            });
    };

    const [takingBackContributionInProcess, setTakingBackContributionInProcess] = useState(false);
    function userTakeBackContributions() {
        setTakingBackContributionInProcess(true);
        setIsLoading(true)
        blockchain.smartContract.methods
            .takeBackContribution(
                id
            )
            .send({
                gasPrice: 100000000,
                to: CONFIG.CONTRACT_ADDRESS,
                from: blockchain.account,
                value: 0,
            })
            .then((receipt) => {
                setUserContributionTotal(0);
                getUserContributionTotal();
                console.log(receipt)
                setTakingBackContributionInProcess(false);
                setIsLoading(false)
            })
            .catch((error) => {
                console.error(error);
                setTakingBackContributionInProcess(false);
                setIsLoading(false)
            });
    }

    const [returnContributionsInProcess, setReturnContributionsInProcess] = useState(false);
    function handleReturnContributions() {
        setReturnContributionsInProcess(true);
        setIsLoading(true)
        blockchain.smartContract.methods
            .refundAllContributions(
                id
            )
            .send({
                gasPrice: 100000000,
                to: CONFIG.CONTRACT_ADDRESS,
                from: blockchain.account,
                value: 0,
            })
            .then((receipt) => {
                console.log(receipt)
                setReturnContributionsInProcess(false);
                setIsLoading(false)
            })
            .catch((error) => {
                console.error(error);
                setReturnContributionsInProcess(false);
                setIsLoading(false)
            });
    }

    const [campaignDescription, setCampaignDescription] = useState([]);
    useEffect(() => {
        if (sortedCampaigns.length !== 0) {
            let descriptionLines = sortedCampaigns.description.split('.').map(line => line + '.')
            descriptionLines.pop()
            setCampaignDescription(descriptionLines)
        }
    }, [sortedCampaigns])

    return (
        <div className="p-2 sm:p-4 md:p-6 lg:p-8 lg:px-20
        xs:ml-[10px] ml-[16px] sm:ml-[20px] 3xs:w-[calc(100%-50px-10px)] 2xs:w-[calc(100%-60px-10px)] xs:w-[calc(100%-70px-10px)] w-[calc(100%-80px-16px)] sm:w-[calc(100%-80px-20px)] 
        bg-offBlack rounded-xl 3xs:mt-[calc(16px+32px)] 2xs:mt-[calc(16px+40px)] xs:mt-[calc(16px+50px)] mt-[calc(16px+60px)] flex justify-center content-start flex-row flex-wrap">
            {isloading && <Loader />}
            {sortedCampaigns.length !== 0 ? (
                <div className='xl:px-auto xl:max-w-[900px]'>
                    <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
                        <div className="flex-1 flex-col">
                            <img
                                src={sortedCampaigns.image}
                                alt="campaign"
                                className="4xs:h-[150px] 3xs:h-[200px] 2xs:h-[250px] xs:h-[300px] h-[350px] sm:h-[400px] w-full object-cover rounded-xl"
                            />
                            {sortedCampaigns.amountContributed !== undefined ? (
                            <div className="rounded relative w-full h-[9px] bg-[#3a3a43] mt-2">
                                <div
                                    className="rounded absolute h-full bg-[#4acd8d]"
                                    style={{
                                        width: `${calculateBarPercentage(
                                            parseFloat(weiToEther(String(sortedCampaigns.target))),
                                            parseFloat(weiToEther(String(sortedCampaigns.amountContributed)))
                                        )}%`,
                                        maxWidth: "100%",
                                    }}
                                ></div>
                            </div>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>

                    <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
                        <div className="flex-[2] flex flex-col gap-[40px]">
                            <div>
                                <h4 className="font-semibold text-[18px] text-secondary uppercase">
                                    Creator
                                </h4>
                                <div className="mt-[10px] flex flex-row items-center flex-wrap gap-[14px]">
                                    <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full">
                                        <AccountIcon size={32} address={sortedCampaigns.owner} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-[14px] text-secondary break-all">
                                            {sortedCampaigns.username}<span className='text-[#808191]'> - {truncateAddress(sortedCampaigns.owner, 5)}</span>
                                        </h4>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="font-semibold text-[18px] text-secondary uppercase">
                                    Title
                                </h2>
                                <div className="mt-[10px]">
                                    <p className="font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                                        {sortedCampaigns.title}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-[18px] text-secondary uppercase">
                                    Description
                                </h4>

                                <div className="mt-[10px] ">
                                    <p className="font-normal flex flex-col text-justify">
                                        {campaignDescription.map((line, index) => (
                                            line[0] === '#' || line[1] === '#' || line[2] === '#' ? (
                                            <p key={index} className="mt-2 font-bold text-[18px] text-midGrey leading-[32px] text-justify">
                                                {line}
                                            </p>
                                            ) : (
                                            <p key={index} className="font-normal text-[16px] text-[#808191] leading-[24px] text-justify">
                                                {line}
                                            </p>
                                            )
                                        ))}
                                    </p>
                                </div>
                            </div>

                            {blockchain.account !== null && blockchain.account !== '' ? (
                            <div>
                                {sortedCampaigns.amountContributed !== undefined && parseFloat(weiToEther(String(sortedCampaigns.amountContributed))) < parseFloat(weiToEther(String(sortedCampaigns.target))) && sortedCampaigns.campaignAmountWithdrawn === false ? (
                                <h4 className="font-semibold text-[18px] text-secondary uppercase">
                                    Your total contribution (returned)
                                </h4>
                                ) : (
                                <h4 className="font-semibold text-[18px] text-secondary uppercase">
                                    Your total contribution
                                </h4>
                                )}

                                <div className="mt-[10px]">
                                    <p className="font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                                        {userContributionTotal === 0 ? 0: Math.round(userContributionTotal / 1e18 * 1000) / 1000} LYX ({Math.round(((weiToEther(String(userContributionTotal))/weiToEther(String(sortedCampaigns.target)))*100)* 100) / 100}% of the target)
                                    </p>
                                </div>

                                <CustomButton
                                        btnType="button"
                                        title='Take back contribution'
                                        disabled={`${takingBackContributionInProcess || currentTimestamp > sortedCampaigns.deadline ? true : false}`}
                                        styles={`${takingBackContributionInProcess || currentTimestamp > sortedCampaigns.deadline ? "grayscale cursor-default" : "hover:brightness-110"} bg-primary mt-[8px] w-auto h-[40px]`}
                                        handleClick={userTakeBackContributions}
                                    />
                            </div>
                            ) : (
                                <></>
                            )}

                            <div>
                                {showingAllEntries === false && contributorEntries.length > 0 ? (
                                    <h4 className="font-semibold text-[18px] text-secondary">
                                        <span className='uppercase'>Contributors </span><span className='font-normal text-[16px] text-[#808191]'>(only showing top 3 contributors)</span>
                                    </h4>
                                ) : (
                                    <h4 className="font-semibold text-[18px] text-secondary uppercase">
                                        Contributors
                                    </h4>
                                )}
                                <div className="mt-[10px] sm:mt-[15px] md:mt-[20px] flex flex-col gap-4">
                                    {contributorEntries.length > 0 && contributorEntries.length !== 0 ? (
                                        showingAllEntries === false ? (
                                            contributorEntries.slice(0, 3).map((funder) => (
                                                <div className="flex justify-between items-center gap-4">
                                                    <AccountIcon size={22} address={funder[0]} />
                                                    <a target='_blank' rel='noreferrer' href={`https://explorer.energyweb.org/address/${funder[0]}`} className="block md:hidden hover:text-primary font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-all">
                                                        {truncateAddress(funder[0], 5)}
                                                    </a>
                                                    <a target='_blank' rel='noreferrer' href={`https://explorer.energyweb.org/address/${funder[0]}`} className="hidden md:block xl:hidden hover:text-primary font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-all">
                                                        {truncateAddress(funder[0], 10)}
                                                    </a>
                                                    <a target='_blank' rel='noreferrer' href={`https://explorer.energyweb.org/address/${funder[0]}`} className="hidden xl:block hover:text-primary font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-all">
                                                        {funder[0]}
                                                    </a>
                                                    <p className="font-normal text-[16px] text-[#808191] leading-[26px] break-all">
                                                        {funder[1] / 1e18} LYX
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            contributorEntries.map((funder) => (
                                                <div className="flex justify-between items-center gap-4">
                                                    <AccountIcon size={22} address={funder[0]} />
                                                    <a target='_blank' rel='noreferrer' href={`https://explorer.energyweb.org/address/${funder[0]}`} className="block md:hidden hover:text-primary font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-all">
                                                        {truncateAddress(funder[0], 5)}
                                                    </a>
                                                    <a target='_blank' rel='noreferrer' href={`https://explorer.energyweb.org/address/${funder[0]}`} className="hidden md:block xl:hidden hover:text-primary font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-all">
                                                        {truncateAddress(funder[0], 10)}
                                                    </a>
                                                    <a target='_blank' rel='noreferrer' href={`https://explorer.energyweb.org/address/${funder[0]}`} className="hidden xl:block hover:text-primary font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-all">
                                                        {funder[0]}
                                                    </a>
                                                    <p className="font-normal text-[16px] text-[#808191] leading-[26px] break-all">
                                                        {funder[1] / 1e18} LYX
                                                    </p>
                                                </div>
                                            ))
                                        )
                                    ) : (
                                        <p className="font-normal text-[16px] text-[#808191] leading-[26px] text-justify">
                                            No contributors yet. Be the first one
                                        </p>
                                    )}

                                    {showingAllEntries === false ? (
                                        <button
                                            className="text-primary hover:text-secondary cursor-pointer font-normal text-[16px] leading-[26px]"
                                            onClick={() => setShowingAllEntries(true)}
                                        >
                                            Show all contributors
                                        </button>
                                    ) : (<></>)}

                                    {showingAllEntries === true ? (
                                        <button
                                            className="text-primary hover:text-secondary cursor-pointer font-normal text-[16px] leading-[26px]"
                                            onClick={() => setShowingAllEntries(false)}
                                        >
                                            Show less contributors
                                        </button>
                                    ) : (<></>)}
                                </div>
                            </div>

                        </div>
                        <div className="flex-1">
                            <div className="flex flex-col p-4 bg-offBlack rounded-[10px]">
                                <div className="w-[95%] mx-auto">
                                    <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
                                    <div className="relative">
                                        {sortedCampaigns.status === false && parseFloat(weiToEther(String(sortedCampaigns.amountContributed))) > parseFloat(weiToEther(String(sortedCampaigns.target))) ? (
                                            <div className="absolute rounded-xl top-[-7.5%] left-[-7.5%] w-[115%] h-[115%] z-1 bg-[rgba(250,204,21,0.15)]">
                                                <p className="font-medium absolute p-2 rounded-xl bg-[rgba(0,0,0,0.5)] text-secondary top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">Campaign paused</p>
                                            </div>
                                        ) : (
                                            currentTimestamp > sortedCampaigns.deadline ? (
                                                parseFloat(weiToEther(String(sortedCampaigns.amountContributed))) < parseFloat(weiToEther(String(sortedCampaigns.target))) && sortedCampaigns.campaignAmountWithdrawn === false ? (
                                                    <div className="absolute rounded-xl top-[-7.5%] left-[-7.5%] w-[115%] h-[115%] z-1 bg-[rgba(140,109,253,0.15)]">
                                                        <CustomButton
                                                        btnType="button"
                                                        disabled={returnContributionsInProcess}
                                                        title={`${returnContributionsInProcess ? "Returning contributions..." : "Return contributions"}`}
                                                        styles={`${returnContributionsInProcess ? "bg-[rgba(74,205,141,0.5)]" : "bg-[#4ACD8D]"} font-medium absolute p-2 rounded-xl text-secondary top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap`}
                                                        handleClick={handleReturnContributions}
                                                    />
                                                    </div>
                                                ) : (
                                                    sortedCampaigns.amountContributed !== undefined &&
                                                    parseFloat(weiToEther(String(sortedCampaigns.amountContributed))) < parseFloat(weiToEther(String(sortedCampaigns.target))) && sortedCampaigns.campaignAmountWithdrawn === true ? (
                                                        <div className="absolute rounded-xl top-[-7.5%] left-[-7.5%] w-[115%] h-[115%] z-1 bg-[rgba(140,109,253,0.15)]">
                                                            <p className="text-center font-medium absolute p-2 rounded-xl bg-[rgba(0,0,0,0.5)] text-secondary top-[25%] left-[25%] transform -translate-x-[15%] -translate-y-[0%] whitespace-break-spaces">Campaign ended, all contributions have been returned</p>
                                                        </div>
                                                    ) : (
                                                        <div className="absolute rounded-xl top-[-7.5%] left-[-7.5%] w-[115%] h-[115%] z-1 bg-[rgba(140,109,253,0.15)]">
                                                            <p className="font-medium absolute p-2 rounded-xl bg-[rgba(0,0,0,0.5)] text-secondary top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">Campaign ended</p>
                                                        </div>
                                                    )
                                                )
                                            ) : (
                                                <></>
                                            )
                                        )}
                                        <div>
                                            {sortedCampaigns.amountContributed !== '0' && sortedCampaigns.amountContributed !== undefined ? (
                                                <div className='bg-offBlackDarker mb-[10px] rounded-lg p-1 md:p-2'>
                                                    <p className='text-secondary text-[14px] text-center'>{Math.round(weiToEther(String(sortedCampaigns.amountContributed)) * 1000) / 1000} LYX <span className='font-normal text-[#808191]'>Out of</span> {weiToEther(String(sortedCampaigns.target))} LYX <span className='font-normal text-[#808191]'>collected (</span>{(weiToEther(String(sortedCampaigns.amountContributed)) / weiToEther(String(sortedCampaigns.target)) * 100).toFixed(2)}%<span className='font-normal text-[#808191]'>)</span></p>
                                                </div>
                                            ) : (
                                                <div className='bg-offBlackDarker mb-[10px] rounded-lg p-1 md:p-2'>
                                                    <p className='text-secondary text-[14px] text-center'>{Math.round(0 / 1e18 * 100) / 100} LYX <span className='font-normal text-[#808191]'>Out of</span> {weiToEther(String(sortedCampaigns.target))} LYX <span className='font-normal text-[#808191]'>collected (</span>0%<span className='font-normal text-[#808191]'>)</span></p>
                                                </div>
                                            )}
                                            <input
                                                id='currentFundAmount'
                                                type="number"
                                                placeholder="1 LYX"
                                                step="0.1"
                                                className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[2px] border-midGrey bg-transparent text-secondary text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                                                onChange={setNewAmount}
                                            />
                                            {fundButtonOn === true ? (
                                                blockchain.account !== null && blockchain.account !== "" ? (
                                                    sortedCampaigns.status === true ? (
                                                    <CustomButton
                                                        btnType="button"
                                                        disabled={contributionInProcess}
                                                        title={`${contributionInProcess ? "Funding Campaign..." : "Fund Campaign"}`}
                                                        styles={`${contributionInProcess ? "bg-midGrey" : "bg-primary"} w-full h-[60px] mt-[20px]`}
                                                        handleClick={handleDonate}
                                                    />
                                                    ) : (
                                                        <CustomButton
                                                        btnType="button"
                                                        disabled={true}
                                                        title={'Campaign paused'}
                                                        styles='bg-midGrey w-full h-[60px] mt-[20px]'
                                                    />
                                                    )
                                                ) : (
                                                    <CustomButton
                                                        btnType="button"
                                                        title="Connect"
                                                        styles="w-full bg-[#8C6DFD] h-[60px] mt-[20px]"
                                                        handleClick={() => {
                                                            dispatch(connect());
                                                        }}
                                                    />
                                                )
                                            ) : (
                                                <CustomButton
                                                    disabled={true}
                                                    btnType="button"
                                                    title="Fund Campaign"
                                                    styles="w-full bg-[#678191] h-[60px] mt-[20px]"
                                                    handleClick={handleDonate}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-[40px] p-4 bg-offBlackDarker rounded-[10px]">
                                        <div className="flex flex-row justify-around">
                                            <div className="flex flex-col mr-2">
                                                <h4 className="font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
                                                    {daysLeft(sortedCampaigns.deadline)}
                                                </h4>
                                                <p className="mt-[3px] font-normal text-[12px] leading-[20px] text-[#808191] sm:max-w-[120px] truncate">
                                                    Days
                                                </p>
                                            </div>
                                            <div className="flex flex-col mx-2">
                                                <h4 className="font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
                                                    {hoursLeft(sortedCampaigns.deadline)}
                                                </h4>
                                                <p className="mt-[3px] font-normal text-[12px] leading-[20px] text-[#808191] sm:max-w-[120px] truncate">
                                                    Hours
                                                </p>
                                            </div>
                                            <div className="flex flex-col ml-2">
                                                <h4 className="font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
                                                    {minutesLeft(sortedCampaigns.deadline)}
                                                </h4>
                                                <p className="mt-[3px] font-normal text-[12px] leading-[20px] text-[#808191] sm:max-w-[120px] truncate">
                                                    Minutes
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="my-[20px] p-4 bg-offBlackDarker rounded-[10px]">
                                        <h4 className="font-semibold text-[14px] leading-[22px] text-secondary">
                                            Back it just because you believe in it.
                                        </h4>
                                        <p className="mt-[10px] font-normal leading-[22px] text-[#808191]">
                                            Support the project for no reward, unless the campaign specifically says there will be a reward for all the contributors if the target gets reached.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}

        </div>
    );
};

export default CampaignDetails;
