import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomButton from "./CustomButton";
import { connect } from '../redux/blockchain/blockchainActions';
import { useDispatch, useSelector } from 'react-redux';
import { fetchData } from '../redux/data/dataActions';
import { search, profileGray, profile } from "../assets";
import { debounce } from 'lodash';
import { RxCross2 } from 'react-icons/rx';

import { ERC725 } from '@erc725/erc725.js';
import lsp3ProfileSchema from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json';

import { db } from '../firebase';
import { onValue, ref } from 'firebase/database';

const Navbar = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const [allCampaigns, setAllCampaigns] = useState([])
    useEffect(() => {
        onValue(ref(db), snapshot => {
            const data = snapshot.val();
            if (data !== undefined && data !== null) {
                setAllCampaigns(Object.values(data))
            }
        });
    }, []);

    const doSearch = (term) => {
        const results = allCampaigns.filter((item) =>
            item.title.toLowerCase().includes(term.toLowerCase()) || item.username.toLowerCase().includes(term.toLowerCase())
        );
        setSearchResults(results);
    };

    const debouncedSearch = debounce(doSearch, 200);

    const handleInputChange = (event) => {
        const term = event.target.value;
        setSearchTerm(term);
        debouncedSearch(term);
    };

    function removeSearchTerm() {
        setSearchTerm('')
    }

    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const bcdata = useSelector((state) => state.data);

    const getData = () => {
        if (blockchain.account !== "" && blockchain.smartContract !== null) {
            dispatch(fetchData(blockchain.account));
        }
    };

    useEffect(() => {
        getData();
    }, []);

    // ----------------------

    const [accountInfo, setAccountInfo] = useState(null);
    async function getProfileData() {
        if (blockchain.account !== '' && blockchain.account !== null) {
            const erc725js = new ERC725(lsp3ProfileSchema, blockchain.account, 'https://rpc.testnet.lukso.gateway.fm',
                {
                    ipfsGateway: 'https://api.universalprofile.cloud/ipfs',
                },
            );

            const profileData = await erc725js.getData();

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
    useEffect(() => {
        if (accountInfo !== null) {
            const ipfsLink = accountInfo.LSP3Profile.profileImage[0].url.replace('ipfs://', '')
            const gateway = 'https://ipfs.io/ipfs/';
            const imageUrl = `${gateway}${ipfsLink}`;
            setProfileImage(imageUrl)
        }
    }, [accountInfo])


    return (
        <div className="3xs:ml-[50px] 2xs:ml-[65px] xs:ml-[80px] ml-[96px] sm:ml-[100px] 3xs:w-[calc(100%-60px-16px)] 2xs:w-[calc(100%-70px-16px)] xs:w-[calc(100%-80px-16px)] w-[calc(100%-96px-24px)] sm:w-[calc(100%-96px-48px)] md:w-[calc(100%-96px-64px)] absolute 3xs:h-[40px] 2xs:h-[45px] xs:h-[50px] h-[60px] gap-1 flex flex-row">
            <div className="flex relative ml-0 mr-auto h-full bg-offBlack rounded-xl">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleInputChange}
                    className="flex md:hidden text-center w-full md:w-[180px] lg:w-[200px] xl:w-[225px] font-normal text-[12px] placeholder:text-midGrey text-secondary bg-transparent outline-none"
                />
                <input
                    type="text"
                    placeholder="Search on title or username"
                    value={searchTerm}
                    onChange={handleInputChange}
                    className="hidden md:flex text-center w-full md:w-[180px] lg:w-[200px] xl:w-[225px] font-normal text-[12px] placeholder:text-midGrey text-secondary bg-transparent outline-none"
                />
                {searchResults.length === 0 || searchTerm === '' ? (
                    <></>
                ) : (
                    <ul className='3xs:translate-y-[40px] 2xs:translate-y-[45px] xs:translate-y-[50px] translate-y-[60px]
                    border-2 border-midGrey border-solid z-[100] p-[2px] md:p-[4px] lg:p-[6px] w-[162.94px] lg:w-[200px] xl:w-[250px] 2xl:w-[300px] rounded-bl-xl rounded-br-xl absolute text-secondary bg-offBlack'>
                        {searchResults.map((item) => (
                            <Link className='flex flex-row my-[3px] sm:my-[4px] md:my-[6px] rounded-md p-[2px] sm:p-[4px] md:p-[6px] border-2 border-solid border-primary' 
                                onClick={removeSearchTerm} key={item.campaignId} to={`/campaigns/${item.campaignId}`}>
                                <img className='w-[35px] h-[20px] my-auto mr-2' src={item.image} />
                                <li className='truncate' key={item.campaignId}>{item.title}</li>
                            </Link>
                        ))}
                    </ul>
                )}
                <div onClick={removeSearchTerm} className='hover:brightness-110 transition-all hover:shadow-[0_0px_20px_0px] hover:shadow-primary bg-primary rounded-lg h-fit flex my-auto mr-3 p-[1px] cursor-pointer'>
                    <RxCross2 size={20} color={'#FFF1F8'} />
                </div>
                <div className="hover:brightness-110 transition-all hover:shadow-[0_0px_20px_0px] hover:shadow-primary w-[56px] h-full rounded-xl bg-primary flex justify-center items-center cursor-pointer">
                    <img
                        src={search}
                        alt="search"
                        className="w-[16px] h-[16px] sm:w-[24px] sm:h-[24px] object-contain"
                    />
                </div>
            </div>
            <div className="flex gap-1 relative xs:ml-auto mr-0">
                <CustomButton
                    btnType="button"
                    title={blockchain.account ? "Create a campaign" : "Connect"}
                    styles={blockchain.account ? "2xs:text-[12px] 3xs:text-[10px] 2xs:px-2 3xs:px-[6px] 4xs:px-1 bg-primary 2xs:mr-0 xs:mr-1 mr-2 sm:mr-4 hover:brightness-110 transition-all hover:shadow-[0_0px_20px_0px] hover:shadow-primary" : "hover:brightness-110 transition-all hover:shadow-[0_0px_20px_0px] hover:shadow-primary 2xs:text-[12px] 3xs:text-[10px] 2xs:px-2 animate-pulseSlow hover:brightness-110 bg-primary 2xs:mr-0 xs:mr-1 mr-2 sm:mr-4"}
                    handleClick={() => {
                        if (blockchain.account) navigate("create-campaign");
                        else {
                            dispatch(connect());
                            getData();
                        }
                    }}
                />
                {blockchain.account === "" || blockchain.account === null ? (
                    <Link className='flex items-center hover:brightness-110' to="/profile">
                        <div className="h-full aspect-square rounded-full bg-offBlack flex justify-center items-center cursor-pointer">
                            <img
                                src={profileGray}
                                alt="user"
                                className="w-[60%] h-[60%] object-contain"
                            />
                        </div>
                    </Link>
                ) : (
                    profileImage === null ? (
                    <Link className='flex items-center hover:brightness-110' to="/profile">
                        <div className="h-full aspect-square rounded-full bg-offBlack flex justify-center items-center cursor-pointer">
                            <img
                                src={profile}
                                alt="user"
                                className="w-[60%] h-[60%] object-contain rounded-full"
                            />
                        </div>
                    </Link>
                    ) : (
                    <Link className='flex items-center hover:brightness-110' to="/profile">
                        <div className="h-full aspect-square rounded-full bg-offBlack flex justify-center items-center cursor-pointer">
                            <img
                                src={profileImage}
                                alt="user"
                                className="w-[60%] h-[60%] object-contain rounded-full"
                            />
                        </div>
                    </Link>
                    )
                )}
            </div>
        </div>
    );
};

export default Navbar;
