// 은퇴 후 생활비 시뮬레이터 JavaScript
// 실시간 계산 기능

(function() {
    'use strict';

    // localStorage 키 (상수에서 가져오기)
    const STORAGE_KEY = window.STORAGE_KEYS ? window.STORAGE_KEYS.SIMULATOR : 'retirement_simulator_data';

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

    // 계산 수행
    function calculate() {
        try {
            // 입력값 가져오기
            const currentAgeElement = window.safeGetElement('simCurrentAge');
            const retirementAgeElement = window.safeGetElement('simRetirementAge');
            const monthlyIncomeElement = window.safeGetElement('simMonthlyIncome');
            const monthlyExpenseElement = window.safeGetElement('simMonthlyExpense');
            const retirementPeriodElement = window.safeGetElement('retirementPeriod');
            const annualReturnElement = window.safeGetElement('annualReturn');

            // 필수 요소 확인
            if (!currentAgeElement || !retirementAgeElement || !monthlyIncomeElement || 
                !monthlyExpenseElement || !retirementPeriodElement || !annualReturnElement) {
                const errorMsg = window.ERROR_MESSAGES ? window.ERROR_MESSAGES.ELEMENT_NOT_FOUND : '필수 입력 요소를 찾을 수 없습니다.';
                console.error(errorMsg);
                return;
            }

            const constants = window.CALCULATION_CONSTANTS || { MONTHS_PER_YEAR: 12, PERCENTAGE_DIVISOR: 100, DEFAULT_RETIREMENT_PERIOD: 25, MIN_VALUE: 0 };
            const errorMessages = window.ERROR_MESSAGES || {};

            const currentAge = parseFloat(currentAgeElement.value) || constants.MIN_VALUE;
            const retirementAge = parseFloat(retirementAgeElement.value) || constants.MIN_VALUE;
            const monthlyIncome = parseFloat(monthlyIncomeElement.value) || constants.MIN_VALUE;
            const monthlyExpense = parseFloat(monthlyExpenseElement.value) || constants.MIN_VALUE;
            const retirementPeriod = parseFloat(retirementPeriodElement.value) || constants.DEFAULT_RETIREMENT_PERIOD;
            const annualReturn = parseFloat(annualReturnElement.value) || constants.MIN_VALUE;

            // 유효성 검사
            if (currentAge >= retirementAge) {
                const errorMessage = errorMessages.AGE_VALIDATION || '현재 나이는 은퇴 나이보다 작아야 합니다.';
                window.showUserMessage(errorMessage, window.MESSAGE_TYPES ? window.MESSAGE_TYPES.WARNING : 'warning');
                const monthlySavingsElement = window.safeGetElement('monthlySavings');
                const monthsToRetirementElement = window.safeGetElement('monthsToRetirement');
                const expectedAssetsElement = window.safeGetElement('expectedAssets');
                const monthlyLivingExpenseElement = window.safeGetElement('monthlyLivingExpense');
                
                const inputError = errorMessages.INPUT_ERROR || '입력 오류';
                if (monthlySavingsElement) monthlySavingsElement.textContent = inputError;
                if (monthsToRetirementElement) monthsToRetirementElement.textContent = inputError;
                if (expectedAssetsElement) expectedAssetsElement.textContent = inputError;
                if (monthlyLivingExpenseElement) monthlyLivingExpenseElement.textContent = inputError;
                return;
            }

            // 계산
            const monthlySavings = monthlyIncome - monthlyExpense;
            const monthsToRetirement = (retirementAge - currentAge) * constants.MONTHS_PER_YEAR;
            
            // 단순 계산: 월 저축액 × 남은 개월 수
            // (수익률은 복잡하므로 단순화)
            let expectedAssets = monthlySavings * monthsToRetirement;
            
            // 수익률 적용 (간단한 복리 계산)
            if (annualReturn > 0 && monthsToRetirement > 0) {
                try {
                    const monthlyReturn = annualReturn / constants.PERCENTAGE_DIVISOR / constants.MONTHS_PER_YEAR;
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
            
            const monthlyLivingExpense = expectedAssets / (retirementPeriod * constants.MONTHS_PER_YEAR);

            // 결과 표시
            const monthlySavingsElement = window.safeGetElement('monthlySavings');
            const monthsToRetirementElement = window.safeGetElement('monthsToRetirement');
            const expectedAssetsElement = window.safeGetElement('expectedAssets');
            const monthlyLivingExpenseElement = window.safeGetElement('monthlyLivingExpense');

            if (monthlySavingsElement) monthlySavingsElement.textContent = formatNumber(monthlySavings);
            if (monthsToRetirementElement) monthsToRetirementElement.textContent = Math.round(monthsToRetirement).toLocaleString() + '개월';
            if (expectedAssetsElement) expectedAssetsElement.textContent = formatNumber(expectedAssets);
            if (monthlyLivingExpenseElement) monthlyLivingExpenseElement.textContent = formatNumber(monthlyLivingExpense);
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
            const simCurrentAgeElement = window.safeGetElement('simCurrentAge');
            const simRetirementAgeElement = window.safeGetElement('simRetirementAge');
            const simMonthlyIncomeElement = window.safeGetElement('simMonthlyIncome');
            const simMonthlyExpenseElement = window.safeGetElement('simMonthlyExpense');
            const retirementPeriodElement = window.safeGetElement('retirementPeriod');
            const annualReturnElement = window.safeGetElement('annualReturn');

            const data = {};
            if (simCurrentAgeElement) data.simCurrentAge = simCurrentAgeElement.value;
            if (simRetirementAgeElement) data.simRetirementAge = simRetirementAgeElement.value;
            if (simMonthlyIncomeElement) data.simMonthlyIncome = simMonthlyIncomeElement.value;
            if (simMonthlyExpenseElement) data.simMonthlyExpense = simMonthlyExpenseElement.value;
            if (retirementPeriodElement) data.retirementPeriod = retirementPeriodElement.value;
            if (annualReturnElement) data.annualReturn = annualReturnElement.value;

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
        const inputs = document.querySelectorAll('#simCurrentAge, #simRetirementAge, #simMonthlyIncome, #simMonthlyExpense, #retirementPeriod, #annualReturn');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                calculate();
                saveData();
            });
        });
    }

    // 초기화
    function init() {
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

