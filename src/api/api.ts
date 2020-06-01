/* eslint-disabled */
import axios, {AxiosPromise, AxiosInstance} from 'axios';
import qs from 'qs';
import jsonp from 'jsonp';
import lodash from 'lodash';
import {router} from '@/router/index';

interface ApiList {
  [key: string]: {
    url: string; // 请求地址
    fetchType?: string; // 数据格式，支持json,formData
    method?: string; // 请求方法
    headers?: any; // 头部携带信息
  };
}

interface Options {
  data: any;
  url: string;
  fetchType?: string;
  method?: string;
  headers?: any;
}

interface Apis<T> {
  [key: string]: (data: object) => Promise<T>;
}

export default class Api {
  service: AxiosInstance;

  // 请求列表，在这里添加相应接口
  apiList: ApiList = {
    //用户类
    login: {
      url: '/user/login',
      fetchType: 'json',
      method: 'post',
    },
    userList: {
      url: '/user/list',
      fetchType: 'json',
      method: 'post',
    },
    userUpdate: {
      url: '/user/update',
      fetchType: 'json',
      method: 'post',
    },
    userDelete: {
      url: '/user/delete',
      fetchType: 'json',
      method: 'post',
    },
    logout: {
      url: '/user/logout',
      fetchType: 'json',
      method: 'post',
    },
    getUserInfo: {
      url: '/user/getUserInfo',
      fetchType: 'json',
      method: 'post',
    },
    //看板类
    dashboard: {
      url: '/dashboard',
      fetchType: 'json',
      method: 'post',
    },
    // 反馈表类
    feedbackAdd: {
      url: '/feedback/feedbackAdd',
      fetchType: 'json',
      method: 'post',
    },
    feedbackUpdate: {
      url: '/feedback/feedbackUpdate',
      fetchType: 'json',
      method: 'post',
    },
    feedbackDelete: {
      url: '/feedback/feedbackDelete',
      fetchType: 'json',
      method: 'post',
    },

    // 课程报名表
    courseEnrollAdd: {
      url: '/courseEnroll/courseEnrollAdd',
      fetchType: 'json',
      method: 'post',
    },
    courseEnrollUpdate: {
      url: '/courseEnroll/courseEnrollUpdate',
      fetchType: 'json',
      method: 'post',
    },
    courseEnrollDelete: {
      url: '/courseEnroll/courseEnrollDelete',
      fetchType: 'json',
      method: 'post',
    },
    //课程表

    //轮播表
    bannerBaseInfoAdd: {
      url: '/coursel/courselAdd',
      fetchType: 'json',
      method: 'post',
    },
    bannerBaseInfoUpdate: {
      url: '/coursel/courselUpdate',
      fetchType: 'json',
      method: 'post',
    },
    bannerBaseInfoDelete: {
      url: '/coursel/courselDelete',
      fetchType: 'json',
      method: 'post',
    },
    bannerBaseInfoUpdateStatus: {
      url: '/coursel/courselUpdateStatus',
      fetchType: 'json',
      method: 'post',
    },

    // 教师管理
    teacherBaseInfoAdd: {
      url: '/teacher/teacherAdd',
      fetchType: 'json',
      method: 'post',
    },
    teacherBaseInfoUpdate: {
      url: '/teacher/teacherUpdate',
      fetchType: 'json',
      method: 'post',
    },
    teacherBaseInfoDelete: {
      url: '/teacher/teacherDelete',
      fetchType: 'json',
      method: 'post',
    },
    teacherCommentList: {
      url: '/teacher/comment/list',
      fetchType: 'json',
      method: 'post',
    },
    teacherCommentUpdate: {
      url: '/teacher/comment/update',
      fetchType: 'json',
      method: 'post',
    },
    teacherCommentDelete: {
      url: '/teacher/comment/delete',
      fetchType: 'json',
      method: 'post',
    },
    //表
    articleAdd: {
      url: '/article/articleAdd',
      fetchType: 'json',
      method: 'post',
    },
    articleUpdate: {
      url: '/article/articleUpdate',
      fetchType: 'json',
      method: 'post',
    },
    articleDelete: {
      url: '/article/articleDelete',
      fetchType: 'json',
      method: 'post',
    },
    articleCommentList: {
      url: '/article/comment/list',
      fetchType: 'json',
      method: 'post',
    },
    articleCommentUpdate: {
      url: '/article/comment/update',
      fetchType: 'json',
      method: 'post',
    },
    articleCommentDelete: {
      url: '/article/comment/delete',
      fetchType: 'json',
      method: 'post',
    },

    //学生作品表
    studentWorksList: {
      url: '/studentWorks/studentWorksList',
      fetchType: 'json',
      method: 'post',
    },
    studentWorksAdd: {
      url: '/studentWorks/studentWorksAdd',
      fetchType: 'json',
      method: 'post',
    },
    studentWorksUpdate: {
      url: '/studentWorks/studentWorksUpdate',
      fetchType: 'json',
      method: 'post',
    },
    studentWorksDelete: {
      url: '/studentWorks/studentWorksDelete',
      fetchType: 'json',
      method: 'post',
    },

    //画室信息表
    paintingStudioInfo: {
      url: '/paintingStudio/list',
      fetchType: 'json',
      method: 'post',
    },
    paintingStudioUpdate: {
      url: '/paintingStudio/update',
      fetchType: 'json',
      method: 'post',
    },
    //3D画廊表
    galleryPicturesUpdate: {
      url: '/galleryPictures/update',
      fetchType: 'json',
      method: 'post',
    },

    // 画室环境
    environmentAdd: {
      url: '/environment/environmentAdd',
      fetchType: 'json',
      method: 'post',
    },
    environmentUpdate: {
      url: '/environment/environmentUpdate',
      fetchType: 'json',
      method: 'post',
    },
    environmentDelete: {
      url: '/environment/environmentDelete',
      fetchType: 'json',
      method: 'post',
    },
    //画室课程

    courseAdd: {
      url: '/course/add',
      fetchType: 'json',
      method: 'post',
    },
    courseUpdate: {
      url: '/course/update',
      fetchType: 'json',
      method: 'post',
    },
    courseDelete: {
      url: '/course/delete',
      fetchType: 'json',
      method: 'post',
    },
    scheduleList: {
      url: '/schedule/list',
      fetchType: 'json',
      method: 'post',
    },
    scheduleUpdate: {
      url: '/schedule/update',
      fetchType: 'json',
      method: 'post',
    },
    bookScheduleList: {
      url: '/bookschedule/list',
      fetchType: 'json',
      method: 'post',
    },
    bookScheduleUpdate: {
      url: '/bookschedule/update',
      fetchType: 'json',
      method: 'post',
    },
    bookScheduleDelete: {
      url: '/bookschedule/delete',
      fetchType: 'json',
      method: 'post',
    },
  };
  // 对外暴露方法
  api: Apis<any> = {};

