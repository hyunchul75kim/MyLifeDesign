// 애플리케이션 상수 정의
// 모든 매직 넘버와 하드코딩된 문자열을 중앙에서 관리

(function() {
    'use strict';

    // localStorage 키 관리
    window.STORAGE_KEYS = {
        DASHBOARD: 'retirement_dashboard_data',
        SIMULATOR: 'retirement_simulator_data'
    };

    // 통화 단위 상수 (만원 기준)
    window.CURRENCY_UNITS = {
        HUNDRED_MILLION: 10000,  // 억원 (만원 × 10000)
        TEN_MILLION: 1000        // 천만원 (만원 × 1000)
    };

    // 계산 관련 상수
    window.CALCULATION_CONSTANTS = {
        MONTHS_PER_YEAR: 12,           // 1년의 개월 수
        PERCENTAGE_DIVISOR: 100,       // 백분율 변환 (100으로 나눔)
        DEFAULT_RETIREMENT_PERIOD: 25, // 기본 은퇴 후 기간 (년)
        MIN_VALUE: 0                   // 최소값
    };

    // 에러 메시지
    window.ERROR_MESSAGES = {
        INPUT_ERROR: '입력 오류',
        AGE_VALIDATION: '현재 나이는 은퇴 나이보다 작아야 합니다.',
        CALCULATION_ERROR: '계산 중 오류가 발생했습니다. 입력값을 확인해주세요.',
        DATA_LOAD_ERROR: '저장된 데이터를 불러오는 중 오류가 발생했습니다.',
        DATA_SAVE_ERROR: '데이터 저장 중 오류가 발생했습니다.',
        DATA_SAVE_FAILED: '데이터 저장에 실패했습니다. 브라우저 저장 공간을 확인해주세요.',
        STORAGE_UNAVAILABLE: '브라우저에서 데이터 저장 기능을 사용할 수 없습니다. 입력한 내용은 저장되지 않습니다.',
        TOTAL_CALCULATION_ERROR: '합계 계산 중 오류가 발생했습니다.',
        ELEMENT_NOT_FOUND: '필수 입력 요소를 찾을 수 없습니다.'
    };

    // 사용자 메시지 타입
    window.MESSAGE_TYPES = {
        ERROR: 'error',
        WARNING: 'warning',
        INFO: 'info'
    };

    // 메시지 타입 한글 표시
    window.MESSAGE_TYPE_LABELS = {
        error: '오류',
        warning: '경고',
        info: '알림'
    };

    // localStorage 테스트 키
    window.LOCAL_STORAGE_TEST_KEY = '__localStorage_test__';
})();

