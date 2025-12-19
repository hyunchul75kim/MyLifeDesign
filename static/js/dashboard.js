// 노후설계 대시보드 JavaScript
// localStorage를 사용하여 데이터 저장

(function() {
    'use strict';

    // localStorage 키 (상수에서 가져오기)
    const STORAGE_KEY = window.STORAGE_KEYS ? window.STORAGE_KEYS.DASHBOARD : 'retirement_dashboard_data';

    // DOM 요소 캐싱 (자주 사용되는 요소들)
    let cachedElements = null;

    /**
     * DOM 요소 캐싱 (초기화 시 한 번만 실행)
     */
    function cacheElements() {
        if (cachedElements) {
            return cachedElements;
        }

        cachedElements = {
            // 자산 관련
            cash: window.safeGetElement('cash'),
            pension: window.safeGetElement('pension'),
            otherAssets: window.safeGetElement('otherAssets'),
            totalAssets: window.safeGetElement('totalAssets'),
            
            // 수입 관련
            workIncome: window.safeGetElement('workIncome'),
            otherIncome: window.safeGetElement('otherIncome'),
            totalIncome: window.safeGetElement('totalIncome'),
            
            // 지출 관련
            fixedExpense: window.safeGetElement('fixedExpense'),
            livingExpense: window.safeGetElement('livingExpense'),
            totalExpense: window.safeGetElement('totalExpense')
        };

        return cachedElements;
    }

    // 데이터 로드
    function loadData() {
        if (!window.isLocalStorageAvailable()) {
            const errorMsg = window.ERROR_MESSAGES ? window.ERROR_MESSAGES.STORAGE_UNAVAILABLE : '브라우저에서 데이터 저장 기능을 사용할 수 없습니다. 입력한 내용은 저장되지 않습니다.';
            window.showUserMessage(errorMsg, window.MESSAGE_TYPES ? window.MESSAGE_TYPES.WARNING : 'warning');
            return;
        }

        const data = window.safeLocalStorageGet(STORAGE_KEY);
        if (data) {
            try {
                // 각 필드에 저장된 값 적용
                Object.keys(data).forEach(key => {
                    const element = window.safeGetElement(key);
                    if (element) {
                        try {
                            if (element.type === 'checkbox') {
                                element.checked = Boolean(data[key]);
                            } else {
                                element.value = String(data[key] || '');
                            }
                        } catch (e) {
                            console.warn(`필드 설정 실패: ${key}`, e);
                        }
                    }
                });
                // 데이터 로드 후 합계 재계산
                calculateTotals();
            } catch (e) {
                console.error('데이터 적용 실패:', e);
                const errorMsg = window.ERROR_MESSAGES ? window.ERROR_MESSAGES.DATA_LOAD_ERROR : '저장된 데이터를 불러오는 중 오류가 발생했습니다.';
                window.showUserMessage(errorMsg, window.MESSAGE_TYPES ? window.MESSAGE_TYPES.ERROR : 'error');
            }
        }
    }

    // 데이터 저장
    function saveData() {
        if (!window.isLocalStorageAvailable()) {
            return; // 저장 불가능하면 조용히 실패
        }

        try {
            const data = {};
            const inputs = document.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                if (input.id) {
                    try {
                        if (input.type === 'checkbox') {
                            data[input.id] = input.checked;
                        } else {
                            data[input.id] = input.value;
                        }
                    } catch (e) {
                        console.warn(`필드 읽기 실패: ${input.id}`, e);
                    }
                }
            });
            
            const saved = window.safeLocalStorageSet(STORAGE_KEY, data);
            if (!saved) {
                const errorMsg = window.ERROR_MESSAGES ? window.ERROR_MESSAGES.DATA_SAVE_FAILED : '데이터 저장에 실패했습니다. 브라우저 저장 공간을 확인해주세요.';
                window.showUserMessage(errorMsg, window.MESSAGE_TYPES ? window.MESSAGE_TYPES.WARNING : 'warning');
            }
        } catch (e) {
            console.error('데이터 저장 중 오류:', e);
            const errorMsg = window.ERROR_MESSAGES ? window.ERROR_MESSAGES.DATA_SAVE_ERROR : '데이터 저장 중 오류가 발생했습니다.';
            window.showUserMessage(errorMsg, window.MESSAGE_TYPES ? window.MESSAGE_TYPES.ERROR : 'error');
        }
    }

    // 자산 합계 계산
    function calculateTotals() {
        try {
            const elements = cacheElements();

            // 자산 합계
            if (elements.cash && elements.pension && elements.otherAssets && elements.totalAssets) {
                const cash = parseFloat(elements.cash.value) || 0;
                const pension = parseFloat(elements.pension.value) || 0;
                const otherAssets = parseFloat(elements.otherAssets.value) || 0;
                const totalAssets = cash + pension + otherAssets;
                elements.totalAssets.textContent = Math.round(totalAssets).toLocaleString();
            }

            // 수입 합계
            if (elements.workIncome && elements.otherIncome && elements.totalIncome) {
                const workIncome = parseFloat(elements.workIncome.value) || 0;
                const otherIncome = parseFloat(elements.otherIncome.value) || 0;
                const totalIncome = workIncome + otherIncome;
                elements.totalIncome.textContent = Math.round(totalIncome).toLocaleString();
            }

            // 지출 합계
            if (elements.fixedExpense && elements.livingExpense && elements.totalExpense) {
                const fixedExpense = parseFloat(elements.fixedExpense.value) || 0;
                const livingExpense = parseFloat(elements.livingExpense.value) || 0;
                const totalExpense = fixedExpense + livingExpense;
                elements.totalExpense.textContent = Math.round(totalExpense).toLocaleString();
            }
        } catch (e) {
            console.error('합계 계산 실패:', e);
            const errorMsg = window.ERROR_MESSAGES ? window.ERROR_MESSAGES.TOTAL_CALCULATION_ERROR : '합계 계산 중 오류가 발생했습니다.';
            window.showUserMessage(errorMsg, window.MESSAGE_TYPES ? window.MESSAGE_TYPES.ERROR : 'error');
        }
    }

    // 입력 값 검증 함수
    function validateInput(input) {
        if (input.type === 'number') {
            let value = parseFloat(input.value) || 0;
            if (value < 0) {
                value = 0;
                input.value = 0;
            }
            return value;
        }
        return input.value;
    }

    // 이벤트 리스너 등록
    function setupEventListeners() {
        // 모든 입력 필드에 변경 이벤트 리스너 추가
        // 이벤트 위임을 사용하여 성능 최적화
        const container = document.querySelector('.container');
        if (!container) {
            return;
        }

        // 합계 계산이 필요한 필드 ID 목록
        const totalCalculationFields = ['cash', 'pension', 'otherAssets', 'workIncome', 'otherIncome', 'fixedExpense', 'livingExpense'];

        // 이벤트 위임: container에서 이벤트를 캡처
        container.addEventListener('input', function(e) {
            const target = e.target;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                validateInput(target);
                saveData();
                // 합계 계산이 필요한 필드인지 확인
                if (target.id && totalCalculationFields.includes(target.id)) {
                    calculateTotals();
                }
            }
        });

        // blur 이벤트도 위임
        container.addEventListener('blur', function(e) {
            const target = e.target;
            if (target.tagName === 'INPUT' && target.type === 'number') {
                validateInput(target);
                saveData();
            }
        }, true); // 캡처 단계에서 처리
    }

    // 초기화
    function init() {
        // DOM 요소 캐싱 (먼저 실행)
        cacheElements();
        loadData();
        setupEventListeners();
        calculateTotals();
        setActiveNavLink();
    }

    // 페이지 로드 시 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

