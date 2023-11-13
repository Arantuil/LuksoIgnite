// log
import store from "../store";

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};

export const fetchData = () => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      let account = await store.getState()["blockchain"]["account"];
      let numberOfCampaigns = await store
        .getState()
        .blockchain.smartContract.methods.numberOfCampaigns()
        .call();
      let feePoints = await store
        .getState()
        .blockchain.smartContract.methods.feePoints()
        .call();
      
      dispatch(
        fetchDataSuccess({
          account,
          numberOfCampaigns,
          feePoints
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};
