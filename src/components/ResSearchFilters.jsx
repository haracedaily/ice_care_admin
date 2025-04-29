import React from 'react';
import { Form, Input, Button } from 'antd';
import {PlusOutlined, RedoOutlined, SearchOutlined} from "@ant-design/icons";

const ResSearchFilters = ({ filters, setFilters, onSearch, showModal }) => {
    const handleChange = (name, value) => {
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleReset = () => {
        const resetFilters = {
            name: '',
            tel: '',
            email: '',
            addr: '',
        };
        setFilters(resetFilters);
        onSearch(resetFilters);
    };

    return (
        <Form layout="inline" style={{ marginBottom: 16, flexWrap: 'wrap', gap: '0.5rem'}}>
            <Form.Item style={{marginInlineEnd:'0'}}>
                <Input
                    placeholder="이름"
                    value={filters.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                />
            </Form.Item>
            <Form.Item style={{marginInlineEnd:'0'}}>
                <Input
                    placeholder="연락처"
                    value={filters.tel}
                    onChange={(e) => handleChange('tel', e.target.value)}
                />
            </Form.Item>
            <Form.Item style={{marginInlineEnd:'0'}}>
                <Input
                    placeholder="이메일"
                    value={filters.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                />
            </Form.Item>
            <Form.Item style={{marginInlineEnd:'0'}}>
                <Input
                    placeholder="주소"
                    value={filters.addr}
                    onChange={(e) => handleChange('addr', e.target.value)}
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" style={{ marginRight: 8 }} icon={<SearchOutlined/>} onClick={() => onSearch(filters)} >
                    조회
                </Button>
                <Button onClick={handleReset}  icon={<RedoOutlined/>}>
                    초기화
                </Button>


            </Form.Item>
                <Button
                    type="primary"
                    onClick={() => showModal()}
                    icon={<PlusOutlined/>}
                    style={{marginLeft:"auto"}}
                >
                    예약등록
                </Button>
        </Form>
    );
};

export default ResSearchFilters;