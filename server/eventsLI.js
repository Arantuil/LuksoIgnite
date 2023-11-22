const config = require('./configLI');
const express = require('express');
const admin = require("firebase-admin");
const serviceAccount = require("./hackathons-d3672-firebase-adminsdk-7i8lc-b6c40f7e28.json");
const app = express();
const port = 8085;
const ethers = require("ethers");
const axios = require('axios');
const keys = require('./keysLI');
const Web3 = require('web3');

const contractAddress = config.contractAddress;
const contractAbi = [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"campaignId","type":"uint256"}],"name":"AllContributionsWithdrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"campaignId","type":"uint256"}],"name":"AllContributionsWithdrawnTargetNotReached","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"campaignId","type":"uint256"},{"indexed":false,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"string","name":"ownerImage","type":"string"},{"indexed":false,"internalType":"string","name":"username","type":"string"},{"indexed":false,"internalType":"string","name":"title","type":"string"},{"indexed":false,"internalType":"string","name":"description","type":"string"},{"indexed":false,"internalType":"uint256","name":"target","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"deadline","type":"uint256"},{"indexed":false,"internalType":"bool","name":"campaignAmountWithdrawn","type":"bool"},{"indexed":false,"internalType":"string","name":"image","type":"string"},{"indexed":false,"internalType":"bool","name":"status","type":"bool"}],"name":"CampaignCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"campaignId","type":"uint256"},{"indexed":false,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"string","name":"username","type":"string"},{"indexed":false,"internalType":"string","name":"title","type":"string"},{"indexed":false,"internalType":"string","name":"description","type":"string"},{"indexed":false,"internalType":"uint256","name":"target","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"deadline","type":"uint256"},{"indexed":false,"internalType":"string","name":"image","type":"string"}],"name":"CampaignEdited","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"campaignId","type":"uint256"},{"indexed":false,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"bool","name":"status","type":"bool"}],"name":"CampaignStatusChanged","type":"event"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"string","name":"_profileImage","type":"string"}],"name":"contributeToCampaign","outputs":[],"stateMutability":"payable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"campaignId","type":"uint256"},{"indexed":false,"internalType":"address","name":"contributor","type":"address"},{"indexed":false,"internalType":"string","name":"profileImage","type":"string"},{"indexed":false,"internalType":"uint256","name":"amountContributed","type":"uint256"}],"name":"ContributionMade","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"campaignId","type":"uint256"},{"indexed":false,"internalType":"address","name":"contributor","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountContributed","type":"uint256"}],"name":"ContributionTakenBack","type":"event"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"string","name":"_ownerImage","type":"string"},{"internalType":"string","name":"_username","type":"string"},{"internalType":"string","name":"_title","type":"string"},{"internalType":"string","name":"_description","type":"string"},{"internalType":"uint256","name":"_target","type":"uint256"},{"internalType":"uint256","name":"_deadline","type":"uint256"},{"internalType":"string","name":"_image","type":"string"}],"name":"createCampaign","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"string","name":"_title","type":"string"},{"internalType":"string","name":"_description","type":"string"},{"internalType":"uint256","name":"_target","type":"uint256"},{"internalType":"uint256","name":"_deadline","type":"uint256"},{"internalType":"string","name":"_image","type":"string"}],"name":"editCampaign","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"bool","name":"_status","type":"bool"}],"name":"editCampaignStatus","outputs":[],"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"refundAllContributions","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"_feeAddress","type":"address"}],"name":"setFeeAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_feePoints","type":"uint256"}],"name":"setFeePoints","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"takeBackContribution","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"withdrawContributions","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"campaigns","outputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"ownerImage","type":"string"},{"internalType":"string","name":"username","type":"string"},{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"uint256","name":"target","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint256","name":"amountCollected","type":"uint256"},{"internalType":"bool","name":"campaignAmountWithdrawn","type":"bool"},{"internalType":"string","name":"image","type":"string"},{"internalType":"bool","name":"status","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"feePoints","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getCampaigns","outputs":[{"components":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"string","name":"ownerImage","type":"string"},{"internalType":"string","name":"username","type":"string"},{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"uint256","name":"target","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint256","name":"amountCollected","type":"uint256"},{"internalType":"bool","name":"campaignAmountWithdrawn","type":"bool"},{"internalType":"string","name":"image","type":"string"},{"internalType":"address[]","name":"funders","type":"address[]"},{"internalType":"uint256[]","name":"contributions","type":"uint256[]"},{"internalType":"bool","name":"status","type":"bool"}],"internalType":"struct LuksoIgniteV1.Campaign[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getContributors","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"numberOfCampaigns","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]
const provider = new ethers.providers.JsonRpcProvider(config.rpc);
const contract = new ethers.Contract(contractAddress, contractAbi, provider);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://hackathons-d3672-default-rtdb.firebaseio.com/"
});
const db = admin.database();

