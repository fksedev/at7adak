import { EventEmitter } from 'events'

type Options = {
    forceString?: boolean;
    objectValueSize?: number;
    promiseValueSize?: number;
    arrayValueSize?: number;
    stdTTL?: number;
    checkperiod?: number;
    deleteOnExpire?: boolean;
    enableLegacyCallbacks?: boolean;
    maxKeys?: number;
}

type Stats = {
    hits: number;
    misses: number;
    keys: number;
    ksize: number;
    vsize: number;
}

const boundMethodCheck = (instance, Constructor) => {
    if (!(instance instanceof Constructor)) {
        throw new Error('Bound instance method accessed before binding');
    }
}

const splice = [].splice
const indexOf = [].indexOf

export default class NodeCache extends EventEmitter {
    options: Options;
    stats: Stats;
    data: any;
    validKeyTypes: string[];
    checkTimeout: NodeJS.Timeout | undefined;
    ERRORS: any;
    _ERRORS = {
        "ENOTFOUND": "Key `__key` not found",
        "ECACHEFULL": "Cache max keys amount exceeded",
        "EKEYTYPE": "The key argument has to be of type `string` or `number`. Found: `__key`",
        "EKEYSTYPE": "The keys argument has to be an array.",
        "ETTLTYPE": "The ttl argument has to be a number."
    }

    constructor(options: Options) {
        super()
        this.options = options
        this._initErrors();
        this.data = {};

        this.options = Object.assign({
            // convert all elements to string
            forceString: false,
            // used standard size for calculating value size
            objectValueSize: 80,
            promiseValueSize: 80,
            arrayValueSize: 40,
            // standard time to live in seconds. 0 = infinity;
            stdTTL: 0,
            // time in seconds to check all data and delete expired keys
            checkperiod: 600,
            // whether values should be deleted automatically at expiration
            deleteOnExpire: true,
            // enable legacy callbacks
            enableLegacyCallbacks: false,
            // max amount of keys that are being stored
            maxKeys: -1
        }, this.options);

        if (this.options.enableLegacyCallbacks) {
            console.warn("WARNING! node-cache legacy callback support will drop in v6.x");
            ["get", "mget", "set", "del", "ttl", "getTtl", "keys", "has"].forEach((methodKey) => {
                var oldMethod;
                // reference real function
                oldMethod = this[methodKey];
                this[methodKey] = function (...args) {
                    var cb, err, ref, res;
                    ref = args, [...args] = ref, [cb] = splice.call(args, -1);
                    // return a callback if cb is defined and a function
                    if (typeof cb === "function") {
                        try {
                            res = oldMethod(...args);
                            cb(null, res);
                        } catch (error1) {
                            err = error1;
                            cb(err);
                        }
                    } else {
                        return oldMethod(...args, cb);
                    }
                };
            });
        }

        // statistics container
        this.stats = {
            hits: 0,
            misses: 0,
            keys: 0,
            ksize: 0,
            vsize: 0
        };
        // pre allocate valid keytypes array
        this.validKeyTypes = ["string", "number"];
        // initalize checking period
        this._checkData();
        return;
    }

    get(key) {
        var _ret, err;
        boundMethodCheck(this, NodeCache);
        // handle invalid key types
        if ((err = this._isInvalidKey(key)) != null) {
            throw err;
        }
        // get data and incremet stats
        if ((this.data[key] != null) && this._check(key, this.data[key])) {
            this.stats.hits++;
            _ret = this._unwrap(this.data[key]);
            // return data
            return _ret;
        } else {
            // if not found return undefined
            this.stats.misses++;
            return void 0;
        }
    }

    mget(keys) {
        var _err, err, i, key, len, oRet;
        boundMethodCheck(this, NodeCache);
        // convert a string to an array of one key
        if (!Array.isArray(keys)) {
            _err = this._error("EKEYSTYPE");
            throw _err;
        }
        // define return
        oRet = {};
        for (i = 0, len = keys.length; i < len; i++) {
            key = keys[i];
            // handle invalid key types
            if ((err = this._isInvalidKey(key)) != null) {
                throw err;
            }
            // get data and increment stats
            if ((this.data[key] != null) && this._check(key, this.data[key])) {
                this.stats.hits++;
                oRet[key] = this._unwrap(this.data[key]);
            } else {
                // if not found return a error
                this.stats.misses++;
            }
        }
        // return all found keys
        return oRet;
    }

