const Footer = () => {

    return (
        <footer className="flex relative xs:h-10 h-12 sm:h-14 md:h-16 w-full bg-offBlackDarker
        xs:px-2 px-3 sm:px-6 md:px-8
        xs:pb-2 pb-3 sm:pb-6 md:pb-8">
            <div className='flex flex-row gap-2 sm:gap-4 md:gap-6'>
                <div className='hover:brightness-110 transition-all hover:shadow-[0_0px_20px_0px] hover:shadow-primary rounded-xl h-full bg-offBlack flex items-center'>
                    <a className='py-1 px-2 md:px-3 h-full w-full flex items-center' href='https://twitter.com/Arantuil' target='_blank'>
                        <svg fill="#FE005B" height={'100%'} xmlns="http://www.w3.org/2000/svg" x="0" y="0" enableBackground="new 0 0 1668.56 1221.19" version="1.1" viewBox="0 0 1668.56 1221.19" xmlSpace="preserve" >
                            <g transform="translate(52.39 -25.059)">
                                <path d="M283.94 167.31l386.39 516.64L281.5 1104h87.51l340.42-367.76L984.48 1104h297.8L874.15 558.3l361.92-390.99h-87.51l-313.51 338.7-253.31-338.7h-297.8zm128.69 64.46h136.81l604.13 807.76h-136.81L412.63 231.77z"></path>
                            </g>
                        </svg>
                    </a>
                </div>
                <div className='hover:brightness-110 transition-all hover:shadow-[0_0px_20px_0px] hover:shadow-primary rounded-xl h-full bg-offBlack flex items-center'>
                    <a className='py-1 px-2 md:px-3 h-full w-full flex items-center' href='https://t.me/luksoignite' target='_blank'>
                        <svg
                            height={'100%'}
                            fill="#FE005B"
                            xmlns="http://www.w3.org/2000/svg"
                            fillRule="evenodd"
                            clipRule="evenodd"
                            imageRendering="optimizeQuality"
                            shapeRendering="geometricPrecision"
                            textRendering="geometricPrecision"
                            viewBox="0 0 333334 333334">
                            <path d="M166667 0c92048 0 166667 74619 166667 166667s-74619 166667-166667 166667S0 258715 0 166667 74619 0 166667 0zm80219 91205l-29735 149919s-4158 10396-15594 5404l-68410-53854s76104-68409 79222-71320c3119-2911 2079-3534 2079-3534 207-3535-5614 0-5614 0l-100846 64043-42002-14140s-6446-2288-7069-7277c-624-4992 7277-7694 7277-7694l166970-65498s13722-6030 13722 3951zm-87637 122889l-27141 24745s-2122 1609-4443 601l5197-45965 26387 20619z"></path>
                        </svg>
                    </a>
                </div>
                <div className='hover:brightness-110 transition-all hover:shadow-[0_0px_20px_0px] hover:shadow-primary rounded-xl h-full bg-offBlack flex items-center'>
                    <a className='py-1 px-2 md:px-3 h-full w-full flex items-center' href='https://t.me/luksoigniteupdates' target='_blank'>
                        <svg
                            height={'100%'}
                            fill="#FE005B"
                            xmlns="http://www.w3.org/2000/svg"
                            enableBackground="new 0 0 512 512"
                            version="1.1"
                            viewBox="0 0 512 512"
                            xmlSpace="preserve">
                            <path d="M381.7 225.9c0-97.6-52.5-130.8-101.6-138.2 0-.5.1-1 .1-1.6 0-12.3-10.9-22.1-24.2-22.1-13.3 0-23.8 9.8-23.8 22.1 0 .6 0 1.1.1 1.6-49.2 7.5-102 40.8-102 138.4 0 113.8-28.3 126-66.3 158h384c-37.8-32.1-66.3-44.4-66.3-158.2zM256.2 448c26.8 0 48.8-19.9 51.7-43H204.5c2.8 23.1 24.9 43 51.7 43z"></path>
                        </svg>
                    </a>
                </div>
            </div>
            <div className='rounded-xl py-1 px-2 md:px-3 h-full bg-offBlack flex items-center ml-auto mr-0'>
                <p className='text-[#808191] text-[13px] s:text-[12px] xs:text-[11px] 2xs:text-[10px]'>LuksoIgniteV1 Testnet version</p>
            </div>
        </footer>
    );
}

export default Footer;