import { useEffect, useState } from 'react';
import CampaignCard from '../components/CampaignCard';
import { connect } from '../redux/blockchain/blockchainActions';
import { useSelector, useDispatch } from 'react-redux';
import CustomButton from '../components/CustomButton';

import { db } from '../firebase';
import { onValue, ref } from 'firebase/database';

import { ERC725 } from '@erc725/erc725.js';
import lsp3ProfileSchema from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json';
import { profile, profileGray } from '../assets/index'
import upLogoColored from '../assets/upLogoColored.png'


const Profile = () => {
    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);

    const [filteredCampaigns, setFilteredCampaigns] = useState([])
    useEffect(() => {
        if (blockchain.account !== "" && blockchain.account !== null) {
            onValue(ref(db), snapshot => {
                const data = snapshot.val();
                if (data) {
                    const campaignsArray = Object.values(data);
                    const filteredCampaigns = campaignsArray.filter(campaign => (campaign.owner).toLowerCase() === (blockchain.account).toLowerCase());
                    setFilteredCampaigns(filteredCampaigns);
                }
            });
        }
    }, [blockchain.account]);

    useEffect(() => {
        if (blockchain.account !== "" && blockchain.account !== null && filteredCampaigns.length !== 0) {
            setFilteredCampaigns(filteredCampaigns.filter(campaign => (campaign.owner).toLowerCase() === (blockchain.account).toLowerCase()));
        }
    }, [blockchain]);

    const [profileData, setProfileData] = useState(null);
    const [accountInfo, setAccountInfo] = useState(null);
    async function getProfileData() {
        if (blockchain.account !== '' && blockchain.account !== null) {
            const erc725js = new ERC725(lsp3ProfileSchema, blockchain.account, 'https://rpc.testnet.lukso.gateway.fm',
                {
                    ipfsGateway: 'https://api.universalprofile.cloud/ipfs',
                },
            );

            const profileData = await erc725js.getData();
            setProfileData(profileData)

            const accountDetails = "https://universalpage.dev/api/ipfs/" + JSON.stringify(profileData[1]?.value.url).replace(/["']/g, "").replace("ipfs://", "")
            
            fetch(accountDetails)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Data from the server:", data);
                    setAccountInfo(data)
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                });
        }
    }
    
    useEffect(() => {
        getProfileData()
    }, [blockchain.account])

    const [profileImage, setProfileImage] = useState(null);
    const [profileBanner, setProfileBanner] = useState(null);
    useEffect(() => {
        if (accountInfo !== null && accountInfo.LSP3Profile.profileImage[0] !== undefined) {
            const ipfsLink = accountInfo.LSP3Profile.profileImage[0].url.replace('ipfs://', '')
            const gateway = 'https://ipfs.io/ipfs/';
            const imageUrl = `${gateway}${ipfsLink}`;
            setProfileImage(imageUrl)
        }
        if (accountInfo !== null && accountInfo.LSP3Profile.backgroundImage[0] !== undefined) {
            const ipfsLinkBI = accountInfo.LSP3Profile.backgroundImage[0].url.replace('ipfs://', '')
            const gatewayBI = 'https://ipfs.io/ipfs/';
            const imageUrlBI = `${gatewayBI}${ipfsLinkBI}`;
            setProfileBanner(imageUrlBI)
        }
        console.log(profileImage)
        console.log(profileBanner)
    }, [accountInfo])


    return (
        <div className='p-2 sm:p-4 md:p-6 lg:p-8 
        xs:ml-[10px] ml-[16px] sm:ml-[20px] 3xs:w-[calc(100%-50px-10px)] 2xs:w-[calc(100%-60px-10px)] xs:w-[calc(100%-70px-10px)] w-[calc(100%-80px-16px)] sm:w-[calc(100%-80px-20px)] 
        bg-offBlack rounded-xl 3xs:mt-[calc(16px+32px)] 2xs:mt-[calc(16px+40px)] xs:mt-[calc(16px+50px)] mt-[calc(16px+60px)]'>
            {blockchain.acount !== "" && blockchain.account !== null ? (
                <div>
                    <div className="flex w-fit mx-auto justify-center items-center p-[16px] sm:min-w-[380px] bg-primary rounded-[10px]">
                        <h1 className="font-bold text-[18px] sm:text-[22px] leading-[38px] text-secondary">
                            Your profile
                        </h1>
                    </div>
                    <div style={profileBanner !== null ? { 
                            backgroundImage: `url(${profileBanner})`, 
                            backgroundSize: 'cover', 
                            backgroundPosition: 'center', 
                            width: 'fit-content'
                        } : {}}  
                        className={`bg-offBlackDarker mx-auto mt-6 sm:mt-8 flex flex-col w-fit h-fit p-4 md:p-6 lg:p-8 rounded-xl`}>
                            
                                <div className='bg-[rgba(0,0,0,0.5)] p-2 md:p-3 lg:p-4 rounded-lg'>
                                    <a target='_blank' rel='noreferrer' href={`https://wallet.universalprofile.cloud/${blockchain.account}`}>
                                        <img className='absolute w-[20px] h-[20px] ml-auto mr-0' src={upLogoColored} alt='Universal Profiles' />
                                    </a>
                                    <div className='flex justify-center'>
                                        {profileImage !== null ? (
                                            <img className='rounded-full w-[80px]' src={profileImage} alt="" />
                                        ) : (
                                            <img className='rounded-full w-[80px]' src={profile} alt="" />
                                        )}
                                    </div>

                                    <div className='mt-2 flex mx-auto text-secondary text-sm md:text-base text-center'>
                                        {accountInfo !== null && accountInfo.LSP3Profile.tags.length !== null ? (
                                            <p className='flex gap-2 mx-auto'>{accountInfo.LSP3Profile.tags.map((tag) => (
                                                    <span className='font-semibold bg-[rgba(255,255,255,0.4)] rounded-full py-[1px] md:py-[2px] px-1 md:px-2'>{tag}</span>
                                                ))}
                                            </p>
                                        ) : (
                                            <></>
                                        )}
                                    </div>

                                    <div className='mt-4 text-secondary text-xl md:text-2xl text-center'>
                                        {accountInfo !== null ? (
                                            <p>Your username: <span className='font-semibold'>{accountInfo.LSP3Profile.name}</span></p>
                                        ) : (
                                            <p>Connect to see profile name</p>
                                        )}
                                    </div>
                                    <div className='text-secondary text-xl md:text-2xl text-center'>
                                        {accountInfo !== null ? (
                                            accountInfo.LSP3Profile.description === "" ? (
                                                <p className='text-midGrey'>No description</p>
                                            ) : (
                                                <p>Your profile description: <span className='font-semibold'>{accountInfo.LSP3Profile.description}</span></p>
                                            )
                                        ) : (
                                            <p>Connect to see profile description</p>
                                        )}
                                    </div>
                                </div>
                    </div>
                    {filteredCampaigns.length > 0 ? (
                    <div className='mt-[20px] flex justify-center content-start flex-row flex-wrap'>
                        {filteredCampaigns.map((cardInfo) => (
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
                                isProfilePage={true}
                                status={cardInfo.status}
                                campaignAmountWithdrawn={cardInfo.campaignAmountWithdrawn}
                            />
                        ))}
                    </div>
                    ) : (
                        <div>
                            <div className="mb-4 sm:mb-8 md:mb-12 mt-6 sm:mt-8">
                                <h1 className="text-center font-medium text-midGrey text-[20px]">
                                    You have not created any campaigns yet
                                </h1>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <div className='mt-[20px]'>
                        <div className='flex justify-center'>
                            <CustomButton
                                btnType="button"
                                title="Connect"
                                styles="transition-all hover:shadow-[0_0px_20px_0px] hover:shadow-primary hover:brightness-110 text-lg sm:text-xl md:text-2xl flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#44BDD0] rounded-[10px] animate-pulseSlow active:brightness-105 bg-primary mx-auto"
                                handleClick={() => {
                                    dispatch(connect());
                                }}
                            />
                        </div>
                    </div>
                    {blockchain.errorMsg !== "" ? (
                        <div className="mt-6 sm:mt-8">
                            <p className="text-center font-semibold text-[16px] sm:text-[18px] leading-[38px] text-secondary">
                                {blockchain.errorMsg}
                            </p>
                        </div>
                    ) : null}

                    <div className='mx-auto mt-6 sm:mt-8 bg-offBlackDarker flex flex-col w-fit h-fit p-4 md:p-6 lg:p-8 rounded-xl'>
                                <img className='absolute w-[20px] h-[20px] ml-auto mr-0' src={upLogoColored} alt='Universal Profiles' />
                                <div className='flex justify-center'>
                                    <img className='rounded-full w-[80px]' src={profileGray} alt="" />
                                </div>
                                <div className='mt-4 text-secondary text-xl md:text-2xl text-center'>
                                    <p>Connect to see profile name</p>
                                </div>
                                <div className='text-secondary text-xl md:text-2xl text-center'>
                                    <p>Connect to see profile description</p>
                                </div>
                            </div>
                    <div className='flex justify-center'>
                        <div className="inline-block mb-4 sm:mb-8 md:mb-12 mt-6 sm:mt-8 p-4 bg-offBlackDarker rounded-[10px]">
                            <h1 className="text-center font-medium text-[18px] sm:text-[22px] leading-[38px] text-secondary">
                                To view your campaigns you first have to connect
                            </h1>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
