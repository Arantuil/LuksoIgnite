import { useDispatch, useSelector } from 'react-redux';
import { connect } from '../redux/blockchain/blockchainActions';
import { fetchData } from '../redux/data/dataActions';
import { useState, useEffect, useCallback } from 'react';
import CampaignCard from '../components/CampaignCard';
import { CiCalendarDate } from 'react-icons/ci';
import { BiUpArrowAlt } from 'react-icons/bi';
import { BiDownArrowAlt } from 'react-icons/bi';
import { RxCross2 } from 'react-icons/rx';
import { GoListOrdered } from 'react-icons/go';
import { TbLetterA } from 'react-icons/tb';
import { TbLetterZ } from 'react-icons/tb';
import CustomButton from '../components/CustomButton';
import { testCampaignCards } from '../utils/testData'

import { db } from '../firebase';
import { onValue, ref } from 'firebase/database';

const Home = () => {
    const [sortedCampaigns, setSortedCampaigns] = useState([])
    const [allCampaigns, setAllCampaigns] = useState([])
    
    function orderCampaignsByStatus(campaignsArray) {
        campaignsArray.sort((a, b) => {
            if (a.status === true && b.status !== true) {
                return -1;
            } else if (a.status !== true && b.status === true) {
                return 1;
            } else {
                return 0;
            }
        });
        return campaignsArray;
    }

    useEffect(() => {
        onValue(ref(db), snapshot => {
            const data = snapshot.val();
            if (data) {
                const campaignsArray = Object.values(data);
                setAllCampaigns(orderCampaignsByStatus(campaignsArray));

                let filtered = campaignsArray.filter(campaign => campaign.status === true && campaign.deadline > Number((Date.now()/1000).toFixed(0)) );
                filtered.sort((a, b) => a.deadline - b.deadline);
                setSortedCampaigns(filtered);
            }
        });
    }, []);

    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const bcdata = useSelector((state) => state.data);

    const getData = useCallback(() => {
        if (blockchain.account !== "" && blockchain.smartContract !== null) {
            dispatch(fetchData(blockchain.account));
        }
    }, [blockchain.account, blockchain.smartContract, dispatch]);

    useEffect(() => {
        getData();
    }, [blockchain.account, getData]);

    //window.addEventListener('load', function () {
    //    startApp();
    //})
    //async function startApp() {
    //    window.ethereum.sendAsync({
    //        method: "eth_accounts",
    //        params: [],
    //        jsonrpc: "2.0",
    //        id: new Date().getTime()
    //    }, function (error, result) {
    //        if (result["result"] !== "") dispatch(connect());
    //    });
    //}
    // -----------------------------------------

    function sortDeadlineUp() {
        const sorted = [...sortedCampaigns];
        sorted.sort((a, b) => a.deadline - b.deadline);
        setSortedCampaigns(sorted);
    };

    function sortDeadlineDown() {
        const sorted = [...sortedCampaigns];
        sorted.sort((a, b) => b.deadline - a.deadline);
        setSortedCampaigns(sorted);
    };

    function sortReset() {
        setSortedCampaigns(sortedCampaigns);
    }

    function sortTitleAtoZ() {
        const sorted = [...sortedCampaigns];
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        setSortedCampaigns(sorted);
    };

    function sortTitleZtoA() {
        const sorted = [...sortedCampaigns];
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        setSortedCampaigns(sorted);
    };

    function filterCampaignsStatusActive() {
        const filtered = allCampaigns.filter(campaign => campaign.status === true && campaign.deadline > Number((Date.now()/1000).toFixed(0)) );
        setSortedCampaigns(filtered);
    };

    function filterCampaignsStatusPaused() {
        const filtered = allCampaigns.filter(campaign => campaign.status === false);
        setSortedCampaigns(filtered);
    };

    function filterCampaignsStatusEnded() {
        const filtered = allCampaigns.filter(campaign => campaign.deadline < Number((Date.now()/1000).toFixed(0)) );
        setSortedCampaigns(filtered);
    };

    function orderObjectsByDeadline(objectsArray) {
        return objectsArray.sort((a, b) => a.deadline - b.deadline);
    }

    function filterCampaignsStatusAll() {
        const filtered = allCampaigns
        setSortedCampaigns(orderObjectsByDeadline(filtered));
    };

    useEffect(() => {
        console.log(blockchain)
        console.log(bcdata)
    }, [blockchain.account])

    return (
        <div className='p-2 sm:p-4 md:p-6 lg:p-8
        xs:ml-[10px] ml-[16px] sm:ml-[20px] 3xs:w-[calc(100%-50px-10px)] 2xs:w-[calc(100%-60px-10px)] xs:w-[calc(100%-70px-10px)] w-[calc(100%-80px-16px)] sm:w-[calc(100%-80px-20px)] 
        bg-offBlack rounded-xl 3xs:mt-[calc(16px+32px)] 2xs:mt-[calc(16px+40px)] xs:mt-[calc(16px+50px)] mt-[calc(16px+60px)]'>
                    {blockchain.errorMsg !== "" ? (
                        <div className="mb-6 sm:mb-8 bg-offBlackDarker rounded-lg">
                            <p className="text-center font-semibold text-[16px] sm:text-[18px] leading-[38px] text-secondary">
                                {blockchain.errorMsg}
                            </p>
                        </div>
                    ) : null}
            <div className='flex flex-col md:flex-row md:gap-16 justify-center'>
                
            <div className='mx-auto w-full md:w-auto md:max-w-[600px] md:mr-0    
            mb-4 p-4 bg-offBlackDarker rounded-[10px]'>
                <p className='font-medium text-secondary text-center mb-[10px]'>Order by</p>
                <div className='flex flex-row'>
                    <div className='flex flex-col mx-auto px-4'>
                        <p className='mx-[5px]'><abbr title="Sort by campaign deadline"><CiCalendarDate color="#FFF1F8" size={38} /></abbr></p>
                        <button onClick={sortReset} className='ml-[8px] hover:brightness-110 border-[2px] border-solid border-primary rounded-lg absolute translate-x-[34px]'><RxCross2 color='#FE005B' /></button>
                        <div className='flex flex-row w-full'>
                            <button onClick={sortDeadlineUp} className='hover:brightness-110 border-[2px] border-solid border-primary rounded-lg mx-[1px] flex justify-center w-1/2'><BiUpArrowAlt color="#FE005B" size={20} /></button>
                            <button onClick={sortDeadlineDown} className='hover:brightness-110 border-[2px] border-solid border-primary rounded-lg mx-[1px] flex justify-center w-1/2'><BiDownArrowAlt color="#FE005B" size={20} /></button>
                        </div>
                    </div>
                    <div className='flex flex-col mx-auto px-4'>
                        <p className='mx-[5px]'><abbr title="Sort alfabetically by title"><GoListOrdered color="#FFF1F8" size={38} /></abbr></p>
                        <button onClick={sortReset} className='ml-[8px] hover:brightness-110 border-[2px] border-solid border-primary rounded-lg absolute translate-x-[34px]'><RxCross2 color='#FE005B' /></button>
                        <div className='flex flex-row w-full'>
                            <button onClick={sortTitleAtoZ} className='hover:brightness-110 border-[2px] border-solid border-primary rounded-lg mx-[1px] flex justify-center w-1/2'><TbLetterA color="#FE005B" size={20} /></button>
                            <button onClick={sortTitleZtoA} className='hover:brightness-110 border-[2px] border-solid border-primary rounded-lg mx-[1px] flex justify-center w-1/2'><TbLetterZ color="#FE005B" size={20} /></button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='mx-auto w-full md:w-[190px] md:ml-0 
            mb-4 p-4 bg-offBlackDarker rounded-[10px]'>
                <label className='text-secondary ml-2 font-semibold'>Campaign statuses:</label>
                <div className='flex flex-col mt-1'>
                    <div className='flex flex-row'>
                        <div onClick={filterCampaignsStatusActive} className='border-[2px] border-primary rounded-full ml-2'>
                            <div className='m-[2px] cursor-pointer active:brightness-110 rounded-full w-3.5 h-3.5 bg-green-300'></div>
                        </div>
                        <label className='text-secondary leading-[15px] ml-2 translate-y-[2px]'>Active</label>
                    </div>
                    <div className='flex flex-row mt-2'>
                        <div onClick={filterCampaignsStatusPaused} className='border-[2px] border-primary rounded-full ml-2'>
                            <div className='m-[2px] cursor-pointer active:brightness-110 rounded-full w-3.5 h-3.5 bg-yellow-300'></div>
                        </div>
                        <label className='text-secondary leading-[15px] ml-2 translate-y-[2px]'>Paused</label>
                    </div>
                    <div className='flex flex-row mt-2'>
                        <div onClick={filterCampaignsStatusEnded} className='border-[2px] border-primary rounded-full ml-2'>
                            <div className='m-[2px] cursor-pointer active:brightness-110 rounded-full w-3.5 h-3.5 bg-red-300'></div>
                        </div>
                        <label className='text-secondary leading-[15px] ml-2 translate-y-[2px]'>Ended</label>
                    </div>
                    <div className='flex flex-row mt-2'>
                        <div onClick={filterCampaignsStatusAll} className='border-[2px] border-primary rounded-full ml-2'>
                            <div className='m-[2px] cursor-pointer active:brightness-110 rounded-full w-3.5 h-3.5 bg-gray-300'></div>
                        </div>
                        <label className='text-secondary leading-[15px] ml-2 translate-y-[2px]'>Show all</label>
                    </div>
                </div>
            </div>
            </div>
            <div className='flex justify-center content-start flex-row flex-wrap'>
            {sortedCampaigns.length > 0 ? (
                sortedCampaigns.map((cardInfo) => (
                    <CampaignCard 
                        id={cardInfo.campaignId}
                        title={cardInfo.title} 
                        image={cardInfo.image}
                        owner={cardInfo.owner}
                        username={cardInfo.username}
                        description={cardInfo.description}
                        target={cardInfo.target}
                        amountContributed={cardInfo.amountContributed}
                        deadline={cardInfo.deadline}
                        status={cardInfo.status}
                        campaignAmountWithdrawn={cardInfo.campaignAmountWithdrawn}
                    />
                ))
            ) : (
                <p className='font-medium text-secondary text-[20px]'>No campaigns found with this status</p>
            )}
            </div>
            <div className='flex justify-center mt-[20px]'>
                <CustomButton
                    btnType="submit"
                    title={`Show all campaigns`}
                    styles={`bg-[#FE005B] h-[50px] hover:brightness-110 transition-all hover:shadow-[0_0px_20px_0px] hover:shadow-primary`}
                    handleClick={filterCampaignsStatusAll}
                />
            </div>
        </div>
    );
}

export default Home;