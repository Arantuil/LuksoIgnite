import React from 'react';
import Jazzicon from 'react-jazzicon';

const AccountIcon = ({ address, size, styles }) => {
    const addressNumber = parseInt(address.slice(2, 10), 16);

    return (
        <div className={`${styles} flex justify-center items-center h-[${size}px] w-[${size}px]`}>
            <Jazzicon diameter={size} seed={addressNumber} />
        </div>
    );
};

export default AccountIcon;
