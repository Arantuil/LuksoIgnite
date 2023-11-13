// fetch-profile.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
// import { getUserAddress } from './connect';

const FetchProfile = () => {
    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);

    const getData = () => {
        if (blockchain.account !== "") {
            dispatch(fetchData(blockchain.account));
        }
    };

    useEffect(() => {
        getData();
    }, []);


    return (
        <div>
            {data ? (
                <div>
                    {/* <p>Profile from the backend:</p> */}
                    {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
                    <p>Profile data: {JSON.stringify(data.profileData.issuedAssetsDataKey.name
                    )}</p>
                    <p>SupportedStandards in LSP3Profile: {JSON.stringify(data.profileData.profileData[0].value)}</p>

                    <p>ipfs Profile: {"https://universalpage.dev/api/ipfs/" + JSON.stringify(data.profileData.profileData[1]?.value.url).replace(/["']/g, "").replace("ipfs://", "")}</p>


                    {/* <pre>{JSON.stringify(data.profileData, null, 2)}</pre>

  <h2>Issued Assets Data</h2>
  <pre>{JSON.stringify(data.issuedAssetsDataKey, null, 2)}</pre>

  <h2>Received Assets Data</h2>
  <pre>{JSON.stringify(data.receivedAssetsDataKey, null, 2)}</pre>

  <h2>Universal Receiver Data</h2>
  <pre>{JSON.stringify(data.universalReceiverDataKey, null, 2)}</pre> */}


                </div>
            ) : (
                <p>Loading profile data...</p>
            )}
        </div>
    );
};

export { FetchProfile };