    set(key: string, value: any, ttl: number | null = null) {
        var _err, err, existent;
        boundMethodCheck(this, NodeCache);
        // check if cache is overflowing
        if (this.options.maxKeys! > -1 && this.stats.keys >= this.options.maxKeys!) {
            _err = this._error("ECACHEFULL");
            throw _err;
        }
        // force the data to string
        if (this.options.forceString && typeof value !== "string") {
            value = JSON.stringify(value);
        }
        // set default ttl if not passed
        if (ttl == null) {
            ttl = this.options.stdTTL!;
        }
        // handle invalid key types
        if ((err = this._isInvalidKey(key)) != null) {
            throw err;
        }
        // internal helper variables
        existent = false;
        // remove existing data from stats
        if (this.data[key]) {
            existent = true;
            this.stats.vsize -= this._getValLength(this._unwrap(this.data[key]));
        }
        // set the value
        this.data[key] = this._wrap(value, ttl);
        this.stats.vsize += this._getValLength(value);
        // only add the keys and key-size if the key is new
        if (!existent) {
            this.stats.ksize += this._getKeyLength(key);
            this.stats.keys++;
        }
        this.emit("set", key, value);
        // return true
        return true;
    }

    mset(keyValueSet) {
        var _err, err, i, j, key, keyValuePair, len, len1, ttl, val;
        boundMethodCheck(this, NodeCache);
        // check if cache is overflowing
        if (this.options.maxKeys! > -1 && this.stats.keys + keyValueSet.length >= this.options.maxKeys!) {
            _err = this._error("ECACHEFULL");
            throw _err;
        }

        // loop over keyValueSet to validate key and ttl
        for (i = 0, len = keyValueSet.length; i < len; i++) {
            keyValuePair = keyValueSet[i];
            ({ key, val, ttl } = keyValuePair);
            // check if there is ttl and it's a number
            if (ttl && typeof ttl !== "number") {
                _err = this._error("ETTLTYPE");
                throw _err;
            }
            // handle invalid key types
            if ((err = this._isInvalidKey(key)) != null) {
                throw err;
            }
        }
        for (j = 0, len1 = keyValueSet.length; j < len1; j++) {
            keyValuePair = keyValueSet[j];
            ({ key, val, ttl } = keyValuePair);
            this.set(key, val, ttl);
        }
        return true;
    }

    del(keys) {
        var delCount, err, i, key, len, oldVal;
        boundMethodCheck(this, NodeCache);
        // convert keys to an array of itself
        if (!Array.isArray(keys)) {
            keys = [keys];
        }
        delCount = 0;
        for (i = 0, len = keys.length; i < len; i++) {
            key = keys[i];
            // handle invalid key types
            if ((err = this._isInvalidKey(key)) != null) {
                throw err;
            }
            // only delete if existent
            if (this.data[key] != null) {
                // calc the stats
                this.stats.vsize -= this._getValLength(this._unwrap(this.data[key]));
                this.stats.ksize -= this._getKeyLength(key);
                this.stats.keys--;
                delCount++;
                // delete the value
                oldVal = this.data[key];
                delete this.data[key];
                // return true
                this.emit("del", key, oldVal.v);
            }
        }
        return delCount;
    }

    take(key) {
        var _ret;
        boundMethodCheck(this, NodeCache);
        _ret = this.get(key);
        if ((_ret != null)) {
            this.del(key);
        }
        return _ret;
    }

    ttl(key, ttl) {
        var err;
        boundMethodCheck(this, NodeCache);
        ttl || (ttl = this.options.stdTTL);
        if (!key) {
            return false;
        }
        // handle invalid key types
        if ((err = this._isInvalidKey(key)) != null) {
            throw err;
        }
        // check for existent data and update the ttl value
        if ((this.data[key] != null) && this._check(key, this.data[key])) {
            // if ttl < 0 delete the key. otherwise reset the value
            if (ttl >= 0) {
                this.data[key] = this._wrap(this.data[key].v, ttl);
            } else {
                this.del(key);
            }
            return true;
        } else {
            // return false if key has not been found
            return false;
        }
    }

    getTtl(key) {
        var _ttl, err;
        boundMethodCheck(this, NodeCache);
        if (!key) {
            return void 0;
        }
        // handle invalid key types
        if ((err = this._isInvalidKey(key)) != null) {
            throw err;
        }
        // check for existant data and update the ttl value
        if ((this.data[key] != null) && this._check(key, this.data[key])) {
            _ttl = this.data[key].t;
            return _ttl;
        } else {
            // return undefined if key has not been found
            return void 0;
        }
    }

    keys() {
        var _keys;
        boundMethodCheck(this, NodeCache);
        _keys = Object.keys(this.data);
        return _keys;
    }

    has(key) {
        var _exists;
        boundMethodCheck(this, NodeCache);
        _exists = (this.data[key] != null) && this._check(key, this.data[key]);
        return _exists;
    }

    getStats() {
        boundMethodCheck(this, NodeCache);
        return this.stats;
    }

    flushAll(_startPeriod = true) {
        boundMethodCheck(this, NodeCache);
        // parameter just for testing

        // set data empty
        this.data = {};
        // reset stats
        this.stats = {
            hits: 0,
            misses: 0,
            keys: 0,
            ksize: 0,
            vsize: 0
        };
        // reset check period
        this._killCheckPeriod();
        this._checkData(_startPeriod);
        this.emit("flush");
    }

