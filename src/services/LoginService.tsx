import axios from 'axios';

interface TokenType {
  token?: string;
}

const { REACT_APP_API_URL } = process.env;

export default class LoginService {
  static async login(userName: string, psw: string) {
    return axios.post<TokenType>(
      `${REACT_APP_API_URL}/auth/login`,
      {},
      {
        auth: {
          username: userName,
          password: psw,
        },
        withCredentials: true,
      },
    );
  }

  static async logOut() {
    const logout = await axios.post(
      `${REACT_APP_API_URL}/auth/logout`,
      {},
      {
        withCredentials: true,
      },
    );
    return logout.data;
  }

  static async getCurrentUser() {
    const userProfile = await axios.get(`${REACT_APP_API_URL}/users/current`, {
      withCredentials: true,
    });

    return userProfile.data || null;
  }
}
