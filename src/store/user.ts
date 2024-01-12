import { defineStore } from 'pinia'
import {GetCurrentUserInfo} from "@/api/home";

interface IUserStore {
    Authorization: string;
    nickname: string;
    ownId: string;
    loading: boolean;
    userRole: Array<object>;
}

export const useUserStore = defineStore('user', {
    state: (): IUserStore => ({
        Authorization: '',
        nickname: '',
        ownId: '',
        loading: false,
        userRole: [],
    }),
    actions: {
        initUserRole(list: Array<object>): void {
            this.userRole = list;
        },

        async getUserRole(): Promise<Array<object>> {
            const menuData: Array<object> = [
                {
                    id: 2,
                    name: '图片管理',
                    text: '/image-manage',
                    icon: 'InboxOutlined',
                    menu:[
                        {
                            id: 21,
                            name: '图片列表',
                            text: '/image-manage/imageList',
                            function: []
                        },
                        {
                            id: 22,
                            name: '图片详情',
                            text: '/image-manage/ImageDetail',
                            function: []
                        },
                    ]
                }
                // ... menu data ...
            ];
            try {
                const result = await GetCurrentUserInfo() ;
                if (result.code === 200) {
                    if (result.data.is_admin === 1) {
                        const manage = {
                            id: 1,
                            name: '用户管理',
                            text: '/user-manage',
                            icon: 'DesktopOutlined',
                            menu: [
                                {
                                    id: 11,
                                    name: '用户列表',
                                    text: '/user-manage/userList',
                                    function: [],
                                },
                                {
                                    id: 12,
                                    name: '用户详情',
                                    text: '/user-manage/userDetail',
                                    function: [],
                                },
                            ],
                        };
                        menuData.unshift(manage);
                    }
                    this.initUserRole(menuData);
                    return menuData;
                }
            } catch (error) {
                console.error(error);
            }
            return [];
        },
    },
    //开启持久化
    persist: true

});
