import React, { useState } from 'react';
import { Table, Button, Popconfirm, Card, Select, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useMediaQuery } from 'react-responsive';
import {supabase} from "../js/supabase.js";


const { Option } = Select;

const ReservationTable = ({ reservations, onEdit, onDelete, onUpdate }) => {
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const [editingCell, setEditingCell] = useState({ res_no: null, field: null });

    const handleUpdate = async (res_no, field, value) => {
        try {
            const { error } = await supabase
                .from('ice_res')
                .update({ [field]: value })
                .eq('res_no', res_no);
            if (error) throw error;
            onUpdate();
            message.success('수정 완료!', 2);
        } catch (error) {
            console.error(`Error updating ${field}:`, error.message);
            message.error(`수정 실패: ${error.message}`, 3);
        }
        setEditingCell({ res_no: null, field: null });
    };

    const cellStyle = {
        border: '1px solid #d9d9d9',
        borderRadius: '4px',
        padding: '4px 8px',
        cursor: 'pointer',
        transition: 'border-color 0.3s',
        display: 'inline-block',
    };

    const cellHoverStyle = {
        borderColor: '#1890ff',
    };

    const selectStyle = {
        width: '100%',
        border: '2px solid #1890ff',
        borderRadius: '4px',
    };

    const columns = [
        {
            title: '예약번호',
            dataIndex: 'res_no',
            key: 'res_no',
            width: 100,
            responsive: ['xs', 'sm', 'md', 'lg'],
        },
        {
            title: '이름',
            dataIndex: 'name',
            key: 'name',
            width: 120,
            responsive: ['xs', 'sm', 'md', 'lg'],
        },
        {
            title: '연락처',
            dataIndex: 'tel',
            key: 'tel',
            width: 150,
            responsive: ['md', 'lg'],
        },
        {
            title: '이메일',
            dataIndex: 'email',
            key: 'email',
            width: 200,
            responsive: ['md', 'lg'],
        },
        {
            title: '주소',
            dataIndex: 'addr',
            key: 'addr',
            width: 200,
            responsive: ['lg'],
        },
        {
            title: '예약 날짜',
            dataIndex: 'date',
            key: 'date',
            width: 120,
            render: (text) => dayjs(text).format('YYYY-MM-DD'),
            responsive: ['xs', 'sm', 'md', 'lg'],
        },
        {
            title: '예약 시간',
            dataIndex: 'time',
            key: 'time',
            width: 150,
            render: (time, record) => (
                editingCell.res_no === record.res_no && editingCell.field === 'time' ? (
                    <Select
                        value={time}
                        onChange={(value) => handleUpdate(record.res_no, 'time', value)}
                        style={selectStyle}
                        onBlur={() => setEditingCell({ res_no: null, field: null })}
                        autoFocus
                        dropdownStyle={{ minWidth: '150px' }}
                    >
                        <Option value="오전 10시 ~ 오후 1시">오전 10시 ~ 오후 1시</Option>
                        <Option value="오후 2시 ~ 오후 5시">오후 2시 ~ 오후 5시</Option>
                        <Option value="오후 4시 ~ 오후 7시">오후 4시 ~ 오후 7시</Option>
                        <Option value="오후 6시 ~ 오후 9시">오후 6시 ~ 오후 9시</Option>
                    </Select>
                ) : (
                    <span
                        onClick={() => setEditingCell({ res_no: record.res_no, field: 'time' })}
                        style={cellStyle}
                        onMouseEnter={(e) => (e.target.style.borderColor = cellHoverStyle.borderColor)}
                        onMouseLeave={(e) => (e.target.style.borderColor = '#d9d9d9')}
                    >
                        {time || '미지정'}
                    </span>
                )
            ),
            responsive: ['md', 'lg'],
        },
        {
            title: '모델명',
            dataIndex: 'model',
            key: 'model',
            width: 150,
            responsive: ['lg'],
        },
        {
            title: '용량',
            dataIndex: 'capacity',
            key: 'capacity',
            width: 120,
            render: (capacity, record) => (
                editingCell.res_no === record.res_no && editingCell.field === 'capacity' ? (
                    <Select
                        value={capacity}
                        onChange={(value) => handleUpdate(record.res_no, 'capacity', value)}
                        style={selectStyle}
                        onBlur={() => setEditingCell({ res_no: null, field: null })}
                        autoFocus
                        dropdownStyle={{ minWidth: '120px' }}
                    >
                        <Option value="1">20~50kg</Option>
                        <Option value="2">50~100kg</Option>
                        <Option value="3">100kg 이상</Option>
                    </Select>
                ) : (
                    <span
                        onClick={() => setEditingCell({ res_no: record.res_no, field: 'capacity' })}
                        style={cellStyle}
                        onMouseEnter={(e) => (e.target.style.borderColor = cellHoverStyle.borderColor)}
                        onMouseLeave={(e) => (e.target.style.borderColor = '#d9d9d9')}
                    >
                        {capacity === '1' ? '20~50kg' : capacity === '2' ? '50~100kg' : capacity === '3' ? '100kg 이상' : '미지정'}
                    </span>
                )
            ),
            responsive: ['lg'],
        },
        {
            title: '선택 서비스',
            dataIndex: 'service',
            key: 'service',
            width: 100,
            render: (service, record) => (
                editingCell.res_no === record.res_no && editingCell.field === 'service' ? (
                    <Select
                        value={service}
                        onChange={(value) => handleUpdate(record.res_no, 'service', value)}
                        style={selectStyle}
                        onBlur={() => setEditingCell({ res_no: null, field: null })}
                        autoFocus
                        dropdownStyle={{ minWidth: '100px' }}
                    >
                        <Option value="청소">청소</Option>
                        <Option value="수리">수리</Option>
                    </Select>
                ) : (
                    <span
                        onClick={() => setEditingCell({ res_no: record.res_no, field: 'service' })}
                        style={cellStyle}
                        onMouseEnter={(e) => (e.target.style.borderColor = cellHoverStyle.borderColor)}
                        onMouseLeave={(e) => (e.target.style.borderColor = '#d9d9d9')}
                    >
                        {service || '미지정'}
                    </span>
                )
            ),
            responsive: ['md', 'lg'],
        },
        {
            title: '서비스 주기',
            dataIndex: 'cycle',
            key: 'cycle',
            width: 150,
            render: (cycle, record) => (
                editingCell.res_no === record.res_no && editingCell.field === 'cycle' ? (
                    <Select
                        value={cycle}
                        onChange={(value) => handleUpdate(record.res_no, 'cycle', value)}
                        style={selectStyle}
                        onBlur={() => setEditingCell({ res_no: null, field: null })}
                        autoFocus
                        dropdownStyle={{ minWidth: '150px' }}
                    >
                        <Option value="이번 한 번만">이번 한 번만</Option>
                        <Option value="한 달에 한 번">한 달에 한 번</Option>
                    </Select>
                ) : (
                    <span
                        onClick={() => setEditingCell({ res_no: record.res_no, field: 'cycle' })}
                        style={cellStyle}
                        onMouseEnter={(e) => (e.target.style.borderColor = cellHoverStyle.borderColor)}
                        onMouseLeave={(e) => (e.target.style.borderColor = '#d9d9d9')}
                    >
                        {cycle || '없음'}
                    </span>
                )
            ),
            responsive: ['lg'],
        },
        {
            title: '추가 서비스 선택',
            dataIndex: 'add',
            key: 'add',
            width: 200,
            render: (add, record) => (
                editingCell.res_no === record.res_no && editingCell.field === 'add' ? (
                    <Select
                        value={add}
                        onChange={(value) => handleUpdate(record.res_no, 'add', value)}
                        style={selectStyle}
                        onBlur={() => setEditingCell({ res_no: null, field: null })}
                        autoFocus
                        dropdownStyle={{ minWidth: '200px' }}
                    >
                        <Option value="심화 청소">심화 청소</Option>
                        <Option value="물탱크 청소">물탱크 청소</Option>
                        <Option value="필터 교체">필터 교체</Option>
                        <Option value="선택 안함">선택 안함</Option>
                    </Select>
                ) : (
                    <span
                        onClick={() => setEditingCell({ res_no: record.res_no, field: 'add' })}
                        style={cellStyle}
                        onMouseEnter={(e) => (e.target.style.borderColor = cellHoverStyle.borderColor)}
                        onMouseLeave={(e) => (e.target.style.borderColor = '#d9d9d9')}
                    >
                        {add || '없음'}
                    </span>
                )
            ),
            responsive: ['lg'],
        },
        {
            title: '특별 요청사항',
            dataIndex: 'remark',
            key: 'remark',
            width: 200,
            responsive: ['lg'],
        },
        {
            title: '예약금',
            dataIndex: 'deposit',
            key: 'deposit',
            width: 120,
            responsive: ['md', 'lg'],
        },
        {
            title: '상태',
            dataIndex: 'state',
            key: 'state',
            width: 150,
            render: (state, record) => (
                editingCell.res_no === record.res_no && editingCell.field === 'state' ? (
                    <Select
                        value={state}
                        onChange={(value) => handleUpdate(record.res_no, 'state', value)}
                        style={selectStyle}
                        onBlur={() => setEditingCell({ res_no: null, field: null })}
                        autoFocus
                        dropdownStyle={{ minWidth: '150px' }}
                    >
                        <Option value={0}>예약대기</Option>
                        <Option value={1}>예약완료</Option>
                        <Option value={2}>기사배정중</Option>
                        <Option value={3}>기사배정완료</Option>
                        <Option value={4}>청소완료</Option>
                    </Select>
                ) : (
                    <span
                        onClick={() => setEditingCell({ res_no: record.res_no, field: 'state' })}
                        style={cellStyle}
                        onMouseEnter={(e) => (e.target.style.borderColor = cellHoverStyle.borderColor)}
                        onMouseLeave={(e) => (e.target.style.borderColor = '#d9d9d9')}
                    >
                        {({
                            0: '예약대기',
                            1: '예약완료',
                            2: '기사배정중',
                            3: '기사배정완료',
                            4: '청소완료',
                        })[state] || '알 수 없음'}
                    </span>
                )
            ),
            responsive: ['xs', 'sm', 'md', 'lg'],
        },
        {
            title: '수정/삭제',
            key: 'action',
            width: 120,
            render: (_, record) => (
                <>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => onEdit(record)}
                        style={{ marginRight: 8 }}
                        size={isMobile ? 'small' : 'middle'}
                    />
                    <Popconfirm
                        title="정말 삭제하시겠습니까?"
                        onConfirm={() => onDelete(record.res_no)}
                    >
                        <Button icon={<DeleteOutlined />} danger size={isMobile ? 'small' : 'middle'} />
                    </Popconfirm>
                </>
            ),
            responsive: ['xs', 'sm', 'md', 'lg'],
        },
    ];

    if (isMobile) {
        return (
            <div style={{ padding: '0 8px' }}>
                {reservations.map((record) => (
                    <Card
                        key={record.res_no}
                        style={{ marginBottom: 16, borderRadius: 8 }}
                        title={`예약번호: ${record.res_no}`}
                        extra={
                            <div>
                                <Button
                                    icon={<EditOutlined />}
                                    onClick={() => onEdit(record)}
                                    style={{ marginRight: 8 }}
                                    size="small"
                                />
                                <Popconfirm
                                    title="정말 삭제하시겠습니까?"
                                    onConfirm={() => onDelete(record.res_no)}
                                >
                                    <Button icon={<DeleteOutlined />} danger size="small" />
                                </Popconfirm>
                            </div>
                        }
                    >
                        <p><strong>이름:</strong> {record.name}</p>
                        <p><strong>예약 날짜:</strong> {dayjs(record.date).format('YYYY-MM-DD')}</p>
                        <p>
                            <strong>예약 시간:</strong>{' '}
                            {editingCell.res_no === record.res_no && editingCell.field === 'time' ? (
                                <Select
                                    value={record.time}
                                    onChange={(value) => handleUpdate(record.res_no, 'time', value)}
                                    style={selectStyle}
                                    onBlur={() => setEditingCell({ res_no: null, field: null })}
                                    autoFocus
                                    dropdownStyle={{ minWidth: '150px' }}
                                >
                                    <Option value="오전 10시 ~ 오후 1시">오전 10시 ~ 오후 1시</Option>
                                    <Option value="오후 2시 ~ 오후 5시">오후 2시 ~ 오후 5시</Option>
                                    <Option value="오후 4시 ~ 오후 7시">오후 4시 ~ 오후 7시</Option>
                                    <Option value="오후 6시 ~ 오후 9시">오후 6시 ~ 오후 9시</Option>
                                </Select>
                            ) : (
                                <span
                                    onClick={() => setEditingCell({ res_no: record.res_no, field: 'time' })}
                                    style={cellStyle}
                                    onMouseEnter={(e) => (e.target.style.borderColor = cellHoverStyle.borderColor)}
                                    onMouseLeave={(e) => (e.target.style.borderColor = '#d9d9d9')}
                                >
                                    {record.time || '미지정'}
                                </span>
                            )}
                        </p>
                        <p>
                            <strong>용량:</strong>{' '}
                            {editingCell.res_no === record.res_no && editingCell.field === 'capacity' ? (
                                <Select
                                    value={record.capacity}
                                    onChange={(value) => handleUpdate(record.res_no, 'capacity', value)}
                                    style={selectStyle}
                                    onBlur={() => setEditingCell({ res_no: null, field: null })}
                                    autoFocus
                                    dropdownStyle={{ minWidth: '120px' }}
                                >
                                    <Option value="1">20~50kg</Option>
                                    <Option value="2">50~100kg</Option>
                                    <Option value="3">100kg 이상</Option>
                                </Select>
                            ) : (
                                <span
                                    onClick={() => setEditingCell({ res_no: record.res_no, field: 'capacity' })}
                                    style={cellStyle}
                                    onMouseEnter={(e) => (e.target.style.borderColor = cellHoverStyle.borderColor)}
                                    onMouseLeave={(e) => (e.target.style.borderColor = '#d9d9d9')}
                                >
                                    {record.capacity === '1' ? '20~50kg' : record.capacity === '2' ? '50~100kg' : record.capacity === '3' ? '100kg 이상' : '미지정'}
                                </span>
                            )}
                        </p>
                        <p>
                            <strong>선택 서비스:</strong>{' '}
                            {editingCell.res_no === record.res_no && editingCell.field === 'service' ? (
                                <Select
                                    value={record.service}
                                    onChange={(value) => handleUpdate(record.res_no, 'service', value)}
                                    style={selectStyle}
                                    onBlur={() => setEditingCell({ res_no: null, field: null })}
                                    autoFocus
                                    dropdownStyle={{ minWidth: '100px' }}
                                >
                                    <Option value="청소">청소</Option>
                                    <Option value="수리">수리</Option>
                                </Select>
                            ) : (
                                <span
                                    onClick={() => setEditingCell({ res_no: record.res_no, field: 'service' })}
                                    style={cellStyle}
                                    onMouseEnter={(e) => (e.target.style.borderColor = cellHoverStyle.borderColor)}
                                    onMouseLeave={(e) => (e.target.style.borderColor = '#d9d9d9')}
                                >
                                    {record.service || '미지정'}
                                </span>
                            )}
                        </p>
                        <p>
                            <strong>서비스 주기:</strong>{' '}
                            {editingCell.res_no === record.res_no && editingCell.field === 'cycle' ? (
                                <Select
                                    value={record.cycle}
                                    onChange={(value) => handleUpdate(record.res_no, 'cycle', value)}
                                    style={selectStyle}
                                    onBlur={() => setEditingCell({ res_no: null, field: null })}
                                    autoFocus
                                    dropdownStyle={{ minWidth: '150px' }}
                                >
                                    <Option value="이번 한 번만">이번 한 번만</Option>
                                    <Option value="한 달에 한 번">한 달에 한 번</Option>
                                </Select>
                            ) : (
                                <span
                                    onClick={() => setEditingCell({ res_no: record.res_no, field: 'cycle' })}
                                    style={cellStyle}
                                    onMouseEnter={(e) => (e.target.style.borderColor = cellHoverStyle.borderColor)}
                                    onMouseLeave={(e) => (e.target.style.borderColor = '#d9d9d9')}
                                >
                                    {record.cycle || '없음'}
                                </span>
                            )}
                        </p>
                        <p>
                            <strong>특별 요청사항:</strong>{' '}
                            {editingCell.res_no === record.res_no && editingCell.field === 'add' ? (
                                <Select
                                    value={record.add}
                                    onChange={(value) => handleUpdate(record.res_no, 'add', value)}
                                    style={selectStyle}
                                    onBlur={() => setEditingCell({ res_no: null, field: null })}
                                    autoFocus
                                    dropdownStyle={{ minWidth: '200px' }}
                                >
                                    <Option value="심화 청소">심화 청소</Option>
                                    <Option value="물탱크 청소">물탱크 청소</Option>
                                    <Option value="필터 교체">필터 교체</Option>
                                    <Option value="선택 안함">선택 안함</Option>
                                </Select>
                            ) : (
                                <span
                                    onClick={() => setEditingCell({ res_no: record.res_no, field: 'add' })}
                                    style={cellStyle}
                                    onMouseEnter={(e) => (e.target.style.borderColor = cellHoverStyle.borderColor)}
                                    onMouseLeave={(e) => (e.target.style.borderColor = '#d9d9d9')}
                                >
                                    {record.add || '없음'}
                                </span>
                            )}
                        </p>
                        <p>
                            <strong>상태:</strong>{' '}
                            {editingCell.res_no === record.res_no && editingCell.field === 'state' ? (
                                <Select
                                    value={record.state}
                                    onChange={(value) => handleUpdate(record.res_no, 'state', value)}
                                    style={selectStyle}
                                    onBlur={() => setEditingCell({ res_no: null, field: null })}
                                    autoFocus
                                    dropdownStyle={{ minWidth: '150px' }}
                                >
                                    <Option value={0}>예약대기</Option>
                                    <Option value={1}>예약완료</Option>
                                    <Option value={2}>기사배정중</Option>
                                    <Option value={3}>기사배정완료</Option>
                                    <Option value={4}>청소완료</Option>
                                </Select>
                            ) : (
                                <span
                                    onClick={() => setEditingCell({ res_no: record.res_no, field: 'state' })}
                                    style={cellStyle}
                                    onMouseEnter={(e) => (e.target.style.borderColor = cellHoverStyle.borderColor)}
                                    onMouseLeave={(e) => (e.target.style.borderColor = '#d9d9d9')}
                                >
                                    {({
                                        0: '예약대기',
                                        1: '예약완료',
                                        2: '기사배정중',
                                        3: '기사배정완료',
                                        4: '청소완료',
                                    })[record.state] || '알 수 없음'}
                                </span>
                            )}
                        </p>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <Table
            columns={columns}
            dataSource={reservations}
            rowKey="res_no"
            pagination={{
                pageSize: 10,
                style: { textAlign: 'center' },
            }}
            scroll={{ x: 'max-content' }}
            size="small"
        />
    );
};

export default ReservationTable;