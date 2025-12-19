// 은퇴 후 생활비 시뮬레이터 JavaScript
// 실시간 계산 기능

(function() {
    'use strict';

    // localStorage 키 (상수에서 가져오기)
    const STORAGE_KEY = window.STORAGE_KEYS ? window.STORAGE_KEYS.SIMULATOR : 'retirement_simulator_data';

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
            // 입력 필드
            simCurrentAge: window.safeGetElement('simCurrentAge'),
            simRetirementAge: window.safeGetElement('simRetirementAge'),
            simMonthlyIncome: window.safeGetElement('simMonthlyIncome'),
            simMonthlyExpense: window.safeGetElement('simMonthlyExpense'),
            retirementPeriod: window.safeGetElement('retirementPeriod'),
            annualReturn: window.safeGetElement('annualReturn'),
            
            // 결과 표시 필드
            monthlySavings: window.safeGetElement('monthlySavings'),
            monthsToRetirement: window.safeGetElement('monthsToRetirement'),
            expectedAssets: window.safeGetElement('expectedAssets'),
            monthlyLivingExpense: window.safeGetElement('monthlyLivingExpense')
        };

        return cachedElements;
    }

    // 숫자 포맷팅 (만원 단위)
    function formatNumber(value) {
        const units = window.CURRENCY_UNITS || { HUNDRED_MILLION: 10000, TEN_MILLION: 1000 };
        
        if (value >= units.HUNDRED_MILLION) {
            return (value / units.HUNDRED_MILLION).toFixed(1) + '억원';
        } else if (value >= units.TEN_MILLION) {
            return (value / units.TEN_MILLION).toFixed(1) + '천만원';
        } else {
            return Math.round(value).toLocaleString() + '만원';
        }
    }

    /**
     * 입력값 가져오기 및 파싱
     * @returns {Object|null} 입력값 객체 또는 null (요소를 찾을 수 없는 경우)
     */
    function getInputValues() {
        const elements = cacheElements();

        // 필수 요소 확인
        if (!elements.simCurrentAge || !elements.simRetirementAge || !elements.simMonthlyIncome || 
            !elements.simMonthlyExpense || !elements.retirementPeriod || !elements.annualReturn) {
            const errorMsg = window.ERROR_MESSAGES ? window.ERROR_MESSAGES.ELEMENT_NOT_FOUND : '필수 입력 요소를 찾을 수 없습니다.';
            console.error(errorMsg);
            return null;
        }

        const constants = window.CALCULATION_CONSTANTS || { 
            MONTHS_PER_YEAR: 12, 
            PERCENTAGE_DIVISOR: 100, 
            DEFAULT_RETIREMENT_PERIOD: 25, 
            MIN_VALUE: 0 
        };

        return {
            currentAge: parseFloat(elements.simCurrentAge.value) || constants.MIN_VALUE,
            retirementAge: parseFloat(elements.simRetirementAge.value) || constants.MIN_VALUE,
            monthlyIncome: parseFloat(elements.simMonthlyIncome.value) || constants.MIN_VALUE,
            monthlyExpense: parseFloat(elements.simMonthlyExpense.value) || constants.MIN_VALUE,
            retirementPeriod: parseFloat(elements.retirementPeriod.value) || constants.DEFAULT_RETIREMENT_PERIOD,
            annualReturn: parseFloat(elements.annualReturn.value) || constants.MIN_VALUE
        };
    }

    /**
     * 입력값 유효성 검사
     * @param {Object} inputs - 입력값 객체
     * @returns {boolean} 유효성 검사 통과 여부
     */
    function validateInputs(inputs) {
        if (!inputs) {
            return false;
        }

        // 나이 유효성 검사
        if (inputs.currentAge >= inputs.retirementAge) {
            const errorMessage = window.ERROR_MESSAGES ? window.ERROR_MESSAGES.AGE_VALIDATION : '현재 나이는 은퇴 나이보다 작아야 합니다.';
            window.showUserMessage(errorMessage, window.MESSAGE_TYPES ? window.MESSAGE_TYPES.WARNING : 'warning');
            return false;
        }

        return true;
    }

    /**
     * 에러 상태 표시
     */
    function displayErrorState() {
        const errorMessages = window.ERROR_MESSAGES || {};
        const inputError = errorMessages.INPUT_ERROR || '입력 오류';
        const elements = cacheElements();
        
        if (elements.monthlySavings) elements.monthlySavings.textContent = inputError;
        if (elements.monthsToRetirement) elements.monthsToRetirement.textContent = inputError;
        if (elements.expectedAssets) elements.expectedAssets.textContent = inputError;
        if (elements.monthlyLivingExpense) elements.monthlyLivingExpense.textContent = inputError;
    }

    /**
     * 은퇴 관련 데이터 계산 (순수 함수)
     * @param {Object} inputs - 입력값 객체
     * @returns {Object} 계산 결과 객체
     */
    function calculateRetirementData(inputs) {
        const constants = window.CALCULATION_CONSTANTS || { 
            MONTHS_PER_YEAR: 12, 
            PERCENTAGE_DIVISOR: 100 
        };

        // 기본 계산
        const monthlySavings = inputs.monthlyIncome - inputs.monthlyExpense;
        const monthsToRetirement = (inputs.retirementAge - inputs.currentAge) * constants.MONTHS_PER_YEAR;
        
        // 단순 계산: 월 저축액 × 남은 개월 수
        let expectedAssets = monthlySavings * monthsToRetirement;
        
        // 수익률 적용 (간단한 복리 계산)
        if (inputs.annualReturn > 0 && monthsToRetirement > 0) {
            try {
                const monthlyReturn = inputs.annualReturn / constants.PERCENTAGE_DIVISOR / constants.MONTHS_PER_YEAR;
                // 복리 계산: FV = PV * (1 + r)^n
                // 단순화: 평균 저축액에 대한 복리 효과
                const avgSavings = monthlySavings * monthsToRetirement / 2;
                expectedAssets = avgSavings * Math.pow(1 + monthlyReturn, monthsToRetirement);
                
                // 무한대나 NaN 체크
                if (!isFinite(expectedAssets) || isNaN(expectedAssets)) {
                    expectedAssets = monthlySavings * monthsToRetirement;
                }
            } catch (e) {
                console.warn('복리 계산 실패, 단순 계산 사용:', e);
                expectedAssets = monthlySavings * monthsToRetirement;
            }
        }
        
        const monthlyLivingExpense = expectedAssets / (inputs.retirementPeriod * constants.MONTHS_PER_YEAR);

        return {
            monthlySavings: monthlySavings,
            monthsToRetirement: monthsToRetirement,
            expectedAssets: expectedAssets,
            monthlyLivingExpense: monthlyLivingExpense
        };
    }

    /**
     * 계산 결과 표시
     * @param {Object} results - 계산 결과 객체
     */
    function displayResults(results) {
        const elements = cacheElements();

        if (elements.monthlySavings) {
            elements.monthlySavings.textContent = formatNumber(results.monthlySavings);
        }
        if (elements.monthsToRetirement) {
            elements.monthsToRetirement.textContent = Math.round(results.monthsToRetirement).toLocaleString() + '개월';
        }
        if (elements.expectedAssets) {
            elements.expectedAssets.textContent = formatNumber(results.expectedAssets);
        }
        if (elements.monthlyLivingExpense) {
            elements.monthlyLivingExpense.textContent = formatNumber(results.monthlyLivingExpense);
        }
    }

    /**
     * 계산 수행 (메인 함수)
     * 입력값 가져오기 → 검증 → 계산 → 결과 표시
     */
    function calculate() {
        try {
            // 1. 입력값 가져오기
            const inputs = getInputValues();
            if (!inputs) {
                return;
            }

            // 2. 입력값 검증
            if (!validateInputs(inputs)) {
                displayErrorState();
                return;
            }

            // 3. 계산 수행
            const results = calculateRetirementData(inputs);

            // 4. 결과 표시
            displayResults(results);
        } catch (e) {
            console.error('계산 실패:', e);
            const errorMsg = window.ERROR_MESSAGES ? window.ERROR_MESSAGES.CALCULATION_ERROR : '계산 중 오류가 발생했습니다. 입력값을 확인해주세요.';
            window.showUserMessage(errorMsg, window.MESSAGE_TYPES ? window.MESSAGE_TYPES.ERROR : 'error');
        }
    }

    // 데이터 저장
    function saveData() {
        if (!window.isLocalStorageAvailable()) {
            return; // 저장 불가능하면 조용히 실패
        }

        try {
            const elements = cacheElements();

            const data = {};
            if (elements.simCurrentAge) data.simCurrentAge = elements.simCurrentAge.value;
            if (elements.simRetirementAge) data.simRetirementAge = elements.simRetirementAge.value;
            if (elements.simMonthlyIncome) data.simMonthlyIncome = elements.simMonthlyIncome.value;
            if (elements.simMonthlyExpense) data.simMonthlyExpense = elements.simMonthlyExpense.value;
            if (elements.retirementPeriod) data.retirementPeriod = elements.retirementPeriod.value;
            if (elements.annualReturn) data.annualReturn = elements.annualReturn.value;

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
                Object.keys(data).forEach(key => {
                    const element = window.safeGetElement(key);
                    if (element) {
                        try {
                            element.value = String(data[key] || '');
                        } catch (e) {
                            console.warn(`필드 설정 실패: ${key}`, e);
                        }
                    }
                });
            } catch (e) {
                console.error('데이터 적용 실패:', e);
                const errorMsg = window.ERROR_MESSAGES ? window.ERROR_MESSAGES.DATA_LOAD_ERROR : '저장된 데이터를 불러오는 중 오류가 발생했습니다.';
                window.showUserMessage(errorMsg, window.MESSAGE_TYPES ? window.MESSAGE_TYPES.ERROR : 'error');
            }
        }
    }

    // 이벤트 리스너 설정
    function setupEventListeners() {
        // 이벤트 위임을 사용하여 성능 최적화
        const container = document.querySelector('.container');
        if (!container) {
            return;
        }

        // 입력 필드 ID 목록
        const inputFieldIds = ['simCurrentAge', 'simRetirementAge', 'simMonthlyIncome', 'simMonthlyExpense', 'retirementPeriod', 'annualReturn'];

        // 이벤트 위임: container에서 이벤트를 캡처
        container.addEventListener('input', function(e) {
            const target = e.target;
            if (target.tagName === 'INPUT' && target.id && inputFieldIds.includes(target.id)) {
                calculate();
                saveData();
            }
        });
    }

    // 초기화
    function init() {
        // DOM 요소 캐싱 (먼저 실행)
        cacheElements();
        loadData();
        setupEventListeners();
        calculate(); // 초기 계산
        setActiveNavLink();
    }

    // 페이지 로드 시 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

