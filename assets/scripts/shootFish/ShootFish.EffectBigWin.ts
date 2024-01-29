import Utils from "./common/Utils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EffectBigWin extends cc.Component {
    @property(cc.Label)
    lblNickname: cc.Label = null;
    @property(cc.Label)
    lblServiceName: cc.Label = null;
    @property(cc.Label)
    lblCoin: cc.Label = null;

    public show(isShow: boolean, nickname: string = null, coin: number = 0, serviceId: number = 0){
        this.node.stopAllActions();
        if(isShow){
            var serviceName = '';
            this.lblCoin.string = Utils.formatNumber(coin);
            this.lblNickname.string = nickname;
            this.lblServiceName.string = serviceName;
            this.lblNickname.node.active = true;
            this.lblCoin.node.active = true;
            this.node.active = true;
            this.node.scale = 0;
            this.node.runAction(cc.sequence(
                cc.scaleTo(0.4, 1),
                cc.delayTime(3),
                cc.callFunc(()=>{
                    this.node.active = false;
                })
            ))
        }else{
            this.node.active = false;
        }
    }
}
