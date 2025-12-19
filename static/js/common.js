// 공통 유틸리티 함수
// 여러 페이지에서 공통으로 사용되는 함수들

(function() {
    'use strict';

    /**
     * 네비게이션 활성 링크 설정
     * 현재 페이지 경로에 맞는 네비게이션 링크에 'active' 클래스를 추가합니다.
     */
    window.setActiveNavLink = function() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    };
})();

