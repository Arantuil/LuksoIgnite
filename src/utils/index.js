import Web3 from 'web3';

export const daysLeft = (deadline) => {
    const difference = new Date(deadline * 1000).getTime() - Date.now();
    let remainingDays = difference / (1000 * 3600 * 24);

    if (remainingDays < 0) {
        remainingDays = 0
    }

    return remainingDays.toFixed(0);
};

export const hoursLeft = (deadline) => {
    const difference = new Date(deadline * 1000).getTime() - Date.now();
    const remainingHoursTotal = difference / (1000 * 3600);

    let remainingHours = remainingHoursTotal % 24;
    remainingHours = remainingHours - 1

    if (remainingHours < 0) {
        remainingHours = 0;
    }

    return remainingHours.toFixed(0);
};

export const minutesLeft = (deadline) => {
    const difference = new Date(deadline * 1000).getTime() - Date.now();
    const remainingMinutesTotal = difference / (1000 * 60);

    let remainingMinutes = Math.floor(remainingMinutesTotal % 60);
    remainingMinutes = remainingMinutes + 1

    if (remainingMinutes < 1) {
        remainingMinutes = 0;
    }

    return remainingMinutes.toFixed(0);
};

export const calculateBarPercentage = (goal, raisedAmount) => {
    const percentage = Math.round((raisedAmount * 100) / goal);

    return percentage;
};

export const checkIfImage = (url, callback) => {
    const img = new Image();
    img.src = url;

    if (img.complete) callback(true);

    img.onload = () => callback(true);
    img.onerror = () => callback(false);
};

export const weiToEther = (weiInput) => {
    let ethBalance = Web3.utils.fromWei(weiInput, 'ether');
    return ethBalance;
}

export const etherToWei = (etherInput) => {
    let ethBalance = Web3.utils.toWei(etherInput, 'ether');
    return ethBalance;
}