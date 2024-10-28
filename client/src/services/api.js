import axios from 'axios'

const api = axios.create({
    baseURL: "http://127.0.0.1:5555/",
})

api.defaults.headers.common['Content-Type']='application/json'
export default api