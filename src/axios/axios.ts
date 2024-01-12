import axios, {  AxiosResponse, AxiosError } from 'axios';
import { message,Modal } from 'ant-design-vue';
import { signatureGenerate } from '@/utils/signature'
import { useUserStore } from '@/store/user';
import router from '@/router/router'




 const Axios = axios.create({
     baseURL:import.meta.env.VITE_BASE_URL || '',
     timeout:500
 })
// 请求拦截器
Axios.interceptors.request.use(
    (config: any) => {
        const store = useUserStore();
        // 增加签名
        let data;
        if (config.method === 'get') {
            data = {params:config.params}
        } else {
            data = config.data;
        }
        const { signature, timestamp } = signatureGenerate(data);

        if (signature) {
            config.headers['sign'] = signature;
        }
        if (timestamp) {
            config.headers['timestamp'] = timestamp;
        }

        const token = store.Authorization;

        if ( token) {
            config.headers['X-Token'] = token;
        }

        return config;
    },
    (err: AxiosError) => {
        return Promise.reject(err);
    }
);

// 响应拦截器
Axios.interceptors.response.use(
    (response: AxiosResponse) => {

        const store = useUserStore();
        store.loading = false;
        if (response.status === 200) {
            if (response.request.responseType === 'blob') {
                const resData = response.data;
                const fileReader = new FileReader();
                fileReader.onloadend = () => {
                    try {
                        const resData = JSON.parse(fileReader.result as string); // 说明是普通对象数据
                        if (resData.code !== 200) {
                            console.debug(1, resData.data);
                            const msg = resData.message ? resData.message : resData.msg;
                            message.error(msg);
                        }
                    } catch (err) {
                        // 解析成对象失败，说明是正常的文件流
                        // 下载文件
                        store.loading = false;
                    }
                };
                fileReader.readAsText(resData);
            } else {
                if (response.data.code !== 200) {
                    if (response.data.code === 403) {
                        Modal.error({
                            title: 'Token已过期，请重新登录',
                            okText: '确定',
                            onOk: () => {
                                router.push('/login');
                            },
                        });
                    } else {
                        console.debug(2, response.data);
                        const msg = response.data.message ? response.data.message : response.data.msg;
                        message.error(msg);
                    }
                }
            }
            store.loading = false;
            return Promise.resolve(response);
        } else {
            store.loading = false;
            return Promise.reject(response);
        }
    },
    (error: AxiosError) => {

        const store = useUserStore();
        if (error.response) {
            if (error.response.status === 403) {
                Modal.error({
                    title: 'Token失效,请重新登录！',
                    okText: '确定',
                    onOk: () => {
                        router.push('/login');
                    },
                });
            } else if (error.response.status === 401) {
                Modal.error({
                    title: '没有权限！',
                    okText: '确定',
                });
            } else {
                console.debug(3, error.response);
                Modal.error({
                    title: error.response.statusText,
                    okText: '确定',
                });
            }
            store.loading = false;
            return Promise.reject(error.response.data);
        }
    }
);

export default Axios;
