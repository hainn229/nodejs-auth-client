import { useEffect } from "react";
import { useAsync } from "react-hook-async";
import { useDispatch } from "react-redux";
import { me } from "../api/index";
import * as Types from "./constants";

const getMe = async () => {
  return await me().then((res) => res.data);
};

export const useAuth = () => {
  const dispatch = useDispatch();
  const [apiData, fetchApi] = useAsync({}, getMe);

  useEffect(() => {
    const jwt = localStorage.getItem("token");
    if (jwt) {
      fetchApi(jwt).then((user) => {
        dispatch({ type: Types.FETCH_USER, payload: user });
      });
    }
  }, [fetchApi, dispatch]);
  return apiData;
};

