/**
 * Created by Nofear on 6/8/2017.
 */

(function() {
    cc.LoginError = cc.Enum({
        REQUIRE_CAPTCHA: -4,
        REQUIRE_OTP: -3,
        OTP_INCORRECT: -5,
    });

}).call(this);