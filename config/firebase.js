const admin = require('firebase-admin');
const path = require('path');

// 서비스 계정 키 파일 경로
const serviceAccountPath = path.resolve(
    process.cwd(),
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './config/firebase-service-account.json'
);

let serviceAccount;
try {
    serviceAccount = require(serviceAccountPath);
} catch (error) {
    console.error('Firebase 서비스 계정 키 파일을 찾을 수 없습니다:', serviceAccountPath);
    throw new Error('Firebase 초기화 실패: 서비스 계정 키 파일이 필요합니다.');
}

// Firebase Admin 초기화
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID
});

console.log('✅ Firebase Admin SDK 초기화 완료');

module.exports = admin;