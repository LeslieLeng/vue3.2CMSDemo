export const APP_KEY: string = 'sleepEarly_api_verify'; // 用于加密验证
import { MD5 } from 'crypto-js';
export function signatureGenerate(params: any): { signature: string; timestamp: number } {
    // 时间戳
    const timestamp: number = Math.floor(new Date().getTime() / 1000);
    let dataStr: string = dataSerialize(dataSort(params));
    // 生成签名
    let strSignParams: string = APP_KEY + dataStr + 'timestamp' + timestamp + APP_KEY;

    let sign: string = MD5(strSignParams).toString();

    return {
        signature: sign,
        timestamp
    };
}

// 参数排序
function dataSort(obj: any): { [key: string]: any } {
    if (JSON.stringify(obj) === '{}' || obj == null) {
        return {};
    }
    const key: string[] = Object.keys(obj)?.sort();
    const newObj: { [key: string]: any } = {};
    for (let i = 0; i < key.length; i++) {
        newObj[key[i]] = obj[key[i]];
    }
    return newObj;
}

// 参数序列化
function dataSerialize(sortObj: { [key: string]: any }): string {
    let strJoin: string = '';
    for (let key in sortObj) {
        if (typeof sortObj[key] === 'object') {
            if (sortObj[key].constructor === Array) {
                let strArr: string = JSON.stringify(sortObj[key]);
                strArr = strArr.replace(/"/g, '');
                strJoin += key + strArr;
            } else {
                strJoin += key + JSON.stringify(sortObj[key]);
            }
        } else {
            if (sortObj[key] !== undefined) {
                strJoin += key + sortObj[key];
            }
        }
    }
    strJoin = strJoin.replace(/"/g, '');
    return strJoin;
}
