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
        // 입력값 가져오기
        const currentAge = parseFloat(document.getElementById('simCurrentAge').value) || 0;
        const retirementAge = parseFloat(document.getElementById('simRetirementAge').value) || 0;
        const monthlyIncome = parseFloat(document.getElementById('simMonthlyIncome').value) || 0;
        const monthlyExpense = parseFloat(document.getElementById('simMonthlyExpense').value) || 0;
        const retirementPeriod = parseFloat(document.getElementById('retirementPeriod').value) || 25;
        const annualReturn = parseFloat(document.getElementById('annualReturn').value) || 0;

        // 유효성 검사
        if (currentAge >= retirementAge) {
            document.getElementById('monthlySavings').textContent = '입력 오류';
            document.getElementById('monthsToRetirement').textContent = '입력 오류';
            document.getElementById('expectedAssets').textContent = '입력 오류';
            document.getElementById('monthlyLivingExpense').textContent = '입력 오류';
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
            const monthlyReturn = annualReturn / 100 / 12;
            // 복리 계산: FV = PV * (1 + r)^n
            // 단순화: 평균 저축액에 대한 복리 효과
            const avgSavings = monthlySavings * monthsToRetirement / 2;
            expectedAssets = avgSavings * Math.pow(1 + monthlyReturn, monthsToRetirement);
        }
        
        const monthlyLivingExpense = expectedAssets / (retirementPeriod * 12);

        // 결과 표시
        document.getElementById('monthlySavings').textContent = formatNumber(monthlySavings);
        document.getElementById('monthsToRetirement').textContent = Math.round(monthsToRetirement).toLocaleString() + '개월';
        document.getElementById('expectedAssets').textContent = formatNumber(expectedAssets);
        document.getElementById('monthlyLivingExpense').textContent = formatNumber(monthlyLivingExpense);
    }

    // 데이터 저장
    function saveData() {
        const data = {
            simCurrentAge: document.getElementById('simCurrentAge').value,
            simRetirementAge: document.getElementById('simRetirementAge').value,
            simMonthlyIncome: document.getElementById('simMonthlyIncome').value,
            simMonthlyExpense: document.getElementById('simMonthlyExpense').value,
            retirementPeriod: document.getElementById('retirementPeriod').value,
            annualReturn: document.getElementById('annualReturn').value
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    // 데이터 로드
    function loadData() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                Object.keys(data).forEach(key => {
                    const element = document.getElementById(key);
                    if (element) {
                        element.value = data[key];
                    }
                });
            } catch (e) {
                console.error('데이터 로드 실패:', e);
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
    }

    // 페이지 로드 시 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

