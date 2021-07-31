## miniSheetDB v2

Pustaka untuk [Google Apps Script (GAS)](https://www.google.com/script/start/) yang memberdayakan [Google Spreadsheet](https://docs.google.com/spreadsheets/?usp=mkt_sheets) menjadikan seolah-olah sebagai database aplikasi.

Ini adalah penerus dari versi lama [miniSheetDB v1](https://github.com/banghasan/minisheetdb) yang mana proyek yang awalnya berada pada repository pribadi [bangHasan](https://github.com/banghasan) sekarang dialihkan menjadi repository organisasi.

### Keuntungan

- Secara umum syntax tidak jauh berbeda dengan `miniSheetDB v1`
- Lebih mudah mengelola spreadsheet
- Penggunaan tidak hanya peruntukkan bot telegram, bisa untuk berbagai kebutuhan script
- Sekarang lebih banyak method, variable dan pilihan opsi pengelolaan data yang fleksibel
- Disertakan posisi `kolom` dan `baris` pada hasil pencarian, sehingga tidak ribet untuk pengolahan berikutnya
- Open Source, aman bisa dilihat, diteliti dan dikembangkan bersama.
- Struktur class yang jauh lebih rapi, mudah dipergunakan, dipelajari dan atau diturunkan

### Peringatan

Hasil dari `v2` ini tidak kompatible dengan `v1`, meskipun secara syntax memiliki banyak kemiripan.

> Selalu cek log hasil methodnya untuk memastikan.

## Pemakaian

### ID

- Legacy: `MbEHC24_R5YUoHX8iCbUEAaZTb1melOAr`
- New Editor: `1wMvpNwIL8fCMS7gN5XKPY7P-w4MmKT9yt_g2eXDGBtDErOIPq2vcNxIN`

### Start

```javascript
var ssid = 'idsheet';
var db = new miniSheetDB2.init(ssid);

function getAll() {
    let result = db.getAll();
    Logger.log(result);
}

function getKey() {
    let result = db.key('112233');
    Logger.log(result);
}
```

## Referensi

### Inisiasi

    init(id, tab = 0, options = {})

- `id` (`string`) bisa berupa sheet ID atau URL
- `tab` (`number` atau `sting`), default adalah tab sheet dengan index 0 (yang pertama). Nilai bisa berupa nomor index sheet, atau nama sheet. Misalnya `'Sheet1'`
- `options` pilihan operasional pada database. Periksa dibawah ini.

### Options

| **variable** | **tipe** | **default** | **keterangan**                                                                                                                                                                                    |
| ------------ | -------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `col_start`   | `number`   | 1           | sheet kolom dimulai                                                                                                                                                                                       |
| `col_length`  | `number`   | 2           | rentang sheet panjang kolom                                                                                                                                                                                       |
| `row_start`   | `number`   | 1           | baris dimulainya pemrosesan sheet                                                                                                                                                                                      |
| `json`         | `boolean`  | `false`       | Secara default (spreadsheet), hasil method `getAll` adalah bertipe Array. Maka, jika options `json` diisi `true` hasilnya akan diubah menjadi bertipe json. <br /><br />Konsekuensi nya adalah:<br /><br /> <ul><li>Key kosong diubah menjadi key bernilai `__@__`</li><li>Value yang dipakai adalah value yang ditemukan oleh key paling akhir</li></ul>  |

#### Contoh Pemakaian:

```javascript
var ssid = 'https://docs.google.com/spreadsheets/d/1B8JSBXqV0sIFZsuwDHQ8wOADFIAxgB7WDpJRh1JUei8/edit';
var db = new miniSheetDB2.init(ssid, 'Sheet1', {    
    col_length: 5,
    row_start: 2,
    json: true
});
```

#### Option bisa juga diset sesudah diinisiasi

Misalnya:

```javascript
db.col_length = 10;
```

### Method

Berikut list method, accessor, maupun field / tipe yang berada dalam class **miniSheetDB2**.

| **Method**  | **Params**               | **Keterangan**                                                                                                                                                                                                 |
| ----------- | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`        | -                | mendapatkan / memasukkan`id` yang telah diinput |
| `ssid`        | -                | mendapatkan ssid yang aktif sekarang dipakai                                                                                                                                                                   |
| `type`        | -                | mendapatkan tipe ssid yang aktif, hasil berupa string bernilai `http` atau `id` sesuai tipe ssid yang diinput                                                                                                                                             |
| `url`         | -                | mendapatkan url yang aktif sekarang dipakai                                                                                                                                                                    |
| `name`        | -                | mendapatkan nama sheet (title) dari tab yang saat ini dipakai                                                                                                                                                  |
| `sheet`       | -                | Pointer utama pengoperasian sheet.<br />Cek method-method pada [spreadsheet] |
| `last_row`   | -                         | Mendapatkan posisi terakhir baris sheet                                                                                                                                                                        |
| `data_range` | - | Mendapatkan data range dalam A1Notation
| `range()`     | a1Notation, kolom, baris | Mendapatkan pointer range untuk pengolahan selanjutnya. <br />Cek method-method pada [range]  |
| `getValue()`  | a1Notation, kolom, baris | mendapatkan isi suatu range                                                                                                                                                                                    |
| `getValues()` | a1Notation, kolom, baris | mendapatkan isi suatu range secara massal                                                                                                                                                                      |
| `setValue()`  | a1Notation, kolom, baris | mengisi nilai suatu range                                                                                                                                                                                      |
| `setValues()` | a1Notation, kolom, baris | mengisi nilai suatu range secara massal                                                                                                                                                                        |
| `getAll()`    | `boolean`                  | mendapatkan seluruh isi sheet, sesuai parameter awal                                                                                                                                                             |
| `key()`       | id (`string` atau `number`)                      | Pencarian isi suatu range berdasarkan id / kunci                                                                                                                                                               |
| `keys()`      | `[id1, id2, ...id]`       | Pencarian isi suatu range berdasarkan id / kunci secara massal                                                                                                                                                 |
| `search()`    | `String` atau `regexp`          | pencarian berdasarkan key menggunakan string atau reguler expression                                                                                                                                           |
| `searchAll()`    | `String` atau `regexp`          | pencarian jamak berdasarkan key, jika ketemu akan tetep dilanjutkan ke field berikutnya                                                                                                                                      |

## Detail

Penjelasan detail dan disertai berbagai contoh.

### key

mendapatkan data berdasarkan `id`.

`id` harus sama identik dengan key.

jika ditemukan, ada field `range` untuk pengolahan advance.

```javascript
// id = hasanudin
// id = 12345
var result = db.key(12345);  // ketemu
var result = db.key('hasanudin'); // ketemu
var result = db.key('hasan'); // tidak ketemu
```

### keys

mendapatkan data berdasarkan `id` secara massal (lebih dari satu)

```javascript
// penjelasan idem dengan method key
var result = db.keys([111, 222, 333]);
var result = db.keys(['hasan', 'amir']);
```

### search

Mendapatkan data berdasarkan `id` menggunakan reguler expression.

`id` bisa berupa `number`, `string` atau `regex`

Perbedaan jika menggunakan method `key` jika bertipe string: 

- method `search` data parsial tetap ditemukan
- method `key` harus bertipe eksak (sama persis).

jika ditemukan, ada field `range` untuk pengolahan advance.

Terdapat juga field `match` yang merupakan hasil regex.

```javascript
// id = Hasanudin
// id = ikhsan
var result = db.search('hasan'); // ketemu
var result = db.search(/^hasan$/); // tidak ketemu
var result = db.search(/san$/i); // ketemu
```

### searchAll

Serupa dengan method `search` diatas.

Contoh kasus, ingin menemukan semua kunci yang berawalan angka depan `71`

Hasil berupa array.

```javascript
// id key = 700, 711, 712, 811, 812
var result = db.searchAll(/^71/); // 711, 712
```

### getValue

Ref: [getValue](https://developers.google.com/apps-script/reference/spreadsheet/range#getvalue)

mendapatkan isi sebuah range

```javascript
var result = db.getValue('Sheet1!A1');
var result = db.getValue('A1');
var result = db.getValue(1,1);
```

### getValues

Ref: [getValues](https://developers.google.com/apps-script/reference/spreadsheet/range#getvalues)

mendapatkan isi range secara jamak

```javascript
var result = db.getValues('A1');
var result = db.getValues('Sheet1!A1');
var result = db.getValues('Sheet1!A1:C4');
var result = db.getValues(1,1);
var result = db.getValues(1,1,2);
var result = db.getValues(1,1,2,10);
```

### setValue
Ref: [setValue](https://developers.google.com/apps-script/reference/spreadsheet/range#setvaluevalue)

mengisi nilai suatu `range`, jika berhasil result berupa object [range].

```javascript
var result = db.setValue('rules!A1', 'Test');

db.setValue('A1', 'Test');
db.setValue(1, 1, 'Test');
```

### setValues

Ref: [setValues](https://developers.google.com/apps-script/reference/spreadsheet/range#setvaluesvalues)

Mengisi nilai beberapa range sekaligus, dengan value bertipe array.

Contoh beberapa variasi:

```javascript
var resulit = db.setValues('rules!A1', [['Test A1']]);

db.setValues('A10:A11', [['Baris 1'], ['Baris 2']]);
db.setValues('A10:B11', [['Baris 1', 'Samping 1'], ['Baris 2', 'Samping 2']]);

db.setValues(10, 1, [['Test A10']] );
db.setValues(10, 1, 2, [['Baris 1'], ['Baris 2']] );
db.setValues(10, 1, 2, 2, [['Baris 1', 'Samping 1'], ['Baris 2', 'Samping 2']] );
```

### getAll

Untuk mendapatkan semua data sheet aktif:

```javascript
// tipe array
// semua data tampil apa adanya
var resArray = db.getAll();

// untuk tipe JSON
// key kosong diubah __@__ 
// jika key sama, data terakhir akan menimpa
var resJSON = db.getAll(true);
```


## sheet

### Bikin Baru

```javascript
db.app.insertSheet();
db.app.insertSheet(1); // sheet baru posisi ke-2
db.app.insertSheet('Sheet Baru');
db.app.insertSheet('Sheet Baru Paling Depan', 0);
```

### Clear

Membersihkan range .

```javascript
// dibersihkan seluruhnya, isi dan format
db.range('A1:B1').clear();
// bersihkan isinya saja
db.range('A1:B1').clear({contentsOnly: true});

// membersihkan format saja
db.range('A1:B1').clearFormat();
// membersihkan isinya saja
db.range('A1:B1').clearContent();
```

### Data Range

Menghasilkan jangkuan data yang telah dipakai.

```javascript
vat dataRange = db.data_range; // misal: A1:E217
```

### Style

```javascript
db.range('C1:D1').setFontColor("red");
db.range('A1:A2').setBackground("black");

var style = SpreadsheetApp.newTextStyle()
    .setFontSize(15)
    .setUnderline(true)
    .setFontColor("red")
    .build();
db.range('A1:B1').setTextStyle(style);
```

## Kontribusi

- Silakan di fork dan pull request
- Ada masalah atau saran pengembangan? silakan buat issue baru.

[range]: https://developers.google.com/apps-script/reference/spreadsheet/range
[spreadsheet]: https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet