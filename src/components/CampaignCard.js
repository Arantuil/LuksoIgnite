import { calculateBarPercentage, hoursLeft, daysLeft, minutesLeft } from "../utils";
import { weiToEther } from '../utils/index';
import { profile } from '../assets'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SimpleSwitch from './SimpleSwitch';
import { useState, useEffect } from 'react';

const CampaignCard = ({ id, styles, title, image, owner, username, description, target, amountContributed, deadline, isProfilePage, status, campaignAmountWithdrawn  }) => {
    const navigate = useNavigate();
    const blockchain = useSelector((state) => state.blockchain);

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

    const currentTimestamp = Number((Date.now()/1000).toFixed(0));

    const [withdrawing, setWithdrawing] = useState(false)
    const withdrawFundsFromCampaign = () => {
        setWithdrawing(true);
        blockchain.smartContract.methods
            .withdrawContributions(
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
                setWithdrawing(false);
            })
            .catch((error) => {
                console.error(error);
                setWithdrawing(false);
            });
    };

    function editCampaign(idOfCampaign) {
        navigate('/edit-campaign/' + String(idOfCampaign))
    }

    return (
        isProfilePage === true ? (
            <div className="max-w-[95%] w-full sm:w-[300px] m-2 sm:m-4 rounded-xl bg-offBlackDarker">
                {deadline > currentTimestamp && status === true ? (
                    <div>
                        <div className='absolute ml-2 mt-2 rounded-full w-4 h-4 4xs:w-3 4xs:h-3 bg-green-300'>
                        </div>
                    </div>
                ) : (
                    status === false ? (
                        <div>
                            <div className='absolute ml-2 mt-2 rounded-full w-4 h-4 4xs:w-3 4xs:h-3 bg-yellow-300'>
                            </div>
                        </div>
                    ) : (
                    <div>
                        <div className='absolute ml-2 mt-2 rounded-full w-4 h-4 4xs:w-3 4xs:h-3 bg-red-300'>
                        </div>
                    </div>
                    )
                )}
                <img
                    src={image}
                    alt="fund"
                    className="cursor-pointer w-full h-[180px] object-cover rounded-xl"
                    onClick={() => { navigate('/campaigns/' + String(id)) }}

                />
                {target !== undefined && amountContributed !== undefined ? (
                <div className='translate-y-[-2px] relative rounded h-[5px] w-full bg-offBlackDarker'>
                    <div style={{
                        width: `${calculateBarPercentage(
                            parseFloat(weiToEther(String(target))),
                            parseFloat(weiToEther(String(amountContributed)))
                        )}%`,
                        maxWidth: "100%",
                    }}
                        className='absolute h-full rounded bg-[#1DC071]'></div>
                </div>
                ) : (
                    <></>
                )}

                <div className="flex flex-col p-4 4xs:p-3">
                    <div className="block">
                        <h3 className="font-semibold text-[16px] 4xs:text-[15px] text-secondary text-left leading-[26px] truncate">
                            {title}
                        </h3>
                        <p className="text-[16px] 4xs:text-[15px] mt-[5px] font-normal text-[#808191] text-left leading-[20px] truncate">
                            {description}
                        </p>
                    </div>

                    <div className="flex justify-between mt-[15px] gap-2">
                        <div className="flex flex-col">
                            {amountContributed > 0 ? (
                                <h4 className="font-semibold text-[14px] 4xs:text-[13px] text-[#b2b3bd] leading-[22px]">
                                    {Math.round(amountContributed/1e18 * 1000) / 1000} LYX
                                </h4>
                            ) : (
                                <h4 className="font-semibold text-[14px] 4xs:text-[13px] text-[#b2b3bd] leading-[22px]">
                                    0 LYX
                                </h4>
                            )}
                            <p className="mt-[3px] font-normal text-[12px] 4xs:text-[11px] leading-[20px] text-[#808191] sm:max-w-[150px] truncate">
                                Raised out of {weiToEther(String(target))} LYX
                            </p>
                        </div>
                        <div className="3xs:hidden flex flex-row">
                            <div className="flex flex-col mr-2">
                                <h4 className="font-semibold text-[14px] 4xs:text-[13px] text-[#b2b3bd] leading-[22px]">
                                    {daysLeft(deadline)}
                                </h4>
                                <p className="mt-[3px] font-normal text-[12px] 4xs:text-[11px] leading-[20px] text-[#808191] sm:max-w-[120px] truncate">
                                    Days
                                </p>
                            </div>
                            <div className="flex flex-col mx-2">
                                <h4 className="font-semibold text-[14px] 4xs:text-[13px] text-[#b2b3bd] leading-[22px]">
                                    {hoursLeft(deadline)}
                                </h4>
                                <p className="mt-[3px] font-normal text-[12px] 4xs:text-[11px] leading-[20px] text-[#808191] sm:max-w-[120px] truncate">
                                    Hours
                                </p>
                            </div>
                            <div className="flex flex-col ml-2">
                                <h4 className="font-semibold text-[14px] 4xs:text-[13px] text-[#b2b3bd] leading-[22px]">
                                    {minutesLeft(deadline)}
                                </h4>
                                <p className="mt-[3px] font-normal text-[12px] 4xs:text-[11px] leading-[20px] text-[#808191] sm:max-w-[120px] truncate">
                                    Min.
                                </p>
                            </div>
                        </div>
                        <div className="hidden 3xs:flex flex-row">
                            <div className="flex flex-col mr-2 5xs:mr-1">
                                <h4 className="font-semibold text-[14px] 4xs:text-[13px] text-[#b2b3bd] leading-[22px]">
                                    {daysLeft(deadline)}
                                </h4>
                                <p className="mt-[3px] font-normal text-[12px] 4xs:text-[11px] leading-[20px] text-[#808191] sm:max-w-[120px] truncate">
                                    D
                                </p>
                            </div>
                            <div className="flex flex-col mx-2 5xs:ml-1 5xs:mr-0">
                                <h4 className="font-semibold text-[14px] 4xs:text-[13px] text-[#b2b3bd] leading-[22px]">
                                    {hoursLeft(deadline)}
                                </h4>
                                <p className="mt-[3px] font-normal text-[12px] 4xs:text-[11px] leading-[20px] text-[#808191] sm:max-w-[120px] truncate">
                                    H
                                </p>
                            </div>
                            <div className="5xs:hidden flex flex-col ml-2">
                                <h4 className="font-semibold text-[14px] 4xs:text-[13px] text-[#b2b3bd] leading-[22px]">
                                    {minutesLeft(deadline)}
                                </h4>
                                <p className="mt-[3px] font-normal text-[12px] 4xs:text-[11px] leading-[20px] text-[#808191] sm:max-w-[120px] truncate">
                                    M
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-offBlackDarker rounded-lg p-[3px] sm:p-[6px] flex items-center mt-[20px] gap-2 ">
                        <div className="w-full flex flex-col">
                            <h4 className="text-center font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">
                                Options
                            </h4>
                            <div className="my-[5px] flex flex-row w-full">
                                {currentTimestamp > deadline ? (
                                    campaignAmountWithdrawn === true ? (
                                        <button disabled={true} className="cursor-default grayscale bg-[#8C6DFD] p-1 sm:p-2 rounded-md mx-auto w-[85px] 4xs:w-[80px] mt-[3px] font-normal text-[12px] 4xs:text-[11px] leading-[20px] text-secondary">
                                            Withdrawn
                                        </button>
                                    ) : (
                                        amountContributed !== undefined && target !== undefined && parseFloat(weiToEther(String(amountContributed))) > parseFloat(weiToEther(String(target))) ? (
                                        <button onClick={withdrawFundsFromCampaign} className="hover:brightness-110 bg-[#8C6DFD] p-[2px] sm:p-1 rounded-md mx-auto w-[85px] 4xs:w-[80px] mt-[3px] font-normal text-[12px] 4xs:text-[11px] leading-[20px] text-secondary">
                                            Withdraw
                                        </button>
                                        ) : (
                                        <button onClick={withdrawFundsFromCampaign} disabled={true} className="cursor-default grayscale bg-[#8C6DFD] p-[2px] sm:p-1 rounded-md mx-auto w-[85px] 4xs:w-[80px] mt-[3px] font-normal text-[12px] 4xs:text-[11px] leading-[20px] text-secondary">
                                            Withdraw
                                        </button>
                                        )
                                    )
                                ) : (
                                    withdrawing === true ? (
                                        <button className="cursor-default grayscale bg-[#8C6DFD] p-1 sm:p-2 rounded-md mx-auto w-[85px] 4xs:w-[80px] mt-[3px] font-normal text-[12px] 4xs:text-[11px] leading-[20px] text-secondary">
                                            Withdrawing
                                        </button>
                                    ) : (
                                        <button disabled={true} className="cursor-default grayscale bg-[#8C6DFD] p-1 sm:p-2 rounded-md mx-auto w-[85px] 4xs:w-[80px] mt-[3px] font-normal text-[12px] 4xs:text-[11px] leading-[20px] text-secondary">
                                            Withdraw
                                        </button>
                                    )
                                )}
                                {deadline > currentTimestamp ? (
                                    <button
                                        onClick={() => { editCampaign(id) }}
                                        className="hover:brightness-110 bg-[#44BDD0] p-1 sm:p-2 rounded-md mx-auto w-[85px] 4xs:w-[80px] mt-[3px] font-normal text-[12px] 4xs:text-[11px] leading-[20px] text-secondary">
                                        Edit
                                    </button>
                                ) : (
                                    <button
                                        disabled
                                        className="bg-[#44BDD0] cursor-default grayscale p-1 sm:p-2 rounded-md mx-auto w-[85px] 4xs:w-[80px] mt-[3px] font-normal text-[12px] 4xs:text-[11px] leading-[20px] text-secondary">
                                        Ended
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center mt-[20px] gap-2">
                        <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#13131a}">
                            <img
                                src={profile}
                                alt="user"
                                className="w-1/2 h-1/2 object-contain"
                            />
                        </div>
                        <p className="flex-1 font-normal text-[12px] text-[#808191] truncate">
                            By <span className="text-[#b2b3bd]">{username}</span>
                        </p>
                        <SimpleSwitch status={status} campaignId={id} deadline={deadline} />
                    </div>
                </div>
            </div>
        ) : (
            <div
                className="hover:brightness-110 transition-all hover:shadow-[0_0px_25px_0px_rgba(0,0,0,0.3)] hover:shadow-primary max-w-[95%] w-full sm:w-[300px] m-2 sm:m-4 rounded-xl bg-offBlackDarker cursor-pointer"
                onClick={() => { navigate('campaigns/' + String(id)) }}
            >
                {deadline > currentTimestamp && status === true ? (
                    <div className='absolute ml-2 mt-2 rounded-full w-4 h-4 4xs:w-3 4xs:h-3 bg-green-300'></div>
                ) : (
                    status === false ? (
                        <div className='absolute ml-2 mt-2 rounded-full w-4 h-4 4xs:w-3 4xs:h-3 bg-yellow-300'></div>
                    ) : (
                        <div className='absolute ml-2 mt-2 rounded-full w-4 h-4 4xs:w-3 4xs:h-3 bg-red-300'></div>
                    )
                )}
                <img
                    src={image}
                    alt="fund"
                    className="w-full h-[180px] object-cover rounded-xl"

                />
                {target !== undefined && amountContributed !== undefined ? (
                <div className='translate-y-[-2px] relative rounded h-[5px] w-full bg-[#3a3a43]'>
                    <div style={{
                        width: `${calculateBarPercentage(
                            parseFloat(weiToEther(String(target))),
                            parseFloat(weiToEther(String(amountContributed)))
                        )}%`,
                        maxWidth: "100%",
                    }}
                        className='absolute h-full rounded bg-[#1DC071]'></div>
                </div>
                ) : (
                    <></>
                )}

                <div className="flex flex-col p-4 4xs:p-3 5xs:p-2 6xs:p-1">
                    <div className="block">
                        <h3 className="font-semibold text-[16px] 4xs:text-[15px] text-secondary text-left leading-[26px] truncate">
                            {title}
                        </h3>
                        <p className="text-[16px] 4xs:text-[15px] mt-[5px] font-normal text-[#808191] text-left leading-[20px] truncate">
                            {description}
                        </p>
                    </div>

                    <div className="flex justify-between mt-[15px] gap-2">
                        <div className="flex flex-col">
                            {amountContributed > 0 ? (
                                <h4 className="font-semibold text-[14px] 4xs:text-[13px] text-[#b2b3bd] leading-[22px]">
                                    {Math.round(amountContributed/1e18 * 100) / 100} LYX
                                </h4>
                            ) : (
                                <h4 className="font-semibold text-[14px] 4xs:text-[13px] text-[#b2b3bd] leading-[22px]">
                                    0 LYX
                                </h4>
                            )}
                            <p className="mt-[3px] font-normal text-[12px] 4xs:text-[11px] leading-[20px] text-[#808191] sm:max-w-[150px] truncate">
                                Raised out of {weiToEther(String(target))} LYX
                            </p>
                        </div>
                        <div className="3xs:hidden flex flex-row">
                            <div className="flex flex-col mr-2">
                                <h4 className="font-semibold text-[14px] 4xs:text-[13px] text-[#b2b3bd] leading-[22px]">
                                    {daysLeft(deadline)}
                                </h4>
                                <p className="mt-[3px] font-normal text-[12px] 4xs:text-[11px] leading-[20px] text-[#808191] sm:max-w-[120px] truncate">
                                    Days
                                </p>
                            </div>
                            <div className="flex flex-col mx-2">
                                <h4 className="font-semibold text-[14px] 4xs:text-[13px] text-[#b2b3bd] leading-[22px]">
                                    {hoursLeft(deadline)}
                                </h4>
                                <p className="mt-[3px] font-normal text-[12px] 4xs:text-[11px] leading-[20px] text-[#808191] sm:max-w-[120px] truncate">
                                    Hours
                                </p>
                            </div>
                            <div className="flex flex-col ml-2">
                                <h4 className="font-semibold text-[14px] 4xs:text-[13px] text-[#b2b3bd] leading-[22px]">
                                    {minutesLeft(deadline)}
                                </h4>
                                <p className="mt-[3px] font-normal text-[12px] 4xs:text-[11px] leading-[20px] text-[#808191] sm:max-w-[120px] truncate">
                                    Min.
                                </p>
                            </div>
                        </div>
                        <div className="hidden 3xs:flex flex-row">
                            <div className="flex flex-col mr-2">
                                <h4 className="font-semibold text-[14px] 4xs:text-[13px] text-[#b2b3bd] leading-[22px]">
                                    {daysLeft(deadline)}
                                </h4>
                                <p className="mt-[3px] font-normal text-[12px] 4xs:text-[11px] leading-[20px] text-[#808191] sm:max-w-[120px] truncate">
                                    D
                                </p>
                            </div>
                            <div className="flex flex-col ml-2">
                                <h4 className="font-semibold text-[14px] 4xs:text-[13px] text-[#b2b3bd] leading-[22px]">
                                    {hoursLeft(deadline)}
                                </h4>
                                <p className="mt-[3px] font-normal text-[12px] 4xs:text-[11px] leading-[20px] text-[#808191] sm:max-w-[120px] truncate">
                                    H
                                </p>
                            </div>
                            <div className="flex flex-col ml-2">
                                <h4 className="font-semibold text-[14px] 4xs:text-[13px] text-[#b2b3bd] leading-[22px]">
                                    {minutesLeft(deadline)}
                                </h4>
                                <p className="mt-[3px] font-normal text-[12px] 4xs:text-[11px] leading-[20px] text-[#808191] sm:max-w-[120px] truncate">
                                    M
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center mt-[20px] gap-2">
                        <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#13131a}">
                            <img
                                src={profile}
                                alt="user"
                                className="w-1/2 h-1/2 object-contain"
                            />
                        </div>
                        <p className="flex-1 font-normal text-[12px] text-[#808191] truncate">
                            By <span className="text-[#b2b3bd]">{username}</span>
                        </p>
                    </div>
                </div>
            </div>
        )
    );
};

export default CampaignCard;
