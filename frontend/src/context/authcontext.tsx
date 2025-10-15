"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import API from "../services/api"; // keep or ignore if you already have it
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: any;
  token: string | null;
  refreshToken: string | null;
  login: (data: { user: any; token: string; refreshToken?: string }) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  refreshToken: null,
  login: () => {},
  logout: () => {},
  refreshAccessToken: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  // ✅ Load user data and tokens on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    const savedRefresh = localStorage.getItem("refreshToken");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    if (savedRefresh) setRefreshToken(savedRefresh);
  }, []);

  // ✅ Enhanced login
  const login = (data: { user: any; token: string; refreshToken?: string }) => {
    const { user, token, refreshToken } = data;

    // ensure user object has a proper name
    const formattedUser = {
      _id: user?._id,
      name: user?.name || user?.username || "User",
      email: user?.email,
      role: user?.role,
    };

    setUser(formattedUser);
    setToken(token);
    if (refreshToken) setRefreshToken(refreshToken);

    localStorage.setItem("user", JSON.stringify(formattedUser));
    localStorage.setItem("token", token);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
  };

  // ✅ Logout and cleanup
  const logout = () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    router.push("/");
  };

  // ✅ Refresh token function (optional)
  const refreshAccessToken = async () => {
    if (!refreshToken) return logout();
    try {
      const { data } = await API.post("/auth/refresh", { token: refreshToken });
      setToken(data.accessToken);
      localStorage.setItem("token", data.accessToken);
    } catch {
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, refreshToken, login, logout, refreshAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};






// "use client";
// import { createContext, useState, useEffect, ReactNode } from "react";
// import API from "../services/api";
// import { useRouter } from "next/navigation";

// interface AuthContextType {
//   accessToken: string | null;
//   refreshToken: string | null;
//   user: any | null;
//   login: (data: any) => void;
//   logout: () => void;
//   refreshAccessToken: () => Promise<void>;
// }

// export const AuthContext = createContext<AuthContextType>({
//   accessToken: null,
//   refreshToken: null,
//   user: null,
//   login: () => {},
//   logout: () => {},
//   refreshAccessToken: async () => {},
// });

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const router = useRouter();
//   const [accessToken, setAccessToken] = useState<string | null>(null);
//   const [refreshToken, setRefreshToken] = useState<string | null>(null);
//   const [user, setUser] = useState<any | null>(null);

//   useEffect(() => {
//     const savedAccess = localStorage.getItem("accessToken");
//     const savedRefresh = localStorage.getItem("refreshToken");
//     const savedUser = localStorage.getItem("user");
//     if (savedAccess) setAccessToken(savedAccess);
//     if (savedRefresh) setRefreshToken(savedRefresh);
//     if (savedUser) setUser(JSON.parse(savedUser));
//   }, []);

//   const login = (data: any) => {
//     setAccessToken(data.accessToken);
//     setRefreshToken(data.refreshToken);
//     setUser({
//       _id: data._id,
//       name: data.name,
//       email: data.email,
//       role: data.role,
//     });

//     localStorage.setItem("accessToken", data.accessToken);
//     localStorage.setItem("refreshToken", data.refreshToken);
//     localStorage.setItem(
//       "user",
//       JSON.stringify({
//         _id: data._id,
//         name: data.name,
//         email: data.email,
//         role: data.role,
//       })
//     );
//   };

//   const logout = () => {
//     setAccessToken(null);
//     setRefreshToken(null);
//     setUser(null);
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     localStorage.removeItem("user");
//     router.push("/");
//   };

//   const refreshAccessToken = async () => {
//     if (!refreshToken) return logout();
//     try {
//       const { data } = await API.post("/auth/refresh", { token: refreshToken });
//       setAccessToken(data.accessToken);
//       localStorage.setItem("accessToken", data.accessToken);
//     } catch {
//       logout();
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         accessToken,
//         refreshToken,
//         user,
//         login,
//         logout,
//         refreshAccessToken,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

