import React from 'react';
import { Form, Input, Button } from 'antd';

const ResSearchFilters = ({ filters, setFilters, onSearch }) => {
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
        <Form layout="inline" style={{ marginBottom: 16, flexWrap: 'wrap' }}>
            <Form.Item>
                <Input
                    placeholder="이름"
                    value={filters.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                />
            </Form.Item>
            <Form.Item>
                <Input
                    placeholder="연락처"
                    value={filters.tel}
                    onChange={(e) => handleChange('tel', e.target.value)}
                />
            </Form.Item>
            <Form.Item>
                <Input
                    placeholder="이메일"
                    value={filters.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                />
            </Form.Item>
            <Form.Item>
                <Input
                    placeholder="주소"
                    value={filters.addr}
                    onChange={(e) => handleChange('addr', e.target.value)}
                />
            </Form.Item>
            <Form.Item>
                <Button onClick={handleReset} style={{ marginRight: 8 }}>
                    초기화
                </Button>
                <Button type="primary" onClick={() => onSearch(filters)}>
                    조회
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ResSearchFilters;