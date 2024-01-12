import Axios from "@/axios/axios";

//获取登录人员信息
interface UserInfoResponse {
    code: number;
    data: any;
}
export const GetCurrentUserInfo = (params?:any):Promise<UserInfoResponse> => {
    let url = `/api/admin/userAdmin/info`;
    return new Promise<UserInfoResponse>((resolve, reject) => {
        Axios
            .get(url, params)
            .then((res) => {
                const result = res.data as UserInfoResponse;
                resolve(result);
            })
            .catch((err) => {
                reject(err.data);
            });
    });
};

// 登录
export const Login = (params?:any):Promise<UserInfoResponse> => {
    let url = `/api/admin/login`;
    return new Promise<UserInfoResponse>((resolve, reject) => {
        Axios
            .post(url, params)
            .then((res) => {
                const result = res.data as UserInfoResponse;
                resolve(result);
            })
            .catch((err) => {
                reject(err.data);
            });
    });
};

