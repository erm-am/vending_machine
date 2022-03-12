import axios from "axios";

const createMainAxiosInstance = () => {
  return axios.create({
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 300000,
  });
};

const createRequestInterceptor = (instance) => {
  instance.interceptors.request.use(
    async (config) => config,
    (err) => Promise.reject(err)
  );
};
const createResponseInterceptor = (instance) => {
  instance.interceptors.response.use(
    (response) => response.data, // (!)
    (err) => Promise.reject(err)
  );
};

const axiosInstance = createMainAxiosInstance();

createRequestInterceptor(axiosInstance);
createResponseInterceptor(axiosInstance);

export { axiosInstance };
