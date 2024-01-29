const EventEmitter = require('TayDuEvents');
class TayDuEventEmitter {

    constructor () {
        this._emiter = new EventEmitter();
        this._emiter.setMaxListeners(100);
    }

    emit(...args)
    {
        this._emiter.emit(...args);
    }
    
    registerEvent(event, listener) {
        this._emiter.on(event, listener);
    }
    registerOnce(event, listener){
        this._emiter.once(event, listener);
    }

    removeEvent(event, listener) {
        this._emiter.removeListener(event, listener);
    }

    destroy()
    {
        this._emiter.removeAllListeners();
        this._emiter = null;
        TayDuEventEmitter.instance = null;
    }
}
TayDuEventEmitter.instance = null;
module.exports = TayDuEventEmitter;
