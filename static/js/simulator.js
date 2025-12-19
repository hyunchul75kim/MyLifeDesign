// 은퇴 후 생활비 시뮬레이터 JavaScript
// 실시간 계산 기능

(function() {
    'use strict';

    // localStorage 키
    const STORAGE_KEY = 'retirement_simulator_data';

    // 숫자 포맷팅 (만원 단위)
    function formatNumber(value) {
        if (value >= 10000) {
            return (value / 10000).toFixed(1) + '억원';
        } else if (value >= 1000) {
            return (value / 1000).toFixed(1) + '천만원';
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
                console.error('필수 입력 요소를 찾을 수 없습니다.');
                return;
            }

            const currentAge = parseFloat(currentAgeElement.value) || 0;
            const retirementAge = parseFloat(retirementAgeElement.value) || 0;
            const monthlyIncome = parseFloat(monthlyIncomeElement.value) || 0;
            const monthlyExpense = parseFloat(monthlyExpenseElement.value) || 0;
            const retirementPeriod = parseFloat(retirementPeriodElement.value) || 25;
            const annualReturn = parseFloat(annualReturnElement.value) || 0;

            // 유효성 검사
            if (currentAge >= retirementAge) {
                const errorMessage = '현재 나이는 은퇴 나이보다 작아야 합니다.';
                window.showUserMessage(errorMessage, 'warning');
                const monthlySavingsElement = window.safeGetElement('monthlySavings');
                const monthsToRetirementElement = window.safeGetElement('monthsToRetirement');
                const expectedAssetsElement = window.safeGetElement('expectedAssets');
                const monthlyLivingExpenseElement = window.safeGetElement('monthlyLivingExpense');
                
                if (monthlySavingsElement) monthlySavingsElement.textContent = '입력 오류';
                if (monthsToRetirementElement) monthsToRetirementElement.textContent = '입력 오류';
                if (expectedAssetsElement) expectedAssetsElement.textContent = '입력 오류';
                if (monthlyLivingExpenseElement) monthlyLivingExpenseElement.textContent = '입력 오류';
                return;
            }

            // 계산
            const monthlySavings = monthlyIncome - monthlyExpense;
            const monthsToRetirement = (retirementAge - currentAge) * 12;
            
            // 단순 계산: 월 저축액 × 남은 개월 수
            // (수익률은 복잡하므로 단순화)
            let expectedAssets = monthlySavings * monthsToRetirement;
            
            // 수익률 적용 (간단한 복리 계산)
            if (annualReturn > 0 && monthsToRetirement > 0) {
                try {
                    const monthlyReturn = annualReturn / 100 / 12;
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
            
            const monthlyLivingExpense = expectedAssets / (retirementPeriod * 12);

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
            window.showUserMessage('계산 중 오류가 발생했습니다. 입력값을 확인해주세요.', 'error');
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
                window.showUserMessage('데이터 저장에 실패했습니다. 브라우저 저장 공간을 확인해주세요.', 'warning');
            }
        } catch (e) {
            console.error('데이터 저장 중 오류:', e);
            window.showUserMessage('데이터 저장 중 오류가 발생했습니다.', 'error');
        }
    }

    // 데이터 로드
    function loadData() {
        if (!window.isLocalStorageAvailable()) {
            window.showUserMessage('브라우저에서 데이터 저장 기능을 사용할 수 없습니다. 입력한 내용은 저장되지 않습니다.', 'warning');
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
                window.showUserMessage('저장된 데이터를 불러오는 중 오류가 발생했습니다.', 'error');
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

