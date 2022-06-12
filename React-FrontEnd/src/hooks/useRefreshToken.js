import axios from '../api/axios'
import useAuth from './useAuth'

const useRefreshToken = () => {

  
  const REFRESH_URL ="/api/Authentication/refresh-token";
  const {auth} = useAuth();
  const refresh = async () => {

    const jwt = auth.accessToken;
    const refreshToken = auth.refreshToken;
    const response = await axios.post(REFRESH_URL,
      JSON.stringify({refreshToken:refreshToken,token:jwt}),
      {
          headers:{'Content-Type':'application/json'},
          withCredentials:true
      });

      return response.data.token;
  
  };
  return refresh;
};

export default useRefreshToken