#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Flask 애플리케이션 설정 파일
환경 변수를 통한 설정 관리 및 개발/프로덕션 환경 분리
"""

import os


class Config:
    """기본 설정 클래스"""
    # Flask 기본 설정
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    
    # 서버 설정
    HOST = os.environ.get('FLASK_HOST') or '127.0.0.1'
    PORT = int(os.environ.get('FLASK_PORT') or 5000)
    
    # 디버그 모드
    DEBUG = os.environ.get('FLASK_DEBUG', 'True').lower() in ('true', '1', 'yes')
    
    # 브라우저 자동 실행 설정
    AUTO_OPEN_BROWSER = os.environ.get('AUTO_OPEN_BROWSER', 'True').lower() in ('true', '1', 'yes')
    BROWSER_OPEN_DELAY = float(os.environ.get('BROWSER_OPEN_DELAY') or 1.5)  # 초 단위
    
    @staticmethod
    def get_base_url():
        """기본 URL 반환"""
        return f'http://{Config.HOST}:{Config.PORT}'


class DevelopmentConfig(Config):
    """개발 환경 설정"""
    DEBUG = True
    HOST = os.environ.get('FLASK_HOST') or '127.0.0.1'
    PORT = int(os.environ.get('FLASK_PORT') or 5000)
    AUTO_OPEN_BROWSER = os.environ.get('AUTO_OPEN_BROWSER', 'True').lower() in ('true', '1', 'yes')


class ProductionConfig(Config):
    """프로덕션 환경 설정"""
    DEBUG = False
    HOST = os.environ.get('FLASK_HOST') or '0.0.0.0'
    PORT = int(os.environ.get('FLASK_PORT') or 5000)
    AUTO_OPEN_BROWSER = False  # 프로덕션에서는 브라우저 자동 실행 비활성화
    SECRET_KEY = os.environ.get('SECRET_KEY') or os.urandom(32)


class TestingConfig(Config):
    """테스트 환경 설정"""
    DEBUG = True
    TESTING = True
    HOST = '127.0.0.1'
    PORT = 5001  # 테스트용 포트
    AUTO_OPEN_BROWSER = False


# 환경별 설정 매핑
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}


def get_config():
    """현재 환경에 맞는 설정 반환"""
    env = os.environ.get('FLASK_ENV', 'development').lower()
    return config.get(env, config['default'])

