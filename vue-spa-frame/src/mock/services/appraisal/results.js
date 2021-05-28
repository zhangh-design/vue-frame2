/**
 * @desc 贷款需求管理列表 mock 类
 */
import Mock from 'mockjs2';
import { builder } from '../../util';

const resultsList = options => {
  return builder({
    tableHeaders: [
      '市',
      '区县',
      '园区名称',
      '园区代码',
      '园区类型',
      '用地面积（亩）',
      '建筑面积（亩）',
      '绩效评价'
    ],
    data: {
      results: [
        [
          '杭州市',
          '上城区',
          '杭州市上城区科技创业中心',
          'A02F0001',
          '生产性服务类',
          '222',
          '333',
          'A'
        ],
        [
          '杭州市',
          '上城区',
          '望江智慧产业园',
          'A02F0002',
          '生产性服务类',
          '444',
          '555',
          'A'
        ],
        [
          '杭州市',
          '上城区',
          '望江智慧产业园',
          'A02F0002',
          '生产性服务类',
          '444',
          '555',
          'A'
        ],
        [
          '杭州市',
          '上城区',
          '望江智慧产业园',
          'A02F0002',
          '生产性服务类',
          '444',
          '555',
          'A'
        ],
        [
          '杭州市',
          '上城区',
          '望江智慧产业园',
          'A02F0002',
          '生产性服务类',
          '444',
          '555',
          'A'
        ],
        [
          '杭州市',
          '上城区',
          '望江智慧产业园',
          'A02F0002',
          '生产性服务类',
          '444',
          '555',
          'A'
        ],
        [
          '杭州市',
          '上城区',
          '望江智慧产业园',
          'A02F0002',
          '生产性服务类',
          '444',
          '555',
          'A'
        ],
        [
          '杭州市',
          '上城区',
          '望江智慧产业园',
          'A02F0002',
          '生产性服务类',
          '444',
          '555',
          'A'
        ],
        [
          '杭州市',
          '上城区',
          '望江智慧产业园',
          'A02F0002',
          '生产性服务类',
          '444',
          '555',
          'A'
        ],
        [
          '杭州市',
          '上城区',
          '望江智慧产业园',
          'A02F0002',
          '生产性服务类',
          '444',
          '555',
          'A'
        ]
      ],
      totalPage: 13,
      pageSize: 10,
      pageNum: 1,
      searchCount: true,
      totalRecord: 16
    }
  });
};

Mock.mock(/\/mock\/appraisal\/results\/resultsList/, 'get', resultsList); // 贷款需求管理列表