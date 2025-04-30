import { supabase } from './supabase';

// 팝업 테이블 생성 확인
const checkPopupTable = async () => {
    const { data, error } = await supabase
        .from('popups')
        .select('id')
        .limit(1);
    
    if (error) {
        if (error.code === '42P01') { // 테이블이 존재하지 않는 경우
            // 테이블 생성
            const { error: createError } = await supabase.rpc('create_popups_table');
            if (createError) {
                console.error('팝업 테이블 생성 실패:', createError);
                throw createError;
            }
        } else {
            throw error;
        }
    }
};

// 팝업 목록 조회
export const getPopups = async () => {
    try {
        const { data, error } = await supabase
            .from('popups')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('팝업 목록 조회 에러:', error);
            throw error;
        }
        return data || [];
    } catch (error) {
        console.error('팝업 목록 조회 실패:', error);
        throw error;
    }
};

// 현재 노출 중인 팝업 조회
export const getActivePopups = async () => {
    try {
        const now = new Date().toISOString();
        const { data, error } = await supabase
            .from('popups')
            .select('*')
            .eq('display_status', 'show')
            .lte('start_date', now)
            .gte('end_date', now)
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('활성 팝업 조회 에러:', error);
            throw error;
        }
        
        // 필드명 매핑
        return (data || []).map(popup => ({
            ...popup,
            displayType: popup.display_type,
            displayStatus: popup.display_status,
            imageUrl: popup.image_url,
            mobileImageUrl: popup.mobile_image_url,
            linkUrl: popup.link_url,
            closeOption: popup.close_option
        }));
    } catch (error) {
        console.error('활성 팝업 조회 실패:', error);
        throw error;
    }
};

// 팝업 추가
export const addPopup = async (popupData) => {
    try {
        // 데이터 검증
        if (!popupData.title || !popupData.image_url) {
            throw new Error('제목과 이미지는 필수 항목입니다.');
        }

        // 기본값 설정
        const dataToInsert = {
            ...popupData,
            display_type: popupData.display_type || 'modal',
            display_status: popupData.display_status || 'show',
            display_environment: Array.isArray(popupData.display_environment) 
                ? popupData.display_environment 
                : [popupData.display_environment || 'all'],
            close_option: Array.isArray(popupData.close_option) 
                ? popupData.close_option 
                : [popupData.close_option || 'today'],
            position_x: popupData.position_x || 'center',
            position_y: popupData.position_y || 'center',
            width: typeof popupData.width === 'number' ? popupData.width : 500,
            height: typeof popupData.height === 'number' ? popupData.height : 400,
            created_at: new Date().toISOString()
        };

        console.log('Supabase에 저장할 데이터:', dataToInsert); // 디버깅용

        const { data, error } = await supabase
            .from('popups')
            .insert([dataToInsert])
            .select();
        
        if (error) {
            console.error('팝업 추가 에러:', error);
            throw new Error(error.message || '팝업 추가 중 오류가 발생했습니다.');
        }

        if (!data || data.length === 0) {
            throw new Error('팝업이 추가되지 않았습니다.');
        }

        return data[0];
    } catch (error) {
        console.error('팝업 추가 실패:', error);
        throw error;
    }
};

// 팝업 수정
export const updatePopup = async (id, popupData) => {
    try {
        const updateData = {
            ...popupData,
            display_environment: Array.isArray(popupData.display_environment) 
                ? popupData.display_environment 
                : [popupData.display_environment || 'all'],
            close_option: Array.isArray(popupData.close_option) 
                ? popupData.close_option 
                : [popupData.close_option || 'today']
        };

        const { data, error } = await supabase
            .from('popups')
            .update(updateData)
            .eq('id', id)
            .select();
        
        if (error) {
            console.error('팝업 수정 에러:', error);
            throw error;
        }
        return data[0];
    } catch (error) {
        console.error('팝업 수정 실패:', error);
        throw error;
    }
};

// 팝업 삭제
export const deletePopup = async (id) => {
    try {
        const { error } = await supabase
            .from('popups')
            .delete()
            .eq('id', id);
        
        if (error) {
            console.error('팝업 삭제 에러:', error);
            throw error;
        }
    } catch (error) {
        console.error('팝업 삭제 실패:', error);
        throw error;
    }
}; 