  constructor(options: {baseUrl: string}) {
    // eslint-ignore-nextline
    this.service = axios.create({
      baseURL: options.baseUrl, // api的base_url
      timeout: 20000, // 请求超时时间
    });
    for (const i in this.apiList) {
      this.api[i] = (data: any) => {
        const {url} = this.apiList[i];
        if (i === 'gpsToAddress') {
          data = {
            callback: 'renderReverse',
            coordtype: data.coordinateSystem,
            location: `${data.lat},${data.lng}`,
            output: 'json',
            pois: 1,
            ak: '3oWu5SgExpeyXtRXbuDdRO08CoVMTloM',
          };
        }
        return this.request({
          method: this.apiList[i].method,
          data,
          fetchType: this.apiList[i].fetchType,
          url,
          headers: this.apiList[i].headers,
        });
      };
    }
  }

  request = (options: Options) =>
    this.fetch(options)
      .then((response: any) => {
        const {statusText, status} = response;
        let {data} = response;
        if (data instanceof Array) {
          data = {
            list: data,
          };
        }
        // 登录超时判断
        if (response.data.result && response.data.result.resultCode === 3) {
          router.replace({name: 'login'});
          return Promise.reject({
            success: false,
            message: response.data.result.resultMessage,
          });
        }
        if (response.data.resultCode && response.data.resultCode === 401) {
          router.replace({name: 'login'});
          return Promise.reject({
            success: false,
            message: response.data.result.resultMessage,
          });
        }
        return Promise.resolve({
          success: true,
          message: statusText,
          statusCode: status,
          data,
        });
      })
      .catch((error: any) => {
        const {response} = error;
        if (response.status === 401) {
          router.replace({name: 'login'});
        }
        return Promise.reject({
          success: false,
          status,
          message: response.data.err_msg,
        });
      });

  fetch = (options: Options) => {
    const {url, data, fetchType, method = 'get'} = options;
    let cloneData: any = lodash.cloneDeep(data);
    cloneData = qs.stringify(cloneData);
    const headers = {
      // token: window.localStorage.getItem('token'),
      ...options.headers,
    };

    if (fetchType === 'jsonp') {
      return new Promise((resolve, reject) => {
        jsonp(
          url,
          {
            param: `${qs.stringify(data)}&callback`,
            name: `jsonp_${new Date().getTime()}`,
            timeout: 4000,
          },
          (error, result) => {
            if (error) {
              reject(error);
            }
            resolve({statusText: 'OK', status: 200, data: result});
          },
        );
      });
    }
    if (fetchType === 'json') {
      return this.service({
        url,
        method: method.toLowerCase(),
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        data,
        params: {
          token: localStorage.getItem('token'),
        },
      });
    }
    if (fetchType === 'jsonfile') {
      return axios.get(url, {headers});
    }
    if (fetchType === 'mock') {
      return axios.get(url, {headers});
    }
    switch (method.toLowerCase()) {
      case 'get':
        return this.service.get(`${url}?${cloneData}`, {headers});
      case 'delete':
        return this.service.delete(url, {
          data: cloneData,
          headers,
        });
      case 'post':
        return this.service.post(url, cloneData, {headers});
      case 'put':
        return this.service.put(url, cloneData, {headers});
      case 'patch':
        return this.service.patch(url, cloneData, {headers});
      default:
        return this.service(options);
    }
  };
}
