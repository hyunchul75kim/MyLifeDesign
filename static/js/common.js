// 공통 유틸리티 함수
// 여러 페이지에서 공통으로 사용되는 함수들

(function() {
    'use strict';

    /**
     * localStorage 사용 가능 여부 확인
     * @returns {boolean} localStorage 사용 가능 여부
     */
    window.isLocalStorageAvailable = function() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    };

    /**
     * localStorage에 안전하게 데이터 저장
     * @param {string} key - 저장할 키
     * @param {*} value - 저장할 값
     * @returns {boolean} 저장 성공 여부
     */
    window.safeLocalStorageSet = function(key, value) {
        if (!window.isLocalStorageAvailable()) {
            console.warn('localStorage를 사용할 수 없습니다. 데이터가 저장되지 않습니다.');
            return false;
        }
        try {
            const stringValue = JSON.stringify(value);
            localStorage.setItem(key, stringValue);
            return true;
        } catch (e) {
            console.error('localStorage 저장 실패:', e);
            // 저장 공간 부족 등의 경우
            if (e.name === 'QuotaExceededError') {
                console.warn('localStorage 저장 공간이 부족합니다.');
            }
            return false;
        }
    };

    /**
     * localStorage에서 안전하게 데이터 로드
     * @param {string} key - 로드할 키
     * @returns {*|null} 로드된 데이터 또는 null
     */
    window.safeLocalStorageGet = function(key) {
        if (!window.isLocalStorageAvailable()) {
            return null;
        }
        try {
            const item = localStorage.getItem(key);
            if (item === null) {
                return null;
            }
            return JSON.parse(item);
        } catch (e) {
            console.error('localStorage 로드 실패:', e);
            // 손상된 데이터인 경우 해당 키 삭제
            try {
                localStorage.removeItem(key);
                console.warn('손상된 데이터를 삭제했습니다.');
            } catch (removeError) {
                console.error('손상된 데이터 삭제 실패:', removeError);
            }
            return null;
        }
    };

    /**
     * 사용자에게 친화적인 에러 메시지 표시
     * @param {string} message - 에러 메시지
     * @param {string} type - 메시지 타입 ('error', 'warning', 'info')
     */
    window.showUserMessage = function(message, type = 'error') {
        // 간단한 알림 방식 (향후 토스트 메시지로 개선 가능)
        const messageType = type === 'error' ? '오류' : type === 'warning' ? '경고' : '알림';
        console.log(`[${messageType}] ${message}`);
        // 실제 사용자에게 보여주려면 UI 요소를 추가할 수 있음
    };

    /**
     * DOM 요소가 존재하는지 확인
     * @param {string} id - 요소 ID
     * @returns {HTMLElement|null} 요소 또는 null
     */
    window.safeGetElement = function(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`요소를 찾을 수 없습니다: #${id}`);
        }
        return element;
    };

    /**
     * 네비게이션 활성 링크 설정
     * 현재 페이지 경로에 맞는 네비게이션 링크에 'active' 클래스를 추가합니다.
     */
    window.setActiveNavLink = function() {
        try {
            const currentPath = window.location.pathname;
            const navLinks = document.querySelectorAll('.nav-link');
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === currentPath) {
                    link.classList.add('active');
                }
            });
        } catch (e) {
            console.error('네비게이션 링크 설정 실패:', e);
        }
    };
})();

