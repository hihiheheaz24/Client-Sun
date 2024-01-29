const EventEmitter = require('TTEvents');
class TTEventEmitter {

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
        TTEventEmitter.instance = null;
    }
}
TTEventEmitter.instance = null;
module.exports = TTEventEmitter;
