import axios, { type AxiosInstance } from 'axios'

const apiClient: AxiosInstance = axios.create({
    baseURL: 'http:localhost:3003',
    timeout: 5000,
    headers:{
        'Content-Type':'aplication/json'
    }
})

apiClient.interceptors.request.use((config)=>{  return config})

apiClient.interceptors.response.use((response)=>{ return response } ,(error)=>{})