const weiToEther = (weiInput) => {
    let ethBalance = Web3.utils.fromWei(weiInput, 'ether');
    return ethBalance;
}

const etherToWei = (etherInput) => {
    let ethBalance = Web3.utils.toWei(etherInput, 'ether');
    return ethBalance;
}

contract.on("CampaignCreated", async (
    _campaignId, _owner, _ownerImage, _username, _title, _description, _target, _deadline, _campaignAmountWithdrawn, _image, _status) => {
    try {
        console.log(`Campaign created with ID: ${_campaignId.toString()}`);

        const ref = db.ref(`/${parseInt(_campaignId.toString())}`);
        ref.update({
            campaignId: parseInt(_campaignId),
            owner: _owner.toString(),
            ownerImage: _ownerImage.toString(),
            username: _username.toString(),
            title: _title.toString(),
            description: _description.toString(),
            target: Number(_target),
            deadline: parseInt(_deadline),
            campaignAmountWithdrawn: false,
            image: _image.toString(),
            status: _status
        });

        try {
            const message = `New campaign created:\nTitle: ${_title}\nDescription: ${_description}\nTarget: ${weiToEther(String(_target))} LYX`;
            const imageUrl = _image;
            
            const telegramApiUrl = `https://api.telegram.org/bot${keys.telegramBotToken}/sendPhoto?chat_id=${keys.chatId}&caption=${encodeURIComponent(message)}&photo=${encodeURIComponent(imageUrl)}`;
            await axios.get(telegramApiUrl);
        } catch (error) {
            console.error(error);
        }

    } catch (error) {
        console.error("Error in CampaignCreated event:", error);
    }
});

contract.on("CampaignEdited", (
    _campaignId, _owner, _username, _title, _description, _target, _deadline, _image) => {
    try {
        console.log(`Campaign edited with ID: ${_campaignId.toString()}`);

        const ref = db.ref(`/${parseInt(_campaignId.toString())}`);
        ref.update({
            campaignId: parseInt(_campaignId),
            owner: _owner.toString(),
            username: _username.toString(),
            title: _title.toString(),
            description: _description.toString(),
            target: Number(_target),
            deadline: parseInt(_deadline),
            image: _image.toString()
        });
    } catch (error) {
        console.error("Error in CampaignEdited event:", error);
    }
});

contract.on("CampaignStatusChanged", (
    _campaignId, _owner, _status) => {
    try {
        console.log(`Campaign status changed with ID: ${_campaignId.toString()}`);

        const ref = db.ref(`/${parseInt(_campaignId.toString())}`);
        ref.update({
            status: _status
        });
    } catch (error) {
        console.error("Error in CampaignStatusChanged event:", error);
    }
});

