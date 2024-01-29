import Utils from "./common/Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    @property
    localPos: number = 0;
    @property(cc.Label)
    lblNickname: cc.Label = null;
    @property(cc.Label)
    lblServiceName: cc.Label = null;
    @property(cc.Label)
    lblCoin: cc.Label = null;
    @property(cc.Label)
    lblBet: cc.Label = null;
    @property(cc.Node)
    gunRotate: cc.Node = null;

    @property([cc.Node])
    guns: cc.Node[] = [];

    public id = 0;
    public username = "";
    public nickname = "";
    public serviceId = 0;
    public coin = 0;
    public avatar = "";
    public serverPos = -1;

    private gun: cc.Node = null;
    private curGunIdx = -1;

    set(id: number, username: string, nickname: string, coin: number, avatar: string, serviceId: number) {
        this.id = id;
        this.username = username;
        this.nickname = nickname;
        this.coin = coin;
        this.avatar = avatar;
        this.gunRotate.rotation = 0;
        this.node.active = true;

        var serviceName = '';
        switch (serviceId) {
            case 1:
                serviceName = '[X]';
                break;
            case 2:
                serviceName = '[X]';
                break;
            case 3:
                serviceName = '[X]';
                break;
        }

        this.lblServiceName.string = serviceName;

        var nameDisplay = this.nickname;
        // if (nameDisplay.length > 6) {
        //     nameDisplay = nameDisplay.substring(0, 6) + '..';
        // } else {
        //     nameDisplay = nameDisplay.substring(0, 6);
        // }

        this.lblNickname.string = nameDisplay;
        this.lblCoin.string = Utils.formatNumber(coin);
        switch (this.localPos) {
            case 0:
            case 1:
                this.gunRotate.angle =90;
                break;
            case 2:
            case 3:
                this.gunRotate.angle = -90;
                break;
        }
        this.setGun(0);
    }

    updateCash(coin) {
        this.lblCoin.string = Utils.formatNumber(coin);
    }

    leave() {
        this.id = -1;
        this.nickname = "";
        this.coin = 0;
        this.avatar = "";
        this.node.active = false;
    }

    setGun(gunIdx: number) {
        if (gunIdx >= this.guns.length) gunIdx = 0;
        if (this.curGunIdx == gunIdx) return;

        this.curGunIdx = gunIdx;

        for (let i = 0; i < this.guns.length; i++) {
            this.guns[i].active = i == gunIdx;
        }
        this.gun = this.guns[gunIdx];
    }

    rotateGun(touchPos: cc.Vec2) {
        var gunWorldPos = this.gunRotate.convertToWorldSpaceAR(cc.Vec2.ZERO);
        var d = touchPos.sub(gunWorldPos);
        var angle = Math.atan2(d.y, d.x) * Utils.Rad2Deg;

        this.gunRotate.rotation = angle;
    }

    shoot() {
        this.gun.parent.getComponent(cc.Animation).play();
    }
}