    flushStats() {
        boundMethodCheck(this, NodeCache);
        // reset stats
        this.stats = {
            hits: 0,
            misses: 0,
            keys: 0,
            ksize: 0,
            vsize: 0
        };
        this.emit("flush_stats");
    }

    close() {
        boundMethodCheck(this, NodeCache);
        this._killCheckPeriod();
    }

    _checkData(startPeriod = true) {
        var key, ref, value;
        boundMethodCheck(this, NodeCache);
        ref = this.data;
        // run the housekeeping method
        for (key in ref) {
            value = ref[key];
            this._check(key, value);
        }
        if (startPeriod && this.options.checkperiod! > 0) {
            this.checkTimeout = setTimeout(this._checkData, this.options.checkperiod! * 1000, startPeriod);
            if ((this.checkTimeout != null) && (this.checkTimeout.unref != null)) {
                this.checkTimeout.unref();
            }
        }
    }

    // ## _killCheckPeriod

    // stop the checkdata period. Only needed to abort the script in testing mode.
    _killCheckPeriod() {
        if (this.checkTimeout != null) {
            return clearTimeout(this.checkTimeout);
        }
    }

    _check(key, data) {
        var _retval;
        boundMethodCheck(this, NodeCache);
        _retval = true;
        // data is invalid if the ttl is too old and is not 0
        // console.log data.t < Date.now(), data.t, Date.now()
        if (data.t !== 0 && data.t < Date.now()) {
            if (this.options.deleteOnExpire) {
                _retval = false;
                this.del(key);
            }
            this.emit("expired", key, this._unwrap(data));
        }
        return _retval;
    }

    _isInvalidKey(key) {
        var ref;
        boundMethodCheck(this, NodeCache);
        if (ref = typeof key, indexOf.call(this.validKeyTypes, ref) < 0) {
            return this._error("EKEYTYPE", {
                type: typeof key
            });
        }
    }

    _wrap(value, ttl) {
        var livetime, now, oReturn, ttlMultiplicator;
        boundMethodCheck(this, NodeCache);
        
        // define the time to live
        now = Date.now();
        livetime = 0;
        ttlMultiplicator = 1000;
        // use given ttl
        if (ttl === 0) {
            livetime = 0;
        } else if (ttl) {
            livetime = now + (ttl * ttlMultiplicator);
        } else {
            // use standard ttl
            if (this.options.stdTTL === 0) {
                livetime = this.options.stdTTL;
            } else {
                livetime = now + (this.options.stdTTL! * ttlMultiplicator);
            }
        }
        // return the wrapped value
        return oReturn = {
            t: livetime,
            v: value
        };
    }

    // ## _unwrap

    // internal method to extract get the value out of the wrapped value
    _unwrap(value) {
        if (value.v != null) {
            return value.v;
        }
        return null;
    }

    // ## _getKeyLength

    // internal method the calculate the key length
    _getKeyLength(key) {
        return key.toString().length;
    }

    _getValLength(value) {
        boundMethodCheck(this, NodeCache);
        if (typeof value === "string") {
            // if the value is a String get the real length
            return value.length;
        } else if (this.options.forceString) {
            // force string if it's defined and not passed
            return JSON.stringify(value).length;
        } else if (Array.isArray(value)) {
            // if the data is an Array multiply each element with a defined default length
            return this.options.arrayValueSize! * value.length;
        } else if (typeof value === "number") {
            return 8;
        } else if (typeof (value != null ? value.then : void 0) === "function") {
            // if the data is a Promise, use defined default
            // (can't calculate actual/resolved value size synchronously)
            return this.options.promiseValueSize;
        } else if (typeof Buffer !== "undefined" && Buffer !== null ? Buffer.isBuffer(value) : void 0) {
            return value.length;
        } else if ((value != null) && typeof value === "object") {
            // if the data is an Object multiply each element with a defined default length
            return this.options.objectValueSize! * Object.keys(value).length;
        } else if (typeof value === "boolean") {
            return 8;
        } else {
            // default fallback
            return 0;
        }
    }

    _error(type, data = {}) {
        var error;
        boundMethodCheck(this, NodeCache);
        // generate the error object
        error = new Error();
        error.name = type;
        error.errorcode = type;
        error.message = this.ERRORS[type] != null ? this.ERRORS[type](data) : "-";
        error.data = data;
        // return the error object
        return error;
    }

    _initErrors() {
        var _errMsg, _errT, ref;
        boundMethodCheck(this, NodeCache);
        this.ERRORS = {};
        ref = this._ERRORS;
        for (_errT in ref) {
            _errMsg = ref[_errT];
            this.ERRORS[_errT] = this.createErrorMessage(_errMsg);
        }
    }

    createErrorMessage(errMsg) {
        return function (args) {
            return errMsg.replace("__key", args.type);
        };
    }

}
