/** @format */
import axios from 'axios';
import { message, Modal } from 'antd';
import { emitter } from '@/utils/app-emitter';
import { globalConfig } from '@/globalConfig';

export let api;
let appEnv = process.env.APP_ENV;

api = axios.create({
  baseURL: appEnv === 'development' ? globalConfig.devBaseUrl : globalConfig.prodBaseUrl,
});

// 请求拦截器
api.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  config.headers.token =
    'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0IiwiY3JlYXRlZCI6MTY3NTYwNzY3NDkzOCwiaWQiOjIsImV4cCI6MTY3NjIxMjQ3NH0.zHfkvC6FNnLIrTDDu310z5oKNnPeeSaqMOJ_I2Crn5yId28UPZsc9bdVZm2s2O2H4EpkF9h16wFXxA37rnUP9g';
  // if (token) {
  //   console.log('token', token);
  //   config.headers.token = `${token}`;
  // }
  return config;
});

// 响应拦截器
api.interceptors.response.use(
  function (res) {
    if (res?.data?.code != 200) {
      message.error(res.data.message);
    }
    if (res.data.code === 21004) {
      Modal.error({
        title: '重新登录',
        content: 'token已过期，请重新登录',
        onOk() {
          emitter.fire(emitter.type.logout);
        },
      });
    }

    return res.data;
  },
  function (res) {
    try {
      const { status, data } = res.response;

      if (status >= 500) {
        message.warning('网络异常');
        return Promise.reject(res);
      }
    } catch (e) {
      message.warning('网络异常');
      return;
    }
  },
);
