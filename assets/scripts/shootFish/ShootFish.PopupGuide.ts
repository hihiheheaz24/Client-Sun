import Dialog from "./common/Dialog";
import Play from "./ShootFish.Play";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PopupGuide extends Dialog {
    @property(cc.Node)
    grid: cc.Node = null;
    @property(cc.Node)
    itemTemplate: cc.Node = null;

    private items: Array<cc.Node> = [];

    private inited = false;

    private mapFishType = {
        0: ["Cuttle", 1],
        1: ['GoldFish', 1],
        2: ['LightenFish', 1],
        3: ['Mermaid', 1],
        4: ['Octopus', 1],
        5: ['PufferFish', 0.8],
        6: ['SeaFish', 0.8],
        7: ['Shark', 0.8],
        8: ['Stringray', 0.8],
        9: ['Turtle', 0.7],
        10: ['CaThanTai', 0.7],
        11: ['FlyingFish', 0.7],
        12: ['GoldenFrog', 0.2],
        13: ['SeaTurtle', 0.7],
        14: ['MerMan', 0.6],
        15: ['Phoenix', 0.6],
        16: ['MermaidBig', 0.55],
        17: ['MermaidSmall', 0.5],
        18: ['BombFish', 0.5],
        19: ['Fish19', 0.4],
        20: ['Fish20', 0.4],
        21: ['Fish21', 0.5],
        22: ['Fish22', 0.3],
        23: ['Fish23', 0.3],
        24: ['Fish24', 0.25],
    }

    show(){
        super.show();
        this.itemTemplate.active = false;
    }

    _onShowed() {
        super._onShowed();
     
        if(Play.SERVER_CONFIG == null) return;
        if(!this.inited){
            this.inited = true;
            for (let fishId in this.mapFishType) {
                let fishName = this.mapFishType[fishId][0];
                let scale = this.mapFishType[fishId][1];
                let dataConfig = Play.SERVER_CONFIG["FishPhysicalData"][fishName];
                let node = cc.instantiate(this.itemTemplate);
                node.parent = this.grid;
                node.active = true;
    
                let fish = cc.instantiate(Play.instance.getFishAnimByType(Number(fishId)));
                fish.parent = node.getChildByName("fishParent");
                fish.scale = scale;
                fish.rotation = -90;
    
                node.getChildByName("lblFactor").getComponent(cc.Label).string = (dataConfig["Health"] / 100).toString();
                this.items.push(node);
            }
        }
      
    }

    // dismiss() {
    //     this.items.forEach(x => {
    //         x.removeFromParent();
    //     });
    //     super.dismiss();
    // }
}
