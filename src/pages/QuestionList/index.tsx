import React, { useRef, useState } from 'react';
import { Button, Descriptions, message, Modal } from 'antd';
import { useRequest } from 'umi';
import moment from 'moment';
// import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { ModalForm, ProFormDatePicker, ProFormSelect, ProFormText, ProFormTextArea, ProFormUploadButton } from '@ant-design/pro-form';
import type { ProFormInstance } from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';

import { queryTypes, queryQuestions, updateQuestions } from '@/services/api';
import { prefix } from '@/services/request';

const QuestionList = () => {
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);
  const [detailModalVisible, handleDetailModalVisible] = useState<boolean>(false);
  const [detail, setDetail] = useState<any>(null);
  const [types, setTypes] = useState<any>({});
  const actionRef = useRef<ActionType>(); // table 的 ref
  const modalFormRef = useRef<ProFormInstance>(); // 新建 modal 的 ref

  // 查询类型 map
  useRequest(queryTypes, {
    onSuccess: (data = []) => {
      const newTypes = {};
      data.forEach(item => {
        newTypes[item.code] = {
          text: item.name,
        }
      });
      setTypes(newTypes);
    }
  });
  const editRequest = useRequest(updateQuestions, {
    manual: true,
    onSuccess: (data) => {
      message.success('添加成功');
      handleCreateModalVisible(false);
      actionRef.current?.reloadAndRest?.();
      modalFormRef.current?.resetFields();
      // if (actionRef.current) {
      //   actionRef.current.reload();
      // }
    }
  })

  const columns: ProColumns<API.UpdateQuestionsParams>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      search: false,
      render: (dom, entity, index) => {
        return index + 1;
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      valueEnum: types,
    },
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 200,
      render: (_, record) => [
        <Button
          type='link'
          onClick={() => {
            setDetail(record);
            handleDetailModalVisible(true);
          }}
        >
          详情
        </Button>,
        // <Button
        //   type='link'
        //   onClick={() => {
        //     setDetail(record);
        //     handleCreateModalVisible(true);
        //   }}>
        //   编辑
        // </Button>,
        <Button type='link'>删除</Button>
      ],
    },
  ];

  return (
    <>
      <ProTable<API.UpdateQuestionsParams>
        headerTitle={'题目列表'}
        actionRef={actionRef}
        rowKey="key"
        search={false}
        pagination={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleCreateModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={queryQuestions}
        columns={columns}
      />
      <Modal
        title='题目详情'
        visible={detailModalVisible}
        width={1000}
        footer={null}
        onCancel={() => {
          setDetail(null);
          handleDetailModalVisible(false);
        }}
        destroyOnClose
      >
        {
          detail && <Descriptions bordered>
            <Descriptions.Item label="题目类型">{types[detail.type].text}</Descriptions.Item>
            <Descriptions.Item label="题目年份" span={2}>{moment(detail.date).format('YYYY-MM-DD')}</Descriptions.Item>
            <Descriptions.Item label="题目标题" span={3}>{detail.title}</Descriptions.Item>
            <Descriptions.Item label="题目内容" span={3} style={{ whiteSpace: 'pre-wrap' }}>{detail.content || '-'}</Descriptions.Item>
            {detail.img && <Descriptions.Item label="题目图片" span={3}>
              <img src={detail.img} />
            </Descriptions.Item>}
            <Descriptions.Item label="答案" span={3}>{detail.answer}</Descriptions.Item>
          </Descriptions>
        }
      </Modal>
      <ModalForm
        title={'创建题目'}
        width="800px"
        layout="horizontal"
        formRef={modalFormRef}
        visible={createModalVisible}
        onVisibleChange={handleCreateModalVisible}
        modalProps={{
          confirmLoading: editRequest.loading
        }}
        onFinish={async (value: API.UpdateQuestionsParams) => {
          console.log(value)
          const newParams = {
            content: '',
            ...value,
          }
          if (value?.img) {
            newParams.img = value?.img?.[0]?.response?.data;
          }
          // if (detail?.id) {
          //   newPrarms.id = detail?.id;
          // }
          editRequest.run(newParams);
        }}
      >
        <ProFormSelect
          name="type"
          label="题目类型"
          width="xs"
          rules={[
            {
              required: true,
              message: '题目类型为必选项',
            },
          ]}
          options={Object.keys(types).map(item => ({
            value: item,
            label: types[item].text,
          }))}
        />
        <ProFormDatePicker
          name="date"
          label="题目年份"
          rules={[
            {
              required: true,
              message: '题目年份为必填项',
            },
          ]}
        />
        <ProFormText
          label="标题"
          name="title"
          rules={[
            {
              required: true,
              message: '标题为必填项',
            },
          ]}
        />
        <ProFormTextArea label="内容" name="content" />
        <ProFormUploadButton
          extra="支持扩展名：.jpg .png"
          label="图片"
          name="img"
          title="上传图片"
          action={`${prefix}/uploadfile`}
          max={1}
        />
        <ProFormTextArea label="答案" name="answer"
          rules={[
            {
              required: true,
              message: '答案为必填项',
            },
          ]} />

      </ModalForm>
    </>


  )
}

export default QuestionList;
