/**
 * Created by Nofear on 3/21/2019.
 */

(function () {
    cc.HubError = cc.Enum({
        SUCCESS_1: 'Thành công',
        ERROR_10_INPUT_INVALID: 'Đầu vào không hợp lệ',
        ERROR_11_LINES_INVALID: 'Dòng đặt không hợp lệ',
        ERROR_12_ROOM_NOT_EXIST: 'Phòng không tồn tại',
        ERROR_13_DEVICE_ID_NOT_EXIST: 'Thiết bị không tồn tại',

        //Tai Xiu
        ERROR_14_INVALID_TIME: 'Hết thời gian đặt cược',
        ERROR_15_BET: 'Đặt cược lỗi',
        ERROR_16_INVALID_BET_SIDE: 'Không được đặt hai bên cùng một phiên',

        //BaCay
        ERROR_97_SESSION_NOT_EXIST: 'Phiên không tồn tại ',

        ERROR_98_OTHER_DEVICE: 'Tài khoản đăng nhập trên thiết bị khác',
        ERROR_99_EXCEPTION: 'Lỗi kết nối! Vui lòng kiểm tra lại Internet',

        ERROR_100_Captcha: 'Mã xác nhận không chính xác',

        ERROR_211_ROOM_EXIST: 'Phòng chơi đã tồn tại',
        ERROR_214_ROOM_NOT_EXIST: 'Phòng chơi không tồn tại',
        ERROR_231_PLAYER_NOT_IN_ROOM: 'Người chơi không ở trong phòng',
        ERROR_232_TRANS_DATA_INVALID: 'Dữ liệu giao dịch không hợp lệ',
        ERROR_233_ROOM_TYPE_NOT_EXIST: 'Loại phòng không tồn tại',
        ERROR_234_ROOM_OVER: 'Phòng chơi đã kết thúc',
        ERROR_235_ROOM_CANCELED: 'Phòng chơi đã bị hủy',
        ERROR_236_TOTAL_MONEY_NOT_EQUAL: 'Tổng lượng tiền vào ra không bằng nhau',

        ERROR_504_NOT_ENOUGH_MONEY: 'Số dư không đủ',

        ERROR_999_UNDEFINED: 'Lỗi kết nối!',

        ERROR_1001_NOT_AUTHENTICATE: 'Vui lòng đăng nhập lại',
        ERROR_1002_PLAYER_NULL: 'Lỗi kết nối! ', //'Tài khoản không tồn tại (-1002)',
        ERROR_1003_DUPLICATE_SPIN: 'Bạn đặt quá nhanh',
        ERROR_1004_BLOCK_SPIN: 'Bạn đã bị chặn!',
        ERROR_1005_BLOCK_PLAY_NOW: 'Bạn đã bị chặn! ',
        ERROR_1006_PLAY_BONUS: 'Không chơi được Bonus Game',
        ERROR_1007_PLAY_FREE_SPIN: 'Không chơi được Free Spin',
        ERROR_1008_PLAY_X2: 'Không chơi được X2',

        //Bacay
        ERROR_1: 'Lỗi',
        //VietLot
        ERROR_600_SESSION_NOT_EXIST: "Phiên không tồn tại",
        ERROR_601_MEGA_CODE_NOT_EXIST: "Mã mega không tồn tại",
        ERROR_602_SESSION_HAS_RESULT: "Phiên đã có kết quả",
        ERROR_603_SESSION_HAS_REWARD: "Phiên đã trả thưởng",

    });

}).call(this);
