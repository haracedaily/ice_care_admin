import React, { useState, useEffect } from 'react';
import { 
    Button, 
    Table, 
    Modal, 
    Form, 
    Input, 
    DatePicker, 
    Select, 
    Switch,
    Space,
    message,
    Upload,
    Radio,
    Divider,
    Breadcrumb
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import locale from 'antd/es/date-picker/locale/ko_KR';
import styles from '../css/popup.module.css';
import { getPopups, addPopup, updatePopup, deletePopup } from '../js/supabasePopup';
import { useNavigate } from 'react-router-dom';

const { RangePicker } = DatePicker;
const { Option } = Select;

const PopupManage = () => {
    const [popups, setPopups] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPopup, setEditingPopup] = useState(null);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [mobileFileList, setMobileFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const popupNavi = useNavigate();

    // 팝업 데이터 로드
    useEffect(() => {
        fetchPopups();
    }, []);

    const fetchPopups = async () => {
        try {
            setTableLoading(true);
            const data = await getPopups();
            setPopups(data);
        } catch (error) {
            message.error('팝업 목록을 불러오는데 실패했습니다.');
            console.error('팝업 로드 실패:', error);
        } finally {
            setTableLoading(false);
        }
    };

    // 이미지 업로드 전 처리
    const beforeUpload = (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('이미지 파일만 업로드 가능합니다!');
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('이미지 크기는 2MB 이하여야 합니다!');
            return false;
        }
        return true;
    };

    // 이미지 업로드 처리
    const handleUpload = (info, isMobile = false) => {
        const { file } = info;
        const targetFileList = isMobile ? setMobileFileList : setFileList;
        
        if (file.status === 'uploading') {
            targetFileList([file]);
            return;
        }
        if (file.status === 'done') {
            const reader = new FileReader();
            reader.readAsDataURL(file.originFileObj);
            reader.onload = () => {
                const fieldName = isMobile ? 'mobile_image_url' : 'image_url';
                form.setFieldsValue({ [fieldName]: reader.result });
                targetFileList([{
                    uid: file.uid,
                    name: file.name,
                    status: 'done',
                    url: reader.result,
                }]);
            };
        }
    };

    // 팝업 추가/수정
    const handleSubmit = async (values) => {
        try {
            setLoading(true);

            // 필수 필드 검증
            if (!values.title || !values.date_range || !values.image_url) {
                message.error('필수 항목을 모두 입력해주세요.');
                return;
            }

            // 날짜 검증
            if (values.date_range[0].isAfter(values.date_range[1])) {
                message.error('종료일은 시작일보다 이후여야 합니다.');
                return;
            }

            const newPopup = {
                title: values.title.trim(),
                display_type: values.display_type,
                display_status: values.display_status,
                start_date: values.date_range[0].format('YYYY-MM-DD HH:mm'),
                end_date: values.date_range[1].format('YYYY-MM-DD HH:mm'),
                display_environment: values.display_environment,
                image_url: values.image_url,
                mobile_image_url: values.mobile_image_url || null,
                link_url: values.link_url || null,
                close_option: values.close_option,
                position_x: values.position_x,
                position_y: values.position_y,
                width: parseInt(values.width) || 500,
                height: parseInt(values.height) || 400
            };

            console.log('저장할 팝업 데이터:', newPopup); // 디버깅용

            if (editingPopup) {
                const result = await updatePopup(editingPopup.id, newPopup);
                if (result) {
                    message.success('팝업이 수정되었습니다.');
                    setIsModalOpen(false);
                    form.resetFields();
                    setEditingPopup(null);
                    setFileList([]);
                    setMobileFileList([]);
                    fetchPopups();
                }
            } else {
                const result = await addPopup(newPopup);
                if (result) {
                    message.success('새 팝업이 추가되었습니다.');
                    setIsModalOpen(false);
                    form.resetFields();
                    setEditingPopup(null);
                    setFileList([]);
                    setMobileFileList([]);
                    fetchPopups();
                }
            }
        } catch (error) {
            console.error('팝업 저장 실패:', error);
            if (error.message) {
                message.error(`팝업 저장에 실패했습니다: ${error.message}`);
            } else {
                message.error('팝업 저장에 실패했습니다. 다시 시도해주세요.');
            }
        } finally {
            setLoading(false);
        }
    };

    // 팝업 삭제
    const handleDelete = async (id) => {
        Modal.confirm({
            title: '팝업 삭제',
            content: '이 팝업을 삭제하시겠습니까?',
            onOk: async () => {
                try {
                    setLoading(true);
                    await deletePopup(id);
                    message.success('팝업이 삭제되었습니다.');
                    fetchPopups();
                } catch (error) {
                    message.error('팝업 삭제에 실패했습니다.');
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    // 팝업 수정 모달 열기
    const handleEdit = (popup) => {
        setEditingPopup(popup);
        form.setFieldsValue({
            ...popup,
            date_range: [dayjs(popup.start_date), dayjs(popup.end_date)]
        });
        if (popup.image_url) {
            setFileList([{
                uid: '-1',
                name: '데스크탑 이미지',
                status: 'done',
                url: popup.image_url,
            }]);
        }
        if (popup.mobile_image_url) {
            setMobileFileList([{
                uid: '-2',
                name: '모바일 이미지',
                status: 'done',
                url: popup.mobile_image_url,
            }]);
        }
        setIsModalOpen(true);
    };

    const columns = [
        {
            title: '제목',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '노출 기간',
            key: 'dateRange',
            render: (_, record) => `${record.start_date} ~ ${record.end_date}`,
        },
        {
            title: '상태',
            dataIndex: 'display_status',
            key: 'display_status',
            render: (status) => (
                <Switch checked={status === 'show'} disabled />
            ),
        },
        {
            title: '유형',
            dataIndex: 'display_type',
            key: 'display_type',
        },
        {
            title: '관리',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button 
                        icon={<EditOutlined />} 
                        onClick={() => handleEdit(record)}
                    />
                    <Button 
                        icon={<DeleteOutlined />} 
                        danger 
                        onClick={() => handleDelete(record.id)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div className={styles.content}>
            <div>
                <Breadcrumb
                    separator=">"
                    items={[
                        {
                            title: 'Home',
                        },
                        {
                            title: '팝업관리',
                            href: '',
                            onClick: (e) => {
                                e.preventDefault();
                                popupNavi("/popup");
                            },
                        },
                    ]}
                />
            </div>
            <div className={styles.contentContainer}>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <Button 
                        type="primary" 
                        icon={<PlusOutlined />} 
                        onClick={() => {
                            setEditingPopup(null);
                            form.resetFields();
                            setFileList([]);
                            setMobileFileList([]);
                            setIsModalOpen(true);
                        }}
                    >
                        새 팝업 추가
                    </Button>
                </div>
                <Table 
                    columns={columns} 
                    dataSource={popups} 
                    rowKey="id"
                    loading={tableLoading}
                    scroll={{ x: 'max-content' }}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `총 ${total}개`,
                        responsive: true
                    }}
                />
            </div>

            <Modal
                title={editingPopup ? "팝업 수정" : "새 팝업 추가"}
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    form.resetFields();
                    setEditingPopup(null);
                    setFileList([]);
                    setMobileFileList([]);
                }}
                footer={null}
                width="90%"
                style={{ maxWidth: '800px' }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        display_status: 'show',
                        display_type: 'modal',
                        display_environment: ['all'],
                        close_option: ['today'],
                        position_x: 'center',
                        position_y: 'center',
                        width: 500,
                        height: 400
                    }}
                >
                    <Form.Item
                        name="title"
                        label="제목"
                        rules={[{ required: true, message: '제목을 입력해주세요' }]}
                    >
                        <Input placeholder="팝업 제목을 입력하세요" />
                    </Form.Item>

                    <Form.Item
                        name="date_range"
                        label="노출 기간"
                        rules={[{ required: true, message: '노출 기간을 선택해주세요' }]}
                    >
                        <RangePicker
                            showTime
                            format="YYYY-MM-DD HH:mm"
                            locale={locale}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>

                    <Form.Item
                        name="display_status"
                        label="상태"
                        rules={[{ required: true, message: '상태를 선택해주세요' }]}
                    >
                        <Select>
                            <Option value="show">노출</Option>
                            <Option value="hide">숨김</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="display_type"
                        label="유형"
                        rules={[{ required: true, message: '유형을 선택해주세요' }]}
                    >
                        <Select>
                            <Option value="modal">모달</Option>
                            <Option value="layer">레이어</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="display_environment"
                        label="노출 환경"
                        rules={[{ required: true, message: '노출 환경을 선택해주세요' }]}
                    >
                        <Radio.Group>
                            <Radio value="all">전체</Radio>
                            <Radio value="pc">PC</Radio>
                            <Radio value="mobile">모바일</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Divider>이미지 설정</Divider>

                    <Form.Item
                        name="image_url"
                        label="PC 이미지"
                        rules={[{ required: true, message: 'PC 이미지를 업로드해주세요' }]}
                    >
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            beforeUpload={beforeUpload}
                            onChange={(info) => handleUpload(info)}
                            maxCount={1}
                            customRequest={({ file, onSuccess }) => {
                                setTimeout(() => {
                                    onSuccess("ok");
                                }, 0);
                            }}
                            onRemove={() => {
                                form.setFieldsValue({ image_url: undefined });
                                setFileList([]);
                            }}
                        >
                            {fileList.length === 0 && <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>업로드</div>
                            </div>}
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        name="mobile_image_url"
                        label="모바일 이미지"
                    >
                        <Upload
                            listType="picture-card"
                            fileList={mobileFileList}
                            beforeUpload={beforeUpload}
                            onChange={(info) => handleUpload(info, true)}
                            maxCount={1}
                            customRequest={({ file, onSuccess }) => {
                                setTimeout(() => {
                                    onSuccess("ok");
                                }, 0);
                            }}
                            onRemove={() => {
                                form.setFieldsValue({ mobile_image_url: undefined });
                                setMobileFileList([]);
                            }}
                        >
                            {mobileFileList.length === 0 && <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>업로드</div>
                            </div>}
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        name="link_url"
                        label="링크 URL"
                    >
                        <Input placeholder="클릭 시 이동할 URL을 입력하세요" />
                    </Form.Item>

                    <Divider>팝업 설정</Divider>

                    <Form.Item
                        name="close_option"
                        label="닫기 옵션"
                        rules={[{ required: true, message: '닫기 옵션을 선택해주세요' }]}
                    >
                        <Select>
                            <Option value="today">오늘 하루 보지 않기</Option>
                            <Option value="always">항상 보기</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="position_x"
                        label="가로 위치"
                        rules={[{ required: true, message: '가로 위치를 선택해주세요' }]}
                    >
                        <Select>
                            <Option value="left">왼쪽</Option>
                            <Option value="center">중앙</Option>
                            <Option value="right">오른쪽</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="position_y"
                        label="세로 위치"
                        rules={[{ required: true, message: '세로 위치를 선택해주세요' }]}
                    >
                        <Select>
                            <Option value="top">상단</Option>
                            <Option value="center">중앙</Option>
                            <Option value="bottom">하단</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="width"
                        label="너비"
                        rules={[{ required: true, message: '너비를 입력해주세요' }]}
                    >
                        <Input type="number" placeholder="픽셀 단위로 입력" />
                    </Form.Item>

                    <Form.Item
                        name="height"
                        label="높이"
                        rules={[{ required: true, message: '높이를 입력해주세요' }]}
                    >
                        <Input type="number" placeholder="픽셀 단위로 입력" />
                    </Form.Item>

                    <Form.Item>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button onClick={() => {
                                setIsModalOpen(false);
                                form.resetFields();
                                setEditingPopup(null);
                                setFileList([]);
                                setMobileFileList([]);
                            }}>
                                취소
                            </Button>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                {editingPopup ? '수정' : '추가'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default PopupManage; 