contract.on("ContributionMade", async (
    _campaignId, _contributor, _profileImage, _amountContributed) => {
    try {
        console.log(`Contribution made to campaign with ID: ${_campaignId.toString()}`);

        const ref = db.ref(`/${parseInt(_campaignId.toString())}/contributions`);
        const ref2 = db.ref(`/${parseInt(_campaignId.toString())}/amountContributed`);
        const rootref = db.ref(`/${parseInt(_campaignId.toString())}/`);
        let currentDonatedAmount = (await ref2.get()).val()
        ref.push({
            contributor: _contributor.toString(),
            contributorImg: _profileImage,
            contribution: Number(_amountContributed),
        });
        rootref.update({
            amountContributed: Number(_amountContributed) + currentDonatedAmount
        });

        try {
            const message = `Contribution made to a campaign:\ncampaign ID: ${_campaignId}\nContributor: ${_contributor}\nAmount contributed: ${weiToEther(String(_amountContributed))} LYX`;

            const telegramApiUrl = `https://api.telegram.org/bot${keys.telegramBotToken}/sendMessage?chat_id=${keys.chatId}&text=${encodeURIComponent(message)}`;
            await axios.get(telegramApiUrl);
        } catch (error) {
            console.error(error)
        }
        
    } catch (error) {
        console.error("Error in ContributionMade event:", error);
    }
});

contract.on("AllContributionsWithdrawn", (
    _campaignId) => {
    try {
        console.log(`Campaign contributions withdrawn with ID: ${_campaignId.toString()}`);

        const ref = db.ref(`/${parseInt(_campaignId.toString())}`);
        ref.update({
            campaignAmountWithdrawn: true
        });
    } catch (error) {
        console.error("Error in AllContributionsWithdrawn event:", error);
    }
});

contract.on("ContributionTakenBack", async (
    _campaignId, _contributor, _amountContributed) => {
    try {
        console.log(`Contribution taken back on campaign with ID: ${_campaignId.toString()}`);

        const rootref = db.ref(`/${parseInt(_campaignId.toString())}/contributions`);
        let contributions = (await rootref.get()).val()

        if (contributions) {
            for (const contributionKey in contributions) {
                const contributor = contributions[contributionKey].contributor;

                if (contributor.toLowerCase() === _contributor.toLowerCase()) {
                    const contrRef = db.ref(`/${parseInt(_campaignId.toString())}/contributions/${contributionKey}`);
                    contrRef.remove()
                        .then(() => {
                            console.log(`Removed contribution with key: ${contributionKey}`);
                        })
                        .catch((error) => {
                            console.error(`Error removing contribution: ${error}`);
                        });
                }
            }

            const newRef = db.ref(`/${parseInt(_campaignId.toString())}/amountContributed`);
            const newRef2 = db.ref(`/${parseInt(_campaignId.toString())}`);
            let currentDonatedAmount = (await newRef.get()).val()
            newRef2.update({
                amountContributed: currentDonatedAmount - Number(_amountContributed)
            });
        }

        try {
            const message = `Contribution taken back from a campaign:\ncampaign ID: ${_campaignId}\nContributor: ${_contributor}\nContribution amount taken back: ${weiToEther(String(_amountContributed))} LYX`;
            
            const telegramApiUrl = `https://api.telegram.org/bot${keys.telegramBotToken}/sendMessage?chat_id=${keys.chatId}&text=${encodeURIComponent(message)}`;
            await axios.get(telegramApiUrl);
        } catch (error) {
            console.error(error)
        }
        
    } catch (error) {
        console.error("Error in ContributionTakenBack event:", error);
    }
});

contract.on("AllContributionsWithdrawnTargetNotReached", (
    _campaignId) => {
    try {
        console.log(`All contributions sent back of campaign with ID: ${_campaignId.toString()}`);

        const ref = db.ref(`/${parseInt(_campaignId.toString())}`);
        ref.update({
            campaignAmountWithdrawn: true
        });
    } catch (error) {
        console.error("Error in AllContributionsWithdrawnTargetNotReached event:", error);
    }
});

app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
});