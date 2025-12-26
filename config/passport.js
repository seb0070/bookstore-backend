const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../src/models');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Google 프로필에서 이메일 추출
                const email = profile.emails[0].value;
                const googleId = profile.id;

                // 기존 사용자 찾기 (provider_id 또는 email로)
                let user = await User.findOne({
                    where: {
                        provider: 'GOOGLE',
                        provider_id: googleId
                    }
                });

                if (!user) {
                    // 같은 이메일로 LOCAL 계정이 있는지 확인
                    const existingUser = await User.findOne({ where: { email } });

                    if (existingUser) {
                        // 기존 LOCAL 계정을 GOOGLE로 연동
                        user = await existingUser.update({
                            provider: 'GOOGLE',
                            provider_id: googleId
                        });
                    } else {
                        // 새 사용자 생성
                        user = await User.create({
                            email,
                            name: profile.displayName || profile.emails[0].value.split('@')[0],
                            provider: 'GOOGLE',
                            provider_id: googleId,
                            role: 'USER',
                            is_active: true
                        });
                    }
                }

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

module.exports = passport;