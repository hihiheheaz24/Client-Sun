
(function () {
    cc.NewsView = cc.Class({
        "extends": cc.PopupBase,

        properties: {
            nodeTempContentNews: cc.Node,
            nodeNews: cc.Node,
            scrollViewNews: cc.ScrollView,

            nodeMail: cc.Node,
            scrollViewMail: cc.ScrollView,

            nodeInfoContent: cc.Node,
            lblInfoTime: cc.Label,
            lblInfoContent: cc.Label,
            lblInfoTitle: cc.Label,
        },

        onEnable () {
            this.node.zIndex = cc.NoteDepth.POPUP_PORTAL;
            this.animation.play('openPopup');

            this.getNews();
            this.getMails();

            this.nodeNews.active = false;
            this.nodeMail.active = true;
            this.nodeInfoContent.active = false;
        },

        getNews: function () {
            var userNewsCommand = new cc.UserNewsCommand;
            userNewsCommand.execute(this);
        },

        getMails: function () {
            var userMailCommand = new cc.UserMailCommand;
            userMailCommand.execute(this);
        },

        showMail: function () {
            this.nodeNews.active = false;
            this.nodeMail.active = true;
            this.hideContent();
        },

        showNews: function () {
            this.nodeNews.active = true;
            this.nodeMail.active = false;
            this.hideContent();
        },

        onUserMailResponse: function (data) {
            let listMail = data['List'];
            listMail.forEach(content => {
                let itemMail = cc.instantiate(this.nodeTempContentNews);
                itemMail.parent = this.scrollViewMail.content;
                let time = this.convertUTCTime(content.CreatedTime);
                itemMail.getChildByName("lblTitle").getComponent(cc.Label).string = content["Title"];
                itemMail.getChildByName("lblTime").getComponent(cc.Label).string = time;
                itemMail._time = time;
                itemMail._content = content["Content"];
            });
        },

        onUserNewsResponse: function (data) {
            let listNews = data['List'];
            listNews.forEach(content => {
                let itemNews = cc.instantiate(this.nodeTempContentNews);
                itemNews.parent = this.scrollViewNews.content;
                let time = this.convertUTCTime(content.CreatedTime);
                itemNews.getChildByName("lblTitle").getComponent(cc.Label).string = content["Title"];
                itemNews.getChildByName("lblTime").getComponent(cc.Label).string = time;
                itemNews._time = time;
                itemNews._content = content["Content"];
                itemNews._title = content["Title"];
            });
        },

        onTouchItem: function (event) {
            let target = event.target;
            this.nodeInfoContent.active = true;
            this.lblInfoTime.string = "Lúc: " + target._time;
            this.lblInfoContent.string = target._content;
            this.lblInfoTitle.string = target._title;

            this.scrollViewNews.content.children.forEach(element => {
                element.getChildByName("select").active = false;
            });
            target.getChildByName("select").active = true;
        },

        hideContent: function () {
            this.nodeInfoContent.active = false;
        },

        convertUTCTime: function (dateFormat) {
            var date = new Date(dateFormat + 'Z');

            function pad(v) {
                return v < 10 ? "0" + v : v;
            }

            return [pad(date.getUTCDate()), pad(date.getUTCMonth() + 1), date.getUTCFullYear()].join("-");
        },

        closeClicked: function () {
            this.animation.play('closePopup');
            var self = this;
            var delay = 0.3;
            cc.director.getScheduler().schedule(function () {
                self.animation.stop();
                cc.LobbyController.getInstance().destroyNewsView();
            }, this, 1, 0, delay, false);
        },
    });
}).call(this);
