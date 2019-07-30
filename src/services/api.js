import { stringify } from 'qs';
import request from '@/utils/request';

//下面两个是get和post请求方式的案例，不生效
export async function queryFakeList(params) {
  return request(`/api/rule?${stringify(params)}`);
}
export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

//总结页数据，summary
export async function summaryPage(params) {
  return request('/api/rule/full/getHome', {
    method: 'POST',
    data: params,
  });
}


