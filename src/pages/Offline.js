import { useState, useEffect } from 'react';

const Offline = ({ difference }) => {
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

    return (
        <div className="text-center">
            <header className="bg-[#1C1D30] min-h-[100vh] flex flex-col items-center justify-center text-[calc(10px+2vmin)] text-white p-2 sm:p-5">

                <div className='w-[150px] sm:w-[250px] aspect-square rounded-xl'>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="100%"
                        version="1.1"
                        viewBox="0 0 105.833 105.833"
                    >
                        <g display="inline">
                            <rect rx='15' ry='15' width="105.833" height="105.833" x="0" y="0" fill="#282945" fillOpacity="1" stroke="none" strokeLinecap="round" strokeLinejoin="bevel" strokeWidth="0.265" paintOrder="fill markers stroke"
                            ></rect>
                            <g fill="#8c6dfd">
                                <g
                                    fill="#8c6dfd"
                                    display="inline"
                                    opacity="1"
                                    transform="translate(-3.716 -2.313) scale(1.04234)"
                                >
                                    <path
                                        id="lightningBolt"
                                        fill="#8c6dfd"
                                        stroke="url(#linearGradient7805)"
                                        d="M65.713 5.535L26.41 60.181l23.66-.1-6.731 40.094 38.806-54.646-23.66.1z"
                                        className="animate-pulse"
                                    ></path>
                                </g>
                            </g>
                        </g>
                    </svg>
                </div>

                {difference > 0 ? (
                    <div className='mt-[20px] max-w-[90%] md:max-w-[900px]'>
                        <p>
                            The website is temporarily offline
                        </p>
                    </div>
                ) : (
                    <div className='mt-[20px] max-w-[90%] md:max-w-[900px]'>
                        <p>
                            The website is temporarily offline, you can always interact with the dapp directly on the block explorer: <a
                                className='break-words text-secondary hover:brightness-110'
                                target="_blank"
                                rel="noreferrer"
                                href={`https://explorer.energyweb.org/token/${CONFIG.CONTRACT_ADDRESS}/token-transfers`}>EnergyWebSpark contract</a>
                        </p>
                    </div>
                )}

                <div className={`${difference > 0 ? 'flex' : 'hidden'} mt-[20px]`}>
                    <p>
                        EnergyWebSpark will launch in: {Math.round((difference/60/60)%60)} hours, {Math.round((difference/60)%60)} minutes, {difference%60} seconds.
                    </p>
                </div>
            </header>
        </div>
    );
}

export default Offline;