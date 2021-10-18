/*
* Name      : GAS Library - miniSheetDBv2
* Release   : 31 Juli 2021
*
* Programmer: Hasanudin H Syafaat
* Telegram  : @hasanudinhs 
* Email     : banghasan@gmail.com
* Github    : banghasan
*
* ID Legacy : MbEHC24_R5YUoHX8iCbUEAaZTb1melOAr
* New Editor: 1wMvpNwIL8fCMS7gN5XKPY7P-w4MmKT9yt_g2eXDGBtDErOIPq2vcNxIN
*
* Grup Telegram @botindonesia
*/

var version = '2.5.0';

class DB {
    constructor(id, tab = 0, options = {}) {
        this.options = options;

        // sheet by id or url
        this.id = id;
        this.tab = tab;

        this.json = options.json || false;

        this.col_start = options.col_start || 1;
        this.col_length = options.col_length || 2;

        this.row_start = options.row_start || 1;
        // this.row_length = options.row_length || false;

        this.versi = version;
        this.init();
    }

    init() {
        let tab = this.tab;
        let app = this.type == 'http'
            ? SpreadsheetApp.openByUrl(this.id)
            : SpreadsheetApp.openById(this.id);

        this.app = app;
        this.sheet = this.check(tab) == 'string' ? app.getSheetByName(tab) : app.getSheets()[tab];
    }

    get version() {
        return this.versi;
    }

    get type() {
        return this.id.match(/^http/i) ? 'http' : 'id';
    }

    get ssid() {
        return this.app.getId();
        // return this.sheet.getSheetId();
    }

    get url() {
        return this.app.getUrl();
    }

    get name() {
        return this.sheet.getSheetName();
    }

    get last_row() {
        return this.sheet.getLastRow();
    }

    get data_range() {
        return this.sheet.getDataRange().getA1Notation();
    }

    range() {
        if (arguments.length < 1 || arguments.length > 4) return false;

        let sheet = this.sheet;

        // 'A1'
        if (arguments.length == 1) return sheet.getRange(arguments[0]);
        // 1,1
        if (arguments.length == 2) return sheet.getRange(arguments[0], arguments[1]);
        // 1,1,2
        if (arguments.length == 3) return sheet.getRange(arguments[0], arguments[1], arguments[2]);
        // 1,1,2,2
        if (arguments.length == 4) return sheet.getRange(arguments[0], arguments[1], arguments[2], arguments[3]);
    }

    errorMessage(message, more = {}) {
        return {
            status: false,
            message,
            ...more
        }
    }

    add(...args) {
        let len = this.col_length;

        if (args.length < 1) return this.errorMessage('empty');
        let data;
        // add([1,2])
        if (this.check(args[0]) == 'array') {
            if (args[0].length !== len) return this.errorMessage('Array length must ' + len, { len: args[0].length, data: args[0] });
            data = [args[0]];
        } else {
            if (args.length !== len) return this.errorMessage('Arguments length must ' + len, { len: args.length, data: args });
            data = [[...args]];
        }

        return this.setValues(this.last_row + 1, this.col_start, 1, this.col_length, data);

    }

    getValue(...args) {
        if (arguments.length < 1 || args.length > 2) return false;

        let range = this.range(...args);
        if (!range) return false;

        return {
            range,
            pos: range.getA1Notation(),
            data: range.getValue()
        };
    }

    getValues(...args) {
        if (arguments.length < 1 || arguments.length > 4) return false;

        let range = this.range(...args);
        if (!range) return false;

        return {
            range,
            pos: range.getA1Notation(),
            data: range.getValues()
        };
    }

    setValue(...args) {
        if (arguments.length < 2 || args.length > 3) return false;

        let val = args.pop();
        let range = this.range(...args);
        if (!range) return false;

        return range.setValue(val);
    }

    setValues(...args) {
        if (arguments.length < 2 || arguments.length > 5) return false;

        let val = args.pop();
        let range = this.range(...args);
        if (!range) return false;

        return range.setValues(val);
    }

    getAll(json = this.json) {
        let x = this.row_start;

        let last_row = this.last_row - (x - 1);
        let results = this.getValues(x, this.col_start, last_row, this.col_length);

        if (!results) return false;

        // hasilnya array
        if (!json) return {
            ...results
        }

        let resJson = {
            range: results.range,
            col: this.col_start,
            body: {}
        }

        x--;
        results.data.forEach((values, index) => {
            x++;
            let key = values[0] || '___';
            resJson.body[key] = {
                row: x,
                data: values
            };
        })
        return resJson;
    }

    // keys(1);
    key(id) {
        let data = this.getAll(true);
        if (!data) return false;
        if (!data.body[id]) return false;
        let range = this.range(data.body[id].row, data.col)
        return {
            id,
            col: data.col,
            ...data.body[id],
            pos: range.getA1Notation(),
            range,
        }
    }

    del(id) {
        let r = this.key(id);
        if (r) return this.sheet.deleteRow(r.row);
        return false;
    }

    // keys(1);
    // keys([1,2,3]);
    keys(ids) {
        if (this.check(ids) == 'number') ids = [ids];

        let data = this.getAll(true);
        if (!data) return false;

        let body = {};

        ids.forEach(value => {
            body[value] = data.body[value] ? { ...data.body[value] } : null;
        })

        return {
            id: ids,
            col: data.col,
            body
        };
    }

    // search(hasan)
    // search(/^banghasan/i)
    search(key, stop = true) {
        let data = this.getAll(true);
        if (!data) return false;

        let regex = this.check(key) === 'regexp' ? key : new RegExp(key, 'mi');

        var result = stop ? false : [];
        let found = false;
        Object.keys(data.body).forEach(v => {
            if (found && stop) return;
            let match;
            if (match = regex.exec(v)) {
                found = true;
                let range = this.range(data.body[v].row, data.col);
                let getIt = {
                    col: data.col,
                    ...data.body[v],
                    pos: range.getA1Notation(),
                    range, regex, match
                }
                if (stop) return result = getIt;
                result.push(getIt);
            }
        });
        return result;
    }

    searchAll(key) {
        return this.search(key, false);
    }

    /*  result: ranges
        tipe 1: findText('anu')
        tipe 2: findText('anu', boolean[regex])
        tipe 2: findText('anu', boolean[regex], range)
    */
    findText(text, regex = false, ...ranges) {
        let r = (arguments.length > 2) ? ranges : [this.data_range];
        let ranges_result = this.sheet
            .getRange(...r)
            .createTextFinder(text)
            .useRegularExpression(regex)
            .findAll()
            .map((r) => r.getA1Notation());
        return ranges_result;
    }

    // get type of variable
    check(value) {
        const return_value = Object.prototype.toString.call(value);
        // we can also use regex to do this...
        const type = return_value.substring(
            return_value.indexOf(" ") + 1,
            return_value.indexOf("]"));

        return type.toLowerCase();
    }

}

var init = DB;