import React, { useState } from 'react';
import Table, { ColumnType } from '../../src/index';
import '../../src/styles/index.scss';

// 用户信息
interface User {  
  key: string;
  // 姓名
  name: string;  
  // 年龄
  age: number; 
  // 昵称
  nickname: string;
  // 宠物
  pet: string;
  // 地址
  address: string; 
  // 性别
  gender: string;
  // 生日
  birthday: string;
  // 备注
  remark: string;
  // 创建时间
  createTime: string;
  // 更新时间
  updateTime: string;
} 

const columns: ColumnType<User>[] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sortable: true,
    width: 150,
    fixed: 'left',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    sortable: true,
    width: 150,
    fixed: 'left',
  },
  {
    title: 'Nickname',
    dataIndex: 'nickname',
    key: 'nickname',
  },
  {
    title: 'pet',
    dataIndex: 'pet',
    key: 'pet',
  },
  {
    title: 'gender',
    dataIndex: 'gender',
    key: 'gender',
  },
  {
    title: 'birthday',
    dataIndex: 'birthday',
    key: 'birthday',
  },
  {
    title: 'remark',
    dataIndex: 'remark',
    key: 'remark',
  },
  {
    title: 'createTime',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    title: 'updateTime',
    dataIndex: 'updateTime',
    width: 120,
    fixed: 'right',
    key: 'updateTime',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
    width: 200,
    fixed: 'right',
  },
];

const dataSource: User[] = [];

for (let i = 1; i <= 1000; i++) {
  dataSource.push({
    key: `${i}`,
    name: `Jim Red ${i}`,
    age: Math.floor(Math.random() * 100),
    nickname: 'Red',
    pet: 'cat',
    gender: 'male',
    birthday: '1990-01-01',
    remark: 'remark',
    createTime: '2021-01-01',
    updateTime: '2021-01-01',
    address: 'London No. 2 Lake Park',
  })
}

function App() {
  // 分页
  const [pagenation, setPagenation] = useState({
    current: 1,
    total: dataSource.length,
    pageSize: 20,
  });

  return (
    <div className='container pt-5 pb-5'>
      <Table 
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: 1500, y: 400 }}
        sticky
        pagenation={{
          current: pagenation.current,
          total: pagenation.total,
          pageSize: pagenation.pageSize,
          onChange: (page) => setPagenation({ ...pagenation, current: page }),
          onPageSizeChange: (page, size) => setPagenation({ ...pagenation, current: page, pageSize: size })
        }} />
    </div>
  )
}

export default App
