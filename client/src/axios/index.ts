import axios from "axios";
import cookieCutter from 'cookie-cutter'

export const API_URL = "http://localhost:5000"
export const staticFile = (link) => `${API_URL}/${link}`

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true
})


api.interceptors.request.use((config) => {
    config.headers.authorization = `Bearer ${localStorage.getItem("access_token")}`
    return config
})

api.interceptors.response.use((config) => {
    return config
}, async (error) => {
    const originalRequest = error.config
    try {
        if (error.response.status == 403 && error.config && !originalRequest._isRetry) {
            originalRequest._isRetry = true
                const res = await axios.post(`${API_URL}/auth/refresh`, {refreshToken: cookieCutter.get("refresh_token")}).then(res => res.data)
                localStorage.setItem("access_token", res.access_token)
                cookieCutter.set("refresh_token", res.refresh_token)
                return api.request(originalRequest)
            }
    } catch(e) {
    }
    throw error
})

export default api