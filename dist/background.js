var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target2) => (target2 = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target2, "default", { value: mod, enumerable: true }) : target2,
  mod
));

// node_modules/acorn/dist/acorn.js
var require_acorn = __commonJS({
  "node_modules/acorn/dist/acorn.js"(exports, module) {
    (function(global2, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global2 = global2 || self, factory(global2.acorn = {}));
    })(exports, function(exports2) {
      "use strict";
      var reservedWords2 = {
        3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",
        5: "class enum extends super const export import",
        6: "enum",
        strict: "implements interface let package private protected public static yield",
        strictBind: "eval arguments"
      };
      var ecma5AndLessKeywords2 = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this";
      var keywords2 = {
        5: ecma5AndLessKeywords2,
        "5module": ecma5AndLessKeywords2 + " export import",
        6: ecma5AndLessKeywords2 + " const class extends export import super"
      };
      var keywordRelationalOperator2 = /^in(stanceof)?$/;
      var nonASCIIidentifierStartChars2 = "\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEF\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7BF\uA7C2-\uA7C6\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB67\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC";
      var nonASCIIidentifierChars2 = "\u200C\u200D\xB7\u0300-\u036F\u0387\u0483-\u0487\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u0669\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u06F0-\u06F9\u0711\u0730-\u074A\u07A6-\u07B0\u07C0-\u07C9\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D3-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0966-\u096F\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09E6-\u09EF\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A66-\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AE6-\u0AEF\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B66-\u0B6F\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0BE6-\u0BEF\u0C00-\u0C04\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0CE6-\u0CEF\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D66-\u0D6F\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0E50-\u0E59\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECD\u0ED0-\u0ED9\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1040-\u1049\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F-\u109D\u135D-\u135F\u1369-\u1371\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u18A9\u1920-\u192B\u1930-\u193B\u1946-\u194F\u19D0-\u19DA\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AB0-\u1ABD\u1B00-\u1B04\u1B34-\u1B44\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BB0-\u1BB9\u1BE6-\u1BF3\u1C24-\u1C37\u1C40-\u1C49\u1C50-\u1C59\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DF9\u1DFB-\u1DFF\u203F\u2040\u2054\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA620-\uA629\uA66F\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F1\uA8FF-\uA909\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9D0-\uA9D9\uA9E5\uA9F0-\uA9F9\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA50-\uAA59\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uABF0-\uABF9\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFF10-\uFF19\uFF3F";
      var nonASCIIidentifierStart2 = new RegExp("[" + nonASCIIidentifierStartChars2 + "]");
      var nonASCIIidentifier2 = new RegExp("[" + nonASCIIidentifierStartChars2 + nonASCIIidentifierChars2 + "]");
      nonASCIIidentifierStartChars2 = nonASCIIidentifierChars2 = null;
      var astralIdentifierStartCodes2 = [0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 14, 29, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 19, 35, 5, 35, 5, 39, 9, 51, 157, 310, 10, 21, 11, 7, 153, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11, 25, 71, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 28, 43, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14, 50, 14, 35, 477, 28, 11, 0, 9, 21, 155, 22, 13, 52, 76, 44, 33, 24, 27, 35, 30, 0, 12, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 85, 6, 2, 0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 19, 0, 13, 4, 159, 52, 19, 3, 21, 0, 33, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0, 60, 42, 14, 0, 72, 26, 230, 43, 117, 63, 32, 0, 161, 7, 3, 38, 17, 0, 2, 0, 29, 0, 11, 39, 8, 0, 22, 0, 12, 45, 20, 0, 35, 56, 264, 8, 2, 36, 18, 0, 50, 29, 113, 6, 2, 1, 2, 37, 22, 0, 26, 5, 2, 1, 2, 31, 15, 0, 328, 18, 270, 921, 103, 110, 18, 195, 2749, 1070, 4050, 582, 8634, 568, 8, 30, 114, 29, 19, 47, 17, 3, 32, 20, 6, 18, 689, 63, 129, 74, 6, 0, 67, 12, 65, 1, 2, 0, 29, 6135, 9, 754, 9486, 286, 50, 2, 18, 3, 9, 395, 2309, 106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 2357, 44, 11, 6, 17, 0, 370, 43, 1301, 196, 60, 67, 8, 0, 1205, 3, 2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42710, 42, 4148, 12, 221, 3, 5761, 15, 7472, 3104, 541];
      var astralIdentifierCodes2 = [509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 574, 3, 9, 9, 525, 10, 176, 2, 54, 14, 32, 9, 16, 3, 46, 10, 54, 9, 7, 2, 37, 13, 2, 9, 6, 1, 45, 0, 13, 2, 49, 13, 9, 3, 4, 9, 83, 11, 7, 0, 161, 11, 6, 9, 7, 3, 56, 1, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 193, 17, 10, 9, 5, 0, 82, 19, 13, 9, 214, 6, 3, 8, 28, 1, 83, 16, 16, 9, 82, 12, 9, 9, 84, 14, 5, 9, 243, 14, 166, 9, 232, 6, 3, 6, 4, 0, 29, 9, 41, 6, 2, 3, 9, 0, 10, 10, 47, 15, 406, 7, 2, 7, 17, 9, 57, 21, 2, 13, 123, 5, 4, 0, 2, 1, 2, 6, 2, 0, 9, 9, 49, 4, 2, 1, 2, 4, 9, 9, 330, 3, 19306, 9, 135, 4, 60, 6, 26, 9, 1014, 0, 2, 54, 8, 3, 19723, 1, 5319, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 513, 54, 5, 49, 9, 0, 15, 0, 23, 4, 2, 14, 1361, 6, 2, 16, 3, 6, 2, 1, 2, 4, 262, 6, 10, 9, 419, 13, 1495, 6, 110, 6, 6, 9, 792487, 239];
      function isInAstralSet2(code, set) {
        var pos = 65536;
        for (var i = 0; i < set.length; i += 2) {
          pos += set[i];
          if (pos > code) {
            return false;
          }
          pos += set[i + 1];
          if (pos >= code) {
            return true;
          }
        }
      }
      function isIdentifierStart2(code, astral) {
        if (code < 65) {
          return code === 36;
        }
        if (code < 91) {
          return true;
        }
        if (code < 97) {
          return code === 95;
        }
        if (code < 123) {
          return true;
        }
        if (code <= 65535) {
          return code >= 170 && nonASCIIidentifierStart2.test(String.fromCharCode(code));
        }
        if (astral === false) {
          return false;
        }
        return isInAstralSet2(code, astralIdentifierStartCodes2);
      }
      function isIdentifierChar2(code, astral) {
        if (code < 48) {
          return code === 36;
        }
        if (code < 58) {
          return true;
        }
        if (code < 65) {
          return false;
        }
        if (code < 91) {
          return true;
        }
        if (code < 97) {
          return code === 95;
        }
        if (code < 123) {
          return true;
        }
        if (code <= 65535) {
          return code >= 170 && nonASCIIidentifier2.test(String.fromCharCode(code));
        }
        if (astral === false) {
          return false;
        }
        return isInAstralSet2(code, astralIdentifierStartCodes2) || isInAstralSet2(code, astralIdentifierCodes2);
      }
      var TokenType3 = function TokenType4(label, conf) {
        if (conf === void 0)
          conf = {};
        this.label = label;
        this.keyword = conf.keyword;
        this.beforeExpr = !!conf.beforeExpr;
        this.startsExpr = !!conf.startsExpr;
        this.isLoop = !!conf.isLoop;
        this.isAssign = !!conf.isAssign;
        this.prefix = !!conf.prefix;
        this.postfix = !!conf.postfix;
        this.binop = conf.binop || null;
        this.updateContext = null;
      };
      function binop2(name, prec) {
        return new TokenType3(name, { beforeExpr: true, binop: prec });
      }
      var beforeExpr2 = { beforeExpr: true }, startsExpr2 = { startsExpr: true };
      var keywords$12 = {};
      function kw2(name, options) {
        if (options === void 0)
          options = {};
        options.keyword = name;
        return keywords$12[name] = new TokenType3(name, options);
      }
      var types3 = {
        num: new TokenType3("num", startsExpr2),
        regexp: new TokenType3("regexp", startsExpr2),
        string: new TokenType3("string", startsExpr2),
        name: new TokenType3("name", startsExpr2),
        eof: new TokenType3("eof"),
        // Punctuation token types.
        bracketL: new TokenType3("[", { beforeExpr: true, startsExpr: true }),
        bracketR: new TokenType3("]"),
        braceL: new TokenType3("{", { beforeExpr: true, startsExpr: true }),
        braceR: new TokenType3("}"),
        parenL: new TokenType3("(", { beforeExpr: true, startsExpr: true }),
        parenR: new TokenType3(")"),
        comma: new TokenType3(",", beforeExpr2),
        semi: new TokenType3(";", beforeExpr2),
        colon: new TokenType3(":", beforeExpr2),
        dot: new TokenType3("."),
        question: new TokenType3("?", beforeExpr2),
        arrow: new TokenType3("=>", beforeExpr2),
        template: new TokenType3("template"),
        invalidTemplate: new TokenType3("invalidTemplate"),
        ellipsis: new TokenType3("...", beforeExpr2),
        backQuote: new TokenType3("`", startsExpr2),
        dollarBraceL: new TokenType3("${", { beforeExpr: true, startsExpr: true }),
        // Operators. These carry several kinds of properties to help the
        // parser use them properly (the presence of these properties is
        // what categorizes them as operators).
        //
        // `binop`, when present, specifies that this operator is a binary
        // operator, and will refer to its precedence.
        //
        // `prefix` and `postfix` mark the operator as a prefix or postfix
        // unary operator.
        //
        // `isAssign` marks all of `=`, `+=`, `-=` etcetera, which act as
        // binary operators with a very low precedence, that should result
        // in AssignmentExpression nodes.
        eq: new TokenType3("=", { beforeExpr: true, isAssign: true }),
        assign: new TokenType3("_=", { beforeExpr: true, isAssign: true }),
        incDec: new TokenType3("++/--", { prefix: true, postfix: true, startsExpr: true }),
        prefix: new TokenType3("!/~", { beforeExpr: true, prefix: true, startsExpr: true }),
        logicalOR: binop2("||", 1),
        logicalAND: binop2("&&", 2),
        bitwiseOR: binop2("|", 3),
        bitwiseXOR: binop2("^", 4),
        bitwiseAND: binop2("&", 5),
        equality: binop2("==/!=/===/!==", 6),
        relational: binop2("</>/<=/>=", 7),
        bitShift: binop2("<</>>/>>>", 8),
        plusMin: new TokenType3("+/-", { beforeExpr: true, binop: 9, prefix: true, startsExpr: true }),
        modulo: binop2("%", 10),
        star: binop2("*", 10),
        slash: binop2("/", 10),
        starstar: new TokenType3("**", { beforeExpr: true }),
        // Keyword token types.
        _break: kw2("break"),
        _case: kw2("case", beforeExpr2),
        _catch: kw2("catch"),
        _continue: kw2("continue"),
        _debugger: kw2("debugger"),
        _default: kw2("default", beforeExpr2),
        _do: kw2("do", { isLoop: true, beforeExpr: true }),
        _else: kw2("else", beforeExpr2),
        _finally: kw2("finally"),
        _for: kw2("for", { isLoop: true }),
        _function: kw2("function", startsExpr2),
        _if: kw2("if"),
        _return: kw2("return", beforeExpr2),
        _switch: kw2("switch"),
        _throw: kw2("throw", beforeExpr2),
        _try: kw2("try"),
        _var: kw2("var"),
        _const: kw2("const"),
        _while: kw2("while", { isLoop: true }),
        _with: kw2("with"),
        _new: kw2("new", { beforeExpr: true, startsExpr: true }),
        _this: kw2("this", startsExpr2),
        _super: kw2("super", startsExpr2),
        _class: kw2("class", startsExpr2),
        _extends: kw2("extends", beforeExpr2),
        _export: kw2("export"),
        _import: kw2("import", startsExpr2),
        _null: kw2("null", startsExpr2),
        _true: kw2("true", startsExpr2),
        _false: kw2("false", startsExpr2),
        _in: kw2("in", { beforeExpr: true, binop: 7 }),
        _instanceof: kw2("instanceof", { beforeExpr: true, binop: 7 }),
        _typeof: kw2("typeof", { beforeExpr: true, prefix: true, startsExpr: true }),
        _void: kw2("void", { beforeExpr: true, prefix: true, startsExpr: true }),
        _delete: kw2("delete", { beforeExpr: true, prefix: true, startsExpr: true })
      };
      var lineBreak2 = /\r\n?|\n|\u2028|\u2029/;
      var lineBreakG2 = new RegExp(lineBreak2.source, "g");
      function isNewLine2(code, ecma2019String) {
        return code === 10 || code === 13 || !ecma2019String && (code === 8232 || code === 8233);
      }
      var nonASCIIwhitespace2 = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/;
      var skipWhiteSpace2 = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g;
      var ref2 = Object.prototype;
      var hasOwnProperty3 = ref2.hasOwnProperty;
      var toString8 = ref2.toString;
      function has3(obj, propName) {
        return hasOwnProperty3.call(obj, propName);
      }
      var isArray2 = Array.isArray || function(obj) {
        return toString8.call(obj) === "[object Array]";
      };
      function wordsRegexp2(words) {
        return new RegExp("^(?:" + words.replace(/ /g, "|") + ")$");
      }
      var Position3 = function Position4(line, col) {
        this.line = line;
        this.column = col;
      };
      Position3.prototype.offset = function offset2(n2) {
        return new Position3(this.line, this.column + n2);
      };
      var SourceLocation3 = function SourceLocation4(p, start, end) {
        this.start = start;
        this.end = end;
        if (p.sourceFile !== null) {
          this.source = p.sourceFile;
        }
      };
      function getLineInfo2(input, offset2) {
        for (var line = 1, cur = 0; ; ) {
          lineBreakG2.lastIndex = cur;
          var match = lineBreakG2.exec(input);
          if (match && match.index < offset2) {
            ++line;
            cur = match.index + match[0].length;
          } else {
            return new Position3(line, offset2 - cur);
          }
        }
      }
      var defaultOptions2 = {
        // `ecmaVersion` indicates the ECMAScript version to parse. Must be
        // either 3, 5, 6 (2015), 7 (2016), 8 (2017), 9 (2018), or 10
        // (2019). This influences support for strict mode, the set of
        // reserved words, and support for new syntax features. The default
        // is 9.
        ecmaVersion: 9,
        // `sourceType` indicates the mode the code should be parsed in.
        // Can be either `"script"` or `"module"`. This influences global
        // strict mode and parsing of `import` and `export` declarations.
        sourceType: "script",
        // `onInsertedSemicolon` can be a callback that will be called
        // when a semicolon is automatically inserted. It will be passed
        // the position of the comma as an offset, and if `locations` is
        // enabled, it is given the location as a `{line, column}` object
        // as second argument.
        onInsertedSemicolon: null,
        // `onTrailingComma` is similar to `onInsertedSemicolon`, but for
        // trailing commas.
        onTrailingComma: null,
        // By default, reserved words are only enforced if ecmaVersion >= 5.
        // Set `allowReserved` to a boolean value to explicitly turn this on
        // an off. When this option has the value "never", reserved words
        // and keywords can also not be used as property names.
        allowReserved: null,
        // When enabled, a return at the top level is not considered an
        // error.
        allowReturnOutsideFunction: false,
        // When enabled, import/export statements are not constrained to
        // appearing at the top of the program.
        allowImportExportEverywhere: false,
        // When enabled, await identifiers are allowed to appear at the top-level scope,
        // but they are still not allowed in non-async functions.
        allowAwaitOutsideFunction: false,
        // When enabled, hashbang directive in the beginning of file
        // is allowed and treated as a line comment.
        allowHashBang: false,
        // When `locations` is on, `loc` properties holding objects with
        // `start` and `end` properties in `{line, column}` form (with
        // line being 1-based and column 0-based) will be attached to the
        // nodes.
        locations: false,
        // A function can be passed as `onToken` option, which will
        // cause Acorn to call that function with object in the same
        // format as tokens returned from `tokenizer().getToken()`. Note
        // that you are not allowed to call the parser from the
        // callback—that will corrupt its internal state.
        onToken: null,
        // A function can be passed as `onComment` option, which will
        // cause Acorn to call that function with `(block, text, start,
        // end)` parameters whenever a comment is skipped. `block` is a
        // boolean indicating whether this is a block (`/* */`) comment,
        // `text` is the content of the comment, and `start` and `end` are
        // character offsets that denote the start and end of the comment.
        // When the `locations` option is on, two more parameters are
        // passed, the full `{line, column}` locations of the start and
        // end of the comments. Note that you are not allowed to call the
        // parser from the callback—that will corrupt its internal state.
        onComment: null,
        // Nodes have their start and end characters offsets recorded in
        // `start` and `end` properties (directly on the node, rather than
        // the `loc` object, which holds line/column data. To also add a
        // [semi-standardized][range] `range` property holding a `[start,
        // end]` array with the same numbers, set the `ranges` option to
        // `true`.
        //
        // [range]: https://bugzilla.mozilla.org/show_bug.cgi?id=745678
        ranges: false,
        // It is possible to parse multiple files into a single AST by
        // passing the tree produced by parsing the first file as
        // `program` option in subsequent parses. This will add the
        // toplevel forms of the parsed file to the `Program` (top) node
        // of an existing parse tree.
        program: null,
        // When `locations` is on, you can pass this to record the source
        // file in every node's `loc` object.
        sourceFile: null,
        // This value, if given, is stored in every node, whether
        // `locations` is on or off.
        directSourceFile: null,
        // When enabled, parenthesized expressions are represented by
        // (non-standard) ParenthesizedExpression nodes
        preserveParens: false
      };
      function getOptions2(opts) {
        var options = {};
        for (var opt in defaultOptions2) {
          options[opt] = opts && has3(opts, opt) ? opts[opt] : defaultOptions2[opt];
        }
        if (options.ecmaVersion >= 2015) {
          options.ecmaVersion -= 2009;
        }
        if (options.allowReserved == null) {
          options.allowReserved = options.ecmaVersion < 5;
        }
        if (isArray2(options.onToken)) {
          var tokens = options.onToken;
          options.onToken = function(token) {
            return tokens.push(token);
          };
        }
        if (isArray2(options.onComment)) {
          options.onComment = pushComment2(options, options.onComment);
        }
        return options;
      }
      function pushComment2(options, array) {
        return function(block, text, start, end, startLoc, endLoc) {
          var comment = {
            type: block ? "Block" : "Line",
            value: text,
            start,
            end
          };
          if (options.locations) {
            comment.loc = new SourceLocation3(this, startLoc, endLoc);
          }
          if (options.ranges) {
            comment.range = [start, end];
          }
          array.push(comment);
        };
      }
      var SCOPE_TOP2 = 1, SCOPE_FUNCTION2 = 2, SCOPE_VAR2 = SCOPE_TOP2 | SCOPE_FUNCTION2, SCOPE_ASYNC2 = 4, SCOPE_GENERATOR2 = 8, SCOPE_ARROW2 = 16, SCOPE_SIMPLE_CATCH2 = 32, SCOPE_SUPER2 = 64, SCOPE_DIRECT_SUPER2 = 128;
      function functionFlags2(async, generator) {
        return SCOPE_FUNCTION2 | (async ? SCOPE_ASYNC2 : 0) | (generator ? SCOPE_GENERATOR2 : 0);
      }
      var BIND_NONE2 = 0, BIND_VAR2 = 1, BIND_LEXICAL2 = 2, BIND_FUNCTION2 = 3, BIND_SIMPLE_CATCH2 = 4, BIND_OUTSIDE2 = 5;
      var Parser4 = function Parser5(options, input, startPos) {
        this.options = options = getOptions2(options);
        this.sourceFile = options.sourceFile;
        this.keywords = wordsRegexp2(keywords2[options.ecmaVersion >= 6 ? 6 : options.sourceType === "module" ? "5module" : 5]);
        var reserved2 = "";
        if (options.allowReserved !== true) {
          for (var v = options.ecmaVersion; ; v--) {
            if (reserved2 = reservedWords2[v]) {
              break;
            }
          }
          if (options.sourceType === "module") {
            reserved2 += " await";
          }
        }
        this.reservedWords = wordsRegexp2(reserved2);
        var reservedStrict = (reserved2 ? reserved2 + " " : "") + reservedWords2.strict;
        this.reservedWordsStrict = wordsRegexp2(reservedStrict);
        this.reservedWordsStrictBind = wordsRegexp2(reservedStrict + " " + reservedWords2.strictBind);
        this.input = String(input);
        this.containsEsc = false;
        if (startPos) {
          this.pos = startPos;
          this.lineStart = this.input.lastIndexOf("\n", startPos - 1) + 1;
          this.curLine = this.input.slice(0, this.lineStart).split(lineBreak2).length;
        } else {
          this.pos = this.lineStart = 0;
          this.curLine = 1;
        }
        this.type = types3.eof;
        this.value = null;
        this.start = this.end = this.pos;
        this.startLoc = this.endLoc = this.curPosition();
        this.lastTokEndLoc = this.lastTokStartLoc = null;
        this.lastTokStart = this.lastTokEnd = this.pos;
        this.context = this.initialContext();
        this.exprAllowed = true;
        this.inModule = options.sourceType === "module";
        this.strict = this.inModule || this.strictDirective(this.pos);
        this.potentialArrowAt = -1;
        this.yieldPos = this.awaitPos = this.awaitIdentPos = 0;
        this.labels = [];
        this.undefinedExports = {};
        if (this.pos === 0 && options.allowHashBang && this.input.slice(0, 2) === "#!") {
          this.skipLineComment(2);
        }
        this.scopeStack = [];
        this.enterScope(SCOPE_TOP2);
        this.regexpState = null;
      };
      var prototypeAccessors2 = { inFunction: { configurable: true }, inGenerator: { configurable: true }, inAsync: { configurable: true }, allowSuper: { configurable: true }, allowDirectSuper: { configurable: true }, treatFunctionsAsVar: { configurable: true } };
      Parser4.prototype.parse = function parse5() {
        var node = this.options.program || this.startNode();
        this.nextToken();
        return this.parseTopLevel(node);
      };
      prototypeAccessors2.inFunction.get = function() {
        return (this.currentVarScope().flags & SCOPE_FUNCTION2) > 0;
      };
      prototypeAccessors2.inGenerator.get = function() {
        return (this.currentVarScope().flags & SCOPE_GENERATOR2) > 0;
      };
      prototypeAccessors2.inAsync.get = function() {
        return (this.currentVarScope().flags & SCOPE_ASYNC2) > 0;
      };
      prototypeAccessors2.allowSuper.get = function() {
        return (this.currentThisScope().flags & SCOPE_SUPER2) > 0;
      };
      prototypeAccessors2.allowDirectSuper.get = function() {
        return (this.currentThisScope().flags & SCOPE_DIRECT_SUPER2) > 0;
      };
      prototypeAccessors2.treatFunctionsAsVar.get = function() {
        return this.treatFunctionsAsVarInScope(this.currentScope());
      };
      Parser4.prototype.inNonArrowFunction = function inNonArrowFunction2() {
        return (this.currentThisScope().flags & SCOPE_FUNCTION2) > 0;
      };
      Parser4.extend = function extend2() {
        var plugins = [], len = arguments.length;
        while (len--)
          plugins[len] = arguments[len];
        var cls = this;
        for (var i = 0; i < plugins.length; i++) {
          cls = plugins[i](cls);
        }
        return cls;
      };
      Parser4.parse = function parse5(input, options) {
        return new this(options, input).parse();
      };
      Parser4.parseExpressionAt = function parseExpressionAt3(input, pos, options) {
        var parser2 = new this(options, input, pos);
        parser2.nextToken();
        return parser2.parseExpression();
      };
      Parser4.tokenizer = function tokenizer3(input, options) {
        return new this(options, input);
      };
      Object.defineProperties(Parser4.prototype, prototypeAccessors2);
      var pp2 = Parser4.prototype;
      var literal2 = /^(?:'((?:\\.|[^'\\])*?)'|"((?:\\.|[^"\\])*?)")/;
      pp2.strictDirective = function(start) {
        for (; ; ) {
          skipWhiteSpace2.lastIndex = start;
          start += skipWhiteSpace2.exec(this.input)[0].length;
          var match = literal2.exec(this.input.slice(start));
          if (!match) {
            return false;
          }
          if ((match[1] || match[2]) === "use strict") {
            return true;
          }
          start += match[0].length;
          skipWhiteSpace2.lastIndex = start;
          start += skipWhiteSpace2.exec(this.input)[0].length;
          if (this.input[start] === ";") {
            start++;
          }
        }
      };
      pp2.eat = function(type) {
        if (this.type === type) {
          this.next();
          return true;
        } else {
          return false;
        }
      };
      pp2.isContextual = function(name) {
        return this.type === types3.name && this.value === name && !this.containsEsc;
      };
      pp2.eatContextual = function(name) {
        if (!this.isContextual(name)) {
          return false;
        }
        this.next();
        return true;
      };
      pp2.expectContextual = function(name) {
        if (!this.eatContextual(name)) {
          this.unexpected();
        }
      };
      pp2.canInsertSemicolon = function() {
        return this.type === types3.eof || this.type === types3.braceR || lineBreak2.test(this.input.slice(this.lastTokEnd, this.start));
      };
      pp2.insertSemicolon = function() {
        if (this.canInsertSemicolon()) {
          if (this.options.onInsertedSemicolon) {
            this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc);
          }
          return true;
        }
      };
      pp2.semicolon = function() {
        if (!this.eat(types3.semi) && !this.insertSemicolon()) {
          this.unexpected();
        }
      };
      pp2.afterTrailingComma = function(tokType, notNext) {
        if (this.type === tokType) {
          if (this.options.onTrailingComma) {
            this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc);
          }
          if (!notNext) {
            this.next();
          }
          return true;
        }
      };
      pp2.expect = function(type) {
        this.eat(type) || this.unexpected();
      };
      pp2.unexpected = function(pos) {
        this.raise(pos != null ? pos : this.start, "Unexpected token");
      };
      function DestructuringErrors2() {
        this.shorthandAssign = this.trailingComma = this.parenthesizedAssign = this.parenthesizedBind = this.doubleProto = -1;
      }
      pp2.checkPatternErrors = function(refDestructuringErrors, isAssign) {
        if (!refDestructuringErrors) {
          return;
        }
        if (refDestructuringErrors.trailingComma > -1) {
          this.raiseRecoverable(refDestructuringErrors.trailingComma, "Comma is not permitted after the rest element");
        }
        var parens = isAssign ? refDestructuringErrors.parenthesizedAssign : refDestructuringErrors.parenthesizedBind;
        if (parens > -1) {
          this.raiseRecoverable(parens, "Parenthesized pattern");
        }
      };
      pp2.checkExpressionErrors = function(refDestructuringErrors, andThrow) {
        if (!refDestructuringErrors) {
          return false;
        }
        var shorthandAssign = refDestructuringErrors.shorthandAssign;
        var doubleProto = refDestructuringErrors.doubleProto;
        if (!andThrow) {
          return shorthandAssign >= 0 || doubleProto >= 0;
        }
        if (shorthandAssign >= 0) {
          this.raise(shorthandAssign, "Shorthand property assignments are valid only in destructuring patterns");
        }
        if (doubleProto >= 0) {
          this.raiseRecoverable(doubleProto, "Redefinition of __proto__ property");
        }
      };
      pp2.checkYieldAwaitInDefaultParams = function() {
        if (this.yieldPos && (!this.awaitPos || this.yieldPos < this.awaitPos)) {
          this.raise(this.yieldPos, "Yield expression cannot be a default value");
        }
        if (this.awaitPos) {
          this.raise(this.awaitPos, "Await expression cannot be a default value");
        }
      };
      pp2.isSimpleAssignTarget = function(expr) {
        if (expr.type === "ParenthesizedExpression") {
          return this.isSimpleAssignTarget(expr.expression);
        }
        return expr.type === "Identifier" || expr.type === "MemberExpression";
      };
      var pp$12 = Parser4.prototype;
      pp$12.parseTopLevel = function(node) {
        var exports3 = {};
        if (!node.body) {
          node.body = [];
        }
        while (this.type !== types3.eof) {
          var stmt = this.parseStatement(null, true, exports3);
          node.body.push(stmt);
        }
        if (this.inModule) {
          for (var i = 0, list = Object.keys(this.undefinedExports); i < list.length; i += 1) {
            var name = list[i];
            this.raiseRecoverable(this.undefinedExports[name].start, "Export '" + name + "' is not defined");
          }
        }
        this.adaptDirectivePrologue(node.body);
        this.next();
        node.sourceType = this.options.sourceType;
        return this.finishNode(node, "Program");
      };
      var loopLabel2 = { kind: "loop" }, switchLabel2 = { kind: "switch" };
      pp$12.isLet = function(context) {
        if (this.options.ecmaVersion < 6 || !this.isContextual("let")) {
          return false;
        }
        skipWhiteSpace2.lastIndex = this.pos;
        var skip = skipWhiteSpace2.exec(this.input);
        var next = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next);
        if (nextCh === 91) {
          return true;
        }
        if (context) {
          return false;
        }
        if (nextCh === 123) {
          return true;
        }
        if (isIdentifierStart2(nextCh, true)) {
          var pos = next + 1;
          while (isIdentifierChar2(this.input.charCodeAt(pos), true)) {
            ++pos;
          }
          var ident = this.input.slice(next, pos);
          if (!keywordRelationalOperator2.test(ident)) {
            return true;
          }
        }
        return false;
      };
      pp$12.isAsyncFunction = function() {
        if (this.options.ecmaVersion < 8 || !this.isContextual("async")) {
          return false;
        }
        skipWhiteSpace2.lastIndex = this.pos;
        var skip = skipWhiteSpace2.exec(this.input);
        var next = this.pos + skip[0].length;
        return !lineBreak2.test(this.input.slice(this.pos, next)) && this.input.slice(next, next + 8) === "function" && (next + 8 === this.input.length || !isIdentifierChar2(this.input.charAt(next + 8)));
      };
      pp$12.parseStatement = function(context, topLevel, exports3) {
        var starttype = this.type, node = this.startNode(), kind;
        if (this.isLet(context)) {
          starttype = types3._var;
          kind = "let";
        }
        switch (starttype) {
          case types3._break:
          case types3._continue:
            return this.parseBreakContinueStatement(node, starttype.keyword);
          case types3._debugger:
            return this.parseDebuggerStatement(node);
          case types3._do:
            return this.parseDoStatement(node);
          case types3._for:
            return this.parseForStatement(node);
          case types3._function:
            if (context && (this.strict || context !== "if" && context !== "label") && this.options.ecmaVersion >= 6) {
              this.unexpected();
            }
            return this.parseFunctionStatement(node, false, !context);
          case types3._class:
            if (context) {
              this.unexpected();
            }
            return this.parseClass(node, true);
          case types3._if:
            return this.parseIfStatement(node);
          case types3._return:
            return this.parseReturnStatement(node);
          case types3._switch:
            return this.parseSwitchStatement(node);
          case types3._throw:
            return this.parseThrowStatement(node);
          case types3._try:
            return this.parseTryStatement(node);
          case types3._const:
          case types3._var:
            kind = kind || this.value;
            if (context && kind !== "var") {
              this.unexpected();
            }
            return this.parseVarStatement(node, kind);
          case types3._while:
            return this.parseWhileStatement(node);
          case types3._with:
            return this.parseWithStatement(node);
          case types3.braceL:
            return this.parseBlock(true, node);
          case types3.semi:
            return this.parseEmptyStatement(node);
          case types3._export:
          case types3._import:
            if (this.options.ecmaVersion > 10 && starttype === types3._import) {
              skipWhiteSpace2.lastIndex = this.pos;
              var skip = skipWhiteSpace2.exec(this.input);
              var next = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next);
              if (nextCh === 40) {
                return this.parseExpressionStatement(node, this.parseExpression());
              }
            }
            if (!this.options.allowImportExportEverywhere) {
              if (!topLevel) {
                this.raise(this.start, "'import' and 'export' may only appear at the top level");
              }
              if (!this.inModule) {
                this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'");
              }
            }
            return starttype === types3._import ? this.parseImport(node) : this.parseExport(node, exports3);
          default:
            if (this.isAsyncFunction()) {
              if (context) {
                this.unexpected();
              }
              this.next();
              return this.parseFunctionStatement(node, true, !context);
            }
            var maybeName = this.value, expr = this.parseExpression();
            if (starttype === types3.name && expr.type === "Identifier" && this.eat(types3.colon)) {
              return this.parseLabeledStatement(node, maybeName, expr, context);
            } else {
              return this.parseExpressionStatement(node, expr);
            }
        }
      };
      pp$12.parseBreakContinueStatement = function(node, keyword) {
        var isBreak = keyword === "break";
        this.next();
        if (this.eat(types3.semi) || this.insertSemicolon()) {
          node.label = null;
        } else if (this.type !== types3.name) {
          this.unexpected();
        } else {
          node.label = this.parseIdent();
          this.semicolon();
        }
        var i = 0;
        for (; i < this.labels.length; ++i) {
          var lab = this.labels[i];
          if (node.label == null || lab.name === node.label.name) {
            if (lab.kind != null && (isBreak || lab.kind === "loop")) {
              break;
            }
            if (node.label && isBreak) {
              break;
            }
          }
        }
        if (i === this.labels.length) {
          this.raise(node.start, "Unsyntactic " + keyword);
        }
        return this.finishNode(node, isBreak ? "BreakStatement" : "ContinueStatement");
      };
      pp$12.parseDebuggerStatement = function(node) {
        this.next();
        this.semicolon();
        return this.finishNode(node, "DebuggerStatement");
      };
      pp$12.parseDoStatement = function(node) {
        this.next();
        this.labels.push(loopLabel2);
        node.body = this.parseStatement("do");
        this.labels.pop();
        this.expect(types3._while);
        node.test = this.parseParenExpression();
        if (this.options.ecmaVersion >= 6) {
          this.eat(types3.semi);
        } else {
          this.semicolon();
        }
        return this.finishNode(node, "DoWhileStatement");
      };
      pp$12.parseForStatement = function(node) {
        this.next();
        var awaitAt = this.options.ecmaVersion >= 9 && (this.inAsync || !this.inFunction && this.options.allowAwaitOutsideFunction) && this.eatContextual("await") ? this.lastTokStart : -1;
        this.labels.push(loopLabel2);
        this.enterScope(0);
        this.expect(types3.parenL);
        if (this.type === types3.semi) {
          if (awaitAt > -1) {
            this.unexpected(awaitAt);
          }
          return this.parseFor(node, null);
        }
        var isLet = this.isLet();
        if (this.type === types3._var || this.type === types3._const || isLet) {
          var init$1 = this.startNode(), kind = isLet ? "let" : this.value;
          this.next();
          this.parseVar(init$1, true, kind);
          this.finishNode(init$1, "VariableDeclaration");
          if ((this.type === types3._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) && init$1.declarations.length === 1) {
            if (this.options.ecmaVersion >= 9) {
              if (this.type === types3._in) {
                if (awaitAt > -1) {
                  this.unexpected(awaitAt);
                }
              } else {
                node.await = awaitAt > -1;
              }
            }
            return this.parseForIn(node, init$1);
          }
          if (awaitAt > -1) {
            this.unexpected(awaitAt);
          }
          return this.parseFor(node, init$1);
        }
        var refDestructuringErrors = new DestructuringErrors2();
        var init = this.parseExpression(true, refDestructuringErrors);
        if (this.type === types3._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) {
          if (this.options.ecmaVersion >= 9) {
            if (this.type === types3._in) {
              if (awaitAt > -1) {
                this.unexpected(awaitAt);
              }
            } else {
              node.await = awaitAt > -1;
            }
          }
          this.toAssignable(init, false, refDestructuringErrors);
          this.checkLVal(init);
          return this.parseForIn(node, init);
        } else {
          this.checkExpressionErrors(refDestructuringErrors, true);
        }
        if (awaitAt > -1) {
          this.unexpected(awaitAt);
        }
        return this.parseFor(node, init);
      };
      pp$12.parseFunctionStatement = function(node, isAsync, declarationPosition) {
        this.next();
        return this.parseFunction(node, FUNC_STATEMENT2 | (declarationPosition ? 0 : FUNC_HANGING_STATEMENT2), false, isAsync);
      };
      pp$12.parseIfStatement = function(node) {
        this.next();
        node.test = this.parseParenExpression();
        node.consequent = this.parseStatement("if");
        node.alternate = this.eat(types3._else) ? this.parseStatement("if") : null;
        return this.finishNode(node, "IfStatement");
      };
      pp$12.parseReturnStatement = function(node) {
        if (!this.inFunction && !this.options.allowReturnOutsideFunction) {
          this.raise(this.start, "'return' outside of function");
        }
        this.next();
        if (this.eat(types3.semi) || this.insertSemicolon()) {
          node.argument = null;
        } else {
          node.argument = this.parseExpression();
          this.semicolon();
        }
        return this.finishNode(node, "ReturnStatement");
      };
      pp$12.parseSwitchStatement = function(node) {
        this.next();
        node.discriminant = this.parseParenExpression();
        node.cases = [];
        this.expect(types3.braceL);
        this.labels.push(switchLabel2);
        this.enterScope(0);
        var cur;
        for (var sawDefault = false; this.type !== types3.braceR; ) {
          if (this.type === types3._case || this.type === types3._default) {
            var isCase = this.type === types3._case;
            if (cur) {
              this.finishNode(cur, "SwitchCase");
            }
            node.cases.push(cur = this.startNode());
            cur.consequent = [];
            this.next();
            if (isCase) {
              cur.test = this.parseExpression();
            } else {
              if (sawDefault) {
                this.raiseRecoverable(this.lastTokStart, "Multiple default clauses");
              }
              sawDefault = true;
              cur.test = null;
            }
            this.expect(types3.colon);
          } else {
            if (!cur) {
              this.unexpected();
            }
            cur.consequent.push(this.parseStatement(null));
          }
        }
        this.exitScope();
        if (cur) {
          this.finishNode(cur, "SwitchCase");
        }
        this.next();
        this.labels.pop();
        return this.finishNode(node, "SwitchStatement");
      };
      pp$12.parseThrowStatement = function(node) {
        this.next();
        if (lineBreak2.test(this.input.slice(this.lastTokEnd, this.start))) {
          this.raise(this.lastTokEnd, "Illegal newline after throw");
        }
        node.argument = this.parseExpression();
        this.semicolon();
        return this.finishNode(node, "ThrowStatement");
      };
      var empty2 = [];
      pp$12.parseTryStatement = function(node) {
        this.next();
        node.block = this.parseBlock();
        node.handler = null;
        if (this.type === types3._catch) {
          var clause = this.startNode();
          this.next();
          if (this.eat(types3.parenL)) {
            clause.param = this.parseBindingAtom();
            var simple = clause.param.type === "Identifier";
            this.enterScope(simple ? SCOPE_SIMPLE_CATCH2 : 0);
            this.checkLVal(clause.param, simple ? BIND_SIMPLE_CATCH2 : BIND_LEXICAL2);
            this.expect(types3.parenR);
          } else {
            if (this.options.ecmaVersion < 10) {
              this.unexpected();
            }
            clause.param = null;
            this.enterScope(0);
          }
          clause.body = this.parseBlock(false);
          this.exitScope();
          node.handler = this.finishNode(clause, "CatchClause");
        }
        node.finalizer = this.eat(types3._finally) ? this.parseBlock() : null;
        if (!node.handler && !node.finalizer) {
          this.raise(node.start, "Missing catch or finally clause");
        }
        return this.finishNode(node, "TryStatement");
      };
      pp$12.parseVarStatement = function(node, kind) {
        this.next();
        this.parseVar(node, false, kind);
        this.semicolon();
        return this.finishNode(node, "VariableDeclaration");
      };
      pp$12.parseWhileStatement = function(node) {
        this.next();
        node.test = this.parseParenExpression();
        this.labels.push(loopLabel2);
        node.body = this.parseStatement("while");
        this.labels.pop();
        return this.finishNode(node, "WhileStatement");
      };
      pp$12.parseWithStatement = function(node) {
        if (this.strict) {
          this.raise(this.start, "'with' in strict mode");
        }
        this.next();
        node.object = this.parseParenExpression();
        node.body = this.parseStatement("with");
        return this.finishNode(node, "WithStatement");
      };
      pp$12.parseEmptyStatement = function(node) {
        this.next();
        return this.finishNode(node, "EmptyStatement");
      };
      pp$12.parseLabeledStatement = function(node, maybeName, expr, context) {
        for (var i$1 = 0, list = this.labels; i$1 < list.length; i$1 += 1) {
          var label = list[i$1];
          if (label.name === maybeName) {
            this.raise(expr.start, "Label '" + maybeName + "' is already declared");
          }
        }
        var kind = this.type.isLoop ? "loop" : this.type === types3._switch ? "switch" : null;
        for (var i = this.labels.length - 1; i >= 0; i--) {
          var label$1 = this.labels[i];
          if (label$1.statementStart === node.start) {
            label$1.statementStart = this.start;
            label$1.kind = kind;
          } else {
            break;
          }
        }
        this.labels.push({ name: maybeName, kind, statementStart: this.start });
        node.body = this.parseStatement(context ? context.indexOf("label") === -1 ? context + "label" : context : "label");
        this.labels.pop();
        node.label = expr;
        return this.finishNode(node, "LabeledStatement");
      };
      pp$12.parseExpressionStatement = function(node, expr) {
        node.expression = expr;
        this.semicolon();
        return this.finishNode(node, "ExpressionStatement");
      };
      pp$12.parseBlock = function(createNewLexicalScope, node) {
        if (createNewLexicalScope === void 0)
          createNewLexicalScope = true;
        if (node === void 0)
          node = this.startNode();
        node.body = [];
        this.expect(types3.braceL);
        if (createNewLexicalScope) {
          this.enterScope(0);
        }
        while (!this.eat(types3.braceR)) {
          var stmt = this.parseStatement(null);
          node.body.push(stmt);
        }
        if (createNewLexicalScope) {
          this.exitScope();
        }
        return this.finishNode(node, "BlockStatement");
      };
      pp$12.parseFor = function(node, init) {
        node.init = init;
        this.expect(types3.semi);
        node.test = this.type === types3.semi ? null : this.parseExpression();
        this.expect(types3.semi);
        node.update = this.type === types3.parenR ? null : this.parseExpression();
        this.expect(types3.parenR);
        node.body = this.parseStatement("for");
        this.exitScope();
        this.labels.pop();
        return this.finishNode(node, "ForStatement");
      };
      pp$12.parseForIn = function(node, init) {
        var isForIn = this.type === types3._in;
        this.next();
        if (init.type === "VariableDeclaration" && init.declarations[0].init != null && (!isForIn || this.options.ecmaVersion < 8 || this.strict || init.kind !== "var" || init.declarations[0].id.type !== "Identifier")) {
          this.raise(
            init.start,
            (isForIn ? "for-in" : "for-of") + " loop variable declaration may not have an initializer"
          );
        } else if (init.type === "AssignmentPattern") {
          this.raise(init.start, "Invalid left-hand side in for-loop");
        }
        node.left = init;
        node.right = isForIn ? this.parseExpression() : this.parseMaybeAssign();
        this.expect(types3.parenR);
        node.body = this.parseStatement("for");
        this.exitScope();
        this.labels.pop();
        return this.finishNode(node, isForIn ? "ForInStatement" : "ForOfStatement");
      };
      pp$12.parseVar = function(node, isFor, kind) {
        node.declarations = [];
        node.kind = kind;
        for (; ; ) {
          var decl = this.startNode();
          this.parseVarId(decl, kind);
          if (this.eat(types3.eq)) {
            decl.init = this.parseMaybeAssign(isFor);
          } else if (kind === "const" && !(this.type === types3._in || this.options.ecmaVersion >= 6 && this.isContextual("of"))) {
            this.unexpected();
          } else if (decl.id.type !== "Identifier" && !(isFor && (this.type === types3._in || this.isContextual("of")))) {
            this.raise(this.lastTokEnd, "Complex binding patterns require an initialization value");
          } else {
            decl.init = null;
          }
          node.declarations.push(this.finishNode(decl, "VariableDeclarator"));
          if (!this.eat(types3.comma)) {
            break;
          }
        }
        return node;
      };
      pp$12.parseVarId = function(decl, kind) {
        decl.id = this.parseBindingAtom();
        this.checkLVal(decl.id, kind === "var" ? BIND_VAR2 : BIND_LEXICAL2, false);
      };
      var FUNC_STATEMENT2 = 1, FUNC_HANGING_STATEMENT2 = 2, FUNC_NULLABLE_ID2 = 4;
      pp$12.parseFunction = function(node, statement, allowExpressionBody, isAsync) {
        this.initFunction(node);
        if (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !isAsync) {
          if (this.type === types3.star && statement & FUNC_HANGING_STATEMENT2) {
            this.unexpected();
          }
          node.generator = this.eat(types3.star);
        }
        if (this.options.ecmaVersion >= 8) {
          node.async = !!isAsync;
        }
        if (statement & FUNC_STATEMENT2) {
          node.id = statement & FUNC_NULLABLE_ID2 && this.type !== types3.name ? null : this.parseIdent();
          if (node.id && !(statement & FUNC_HANGING_STATEMENT2)) {
            this.checkLVal(node.id, this.strict || node.generator || node.async ? this.treatFunctionsAsVar ? BIND_VAR2 : BIND_LEXICAL2 : BIND_FUNCTION2);
          }
        }
        var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
        this.yieldPos = 0;
        this.awaitPos = 0;
        this.awaitIdentPos = 0;
        this.enterScope(functionFlags2(node.async, node.generator));
        if (!(statement & FUNC_STATEMENT2)) {
          node.id = this.type === types3.name ? this.parseIdent() : null;
        }
        this.parseFunctionParams(node);
        this.parseFunctionBody(node, allowExpressionBody, false);
        this.yieldPos = oldYieldPos;
        this.awaitPos = oldAwaitPos;
        this.awaitIdentPos = oldAwaitIdentPos;
        return this.finishNode(node, statement & FUNC_STATEMENT2 ? "FunctionDeclaration" : "FunctionExpression");
      };
      pp$12.parseFunctionParams = function(node) {
        this.expect(types3.parenL);
        node.params = this.parseBindingList(types3.parenR, false, this.options.ecmaVersion >= 8);
        this.checkYieldAwaitInDefaultParams();
      };
      pp$12.parseClass = function(node, isStatement) {
        this.next();
        var oldStrict = this.strict;
        this.strict = true;
        this.parseClassId(node, isStatement);
        this.parseClassSuper(node);
        var classBody = this.startNode();
        var hadConstructor = false;
        classBody.body = [];
        this.expect(types3.braceL);
        while (!this.eat(types3.braceR)) {
          var element = this.parseClassElement(node.superClass !== null);
          if (element) {
            classBody.body.push(element);
            if (element.type === "MethodDefinition" && element.kind === "constructor") {
              if (hadConstructor) {
                this.raise(element.start, "Duplicate constructor in the same class");
              }
              hadConstructor = true;
            }
          }
        }
        node.body = this.finishNode(classBody, "ClassBody");
        this.strict = oldStrict;
        return this.finishNode(node, isStatement ? "ClassDeclaration" : "ClassExpression");
      };
      pp$12.parseClassElement = function(constructorAllowsSuper) {
        var this$1 = this;
        if (this.eat(types3.semi)) {
          return null;
        }
        var method = this.startNode();
        var tryContextual = function(k, noLineBreak) {
          if (noLineBreak === void 0)
            noLineBreak = false;
          var start = this$1.start, startLoc = this$1.startLoc;
          if (!this$1.eatContextual(k)) {
            return false;
          }
          if (this$1.type !== types3.parenL && (!noLineBreak || !this$1.canInsertSemicolon())) {
            return true;
          }
          if (method.key) {
            this$1.unexpected();
          }
          method.computed = false;
          method.key = this$1.startNodeAt(start, startLoc);
          method.key.name = k;
          this$1.finishNode(method.key, "Identifier");
          return false;
        };
        method.kind = "method";
        method.static = tryContextual("static");
        var isGenerator = this.eat(types3.star);
        var isAsync = false;
        if (!isGenerator) {
          if (this.options.ecmaVersion >= 8 && tryContextual("async", true)) {
            isAsync = true;
            isGenerator = this.options.ecmaVersion >= 9 && this.eat(types3.star);
          } else if (tryContextual("get")) {
            method.kind = "get";
          } else if (tryContextual("set")) {
            method.kind = "set";
          }
        }
        if (!method.key) {
          this.parsePropertyName(method);
        }
        var key = method.key;
        var allowsDirectSuper = false;
        if (!method.computed && !method.static && (key.type === "Identifier" && key.name === "constructor" || key.type === "Literal" && key.value === "constructor")) {
          if (method.kind !== "method") {
            this.raise(key.start, "Constructor can't have get/set modifier");
          }
          if (isGenerator) {
            this.raise(key.start, "Constructor can't be a generator");
          }
          if (isAsync) {
            this.raise(key.start, "Constructor can't be an async method");
          }
          method.kind = "constructor";
          allowsDirectSuper = constructorAllowsSuper;
        } else if (method.static && key.type === "Identifier" && key.name === "prototype") {
          this.raise(key.start, "Classes may not have a static property named prototype");
        }
        this.parseClassMethod(method, isGenerator, isAsync, allowsDirectSuper);
        if (method.kind === "get" && method.value.params.length !== 0) {
          this.raiseRecoverable(method.value.start, "getter should have no params");
        }
        if (method.kind === "set" && method.value.params.length !== 1) {
          this.raiseRecoverable(method.value.start, "setter should have exactly one param");
        }
        if (method.kind === "set" && method.value.params[0].type === "RestElement") {
          this.raiseRecoverable(method.value.params[0].start, "Setter cannot use rest params");
        }
        return method;
      };
      pp$12.parseClassMethod = function(method, isGenerator, isAsync, allowsDirectSuper) {
        method.value = this.parseMethod(isGenerator, isAsync, allowsDirectSuper);
        return this.finishNode(method, "MethodDefinition");
      };
      pp$12.parseClassId = function(node, isStatement) {
        if (this.type === types3.name) {
          node.id = this.parseIdent();
          if (isStatement) {
            this.checkLVal(node.id, BIND_LEXICAL2, false);
          }
        } else {
          if (isStatement === true) {
            this.unexpected();
          }
          node.id = null;
        }
      };
      pp$12.parseClassSuper = function(node) {
        node.superClass = this.eat(types3._extends) ? this.parseExprSubscripts() : null;
      };
      pp$12.parseExport = function(node, exports3) {
        this.next();
        if (this.eat(types3.star)) {
          this.expectContextual("from");
          if (this.type !== types3.string) {
            this.unexpected();
          }
          node.source = this.parseExprAtom();
          this.semicolon();
          return this.finishNode(node, "ExportAllDeclaration");
        }
        if (this.eat(types3._default)) {
          this.checkExport(exports3, "default", this.lastTokStart);
          var isAsync;
          if (this.type === types3._function || (isAsync = this.isAsyncFunction())) {
            var fNode = this.startNode();
            this.next();
            if (isAsync) {
              this.next();
            }
            node.declaration = this.parseFunction(fNode, FUNC_STATEMENT2 | FUNC_NULLABLE_ID2, false, isAsync);
          } else if (this.type === types3._class) {
            var cNode = this.startNode();
            node.declaration = this.parseClass(cNode, "nullableID");
          } else {
            node.declaration = this.parseMaybeAssign();
            this.semicolon();
          }
          return this.finishNode(node, "ExportDefaultDeclaration");
        }
        if (this.shouldParseExportStatement()) {
          node.declaration = this.parseStatement(null);
          if (node.declaration.type === "VariableDeclaration") {
            this.checkVariableExport(exports3, node.declaration.declarations);
          } else {
            this.checkExport(exports3, node.declaration.id.name, node.declaration.id.start);
          }
          node.specifiers = [];
          node.source = null;
        } else {
          node.declaration = null;
          node.specifiers = this.parseExportSpecifiers(exports3);
          if (this.eatContextual("from")) {
            if (this.type !== types3.string) {
              this.unexpected();
            }
            node.source = this.parseExprAtom();
          } else {
            for (var i = 0, list = node.specifiers; i < list.length; i += 1) {
              var spec = list[i];
              this.checkUnreserved(spec.local);
              this.checkLocalExport(spec.local);
            }
            node.source = null;
          }
          this.semicolon();
        }
        return this.finishNode(node, "ExportNamedDeclaration");
      };
      pp$12.checkExport = function(exports3, name, pos) {
        if (!exports3) {
          return;
        }
        if (has3(exports3, name)) {
          this.raiseRecoverable(pos, "Duplicate export '" + name + "'");
        }
        exports3[name] = true;
      };
      pp$12.checkPatternExport = function(exports3, pat) {
        var type = pat.type;
        if (type === "Identifier") {
          this.checkExport(exports3, pat.name, pat.start);
        } else if (type === "ObjectPattern") {
          for (var i = 0, list = pat.properties; i < list.length; i += 1) {
            var prop = list[i];
            this.checkPatternExport(exports3, prop);
          }
        } else if (type === "ArrayPattern") {
          for (var i$1 = 0, list$1 = pat.elements; i$1 < list$1.length; i$1 += 1) {
            var elt = list$1[i$1];
            if (elt) {
              this.checkPatternExport(exports3, elt);
            }
          }
        } else if (type === "Property") {
          this.checkPatternExport(exports3, pat.value);
        } else if (type === "AssignmentPattern") {
          this.checkPatternExport(exports3, pat.left);
        } else if (type === "RestElement") {
          this.checkPatternExport(exports3, pat.argument);
        } else if (type === "ParenthesizedExpression") {
          this.checkPatternExport(exports3, pat.expression);
        }
      };
      pp$12.checkVariableExport = function(exports3, decls) {
        if (!exports3) {
          return;
        }
        for (var i = 0, list = decls; i < list.length; i += 1) {
          var decl = list[i];
          this.checkPatternExport(exports3, decl.id);
        }
      };
      pp$12.shouldParseExportStatement = function() {
        return this.type.keyword === "var" || this.type.keyword === "const" || this.type.keyword === "class" || this.type.keyword === "function" || this.isLet() || this.isAsyncFunction();
      };
      pp$12.parseExportSpecifiers = function(exports3) {
        var nodes = [], first = true;
        this.expect(types3.braceL);
        while (!this.eat(types3.braceR)) {
          if (!first) {
            this.expect(types3.comma);
            if (this.afterTrailingComma(types3.braceR)) {
              break;
            }
          } else {
            first = false;
          }
          var node = this.startNode();
          node.local = this.parseIdent(true);
          node.exported = this.eatContextual("as") ? this.parseIdent(true) : node.local;
          this.checkExport(exports3, node.exported.name, node.exported.start);
          nodes.push(this.finishNode(node, "ExportSpecifier"));
        }
        return nodes;
      };
      pp$12.parseImport = function(node) {
        this.next();
        if (this.type === types3.string) {
          node.specifiers = empty2;
          node.source = this.parseExprAtom();
        } else {
          node.specifiers = this.parseImportSpecifiers();
          this.expectContextual("from");
          node.source = this.type === types3.string ? this.parseExprAtom() : this.unexpected();
        }
        this.semicolon();
        return this.finishNode(node, "ImportDeclaration");
      };
      pp$12.parseImportSpecifiers = function() {
        var nodes = [], first = true;
        if (this.type === types3.name) {
          var node = this.startNode();
          node.local = this.parseIdent();
          this.checkLVal(node.local, BIND_LEXICAL2);
          nodes.push(this.finishNode(node, "ImportDefaultSpecifier"));
          if (!this.eat(types3.comma)) {
            return nodes;
          }
        }
        if (this.type === types3.star) {
          var node$1 = this.startNode();
          this.next();
          this.expectContextual("as");
          node$1.local = this.parseIdent();
          this.checkLVal(node$1.local, BIND_LEXICAL2);
          nodes.push(this.finishNode(node$1, "ImportNamespaceSpecifier"));
          return nodes;
        }
        this.expect(types3.braceL);
        while (!this.eat(types3.braceR)) {
          if (!first) {
            this.expect(types3.comma);
            if (this.afterTrailingComma(types3.braceR)) {
              break;
            }
          } else {
            first = false;
          }
          var node$2 = this.startNode();
          node$2.imported = this.parseIdent(true);
          if (this.eatContextual("as")) {
            node$2.local = this.parseIdent();
          } else {
            this.checkUnreserved(node$2.imported);
            node$2.local = node$2.imported;
          }
          this.checkLVal(node$2.local, BIND_LEXICAL2);
          nodes.push(this.finishNode(node$2, "ImportSpecifier"));
        }
        return nodes;
      };
      pp$12.adaptDirectivePrologue = function(statements) {
        for (var i = 0; i < statements.length && this.isDirectiveCandidate(statements[i]); ++i) {
          statements[i].directive = statements[i].expression.raw.slice(1, -1);
        }
      };
      pp$12.isDirectiveCandidate = function(statement) {
        return statement.type === "ExpressionStatement" && statement.expression.type === "Literal" && typeof statement.expression.value === "string" && // Reject parenthesized strings.
        (this.input[statement.start] === '"' || this.input[statement.start] === "'");
      };
      var pp$22 = Parser4.prototype;
      pp$22.toAssignable = function(node, isBinding, refDestructuringErrors) {
        if (this.options.ecmaVersion >= 6 && node) {
          switch (node.type) {
            case "Identifier":
              if (this.inAsync && node.name === "await") {
                this.raise(node.start, "Cannot use 'await' as identifier inside an async function");
              }
              break;
            case "ObjectPattern":
            case "ArrayPattern":
            case "RestElement":
              break;
            case "ObjectExpression":
              node.type = "ObjectPattern";
              if (refDestructuringErrors) {
                this.checkPatternErrors(refDestructuringErrors, true);
              }
              for (var i = 0, list = node.properties; i < list.length; i += 1) {
                var prop = list[i];
                this.toAssignable(prop, isBinding);
                if (prop.type === "RestElement" && (prop.argument.type === "ArrayPattern" || prop.argument.type === "ObjectPattern")) {
                  this.raise(prop.argument.start, "Unexpected token");
                }
              }
              break;
            case "Property":
              if (node.kind !== "init") {
                this.raise(node.key.start, "Object pattern can't contain getter or setter");
              }
              this.toAssignable(node.value, isBinding);
              break;
            case "ArrayExpression":
              node.type = "ArrayPattern";
              if (refDestructuringErrors) {
                this.checkPatternErrors(refDestructuringErrors, true);
              }
              this.toAssignableList(node.elements, isBinding);
              break;
            case "SpreadElement":
              node.type = "RestElement";
              this.toAssignable(node.argument, isBinding);
              if (node.argument.type === "AssignmentPattern") {
                this.raise(node.argument.start, "Rest elements cannot have a default value");
              }
              break;
            case "AssignmentExpression":
              if (node.operator !== "=") {
                this.raise(node.left.end, "Only '=' operator can be used for specifying default value.");
              }
              node.type = "AssignmentPattern";
              delete node.operator;
              this.toAssignable(node.left, isBinding);
            case "AssignmentPattern":
              break;
            case "ParenthesizedExpression":
              this.toAssignable(node.expression, isBinding, refDestructuringErrors);
              break;
            case "MemberExpression":
              if (!isBinding) {
                break;
              }
            default:
              this.raise(node.start, "Assigning to rvalue");
          }
        } else if (refDestructuringErrors) {
          this.checkPatternErrors(refDestructuringErrors, true);
        }
        return node;
      };
      pp$22.toAssignableList = function(exprList, isBinding) {
        var end = exprList.length;
        for (var i = 0; i < end; i++) {
          var elt = exprList[i];
          if (elt) {
            this.toAssignable(elt, isBinding);
          }
        }
        if (end) {
          var last = exprList[end - 1];
          if (this.options.ecmaVersion === 6 && isBinding && last && last.type === "RestElement" && last.argument.type !== "Identifier") {
            this.unexpected(last.argument.start);
          }
        }
        return exprList;
      };
      pp$22.parseSpread = function(refDestructuringErrors) {
        var node = this.startNode();
        this.next();
        node.argument = this.parseMaybeAssign(false, refDestructuringErrors);
        return this.finishNode(node, "SpreadElement");
      };
      pp$22.parseRestBinding = function() {
        var node = this.startNode();
        this.next();
        if (this.options.ecmaVersion === 6 && this.type !== types3.name) {
          this.unexpected();
        }
        node.argument = this.parseBindingAtom();
        return this.finishNode(node, "RestElement");
      };
      pp$22.parseBindingAtom = function() {
        if (this.options.ecmaVersion >= 6) {
          switch (this.type) {
            case types3.bracketL:
              var node = this.startNode();
              this.next();
              node.elements = this.parseBindingList(types3.bracketR, true, true);
              return this.finishNode(node, "ArrayPattern");
            case types3.braceL:
              return this.parseObj(true);
          }
        }
        return this.parseIdent();
      };
      pp$22.parseBindingList = function(close, allowEmpty, allowTrailingComma) {
        var elts = [], first = true;
        while (!this.eat(close)) {
          if (first) {
            first = false;
          } else {
            this.expect(types3.comma);
          }
          if (allowEmpty && this.type === types3.comma) {
            elts.push(null);
          } else if (allowTrailingComma && this.afterTrailingComma(close)) {
            break;
          } else if (this.type === types3.ellipsis) {
            var rest = this.parseRestBinding();
            this.parseBindingListItem(rest);
            elts.push(rest);
            if (this.type === types3.comma) {
              this.raise(this.start, "Comma is not permitted after the rest element");
            }
            this.expect(close);
            break;
          } else {
            var elem = this.parseMaybeDefault(this.start, this.startLoc);
            this.parseBindingListItem(elem);
            elts.push(elem);
          }
        }
        return elts;
      };
      pp$22.parseBindingListItem = function(param) {
        return param;
      };
      pp$22.parseMaybeDefault = function(startPos, startLoc, left) {
        left = left || this.parseBindingAtom();
        if (this.options.ecmaVersion < 6 || !this.eat(types3.eq)) {
          return left;
        }
        var node = this.startNodeAt(startPos, startLoc);
        node.left = left;
        node.right = this.parseMaybeAssign();
        return this.finishNode(node, "AssignmentPattern");
      };
      pp$22.checkLVal = function(expr, bindingType, checkClashes) {
        if (bindingType === void 0)
          bindingType = BIND_NONE2;
        switch (expr.type) {
          case "Identifier":
            if (bindingType === BIND_LEXICAL2 && expr.name === "let") {
              this.raiseRecoverable(expr.start, "let is disallowed as a lexically bound name");
            }
            if (this.strict && this.reservedWordsStrictBind.test(expr.name)) {
              this.raiseRecoverable(expr.start, (bindingType ? "Binding " : "Assigning to ") + expr.name + " in strict mode");
            }
            if (checkClashes) {
              if (has3(checkClashes, expr.name)) {
                this.raiseRecoverable(expr.start, "Argument name clash");
              }
              checkClashes[expr.name] = true;
            }
            if (bindingType !== BIND_NONE2 && bindingType !== BIND_OUTSIDE2) {
              this.declareName(expr.name, bindingType, expr.start);
            }
            break;
          case "MemberExpression":
            if (bindingType) {
              this.raiseRecoverable(expr.start, "Binding member expression");
            }
            break;
          case "ObjectPattern":
            for (var i = 0, list = expr.properties; i < list.length; i += 1) {
              var prop = list[i];
              this.checkLVal(prop, bindingType, checkClashes);
            }
            break;
          case "Property":
            this.checkLVal(expr.value, bindingType, checkClashes);
            break;
          case "ArrayPattern":
            for (var i$1 = 0, list$1 = expr.elements; i$1 < list$1.length; i$1 += 1) {
              var elem = list$1[i$1];
              if (elem) {
                this.checkLVal(elem, bindingType, checkClashes);
              }
            }
            break;
          case "AssignmentPattern":
            this.checkLVal(expr.left, bindingType, checkClashes);
            break;
          case "RestElement":
            this.checkLVal(expr.argument, bindingType, checkClashes);
            break;
          case "ParenthesizedExpression":
            this.checkLVal(expr.expression, bindingType, checkClashes);
            break;
          default:
            this.raise(expr.start, (bindingType ? "Binding" : "Assigning to") + " rvalue");
        }
      };
      var pp$32 = Parser4.prototype;
      pp$32.checkPropClash = function(prop, propHash, refDestructuringErrors) {
        if (this.options.ecmaVersion >= 9 && prop.type === "SpreadElement") {
          return;
        }
        if (this.options.ecmaVersion >= 6 && (prop.computed || prop.method || prop.shorthand)) {
          return;
        }
        var key = prop.key;
        var name;
        switch (key.type) {
          case "Identifier":
            name = key.name;
            break;
          case "Literal":
            name = String(key.value);
            break;
          default:
            return;
        }
        var kind = prop.kind;
        if (this.options.ecmaVersion >= 6) {
          if (name === "__proto__" && kind === "init") {
            if (propHash.proto) {
              if (refDestructuringErrors && refDestructuringErrors.doubleProto < 0) {
                refDestructuringErrors.doubleProto = key.start;
              } else {
                this.raiseRecoverable(key.start, "Redefinition of __proto__ property");
              }
            }
            propHash.proto = true;
          }
          return;
        }
        name = "$" + name;
        var other = propHash[name];
        if (other) {
          var redefinition;
          if (kind === "init") {
            redefinition = this.strict && other.init || other.get || other.set;
          } else {
            redefinition = other.init || other[kind];
          }
          if (redefinition) {
            this.raiseRecoverable(key.start, "Redefinition of property");
          }
        } else {
          other = propHash[name] = {
            init: false,
            get: false,
            set: false
          };
        }
        other[kind] = true;
      };
      pp$32.parseExpression = function(noIn, refDestructuringErrors) {
        var startPos = this.start, startLoc = this.startLoc;
        var expr = this.parseMaybeAssign(noIn, refDestructuringErrors);
        if (this.type === types3.comma) {
          var node = this.startNodeAt(startPos, startLoc);
          node.expressions = [expr];
          while (this.eat(types3.comma)) {
            node.expressions.push(this.parseMaybeAssign(noIn, refDestructuringErrors));
          }
          return this.finishNode(node, "SequenceExpression");
        }
        return expr;
      };
      pp$32.parseMaybeAssign = function(noIn, refDestructuringErrors, afterLeftParse) {
        if (this.isContextual("yield")) {
          if (this.inGenerator) {
            return this.parseYield(noIn);
          } else {
            this.exprAllowed = false;
          }
        }
        var ownDestructuringErrors = false, oldParenAssign = -1, oldTrailingComma = -1, oldShorthandAssign = -1;
        if (refDestructuringErrors) {
          oldParenAssign = refDestructuringErrors.parenthesizedAssign;
          oldTrailingComma = refDestructuringErrors.trailingComma;
          oldShorthandAssign = refDestructuringErrors.shorthandAssign;
          refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = refDestructuringErrors.shorthandAssign = -1;
        } else {
          refDestructuringErrors = new DestructuringErrors2();
          ownDestructuringErrors = true;
        }
        var startPos = this.start, startLoc = this.startLoc;
        if (this.type === types3.parenL || this.type === types3.name) {
          this.potentialArrowAt = this.start;
        }
        var left = this.parseMaybeConditional(noIn, refDestructuringErrors);
        if (afterLeftParse) {
          left = afterLeftParse.call(this, left, startPos, startLoc);
        }
        if (this.type.isAssign) {
          var node = this.startNodeAt(startPos, startLoc);
          node.operator = this.value;
          node.left = this.type === types3.eq ? this.toAssignable(left, false, refDestructuringErrors) : left;
          if (!ownDestructuringErrors) {
            DestructuringErrors2.call(refDestructuringErrors);
          }
          refDestructuringErrors.shorthandAssign = -1;
          this.checkLVal(left);
          this.next();
          node.right = this.parseMaybeAssign(noIn);
          return this.finishNode(node, "AssignmentExpression");
        } else {
          if (ownDestructuringErrors) {
            this.checkExpressionErrors(refDestructuringErrors, true);
          }
        }
        if (oldParenAssign > -1) {
          refDestructuringErrors.parenthesizedAssign = oldParenAssign;
        }
        if (oldTrailingComma > -1) {
          refDestructuringErrors.trailingComma = oldTrailingComma;
        }
        if (oldShorthandAssign > -1) {
          refDestructuringErrors.shorthandAssign = oldShorthandAssign;
        }
        return left;
      };
      pp$32.parseMaybeConditional = function(noIn, refDestructuringErrors) {
        var startPos = this.start, startLoc = this.startLoc;
        var expr = this.parseExprOps(noIn, refDestructuringErrors);
        if (this.checkExpressionErrors(refDestructuringErrors)) {
          return expr;
        }
        if (this.eat(types3.question)) {
          var node = this.startNodeAt(startPos, startLoc);
          node.test = expr;
          node.consequent = this.parseMaybeAssign();
          this.expect(types3.colon);
          node.alternate = this.parseMaybeAssign(noIn);
          return this.finishNode(node, "ConditionalExpression");
        }
        return expr;
      };
      pp$32.parseExprOps = function(noIn, refDestructuringErrors) {
        var startPos = this.start, startLoc = this.startLoc;
        var expr = this.parseMaybeUnary(refDestructuringErrors, false);
        if (this.checkExpressionErrors(refDestructuringErrors)) {
          return expr;
        }
        return expr.start === startPos && expr.type === "ArrowFunctionExpression" ? expr : this.parseExprOp(expr, startPos, startLoc, -1, noIn);
      };
      pp$32.parseExprOp = function(left, leftStartPos, leftStartLoc, minPrec, noIn) {
        var prec = this.type.binop;
        if (prec != null && (!noIn || this.type !== types3._in)) {
          if (prec > minPrec) {
            var logical = this.type === types3.logicalOR || this.type === types3.logicalAND;
            var op = this.value;
            this.next();
            var startPos = this.start, startLoc = this.startLoc;
            var right = this.parseExprOp(this.parseMaybeUnary(null, false), startPos, startLoc, prec, noIn);
            var node = this.buildBinary(leftStartPos, leftStartLoc, left, right, op, logical);
            return this.parseExprOp(node, leftStartPos, leftStartLoc, minPrec, noIn);
          }
        }
        return left;
      };
      pp$32.buildBinary = function(startPos, startLoc, left, right, op, logical) {
        var node = this.startNodeAt(startPos, startLoc);
        node.left = left;
        node.operator = op;
        node.right = right;
        return this.finishNode(node, logical ? "LogicalExpression" : "BinaryExpression");
      };
      pp$32.parseMaybeUnary = function(refDestructuringErrors, sawUnary) {
        var startPos = this.start, startLoc = this.startLoc, expr;
        if (this.isContextual("await") && (this.inAsync || !this.inFunction && this.options.allowAwaitOutsideFunction)) {
          expr = this.parseAwait();
          sawUnary = true;
        } else if (this.type.prefix) {
          var node = this.startNode(), update = this.type === types3.incDec;
          node.operator = this.value;
          node.prefix = true;
          this.next();
          node.argument = this.parseMaybeUnary(null, true);
          this.checkExpressionErrors(refDestructuringErrors, true);
          if (update) {
            this.checkLVal(node.argument);
          } else if (this.strict && node.operator === "delete" && node.argument.type === "Identifier") {
            this.raiseRecoverable(node.start, "Deleting local variable in strict mode");
          } else {
            sawUnary = true;
          }
          expr = this.finishNode(node, update ? "UpdateExpression" : "UnaryExpression");
        } else {
          expr = this.parseExprSubscripts(refDestructuringErrors);
          if (this.checkExpressionErrors(refDestructuringErrors)) {
            return expr;
          }
          while (this.type.postfix && !this.canInsertSemicolon()) {
            var node$1 = this.startNodeAt(startPos, startLoc);
            node$1.operator = this.value;
            node$1.prefix = false;
            node$1.argument = expr;
            this.checkLVal(expr);
            this.next();
            expr = this.finishNode(node$1, "UpdateExpression");
          }
        }
        if (!sawUnary && this.eat(types3.starstar)) {
          return this.buildBinary(startPos, startLoc, expr, this.parseMaybeUnary(null, false), "**", false);
        } else {
          return expr;
        }
      };
      pp$32.parseExprSubscripts = function(refDestructuringErrors) {
        var startPos = this.start, startLoc = this.startLoc;
        var expr = this.parseExprAtom(refDestructuringErrors);
        var skipArrowSubscripts = expr.type === "ArrowFunctionExpression" && this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")";
        if (this.checkExpressionErrors(refDestructuringErrors) || skipArrowSubscripts) {
          return expr;
        }
        var result = this.parseSubscripts(expr, startPos, startLoc);
        if (refDestructuringErrors && result.type === "MemberExpression") {
          if (refDestructuringErrors.parenthesizedAssign >= result.start) {
            refDestructuringErrors.parenthesizedAssign = -1;
          }
          if (refDestructuringErrors.parenthesizedBind >= result.start) {
            refDestructuringErrors.parenthesizedBind = -1;
          }
        }
        return result;
      };
      pp$32.parseSubscripts = function(base, startPos, startLoc, noCalls) {
        var maybeAsyncArrow = this.options.ecmaVersion >= 8 && base.type === "Identifier" && base.name === "async" && this.lastTokEnd === base.end && !this.canInsertSemicolon() && this.input.slice(base.start, base.end) === "async";
        while (true) {
          var element = this.parseSubscript(base, startPos, startLoc, noCalls, maybeAsyncArrow);
          if (element === base || element.type === "ArrowFunctionExpression") {
            return element;
          }
          base = element;
        }
      };
      pp$32.parseSubscript = function(base, startPos, startLoc, noCalls, maybeAsyncArrow) {
        var computed = this.eat(types3.bracketL);
        if (computed || this.eat(types3.dot)) {
          var node = this.startNodeAt(startPos, startLoc);
          node.object = base;
          node.property = computed ? this.parseExpression() : this.parseIdent(this.options.allowReserved !== "never");
          node.computed = !!computed;
          if (computed) {
            this.expect(types3.bracketR);
          }
          base = this.finishNode(node, "MemberExpression");
        } else if (!noCalls && this.eat(types3.parenL)) {
          var refDestructuringErrors = new DestructuringErrors2(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
          this.yieldPos = 0;
          this.awaitPos = 0;
          this.awaitIdentPos = 0;
          var exprList = this.parseExprList(types3.parenR, this.options.ecmaVersion >= 8 && base.type !== "Import", false, refDestructuringErrors);
          if (maybeAsyncArrow && !this.canInsertSemicolon() && this.eat(types3.arrow)) {
            this.checkPatternErrors(refDestructuringErrors, false);
            this.checkYieldAwaitInDefaultParams();
            if (this.awaitIdentPos > 0) {
              this.raise(this.awaitIdentPos, "Cannot use 'await' as identifier inside an async function");
            }
            this.yieldPos = oldYieldPos;
            this.awaitPos = oldAwaitPos;
            this.awaitIdentPos = oldAwaitIdentPos;
            return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList, true);
          }
          this.checkExpressionErrors(refDestructuringErrors, true);
          this.yieldPos = oldYieldPos || this.yieldPos;
          this.awaitPos = oldAwaitPos || this.awaitPos;
          this.awaitIdentPos = oldAwaitIdentPos || this.awaitIdentPos;
          var node$1 = this.startNodeAt(startPos, startLoc);
          node$1.callee = base;
          node$1.arguments = exprList;
          if (node$1.callee.type === "Import") {
            if (node$1.arguments.length !== 1) {
              this.raise(node$1.start, "import() requires exactly one argument");
            }
            var importArg = node$1.arguments[0];
            if (importArg && importArg.type === "SpreadElement") {
              this.raise(importArg.start, "... is not allowed in import()");
            }
          }
          base = this.finishNode(node$1, "CallExpression");
        } else if (this.type === types3.backQuote) {
          var node$2 = this.startNodeAt(startPos, startLoc);
          node$2.tag = base;
          node$2.quasi = this.parseTemplate({ isTagged: true });
          base = this.finishNode(node$2, "TaggedTemplateExpression");
        }
        return base;
      };
      pp$32.parseExprAtom = function(refDestructuringErrors) {
        if (this.type === types3.slash) {
          this.readRegexp();
        }
        var node, canBeArrow = this.potentialArrowAt === this.start;
        switch (this.type) {
          case types3._super:
            if (!this.allowSuper) {
              this.raise(this.start, "'super' keyword outside a method");
            }
            node = this.startNode();
            this.next();
            if (this.type === types3.parenL && !this.allowDirectSuper) {
              this.raise(node.start, "super() call outside constructor of a subclass");
            }
            if (this.type !== types3.dot && this.type !== types3.bracketL && this.type !== types3.parenL) {
              this.unexpected();
            }
            return this.finishNode(node, "Super");
          case types3._this:
            node = this.startNode();
            this.next();
            return this.finishNode(node, "ThisExpression");
          case types3.name:
            var startPos = this.start, startLoc = this.startLoc, containsEsc = this.containsEsc;
            var id = this.parseIdent(false);
            if (this.options.ecmaVersion >= 8 && !containsEsc && id.name === "async" && !this.canInsertSemicolon() && this.eat(types3._function)) {
              return this.parseFunction(this.startNodeAt(startPos, startLoc), 0, false, true);
            }
            if (canBeArrow && !this.canInsertSemicolon()) {
              if (this.eat(types3.arrow)) {
                return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], false);
              }
              if (this.options.ecmaVersion >= 8 && id.name === "async" && this.type === types3.name && !containsEsc) {
                id = this.parseIdent(false);
                if (this.canInsertSemicolon() || !this.eat(types3.arrow)) {
                  this.unexpected();
                }
                return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], true);
              }
            }
            return id;
          case types3.regexp:
            var value = this.value;
            node = this.parseLiteral(value.value);
            node.regex = { pattern: value.pattern, flags: value.flags };
            return node;
          case types3.num:
          case types3.string:
            return this.parseLiteral(this.value);
          case types3._null:
          case types3._true:
          case types3._false:
            node = this.startNode();
            node.value = this.type === types3._null ? null : this.type === types3._true;
            node.raw = this.type.keyword;
            this.next();
            return this.finishNode(node, "Literal");
          case types3.parenL:
            var start = this.start, expr = this.parseParenAndDistinguishExpression(canBeArrow);
            if (refDestructuringErrors) {
              if (refDestructuringErrors.parenthesizedAssign < 0 && !this.isSimpleAssignTarget(expr)) {
                refDestructuringErrors.parenthesizedAssign = start;
              }
              if (refDestructuringErrors.parenthesizedBind < 0) {
                refDestructuringErrors.parenthesizedBind = start;
              }
            }
            return expr;
          case types3.bracketL:
            node = this.startNode();
            this.next();
            node.elements = this.parseExprList(types3.bracketR, true, true, refDestructuringErrors);
            return this.finishNode(node, "ArrayExpression");
          case types3.braceL:
            return this.parseObj(false, refDestructuringErrors);
          case types3._function:
            node = this.startNode();
            this.next();
            return this.parseFunction(node, 0);
          case types3._class:
            return this.parseClass(this.startNode(), false);
          case types3._new:
            return this.parseNew();
          case types3.backQuote:
            return this.parseTemplate();
          case types3._import:
            if (this.options.ecmaVersion > 10) {
              return this.parseDynamicImport();
            } else {
              return this.unexpected();
            }
          default:
            this.unexpected();
        }
      };
      pp$32.parseDynamicImport = function() {
        var node = this.startNode();
        this.next();
        if (this.type !== types3.parenL) {
          this.unexpected();
        }
        return this.finishNode(node, "Import");
      };
      pp$32.parseLiteral = function(value) {
        var node = this.startNode();
        node.value = value;
        node.raw = this.input.slice(this.start, this.end);
        if (node.raw.charCodeAt(node.raw.length - 1) === 110) {
          node.bigint = node.raw.slice(0, -1);
        }
        this.next();
        return this.finishNode(node, "Literal");
      };
      pp$32.parseParenExpression = function() {
        this.expect(types3.parenL);
        var val = this.parseExpression();
        this.expect(types3.parenR);
        return val;
      };
      pp$32.parseParenAndDistinguishExpression = function(canBeArrow) {
        var startPos = this.start, startLoc = this.startLoc, val, allowTrailingComma = this.options.ecmaVersion >= 8;
        if (this.options.ecmaVersion >= 6) {
          this.next();
          var innerStartPos = this.start, innerStartLoc = this.startLoc;
          var exprList = [], first = true, lastIsComma = false;
          var refDestructuringErrors = new DestructuringErrors2(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, spreadStart;
          this.yieldPos = 0;
          this.awaitPos = 0;
          while (this.type !== types3.parenR) {
            first ? first = false : this.expect(types3.comma);
            if (allowTrailingComma && this.afterTrailingComma(types3.parenR, true)) {
              lastIsComma = true;
              break;
            } else if (this.type === types3.ellipsis) {
              spreadStart = this.start;
              exprList.push(this.parseParenItem(this.parseRestBinding()));
              if (this.type === types3.comma) {
                this.raise(this.start, "Comma is not permitted after the rest element");
              }
              break;
            } else {
              exprList.push(this.parseMaybeAssign(false, refDestructuringErrors, this.parseParenItem));
            }
          }
          var innerEndPos = this.start, innerEndLoc = this.startLoc;
          this.expect(types3.parenR);
          if (canBeArrow && !this.canInsertSemicolon() && this.eat(types3.arrow)) {
            this.checkPatternErrors(refDestructuringErrors, false);
            this.checkYieldAwaitInDefaultParams();
            this.yieldPos = oldYieldPos;
            this.awaitPos = oldAwaitPos;
            return this.parseParenArrowList(startPos, startLoc, exprList);
          }
          if (!exprList.length || lastIsComma) {
            this.unexpected(this.lastTokStart);
          }
          if (spreadStart) {
            this.unexpected(spreadStart);
          }
          this.checkExpressionErrors(refDestructuringErrors, true);
          this.yieldPos = oldYieldPos || this.yieldPos;
          this.awaitPos = oldAwaitPos || this.awaitPos;
          if (exprList.length > 1) {
            val = this.startNodeAt(innerStartPos, innerStartLoc);
            val.expressions = exprList;
            this.finishNodeAt(val, "SequenceExpression", innerEndPos, innerEndLoc);
          } else {
            val = exprList[0];
          }
        } else {
          val = this.parseParenExpression();
        }
        if (this.options.preserveParens) {
          var par = this.startNodeAt(startPos, startLoc);
          par.expression = val;
          return this.finishNode(par, "ParenthesizedExpression");
        } else {
          return val;
        }
      };
      pp$32.parseParenItem = function(item) {
        return item;
      };
      pp$32.parseParenArrowList = function(startPos, startLoc, exprList) {
        return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList);
      };
      var empty$12 = [];
      pp$32.parseNew = function() {
        var node = this.startNode();
        var meta = this.parseIdent(true);
        if (this.options.ecmaVersion >= 6 && this.eat(types3.dot)) {
          node.meta = meta;
          var containsEsc = this.containsEsc;
          node.property = this.parseIdent(true);
          if (node.property.name !== "target" || containsEsc) {
            this.raiseRecoverable(node.property.start, "The only valid meta property for new is new.target");
          }
          if (!this.inNonArrowFunction()) {
            this.raiseRecoverable(node.start, "new.target can only be used in functions");
          }
          return this.finishNode(node, "MetaProperty");
        }
        var startPos = this.start, startLoc = this.startLoc;
        node.callee = this.parseSubscripts(this.parseExprAtom(), startPos, startLoc, true);
        if (this.options.ecmaVersion > 10 && node.callee.type === "Import") {
          this.raise(node.callee.start, "Cannot use new with import(...)");
        }
        if (this.eat(types3.parenL)) {
          node.arguments = this.parseExprList(types3.parenR, this.options.ecmaVersion >= 8 && node.callee.type !== "Import", false);
        } else {
          node.arguments = empty$12;
        }
        return this.finishNode(node, "NewExpression");
      };
      pp$32.parseTemplateElement = function(ref3) {
        var isTagged = ref3.isTagged;
        var elem = this.startNode();
        if (this.type === types3.invalidTemplate) {
          if (!isTagged) {
            this.raiseRecoverable(this.start, "Bad escape sequence in untagged template literal");
          }
          elem.value = {
            raw: this.value,
            cooked: null
          };
        } else {
          elem.value = {
            raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, "\n"),
            cooked: this.value
          };
        }
        this.next();
        elem.tail = this.type === types3.backQuote;
        return this.finishNode(elem, "TemplateElement");
      };
      pp$32.parseTemplate = function(ref3) {
        if (ref3 === void 0)
          ref3 = {};
        var isTagged = ref3.isTagged;
        if (isTagged === void 0)
          isTagged = false;
        var node = this.startNode();
        this.next();
        node.expressions = [];
        var curElt = this.parseTemplateElement({ isTagged });
        node.quasis = [curElt];
        while (!curElt.tail) {
          if (this.type === types3.eof) {
            this.raise(this.pos, "Unterminated template literal");
          }
          this.expect(types3.dollarBraceL);
          node.expressions.push(this.parseExpression());
          this.expect(types3.braceR);
          node.quasis.push(curElt = this.parseTemplateElement({ isTagged }));
        }
        this.next();
        return this.finishNode(node, "TemplateLiteral");
      };
      pp$32.isAsyncProp = function(prop) {
        return !prop.computed && prop.key.type === "Identifier" && prop.key.name === "async" && (this.type === types3.name || this.type === types3.num || this.type === types3.string || this.type === types3.bracketL || this.type.keyword || this.options.ecmaVersion >= 9 && this.type === types3.star) && !lineBreak2.test(this.input.slice(this.lastTokEnd, this.start));
      };
      pp$32.parseObj = function(isPattern, refDestructuringErrors) {
        var node = this.startNode(), first = true, propHash = {};
        node.properties = [];
        this.next();
        while (!this.eat(types3.braceR)) {
          if (!first) {
            this.expect(types3.comma);
            if (this.afterTrailingComma(types3.braceR)) {
              break;
            }
          } else {
            first = false;
          }
          var prop = this.parseProperty(isPattern, refDestructuringErrors);
          if (!isPattern) {
            this.checkPropClash(prop, propHash, refDestructuringErrors);
          }
          node.properties.push(prop);
        }
        return this.finishNode(node, isPattern ? "ObjectPattern" : "ObjectExpression");
      };
      pp$32.parseProperty = function(isPattern, refDestructuringErrors) {
        var prop = this.startNode(), isGenerator, isAsync, startPos, startLoc;
        if (this.options.ecmaVersion >= 9 && this.eat(types3.ellipsis)) {
          if (isPattern) {
            prop.argument = this.parseIdent(false);
            if (this.type === types3.comma) {
              this.raise(this.start, "Comma is not permitted after the rest element");
            }
            return this.finishNode(prop, "RestElement");
          }
          if (this.type === types3.parenL && refDestructuringErrors) {
            if (refDestructuringErrors.parenthesizedAssign < 0) {
              refDestructuringErrors.parenthesizedAssign = this.start;
            }
            if (refDestructuringErrors.parenthesizedBind < 0) {
              refDestructuringErrors.parenthesizedBind = this.start;
            }
          }
          prop.argument = this.parseMaybeAssign(false, refDestructuringErrors);
          if (this.type === types3.comma && refDestructuringErrors && refDestructuringErrors.trailingComma < 0) {
            refDestructuringErrors.trailingComma = this.start;
          }
          return this.finishNode(prop, "SpreadElement");
        }
        if (this.options.ecmaVersion >= 6) {
          prop.method = false;
          prop.shorthand = false;
          if (isPattern || refDestructuringErrors) {
            startPos = this.start;
            startLoc = this.startLoc;
          }
          if (!isPattern) {
            isGenerator = this.eat(types3.star);
          }
        }
        var containsEsc = this.containsEsc;
        this.parsePropertyName(prop);
        if (!isPattern && !containsEsc && this.options.ecmaVersion >= 8 && !isGenerator && this.isAsyncProp(prop)) {
          isAsync = true;
          isGenerator = this.options.ecmaVersion >= 9 && this.eat(types3.star);
          this.parsePropertyName(prop, refDestructuringErrors);
        } else {
          isAsync = false;
        }
        this.parsePropertyValue(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc);
        return this.finishNode(prop, "Property");
      };
      pp$32.parsePropertyValue = function(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc) {
        if ((isGenerator || isAsync) && this.type === types3.colon) {
          this.unexpected();
        }
        if (this.eat(types3.colon)) {
          prop.value = isPattern ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(false, refDestructuringErrors);
          prop.kind = "init";
        } else if (this.options.ecmaVersion >= 6 && this.type === types3.parenL) {
          if (isPattern) {
            this.unexpected();
          }
          prop.kind = "init";
          prop.method = true;
          prop.value = this.parseMethod(isGenerator, isAsync);
        } else if (!isPattern && !containsEsc && this.options.ecmaVersion >= 5 && !prop.computed && prop.key.type === "Identifier" && (prop.key.name === "get" || prop.key.name === "set") && (this.type !== types3.comma && this.type !== types3.braceR)) {
          if (isGenerator || isAsync) {
            this.unexpected();
          }
          prop.kind = prop.key.name;
          this.parsePropertyName(prop);
          prop.value = this.parseMethod(false);
          var paramCount = prop.kind === "get" ? 0 : 1;
          if (prop.value.params.length !== paramCount) {
            var start = prop.value.start;
            if (prop.kind === "get") {
              this.raiseRecoverable(start, "getter should have no params");
            } else {
              this.raiseRecoverable(start, "setter should have exactly one param");
            }
          } else {
            if (prop.kind === "set" && prop.value.params[0].type === "RestElement") {
              this.raiseRecoverable(prop.value.params[0].start, "Setter cannot use rest params");
            }
          }
        } else if (this.options.ecmaVersion >= 6 && !prop.computed && prop.key.type === "Identifier") {
          if (isGenerator || isAsync) {
            this.unexpected();
          }
          this.checkUnreserved(prop.key);
          if (prop.key.name === "await" && !this.awaitIdentPos) {
            this.awaitIdentPos = startPos;
          }
          prop.kind = "init";
          if (isPattern) {
            prop.value = this.parseMaybeDefault(startPos, startLoc, prop.key);
          } else if (this.type === types3.eq && refDestructuringErrors) {
            if (refDestructuringErrors.shorthandAssign < 0) {
              refDestructuringErrors.shorthandAssign = this.start;
            }
            prop.value = this.parseMaybeDefault(startPos, startLoc, prop.key);
          } else {
            prop.value = prop.key;
          }
          prop.shorthand = true;
        } else {
          this.unexpected();
        }
      };
      pp$32.parsePropertyName = function(prop) {
        if (this.options.ecmaVersion >= 6) {
          if (this.eat(types3.bracketL)) {
            prop.computed = true;
            prop.key = this.parseMaybeAssign();
            this.expect(types3.bracketR);
            return prop.key;
          } else {
            prop.computed = false;
          }
        }
        return prop.key = this.type === types3.num || this.type === types3.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never");
      };
      pp$32.initFunction = function(node) {
        node.id = null;
        if (this.options.ecmaVersion >= 6) {
          node.generator = node.expression = false;
        }
        if (this.options.ecmaVersion >= 8) {
          node.async = false;
        }
      };
      pp$32.parseMethod = function(isGenerator, isAsync, allowDirectSuper) {
        var node = this.startNode(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
        this.initFunction(node);
        if (this.options.ecmaVersion >= 6) {
          node.generator = isGenerator;
        }
        if (this.options.ecmaVersion >= 8) {
          node.async = !!isAsync;
        }
        this.yieldPos = 0;
        this.awaitPos = 0;
        this.awaitIdentPos = 0;
        this.enterScope(functionFlags2(isAsync, node.generator) | SCOPE_SUPER2 | (allowDirectSuper ? SCOPE_DIRECT_SUPER2 : 0));
        this.expect(types3.parenL);
        node.params = this.parseBindingList(types3.parenR, false, this.options.ecmaVersion >= 8);
        this.checkYieldAwaitInDefaultParams();
        this.parseFunctionBody(node, false, true);
        this.yieldPos = oldYieldPos;
        this.awaitPos = oldAwaitPos;
        this.awaitIdentPos = oldAwaitIdentPos;
        return this.finishNode(node, "FunctionExpression");
      };
      pp$32.parseArrowExpression = function(node, params, isAsync) {
        var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
        this.enterScope(functionFlags2(isAsync, false) | SCOPE_ARROW2);
        this.initFunction(node);
        if (this.options.ecmaVersion >= 8) {
          node.async = !!isAsync;
        }
        this.yieldPos = 0;
        this.awaitPos = 0;
        this.awaitIdentPos = 0;
        node.params = this.toAssignableList(params, true);
        this.parseFunctionBody(node, true, false);
        this.yieldPos = oldYieldPos;
        this.awaitPos = oldAwaitPos;
        this.awaitIdentPos = oldAwaitIdentPos;
        return this.finishNode(node, "ArrowFunctionExpression");
      };
      pp$32.parseFunctionBody = function(node, isArrowFunction, isMethod) {
        var isExpression = isArrowFunction && this.type !== types3.braceL;
        var oldStrict = this.strict, useStrict = false;
        if (isExpression) {
          node.body = this.parseMaybeAssign();
          node.expression = true;
          this.checkParams(node, false);
        } else {
          var nonSimple = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(node.params);
          if (!oldStrict || nonSimple) {
            useStrict = this.strictDirective(this.end);
            if (useStrict && nonSimple) {
              this.raiseRecoverable(node.start, "Illegal 'use strict' directive in function with non-simple parameter list");
            }
          }
          var oldLabels = this.labels;
          this.labels = [];
          if (useStrict) {
            this.strict = true;
          }
          this.checkParams(node, !oldStrict && !useStrict && !isArrowFunction && !isMethod && this.isSimpleParamList(node.params));
          node.body = this.parseBlock(false);
          node.expression = false;
          this.adaptDirectivePrologue(node.body.body);
          this.labels = oldLabels;
        }
        this.exitScope();
        if (this.strict && node.id) {
          this.checkLVal(node.id, BIND_OUTSIDE2);
        }
        this.strict = oldStrict;
      };
      pp$32.isSimpleParamList = function(params) {
        for (var i = 0, list = params; i < list.length; i += 1) {
          var param = list[i];
          if (param.type !== "Identifier") {
            return false;
          }
        }
        return true;
      };
      pp$32.checkParams = function(node, allowDuplicates) {
        var nameHash = {};
        for (var i = 0, list = node.params; i < list.length; i += 1) {
          var param = list[i];
          this.checkLVal(param, BIND_VAR2, allowDuplicates ? null : nameHash);
        }
      };
      pp$32.parseExprList = function(close, allowTrailingComma, allowEmpty, refDestructuringErrors) {
        var elts = [], first = true;
        while (!this.eat(close)) {
          if (!first) {
            this.expect(types3.comma);
            if (allowTrailingComma && this.afterTrailingComma(close)) {
              break;
            }
          } else {
            first = false;
          }
          var elt = void 0;
          if (allowEmpty && this.type === types3.comma) {
            elt = null;
          } else if (this.type === types3.ellipsis) {
            elt = this.parseSpread(refDestructuringErrors);
            if (refDestructuringErrors && this.type === types3.comma && refDestructuringErrors.trailingComma < 0) {
              refDestructuringErrors.trailingComma = this.start;
            }
          } else {
            elt = this.parseMaybeAssign(false, refDestructuringErrors);
          }
          elts.push(elt);
        }
        return elts;
      };
      pp$32.checkUnreserved = function(ref3) {
        var start = ref3.start;
        var end = ref3.end;
        var name = ref3.name;
        if (this.inGenerator && name === "yield") {
          this.raiseRecoverable(start, "Cannot use 'yield' as identifier inside a generator");
        }
        if (this.inAsync && name === "await") {
          this.raiseRecoverable(start, "Cannot use 'await' as identifier inside an async function");
        }
        if (this.keywords.test(name)) {
          this.raise(start, "Unexpected keyword '" + name + "'");
        }
        if (this.options.ecmaVersion < 6 && this.input.slice(start, end).indexOf("\\") !== -1) {
          return;
        }
        var re = this.strict ? this.reservedWordsStrict : this.reservedWords;
        if (re.test(name)) {
          if (!this.inAsync && name === "await") {
            this.raiseRecoverable(start, "Cannot use keyword 'await' outside an async function");
          }
          this.raiseRecoverable(start, "The keyword '" + name + "' is reserved");
        }
      };
      pp$32.parseIdent = function(liberal, isBinding) {
        var node = this.startNode();
        if (this.type === types3.name) {
          node.name = this.value;
        } else if (this.type.keyword) {
          node.name = this.type.keyword;
          if ((node.name === "class" || node.name === "function") && (this.lastTokEnd !== this.lastTokStart + 1 || this.input.charCodeAt(this.lastTokStart) !== 46)) {
            this.context.pop();
          }
        } else {
          this.unexpected();
        }
        this.next();
        this.finishNode(node, "Identifier");
        if (!liberal) {
          this.checkUnreserved(node);
          if (node.name === "await" && !this.awaitIdentPos) {
            this.awaitIdentPos = node.start;
          }
        }
        return node;
      };
      pp$32.parseYield = function(noIn) {
        if (!this.yieldPos) {
          this.yieldPos = this.start;
        }
        var node = this.startNode();
        this.next();
        if (this.type === types3.semi || this.canInsertSemicolon() || this.type !== types3.star && !this.type.startsExpr) {
          node.delegate = false;
          node.argument = null;
        } else {
          node.delegate = this.eat(types3.star);
          node.argument = this.parseMaybeAssign(noIn);
        }
        return this.finishNode(node, "YieldExpression");
      };
      pp$32.parseAwait = function() {
        if (!this.awaitPos) {
          this.awaitPos = this.start;
        }
        var node = this.startNode();
        this.next();
        node.argument = this.parseMaybeUnary(null, true);
        return this.finishNode(node, "AwaitExpression");
      };
      var pp$42 = Parser4.prototype;
      pp$42.raise = function(pos, message) {
        var loc = getLineInfo2(this.input, pos);
        message += " (" + loc.line + ":" + loc.column + ")";
        var err = new SyntaxError(message);
        err.pos = pos;
        err.loc = loc;
        err.raisedAt = this.pos;
        throw err;
      };
      pp$42.raiseRecoverable = pp$42.raise;
      pp$42.curPosition = function() {
        if (this.options.locations) {
          return new Position3(this.curLine, this.pos - this.lineStart);
        }
      };
      var pp$52 = Parser4.prototype;
      var Scope5 = function Scope6(flags) {
        this.flags = flags;
        this.var = [];
        this.lexical = [];
        this.functions = [];
      };
      pp$52.enterScope = function(flags) {
        this.scopeStack.push(new Scope5(flags));
      };
      pp$52.exitScope = function() {
        this.scopeStack.pop();
      };
      pp$52.treatFunctionsAsVarInScope = function(scope) {
        return scope.flags & SCOPE_FUNCTION2 || !this.inModule && scope.flags & SCOPE_TOP2;
      };
      pp$52.declareName = function(name, bindingType, pos) {
        var redeclared = false;
        if (bindingType === BIND_LEXICAL2) {
          var scope = this.currentScope();
          redeclared = scope.lexical.indexOf(name) > -1 || scope.functions.indexOf(name) > -1 || scope.var.indexOf(name) > -1;
          scope.lexical.push(name);
          if (this.inModule && scope.flags & SCOPE_TOP2) {
            delete this.undefinedExports[name];
          }
        } else if (bindingType === BIND_SIMPLE_CATCH2) {
          var scope$1 = this.currentScope();
          scope$1.lexical.push(name);
        } else if (bindingType === BIND_FUNCTION2) {
          var scope$2 = this.currentScope();
          if (this.treatFunctionsAsVar) {
            redeclared = scope$2.lexical.indexOf(name) > -1;
          } else {
            redeclared = scope$2.lexical.indexOf(name) > -1 || scope$2.var.indexOf(name) > -1;
          }
          scope$2.functions.push(name);
        } else {
          for (var i = this.scopeStack.length - 1; i >= 0; --i) {
            var scope$3 = this.scopeStack[i];
            if (scope$3.lexical.indexOf(name) > -1 && !(scope$3.flags & SCOPE_SIMPLE_CATCH2 && scope$3.lexical[0] === name) || !this.treatFunctionsAsVarInScope(scope$3) && scope$3.functions.indexOf(name) > -1) {
              redeclared = true;
              break;
            }
            scope$3.var.push(name);
            if (this.inModule && scope$3.flags & SCOPE_TOP2) {
              delete this.undefinedExports[name];
            }
            if (scope$3.flags & SCOPE_VAR2) {
              break;
            }
          }
        }
        if (redeclared) {
          this.raiseRecoverable(pos, "Identifier '" + name + "' has already been declared");
        }
      };
      pp$52.checkLocalExport = function(id) {
        if (this.scopeStack[0].lexical.indexOf(id.name) === -1 && this.scopeStack[0].var.indexOf(id.name) === -1) {
          this.undefinedExports[id.name] = id;
        }
      };
      pp$52.currentScope = function() {
        return this.scopeStack[this.scopeStack.length - 1];
      };
      pp$52.currentVarScope = function() {
        for (var i = this.scopeStack.length - 1; ; i--) {
          var scope = this.scopeStack[i];
          if (scope.flags & SCOPE_VAR2) {
            return scope;
          }
        }
      };
      pp$52.currentThisScope = function() {
        for (var i = this.scopeStack.length - 1; ; i--) {
          var scope = this.scopeStack[i];
          if (scope.flags & SCOPE_VAR2 && !(scope.flags & SCOPE_ARROW2)) {
            return scope;
          }
        }
      };
      var Node5 = function Node6(parser2, pos, loc) {
        this.type = "";
        this.start = pos;
        this.end = 0;
        if (parser2.options.locations) {
          this.loc = new SourceLocation3(parser2, loc);
        }
        if (parser2.options.directSourceFile) {
          this.sourceFile = parser2.options.directSourceFile;
        }
        if (parser2.options.ranges) {
          this.range = [pos, 0];
        }
      };
      var pp$62 = Parser4.prototype;
      pp$62.startNode = function() {
        return new Node5(this, this.start, this.startLoc);
      };
      pp$62.startNodeAt = function(pos, loc) {
        return new Node5(this, pos, loc);
      };
      function finishNodeAt2(node, type, pos, loc) {
        node.type = type;
        node.end = pos;
        if (this.options.locations) {
          node.loc.end = loc;
        }
        if (this.options.ranges) {
          node.range[1] = pos;
        }
        return node;
      }
      pp$62.finishNode = function(node, type) {
        return finishNodeAt2.call(this, node, type, this.lastTokEnd, this.lastTokEndLoc);
      };
      pp$62.finishNodeAt = function(node, type, pos, loc) {
        return finishNodeAt2.call(this, node, type, pos, loc);
      };
      var TokContext3 = function TokContext4(token, isExpr, preserveSpace, override, generator) {
        this.token = token;
        this.isExpr = !!isExpr;
        this.preserveSpace = !!preserveSpace;
        this.override = override;
        this.generator = !!generator;
      };
      var types$12 = {
        b_stat: new TokContext3("{", false),
        b_expr: new TokContext3("{", true),
        b_tmpl: new TokContext3("${", false),
        p_stat: new TokContext3("(", false),
        p_expr: new TokContext3("(", true),
        q_tmpl: new TokContext3("`", true, true, function(p) {
          return p.tryReadTemplateToken();
        }),
        f_stat: new TokContext3("function", false),
        f_expr: new TokContext3("function", true),
        f_expr_gen: new TokContext3("function", true, false, null, true),
        f_gen: new TokContext3("function", false, false, null, true)
      };
      var pp$72 = Parser4.prototype;
      pp$72.initialContext = function() {
        return [types$12.b_stat];
      };
      pp$72.braceIsBlock = function(prevType) {
        var parent = this.curContext();
        if (parent === types$12.f_expr || parent === types$12.f_stat) {
          return true;
        }
        if (prevType === types3.colon && (parent === types$12.b_stat || parent === types$12.b_expr)) {
          return !parent.isExpr;
        }
        if (prevType === types3._return || prevType === types3.name && this.exprAllowed) {
          return lineBreak2.test(this.input.slice(this.lastTokEnd, this.start));
        }
        if (prevType === types3._else || prevType === types3.semi || prevType === types3.eof || prevType === types3.parenR || prevType === types3.arrow) {
          return true;
        }
        if (prevType === types3.braceL) {
          return parent === types$12.b_stat;
        }
        if (prevType === types3._var || prevType === types3._const || prevType === types3.name) {
          return false;
        }
        return !this.exprAllowed;
      };
      pp$72.inGeneratorContext = function() {
        for (var i = this.context.length - 1; i >= 1; i--) {
          var context = this.context[i];
          if (context.token === "function") {
            return context.generator;
          }
        }
        return false;
      };
      pp$72.updateContext = function(prevType) {
        var update, type = this.type;
        if (type.keyword && prevType === types3.dot) {
          this.exprAllowed = false;
        } else if (update = type.updateContext) {
          update.call(this, prevType);
        } else {
          this.exprAllowed = type.beforeExpr;
        }
      };
      types3.parenR.updateContext = types3.braceR.updateContext = function() {
        if (this.context.length === 1) {
          this.exprAllowed = true;
          return;
        }
        var out = this.context.pop();
        if (out === types$12.b_stat && this.curContext().token === "function") {
          out = this.context.pop();
        }
        this.exprAllowed = !out.isExpr;
      };
      types3.braceL.updateContext = function(prevType) {
        this.context.push(this.braceIsBlock(prevType) ? types$12.b_stat : types$12.b_expr);
        this.exprAllowed = true;
      };
      types3.dollarBraceL.updateContext = function() {
        this.context.push(types$12.b_tmpl);
        this.exprAllowed = true;
      };
      types3.parenL.updateContext = function(prevType) {
        var statementParens = prevType === types3._if || prevType === types3._for || prevType === types3._with || prevType === types3._while;
        this.context.push(statementParens ? types$12.p_stat : types$12.p_expr);
        this.exprAllowed = true;
      };
      types3.incDec.updateContext = function() {
      };
      types3._function.updateContext = types3._class.updateContext = function(prevType) {
        if (prevType.beforeExpr && prevType !== types3.semi && prevType !== types3._else && !(prevType === types3._return && lineBreak2.test(this.input.slice(this.lastTokEnd, this.start))) && !((prevType === types3.colon || prevType === types3.braceL) && this.curContext() === types$12.b_stat)) {
          this.context.push(types$12.f_expr);
        } else {
          this.context.push(types$12.f_stat);
        }
        this.exprAllowed = false;
      };
      types3.backQuote.updateContext = function() {
        if (this.curContext() === types$12.q_tmpl) {
          this.context.pop();
        } else {
          this.context.push(types$12.q_tmpl);
        }
        this.exprAllowed = false;
      };
      types3.star.updateContext = function(prevType) {
        if (prevType === types3._function) {
          var index = this.context.length - 1;
          if (this.context[index] === types$12.f_expr) {
            this.context[index] = types$12.f_expr_gen;
          } else {
            this.context[index] = types$12.f_gen;
          }
        }
        this.exprAllowed = true;
      };
      types3.name.updateContext = function(prevType) {
        var allowed = false;
        if (this.options.ecmaVersion >= 6 && prevType !== types3.dot) {
          if (this.value === "of" && !this.exprAllowed || this.value === "yield" && this.inGeneratorContext()) {
            allowed = true;
          }
        }
        this.exprAllowed = allowed;
      };
      var ecma9BinaryProperties2 = "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS";
      var ecma10BinaryProperties2 = ecma9BinaryProperties2 + " Extended_Pictographic";
      var ecma11BinaryProperties2 = ecma10BinaryProperties2;
      var unicodeBinaryProperties2 = {
        9: ecma9BinaryProperties2,
        10: ecma10BinaryProperties2,
        11: ecma11BinaryProperties2
      };
      var unicodeGeneralCategoryValues2 = "Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu";
      var ecma9ScriptValues2 = "Adlam Adlm Ahom Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb";
      var ecma10ScriptValues2 = ecma9ScriptValues2 + " Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd";
      var ecma11ScriptValues2 = ecma10ScriptValues2 + " Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho";
      var unicodeScriptValues2 = {
        9: ecma9ScriptValues2,
        10: ecma10ScriptValues2,
        11: ecma11ScriptValues2
      };
      var data2 = {};
      function buildUnicodeData2(ecmaVersion) {
        var d = data2[ecmaVersion] = {
          binary: wordsRegexp2(unicodeBinaryProperties2[ecmaVersion] + " " + unicodeGeneralCategoryValues2),
          nonBinary: {
            General_Category: wordsRegexp2(unicodeGeneralCategoryValues2),
            Script: wordsRegexp2(unicodeScriptValues2[ecmaVersion])
          }
        };
        d.nonBinary.Script_Extensions = d.nonBinary.Script;
        d.nonBinary.gc = d.nonBinary.General_Category;
        d.nonBinary.sc = d.nonBinary.Script;
        d.nonBinary.scx = d.nonBinary.Script_Extensions;
      }
      buildUnicodeData2(9);
      buildUnicodeData2(10);
      buildUnicodeData2(11);
      var pp$82 = Parser4.prototype;
      var RegExpValidationState3 = function RegExpValidationState4(parser2) {
        this.parser = parser2;
        this.validFlags = "gim" + (parser2.options.ecmaVersion >= 6 ? "uy" : "") + (parser2.options.ecmaVersion >= 9 ? "s" : "");
        this.unicodeProperties = data2[parser2.options.ecmaVersion >= 11 ? 11 : parser2.options.ecmaVersion];
        this.source = "";
        this.flags = "";
        this.start = 0;
        this.switchU = false;
        this.switchN = false;
        this.pos = 0;
        this.lastIntValue = 0;
        this.lastStringValue = "";
        this.lastAssertionIsQuantifiable = false;
        this.numCapturingParens = 0;
        this.maxBackReference = 0;
        this.groupNames = [];
        this.backReferenceNames = [];
      };
      RegExpValidationState3.prototype.reset = function reset2(start, pattern, flags) {
        var unicode = flags.indexOf("u") !== -1;
        this.start = start | 0;
        this.source = pattern + "";
        this.flags = flags;
        this.switchU = unicode && this.parser.options.ecmaVersion >= 6;
        this.switchN = unicode && this.parser.options.ecmaVersion >= 9;
      };
      RegExpValidationState3.prototype.raise = function raise2(message) {
        this.parser.raiseRecoverable(this.start, "Invalid regular expression: /" + this.source + "/: " + message);
      };
      RegExpValidationState3.prototype.at = function at2(i) {
        var s = this.source;
        var l = s.length;
        if (i >= l) {
          return -1;
        }
        var c = s.charCodeAt(i);
        if (!this.switchU || c <= 55295 || c >= 57344 || i + 1 >= l) {
          return c;
        }
        var next = s.charCodeAt(i + 1);
        return next >= 56320 && next <= 57343 ? (c << 10) + next - 56613888 : c;
      };
      RegExpValidationState3.prototype.nextIndex = function nextIndex2(i) {
        var s = this.source;
        var l = s.length;
        if (i >= l) {
          return l;
        }
        var c = s.charCodeAt(i), next;
        if (!this.switchU || c <= 55295 || c >= 57344 || i + 1 >= l || (next = s.charCodeAt(i + 1)) < 56320 || next > 57343) {
          return i + 1;
        }
        return i + 2;
      };
      RegExpValidationState3.prototype.current = function current2() {
        return this.at(this.pos);
      };
      RegExpValidationState3.prototype.lookahead = function lookahead2() {
        return this.at(this.nextIndex(this.pos));
      };
      RegExpValidationState3.prototype.advance = function advance3() {
        this.pos = this.nextIndex(this.pos);
      };
      RegExpValidationState3.prototype.eat = function eat2(ch) {
        if (this.current() === ch) {
          this.advance();
          return true;
        }
        return false;
      };
      function codePointToString2(ch) {
        if (ch <= 65535) {
          return String.fromCharCode(ch);
        }
        ch -= 65536;
        return String.fromCharCode((ch >> 10) + 55296, (ch & 1023) + 56320);
      }
      pp$82.validateRegExpFlags = function(state) {
        var validFlags = state.validFlags;
        var flags = state.flags;
        for (var i = 0; i < flags.length; i++) {
          var flag = flags.charAt(i);
          if (validFlags.indexOf(flag) === -1) {
            this.raise(state.start, "Invalid regular expression flag");
          }
          if (flags.indexOf(flag, i + 1) > -1) {
            this.raise(state.start, "Duplicate regular expression flag");
          }
        }
      };
      pp$82.validateRegExpPattern = function(state) {
        this.regexp_pattern(state);
        if (!state.switchN && this.options.ecmaVersion >= 9 && state.groupNames.length > 0) {
          state.switchN = true;
          this.regexp_pattern(state);
        }
      };
      pp$82.regexp_pattern = function(state) {
        state.pos = 0;
        state.lastIntValue = 0;
        state.lastStringValue = "";
        state.lastAssertionIsQuantifiable = false;
        state.numCapturingParens = 0;
        state.maxBackReference = 0;
        state.groupNames.length = 0;
        state.backReferenceNames.length = 0;
        this.regexp_disjunction(state);
        if (state.pos !== state.source.length) {
          if (state.eat(
            41
            /* ) */
          )) {
            state.raise("Unmatched ')'");
          }
          if (state.eat(
            93
            /* [ */
          ) || state.eat(
            125
            /* } */
          )) {
            state.raise("Lone quantifier brackets");
          }
        }
        if (state.maxBackReference > state.numCapturingParens) {
          state.raise("Invalid escape");
        }
        for (var i = 0, list = state.backReferenceNames; i < list.length; i += 1) {
          var name = list[i];
          if (state.groupNames.indexOf(name) === -1) {
            state.raise("Invalid named capture referenced");
          }
        }
      };
      pp$82.regexp_disjunction = function(state) {
        this.regexp_alternative(state);
        while (state.eat(
          124
          /* | */
        )) {
          this.regexp_alternative(state);
        }
        if (this.regexp_eatQuantifier(state, true)) {
          state.raise("Nothing to repeat");
        }
        if (state.eat(
          123
          /* { */
        )) {
          state.raise("Lone quantifier brackets");
        }
      };
      pp$82.regexp_alternative = function(state) {
        while (state.pos < state.source.length && this.regexp_eatTerm(state)) {
        }
      };
      pp$82.regexp_eatTerm = function(state) {
        if (this.regexp_eatAssertion(state)) {
          if (state.lastAssertionIsQuantifiable && this.regexp_eatQuantifier(state)) {
            if (state.switchU) {
              state.raise("Invalid quantifier");
            }
          }
          return true;
        }
        if (state.switchU ? this.regexp_eatAtom(state) : this.regexp_eatExtendedAtom(state)) {
          this.regexp_eatQuantifier(state);
          return true;
        }
        return false;
      };
      pp$82.regexp_eatAssertion = function(state) {
        var start = state.pos;
        state.lastAssertionIsQuantifiable = false;
        if (state.eat(
          94
          /* ^ */
        ) || state.eat(
          36
          /* $ */
        )) {
          return true;
        }
        if (state.eat(
          92
          /* \ */
        )) {
          if (state.eat(
            66
            /* B */
          ) || state.eat(
            98
            /* b */
          )) {
            return true;
          }
          state.pos = start;
        }
        if (state.eat(
          40
          /* ( */
        ) && state.eat(
          63
          /* ? */
        )) {
          var lookbehind = false;
          if (this.options.ecmaVersion >= 9) {
            lookbehind = state.eat(
              60
              /* < */
            );
          }
          if (state.eat(
            61
            /* = */
          ) || state.eat(
            33
            /* ! */
          )) {
            this.regexp_disjunction(state);
            if (!state.eat(
              41
              /* ) */
            )) {
              state.raise("Unterminated group");
            }
            state.lastAssertionIsQuantifiable = !lookbehind;
            return true;
          }
        }
        state.pos = start;
        return false;
      };
      pp$82.regexp_eatQuantifier = function(state, noError) {
        if (noError === void 0)
          noError = false;
        if (this.regexp_eatQuantifierPrefix(state, noError)) {
          state.eat(
            63
            /* ? */
          );
          return true;
        }
        return false;
      };
      pp$82.regexp_eatQuantifierPrefix = function(state, noError) {
        return state.eat(
          42
          /* * */
        ) || state.eat(
          43
          /* + */
        ) || state.eat(
          63
          /* ? */
        ) || this.regexp_eatBracedQuantifier(state, noError);
      };
      pp$82.regexp_eatBracedQuantifier = function(state, noError) {
        var start = state.pos;
        if (state.eat(
          123
          /* { */
        )) {
          var min = 0, max = -1;
          if (this.regexp_eatDecimalDigits(state)) {
            min = state.lastIntValue;
            if (state.eat(
              44
              /* , */
            ) && this.regexp_eatDecimalDigits(state)) {
              max = state.lastIntValue;
            }
            if (state.eat(
              125
              /* } */
            )) {
              if (max !== -1 && max < min && !noError) {
                state.raise("numbers out of order in {} quantifier");
              }
              return true;
            }
          }
          if (state.switchU && !noError) {
            state.raise("Incomplete quantifier");
          }
          state.pos = start;
        }
        return false;
      };
      pp$82.regexp_eatAtom = function(state) {
        return this.regexp_eatPatternCharacters(state) || state.eat(
          46
          /* . */
        ) || this.regexp_eatReverseSolidusAtomEscape(state) || this.regexp_eatCharacterClass(state) || this.regexp_eatUncapturingGroup(state) || this.regexp_eatCapturingGroup(state);
      };
      pp$82.regexp_eatReverseSolidusAtomEscape = function(state) {
        var start = state.pos;
        if (state.eat(
          92
          /* \ */
        )) {
          if (this.regexp_eatAtomEscape(state)) {
            return true;
          }
          state.pos = start;
        }
        return false;
      };
      pp$82.regexp_eatUncapturingGroup = function(state) {
        var start = state.pos;
        if (state.eat(
          40
          /* ( */
        )) {
          if (state.eat(
            63
            /* ? */
          ) && state.eat(
            58
            /* : */
          )) {
            this.regexp_disjunction(state);
            if (state.eat(
              41
              /* ) */
            )) {
              return true;
            }
            state.raise("Unterminated group");
          }
          state.pos = start;
        }
        return false;
      };
      pp$82.regexp_eatCapturingGroup = function(state) {
        if (state.eat(
          40
          /* ( */
        )) {
          if (this.options.ecmaVersion >= 9) {
            this.regexp_groupSpecifier(state);
          } else if (state.current() === 63) {
            state.raise("Invalid group");
          }
          this.regexp_disjunction(state);
          if (state.eat(
            41
            /* ) */
          )) {
            state.numCapturingParens += 1;
            return true;
          }
          state.raise("Unterminated group");
        }
        return false;
      };
      pp$82.regexp_eatExtendedAtom = function(state) {
        return state.eat(
          46
          /* . */
        ) || this.regexp_eatReverseSolidusAtomEscape(state) || this.regexp_eatCharacterClass(state) || this.regexp_eatUncapturingGroup(state) || this.regexp_eatCapturingGroup(state) || this.regexp_eatInvalidBracedQuantifier(state) || this.regexp_eatExtendedPatternCharacter(state);
      };
      pp$82.regexp_eatInvalidBracedQuantifier = function(state) {
        if (this.regexp_eatBracedQuantifier(state, true)) {
          state.raise("Nothing to repeat");
        }
        return false;
      };
      pp$82.regexp_eatSyntaxCharacter = function(state) {
        var ch = state.current();
        if (isSyntaxCharacter2(ch)) {
          state.lastIntValue = ch;
          state.advance();
          return true;
        }
        return false;
      };
      function isSyntaxCharacter2(ch) {
        return ch === 36 || ch >= 40 && ch <= 43 || ch === 46 || ch === 63 || ch >= 91 && ch <= 94 || ch >= 123 && ch <= 125;
      }
      pp$82.regexp_eatPatternCharacters = function(state) {
        var start = state.pos;
        var ch = 0;
        while ((ch = state.current()) !== -1 && !isSyntaxCharacter2(ch)) {
          state.advance();
        }
        return state.pos !== start;
      };
      pp$82.regexp_eatExtendedPatternCharacter = function(state) {
        var ch = state.current();
        if (ch !== -1 && ch !== 36 && !(ch >= 40 && ch <= 43) && ch !== 46 && ch !== 63 && ch !== 91 && ch !== 94 && ch !== 124) {
          state.advance();
          return true;
        }
        return false;
      };
      pp$82.regexp_groupSpecifier = function(state) {
        if (state.eat(
          63
          /* ? */
        )) {
          if (this.regexp_eatGroupName(state)) {
            if (state.groupNames.indexOf(state.lastStringValue) !== -1) {
              state.raise("Duplicate capture group name");
            }
            state.groupNames.push(state.lastStringValue);
            return;
          }
          state.raise("Invalid group");
        }
      };
      pp$82.regexp_eatGroupName = function(state) {
        state.lastStringValue = "";
        if (state.eat(
          60
          /* < */
        )) {
          if (this.regexp_eatRegExpIdentifierName(state) && state.eat(
            62
            /* > */
          )) {
            return true;
          }
          state.raise("Invalid capture group name");
        }
        return false;
      };
      pp$82.regexp_eatRegExpIdentifierName = function(state) {
        state.lastStringValue = "";
        if (this.regexp_eatRegExpIdentifierStart(state)) {
          state.lastStringValue += codePointToString2(state.lastIntValue);
          while (this.regexp_eatRegExpIdentifierPart(state)) {
            state.lastStringValue += codePointToString2(state.lastIntValue);
          }
          return true;
        }
        return false;
      };
      pp$82.regexp_eatRegExpIdentifierStart = function(state) {
        var start = state.pos;
        var ch = state.current();
        state.advance();
        if (ch === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(state)) {
          ch = state.lastIntValue;
        }
        if (isRegExpIdentifierStart2(ch)) {
          state.lastIntValue = ch;
          return true;
        }
        state.pos = start;
        return false;
      };
      function isRegExpIdentifierStart2(ch) {
        return isIdentifierStart2(ch, true) || ch === 36 || ch === 95;
      }
      pp$82.regexp_eatRegExpIdentifierPart = function(state) {
        var start = state.pos;
        var ch = state.current();
        state.advance();
        if (ch === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(state)) {
          ch = state.lastIntValue;
        }
        if (isRegExpIdentifierPart2(ch)) {
          state.lastIntValue = ch;
          return true;
        }
        state.pos = start;
        return false;
      };
      function isRegExpIdentifierPart2(ch) {
        return isIdentifierChar2(ch, true) || ch === 36 || ch === 95 || ch === 8204 || ch === 8205;
      }
      pp$82.regexp_eatAtomEscape = function(state) {
        if (this.regexp_eatBackReference(state) || this.regexp_eatCharacterClassEscape(state) || this.regexp_eatCharacterEscape(state) || state.switchN && this.regexp_eatKGroupName(state)) {
          return true;
        }
        if (state.switchU) {
          if (state.current() === 99) {
            state.raise("Invalid unicode escape");
          }
          state.raise("Invalid escape");
        }
        return false;
      };
      pp$82.regexp_eatBackReference = function(state) {
        var start = state.pos;
        if (this.regexp_eatDecimalEscape(state)) {
          var n2 = state.lastIntValue;
          if (state.switchU) {
            if (n2 > state.maxBackReference) {
              state.maxBackReference = n2;
            }
            return true;
          }
          if (n2 <= state.numCapturingParens) {
            return true;
          }
          state.pos = start;
        }
        return false;
      };
      pp$82.regexp_eatKGroupName = function(state) {
        if (state.eat(
          107
          /* k */
        )) {
          if (this.regexp_eatGroupName(state)) {
            state.backReferenceNames.push(state.lastStringValue);
            return true;
          }
          state.raise("Invalid named reference");
        }
        return false;
      };
      pp$82.regexp_eatCharacterEscape = function(state) {
        return this.regexp_eatControlEscape(state) || this.regexp_eatCControlLetter(state) || this.regexp_eatZero(state) || this.regexp_eatHexEscapeSequence(state) || this.regexp_eatRegExpUnicodeEscapeSequence(state) || !state.switchU && this.regexp_eatLegacyOctalEscapeSequence(state) || this.regexp_eatIdentityEscape(state);
      };
      pp$82.regexp_eatCControlLetter = function(state) {
        var start = state.pos;
        if (state.eat(
          99
          /* c */
        )) {
          if (this.regexp_eatControlLetter(state)) {
            return true;
          }
          state.pos = start;
        }
        return false;
      };
      pp$82.regexp_eatZero = function(state) {
        if (state.current() === 48 && !isDecimalDigit2(state.lookahead())) {
          state.lastIntValue = 0;
          state.advance();
          return true;
        }
        return false;
      };
      pp$82.regexp_eatControlEscape = function(state) {
        var ch = state.current();
        if (ch === 116) {
          state.lastIntValue = 9;
          state.advance();
          return true;
        }
        if (ch === 110) {
          state.lastIntValue = 10;
          state.advance();
          return true;
        }
        if (ch === 118) {
          state.lastIntValue = 11;
          state.advance();
          return true;
        }
        if (ch === 102) {
          state.lastIntValue = 12;
          state.advance();
          return true;
        }
        if (ch === 114) {
          state.lastIntValue = 13;
          state.advance();
          return true;
        }
        return false;
      };
      pp$82.regexp_eatControlLetter = function(state) {
        var ch = state.current();
        if (isControlLetter2(ch)) {
          state.lastIntValue = ch % 32;
          state.advance();
          return true;
        }
        return false;
      };
      function isControlLetter2(ch) {
        return ch >= 65 && ch <= 90 || ch >= 97 && ch <= 122;
      }
      pp$82.regexp_eatRegExpUnicodeEscapeSequence = function(state) {
        var start = state.pos;
        if (state.eat(
          117
          /* u */
        )) {
          if (this.regexp_eatFixedHexDigits(state, 4)) {
            var lead = state.lastIntValue;
            if (state.switchU && lead >= 55296 && lead <= 56319) {
              var leadSurrogateEnd = state.pos;
              if (state.eat(
                92
                /* \ */
              ) && state.eat(
                117
                /* u */
              ) && this.regexp_eatFixedHexDigits(state, 4)) {
                var trail = state.lastIntValue;
                if (trail >= 56320 && trail <= 57343) {
                  state.lastIntValue = (lead - 55296) * 1024 + (trail - 56320) + 65536;
                  return true;
                }
              }
              state.pos = leadSurrogateEnd;
              state.lastIntValue = lead;
            }
            return true;
          }
          if (state.switchU && state.eat(
            123
            /* { */
          ) && this.regexp_eatHexDigits(state) && state.eat(
            125
            /* } */
          ) && isValidUnicode2(state.lastIntValue)) {
            return true;
          }
          if (state.switchU) {
            state.raise("Invalid unicode escape");
          }
          state.pos = start;
        }
        return false;
      };
      function isValidUnicode2(ch) {
        return ch >= 0 && ch <= 1114111;
      }
      pp$82.regexp_eatIdentityEscape = function(state) {
        if (state.switchU) {
          if (this.regexp_eatSyntaxCharacter(state)) {
            return true;
          }
          if (state.eat(
            47
            /* / */
          )) {
            state.lastIntValue = 47;
            return true;
          }
          return false;
        }
        var ch = state.current();
        if (ch !== 99 && (!state.switchN || ch !== 107)) {
          state.lastIntValue = ch;
          state.advance();
          return true;
        }
        return false;
      };
      pp$82.regexp_eatDecimalEscape = function(state) {
        state.lastIntValue = 0;
        var ch = state.current();
        if (ch >= 49 && ch <= 57) {
          do {
            state.lastIntValue = 10 * state.lastIntValue + (ch - 48);
            state.advance();
          } while ((ch = state.current()) >= 48 && ch <= 57);
          return true;
        }
        return false;
      };
      pp$82.regexp_eatCharacterClassEscape = function(state) {
        var ch = state.current();
        if (isCharacterClassEscape2(ch)) {
          state.lastIntValue = -1;
          state.advance();
          return true;
        }
        if (state.switchU && this.options.ecmaVersion >= 9 && (ch === 80 || ch === 112)) {
          state.lastIntValue = -1;
          state.advance();
          if (state.eat(
            123
            /* { */
          ) && this.regexp_eatUnicodePropertyValueExpression(state) && state.eat(
            125
            /* } */
          )) {
            return true;
          }
          state.raise("Invalid property name");
        }
        return false;
      };
      function isCharacterClassEscape2(ch) {
        return ch === 100 || ch === 68 || ch === 115 || ch === 83 || ch === 119 || ch === 87;
      }
      pp$82.regexp_eatUnicodePropertyValueExpression = function(state) {
        var start = state.pos;
        if (this.regexp_eatUnicodePropertyName(state) && state.eat(
          61
          /* = */
        )) {
          var name = state.lastStringValue;
          if (this.regexp_eatUnicodePropertyValue(state)) {
            var value = state.lastStringValue;
            this.regexp_validateUnicodePropertyNameAndValue(state, name, value);
            return true;
          }
        }
        state.pos = start;
        if (this.regexp_eatLoneUnicodePropertyNameOrValue(state)) {
          var nameOrValue = state.lastStringValue;
          this.regexp_validateUnicodePropertyNameOrValue(state, nameOrValue);
          return true;
        }
        return false;
      };
      pp$82.regexp_validateUnicodePropertyNameAndValue = function(state, name, value) {
        if (!has3(state.unicodeProperties.nonBinary, name)) {
          state.raise("Invalid property name");
        }
        if (!state.unicodeProperties.nonBinary[name].test(value)) {
          state.raise("Invalid property value");
        }
      };
      pp$82.regexp_validateUnicodePropertyNameOrValue = function(state, nameOrValue) {
        if (!state.unicodeProperties.binary.test(nameOrValue)) {
          state.raise("Invalid property name");
        }
      };
      pp$82.regexp_eatUnicodePropertyName = function(state) {
        var ch = 0;
        state.lastStringValue = "";
        while (isUnicodePropertyNameCharacter2(ch = state.current())) {
          state.lastStringValue += codePointToString2(ch);
          state.advance();
        }
        return state.lastStringValue !== "";
      };
      function isUnicodePropertyNameCharacter2(ch) {
        return isControlLetter2(ch) || ch === 95;
      }
      pp$82.regexp_eatUnicodePropertyValue = function(state) {
        var ch = 0;
        state.lastStringValue = "";
        while (isUnicodePropertyValueCharacter2(ch = state.current())) {
          state.lastStringValue += codePointToString2(ch);
          state.advance();
        }
        return state.lastStringValue !== "";
      };
      function isUnicodePropertyValueCharacter2(ch) {
        return isUnicodePropertyNameCharacter2(ch) || isDecimalDigit2(ch);
      }
      pp$82.regexp_eatLoneUnicodePropertyNameOrValue = function(state) {
        return this.regexp_eatUnicodePropertyValue(state);
      };
      pp$82.regexp_eatCharacterClass = function(state) {
        if (state.eat(
          91
          /* [ */
        )) {
          state.eat(
            94
            /* ^ */
          );
          this.regexp_classRanges(state);
          if (state.eat(
            93
            /* [ */
          )) {
            return true;
          }
          state.raise("Unterminated character class");
        }
        return false;
      };
      pp$82.regexp_classRanges = function(state) {
        while (this.regexp_eatClassAtom(state)) {
          var left = state.lastIntValue;
          if (state.eat(
            45
            /* - */
          ) && this.regexp_eatClassAtom(state)) {
            var right = state.lastIntValue;
            if (state.switchU && (left === -1 || right === -1)) {
              state.raise("Invalid character class");
            }
            if (left !== -1 && right !== -1 && left > right) {
              state.raise("Range out of order in character class");
            }
          }
        }
      };
      pp$82.regexp_eatClassAtom = function(state) {
        var start = state.pos;
        if (state.eat(
          92
          /* \ */
        )) {
          if (this.regexp_eatClassEscape(state)) {
            return true;
          }
          if (state.switchU) {
            var ch$1 = state.current();
            if (ch$1 === 99 || isOctalDigit2(ch$1)) {
              state.raise("Invalid class escape");
            }
            state.raise("Invalid escape");
          }
          state.pos = start;
        }
        var ch = state.current();
        if (ch !== 93) {
          state.lastIntValue = ch;
          state.advance();
          return true;
        }
        return false;
      };
      pp$82.regexp_eatClassEscape = function(state) {
        var start = state.pos;
        if (state.eat(
          98
          /* b */
        )) {
          state.lastIntValue = 8;
          return true;
        }
        if (state.switchU && state.eat(
          45
          /* - */
        )) {
          state.lastIntValue = 45;
          return true;
        }
        if (!state.switchU && state.eat(
          99
          /* c */
        )) {
          if (this.regexp_eatClassControlLetter(state)) {
            return true;
          }
          state.pos = start;
        }
        return this.regexp_eatCharacterClassEscape(state) || this.regexp_eatCharacterEscape(state);
      };
      pp$82.regexp_eatClassControlLetter = function(state) {
        var ch = state.current();
        if (isDecimalDigit2(ch) || ch === 95) {
          state.lastIntValue = ch % 32;
          state.advance();
          return true;
        }
        return false;
      };
      pp$82.regexp_eatHexEscapeSequence = function(state) {
        var start = state.pos;
        if (state.eat(
          120
          /* x */
        )) {
          if (this.regexp_eatFixedHexDigits(state, 2)) {
            return true;
          }
          if (state.switchU) {
            state.raise("Invalid escape");
          }
          state.pos = start;
        }
        return false;
      };
      pp$82.regexp_eatDecimalDigits = function(state) {
        var start = state.pos;
        var ch = 0;
        state.lastIntValue = 0;
        while (isDecimalDigit2(ch = state.current())) {
          state.lastIntValue = 10 * state.lastIntValue + (ch - 48);
          state.advance();
        }
        return state.pos !== start;
      };
      function isDecimalDigit2(ch) {
        return ch >= 48 && ch <= 57;
      }
      pp$82.regexp_eatHexDigits = function(state) {
        var start = state.pos;
        var ch = 0;
        state.lastIntValue = 0;
        while (isHexDigit2(ch = state.current())) {
          state.lastIntValue = 16 * state.lastIntValue + hexToInt2(ch);
          state.advance();
        }
        return state.pos !== start;
      };
      function isHexDigit2(ch) {
        return ch >= 48 && ch <= 57 || ch >= 65 && ch <= 70 || ch >= 97 && ch <= 102;
      }
      function hexToInt2(ch) {
        if (ch >= 65 && ch <= 70) {
          return 10 + (ch - 65);
        }
        if (ch >= 97 && ch <= 102) {
          return 10 + (ch - 97);
        }
        return ch - 48;
      }
      pp$82.regexp_eatLegacyOctalEscapeSequence = function(state) {
        if (this.regexp_eatOctalDigit(state)) {
          var n1 = state.lastIntValue;
          if (this.regexp_eatOctalDigit(state)) {
            var n2 = state.lastIntValue;
            if (n1 <= 3 && this.regexp_eatOctalDigit(state)) {
              state.lastIntValue = n1 * 64 + n2 * 8 + state.lastIntValue;
            } else {
              state.lastIntValue = n1 * 8 + n2;
            }
          } else {
            state.lastIntValue = n1;
          }
          return true;
        }
        return false;
      };
      pp$82.regexp_eatOctalDigit = function(state) {
        var ch = state.current();
        if (isOctalDigit2(ch)) {
          state.lastIntValue = ch - 48;
          state.advance();
          return true;
        }
        state.lastIntValue = 0;
        return false;
      };
      function isOctalDigit2(ch) {
        return ch >= 48 && ch <= 55;
      }
      pp$82.regexp_eatFixedHexDigits = function(state, length3) {
        var start = state.pos;
        state.lastIntValue = 0;
        for (var i = 0; i < length3; ++i) {
          var ch = state.current();
          if (!isHexDigit2(ch)) {
            state.pos = start;
            return false;
          }
          state.lastIntValue = 16 * state.lastIntValue + hexToInt2(ch);
          state.advance();
        }
        return true;
      };
      var Token3 = function Token4(p) {
        this.type = p.type;
        this.value = p.value;
        this.start = p.start;
        this.end = p.end;
        if (p.options.locations) {
          this.loc = new SourceLocation3(p, p.startLoc, p.endLoc);
        }
        if (p.options.ranges) {
          this.range = [p.start, p.end];
        }
      };
      var pp$92 = Parser4.prototype;
      pp$92.next = function() {
        if (this.options.onToken) {
          this.options.onToken(new Token3(this));
        }
        this.lastTokEnd = this.end;
        this.lastTokStart = this.start;
        this.lastTokEndLoc = this.endLoc;
        this.lastTokStartLoc = this.startLoc;
        this.nextToken();
      };
      pp$92.getToken = function() {
        this.next();
        return new Token3(this);
      };
      if (typeof Symbol !== "undefined") {
        pp$92[Symbol.iterator] = function() {
          var this$1 = this;
          return {
            next: function() {
              var token = this$1.getToken();
              return {
                done: token.type === types3.eof,
                value: token
              };
            }
          };
        };
      }
      pp$92.curContext = function() {
        return this.context[this.context.length - 1];
      };
      pp$92.nextToken = function() {
        var curContext = this.curContext();
        if (!curContext || !curContext.preserveSpace) {
          this.skipSpace();
        }
        this.start = this.pos;
        if (this.options.locations) {
          this.startLoc = this.curPosition();
        }
        if (this.pos >= this.input.length) {
          return this.finishToken(types3.eof);
        }
        if (curContext.override) {
          return curContext.override(this);
        } else {
          this.readToken(this.fullCharCodeAtPos());
        }
      };
      pp$92.readToken = function(code) {
        if (isIdentifierStart2(code, this.options.ecmaVersion >= 6) || code === 92) {
          return this.readWord();
        }
        return this.getTokenFromCode(code);
      };
      pp$92.fullCharCodeAtPos = function() {
        var code = this.input.charCodeAt(this.pos);
        if (code <= 55295 || code >= 57344) {
          return code;
        }
        var next = this.input.charCodeAt(this.pos + 1);
        return (code << 10) + next - 56613888;
      };
      pp$92.skipBlockComment = function() {
        var startLoc = this.options.onComment && this.curPosition();
        var start = this.pos, end = this.input.indexOf("*/", this.pos += 2);
        if (end === -1) {
          this.raise(this.pos - 2, "Unterminated comment");
        }
        this.pos = end + 2;
        if (this.options.locations) {
          lineBreakG2.lastIndex = start;
          var match;
          while ((match = lineBreakG2.exec(this.input)) && match.index < this.pos) {
            ++this.curLine;
            this.lineStart = match.index + match[0].length;
          }
        }
        if (this.options.onComment) {
          this.options.onComment(
            true,
            this.input.slice(start + 2, end),
            start,
            this.pos,
            startLoc,
            this.curPosition()
          );
        }
      };
      pp$92.skipLineComment = function(startSkip) {
        var start = this.pos;
        var startLoc = this.options.onComment && this.curPosition();
        var ch = this.input.charCodeAt(this.pos += startSkip);
        while (this.pos < this.input.length && !isNewLine2(ch)) {
          ch = this.input.charCodeAt(++this.pos);
        }
        if (this.options.onComment) {
          this.options.onComment(
            false,
            this.input.slice(start + startSkip, this.pos),
            start,
            this.pos,
            startLoc,
            this.curPosition()
          );
        }
      };
      pp$92.skipSpace = function() {
        loop:
          while (this.pos < this.input.length) {
            var ch = this.input.charCodeAt(this.pos);
            switch (ch) {
              case 32:
              case 160:
                ++this.pos;
                break;
              case 13:
                if (this.input.charCodeAt(this.pos + 1) === 10) {
                  ++this.pos;
                }
              case 10:
              case 8232:
              case 8233:
                ++this.pos;
                if (this.options.locations) {
                  ++this.curLine;
                  this.lineStart = this.pos;
                }
                break;
              case 47:
                switch (this.input.charCodeAt(this.pos + 1)) {
                  case 42:
                    this.skipBlockComment();
                    break;
                  case 47:
                    this.skipLineComment(2);
                    break;
                  default:
                    break loop;
                }
                break;
              default:
                if (ch > 8 && ch < 14 || ch >= 5760 && nonASCIIwhitespace2.test(String.fromCharCode(ch))) {
                  ++this.pos;
                } else {
                  break loop;
                }
            }
          }
      };
      pp$92.finishToken = function(type, val) {
        this.end = this.pos;
        if (this.options.locations) {
          this.endLoc = this.curPosition();
        }
        var prevType = this.type;
        this.type = type;
        this.value = val;
        this.updateContext(prevType);
      };
      pp$92.readToken_dot = function() {
        var next = this.input.charCodeAt(this.pos + 1);
        if (next >= 48 && next <= 57) {
          return this.readNumber(true);
        }
        var next2 = this.input.charCodeAt(this.pos + 2);
        if (this.options.ecmaVersion >= 6 && next === 46 && next2 === 46) {
          this.pos += 3;
          return this.finishToken(types3.ellipsis);
        } else {
          ++this.pos;
          return this.finishToken(types3.dot);
        }
      };
      pp$92.readToken_slash = function() {
        var next = this.input.charCodeAt(this.pos + 1);
        if (this.exprAllowed) {
          ++this.pos;
          return this.readRegexp();
        }
        if (next === 61) {
          return this.finishOp(types3.assign, 2);
        }
        return this.finishOp(types3.slash, 1);
      };
      pp$92.readToken_mult_modulo_exp = function(code) {
        var next = this.input.charCodeAt(this.pos + 1);
        var size = 1;
        var tokentype = code === 42 ? types3.star : types3.modulo;
        if (this.options.ecmaVersion >= 7 && code === 42 && next === 42) {
          ++size;
          tokentype = types3.starstar;
          next = this.input.charCodeAt(this.pos + 2);
        }
        if (next === 61) {
          return this.finishOp(types3.assign, size + 1);
        }
        return this.finishOp(tokentype, size);
      };
      pp$92.readToken_pipe_amp = function(code) {
        var next = this.input.charCodeAt(this.pos + 1);
        if (next === code) {
          return this.finishOp(code === 124 ? types3.logicalOR : types3.logicalAND, 2);
        }
        if (next === 61) {
          return this.finishOp(types3.assign, 2);
        }
        return this.finishOp(code === 124 ? types3.bitwiseOR : types3.bitwiseAND, 1);
      };
      pp$92.readToken_caret = function() {
        var next = this.input.charCodeAt(this.pos + 1);
        if (next === 61) {
          return this.finishOp(types3.assign, 2);
        }
        return this.finishOp(types3.bitwiseXOR, 1);
      };
      pp$92.readToken_plus_min = function(code) {
        var next = this.input.charCodeAt(this.pos + 1);
        if (next === code) {
          if (next === 45 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 62 && (this.lastTokEnd === 0 || lineBreak2.test(this.input.slice(this.lastTokEnd, this.pos)))) {
            this.skipLineComment(3);
            this.skipSpace();
            return this.nextToken();
          }
          return this.finishOp(types3.incDec, 2);
        }
        if (next === 61) {
          return this.finishOp(types3.assign, 2);
        }
        return this.finishOp(types3.plusMin, 1);
      };
      pp$92.readToken_lt_gt = function(code) {
        var next = this.input.charCodeAt(this.pos + 1);
        var size = 1;
        if (next === code) {
          size = code === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2;
          if (this.input.charCodeAt(this.pos + size) === 61) {
            return this.finishOp(types3.assign, size + 1);
          }
          return this.finishOp(types3.bitShift, size);
        }
        if (next === 33 && code === 60 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 45 && this.input.charCodeAt(this.pos + 3) === 45) {
          this.skipLineComment(4);
          this.skipSpace();
          return this.nextToken();
        }
        if (next === 61) {
          size = 2;
        }
        return this.finishOp(types3.relational, size);
      };
      pp$92.readToken_eq_excl = function(code) {
        var next = this.input.charCodeAt(this.pos + 1);
        if (next === 61) {
          return this.finishOp(types3.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2);
        }
        if (code === 61 && next === 62 && this.options.ecmaVersion >= 6) {
          this.pos += 2;
          return this.finishToken(types3.arrow);
        }
        return this.finishOp(code === 61 ? types3.eq : types3.prefix, 1);
      };
      pp$92.getTokenFromCode = function(code) {
        switch (code) {
          case 46:
            return this.readToken_dot();
          case 40:
            ++this.pos;
            return this.finishToken(types3.parenL);
          case 41:
            ++this.pos;
            return this.finishToken(types3.parenR);
          case 59:
            ++this.pos;
            return this.finishToken(types3.semi);
          case 44:
            ++this.pos;
            return this.finishToken(types3.comma);
          case 91:
            ++this.pos;
            return this.finishToken(types3.bracketL);
          case 93:
            ++this.pos;
            return this.finishToken(types3.bracketR);
          case 123:
            ++this.pos;
            return this.finishToken(types3.braceL);
          case 125:
            ++this.pos;
            return this.finishToken(types3.braceR);
          case 58:
            ++this.pos;
            return this.finishToken(types3.colon);
          case 63:
            ++this.pos;
            return this.finishToken(types3.question);
          case 96:
            if (this.options.ecmaVersion < 6) {
              break;
            }
            ++this.pos;
            return this.finishToken(types3.backQuote);
          case 48:
            var next = this.input.charCodeAt(this.pos + 1);
            if (next === 120 || next === 88) {
              return this.readRadixNumber(16);
            }
            if (this.options.ecmaVersion >= 6) {
              if (next === 111 || next === 79) {
                return this.readRadixNumber(8);
              }
              if (next === 98 || next === 66) {
                return this.readRadixNumber(2);
              }
            }
          case 49:
          case 50:
          case 51:
          case 52:
          case 53:
          case 54:
          case 55:
          case 56:
          case 57:
            return this.readNumber(false);
          case 34:
          case 39:
            return this.readString(code);
          case 47:
            return this.readToken_slash();
          case 37:
          case 42:
            return this.readToken_mult_modulo_exp(code);
          case 124:
          case 38:
            return this.readToken_pipe_amp(code);
          case 94:
            return this.readToken_caret();
          case 43:
          case 45:
            return this.readToken_plus_min(code);
          case 60:
          case 62:
            return this.readToken_lt_gt(code);
          case 61:
          case 33:
            return this.readToken_eq_excl(code);
          case 126:
            return this.finishOp(types3.prefix, 1);
        }
        this.raise(this.pos, "Unexpected character '" + codePointToString$12(code) + "'");
      };
      pp$92.finishOp = function(type, size) {
        var str = this.input.slice(this.pos, this.pos + size);
        this.pos += size;
        return this.finishToken(type, str);
      };
      pp$92.readRegexp = function() {
        var escaped, inClass, start = this.pos;
        for (; ; ) {
          if (this.pos >= this.input.length) {
            this.raise(start, "Unterminated regular expression");
          }
          var ch = this.input.charAt(this.pos);
          if (lineBreak2.test(ch)) {
            this.raise(start, "Unterminated regular expression");
          }
          if (!escaped) {
            if (ch === "[") {
              inClass = true;
            } else if (ch === "]" && inClass) {
              inClass = false;
            } else if (ch === "/" && !inClass) {
              break;
            }
            escaped = ch === "\\";
          } else {
            escaped = false;
          }
          ++this.pos;
        }
        var pattern = this.input.slice(start, this.pos);
        ++this.pos;
        var flagsStart = this.pos;
        var flags = this.readWord1();
        if (this.containsEsc) {
          this.unexpected(flagsStart);
        }
        var state = this.regexpState || (this.regexpState = new RegExpValidationState3(this));
        state.reset(start, pattern, flags);
        this.validateRegExpFlags(state);
        this.validateRegExpPattern(state);
        var value = null;
        try {
          value = new RegExp(pattern, flags);
        } catch (e) {
        }
        return this.finishToken(types3.regexp, { pattern, flags, value });
      };
      pp$92.readInt = function(radix, len) {
        var start = this.pos, total = 0;
        for (var i = 0, e = len == null ? Infinity : len; i < e; ++i) {
          var code = this.input.charCodeAt(this.pos), val = void 0;
          if (code >= 97) {
            val = code - 97 + 10;
          } else if (code >= 65) {
            val = code - 65 + 10;
          } else if (code >= 48 && code <= 57) {
            val = code - 48;
          } else {
            val = Infinity;
          }
          if (val >= radix) {
            break;
          }
          ++this.pos;
          total = total * radix + val;
        }
        if (this.pos === start || len != null && this.pos - start !== len) {
          return null;
        }
        return total;
      };
      pp$92.readRadixNumber = function(radix) {
        var start = this.pos;
        this.pos += 2;
        var val = this.readInt(radix);
        if (val == null) {
          this.raise(this.start + 2, "Expected number in radix " + radix);
        }
        if (this.options.ecmaVersion >= 11 && this.input.charCodeAt(this.pos) === 110) {
          val = typeof BigInt !== "undefined" ? BigInt(this.input.slice(start, this.pos)) : null;
          ++this.pos;
        } else if (isIdentifierStart2(this.fullCharCodeAtPos())) {
          this.raise(this.pos, "Identifier directly after number");
        }
        return this.finishToken(types3.num, val);
      };
      pp$92.readNumber = function(startsWithDot) {
        var start = this.pos;
        if (!startsWithDot && this.readInt(10) === null) {
          this.raise(start, "Invalid number");
        }
        var octal = this.pos - start >= 2 && this.input.charCodeAt(start) === 48;
        if (octal && this.strict) {
          this.raise(start, "Invalid number");
        }
        if (octal && /[89]/.test(this.input.slice(start, this.pos))) {
          octal = false;
        }
        var next = this.input.charCodeAt(this.pos);
        if (!octal && !startsWithDot && this.options.ecmaVersion >= 11 && next === 110) {
          var str$1 = this.input.slice(start, this.pos);
          var val$1 = typeof BigInt !== "undefined" ? BigInt(str$1) : null;
          ++this.pos;
          if (isIdentifierStart2(this.fullCharCodeAtPos())) {
            this.raise(this.pos, "Identifier directly after number");
          }
          return this.finishToken(types3.num, val$1);
        }
        if (next === 46 && !octal) {
          ++this.pos;
          this.readInt(10);
          next = this.input.charCodeAt(this.pos);
        }
        if ((next === 69 || next === 101) && !octal) {
          next = this.input.charCodeAt(++this.pos);
          if (next === 43 || next === 45) {
            ++this.pos;
          }
          if (this.readInt(10) === null) {
            this.raise(start, "Invalid number");
          }
        }
        if (isIdentifierStart2(this.fullCharCodeAtPos())) {
          this.raise(this.pos, "Identifier directly after number");
        }
        var str = this.input.slice(start, this.pos);
        var val = octal ? parseInt(str, 8) : parseFloat(str);
        return this.finishToken(types3.num, val);
      };
      pp$92.readCodePoint = function() {
        var ch = this.input.charCodeAt(this.pos), code;
        if (ch === 123) {
          if (this.options.ecmaVersion < 6) {
            this.unexpected();
          }
          var codePos = ++this.pos;
          code = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos);
          ++this.pos;
          if (code > 1114111) {
            this.invalidStringToken(codePos, "Code point out of bounds");
          }
        } else {
          code = this.readHexChar(4);
        }
        return code;
      };
      function codePointToString$12(code) {
        if (code <= 65535) {
          return String.fromCharCode(code);
        }
        code -= 65536;
        return String.fromCharCode((code >> 10) + 55296, (code & 1023) + 56320);
      }
      pp$92.readString = function(quote) {
        var out = "", chunkStart = ++this.pos;
        for (; ; ) {
          if (this.pos >= this.input.length) {
            this.raise(this.start, "Unterminated string constant");
          }
          var ch = this.input.charCodeAt(this.pos);
          if (ch === quote) {
            break;
          }
          if (ch === 92) {
            out += this.input.slice(chunkStart, this.pos);
            out += this.readEscapedChar(false);
            chunkStart = this.pos;
          } else {
            if (isNewLine2(ch, this.options.ecmaVersion >= 10)) {
              this.raise(this.start, "Unterminated string constant");
            }
            ++this.pos;
          }
        }
        out += this.input.slice(chunkStart, this.pos++);
        return this.finishToken(types3.string, out);
      };
      var INVALID_TEMPLATE_ESCAPE_ERROR2 = {};
      pp$92.tryReadTemplateToken = function() {
        this.inTemplateElement = true;
        try {
          this.readTmplToken();
        } catch (err) {
          if (err === INVALID_TEMPLATE_ESCAPE_ERROR2) {
            this.readInvalidTemplateToken();
          } else {
            throw err;
          }
        }
        this.inTemplateElement = false;
      };
      pp$92.invalidStringToken = function(position, message) {
        if (this.inTemplateElement && this.options.ecmaVersion >= 9) {
          throw INVALID_TEMPLATE_ESCAPE_ERROR2;
        } else {
          this.raise(position, message);
        }
      };
      pp$92.readTmplToken = function() {
        var out = "", chunkStart = this.pos;
        for (; ; ) {
          if (this.pos >= this.input.length) {
            this.raise(this.start, "Unterminated template");
          }
          var ch = this.input.charCodeAt(this.pos);
          if (ch === 96 || ch === 36 && this.input.charCodeAt(this.pos + 1) === 123) {
            if (this.pos === this.start && (this.type === types3.template || this.type === types3.invalidTemplate)) {
              if (ch === 36) {
                this.pos += 2;
                return this.finishToken(types3.dollarBraceL);
              } else {
                ++this.pos;
                return this.finishToken(types3.backQuote);
              }
            }
            out += this.input.slice(chunkStart, this.pos);
            return this.finishToken(types3.template, out);
          }
          if (ch === 92) {
            out += this.input.slice(chunkStart, this.pos);
            out += this.readEscapedChar(true);
            chunkStart = this.pos;
          } else if (isNewLine2(ch)) {
            out += this.input.slice(chunkStart, this.pos);
            ++this.pos;
            switch (ch) {
              case 13:
                if (this.input.charCodeAt(this.pos) === 10) {
                  ++this.pos;
                }
              case 10:
                out += "\n";
                break;
              default:
                out += String.fromCharCode(ch);
                break;
            }
            if (this.options.locations) {
              ++this.curLine;
              this.lineStart = this.pos;
            }
            chunkStart = this.pos;
          } else {
            ++this.pos;
          }
        }
      };
      pp$92.readInvalidTemplateToken = function() {
        for (; this.pos < this.input.length; this.pos++) {
          switch (this.input[this.pos]) {
            case "\\":
              ++this.pos;
              break;
            case "$":
              if (this.input[this.pos + 1] !== "{") {
                break;
              }
            case "`":
              return this.finishToken(types3.invalidTemplate, this.input.slice(this.start, this.pos));
          }
        }
        this.raise(this.start, "Unterminated template");
      };
      pp$92.readEscapedChar = function(inTemplate) {
        var ch = this.input.charCodeAt(++this.pos);
        ++this.pos;
        switch (ch) {
          case 110:
            return "\n";
          case 114:
            return "\r";
          case 120:
            return String.fromCharCode(this.readHexChar(2));
          case 117:
            return codePointToString$12(this.readCodePoint());
          case 116:
            return "	";
          case 98:
            return "\b";
          case 118:
            return "\v";
          case 102:
            return "\f";
          case 13:
            if (this.input.charCodeAt(this.pos) === 10) {
              ++this.pos;
            }
          case 10:
            if (this.options.locations) {
              this.lineStart = this.pos;
              ++this.curLine;
            }
            return "";
          default:
            if (ch >= 48 && ch <= 55) {
              var octalStr = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0];
              var octal = parseInt(octalStr, 8);
              if (octal > 255) {
                octalStr = octalStr.slice(0, -1);
                octal = parseInt(octalStr, 8);
              }
              this.pos += octalStr.length - 1;
              ch = this.input.charCodeAt(this.pos);
              if ((octalStr !== "0" || ch === 56 || ch === 57) && (this.strict || inTemplate)) {
                this.invalidStringToken(
                  this.pos - 1 - octalStr.length,
                  inTemplate ? "Octal literal in template string" : "Octal literal in strict mode"
                );
              }
              return String.fromCharCode(octal);
            }
            if (isNewLine2(ch)) {
              return "";
            }
            return String.fromCharCode(ch);
        }
      };
      pp$92.readHexChar = function(len) {
        var codePos = this.pos;
        var n2 = this.readInt(16, len);
        if (n2 === null) {
          this.invalidStringToken(codePos, "Bad character escape sequence");
        }
        return n2;
      };
      pp$92.readWord1 = function() {
        this.containsEsc = false;
        var word = "", first = true, chunkStart = this.pos;
        var astral = this.options.ecmaVersion >= 6;
        while (this.pos < this.input.length) {
          var ch = this.fullCharCodeAtPos();
          if (isIdentifierChar2(ch, astral)) {
            this.pos += ch <= 65535 ? 1 : 2;
          } else if (ch === 92) {
            this.containsEsc = true;
            word += this.input.slice(chunkStart, this.pos);
            var escStart = this.pos;
            if (this.input.charCodeAt(++this.pos) !== 117) {
              this.invalidStringToken(this.pos, "Expecting Unicode escape sequence \\uXXXX");
            }
            ++this.pos;
            var esc = this.readCodePoint();
            if (!(first ? isIdentifierStart2 : isIdentifierChar2)(esc, astral)) {
              this.invalidStringToken(escStart, "Invalid Unicode escape");
            }
            word += codePointToString$12(esc);
            chunkStart = this.pos;
          } else {
            break;
          }
          first = false;
        }
        return word + this.input.slice(chunkStart, this.pos);
      };
      pp$92.readWord = function() {
        var word = this.readWord1();
        var type = types3.name;
        if (this.keywords.test(word)) {
          if (this.containsEsc) {
            this.raiseRecoverable(this.start, "Escape sequence in keyword " + word);
          }
          type = keywords$12[word];
        }
        return this.finishToken(type, word);
      };
      var version3 = "6.4.2";
      Parser4.acorn = {
        Parser: Parser4,
        version: version3,
        defaultOptions: defaultOptions2,
        Position: Position3,
        SourceLocation: SourceLocation3,
        getLineInfo: getLineInfo2,
        Node: Node5,
        TokenType: TokenType3,
        tokTypes: types3,
        keywordTypes: keywords$12,
        TokContext: TokContext3,
        tokContexts: types$12,
        isIdentifierChar: isIdentifierChar2,
        isIdentifierStart: isIdentifierStart2,
        Token: Token3,
        isNewLine: isNewLine2,
        lineBreak: lineBreak2,
        lineBreakG: lineBreakG2,
        nonASCIIwhitespace: nonASCIIwhitespace2
      };
      function parse4(input, options) {
        return Parser4.parse(input, options);
      }
      function parseExpressionAt2(input, pos, options) {
        return Parser4.parseExpressionAt(input, pos, options);
      }
      function tokenizer2(input, options) {
        return Parser4.tokenizer(input, options);
      }
      exports2.Node = Node5;
      exports2.Parser = Parser4;
      exports2.Position = Position3;
      exports2.SourceLocation = SourceLocation3;
      exports2.TokContext = TokContext3;
      exports2.Token = Token3;
      exports2.TokenType = TokenType3;
      exports2.defaultOptions = defaultOptions2;
      exports2.getLineInfo = getLineInfo2;
      exports2.isIdentifierChar = isIdentifierChar2;
      exports2.isIdentifierStart = isIdentifierStart2;
      exports2.isNewLine = isNewLine2;
      exports2.keywordTypes = keywords$12;
      exports2.lineBreak = lineBreak2;
      exports2.lineBreakG = lineBreakG2;
      exports2.nonASCIIwhitespace = nonASCIIwhitespace2;
      exports2.parse = parse4;
      exports2.parseExpressionAt = parseExpressionAt2;
      exports2.tokContexts = types$12;
      exports2.tokTypes = types3;
      exports2.tokenizer = tokenizer2;
      exports2.version = version3;
      Object.defineProperty(exports2, "__esModule", { value: true });
    });
  }
});

// node_modules/acorn-jsx/xhtml.js
var require_xhtml = __commonJS({
  "node_modules/acorn-jsx/xhtml.js"(exports, module) {
    module.exports = {
      quot: '"',
      amp: "&",
      apos: "'",
      lt: "<",
      gt: ">",
      nbsp: "\xA0",
      iexcl: "\xA1",
      cent: "\xA2",
      pound: "\xA3",
      curren: "\xA4",
      yen: "\xA5",
      brvbar: "\xA6",
      sect: "\xA7",
      uml: "\xA8",
      copy: "\xA9",
      ordf: "\xAA",
      laquo: "\xAB",
      not: "\xAC",
      shy: "\xAD",
      reg: "\xAE",
      macr: "\xAF",
      deg: "\xB0",
      plusmn: "\xB1",
      sup2: "\xB2",
      sup3: "\xB3",
      acute: "\xB4",
      micro: "\xB5",
      para: "\xB6",
      middot: "\xB7",
      cedil: "\xB8",
      sup1: "\xB9",
      ordm: "\xBA",
      raquo: "\xBB",
      frac14: "\xBC",
      frac12: "\xBD",
      frac34: "\xBE",
      iquest: "\xBF",
      Agrave: "\xC0",
      Aacute: "\xC1",
      Acirc: "\xC2",
      Atilde: "\xC3",
      Auml: "\xC4",
      Aring: "\xC5",
      AElig: "\xC6",
      Ccedil: "\xC7",
      Egrave: "\xC8",
      Eacute: "\xC9",
      Ecirc: "\xCA",
      Euml: "\xCB",
      Igrave: "\xCC",
      Iacute: "\xCD",
      Icirc: "\xCE",
      Iuml: "\xCF",
      ETH: "\xD0",
      Ntilde: "\xD1",
      Ograve: "\xD2",
      Oacute: "\xD3",
      Ocirc: "\xD4",
      Otilde: "\xD5",
      Ouml: "\xD6",
      times: "\xD7",
      Oslash: "\xD8",
      Ugrave: "\xD9",
      Uacute: "\xDA",
      Ucirc: "\xDB",
      Uuml: "\xDC",
      Yacute: "\xDD",
      THORN: "\xDE",
      szlig: "\xDF",
      agrave: "\xE0",
      aacute: "\xE1",
      acirc: "\xE2",
      atilde: "\xE3",
      auml: "\xE4",
      aring: "\xE5",
      aelig: "\xE6",
      ccedil: "\xE7",
      egrave: "\xE8",
      eacute: "\xE9",
      ecirc: "\xEA",
      euml: "\xEB",
      igrave: "\xEC",
      iacute: "\xED",
      icirc: "\xEE",
      iuml: "\xEF",
      eth: "\xF0",
      ntilde: "\xF1",
      ograve: "\xF2",
      oacute: "\xF3",
      ocirc: "\xF4",
      otilde: "\xF5",
      ouml: "\xF6",
      divide: "\xF7",
      oslash: "\xF8",
      ugrave: "\xF9",
      uacute: "\xFA",
      ucirc: "\xFB",
      uuml: "\xFC",
      yacute: "\xFD",
      thorn: "\xFE",
      yuml: "\xFF",
      OElig: "\u0152",
      oelig: "\u0153",
      Scaron: "\u0160",
      scaron: "\u0161",
      Yuml: "\u0178",
      fnof: "\u0192",
      circ: "\u02C6",
      tilde: "\u02DC",
      Alpha: "\u0391",
      Beta: "\u0392",
      Gamma: "\u0393",
      Delta: "\u0394",
      Epsilon: "\u0395",
      Zeta: "\u0396",
      Eta: "\u0397",
      Theta: "\u0398",
      Iota: "\u0399",
      Kappa: "\u039A",
      Lambda: "\u039B",
      Mu: "\u039C",
      Nu: "\u039D",
      Xi: "\u039E",
      Omicron: "\u039F",
      Pi: "\u03A0",
      Rho: "\u03A1",
      Sigma: "\u03A3",
      Tau: "\u03A4",
      Upsilon: "\u03A5",
      Phi: "\u03A6",
      Chi: "\u03A7",
      Psi: "\u03A8",
      Omega: "\u03A9",
      alpha: "\u03B1",
      beta: "\u03B2",
      gamma: "\u03B3",
      delta: "\u03B4",
      epsilon: "\u03B5",
      zeta: "\u03B6",
      eta: "\u03B7",
      theta: "\u03B8",
      iota: "\u03B9",
      kappa: "\u03BA",
      lambda: "\u03BB",
      mu: "\u03BC",
      nu: "\u03BD",
      xi: "\u03BE",
      omicron: "\u03BF",
      pi: "\u03C0",
      rho: "\u03C1",
      sigmaf: "\u03C2",
      sigma: "\u03C3",
      tau: "\u03C4",
      upsilon: "\u03C5",
      phi: "\u03C6",
      chi: "\u03C7",
      psi: "\u03C8",
      omega: "\u03C9",
      thetasym: "\u03D1",
      upsih: "\u03D2",
      piv: "\u03D6",
      ensp: "\u2002",
      emsp: "\u2003",
      thinsp: "\u2009",
      zwnj: "\u200C",
      zwj: "\u200D",
      lrm: "\u200E",
      rlm: "\u200F",
      ndash: "\u2013",
      mdash: "\u2014",
      lsquo: "\u2018",
      rsquo: "\u2019",
      sbquo: "\u201A",
      ldquo: "\u201C",
      rdquo: "\u201D",
      bdquo: "\u201E",
      dagger: "\u2020",
      Dagger: "\u2021",
      bull: "\u2022",
      hellip: "\u2026",
      permil: "\u2030",
      prime: "\u2032",
      Prime: "\u2033",
      lsaquo: "\u2039",
      rsaquo: "\u203A",
      oline: "\u203E",
      frasl: "\u2044",
      euro: "\u20AC",
      image: "\u2111",
      weierp: "\u2118",
      real: "\u211C",
      trade: "\u2122",
      alefsym: "\u2135",
      larr: "\u2190",
      uarr: "\u2191",
      rarr: "\u2192",
      darr: "\u2193",
      harr: "\u2194",
      crarr: "\u21B5",
      lArr: "\u21D0",
      uArr: "\u21D1",
      rArr: "\u21D2",
      dArr: "\u21D3",
      hArr: "\u21D4",
      forall: "\u2200",
      part: "\u2202",
      exist: "\u2203",
      empty: "\u2205",
      nabla: "\u2207",
      isin: "\u2208",
      notin: "\u2209",
      ni: "\u220B",
      prod: "\u220F",
      sum: "\u2211",
      minus: "\u2212",
      lowast: "\u2217",
      radic: "\u221A",
      prop: "\u221D",
      infin: "\u221E",
      ang: "\u2220",
      and: "\u2227",
      or: "\u2228",
      cap: "\u2229",
      cup: "\u222A",
      "int": "\u222B",
      there4: "\u2234",
      sim: "\u223C",
      cong: "\u2245",
      asymp: "\u2248",
      ne: "\u2260",
      equiv: "\u2261",
      le: "\u2264",
      ge: "\u2265",
      sub: "\u2282",
      sup: "\u2283",
      nsub: "\u2284",
      sube: "\u2286",
      supe: "\u2287",
      oplus: "\u2295",
      otimes: "\u2297",
      perp: "\u22A5",
      sdot: "\u22C5",
      lceil: "\u2308",
      rceil: "\u2309",
      lfloor: "\u230A",
      rfloor: "\u230B",
      lang: "\u2329",
      rang: "\u232A",
      loz: "\u25CA",
      spades: "\u2660",
      clubs: "\u2663",
      hearts: "\u2665",
      diams: "\u2666"
    };
  }
});

// node_modules/acorn-jsx/index.js
var require_acorn_jsx = __commonJS({
  "node_modules/acorn-jsx/index.js"(exports, module) {
    "use strict";
    var XHTMLEntities = require_xhtml();
    var hexNumber = /^[\da-fA-F]+$/;
    var decimalNumber = /^\d+$/;
    var acornJsxMap = /* @__PURE__ */ new WeakMap();
    function getJsxTokens(acorn) {
      acorn = acorn.Parser.acorn || acorn;
      let acornJsx2 = acornJsxMap.get(acorn);
      if (!acornJsx2) {
        const tt = acorn.tokTypes;
        const TokContext3 = acorn.TokContext;
        const TokenType3 = acorn.TokenType;
        const tc_oTag = new TokContext3("<tag", false);
        const tc_cTag = new TokContext3("</tag", false);
        const tc_expr = new TokContext3("<tag>...</tag>", true, true);
        const tokContexts = {
          tc_oTag,
          tc_cTag,
          tc_expr
        };
        const tokTypes = {
          jsxName: new TokenType3("jsxName"),
          jsxText: new TokenType3("jsxText", { beforeExpr: true }),
          jsxTagStart: new TokenType3("jsxTagStart", { startsExpr: true }),
          jsxTagEnd: new TokenType3("jsxTagEnd")
        };
        tokTypes.jsxTagStart.updateContext = function() {
          this.context.push(tc_expr);
          this.context.push(tc_oTag);
          this.exprAllowed = false;
        };
        tokTypes.jsxTagEnd.updateContext = function(prevType) {
          let out = this.context.pop();
          if (out === tc_oTag && prevType === tt.slash || out === tc_cTag) {
            this.context.pop();
            this.exprAllowed = this.curContext() === tc_expr;
          } else {
            this.exprAllowed = true;
          }
        };
        acornJsx2 = { tokContexts, tokTypes };
        acornJsxMap.set(acorn, acornJsx2);
      }
      return acornJsx2;
    }
    function getQualifiedJSXName(object) {
      if (!object)
        return object;
      if (object.type === "JSXIdentifier")
        return object.name;
      if (object.type === "JSXNamespacedName")
        return object.namespace.name + ":" + object.name.name;
      if (object.type === "JSXMemberExpression")
        return getQualifiedJSXName(object.object) + "." + getQualifiedJSXName(object.property);
    }
    module.exports = function(options) {
      options = options || {};
      return function(Parser4) {
        return plugin({
          allowNamespaces: options.allowNamespaces !== false,
          allowNamespacedObjects: !!options.allowNamespacedObjects
        }, Parser4);
      };
    };
    Object.defineProperty(module.exports, "tokTypes", {
      get: function get_tokTypes() {
        return getJsxTokens(require_acorn()).tokTypes;
      },
      configurable: true,
      enumerable: true
    });
    function plugin(options, Parser4) {
      const acorn = Parser4.acorn || require_acorn();
      const acornJsx2 = getJsxTokens(acorn);
      const tt = acorn.tokTypes;
      const tok = acornJsx2.tokTypes;
      const tokContexts = acorn.tokContexts;
      const tc_oTag = acornJsx2.tokContexts.tc_oTag;
      const tc_cTag = acornJsx2.tokContexts.tc_cTag;
      const tc_expr = acornJsx2.tokContexts.tc_expr;
      const isNewLine2 = acorn.isNewLine;
      const isIdentifierStart2 = acorn.isIdentifierStart;
      const isIdentifierChar2 = acorn.isIdentifierChar;
      return class extends Parser4 {
        // Expose actual `tokTypes` and `tokContexts` to other plugins.
        static get acornJsx() {
          return acornJsx2;
        }
        // Reads inline JSX contents token.
        jsx_readToken() {
          let out = "", chunkStart = this.pos;
          for (; ; ) {
            if (this.pos >= this.input.length)
              this.raise(this.start, "Unterminated JSX contents");
            let ch = this.input.charCodeAt(this.pos);
            switch (ch) {
              case 60:
              case 123:
                if (this.pos === this.start) {
                  if (ch === 60 && this.exprAllowed) {
                    ++this.pos;
                    return this.finishToken(tok.jsxTagStart);
                  }
                  return this.getTokenFromCode(ch);
                }
                out += this.input.slice(chunkStart, this.pos);
                return this.finishToken(tok.jsxText, out);
              case 38:
                out += this.input.slice(chunkStart, this.pos);
                out += this.jsx_readEntity();
                chunkStart = this.pos;
                break;
              case 62:
              case 125:
                this.raise(
                  this.pos,
                  "Unexpected token `" + this.input[this.pos] + "`. Did you mean `" + (ch === 62 ? "&gt;" : "&rbrace;") + '` or `{"' + this.input[this.pos] + '"}`?'
                );
              default:
                if (isNewLine2(ch)) {
                  out += this.input.slice(chunkStart, this.pos);
                  out += this.jsx_readNewLine(true);
                  chunkStart = this.pos;
                } else {
                  ++this.pos;
                }
            }
          }
        }
        jsx_readNewLine(normalizeCRLF) {
          let ch = this.input.charCodeAt(this.pos);
          let out;
          ++this.pos;
          if (ch === 13 && this.input.charCodeAt(this.pos) === 10) {
            ++this.pos;
            out = normalizeCRLF ? "\n" : "\r\n";
          } else {
            out = String.fromCharCode(ch);
          }
          if (this.options.locations) {
            ++this.curLine;
            this.lineStart = this.pos;
          }
          return out;
        }
        jsx_readString(quote) {
          let out = "", chunkStart = ++this.pos;
          for (; ; ) {
            if (this.pos >= this.input.length)
              this.raise(this.start, "Unterminated string constant");
            let ch = this.input.charCodeAt(this.pos);
            if (ch === quote)
              break;
            if (ch === 38) {
              out += this.input.slice(chunkStart, this.pos);
              out += this.jsx_readEntity();
              chunkStart = this.pos;
            } else if (isNewLine2(ch)) {
              out += this.input.slice(chunkStart, this.pos);
              out += this.jsx_readNewLine(false);
              chunkStart = this.pos;
            } else {
              ++this.pos;
            }
          }
          out += this.input.slice(chunkStart, this.pos++);
          return this.finishToken(tt.string, out);
        }
        jsx_readEntity() {
          let str = "", count = 0, entity;
          let ch = this.input[this.pos];
          if (ch !== "&")
            this.raise(this.pos, "Entity must start with an ampersand");
          let startPos = ++this.pos;
          while (this.pos < this.input.length && count++ < 10) {
            ch = this.input[this.pos++];
            if (ch === ";") {
              if (str[0] === "#") {
                if (str[1] === "x") {
                  str = str.substr(2);
                  if (hexNumber.test(str))
                    entity = String.fromCharCode(parseInt(str, 16));
                } else {
                  str = str.substr(1);
                  if (decimalNumber.test(str))
                    entity = String.fromCharCode(parseInt(str, 10));
                }
              } else {
                entity = XHTMLEntities[str];
              }
              break;
            }
            str += ch;
          }
          if (!entity) {
            this.pos = startPos;
            return "&";
          }
          return entity;
        }
        // Read a JSX identifier (valid tag or attribute name).
        //
        // Optimized version since JSX identifiers can't contain
        // escape characters and so can be read as single slice.
        // Also assumes that first character was already checked
        // by isIdentifierStart in readToken.
        jsx_readWord() {
          let ch, start = this.pos;
          do {
            ch = this.input.charCodeAt(++this.pos);
          } while (isIdentifierChar2(ch) || ch === 45);
          return this.finishToken(tok.jsxName, this.input.slice(start, this.pos));
        }
        // Parse next token as JSX identifier
        jsx_parseIdentifier() {
          let node = this.startNode();
          if (this.type === tok.jsxName)
            node.name = this.value;
          else if (this.type.keyword)
            node.name = this.type.keyword;
          else
            this.unexpected();
          this.next();
          return this.finishNode(node, "JSXIdentifier");
        }
        // Parse namespaced identifier.
        jsx_parseNamespacedName() {
          let startPos = this.start, startLoc = this.startLoc;
          let name = this.jsx_parseIdentifier();
          if (!options.allowNamespaces || !this.eat(tt.colon))
            return name;
          var node = this.startNodeAt(startPos, startLoc);
          node.namespace = name;
          node.name = this.jsx_parseIdentifier();
          return this.finishNode(node, "JSXNamespacedName");
        }
        // Parses element name in any form - namespaced, member
        // or single identifier.
        jsx_parseElementName() {
          if (this.type === tok.jsxTagEnd)
            return "";
          let startPos = this.start, startLoc = this.startLoc;
          let node = this.jsx_parseNamespacedName();
          if (this.type === tt.dot && node.type === "JSXNamespacedName" && !options.allowNamespacedObjects) {
            this.unexpected();
          }
          while (this.eat(tt.dot)) {
            let newNode = this.startNodeAt(startPos, startLoc);
            newNode.object = node;
            newNode.property = this.jsx_parseIdentifier();
            node = this.finishNode(newNode, "JSXMemberExpression");
          }
          return node;
        }
        // Parses any type of JSX attribute value.
        jsx_parseAttributeValue() {
          switch (this.type) {
            case tt.braceL:
              let node = this.jsx_parseExpressionContainer();
              if (node.expression.type === "JSXEmptyExpression")
                this.raise(node.start, "JSX attributes must only be assigned a non-empty expression");
              return node;
            case tok.jsxTagStart:
            case tt.string:
              return this.parseExprAtom();
            default:
              this.raise(this.start, "JSX value should be either an expression or a quoted JSX text");
          }
        }
        // JSXEmptyExpression is unique type since it doesn't actually parse anything,
        // and so it should start at the end of last read token (left brace) and finish
        // at the beginning of the next one (right brace).
        jsx_parseEmptyExpression() {
          let node = this.startNodeAt(this.lastTokEnd, this.lastTokEndLoc);
          return this.finishNodeAt(node, "JSXEmptyExpression", this.start, this.startLoc);
        }
        // Parses JSX expression enclosed into curly brackets.
        jsx_parseExpressionContainer() {
          let node = this.startNode();
          this.next();
          node.expression = this.type === tt.braceR ? this.jsx_parseEmptyExpression() : this.parseExpression();
          this.expect(tt.braceR);
          return this.finishNode(node, "JSXExpressionContainer");
        }
        // Parses following JSX attribute name-value pair.
        jsx_parseAttribute() {
          let node = this.startNode();
          if (this.eat(tt.braceL)) {
            this.expect(tt.ellipsis);
            node.argument = this.parseMaybeAssign();
            this.expect(tt.braceR);
            return this.finishNode(node, "JSXSpreadAttribute");
          }
          node.name = this.jsx_parseNamespacedName();
          node.value = this.eat(tt.eq) ? this.jsx_parseAttributeValue() : null;
          return this.finishNode(node, "JSXAttribute");
        }
        // Parses JSX opening tag starting after '<'.
        jsx_parseOpeningElementAt(startPos, startLoc) {
          let node = this.startNodeAt(startPos, startLoc);
          node.attributes = [];
          let nodeName = this.jsx_parseElementName();
          if (nodeName)
            node.name = nodeName;
          while (this.type !== tt.slash && this.type !== tok.jsxTagEnd)
            node.attributes.push(this.jsx_parseAttribute());
          node.selfClosing = this.eat(tt.slash);
          this.expect(tok.jsxTagEnd);
          return this.finishNode(node, nodeName ? "JSXOpeningElement" : "JSXOpeningFragment");
        }
        // Parses JSX closing tag starting after '</'.
        jsx_parseClosingElementAt(startPos, startLoc) {
          let node = this.startNodeAt(startPos, startLoc);
          let nodeName = this.jsx_parseElementName();
          if (nodeName)
            node.name = nodeName;
          this.expect(tok.jsxTagEnd);
          return this.finishNode(node, nodeName ? "JSXClosingElement" : "JSXClosingFragment");
        }
        // Parses entire JSX element, including it's opening tag
        // (starting after '<'), attributes, contents and closing tag.
        jsx_parseElementAt(startPos, startLoc) {
          let node = this.startNodeAt(startPos, startLoc);
          let children = [];
          let openingElement = this.jsx_parseOpeningElementAt(startPos, startLoc);
          let closingElement = null;
          if (!openingElement.selfClosing) {
            contents:
              for (; ; ) {
                switch (this.type) {
                  case tok.jsxTagStart:
                    startPos = this.start;
                    startLoc = this.startLoc;
                    this.next();
                    if (this.eat(tt.slash)) {
                      closingElement = this.jsx_parseClosingElementAt(startPos, startLoc);
                      break contents;
                    }
                    children.push(this.jsx_parseElementAt(startPos, startLoc));
                    break;
                  case tok.jsxText:
                    children.push(this.parseExprAtom());
                    break;
                  case tt.braceL:
                    children.push(this.jsx_parseExpressionContainer());
                    break;
                  default:
                    this.unexpected();
                }
              }
            if (getQualifiedJSXName(closingElement.name) !== getQualifiedJSXName(openingElement.name)) {
              this.raise(
                closingElement.start,
                "Expected corresponding JSX closing tag for <" + getQualifiedJSXName(openingElement.name) + ">"
              );
            }
          }
          let fragmentOrElement = openingElement.name ? "Element" : "Fragment";
          node["opening" + fragmentOrElement] = openingElement;
          node["closing" + fragmentOrElement] = closingElement;
          node.children = children;
          if (this.type === tt.relational && this.value === "<") {
            this.raise(this.start, "Adjacent JSX elements must be wrapped in an enclosing tag");
          }
          return this.finishNode(node, "JSX" + fragmentOrElement);
        }
        // Parse JSX text
        jsx_parseText() {
          let node = this.parseLiteral(this.value);
          node.type = "JSXText";
          return node;
        }
        // Parses entire JSX element from current position.
        jsx_parseElement() {
          let startPos = this.start, startLoc = this.startLoc;
          this.next();
          return this.jsx_parseElementAt(startPos, startLoc);
        }
        parseExprAtom(refShortHandDefaultPos) {
          if (this.type === tok.jsxText)
            return this.jsx_parseText();
          else if (this.type === tok.jsxTagStart)
            return this.jsx_parseElement();
          else
            return super.parseExprAtom(refShortHandDefaultPos);
        }
        readToken(code) {
          let context = this.curContext();
          if (context === tc_expr)
            return this.jsx_readToken();
          if (context === tc_oTag || context === tc_cTag) {
            if (isIdentifierStart2(code))
              return this.jsx_readWord();
            if (code == 62) {
              ++this.pos;
              return this.finishToken(tok.jsxTagEnd);
            }
            if ((code === 34 || code === 39) && context == tc_oTag)
              return this.jsx_readString(code);
          }
          if (code === 60 && this.exprAllowed && this.input.charCodeAt(this.pos + 1) !== 33) {
            ++this.pos;
            return this.finishToken(tok.jsxTagStart);
          }
          return super.readToken(code);
        }
        updateContext(prevType) {
          if (this.type == tt.braceL) {
            var curContext = this.curContext();
            if (curContext == tc_oTag)
              this.context.push(tokContexts.b_expr);
            else if (curContext == tc_expr)
              this.context.push(tokContexts.b_tmpl);
            else
              super.updateContext(prevType);
            this.exprAllowed = true;
          } else if (this.type === tt.slash && prevType === tok.jsxTagStart) {
            this.context.length -= 2;
            this.context.push(tc_cTag);
            this.exprAllowed = false;
          } else {
            return super.updateContext(prevType);
          }
        }
      };
    }
  }
});

// node_modules/acorn-dynamic-import/lib/index.js
var require_lib = __commonJS({
  "node_modules/acorn-dynamic-import/lib/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.DynamicImportKey = void 0;
    var _createClass = /* @__PURE__ */ function() {
      function defineProperties(target2, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor)
            descriptor.writable = true;
          Object.defineProperty(target2, descriptor.key, descriptor);
        }
      }
      return function(Constructor, protoProps, staticProps) {
        if (protoProps)
          defineProperties(Constructor.prototype, protoProps);
        if (staticProps)
          defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();
    var _get = /* @__PURE__ */ function() {
      function get(object, property, receiver) {
        if (object === null)
          object = Function.prototype;
        var desc = Object.getOwnPropertyDescriptor(object, property);
        if (desc === void 0) {
          var parent = Object.getPrototypeOf(object);
          if (parent === null) {
            return void 0;
          } else {
            return get(parent, property, receiver);
          }
        } else if ("value" in desc) {
          return desc.value;
        } else {
          var getter = desc.get;
          if (getter === void 0) {
            return void 0;
          }
          return getter.call(receiver);
        }
      }
      return get;
    }();
    exports["default"] = dynamicImport;
    var _acorn = require_acorn();
    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }
    function _possibleConstructorReturn(self2, call) {
      if (!self2) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
      return call && (typeof call === "object" || typeof call === "function") ? call : self2;
    }
    function _inherits(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });
      if (superClass)
        Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }
    var DynamicImportKey = exports.DynamicImportKey = "Import";
    _acorn.tokTypes._import.startsExpr = true;
    function parseDynamicImport() {
      var node = this.startNode();
      this.next();
      if (this.type !== _acorn.tokTypes.parenL) {
        this.unexpected();
      }
      return this.finishNode(node, DynamicImportKey);
    }
    function parenAfter() {
      return /^(\s|\/\/.*|\/\*[^]*?\*\/)*\(/.test(this.input.slice(this.pos));
    }
    function dynamicImport(Parser4) {
      return function(_Parser) {
        _inherits(_class, _Parser);
        function _class() {
          _classCallCheck(this, _class);
          return _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).apply(this, arguments));
        }
        _createClass(_class, [{
          key: "parseStatement",
          value: /* @__PURE__ */ function() {
            function parseStatement(context, topLevel, exports2) {
              if (this.type === _acorn.tokTypes._import && parenAfter.call(this)) {
                return this.parseExpressionStatement(this.startNode(), this.parseExpression());
              }
              return _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), "parseStatement", this).call(this, context, topLevel, exports2);
            }
            return parseStatement;
          }()
        }, {
          key: "parseExprAtom",
          value: /* @__PURE__ */ function() {
            function parseExprAtom(refDestructuringErrors) {
              if (this.type === _acorn.tokTypes._import) {
                return parseDynamicImport.call(this);
              }
              return _get(_class.prototype.__proto__ || Object.getPrototypeOf(_class.prototype), "parseExprAtom", this).call(this, refDestructuringErrors);
            }
            return parseExprAtom;
          }()
        }]);
        return _class;
      }(Parser4);
    }
  }
});

// node_modules/regjsgen/regjsgen.js
var require_regjsgen = __commonJS({
  "node_modules/regjsgen/regjsgen.js"(exports, module) {
    (function() {
      "use strict";
      var objectTypes = {
        "function": true,
        "object": true
      };
      var root = objectTypes[typeof window] && window || this;
      var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;
      var hasFreeModule = objectTypes[typeof module] && module && !module.nodeType;
      var freeGlobal = freeExports && hasFreeModule && typeof global == "object" && global;
      if (freeGlobal && (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal)) {
        root = freeGlobal;
      }
      var hasOwnProperty3 = Object.prototype.hasOwnProperty;
      function fromCodePoint() {
        var codePoint = Number(arguments[0]);
        if (!isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
        codePoint < 0 || // not a valid Unicode code point
        codePoint > 1114111 || // not a valid Unicode code point
        Math.floor(codePoint) != codePoint) {
          throw RangeError("Invalid code point: " + codePoint);
        }
        if (codePoint <= 65535) {
          return String.fromCharCode(codePoint);
        } else {
          codePoint -= 65536;
          var highSurrogate = (codePoint >> 10) + 55296;
          var lowSurrogate = codePoint % 1024 + 56320;
          return String.fromCharCode(highSurrogate, lowSurrogate);
        }
      }
      var assertTypeRegexMap = {};
      function assertType(type, expected) {
        if (expected.indexOf("|") == -1) {
          if (type == expected) {
            return;
          }
          throw Error("Invalid node type: " + type + "; expected type: " + expected);
        }
        expected = hasOwnProperty3.call(assertTypeRegexMap, expected) ? assertTypeRegexMap[expected] : assertTypeRegexMap[expected] = RegExp("^(?:" + expected + ")$");
        if (expected.test(type)) {
          return;
        }
        throw Error("Invalid node type: " + type + "; expected types: " + expected);
      }
      function generate(node) {
        var type = node.type;
        if (hasOwnProperty3.call(generators, type)) {
          return generators[type](node);
        }
        throw Error("Invalid node type: " + type);
      }
      function generateSequence(generator, terms) {
        var i = -1, length3 = terms.length, result = "", term;
        while (++i < length3) {
          term = terms[i];
          if (i + 1 < length3 && terms[i].type == "value" && terms[i].kind == "null" && terms[i + 1].type == "value" && terms[i + 1].kind == "symbol" && terms[i + 1].codePoint >= 48 && terms[i + 1].codePoint <= 57) {
            result += "\\000";
            continue;
          }
          result += generator(term);
        }
        return result;
      }
      function generateAlternative(node) {
        assertType(node.type, "alternative");
        return generateSequence(generateTerm, node.body);
      }
      function generateAnchor(node) {
        assertType(node.type, "anchor");
        switch (node.kind) {
          case "start":
            return "^";
          case "end":
            return "$";
          case "boundary":
            return "\\b";
          case "not-boundary":
            return "\\B";
          default:
            throw Error("Invalid assertion");
        }
      }
      function generateAtom(node) {
        assertType(node.type, "anchor|characterClass|characterClassEscape|dot|group|reference|value");
        return generate(node);
      }
      function generateCharacterClass(node) {
        assertType(node.type, "characterClass");
        return "[" + (node.negative ? "^" : "") + generateSequence(generateClassAtom, node.body) + "]";
      }
      function generateCharacterClassEscape(node) {
        assertType(node.type, "characterClassEscape");
        return "\\" + node.value;
      }
      function generateCharacterClassRange(node) {
        assertType(node.type, "characterClassRange");
        var min = node.min, max = node.max;
        if (min.type == "characterClassRange" || max.type == "characterClassRange") {
          throw Error("Invalid character class range");
        }
        return generateClassAtom(min) + "-" + generateClassAtom(max);
      }
      function generateClassAtom(node) {
        assertType(node.type, "anchor|characterClassEscape|characterClassRange|dot|value");
        return generate(node);
      }
      function generateDisjunction(node) {
        assertType(node.type, "disjunction");
        var body = node.body, i = -1, length3 = body.length, result = "";
        while (++i < length3) {
          if (i != 0) {
            result += "|";
          }
          result += generate(body[i]);
        }
        return result;
      }
      function generateDot(node) {
        assertType(node.type, "dot");
        return ".";
      }
      function generateGroup(node) {
        assertType(node.type, "group");
        var result = "";
        switch (node.behavior) {
          case "normal":
            if (node.name) {
              result += "?<" + generateIdentifier(node.name) + ">";
            }
            break;
          case "ignore":
            result += "?:";
            break;
          case "lookahead":
            result += "?=";
            break;
          case "negativeLookahead":
            result += "?!";
            break;
          case "lookbehind":
            result += "?<=";
            break;
          case "negativeLookbehind":
            result += "?<!";
            break;
          default:
            throw Error("Invalid behaviour: " + node.behaviour);
        }
        result += generateSequence(generate, node.body);
        return "(" + result + ")";
      }
      function generateIdentifier(node) {
        assertType(node.type, "identifier");
        return node.value;
      }
      function generateQuantifier(node) {
        assertType(node.type, "quantifier");
        var quantifier = "", min = node.min, max = node.max;
        if (max == null) {
          if (min == 0) {
            quantifier = "*";
          } else if (min == 1) {
            quantifier = "+";
          } else {
            quantifier = "{" + min + ",}";
          }
        } else if (min == max) {
          quantifier = "{" + min + "}";
        } else if (min == 0 && max == 1) {
          quantifier = "?";
        } else {
          quantifier = "{" + min + "," + max + "}";
        }
        if (!node.greedy) {
          quantifier += "?";
        }
        return generateAtom(node.body[0]) + quantifier;
      }
      function generateReference(node) {
        assertType(node.type, "reference");
        if (node.matchIndex) {
          return "\\" + node.matchIndex;
        }
        if (node.name) {
          return "\\k<" + generateIdentifier(node.name) + ">";
        }
        throw new Error("Unknown reference type");
      }
      function generateTerm(node) {
        assertType(node.type, "anchor|characterClass|characterClassEscape|empty|group|quantifier|reference|unicodePropertyEscape|value|dot");
        return generate(node);
      }
      function generateUnicodePropertyEscape(node) {
        assertType(node.type, "unicodePropertyEscape");
        return "\\" + (node.negative ? "P" : "p") + "{" + node.value + "}";
      }
      function generateValue(node) {
        assertType(node.type, "value");
        var kind = node.kind, codePoint = node.codePoint;
        if (typeof codePoint != "number") {
          throw new Error("Invalid code point: " + codePoint);
        }
        switch (kind) {
          case "controlLetter":
            return "\\c" + fromCodePoint(codePoint + 64);
          case "hexadecimalEscape":
            return "\\x" + ("00" + codePoint.toString(16).toUpperCase()).slice(-2);
          case "identifier":
            return "\\" + fromCodePoint(codePoint);
          case "null":
            return "\\" + codePoint;
          case "octal":
            return "\\" + ("000" + codePoint.toString(8)).slice(-3);
          case "singleEscape":
            switch (codePoint) {
              case 8:
                return "\\b";
              case 9:
                return "\\t";
              case 10:
                return "\\n";
              case 11:
                return "\\v";
              case 12:
                return "\\f";
              case 13:
                return "\\r";
              case 45:
                return "\\-";
              default:
                throw Error("Invalid code point: " + codePoint);
            }
          case "symbol":
            return fromCodePoint(codePoint);
          case "unicodeEscape":
            return "\\u" + ("0000" + codePoint.toString(16).toUpperCase()).slice(-4);
          case "unicodeCodePointEscape":
            return "\\u{" + codePoint.toString(16).toUpperCase() + "}";
          default:
            throw Error("Unsupported node kind: " + kind);
        }
      }
      var generators = {
        "alternative": generateAlternative,
        "anchor": generateAnchor,
        "characterClass": generateCharacterClass,
        "characterClassEscape": generateCharacterClassEscape,
        "characterClassRange": generateCharacterClassRange,
        "disjunction": generateDisjunction,
        "dot": generateDot,
        "group": generateGroup,
        "quantifier": generateQuantifier,
        "reference": generateReference,
        "unicodePropertyEscape": generateUnicodePropertyEscape,
        "value": generateValue
      };
      var regjsgen = {
        "generate": generate
      };
      if (typeof define == "function" && typeof define.amd == "object" && define.amd) {
        define(function() {
          return regjsgen;
        });
        root.regjsgen = regjsgen;
      } else if (freeExports && hasFreeModule) {
        freeExports.generate = generate;
      } else {
        root.regjsgen = regjsgen;
      }
    }).call(exports);
  }
});

// node_modules/regjsparser/parser.js
var require_parser = __commonJS({
  "node_modules/regjsparser/parser.js"(exports, module) {
    (function() {
      var fromCodePoint = String.fromCodePoint || function() {
        var stringFromCharCode = String.fromCharCode;
        var floor = Math.floor;
        return function fromCodePoint2() {
          var MAX_SIZE = 16384;
          var codeUnits = [];
          var highSurrogate;
          var lowSurrogate;
          var index = -1;
          var length3 = arguments.length;
          if (!length3) {
            return "";
          }
          var result = "";
          while (++index < length3) {
            var codePoint = Number(arguments[index]);
            if (!isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
            codePoint < 0 || // not a valid Unicode code point
            codePoint > 1114111 || // not a valid Unicode code point
            floor(codePoint) != codePoint) {
              throw RangeError("Invalid code point: " + codePoint);
            }
            if (codePoint <= 65535) {
              codeUnits.push(codePoint);
            } else {
              codePoint -= 65536;
              highSurrogate = (codePoint >> 10) + 55296;
              lowSurrogate = codePoint % 1024 + 56320;
              codeUnits.push(highSurrogate, lowSurrogate);
            }
            if (index + 1 == length3 || codeUnits.length > MAX_SIZE) {
              result += stringFromCharCode.apply(null, codeUnits);
              codeUnits.length = 0;
            }
          }
          return result;
        };
      }();
      function parse4(str, flags, features2) {
        if (!features2) {
          features2 = {};
        }
        function addRaw(node) {
          node.raw = str.substring(node.range[0], node.range[1]);
          return node;
        }
        function updateRawStart(node, start) {
          node.range[0] = start;
          return addRaw(node);
        }
        function createAnchor(kind, rawLength) {
          return addRaw({
            type: "anchor",
            kind,
            range: [
              pos - rawLength,
              pos
            ]
          });
        }
        function createValue(kind, codePoint, from, to) {
          return addRaw({
            type: "value",
            kind,
            codePoint,
            range: [from, to]
          });
        }
        function createEscaped(kind, codePoint, value, fromOffset) {
          fromOffset = fromOffset || 0;
          return createValue(kind, codePoint, pos - (value.length + fromOffset), pos);
        }
        function createCharacter(matches) {
          var _char = matches[0];
          var first = _char.charCodeAt(0);
          if (hasUnicodeFlag) {
            var second;
            if (_char.length === 1 && first >= 55296 && first <= 56319) {
              second = lookahead2().charCodeAt(0);
              if (second >= 56320 && second <= 57343) {
                pos++;
                return createValue(
                  "symbol",
                  (first - 55296) * 1024 + second - 56320 + 65536,
                  pos - 2,
                  pos
                );
              }
            }
          }
          return createValue("symbol", first, pos - 1, pos);
        }
        function createDisjunction(alternatives, from, to) {
          return addRaw({
            type: "disjunction",
            body: alternatives,
            range: [
              from,
              to
            ]
          });
        }
        function createDot() {
          return addRaw({
            type: "dot",
            range: [
              pos - 1,
              pos
            ]
          });
        }
        function createCharacterClassEscape(value) {
          return addRaw({
            type: "characterClassEscape",
            value,
            range: [
              pos - 2,
              pos
            ]
          });
        }
        function createReference(matchIndex) {
          return addRaw({
            type: "reference",
            matchIndex: parseInt(matchIndex, 10),
            range: [
              pos - 1 - matchIndex.length,
              pos
            ]
          });
        }
        function createNamedReference(name) {
          return addRaw({
            type: "reference",
            name,
            range: [
              name.range[0] - 3,
              pos
            ]
          });
        }
        function createGroup(behavior, disjunction, from, to) {
          return addRaw({
            type: "group",
            behavior,
            body: disjunction,
            range: [
              from,
              to
            ]
          });
        }
        function createQuantifier(min, max, from, to) {
          if (to == null) {
            from = pos - 1;
            to = pos;
          }
          return addRaw({
            type: "quantifier",
            min,
            max,
            greedy: true,
            body: null,
            // set later on
            range: [
              from,
              to
            ]
          });
        }
        function createAlternative(terms, from, to) {
          return addRaw({
            type: "alternative",
            body: terms,
            range: [
              from,
              to
            ]
          });
        }
        function createCharacterClass(classRanges, negative, from, to) {
          return addRaw({
            type: "characterClass",
            body: classRanges,
            negative,
            range: [
              from,
              to
            ]
          });
        }
        function createClassRange(min, max, from, to) {
          if (min.codePoint > max.codePoint) {
            bail("invalid range in character class", min.raw + "-" + max.raw, from, to);
          }
          return addRaw({
            type: "characterClassRange",
            min,
            max,
            range: [
              from,
              to
            ]
          });
        }
        function flattenBody(body) {
          if (body.type === "alternative") {
            return body.body;
          } else {
            return [body];
          }
        }
        function isEmpty3(obj) {
          return obj.type === "empty";
        }
        function incr(amount) {
          amount = amount || 1;
          var res2 = str.substring(pos, pos + amount);
          pos += amount || 1;
          return res2;
        }
        function skip(value) {
          if (!match(value)) {
            bail("character", value);
          }
        }
        function match(value) {
          if (str.indexOf(value, pos) === pos) {
            return incr(value.length);
          }
        }
        function lookahead2() {
          return str[pos];
        }
        function current2(value) {
          return str.indexOf(value, pos) === pos;
        }
        function next(value) {
          return str[pos + 1] === value;
        }
        function matchReg(regExp) {
          var subStr = str.substring(pos);
          var res2 = subStr.match(regExp);
          if (res2) {
            res2.range = [];
            res2.range[0] = pos;
            incr(res2[0].length);
            res2.range[1] = pos;
          }
          return res2;
        }
        function parseDisjunction() {
          var res2 = [], from = pos;
          res2.push(parseAlternative());
          while (match("|")) {
            res2.push(parseAlternative());
          }
          if (res2.length === 1) {
            return res2[0];
          }
          return createDisjunction(res2, from, pos);
        }
        function parseAlternative() {
          var res2 = [], from = pos;
          var term;
          while (term = parseTerm()) {
            res2.push(term);
          }
          if (res2.length === 1) {
            return res2[0];
          }
          return createAlternative(res2, from, pos);
        }
        function parseTerm() {
          if (pos >= str.length || current2("|") || current2(")")) {
            return null;
          }
          var anchor = parseAnchor();
          if (anchor) {
            return anchor;
          }
          var atom = parseAtomAndExtendedAtom();
          if (!atom) {
            pos_backup = pos;
            var quantifier = parseQuantifier() || false;
            if (quantifier) {
              pos = pos_backup;
              bail("Expected atom");
            }
            if (!hasUnicodeFlag && (res = matchReg(/^{/))) {
              atom = createCharacter(res);
            } else {
              bail("Expected atom");
            }
          }
          var quantifier = parseQuantifier() || false;
          if (quantifier) {
            quantifier.body = flattenBody(atom);
            updateRawStart(quantifier, atom.range[0]);
            return quantifier;
          }
          return atom;
        }
        function parseGroup(matchA, typeA, matchB, typeB) {
          var type = null, from = pos;
          if (match(matchA)) {
            type = typeA;
          } else if (match(matchB)) {
            type = typeB;
          } else {
            return false;
          }
          return finishGroup(type, from);
        }
        function finishGroup(type, from) {
          var body = parseDisjunction();
          if (!body) {
            bail("Expected disjunction");
          }
          skip(")");
          var group = createGroup(type, flattenBody(body), from, pos);
          if (type == "normal") {
            if (firstIteration) {
              closedCaptureCounter++;
            }
          }
          return group;
        }
        function parseAnchor() {
          var res2, from = pos;
          if (match("^")) {
            return createAnchor(
              "start",
              1
              /* rawLength */
            );
          } else if (match("$")) {
            return createAnchor(
              "end",
              1
              /* rawLength */
            );
          } else if (match("\\b")) {
            return createAnchor(
              "boundary",
              2
              /* rawLength */
            );
          } else if (match("\\B")) {
            return createAnchor(
              "not-boundary",
              2
              /* rawLength */
            );
          } else {
            return parseGroup("(?=", "lookahead", "(?!", "negativeLookahead");
          }
        }
        function parseQuantifier() {
          var res2, from = pos;
          var quantifier;
          var min, max;
          if (match("*")) {
            quantifier = createQuantifier(0);
          } else if (match("+")) {
            quantifier = createQuantifier(1);
          } else if (match("?")) {
            quantifier = createQuantifier(0, 1);
          } else if (res2 = matchReg(/^\{([0-9]+)\}/)) {
            min = parseInt(res2[1], 10);
            quantifier = createQuantifier(min, min, res2.range[0], res2.range[1]);
          } else if (res2 = matchReg(/^\{([0-9]+),\}/)) {
            min = parseInt(res2[1], 10);
            quantifier = createQuantifier(min, void 0, res2.range[0], res2.range[1]);
          } else if (res2 = matchReg(/^\{([0-9]+),([0-9]+)\}/)) {
            min = parseInt(res2[1], 10);
            max = parseInt(res2[2], 10);
            if (min > max) {
              bail("numbers out of order in {} quantifier", "", from, pos);
            }
            quantifier = createQuantifier(min, max, res2.range[0], res2.range[1]);
          }
          if (quantifier) {
            if (match("?")) {
              quantifier.greedy = false;
              quantifier.range[1] += 1;
            }
          }
          return quantifier;
        }
        function parseAtomAndExtendedAtom() {
          var res2;
          if (res2 = matchReg(/^[^^$\\.*+?()[\]{}|]/)) {
            return createCharacter(res2);
          } else if (!hasUnicodeFlag && (res2 = matchReg(/^(?:]|})/))) {
            return createCharacter(res2);
          } else if (match(".")) {
            return createDot();
          } else if (match("\\")) {
            res2 = parseAtomEscape();
            if (!res2) {
              if (!hasUnicodeFlag && lookahead2() == "c") {
                return createValue("symbol", 92, pos - 1, pos);
              }
              bail("atomEscape");
            }
            return res2;
          } else if (res2 = parseCharacterClass()) {
            return res2;
          } else if (features2.lookbehind && (res2 = parseGroup("(?<=", "lookbehind", "(?<!", "negativeLookbehind"))) {
            return res2;
          } else if (features2.namedGroups && match("(?<")) {
            var name = parseIdentifier();
            skip(">");
            var group = finishGroup("normal", name.range[0] - 3);
            group.name = name;
            return group;
          } else {
            return parseGroup("(?:", "ignore", "(", "normal");
          }
        }
        function parseUnicodeSurrogatePairEscape(firstEscape) {
          if (hasUnicodeFlag) {
            var first, second;
            if (firstEscape.kind == "unicodeEscape" && (first = firstEscape.codePoint) >= 55296 && first <= 56319 && current2("\\") && next("u")) {
              var prevPos = pos;
              pos++;
              var secondEscape = parseClassEscape();
              if (secondEscape.kind == "unicodeEscape" && (second = secondEscape.codePoint) >= 56320 && second <= 57343) {
                firstEscape.range[1] = secondEscape.range[1];
                firstEscape.codePoint = (first - 55296) * 1024 + second - 56320 + 65536;
                firstEscape.type = "value";
                firstEscape.kind = "unicodeCodePointEscape";
                addRaw(firstEscape);
              } else {
                pos = prevPos;
              }
            }
          }
          return firstEscape;
        }
        function parseClassEscape() {
          return parseAtomEscape(true);
        }
        function parseAtomEscape(insideCharacterClass) {
          var res2, from = pos;
          res2 = parseDecimalEscape() || parseNamedReference();
          if (res2) {
            return res2;
          }
          if (insideCharacterClass) {
            if (match("b")) {
              return createEscaped("singleEscape", 8, "\\b");
            } else if (match("B")) {
              bail("\\B not possible inside of CharacterClass", "", from);
            } else if (!hasUnicodeFlag && (res2 = matchReg(/^c([0-9])/))) {
              return createEscaped("controlLetter", res2[1] + 16, res2[1], 2);
            } else if (!hasUnicodeFlag && (res2 = matchReg(/^c_/))) {
              return createEscaped("controlLetter", 31, "_", 2);
            }
            if (hasUnicodeFlag && match("-")) {
              return createEscaped("singleEscape", 45, "\\-");
            }
          }
          res2 = parseCharacterEscape();
          return res2;
        }
        function parseDecimalEscape() {
          var res2, match2;
          if (res2 = matchReg(/^(?!0)\d+/)) {
            match2 = res2[0];
            var refIdx = parseInt(res2[0], 10);
            if (refIdx <= closedCaptureCounter) {
              return createReference(res2[0]);
            } else {
              backrefDenied.push(refIdx);
              incr(-res2[0].length);
              if (res2 = matchReg(/^[0-7]{1,3}/)) {
                return createEscaped("octal", parseInt(res2[0], 8), res2[0], 1);
              } else {
                res2 = createCharacter(matchReg(/^[89]/));
                return updateRawStart(res2, res2.range[0] - 1);
              }
            }
          } else if (res2 = matchReg(/^[0-7]{1,3}/)) {
            match2 = res2[0];
            if (/^0{1,3}$/.test(match2)) {
              return createEscaped("null", 0, "0", match2.length);
            } else {
              return createEscaped("octal", parseInt(match2, 8), match2, 1);
            }
          } else if (res2 = matchReg(/^[dDsSwW]/)) {
            return createCharacterClassEscape(res2[0]);
          }
          return false;
        }
        function parseNamedReference() {
          if (features2.namedGroups && matchReg(/^k<(?=.*?>)/)) {
            var name = parseIdentifier();
            skip(">");
            return createNamedReference(name);
          }
        }
        function parseRegExpUnicodeEscapeSequence() {
          var res2;
          if (res2 = matchReg(/^u([0-9a-fA-F]{4})/)) {
            return parseUnicodeSurrogatePairEscape(
              createEscaped("unicodeEscape", parseInt(res2[1], 16), res2[1], 2)
            );
          } else if (hasUnicodeFlag && (res2 = matchReg(/^u\{([0-9a-fA-F]+)\}/))) {
            return createEscaped("unicodeCodePointEscape", parseInt(res2[1], 16), res2[1], 4);
          }
        }
        function parseCharacterEscape() {
          var res2;
          var from = pos;
          if (res2 = matchReg(/^[fnrtv]/)) {
            var codePoint = 0;
            switch (res2[0]) {
              case "t":
                codePoint = 9;
                break;
              case "n":
                codePoint = 10;
                break;
              case "v":
                codePoint = 11;
                break;
              case "f":
                codePoint = 12;
                break;
              case "r":
                codePoint = 13;
                break;
            }
            return createEscaped("singleEscape", codePoint, "\\" + res2[0]);
          } else if (res2 = matchReg(/^c([a-zA-Z])/)) {
            return createEscaped("controlLetter", res2[1].charCodeAt(0) % 32, res2[1], 2);
          } else if (res2 = matchReg(/^x([0-9a-fA-F]{2})/)) {
            return createEscaped("hexadecimalEscape", parseInt(res2[1], 16), res2[1], 2);
          } else if (res2 = parseRegExpUnicodeEscapeSequence()) {
            if (!res2 || res2.codePoint > 1114111) {
              bail("Invalid escape sequence", null, from, pos);
            }
            return res2;
          } else if (features2.unicodePropertyEscape && hasUnicodeFlag && (res2 = matchReg(/^([pP])\{([^\}]+)\}/))) {
            return addRaw({
              type: "unicodePropertyEscape",
              negative: res2[1] === "P",
              value: res2[2],
              range: [res2.range[0] - 1, res2.range[1]],
              raw: res2[0]
            });
          } else {
            return parseIdentityEscape();
          }
        }
        function parseIdentifierAtom(check) {
          var ch = lookahead2();
          var from = pos;
          if (ch === "\\") {
            incr();
            var esc = parseRegExpUnicodeEscapeSequence();
            if (!esc || !check(esc.codePoint)) {
              bail("Invalid escape sequence", null, from, pos);
            }
            return fromCodePoint(esc.codePoint);
          }
          var code = ch.charCodeAt(0);
          if (code >= 55296 && code <= 56319) {
            ch += str[pos + 1];
            var second = ch.charCodeAt(1);
            if (second >= 56320 && second <= 57343) {
              code = (code - 55296) * 1024 + second - 56320 + 65536;
            }
          }
          if (!check(code))
            return;
          incr();
          if (code > 65535)
            incr();
          return ch;
        }
        function parseIdentifier() {
          var start = pos;
          var res2 = parseIdentifierAtom(isIdentifierStart2);
          if (!res2) {
            bail("Invalid identifier");
          }
          var ch;
          while (ch = parseIdentifierAtom(isIdentifierPart)) {
            res2 += ch;
          }
          return addRaw({
            type: "identifier",
            value: res2,
            range: [start, pos]
          });
        }
        function isIdentifierStart2(ch) {
          var NonAsciiIdentifierStart = /[\$A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEF\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7B9\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD23\uDF00-\uDF1C\uDF27\uDF30-\uDF45]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD44\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF1A]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCDF\uDCFF\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE83\uDE86-\uDE89\uDE9D\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDEE0-\uDEF2]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE7F\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFF1]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]/;
          return ch === 36 || ch === 95 || // $ (dollar) and _ (underscore)
          ch >= 65 && ch <= 90 || // A..Z
          ch >= 97 && ch <= 122 || // a..z
          ch >= 128 && NonAsciiIdentifierStart.test(fromCodePoint(ch));
        }
        function isIdentifierPart(ch) {
          var NonAsciiIdentifierPartOnly = /[0-9_\xB7\u0300-\u036F\u0387\u0483-\u0487\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u0669\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u06F0-\u06F9\u0711\u0730-\u074A\u07A6-\u07B0\u07C0-\u07C9\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D3-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0966-\u096F\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09E6-\u09EF\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A66-\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AE6-\u0AEF\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B66-\u0B6F\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0BE6-\u0BEF\u0C00-\u0C04\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0CE6-\u0CEF\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D66-\u0D6F\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0E50-\u0E59\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0ED0-\u0ED9\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1040-\u1049\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F-\u109D\u135D-\u135F\u1369-\u1371\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u18A9\u1920-\u192B\u1930-\u193B\u1946-\u194F\u19D0-\u19DA\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AB0-\u1ABD\u1B00-\u1B04\u1B34-\u1B44\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BB0-\u1BB9\u1BE6-\u1BF3\u1C24-\u1C37\u1C40-\u1C49\u1C50-\u1C59\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF2-\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DF9\u1DFB-\u1DFF\u200C\u200D\u203F\u2040\u2054\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA620-\uA629\uA66F\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F1\uA8FF-\uA909\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9D0-\uA9D9\uA9E5\uA9F0-\uA9F9\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA50-\uAA59\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uABF0-\uABF9\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFF10-\uFF19\uFF3F]|\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD801[\uDCA0-\uDCA9]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD803[\uDD24-\uDD27\uDD30-\uDD39\uDF46-\uDF50]|\uD804[\uDC00-\uDC02\uDC38-\uDC46\uDC66-\uDC6F\uDC7F-\uDC82\uDCB0-\uDCBA\uDCF0-\uDCF9\uDD00-\uDD02\uDD27-\uDD34\uDD36-\uDD3F\uDD45\uDD46\uDD73\uDD80-\uDD82\uDDB3-\uDDC0\uDDC9-\uDDCC\uDDD0-\uDDD9\uDE2C-\uDE37\uDE3E\uDEDF-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF3B\uDF3C\uDF3E-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF57\uDF62\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC35-\uDC46\uDC50-\uDC59\uDC5E\uDCB0-\uDCC3\uDCD0-\uDCD9\uDDAF-\uDDB5\uDDB8-\uDDC0\uDDDC\uDDDD\uDE30-\uDE40\uDE50-\uDE59\uDEAB-\uDEB7\uDEC0-\uDEC9\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDC2C-\uDC3A\uDCE0-\uDCE9\uDE01-\uDE0A\uDE33-\uDE39\uDE3B-\uDE3E\uDE47\uDE51-\uDE5B\uDE8A-\uDE99]|\uD807[\uDC2F-\uDC36\uDC38-\uDC3F\uDC50-\uDC59\uDC92-\uDCA7\uDCA9-\uDCB6\uDD31-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD45\uDD47\uDD50-\uDD59\uDD8A-\uDD8E\uDD90\uDD91\uDD93-\uDD97\uDDA0-\uDDA9\uDEF3-\uDEF6]|\uD81A[\uDE60-\uDE69\uDEF0-\uDEF4\uDF30-\uDF36\uDF50-\uDF59]|\uD81B[\uDF51-\uDF7E\uDF8F-\uDF92]|\uD82F[\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDCD0-\uDCD6\uDD44-\uDD4A\uDD50-\uDD59]|\uDB40[\uDD00-\uDDEF]/;
          return isIdentifierStart2(ch) || ch >= 48 && ch <= 57 || // 0..9
          ch >= 128 && NonAsciiIdentifierPartOnly.test(fromCodePoint(ch));
        }
        function parseIdentityEscape() {
          var tmp;
          var l = lookahead2();
          if (hasUnicodeFlag && /[\^\$\.\*\+\?\(\)\\\[\]\{\}\|\/]/.test(l) || !hasUnicodeFlag && l !== "c") {
            if (l === "k" && features2.lookbehind) {
              return null;
            }
            tmp = incr();
            return createEscaped("identifier", tmp.charCodeAt(0), tmp, 1);
          }
          return null;
        }
        function parseCharacterClass() {
          var res2, from = pos;
          if (res2 = matchReg(/^\[\^/)) {
            res2 = parseClassRanges();
            skip("]");
            return createCharacterClass(res2, true, from, pos);
          } else if (match("[")) {
            res2 = parseClassRanges();
            skip("]");
            return createCharacterClass(res2, false, from, pos);
          }
          return null;
        }
        function parseClassRanges() {
          var res2;
          if (current2("]")) {
            return [];
          } else {
            res2 = parseNonemptyClassRanges();
            if (!res2) {
              bail("nonEmptyClassRanges");
            }
            return res2;
          }
        }
        function parseHelperClassRanges(atom) {
          var from, to, res2, atomTo, dash;
          if (current2("-") && !next("]")) {
            from = atom.range[0];
            dash = createCharacter(match("-"));
            atomTo = parseClassAtom();
            if (!atomTo) {
              bail("classAtom");
            }
            to = pos;
            var classRanges = parseClassRanges();
            if (!classRanges) {
              bail("classRanges");
            }
            if (!("codePoint" in atom) || !("codePoint" in atomTo)) {
              if (!hasUnicodeFlag) {
                res2 = [atom, dash, atomTo];
              } else {
                bail("invalid character class");
              }
            } else {
              res2 = [createClassRange(atom, atomTo, from, to)];
            }
            if (classRanges.type === "empty") {
              return res2;
            }
            return res2.concat(classRanges);
          }
          res2 = parseNonemptyClassRangesNoDash();
          if (!res2) {
            bail("nonEmptyClassRangesNoDash");
          }
          return [atom].concat(res2);
        }
        function parseNonemptyClassRanges() {
          var atom = parseClassAtom();
          if (!atom) {
            bail("classAtom");
          }
          if (current2("]")) {
            return [atom];
          }
          return parseHelperClassRanges(atom);
        }
        function parseNonemptyClassRangesNoDash() {
          var res2 = parseClassAtom();
          if (!res2) {
            bail("classAtom");
          }
          if (current2("]")) {
            return res2;
          }
          return parseHelperClassRanges(res2);
        }
        function parseClassAtom() {
          if (match("-")) {
            return createCharacter("-");
          } else {
            return parseClassAtomNoDash();
          }
        }
        function parseClassAtomNoDash() {
          var res2;
          if (res2 = matchReg(/^[^\\\]-]/)) {
            return createCharacter(res2[0]);
          } else if (match("\\")) {
            res2 = parseClassEscape();
            if (!res2) {
              bail("classEscape");
            }
            return parseUnicodeSurrogatePairEscape(res2);
          }
        }
        function bail(message, details, from, to) {
          from = from == null ? pos : from;
          to = to == null ? from : to;
          var contextStart = Math.max(0, from - 10);
          var contextEnd = Math.min(to + 10, str.length);
          var context = "    " + str.substring(contextStart, contextEnd);
          var pointer = "    " + new Array(from - contextStart + 1).join(" ") + "^";
          throw SyntaxError(message + " at position " + from + (details ? ": " + details : "") + "\n" + context + "\n" + pointer);
        }
        var backrefDenied = [];
        var closedCaptureCounter = 0;
        var firstIteration = true;
        var hasUnicodeFlag = (flags || "").indexOf("u") !== -1;
        var pos = 0;
        str = String(str);
        if (str === "") {
          str = "(?:)";
        }
        var result = parseDisjunction();
        if (result.range[1] !== str.length) {
          bail("Could not parse entire input - got stuck", "", result.range[1]);
        }
        for (var i = 0; i < backrefDenied.length; i++) {
          if (backrefDenied[i] <= closedCaptureCounter) {
            pos = 0;
            firstIteration = false;
            return parseDisjunction();
          }
        }
        return result;
      }
      var regjsparser = {
        parse: parse4
      };
      if (typeof module !== "undefined" && module.exports) {
        module.exports = regjsparser;
      } else {
        window.regjsparser = regjsparser;
      }
    })();
  }
});

// node_modules/regenerate/regenerate.js
var require_regenerate = __commonJS({
  "node_modules/regenerate/regenerate.js"(exports, module) {
    (function(root) {
      var freeExports = typeof exports == "object" && exports;
      var freeModule = typeof module == "object" && module && module.exports == freeExports && module;
      var freeGlobal = typeof global == "object" && global;
      if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
        root = freeGlobal;
      }
      var ERRORS = {
        "rangeOrder": "A range\u2019s `stop` value must be greater than or equal to the `start` value.",
        "codePointRange": "Invalid code point value. Code points range from U+000000 to U+10FFFF."
      };
      var HIGH_SURROGATE_MIN = 55296;
      var HIGH_SURROGATE_MAX = 56319;
      var LOW_SURROGATE_MIN = 56320;
      var LOW_SURROGATE_MAX = 57343;
      var regexNull = /\\x00([^0123456789]|$)/g;
      var object = {};
      var hasOwnProperty3 = object.hasOwnProperty;
      var extend2 = function(destination, source) {
        var key;
        for (key in source) {
          if (hasOwnProperty3.call(source, key)) {
            destination[key] = source[key];
          }
        }
        return destination;
      };
      var forEach = function(array, callback) {
        var index = -1;
        var length3 = array.length;
        while (++index < length3) {
          callback(array[index], index);
        }
      };
      var toString8 = object.toString;
      var isArray2 = function(value) {
        return toString8.call(value) == "[object Array]";
      };
      var isNumber = function(value) {
        return typeof value == "number" || toString8.call(value) == "[object Number]";
      };
      var hexBytes = [];
      (function() {
        var digits = "0123456789ABCDEF";
        var index = -1;
        while (++index <= 255) {
          hexBytes[index] = digits.charAt(index >> 4) + digits.charAt(index & 15);
        }
      })();
      var hex2 = function(number) {
        return hexBytes[number];
      };
      var hex4 = function(number) {
        return hexBytes[number >> 8] + hexBytes[number & 255];
      };
      var slice2 = [].slice;
      var compareNumbers = function(a, b) {
        return a - b;
      };
      var dataFromCodePoints = function(codePoints) {
        var length3 = codePoints.length;
        var index = 0;
        var start;
        var end;
        var codePoint;
        var result = [];
        while (index < length3) {
          start = codePoints[index];
          end = start + 1;
          while (++index < length3 && (codePoint = codePoints[index]) <= end) {
            if (codePoint == end) {
              ++end;
            } else if (codePoint < end - 1) {
              codePoints.sort(compareNumbers);
              return dataFromCodePoints(codePoints);
            }
          }
          result.push(start, end);
        }
        return result;
      };
      var dataRemove = function(data2, codePoint) {
        var index = 0;
        var start;
        var end;
        var length3 = data2.length;
        while (index < length3) {
          start = data2[index];
          end = data2[index + 1];
          if (codePoint >= start && codePoint < end) {
            if (codePoint == start) {
              if (end == start + 1) {
                data2.splice(index, 2);
                return data2;
              } else {
                data2[index] = codePoint + 1;
                return data2;
              }
            } else if (codePoint == end - 1) {
              data2[index + 1] = codePoint;
              return data2;
            } else {
              data2.splice(index, 2, start, codePoint, codePoint + 1, end);
              return data2;
            }
          }
          index += 2;
        }
        return data2;
      };
      var dataRemoveRange = function(data2, rangeStart, rangeEnd) {
        if (rangeEnd < rangeStart) {
          throw Error(ERRORS.rangeOrder);
        }
        var length3 = data2.length;
        var rangeEndExclusive = rangeEnd + 1;
        var index = 0;
        var first;
        var start;
        var end;
        while (index < length3 && data2[index + 1] <= rangeStart) {
          index += 2;
        }
        first = index;
        while (index < length3 && data2[index] < rangeEndExclusive) {
          index += 2;
        }
        if (first == index) {
          return data2;
        }
        start = data2[first];
        end = data2[index - 1];
        if (start < rangeStart) {
          if (end > rangeEndExclusive) {
            data2.splice(
              first,
              index - first,
              start,
              rangeStart,
              rangeEndExclusive,
              end
            );
          } else {
            data2.splice(first, index - first, start, rangeStart);
          }
        } else if (end > rangeEndExclusive) {
          data2.splice(first, index - first, rangeEndExclusive, end);
        } else {
          data2.splice(first, index - first);
        }
        return data2;
      };
      var dataAdd = function(data2, codePoint) {
        var index = 0;
        var start;
        var end;
        var lastIndex = null;
        var length3 = data2.length;
        if (codePoint < 0 || codePoint > 1114111) {
          throw RangeError(ERRORS.codePointRange);
        }
        if (length3 && codePoint >= data2[length3 - 2]) {
          end = data2[length3 - 1];
          if (codePoint > end) {
            data2.push(codePoint, codePoint + 1);
          } else if (codePoint == end) {
            data2[length3 - 1] = codePoint + 1;
          }
          return data2;
        }
        while (index < length3) {
          start = data2[index];
          end = data2[index + 1];
          if (codePoint >= start && codePoint < end) {
            return data2;
          }
          if (codePoint == start - 1) {
            data2[index] = codePoint;
            return data2;
          }
          if (start > codePoint) {
            data2.splice(
              lastIndex != null ? lastIndex + 2 : 0,
              0,
              codePoint,
              codePoint + 1
            );
            return data2;
          }
          if (codePoint == end) {
            if (codePoint + 1 == data2[index + 2]) {
              data2.splice(index, 4, start, data2[index + 3]);
              return data2;
            }
            data2[index + 1] = codePoint + 1;
            return data2;
          }
          lastIndex = index;
          index += 2;
        }
        data2.push(codePoint, codePoint + 1);
        return data2;
      };
      var dataAddRange = function(data2, rangeStart, rangeEnd) {
        if (rangeEnd < rangeStart) {
          throw Error(ERRORS.rangeOrder);
        }
        if (rangeStart < 0 || rangeStart > 1114111 || rangeEnd < 0 || rangeEnd > 1114111) {
          throw RangeError(ERRORS.codePointRange);
        }
        var length3 = data2.length;
        var rangeEndExclusive = rangeEnd + 1;
        var index = 0;
        var first;
        var start;
        var end;
        if (length3 && rangeStart >= data2[length3 - 2]) {
          end = data2[length3 - 1];
          if (rangeStart > end) {
            data2.push(rangeStart, rangeEndExclusive);
          } else if (rangeEndExclusive > end) {
            data2[length3 - 1] = rangeEndExclusive;
          }
          return data2;
        }
        while (index < length3 && data2[index + 1] < rangeStart) {
          index += 2;
        }
        first = index;
        while (index < length3 && data2[index] <= rangeEndExclusive) {
          index += 2;
        }
        if (first == index) {
          data2.splice(first, 0, rangeStart, rangeEndExclusive);
          return data2;
        }
        start = data2[first] < rangeStart ? data2[first] : rangeStart;
        end = data2[index - 1] > rangeEndExclusive ? data2[index - 1] : rangeEndExclusive;
        if (index - first == 2) {
          data2[first] = start;
          data2[first + 1] = end;
        } else {
          data2.splice(first, index - first, start, end);
        }
        return data2;
      };
      var dataContains = function(data2, codePoint) {
        var length3 = data2.length;
        var low = 0;
        var high = length3 >> 1;
        var middle;
        if (!length3 || codePoint < data2[0] || codePoint >= data2[length3 - 1]) {
          return false;
        }
        while (low < high) {
          middle = low + high >> 1;
          if (data2[middle << 1] <= codePoint) {
            low = middle + 1;
          } else {
            high = middle;
          }
        }
        return low > 0 && codePoint < data2[(low << 1) - 1];
      };
      var dataIntersectionData = function(dataA, dataB) {
        var indexA = 0;
        var indexB = 0;
        var lengthA = dataA.length;
        var lengthB = dataB.length;
        var startA, endA, startB, endB, start, end;
        var result = [];
        while (indexA < lengthA && indexB < lengthB) {
          startA = dataA[indexA];
          endA = dataA[indexA + 1];
          startB = dataB[indexB];
          endB = dataB[indexB + 1];
          start = startA > startB ? startA : startB;
          end = endA < endB ? endA : endB;
          if (start < end) {
            result.push(start, end);
          }
          if (endA < endB) {
            indexA += 2;
          } else {
            indexB += 2;
          }
        }
        return result;
      };
      var dataUnion = function(dataA, dataB) {
        var indexA = 0;
        var indexB = 0;
        var lengthA = dataA.length;
        var lengthB = dataB.length;
        var start;
        var end;
        var last;
        var result = [];
        while (indexA < lengthA || indexB < lengthB) {
          if (indexB >= lengthB || indexA < lengthA && dataA[indexA] <= dataB[indexB]) {
            start = dataA[indexA];
            end = dataA[indexA + 1];
            indexA += 2;
          } else {
            start = dataB[indexB];
            end = dataB[indexB + 1];
            indexB += 2;
          }
          last = result.length - 1;
          if (last > 0 && start <= result[last]) {
            if (end > result[last]) {
              result[last] = end;
            }
          } else {
            result.push(start, end);
          }
        }
        return result;
      };
      var dataDifference = function(dataA, dataB) {
        var indexA = 0;
        var indexB = 0;
        var lengthA = dataA.length;
        var lengthB = dataB.length;
        var index;
        var start;
        var end;
        var result = [];
        while (indexA < lengthA) {
          start = dataA[indexA];
          end = dataA[indexA + 1];
          indexA += 2;
          while (indexB < lengthB && dataB[indexB + 1] <= start) {
            indexB += 2;
          }
          index = indexB;
          while (start < end && index < lengthB && dataB[index] < end) {
            if (dataB[index] > start) {
              result.push(start, dataB[index]);
            }
            if (dataB[index + 1] > start) {
              start = dataB[index + 1];
            }
            index += 2;
          }
          if (start < end) {
            result.push(start, end);
          }
        }
        return result;
      };
      var dataFromValues = function(values, validate) {
        var codePoints = [];
        var sets = [];
        var collect = function(values2) {
          var index2 = -1;
          var length4 = values2.length;
          var value;
          var codePoint;
          while (++index2 < length4) {
            value = values2[index2];
            if (typeof value == "number") {
              codePoint = value;
            } else if (value == null) {
              continue;
            } else if (value instanceof regenerate) {
              sets.push(value.data);
              continue;
            } else if (isArray2(value)) {
              collect(value);
              continue;
            } else {
              codePoint = isNumber(value) ? +value : symbolToCodePoint(value);
            }
            if (codePoint >= 0 && codePoint <= 1114111) {
              codePoints.push(codePoint);
            } else if (validate) {
              throw RangeError(ERRORS.codePointRange);
            }
          }
        };
        collect(values);
        var data2 = dataFromCodePoints(codePoints);
        var index = -1;
        var length3 = sets.length;
        while (++index < length3) {
          data2 = dataUnion(data2, sets[index]);
        }
        return data2;
      };
      var dataIsEmpty = function(data2) {
        return !data2.length;
      };
      var dataIsSingleton = function(data2) {
        return data2.length == 2 && data2[0] + 1 == data2[1];
      };
      var dataToArray = function(data2) {
        var index = 0;
        var start;
        var end;
        var result = [];
        var length3 = data2.length;
        while (index < length3) {
          start = data2[index];
          end = data2[index + 1];
          while (start < end) {
            result.push(start);
            ++start;
          }
          index += 2;
        }
        return result;
      };
      var floor = Math.floor;
      var highSurrogate = function(codePoint) {
        return parseInt(
          floor((codePoint - 65536) / 1024) + HIGH_SURROGATE_MIN,
          10
        );
      };
      var lowSurrogate = function(codePoint) {
        return parseInt(
          (codePoint - 65536) % 1024 + LOW_SURROGATE_MIN,
          10
        );
      };
      var stringFromCharCode = String.fromCharCode;
      var codePointToString2 = function(codePoint) {
        var string;
        if (codePoint == 9) {
          string = "\\t";
        } else if (codePoint == 10) {
          string = "\\n";
        } else if (codePoint == 12) {
          string = "\\f";
        } else if (codePoint == 13) {
          string = "\\r";
        } else if (codePoint == 45) {
          string = "\\x2D";
        } else if (codePoint == 92) {
          string = "\\\\";
        } else if (codePoint == 36 || codePoint >= 40 && codePoint <= 43 || codePoint == 46 || codePoint == 47 || codePoint == 63 || codePoint >= 91 && codePoint <= 94 || codePoint >= 123 && codePoint <= 125) {
          string = "\\" + stringFromCharCode(codePoint);
        } else if (codePoint >= 32 && codePoint <= 126) {
          string = stringFromCharCode(codePoint);
        } else if (codePoint <= 255) {
          string = "\\x" + hex2(codePoint);
        } else {
          string = "\\u" + hex4(codePoint);
        }
        return string;
      };
      var codePointToStringUnicode = function(codePoint) {
        if (codePoint <= 65535) {
          if (codePoint < HIGH_SURROGATE_MIN || codePoint > LOW_SURROGATE_MAX) {
            return codePointToString2(codePoint);
          }
          return "\\u{" + hex4(codePoint) + "}";
        }
        var high = codePoint >> 16;
        return "\\u{" + (high < 16 ? hexBytes[high].charAt(1) : "10") + hexBytes[codePoint >> 8 & 255] + hexBytes[codePoint & 255] + "}";
      };
      var symbolToCodePoint = function(symbol) {
        var length3 = symbol.length;
        var first = symbol.charCodeAt(0);
        var second;
        if (first >= HIGH_SURROGATE_MIN && first <= HIGH_SURROGATE_MAX && length3 > 1) {
          second = symbol.charCodeAt(1);
          return (first - HIGH_SURROGATE_MIN) * 1024 + second - LOW_SURROGATE_MIN + 65536;
        }
        return first;
      };
      var toCodePoint = function(value) {
        return typeof value == "number" ? value : isNumber(value) ? +value : symbolToCodePoint(value);
      };
      var createBMPCharacterClasses = function(data2) {
        var result = "";
        var index = 0;
        var start;
        var end;
        var length3 = data2.length;
        if (dataIsSingleton(data2)) {
          return codePointToString2(data2[0]);
        }
        while (index < length3) {
          start = data2[index];
          end = data2[index + 1] - 1;
          if (start == end) {
            result += codePointToString2(start);
          } else if (start + 1 == end) {
            result += codePointToString2(start) + codePointToString2(end);
          } else {
            result += codePointToString2(start) + "-" + codePointToString2(end);
          }
          index += 2;
        }
        return "[" + result + "]";
      };
      var createUnicodeCharacterClasses = function(data2) {
        var result = "";
        var index = 0;
        var start;
        var end;
        var length3 = data2.length;
        if (dataIsSingleton(data2)) {
          return codePointToStringUnicode(data2[0]);
        }
        while (index < length3) {
          start = data2[index];
          end = data2[index + 1] - 1;
          if (start == end) {
            result += codePointToStringUnicode(start);
          } else if (start + 1 == end) {
            result += codePointToStringUnicode(start) + codePointToStringUnicode(end);
          } else {
            result += codePointToStringUnicode(start) + "-" + codePointToStringUnicode(end);
          }
          index += 2;
        }
        return "[" + result + "]";
      };
      var splitAtBMP = function(data2) {
        var loneHighSurrogates = [];
        var loneLowSurrogates = [];
        var bmp = [];
        var astral = [];
        var index = 0;
        var start;
        var end;
        var length3 = data2.length;
        while (index < length3) {
          start = data2[index];
          end = data2[index + 1] - 1;
          if (start < HIGH_SURROGATE_MIN) {
            if (end < HIGH_SURROGATE_MIN) {
              bmp.push(start, end + 1);
            }
            if (end >= HIGH_SURROGATE_MIN && end <= HIGH_SURROGATE_MAX) {
              bmp.push(start, HIGH_SURROGATE_MIN);
              loneHighSurrogates.push(HIGH_SURROGATE_MIN, end + 1);
            }
            if (end >= LOW_SURROGATE_MIN && end <= LOW_SURROGATE_MAX) {
              bmp.push(start, HIGH_SURROGATE_MIN);
              loneHighSurrogates.push(HIGH_SURROGATE_MIN, HIGH_SURROGATE_MAX + 1);
              loneLowSurrogates.push(LOW_SURROGATE_MIN, end + 1);
            }
            if (end > LOW_SURROGATE_MAX) {
              bmp.push(start, HIGH_SURROGATE_MIN);
              loneHighSurrogates.push(HIGH_SURROGATE_MIN, HIGH_SURROGATE_MAX + 1);
              loneLowSurrogates.push(LOW_SURROGATE_MIN, LOW_SURROGATE_MAX + 1);
              if (end <= 65535) {
                bmp.push(LOW_SURROGATE_MAX + 1, end + 1);
              } else {
                bmp.push(LOW_SURROGATE_MAX + 1, 65535 + 1);
                astral.push(65535 + 1, end + 1);
              }
            }
          } else if (start >= HIGH_SURROGATE_MIN && start <= HIGH_SURROGATE_MAX) {
            if (end >= HIGH_SURROGATE_MIN && end <= HIGH_SURROGATE_MAX) {
              loneHighSurrogates.push(start, end + 1);
            }
            if (end >= LOW_SURROGATE_MIN && end <= LOW_SURROGATE_MAX) {
              loneHighSurrogates.push(start, HIGH_SURROGATE_MAX + 1);
              loneLowSurrogates.push(LOW_SURROGATE_MIN, end + 1);
            }
            if (end > LOW_SURROGATE_MAX) {
              loneHighSurrogates.push(start, HIGH_SURROGATE_MAX + 1);
              loneLowSurrogates.push(LOW_SURROGATE_MIN, LOW_SURROGATE_MAX + 1);
              if (end <= 65535) {
                bmp.push(LOW_SURROGATE_MAX + 1, end + 1);
              } else {
                bmp.push(LOW_SURROGATE_MAX + 1, 65535 + 1);
                astral.push(65535 + 1, end + 1);
              }
            }
          } else if (start >= LOW_SURROGATE_MIN && start <= LOW_SURROGATE_MAX) {
            if (end >= LOW_SURROGATE_MIN && end <= LOW_SURROGATE_MAX) {
              loneLowSurrogates.push(start, end + 1);
            }
            if (end > LOW_SURROGATE_MAX) {
              loneLowSurrogates.push(start, LOW_SURROGATE_MAX + 1);
              if (end <= 65535) {
                bmp.push(LOW_SURROGATE_MAX + 1, end + 1);
              } else {
                bmp.push(LOW_SURROGATE_MAX + 1, 65535 + 1);
                astral.push(65535 + 1, end + 1);
              }
            }
          } else if (start > LOW_SURROGATE_MAX && start <= 65535) {
            if (end <= 65535) {
              bmp.push(start, end + 1);
            } else {
              bmp.push(start, 65535 + 1);
              astral.push(65535 + 1, end + 1);
            }
          } else {
            astral.push(start, end + 1);
          }
          index += 2;
        }
        return {
          "loneHighSurrogates": loneHighSurrogates,
          "loneLowSurrogates": loneLowSurrogates,
          "bmp": bmp,
          "astral": astral
        };
      };
      var optimizeSurrogateMappings = function(surrogateMappings) {
        var result = [];
        var tmpLow = [];
        var addLow = false;
        var mapping;
        var nextMapping;
        var highSurrogates;
        var lowSurrogates;
        var nextHighSurrogates;
        var nextLowSurrogates;
        var index = -1;
        var length3 = surrogateMappings.length;
        while (++index < length3) {
          mapping = surrogateMappings[index];
          nextMapping = surrogateMappings[index + 1];
          if (!nextMapping) {
            result.push(mapping);
            continue;
          }
          highSurrogates = mapping[0];
          lowSurrogates = mapping[1];
          nextHighSurrogates = nextMapping[0];
          nextLowSurrogates = nextMapping[1];
          tmpLow = lowSurrogates;
          while (nextHighSurrogates && highSurrogates[0] == nextHighSurrogates[0] && highSurrogates[1] == nextHighSurrogates[1]) {
            if (dataIsSingleton(nextLowSurrogates)) {
              tmpLow = dataAdd(tmpLow, nextLowSurrogates[0]);
            } else {
              tmpLow = dataAddRange(
                tmpLow,
                nextLowSurrogates[0],
                nextLowSurrogates[1] - 1
              );
            }
            ++index;
            mapping = surrogateMappings[index];
            highSurrogates = mapping[0];
            lowSurrogates = mapping[1];
            nextMapping = surrogateMappings[index + 1];
            nextHighSurrogates = nextMapping && nextMapping[0];
            nextLowSurrogates = nextMapping && nextMapping[1];
            addLow = true;
          }
          result.push([
            highSurrogates,
            addLow ? tmpLow : lowSurrogates
          ]);
          addLow = false;
        }
        return optimizeByLowSurrogates(result);
      };
      var optimizeByLowSurrogates = function(surrogateMappings) {
        if (surrogateMappings.length == 1) {
          return surrogateMappings;
        }
        var index = -1;
        var innerIndex = -1;
        while (++index < surrogateMappings.length) {
          var mapping = surrogateMappings[index];
          var lowSurrogates = mapping[1];
          if (lowSurrogates.length !== 2) {
            continue;
          }
          var lowSurrogateStart = lowSurrogates[0];
          var lowSurrogateEnd = lowSurrogates[1];
          innerIndex = index;
          while (++innerIndex < surrogateMappings.length) {
            var otherMapping = surrogateMappings[innerIndex];
            var otherLowSurrogates = otherMapping[1];
            var otherLowSurrogateStart = otherLowSurrogates[0];
            var otherLowSurrogateEnd = otherLowSurrogates[1];
            if (lowSurrogateStart == otherLowSurrogateStart && lowSurrogateEnd == otherLowSurrogateEnd && otherLowSurrogates.length === 2) {
              if (dataIsSingleton(otherMapping[0])) {
                mapping[0] = dataAdd(mapping[0], otherMapping[0][0]);
              } else {
                mapping[0] = dataAddRange(
                  mapping[0],
                  otherMapping[0][0],
                  otherMapping[0][1] - 1
                );
              }
              surrogateMappings.splice(innerIndex, 1);
              --innerIndex;
            }
          }
        }
        return surrogateMappings;
      };
      var surrogateSet = function(data2) {
        if (!data2.length) {
          return [];
        }
        var index = 0;
        var start;
        var end;
        var startHigh;
        var startLow;
        var endHigh;
        var endLow;
        var surrogateMappings = [];
        var length3 = data2.length;
        while (index < length3) {
          start = data2[index];
          end = data2[index + 1] - 1;
          startHigh = highSurrogate(start);
          startLow = lowSurrogate(start);
          endHigh = highSurrogate(end);
          endLow = lowSurrogate(end);
          var startsWithLowestLowSurrogate = startLow == LOW_SURROGATE_MIN;
          var endsWithHighestLowSurrogate = endLow == LOW_SURROGATE_MAX;
          var complete = false;
          if (startHigh == endHigh || startsWithLowestLowSurrogate && endsWithHighestLowSurrogate) {
            surrogateMappings.push([
              [startHigh, endHigh + 1],
              [startLow, endLow + 1]
            ]);
            complete = true;
          } else {
            surrogateMappings.push([
              [startHigh, startHigh + 1],
              [startLow, LOW_SURROGATE_MAX + 1]
            ]);
          }
          if (!complete && startHigh + 1 < endHigh) {
            if (endsWithHighestLowSurrogate) {
              surrogateMappings.push([
                [startHigh + 1, endHigh + 1],
                [LOW_SURROGATE_MIN, endLow + 1]
              ]);
              complete = true;
            } else {
              surrogateMappings.push([
                [startHigh + 1, endHigh],
                [LOW_SURROGATE_MIN, LOW_SURROGATE_MAX + 1]
              ]);
            }
          }
          if (!complete) {
            surrogateMappings.push([
              [endHigh, endHigh + 1],
              [LOW_SURROGATE_MIN, endLow + 1]
            ]);
          }
          index += 2;
        }
        return optimizeSurrogateMappings(surrogateMappings);
      };
      var createSurrogateCharacterClasses = function(surrogateMappings) {
        var result = [];
        forEach(surrogateMappings, function(surrogateMapping) {
          var highSurrogates = surrogateMapping[0];
          var lowSurrogates = surrogateMapping[1];
          result.push(
            createBMPCharacterClasses(highSurrogates) + createBMPCharacterClasses(lowSurrogates)
          );
        });
        return result.join("|");
      };
      var createCharacterClassesFromData = function(data2, bmpOnly, hasUnicodeFlag) {
        if (hasUnicodeFlag) {
          return createUnicodeCharacterClasses(data2);
        }
        var result = [];
        var parts = splitAtBMP(data2);
        var loneHighSurrogates = parts.loneHighSurrogates;
        var loneLowSurrogates = parts.loneLowSurrogates;
        var bmp = parts.bmp;
        var astral = parts.astral;
        var hasLoneHighSurrogates = !dataIsEmpty(loneHighSurrogates);
        var hasLoneLowSurrogates = !dataIsEmpty(loneLowSurrogates);
        var surrogateMappings = surrogateSet(astral);
        if (bmpOnly) {
          bmp = dataUnion(bmp, loneHighSurrogates);
          hasLoneHighSurrogates = false;
          bmp = dataUnion(bmp, loneLowSurrogates);
          hasLoneLowSurrogates = false;
        }
        if (!dataIsEmpty(bmp)) {
          result.push(createBMPCharacterClasses(bmp));
        }
        if (surrogateMappings.length) {
          result.push(createSurrogateCharacterClasses(surrogateMappings));
        }
        if (hasLoneHighSurrogates) {
          result.push(
            createBMPCharacterClasses(loneHighSurrogates) + // Make sure the high surrogates aren’t part of a surrogate pair.
            "(?![\\uDC00-\\uDFFF])"
          );
        }
        if (hasLoneLowSurrogates) {
          result.push(
            // It is not possible to accurately assert the low surrogates aren’t
            // part of a surrogate pair, since JavaScript regular expressions do
            // not support lookbehind.
            "(?:[^\\uD800-\\uDBFF]|^)" + createBMPCharacterClasses(loneLowSurrogates)
          );
        }
        return result.join("|");
      };
      var regenerate = function(value) {
        if (arguments.length > 1) {
          value = slice2.call(arguments);
        }
        if (this instanceof regenerate) {
          this.data = [];
          return this.add(value);
        }
        return new regenerate().add(value);
      };
      regenerate.version = "1.4.2";
      var proto = regenerate.prototype;
      extend2(proto, {
        "add": function(value) {
          var $this = this;
          if (arguments.length > 1) {
            value = slice2.call(arguments);
          }
          if (value == null) {
            return $this;
          }
          if (value instanceof regenerate) {
            $this.data = dataUnion($this.data, value.data);
            return $this;
          }
          if (isArray2(value)) {
            $this.data = dataUnion($this.data, dataFromValues(value, true));
            return $this;
          }
          $this.data = dataAdd(
            $this.data,
            toCodePoint(value)
          );
          return $this;
        },
        "remove": function(value) {
          var $this = this;
          if (arguments.length > 1) {
            value = slice2.call(arguments);
          }
          if (value == null) {
            return $this;
          }
          if (value instanceof regenerate) {
            $this.data = dataDifference($this.data, value.data);
            return $this;
          }
          if (isArray2(value)) {
            $this.data = dataDifference($this.data, dataFromValues(value, false));
            return $this;
          }
          $this.data = dataRemove(
            $this.data,
            toCodePoint(value)
          );
          return $this;
        },
        "addRange": function(start, end) {
          var $this = this;
          $this.data = dataAddRange(
            $this.data,
            toCodePoint(start),
            toCodePoint(end)
          );
          return $this;
        },
        "removeRange": function(start, end) {
          var $this = this;
          var startCodePoint = toCodePoint(start);
          var endCodePoint = toCodePoint(end);
          $this.data = dataRemoveRange(
            $this.data,
            startCodePoint,
            endCodePoint
          );
          return $this;
        },
        "intersection": function(argument) {
          var $this = this;
          if (argument instanceof regenerate) {
            $this.data = dataIntersectionData($this.data, argument.data);
            return $this;
          }
          $this.data = dataIntersectionData(
            $this.data,
            dataFromValues(argument, false)
          );
          return $this;
        },
        "contains": function(codePoint) {
          return dataContains(
            this.data,
            isNumber(codePoint) ? codePoint : symbolToCodePoint(codePoint)
          );
        },
        "clone": function() {
          var set = new regenerate();
          set.data = this.data.slice(0);
          return set;
        },
        "toString": function(options) {
          var result = createCharacterClassesFromData(
            this.data,
            options ? options.bmpOnly : false,
            options ? options.hasUnicodeFlag : false
          );
          if (!result) {
            return "[]";
          }
          return result.replace(regexNull, "\\0$1");
        },
        "toRegExp": function(flags) {
          var pattern = this.toString(
            /[uv]/.test(flags || "") ? { "hasUnicodeFlag": true } : null
          );
          return RegExp(pattern, flags || "");
        },
        "valueOf": function() {
          return dataToArray(this.data);
        }
      });
      proto.toArray = proto.valueOf;
      if (typeof define == "function" && typeof define.amd == "object" && define.amd) {
        define(function() {
          return regenerate;
        });
      } else if (freeExports && !freeExports.nodeType) {
        if (freeModule) {
          freeModule.exports = regenerate;
        } else {
          freeExports.regenerate = regenerate;
        }
      } else {
        root.regenerate = regenerate;
      }
    })(exports);
  }
});

// node_modules/unicode-canonical-property-names-ecmascript/index.js
var require_unicode_canonical_property_names_ecmascript = __commonJS({
  "node_modules/unicode-canonical-property-names-ecmascript/index.js"(exports, module) {
    module.exports = /* @__PURE__ */ new Set([
      // Non-binary properties:
      "General_Category",
      "Script",
      "Script_Extensions",
      // Binary properties:
      "Alphabetic",
      "Any",
      "ASCII",
      "ASCII_Hex_Digit",
      "Assigned",
      "Bidi_Control",
      "Bidi_Mirrored",
      "Case_Ignorable",
      "Cased",
      "Changes_When_Casefolded",
      "Changes_When_Casemapped",
      "Changes_When_Lowercased",
      "Changes_When_NFKC_Casefolded",
      "Changes_When_Titlecased",
      "Changes_When_Uppercased",
      "Dash",
      "Default_Ignorable_Code_Point",
      "Deprecated",
      "Diacritic",
      "Emoji",
      "Emoji_Component",
      "Emoji_Modifier",
      "Emoji_Modifier_Base",
      "Emoji_Presentation",
      "Extended_Pictographic",
      "Extender",
      "Grapheme_Base",
      "Grapheme_Extend",
      "Hex_Digit",
      "ID_Continue",
      "ID_Start",
      "Ideographic",
      "IDS_Binary_Operator",
      "IDS_Trinary_Operator",
      "Join_Control",
      "Logical_Order_Exception",
      "Lowercase",
      "Math",
      "Noncharacter_Code_Point",
      "Pattern_Syntax",
      "Pattern_White_Space",
      "Quotation_Mark",
      "Radical",
      "Regional_Indicator",
      "Sentence_Terminal",
      "Soft_Dotted",
      "Terminal_Punctuation",
      "Unified_Ideograph",
      "Uppercase",
      "Variation_Selector",
      "White_Space",
      "XID_Continue",
      "XID_Start"
    ]);
  }
});

// node_modules/unicode-property-aliases-ecmascript/index.js
var require_unicode_property_aliases_ecmascript = __commonJS({
  "node_modules/unicode-property-aliases-ecmascript/index.js"(exports, module) {
    module.exports = /* @__PURE__ */ new Map([
      ["scx", "Script_Extensions"],
      ["sc", "Script"],
      ["gc", "General_Category"],
      ["AHex", "ASCII_Hex_Digit"],
      ["Alpha", "Alphabetic"],
      ["Bidi_C", "Bidi_Control"],
      ["Bidi_M", "Bidi_Mirrored"],
      ["Cased", "Cased"],
      ["CI", "Case_Ignorable"],
      ["CWCF", "Changes_When_Casefolded"],
      ["CWCM", "Changes_When_Casemapped"],
      ["CWKCF", "Changes_When_NFKC_Casefolded"],
      ["CWL", "Changes_When_Lowercased"],
      ["CWT", "Changes_When_Titlecased"],
      ["CWU", "Changes_When_Uppercased"],
      ["Dash", "Dash"],
      ["Dep", "Deprecated"],
      ["DI", "Default_Ignorable_Code_Point"],
      ["Dia", "Diacritic"],
      ["EBase", "Emoji_Modifier_Base"],
      ["EComp", "Emoji_Component"],
      ["EMod", "Emoji_Modifier"],
      ["Emoji", "Emoji"],
      ["EPres", "Emoji_Presentation"],
      ["Ext", "Extender"],
      ["ExtPict", "Extended_Pictographic"],
      ["Gr_Base", "Grapheme_Base"],
      ["Gr_Ext", "Grapheme_Extend"],
      ["Hex", "Hex_Digit"],
      ["IDC", "ID_Continue"],
      ["Ideo", "Ideographic"],
      ["IDS", "ID_Start"],
      ["IDSB", "IDS_Binary_Operator"],
      ["IDST", "IDS_Trinary_Operator"],
      ["Join_C", "Join_Control"],
      ["LOE", "Logical_Order_Exception"],
      ["Lower", "Lowercase"],
      ["Math", "Math"],
      ["NChar", "Noncharacter_Code_Point"],
      ["Pat_Syn", "Pattern_Syntax"],
      ["Pat_WS", "Pattern_White_Space"],
      ["QMark", "Quotation_Mark"],
      ["Radical", "Radical"],
      ["RI", "Regional_Indicator"],
      ["SD", "Soft_Dotted"],
      ["STerm", "Sentence_Terminal"],
      ["Term", "Terminal_Punctuation"],
      ["UIdeo", "Unified_Ideograph"],
      ["Upper", "Uppercase"],
      ["VS", "Variation_Selector"],
      ["WSpace", "White_Space"],
      ["space", "White_Space"],
      ["XIDC", "XID_Continue"],
      ["XIDS", "XID_Start"]
    ]);
  }
});

// node_modules/unicode-match-property-ecmascript/index.js
var require_unicode_match_property_ecmascript = __commonJS({
  "node_modules/unicode-match-property-ecmascript/index.js"(exports, module) {
    "use strict";
    var canonicalProperties = require_unicode_canonical_property_names_ecmascript();
    var propertyAliases = require_unicode_property_aliases_ecmascript();
    var matchProperty = function(property) {
      if (canonicalProperties.has(property)) {
        return property;
      }
      if (propertyAliases.has(property)) {
        return propertyAliases.get(property);
      }
      throw new Error(`Unknown property: ${property}`);
    };
    module.exports = matchProperty;
  }
});

// node_modules/unicode-match-property-value-ecmascript/data/mappings.js
var require_mappings = __commonJS({
  "node_modules/unicode-match-property-value-ecmascript/data/mappings.js"(exports, module) {
    module.exports = /* @__PURE__ */ new Map([
      ["General_Category", /* @__PURE__ */ new Map([
        ["C", "Other"],
        ["Cc", "Control"],
        ["cntrl", "Control"],
        ["Cf", "Format"],
        ["Cn", "Unassigned"],
        ["Co", "Private_Use"],
        ["Cs", "Surrogate"],
        ["L", "Letter"],
        ["LC", "Cased_Letter"],
        ["Ll", "Lowercase_Letter"],
        ["Lm", "Modifier_Letter"],
        ["Lo", "Other_Letter"],
        ["Lt", "Titlecase_Letter"],
        ["Lu", "Uppercase_Letter"],
        ["M", "Mark"],
        ["Combining_Mark", "Mark"],
        ["Mc", "Spacing_Mark"],
        ["Me", "Enclosing_Mark"],
        ["Mn", "Nonspacing_Mark"],
        ["N", "Number"],
        ["Nd", "Decimal_Number"],
        ["digit", "Decimal_Number"],
        ["Nl", "Letter_Number"],
        ["No", "Other_Number"],
        ["P", "Punctuation"],
        ["punct", "Punctuation"],
        ["Pc", "Connector_Punctuation"],
        ["Pd", "Dash_Punctuation"],
        ["Pe", "Close_Punctuation"],
        ["Pf", "Final_Punctuation"],
        ["Pi", "Initial_Punctuation"],
        ["Po", "Other_Punctuation"],
        ["Ps", "Open_Punctuation"],
        ["S", "Symbol"],
        ["Sc", "Currency_Symbol"],
        ["Sk", "Modifier_Symbol"],
        ["Sm", "Math_Symbol"],
        ["So", "Other_Symbol"],
        ["Z", "Separator"],
        ["Zl", "Line_Separator"],
        ["Zp", "Paragraph_Separator"],
        ["Zs", "Space_Separator"],
        ["Other", "Other"],
        ["Control", "Control"],
        ["Format", "Format"],
        ["Unassigned", "Unassigned"],
        ["Private_Use", "Private_Use"],
        ["Surrogate", "Surrogate"],
        ["Letter", "Letter"],
        ["Cased_Letter", "Cased_Letter"],
        ["Lowercase_Letter", "Lowercase_Letter"],
        ["Modifier_Letter", "Modifier_Letter"],
        ["Other_Letter", "Other_Letter"],
        ["Titlecase_Letter", "Titlecase_Letter"],
        ["Uppercase_Letter", "Uppercase_Letter"],
        ["Mark", "Mark"],
        ["Spacing_Mark", "Spacing_Mark"],
        ["Enclosing_Mark", "Enclosing_Mark"],
        ["Nonspacing_Mark", "Nonspacing_Mark"],
        ["Number", "Number"],
        ["Decimal_Number", "Decimal_Number"],
        ["Letter_Number", "Letter_Number"],
        ["Other_Number", "Other_Number"],
        ["Punctuation", "Punctuation"],
        ["Connector_Punctuation", "Connector_Punctuation"],
        ["Dash_Punctuation", "Dash_Punctuation"],
        ["Close_Punctuation", "Close_Punctuation"],
        ["Final_Punctuation", "Final_Punctuation"],
        ["Initial_Punctuation", "Initial_Punctuation"],
        ["Other_Punctuation", "Other_Punctuation"],
        ["Open_Punctuation", "Open_Punctuation"],
        ["Symbol", "Symbol"],
        ["Currency_Symbol", "Currency_Symbol"],
        ["Modifier_Symbol", "Modifier_Symbol"],
        ["Math_Symbol", "Math_Symbol"],
        ["Other_Symbol", "Other_Symbol"],
        ["Separator", "Separator"],
        ["Line_Separator", "Line_Separator"],
        ["Paragraph_Separator", "Paragraph_Separator"],
        ["Space_Separator", "Space_Separator"]
      ])],
      ["Script", /* @__PURE__ */ new Map([
        ["Adlm", "Adlam"],
        ["Aghb", "Caucasian_Albanian"],
        ["Ahom", "Ahom"],
        ["Arab", "Arabic"],
        ["Armi", "Imperial_Aramaic"],
        ["Armn", "Armenian"],
        ["Avst", "Avestan"],
        ["Bali", "Balinese"],
        ["Bamu", "Bamum"],
        ["Bass", "Bassa_Vah"],
        ["Batk", "Batak"],
        ["Beng", "Bengali"],
        ["Bhks", "Bhaiksuki"],
        ["Bopo", "Bopomofo"],
        ["Brah", "Brahmi"],
        ["Brai", "Braille"],
        ["Bugi", "Buginese"],
        ["Buhd", "Buhid"],
        ["Cakm", "Chakma"],
        ["Cans", "Canadian_Aboriginal"],
        ["Cari", "Carian"],
        ["Cham", "Cham"],
        ["Cher", "Cherokee"],
        ["Chrs", "Chorasmian"],
        ["Copt", "Coptic"],
        ["Qaac", "Coptic"],
        ["Cprt", "Cypriot"],
        ["Cyrl", "Cyrillic"],
        ["Deva", "Devanagari"],
        ["Diak", "Dives_Akuru"],
        ["Dogr", "Dogra"],
        ["Dsrt", "Deseret"],
        ["Dupl", "Duployan"],
        ["Egyp", "Egyptian_Hieroglyphs"],
        ["Elba", "Elbasan"],
        ["Elym", "Elymaic"],
        ["Ethi", "Ethiopic"],
        ["Geor", "Georgian"],
        ["Glag", "Glagolitic"],
        ["Gong", "Gunjala_Gondi"],
        ["Gonm", "Masaram_Gondi"],
        ["Goth", "Gothic"],
        ["Gran", "Grantha"],
        ["Grek", "Greek"],
        ["Gujr", "Gujarati"],
        ["Guru", "Gurmukhi"],
        ["Hang", "Hangul"],
        ["Hani", "Han"],
        ["Hano", "Hanunoo"],
        ["Hatr", "Hatran"],
        ["Hebr", "Hebrew"],
        ["Hira", "Hiragana"],
        ["Hluw", "Anatolian_Hieroglyphs"],
        ["Hmng", "Pahawh_Hmong"],
        ["Hmnp", "Nyiakeng_Puachue_Hmong"],
        ["Hrkt", "Katakana_Or_Hiragana"],
        ["Hung", "Old_Hungarian"],
        ["Ital", "Old_Italic"],
        ["Java", "Javanese"],
        ["Kali", "Kayah_Li"],
        ["Kana", "Katakana"],
        ["Khar", "Kharoshthi"],
        ["Khmr", "Khmer"],
        ["Khoj", "Khojki"],
        ["Kits", "Khitan_Small_Script"],
        ["Knda", "Kannada"],
        ["Kthi", "Kaithi"],
        ["Lana", "Tai_Tham"],
        ["Laoo", "Lao"],
        ["Latn", "Latin"],
        ["Lepc", "Lepcha"],
        ["Limb", "Limbu"],
        ["Lina", "Linear_A"],
        ["Linb", "Linear_B"],
        ["Lisu", "Lisu"],
        ["Lyci", "Lycian"],
        ["Lydi", "Lydian"],
        ["Mahj", "Mahajani"],
        ["Maka", "Makasar"],
        ["Mand", "Mandaic"],
        ["Mani", "Manichaean"],
        ["Marc", "Marchen"],
        ["Medf", "Medefaidrin"],
        ["Mend", "Mende_Kikakui"],
        ["Merc", "Meroitic_Cursive"],
        ["Mero", "Meroitic_Hieroglyphs"],
        ["Mlym", "Malayalam"],
        ["Modi", "Modi"],
        ["Mong", "Mongolian"],
        ["Mroo", "Mro"],
        ["Mtei", "Meetei_Mayek"],
        ["Mult", "Multani"],
        ["Mymr", "Myanmar"],
        ["Nand", "Nandinagari"],
        ["Narb", "Old_North_Arabian"],
        ["Nbat", "Nabataean"],
        ["Newa", "Newa"],
        ["Nkoo", "Nko"],
        ["Nshu", "Nushu"],
        ["Ogam", "Ogham"],
        ["Olck", "Ol_Chiki"],
        ["Orkh", "Old_Turkic"],
        ["Orya", "Oriya"],
        ["Osge", "Osage"],
        ["Osma", "Osmanya"],
        ["Palm", "Palmyrene"],
        ["Pauc", "Pau_Cin_Hau"],
        ["Perm", "Old_Permic"],
        ["Phag", "Phags_Pa"],
        ["Phli", "Inscriptional_Pahlavi"],
        ["Phlp", "Psalter_Pahlavi"],
        ["Phnx", "Phoenician"],
        ["Plrd", "Miao"],
        ["Prti", "Inscriptional_Parthian"],
        ["Rjng", "Rejang"],
        ["Rohg", "Hanifi_Rohingya"],
        ["Runr", "Runic"],
        ["Samr", "Samaritan"],
        ["Sarb", "Old_South_Arabian"],
        ["Saur", "Saurashtra"],
        ["Sgnw", "SignWriting"],
        ["Shaw", "Shavian"],
        ["Shrd", "Sharada"],
        ["Sidd", "Siddham"],
        ["Sind", "Khudawadi"],
        ["Sinh", "Sinhala"],
        ["Sogd", "Sogdian"],
        ["Sogo", "Old_Sogdian"],
        ["Sora", "Sora_Sompeng"],
        ["Soyo", "Soyombo"],
        ["Sund", "Sundanese"],
        ["Sylo", "Syloti_Nagri"],
        ["Syrc", "Syriac"],
        ["Tagb", "Tagbanwa"],
        ["Takr", "Takri"],
        ["Tale", "Tai_Le"],
        ["Talu", "New_Tai_Lue"],
        ["Taml", "Tamil"],
        ["Tang", "Tangut"],
        ["Tavt", "Tai_Viet"],
        ["Telu", "Telugu"],
        ["Tfng", "Tifinagh"],
        ["Tglg", "Tagalog"],
        ["Thaa", "Thaana"],
        ["Thai", "Thai"],
        ["Tibt", "Tibetan"],
        ["Tirh", "Tirhuta"],
        ["Ugar", "Ugaritic"],
        ["Vaii", "Vai"],
        ["Wara", "Warang_Citi"],
        ["Wcho", "Wancho"],
        ["Xpeo", "Old_Persian"],
        ["Xsux", "Cuneiform"],
        ["Yezi", "Yezidi"],
        ["Yiii", "Yi"],
        ["Zanb", "Zanabazar_Square"],
        ["Zinh", "Inherited"],
        ["Qaai", "Inherited"],
        ["Zyyy", "Common"],
        ["Zzzz", "Unknown"],
        ["Adlam", "Adlam"],
        ["Caucasian_Albanian", "Caucasian_Albanian"],
        ["Arabic", "Arabic"],
        ["Imperial_Aramaic", "Imperial_Aramaic"],
        ["Armenian", "Armenian"],
        ["Avestan", "Avestan"],
        ["Balinese", "Balinese"],
        ["Bamum", "Bamum"],
        ["Bassa_Vah", "Bassa_Vah"],
        ["Batak", "Batak"],
        ["Bengali", "Bengali"],
        ["Bhaiksuki", "Bhaiksuki"],
        ["Bopomofo", "Bopomofo"],
        ["Brahmi", "Brahmi"],
        ["Braille", "Braille"],
        ["Buginese", "Buginese"],
        ["Buhid", "Buhid"],
        ["Chakma", "Chakma"],
        ["Canadian_Aboriginal", "Canadian_Aboriginal"],
        ["Carian", "Carian"],
        ["Cherokee", "Cherokee"],
        ["Chorasmian", "Chorasmian"],
        ["Coptic", "Coptic"],
        ["Cypriot", "Cypriot"],
        ["Cyrillic", "Cyrillic"],
        ["Devanagari", "Devanagari"],
        ["Dives_Akuru", "Dives_Akuru"],
        ["Dogra", "Dogra"],
        ["Deseret", "Deseret"],
        ["Duployan", "Duployan"],
        ["Egyptian_Hieroglyphs", "Egyptian_Hieroglyphs"],
        ["Elbasan", "Elbasan"],
        ["Elymaic", "Elymaic"],
        ["Ethiopic", "Ethiopic"],
        ["Georgian", "Georgian"],
        ["Glagolitic", "Glagolitic"],
        ["Gunjala_Gondi", "Gunjala_Gondi"],
        ["Masaram_Gondi", "Masaram_Gondi"],
        ["Gothic", "Gothic"],
        ["Grantha", "Grantha"],
        ["Greek", "Greek"],
        ["Gujarati", "Gujarati"],
        ["Gurmukhi", "Gurmukhi"],
        ["Hangul", "Hangul"],
        ["Han", "Han"],
        ["Hanunoo", "Hanunoo"],
        ["Hatran", "Hatran"],
        ["Hebrew", "Hebrew"],
        ["Hiragana", "Hiragana"],
        ["Anatolian_Hieroglyphs", "Anatolian_Hieroglyphs"],
        ["Pahawh_Hmong", "Pahawh_Hmong"],
        ["Nyiakeng_Puachue_Hmong", "Nyiakeng_Puachue_Hmong"],
        ["Katakana_Or_Hiragana", "Katakana_Or_Hiragana"],
        ["Old_Hungarian", "Old_Hungarian"],
        ["Old_Italic", "Old_Italic"],
        ["Javanese", "Javanese"],
        ["Kayah_Li", "Kayah_Li"],
        ["Katakana", "Katakana"],
        ["Kharoshthi", "Kharoshthi"],
        ["Khmer", "Khmer"],
        ["Khojki", "Khojki"],
        ["Khitan_Small_Script", "Khitan_Small_Script"],
        ["Kannada", "Kannada"],
        ["Kaithi", "Kaithi"],
        ["Tai_Tham", "Tai_Tham"],
        ["Lao", "Lao"],
        ["Latin", "Latin"],
        ["Lepcha", "Lepcha"],
        ["Limbu", "Limbu"],
        ["Linear_A", "Linear_A"],
        ["Linear_B", "Linear_B"],
        ["Lycian", "Lycian"],
        ["Lydian", "Lydian"],
        ["Mahajani", "Mahajani"],
        ["Makasar", "Makasar"],
        ["Mandaic", "Mandaic"],
        ["Manichaean", "Manichaean"],
        ["Marchen", "Marchen"],
        ["Medefaidrin", "Medefaidrin"],
        ["Mende_Kikakui", "Mende_Kikakui"],
        ["Meroitic_Cursive", "Meroitic_Cursive"],
        ["Meroitic_Hieroglyphs", "Meroitic_Hieroglyphs"],
        ["Malayalam", "Malayalam"],
        ["Mongolian", "Mongolian"],
        ["Mro", "Mro"],
        ["Meetei_Mayek", "Meetei_Mayek"],
        ["Multani", "Multani"],
        ["Myanmar", "Myanmar"],
        ["Nandinagari", "Nandinagari"],
        ["Old_North_Arabian", "Old_North_Arabian"],
        ["Nabataean", "Nabataean"],
        ["Nko", "Nko"],
        ["Nushu", "Nushu"],
        ["Ogham", "Ogham"],
        ["Ol_Chiki", "Ol_Chiki"],
        ["Old_Turkic", "Old_Turkic"],
        ["Oriya", "Oriya"],
        ["Osage", "Osage"],
        ["Osmanya", "Osmanya"],
        ["Palmyrene", "Palmyrene"],
        ["Pau_Cin_Hau", "Pau_Cin_Hau"],
        ["Old_Permic", "Old_Permic"],
        ["Phags_Pa", "Phags_Pa"],
        ["Inscriptional_Pahlavi", "Inscriptional_Pahlavi"],
        ["Psalter_Pahlavi", "Psalter_Pahlavi"],
        ["Phoenician", "Phoenician"],
        ["Miao", "Miao"],
        ["Inscriptional_Parthian", "Inscriptional_Parthian"],
        ["Rejang", "Rejang"],
        ["Hanifi_Rohingya", "Hanifi_Rohingya"],
        ["Runic", "Runic"],
        ["Samaritan", "Samaritan"],
        ["Old_South_Arabian", "Old_South_Arabian"],
        ["Saurashtra", "Saurashtra"],
        ["SignWriting", "SignWriting"],
        ["Shavian", "Shavian"],
        ["Sharada", "Sharada"],
        ["Siddham", "Siddham"],
        ["Khudawadi", "Khudawadi"],
        ["Sinhala", "Sinhala"],
        ["Sogdian", "Sogdian"],
        ["Old_Sogdian", "Old_Sogdian"],
        ["Sora_Sompeng", "Sora_Sompeng"],
        ["Soyombo", "Soyombo"],
        ["Sundanese", "Sundanese"],
        ["Syloti_Nagri", "Syloti_Nagri"],
        ["Syriac", "Syriac"],
        ["Tagbanwa", "Tagbanwa"],
        ["Takri", "Takri"],
        ["Tai_Le", "Tai_Le"],
        ["New_Tai_Lue", "New_Tai_Lue"],
        ["Tamil", "Tamil"],
        ["Tangut", "Tangut"],
        ["Tai_Viet", "Tai_Viet"],
        ["Telugu", "Telugu"],
        ["Tifinagh", "Tifinagh"],
        ["Tagalog", "Tagalog"],
        ["Thaana", "Thaana"],
        ["Tibetan", "Tibetan"],
        ["Tirhuta", "Tirhuta"],
        ["Ugaritic", "Ugaritic"],
        ["Vai", "Vai"],
        ["Warang_Citi", "Warang_Citi"],
        ["Wancho", "Wancho"],
        ["Old_Persian", "Old_Persian"],
        ["Cuneiform", "Cuneiform"],
        ["Yezidi", "Yezidi"],
        ["Yi", "Yi"],
        ["Zanabazar_Square", "Zanabazar_Square"],
        ["Inherited", "Inherited"],
        ["Common", "Common"],
        ["Unknown", "Unknown"]
      ])],
      ["Script_Extensions", /* @__PURE__ */ new Map([
        ["Adlm", "Adlam"],
        ["Aghb", "Caucasian_Albanian"],
        ["Ahom", "Ahom"],
        ["Arab", "Arabic"],
        ["Armi", "Imperial_Aramaic"],
        ["Armn", "Armenian"],
        ["Avst", "Avestan"],
        ["Bali", "Balinese"],
        ["Bamu", "Bamum"],
        ["Bass", "Bassa_Vah"],
        ["Batk", "Batak"],
        ["Beng", "Bengali"],
        ["Bhks", "Bhaiksuki"],
        ["Bopo", "Bopomofo"],
        ["Brah", "Brahmi"],
        ["Brai", "Braille"],
        ["Bugi", "Buginese"],
        ["Buhd", "Buhid"],
        ["Cakm", "Chakma"],
        ["Cans", "Canadian_Aboriginal"],
        ["Cari", "Carian"],
        ["Cham", "Cham"],
        ["Cher", "Cherokee"],
        ["Chrs", "Chorasmian"],
        ["Copt", "Coptic"],
        ["Qaac", "Coptic"],
        ["Cprt", "Cypriot"],
        ["Cyrl", "Cyrillic"],
        ["Deva", "Devanagari"],
        ["Diak", "Dives_Akuru"],
        ["Dogr", "Dogra"],
        ["Dsrt", "Deseret"],
        ["Dupl", "Duployan"],
        ["Egyp", "Egyptian_Hieroglyphs"],
        ["Elba", "Elbasan"],
        ["Elym", "Elymaic"],
        ["Ethi", "Ethiopic"],
        ["Geor", "Georgian"],
        ["Glag", "Glagolitic"],
        ["Gong", "Gunjala_Gondi"],
        ["Gonm", "Masaram_Gondi"],
        ["Goth", "Gothic"],
        ["Gran", "Grantha"],
        ["Grek", "Greek"],
        ["Gujr", "Gujarati"],
        ["Guru", "Gurmukhi"],
        ["Hang", "Hangul"],
        ["Hani", "Han"],
        ["Hano", "Hanunoo"],
        ["Hatr", "Hatran"],
        ["Hebr", "Hebrew"],
        ["Hira", "Hiragana"],
        ["Hluw", "Anatolian_Hieroglyphs"],
        ["Hmng", "Pahawh_Hmong"],
        ["Hmnp", "Nyiakeng_Puachue_Hmong"],
        ["Hrkt", "Katakana_Or_Hiragana"],
        ["Hung", "Old_Hungarian"],
        ["Ital", "Old_Italic"],
        ["Java", "Javanese"],
        ["Kali", "Kayah_Li"],
        ["Kana", "Katakana"],
        ["Khar", "Kharoshthi"],
        ["Khmr", "Khmer"],
        ["Khoj", "Khojki"],
        ["Kits", "Khitan_Small_Script"],
        ["Knda", "Kannada"],
        ["Kthi", "Kaithi"],
        ["Lana", "Tai_Tham"],
        ["Laoo", "Lao"],
        ["Latn", "Latin"],
        ["Lepc", "Lepcha"],
        ["Limb", "Limbu"],
        ["Lina", "Linear_A"],
        ["Linb", "Linear_B"],
        ["Lisu", "Lisu"],
        ["Lyci", "Lycian"],
        ["Lydi", "Lydian"],
        ["Mahj", "Mahajani"],
        ["Maka", "Makasar"],
        ["Mand", "Mandaic"],
        ["Mani", "Manichaean"],
        ["Marc", "Marchen"],
        ["Medf", "Medefaidrin"],
        ["Mend", "Mende_Kikakui"],
        ["Merc", "Meroitic_Cursive"],
        ["Mero", "Meroitic_Hieroglyphs"],
        ["Mlym", "Malayalam"],
        ["Modi", "Modi"],
        ["Mong", "Mongolian"],
        ["Mroo", "Mro"],
        ["Mtei", "Meetei_Mayek"],
        ["Mult", "Multani"],
        ["Mymr", "Myanmar"],
        ["Nand", "Nandinagari"],
        ["Narb", "Old_North_Arabian"],
        ["Nbat", "Nabataean"],
        ["Newa", "Newa"],
        ["Nkoo", "Nko"],
        ["Nshu", "Nushu"],
        ["Ogam", "Ogham"],
        ["Olck", "Ol_Chiki"],
        ["Orkh", "Old_Turkic"],
        ["Orya", "Oriya"],
        ["Osge", "Osage"],
        ["Osma", "Osmanya"],
        ["Palm", "Palmyrene"],
        ["Pauc", "Pau_Cin_Hau"],
        ["Perm", "Old_Permic"],
        ["Phag", "Phags_Pa"],
        ["Phli", "Inscriptional_Pahlavi"],
        ["Phlp", "Psalter_Pahlavi"],
        ["Phnx", "Phoenician"],
        ["Plrd", "Miao"],
        ["Prti", "Inscriptional_Parthian"],
        ["Rjng", "Rejang"],
        ["Rohg", "Hanifi_Rohingya"],
        ["Runr", "Runic"],
        ["Samr", "Samaritan"],
        ["Sarb", "Old_South_Arabian"],
        ["Saur", "Saurashtra"],
        ["Sgnw", "SignWriting"],
        ["Shaw", "Shavian"],
        ["Shrd", "Sharada"],
        ["Sidd", "Siddham"],
        ["Sind", "Khudawadi"],
        ["Sinh", "Sinhala"],
        ["Sogd", "Sogdian"],
        ["Sogo", "Old_Sogdian"],
        ["Sora", "Sora_Sompeng"],
        ["Soyo", "Soyombo"],
        ["Sund", "Sundanese"],
        ["Sylo", "Syloti_Nagri"],
        ["Syrc", "Syriac"],
        ["Tagb", "Tagbanwa"],
        ["Takr", "Takri"],
        ["Tale", "Tai_Le"],
        ["Talu", "New_Tai_Lue"],
        ["Taml", "Tamil"],
        ["Tang", "Tangut"],
        ["Tavt", "Tai_Viet"],
        ["Telu", "Telugu"],
        ["Tfng", "Tifinagh"],
        ["Tglg", "Tagalog"],
        ["Thaa", "Thaana"],
        ["Thai", "Thai"],
        ["Tibt", "Tibetan"],
        ["Tirh", "Tirhuta"],
        ["Ugar", "Ugaritic"],
        ["Vaii", "Vai"],
        ["Wara", "Warang_Citi"],
        ["Wcho", "Wancho"],
        ["Xpeo", "Old_Persian"],
        ["Xsux", "Cuneiform"],
        ["Yezi", "Yezidi"],
        ["Yiii", "Yi"],
        ["Zanb", "Zanabazar_Square"],
        ["Zinh", "Inherited"],
        ["Qaai", "Inherited"],
        ["Zyyy", "Common"],
        ["Zzzz", "Unknown"],
        ["Adlam", "Adlam"],
        ["Caucasian_Albanian", "Caucasian_Albanian"],
        ["Arabic", "Arabic"],
        ["Imperial_Aramaic", "Imperial_Aramaic"],
        ["Armenian", "Armenian"],
        ["Avestan", "Avestan"],
        ["Balinese", "Balinese"],
        ["Bamum", "Bamum"],
        ["Bassa_Vah", "Bassa_Vah"],
        ["Batak", "Batak"],
        ["Bengali", "Bengali"],
        ["Bhaiksuki", "Bhaiksuki"],
        ["Bopomofo", "Bopomofo"],
        ["Brahmi", "Brahmi"],
        ["Braille", "Braille"],
        ["Buginese", "Buginese"],
        ["Buhid", "Buhid"],
        ["Chakma", "Chakma"],
        ["Canadian_Aboriginal", "Canadian_Aboriginal"],
        ["Carian", "Carian"],
        ["Cherokee", "Cherokee"],
        ["Chorasmian", "Chorasmian"],
        ["Coptic", "Coptic"],
        ["Cypriot", "Cypriot"],
        ["Cyrillic", "Cyrillic"],
        ["Devanagari", "Devanagari"],
        ["Dives_Akuru", "Dives_Akuru"],
        ["Dogra", "Dogra"],
        ["Deseret", "Deseret"],
        ["Duployan", "Duployan"],
        ["Egyptian_Hieroglyphs", "Egyptian_Hieroglyphs"],
        ["Elbasan", "Elbasan"],
        ["Elymaic", "Elymaic"],
        ["Ethiopic", "Ethiopic"],
        ["Georgian", "Georgian"],
        ["Glagolitic", "Glagolitic"],
        ["Gunjala_Gondi", "Gunjala_Gondi"],
        ["Masaram_Gondi", "Masaram_Gondi"],
        ["Gothic", "Gothic"],
        ["Grantha", "Grantha"],
        ["Greek", "Greek"],
        ["Gujarati", "Gujarati"],
        ["Gurmukhi", "Gurmukhi"],
        ["Hangul", "Hangul"],
        ["Han", "Han"],
        ["Hanunoo", "Hanunoo"],
        ["Hatran", "Hatran"],
        ["Hebrew", "Hebrew"],
        ["Hiragana", "Hiragana"],
        ["Anatolian_Hieroglyphs", "Anatolian_Hieroglyphs"],
        ["Pahawh_Hmong", "Pahawh_Hmong"],
        ["Nyiakeng_Puachue_Hmong", "Nyiakeng_Puachue_Hmong"],
        ["Katakana_Or_Hiragana", "Katakana_Or_Hiragana"],
        ["Old_Hungarian", "Old_Hungarian"],
        ["Old_Italic", "Old_Italic"],
        ["Javanese", "Javanese"],
        ["Kayah_Li", "Kayah_Li"],
        ["Katakana", "Katakana"],
        ["Kharoshthi", "Kharoshthi"],
        ["Khmer", "Khmer"],
        ["Khojki", "Khojki"],
        ["Khitan_Small_Script", "Khitan_Small_Script"],
        ["Kannada", "Kannada"],
        ["Kaithi", "Kaithi"],
        ["Tai_Tham", "Tai_Tham"],
        ["Lao", "Lao"],
        ["Latin", "Latin"],
        ["Lepcha", "Lepcha"],
        ["Limbu", "Limbu"],
        ["Linear_A", "Linear_A"],
        ["Linear_B", "Linear_B"],
        ["Lycian", "Lycian"],
        ["Lydian", "Lydian"],
        ["Mahajani", "Mahajani"],
        ["Makasar", "Makasar"],
        ["Mandaic", "Mandaic"],
        ["Manichaean", "Manichaean"],
        ["Marchen", "Marchen"],
        ["Medefaidrin", "Medefaidrin"],
        ["Mende_Kikakui", "Mende_Kikakui"],
        ["Meroitic_Cursive", "Meroitic_Cursive"],
        ["Meroitic_Hieroglyphs", "Meroitic_Hieroglyphs"],
        ["Malayalam", "Malayalam"],
        ["Mongolian", "Mongolian"],
        ["Mro", "Mro"],
        ["Meetei_Mayek", "Meetei_Mayek"],
        ["Multani", "Multani"],
        ["Myanmar", "Myanmar"],
        ["Nandinagari", "Nandinagari"],
        ["Old_North_Arabian", "Old_North_Arabian"],
        ["Nabataean", "Nabataean"],
        ["Nko", "Nko"],
        ["Nushu", "Nushu"],
        ["Ogham", "Ogham"],
        ["Ol_Chiki", "Ol_Chiki"],
        ["Old_Turkic", "Old_Turkic"],
        ["Oriya", "Oriya"],
        ["Osage", "Osage"],
        ["Osmanya", "Osmanya"],
        ["Palmyrene", "Palmyrene"],
        ["Pau_Cin_Hau", "Pau_Cin_Hau"],
        ["Old_Permic", "Old_Permic"],
        ["Phags_Pa", "Phags_Pa"],
        ["Inscriptional_Pahlavi", "Inscriptional_Pahlavi"],
        ["Psalter_Pahlavi", "Psalter_Pahlavi"],
        ["Phoenician", "Phoenician"],
        ["Miao", "Miao"],
        ["Inscriptional_Parthian", "Inscriptional_Parthian"],
        ["Rejang", "Rejang"],
        ["Hanifi_Rohingya", "Hanifi_Rohingya"],
        ["Runic", "Runic"],
        ["Samaritan", "Samaritan"],
        ["Old_South_Arabian", "Old_South_Arabian"],
        ["Saurashtra", "Saurashtra"],
        ["SignWriting", "SignWriting"],
        ["Shavian", "Shavian"],
        ["Sharada", "Sharada"],
        ["Siddham", "Siddham"],
        ["Khudawadi", "Khudawadi"],
        ["Sinhala", "Sinhala"],
        ["Sogdian", "Sogdian"],
        ["Old_Sogdian", "Old_Sogdian"],
        ["Sora_Sompeng", "Sora_Sompeng"],
        ["Soyombo", "Soyombo"],
        ["Sundanese", "Sundanese"],
        ["Syloti_Nagri", "Syloti_Nagri"],
        ["Syriac", "Syriac"],
        ["Tagbanwa", "Tagbanwa"],
        ["Takri", "Takri"],
        ["Tai_Le", "Tai_Le"],
        ["New_Tai_Lue", "New_Tai_Lue"],
        ["Tamil", "Tamil"],
        ["Tangut", "Tangut"],
        ["Tai_Viet", "Tai_Viet"],
        ["Telugu", "Telugu"],
        ["Tifinagh", "Tifinagh"],
        ["Tagalog", "Tagalog"],
        ["Thaana", "Thaana"],
        ["Tibetan", "Tibetan"],
        ["Tirhuta", "Tirhuta"],
        ["Ugaritic", "Ugaritic"],
        ["Vai", "Vai"],
        ["Warang_Citi", "Warang_Citi"],
        ["Wancho", "Wancho"],
        ["Old_Persian", "Old_Persian"],
        ["Cuneiform", "Cuneiform"],
        ["Yezidi", "Yezidi"],
        ["Yi", "Yi"],
        ["Zanabazar_Square", "Zanabazar_Square"],
        ["Inherited", "Inherited"],
        ["Common", "Common"],
        ["Unknown", "Unknown"]
      ])]
    ]);
  }
});

// node_modules/unicode-match-property-value-ecmascript/index.js
var require_unicode_match_property_value_ecmascript = __commonJS({
  "node_modules/unicode-match-property-value-ecmascript/index.js"(exports, module) {
    "use strict";
    var propertyToValueAliases = require_mappings();
    var matchPropertyValue = function(property, value) {
      const aliasToValue = propertyToValueAliases.get(property);
      if (!aliasToValue) {
        throw new Error(`Unknown property \`${property}\`.`);
      }
      const canonicalValue = aliasToValue.get(value);
      if (canonicalValue) {
        return canonicalValue;
      }
      throw new Error(
        `Unknown value \`${value}\` for property \`${property}\`.`
      );
    };
    module.exports = matchPropertyValue;
  }
});

// node_modules/regexpu-core/data/iu-mappings.js
var require_iu_mappings = __commonJS({
  "node_modules/regexpu-core/data/iu-mappings.js"(exports, module) {
    module.exports = /* @__PURE__ */ new Map([
      [75, 8490],
      [83, 383],
      [107, 8490],
      [115, 383],
      [181, 924],
      [197, 8491],
      [223, 7838],
      [229, 8491],
      [383, 83],
      [452, 453],
      [453, 452],
      [455, 456],
      [456, 455],
      [458, 459],
      [459, 458],
      [497, 498],
      [498, 497],
      [618, 42926],
      [642, 42949],
      [669, 42930],
      [837, 8126],
      [914, 976],
      [917, 1013],
      [920, 1012],
      [921, 8126],
      [922, 1008],
      [924, 181],
      [928, 982],
      [929, 1009],
      [931, 962],
      [934, 981],
      [937, 8486],
      [952, 1012],
      [962, 931],
      [969, 8486],
      [976, 914],
      [977, 1012],
      [981, 934],
      [982, 928],
      [1008, 922],
      [1009, 929],
      [1012, [
        920,
        977,
        952
      ]],
      [1013, 917],
      [1042, 7296],
      [1044, 7297],
      [1054, 7298],
      [1057, 7299],
      [1058, 7301],
      [1066, 7302],
      [1074, 7296],
      [1076, 7297],
      [1086, 7298],
      [1089, 7299],
      [1090, [
        7300,
        7301
      ]],
      [1098, 7302],
      [1122, 7303],
      [1123, 7303],
      [4304, 7312],
      [4305, 7313],
      [4306, 7314],
      [4307, 7315],
      [4308, 7316],
      [4309, 7317],
      [4310, 7318],
      [4311, 7319],
      [4312, 7320],
      [4313, 7321],
      [4314, 7322],
      [4315, 7323],
      [4316, 7324],
      [4317, 7325],
      [4318, 7326],
      [4319, 7327],
      [4320, 7328],
      [4321, 7329],
      [4322, 7330],
      [4323, 7331],
      [4324, 7332],
      [4325, 7333],
      [4326, 7334],
      [4327, 7335],
      [4328, 7336],
      [4329, 7337],
      [4330, 7338],
      [4331, 7339],
      [4332, 7340],
      [4333, 7341],
      [4334, 7342],
      [4335, 7343],
      [4336, 7344],
      [4337, 7345],
      [4338, 7346],
      [4339, 7347],
      [4340, 7348],
      [4341, 7349],
      [4342, 7350],
      [4343, 7351],
      [4344, 7352],
      [4345, 7353],
      [4346, 7354],
      [4349, 7357],
      [4350, 7358],
      [4351, 7359],
      [5024, 43888],
      [5025, 43889],
      [5026, 43890],
      [5027, 43891],
      [5028, 43892],
      [5029, 43893],
      [5030, 43894],
      [5031, 43895],
      [5032, 43896],
      [5033, 43897],
      [5034, 43898],
      [5035, 43899],
      [5036, 43900],
      [5037, 43901],
      [5038, 43902],
      [5039, 43903],
      [5040, 43904],
      [5041, 43905],
      [5042, 43906],
      [5043, 43907],
      [5044, 43908],
      [5045, 43909],
      [5046, 43910],
      [5047, 43911],
      [5048, 43912],
      [5049, 43913],
      [5050, 43914],
      [5051, 43915],
      [5052, 43916],
      [5053, 43917],
      [5054, 43918],
      [5055, 43919],
      [5056, 43920],
      [5057, 43921],
      [5058, 43922],
      [5059, 43923],
      [5060, 43924],
      [5061, 43925],
      [5062, 43926],
      [5063, 43927],
      [5064, 43928],
      [5065, 43929],
      [5066, 43930],
      [5067, 43931],
      [5068, 43932],
      [5069, 43933],
      [5070, 43934],
      [5071, 43935],
      [5072, 43936],
      [5073, 43937],
      [5074, 43938],
      [5075, 43939],
      [5076, 43940],
      [5077, 43941],
      [5078, 43942],
      [5079, 43943],
      [5080, 43944],
      [5081, 43945],
      [5082, 43946],
      [5083, 43947],
      [5084, 43948],
      [5085, 43949],
      [5086, 43950],
      [5087, 43951],
      [5088, 43952],
      [5089, 43953],
      [5090, 43954],
      [5091, 43955],
      [5092, 43956],
      [5093, 43957],
      [5094, 43958],
      [5095, 43959],
      [5096, 43960],
      [5097, 43961],
      [5098, 43962],
      [5099, 43963],
      [5100, 43964],
      [5101, 43965],
      [5102, 43966],
      [5103, 43967],
      [5104, 5112],
      [5105, 5113],
      [5106, 5114],
      [5107, 5115],
      [5108, 5116],
      [5109, 5117],
      [5112, 5104],
      [5113, 5105],
      [5114, 5106],
      [5115, 5107],
      [5116, 5108],
      [5117, 5109],
      [7296, [
        1042,
        1074
      ]],
      [7297, [
        1044,
        1076
      ]],
      [7298, [
        1054,
        1086
      ]],
      [7299, [
        1057,
        1089
      ]],
      [7300, [
        7301,
        1090
      ]],
      [7301, [
        1058,
        7300,
        1090
      ]],
      [7302, [
        1066,
        1098
      ]],
      [7303, [
        1122,
        1123
      ]],
      [7304, [
        42570,
        42571
      ]],
      [7312, 4304],
      [7313, 4305],
      [7314, 4306],
      [7315, 4307],
      [7316, 4308],
      [7317, 4309],
      [7318, 4310],
      [7319, 4311],
      [7320, 4312],
      [7321, 4313],
      [7322, 4314],
      [7323, 4315],
      [7324, 4316],
      [7325, 4317],
      [7326, 4318],
      [7327, 4319],
      [7328, 4320],
      [7329, 4321],
      [7330, 4322],
      [7331, 4323],
      [7332, 4324],
      [7333, 4325],
      [7334, 4326],
      [7335, 4327],
      [7336, 4328],
      [7337, 4329],
      [7338, 4330],
      [7339, 4331],
      [7340, 4332],
      [7341, 4333],
      [7342, 4334],
      [7343, 4335],
      [7344, 4336],
      [7345, 4337],
      [7346, 4338],
      [7347, 4339],
      [7348, 4340],
      [7349, 4341],
      [7350, 4342],
      [7351, 4343],
      [7352, 4344],
      [7353, 4345],
      [7354, 4346],
      [7357, 4349],
      [7358, 4350],
      [7359, 4351],
      [7566, 42950],
      [7776, 7835],
      [7835, 7776],
      [7838, 223],
      [8064, 8072],
      [8065, 8073],
      [8066, 8074],
      [8067, 8075],
      [8068, 8076],
      [8069, 8077],
      [8070, 8078],
      [8071, 8079],
      [8072, 8064],
      [8073, 8065],
      [8074, 8066],
      [8075, 8067],
      [8076, 8068],
      [8077, 8069],
      [8078, 8070],
      [8079, 8071],
      [8080, 8088],
      [8081, 8089],
      [8082, 8090],
      [8083, 8091],
      [8084, 8092],
      [8085, 8093],
      [8086, 8094],
      [8087, 8095],
      [8088, 8080],
      [8089, 8081],
      [8090, 8082],
      [8091, 8083],
      [8092, 8084],
      [8093, 8085],
      [8094, 8086],
      [8095, 8087],
      [8096, 8104],
      [8097, 8105],
      [8098, 8106],
      [8099, 8107],
      [8100, 8108],
      [8101, 8109],
      [8102, 8110],
      [8103, 8111],
      [8104, 8096],
      [8105, 8097],
      [8106, 8098],
      [8107, 8099],
      [8108, 8100],
      [8109, 8101],
      [8110, 8102],
      [8111, 8103],
      [8115, 8124],
      [8124, 8115],
      [8126, [
        837,
        921
      ]],
      [8131, 8140],
      [8140, 8131],
      [8179, 8188],
      [8188, 8179],
      [8486, [
        937,
        969
      ]],
      [8490, 75],
      [8491, [
        197,
        229
      ]],
      [42570, 7304],
      [42571, 7304],
      [42900, 42948],
      [42926, 618],
      [42930, 669],
      [42931, 43859],
      [42932, 42933],
      [42933, 42932],
      [42934, 42935],
      [42935, 42934],
      [42936, 42937],
      [42937, 42936],
      [42938, 42939],
      [42939, 42938],
      [42940, 42941],
      [42941, 42940],
      [42942, 42943],
      [42943, 42942],
      [42946, 42947],
      [42947, 42946],
      [42948, 42900],
      [42949, 642],
      [42950, 7566],
      [43859, 42931],
      [43888, 5024],
      [43889, 5025],
      [43890, 5026],
      [43891, 5027],
      [43892, 5028],
      [43893, 5029],
      [43894, 5030],
      [43895, 5031],
      [43896, 5032],
      [43897, 5033],
      [43898, 5034],
      [43899, 5035],
      [43900, 5036],
      [43901, 5037],
      [43902, 5038],
      [43903, 5039],
      [43904, 5040],
      [43905, 5041],
      [43906, 5042],
      [43907, 5043],
      [43908, 5044],
      [43909, 5045],
      [43910, 5046],
      [43911, 5047],
      [43912, 5048],
      [43913, 5049],
      [43914, 5050],
      [43915, 5051],
      [43916, 5052],
      [43917, 5053],
      [43918, 5054],
      [43919, 5055],
      [43920, 5056],
      [43921, 5057],
      [43922, 5058],
      [43923, 5059],
      [43924, 5060],
      [43925, 5061],
      [43926, 5062],
      [43927, 5063],
      [43928, 5064],
      [43929, 5065],
      [43930, 5066],
      [43931, 5067],
      [43932, 5068],
      [43933, 5069],
      [43934, 5070],
      [43935, 5071],
      [43936, 5072],
      [43937, 5073],
      [43938, 5074],
      [43939, 5075],
      [43940, 5076],
      [43941, 5077],
      [43942, 5078],
      [43943, 5079],
      [43944, 5080],
      [43945, 5081],
      [43946, 5082],
      [43947, 5083],
      [43948, 5084],
      [43949, 5085],
      [43950, 5086],
      [43951, 5087],
      [43952, 5088],
      [43953, 5089],
      [43954, 5090],
      [43955, 5091],
      [43956, 5092],
      [43957, 5093],
      [43958, 5094],
      [43959, 5095],
      [43960, 5096],
      [43961, 5097],
      [43962, 5098],
      [43963, 5099],
      [43964, 5100],
      [43965, 5101],
      [43966, 5102],
      [43967, 5103],
      [66560, 66600],
      [66561, 66601],
      [66562, 66602],
      [66563, 66603],
      [66564, 66604],
      [66565, 66605],
      [66566, 66606],
      [66567, 66607],
      [66568, 66608],
      [66569, 66609],
      [66570, 66610],
      [66571, 66611],
      [66572, 66612],
      [66573, 66613],
      [66574, 66614],
      [66575, 66615],
      [66576, 66616],
      [66577, 66617],
      [66578, 66618],
      [66579, 66619],
      [66580, 66620],
      [66581, 66621],
      [66582, 66622],
      [66583, 66623],
      [66584, 66624],
      [66585, 66625],
      [66586, 66626],
      [66587, 66627],
      [66588, 66628],
      [66589, 66629],
      [66590, 66630],
      [66591, 66631],
      [66592, 66632],
      [66593, 66633],
      [66594, 66634],
      [66595, 66635],
      [66596, 66636],
      [66597, 66637],
      [66598, 66638],
      [66599, 66639],
      [66600, 66560],
      [66601, 66561],
      [66602, 66562],
      [66603, 66563],
      [66604, 66564],
      [66605, 66565],
      [66606, 66566],
      [66607, 66567],
      [66608, 66568],
      [66609, 66569],
      [66610, 66570],
      [66611, 66571],
      [66612, 66572],
      [66613, 66573],
      [66614, 66574],
      [66615, 66575],
      [66616, 66576],
      [66617, 66577],
      [66618, 66578],
      [66619, 66579],
      [66620, 66580],
      [66621, 66581],
      [66622, 66582],
      [66623, 66583],
      [66624, 66584],
      [66625, 66585],
      [66626, 66586],
      [66627, 66587],
      [66628, 66588],
      [66629, 66589],
      [66630, 66590],
      [66631, 66591],
      [66632, 66592],
      [66633, 66593],
      [66634, 66594],
      [66635, 66595],
      [66636, 66596],
      [66637, 66597],
      [66638, 66598],
      [66639, 66599],
      [66736, 66776],
      [66737, 66777],
      [66738, 66778],
      [66739, 66779],
      [66740, 66780],
      [66741, 66781],
      [66742, 66782],
      [66743, 66783],
      [66744, 66784],
      [66745, 66785],
      [66746, 66786],
      [66747, 66787],
      [66748, 66788],
      [66749, 66789],
      [66750, 66790],
      [66751, 66791],
      [66752, 66792],
      [66753, 66793],
      [66754, 66794],
      [66755, 66795],
      [66756, 66796],
      [66757, 66797],
      [66758, 66798],
      [66759, 66799],
      [66760, 66800],
      [66761, 66801],
      [66762, 66802],
      [66763, 66803],
      [66764, 66804],
      [66765, 66805],
      [66766, 66806],
      [66767, 66807],
      [66768, 66808],
      [66769, 66809],
      [66770, 66810],
      [66771, 66811],
      [66776, 66736],
      [66777, 66737],
      [66778, 66738],
      [66779, 66739],
      [66780, 66740],
      [66781, 66741],
      [66782, 66742],
      [66783, 66743],
      [66784, 66744],
      [66785, 66745],
      [66786, 66746],
      [66787, 66747],
      [66788, 66748],
      [66789, 66749],
      [66790, 66750],
      [66791, 66751],
      [66792, 66752],
      [66793, 66753],
      [66794, 66754],
      [66795, 66755],
      [66796, 66756],
      [66797, 66757],
      [66798, 66758],
      [66799, 66759],
      [66800, 66760],
      [66801, 66761],
      [66802, 66762],
      [66803, 66763],
      [66804, 66764],
      [66805, 66765],
      [66806, 66766],
      [66807, 66767],
      [66808, 66768],
      [66809, 66769],
      [66810, 66770],
      [66811, 66771],
      [68736, 68800],
      [68737, 68801],
      [68738, 68802],
      [68739, 68803],
      [68740, 68804],
      [68741, 68805],
      [68742, 68806],
      [68743, 68807],
      [68744, 68808],
      [68745, 68809],
      [68746, 68810],
      [68747, 68811],
      [68748, 68812],
      [68749, 68813],
      [68750, 68814],
      [68751, 68815],
      [68752, 68816],
      [68753, 68817],
      [68754, 68818],
      [68755, 68819],
      [68756, 68820],
      [68757, 68821],
      [68758, 68822],
      [68759, 68823],
      [68760, 68824],
      [68761, 68825],
      [68762, 68826],
      [68763, 68827],
      [68764, 68828],
      [68765, 68829],
      [68766, 68830],
      [68767, 68831],
      [68768, 68832],
      [68769, 68833],
      [68770, 68834],
      [68771, 68835],
      [68772, 68836],
      [68773, 68837],
      [68774, 68838],
      [68775, 68839],
      [68776, 68840],
      [68777, 68841],
      [68778, 68842],
      [68779, 68843],
      [68780, 68844],
      [68781, 68845],
      [68782, 68846],
      [68783, 68847],
      [68784, 68848],
      [68785, 68849],
      [68786, 68850],
      [68800, 68736],
      [68801, 68737],
      [68802, 68738],
      [68803, 68739],
      [68804, 68740],
      [68805, 68741],
      [68806, 68742],
      [68807, 68743],
      [68808, 68744],
      [68809, 68745],
      [68810, 68746],
      [68811, 68747],
      [68812, 68748],
      [68813, 68749],
      [68814, 68750],
      [68815, 68751],
      [68816, 68752],
      [68817, 68753],
      [68818, 68754],
      [68819, 68755],
      [68820, 68756],
      [68821, 68757],
      [68822, 68758],
      [68823, 68759],
      [68824, 68760],
      [68825, 68761],
      [68826, 68762],
      [68827, 68763],
      [68828, 68764],
      [68829, 68765],
      [68830, 68766],
      [68831, 68767],
      [68832, 68768],
      [68833, 68769],
      [68834, 68770],
      [68835, 68771],
      [68836, 68772],
      [68837, 68773],
      [68838, 68774],
      [68839, 68775],
      [68840, 68776],
      [68841, 68777],
      [68842, 68778],
      [68843, 68779],
      [68844, 68780],
      [68845, 68781],
      [68846, 68782],
      [68847, 68783],
      [68848, 68784],
      [68849, 68785],
      [68850, 68786],
      [71840, 71872],
      [71841, 71873],
      [71842, 71874],
      [71843, 71875],
      [71844, 71876],
      [71845, 71877],
      [71846, 71878],
      [71847, 71879],
      [71848, 71880],
      [71849, 71881],
      [71850, 71882],
      [71851, 71883],
      [71852, 71884],
      [71853, 71885],
      [71854, 71886],
      [71855, 71887],
      [71856, 71888],
      [71857, 71889],
      [71858, 71890],
      [71859, 71891],
      [71860, 71892],
      [71861, 71893],
      [71862, 71894],
      [71863, 71895],
      [71864, 71896],
      [71865, 71897],
      [71866, 71898],
      [71867, 71899],
      [71868, 71900],
      [71869, 71901],
      [71870, 71902],
      [71871, 71903],
      [71872, 71840],
      [71873, 71841],
      [71874, 71842],
      [71875, 71843],
      [71876, 71844],
      [71877, 71845],
      [71878, 71846],
      [71879, 71847],
      [71880, 71848],
      [71881, 71849],
      [71882, 71850],
      [71883, 71851],
      [71884, 71852],
      [71885, 71853],
      [71886, 71854],
      [71887, 71855],
      [71888, 71856],
      [71889, 71857],
      [71890, 71858],
      [71891, 71859],
      [71892, 71860],
      [71893, 71861],
      [71894, 71862],
      [71895, 71863],
      [71896, 71864],
      [71897, 71865],
      [71898, 71866],
      [71899, 71867],
      [71900, 71868],
      [71901, 71869],
      [71902, 71870],
      [71903, 71871],
      [93760, 93792],
      [93761, 93793],
      [93762, 93794],
      [93763, 93795],
      [93764, 93796],
      [93765, 93797],
      [93766, 93798],
      [93767, 93799],
      [93768, 93800],
      [93769, 93801],
      [93770, 93802],
      [93771, 93803],
      [93772, 93804],
      [93773, 93805],
      [93774, 93806],
      [93775, 93807],
      [93776, 93808],
      [93777, 93809],
      [93778, 93810],
      [93779, 93811],
      [93780, 93812],
      [93781, 93813],
      [93782, 93814],
      [93783, 93815],
      [93784, 93816],
      [93785, 93817],
      [93786, 93818],
      [93787, 93819],
      [93788, 93820],
      [93789, 93821],
      [93790, 93822],
      [93791, 93823],
      [93792, 93760],
      [93793, 93761],
      [93794, 93762],
      [93795, 93763],
      [93796, 93764],
      [93797, 93765],
      [93798, 93766],
      [93799, 93767],
      [93800, 93768],
      [93801, 93769],
      [93802, 93770],
      [93803, 93771],
      [93804, 93772],
      [93805, 93773],
      [93806, 93774],
      [93807, 93775],
      [93808, 93776],
      [93809, 93777],
      [93810, 93778],
      [93811, 93779],
      [93812, 93780],
      [93813, 93781],
      [93814, 93782],
      [93815, 93783],
      [93816, 93784],
      [93817, 93785],
      [93818, 93786],
      [93819, 93787],
      [93820, 93788],
      [93821, 93789],
      [93822, 93790],
      [93823, 93791],
      [125184, 125218],
      [125185, 125219],
      [125186, 125220],
      [125187, 125221],
      [125188, 125222],
      [125189, 125223],
      [125190, 125224],
      [125191, 125225],
      [125192, 125226],
      [125193, 125227],
      [125194, 125228],
      [125195, 125229],
      [125196, 125230],
      [125197, 125231],
      [125198, 125232],
      [125199, 125233],
      [125200, 125234],
      [125201, 125235],
      [125202, 125236],
      [125203, 125237],
      [125204, 125238],
      [125205, 125239],
      [125206, 125240],
      [125207, 125241],
      [125208, 125242],
      [125209, 125243],
      [125210, 125244],
      [125211, 125245],
      [125212, 125246],
      [125213, 125247],
      [125214, 125248],
      [125215, 125249],
      [125216, 125250],
      [125217, 125251],
      [125218, 125184],
      [125219, 125185],
      [125220, 125186],
      [125221, 125187],
      [125222, 125188],
      [125223, 125189],
      [125224, 125190],
      [125225, 125191],
      [125226, 125192],
      [125227, 125193],
      [125228, 125194],
      [125229, 125195],
      [125230, 125196],
      [125231, 125197],
      [125232, 125198],
      [125233, 125199],
      [125234, 125200],
      [125235, 125201],
      [125236, 125202],
      [125237, 125203],
      [125238, 125204],
      [125239, 125205],
      [125240, 125206],
      [125241, 125207],
      [125242, 125208],
      [125243, 125209],
      [125244, 125210],
      [125245, 125211],
      [125246, 125212],
      [125247, 125213],
      [125248, 125214],
      [125249, 125215],
      [125250, 125216],
      [125251, 125217]
    ]);
  }
});

// node_modules/regexpu-core/data/character-class-escape-sets.js
var require_character_class_escape_sets = __commonJS({
  "node_modules/regexpu-core/data/character-class-escape-sets.js"(exports) {
    "use strict";
    var regenerate = require_regenerate();
    exports.REGULAR = /* @__PURE__ */ new Map([
      ["d", regenerate().addRange(48, 57)],
      ["D", regenerate().addRange(0, 47).addRange(58, 65535)],
      ["s", regenerate(32, 160, 5760, 8239, 8287, 12288, 65279).addRange(9, 13).addRange(8192, 8202).addRange(8232, 8233)],
      ["S", regenerate().addRange(0, 8).addRange(14, 31).addRange(33, 159).addRange(161, 5759).addRange(5761, 8191).addRange(8203, 8231).addRange(8234, 8238).addRange(8240, 8286).addRange(8288, 12287).addRange(12289, 65278).addRange(65280, 65535)],
      ["w", regenerate(95).addRange(48, 57).addRange(65, 90).addRange(97, 122)],
      ["W", regenerate(96).addRange(0, 47).addRange(58, 64).addRange(91, 94).addRange(123, 65535)]
    ]);
    exports.UNICODE = /* @__PURE__ */ new Map([
      ["d", regenerate().addRange(48, 57)],
      ["D", regenerate().addRange(0, 47).addRange(58, 1114111)],
      ["s", regenerate(32, 160, 5760, 8239, 8287, 12288, 65279).addRange(9, 13).addRange(8192, 8202).addRange(8232, 8233)],
      ["S", regenerate().addRange(0, 8).addRange(14, 31).addRange(33, 159).addRange(161, 5759).addRange(5761, 8191).addRange(8203, 8231).addRange(8234, 8238).addRange(8240, 8286).addRange(8288, 12287).addRange(12289, 65278).addRange(65280, 1114111)],
      ["w", regenerate(95).addRange(48, 57).addRange(65, 90).addRange(97, 122)],
      ["W", regenerate(96).addRange(0, 47).addRange(58, 64).addRange(91, 94).addRange(123, 1114111)]
    ]);
    exports.UNICODE_IGNORE_CASE = /* @__PURE__ */ new Map([
      ["d", regenerate().addRange(48, 57)],
      ["D", regenerate().addRange(0, 47).addRange(58, 1114111)],
      ["s", regenerate(32, 160, 5760, 8239, 8287, 12288, 65279).addRange(9, 13).addRange(8192, 8202).addRange(8232, 8233)],
      ["S", regenerate().addRange(0, 8).addRange(14, 31).addRange(33, 159).addRange(161, 5759).addRange(5761, 8191).addRange(8203, 8231).addRange(8234, 8238).addRange(8240, 8286).addRange(8288, 12287).addRange(12289, 65278).addRange(65280, 1114111)],
      ["w", regenerate(95, 383, 8490).addRange(48, 57).addRange(65, 90).addRange(97, 122)],
      ["W", regenerate(96).addRange(0, 47).addRange(58, 64).addRange(91, 94).addRange(123, 382).addRange(384, 8489).addRange(8491, 1114111)]
    ]);
  }
});

// node_modules/regexpu-core/rewrite-pattern.js
var require_rewrite_pattern = __commonJS({
  "node_modules/regexpu-core/rewrite-pattern.js"(exports, module) {
    "use strict";
    var generate = require_regjsgen().generate;
    var parse4 = require_parser().parse;
    var regenerate = require_regenerate();
    var unicodeMatchProperty = require_unicode_match_property_ecmascript();
    var unicodeMatchPropertyValue = require_unicode_match_property_value_ecmascript();
    var iuMappings = require_iu_mappings();
    var ESCAPE_SETS = require_character_class_escape_sets();
    var UNICODE_SET = regenerate().addRange(0, 1114111);
    var BMP_SET = regenerate().addRange(0, 65535);
    var DOT_SET_UNICODE = UNICODE_SET.clone().remove(
      // minus `LineTerminator`s (https://mths.be/es6#sec-line-terminators):
      10,
      // Line Feed <LF>
      13,
      // Carriage Return <CR>
      8232,
      // Line Separator <LS>
      8233
      // Paragraph Separator <PS>
    );
    var DOT_SET = DOT_SET_UNICODE.clone().intersection(BMP_SET);
    var getCharacterClassEscapeSet = (character, unicode, ignoreCase) => {
      if (unicode) {
        if (ignoreCase) {
          return ESCAPE_SETS.UNICODE_IGNORE_CASE.get(character);
        }
        return ESCAPE_SETS.UNICODE.get(character);
      }
      return ESCAPE_SETS.REGULAR.get(character);
    };
    var getDotSet = (unicode, dotAll) => {
      if (dotAll) {
        return unicode ? UNICODE_SET : BMP_SET;
      }
      return unicode ? DOT_SET_UNICODE : DOT_SET;
    };
    var getUnicodePropertyValueSet = (property, value) => {
      const path = value ? `${property}/${value}` : `Binary_Property/${property}`;
      try {
        return __require(`regenerate-unicode-properties/${path}.js`);
      } catch (exception) {
        throw new Error(
          `Failed to recognize value \`${value}\` for property \`${property}\`.`
        );
      }
    };
    var handleLoneUnicodePropertyNameOrValue = (value) => {
      try {
        const property2 = "General_Category";
        const category = unicodeMatchPropertyValue(property2, value);
        return getUnicodePropertyValueSet(property2, category);
      } catch (exception) {
      }
      const property = unicodeMatchProperty(value);
      return getUnicodePropertyValueSet(property);
    };
    var getUnicodePropertyEscapeSet = (value, isNegative) => {
      const parts = value.split("=");
      const firstPart = parts[0];
      let set;
      if (parts.length == 1) {
        set = handleLoneUnicodePropertyNameOrValue(firstPart);
      } else {
        const property = unicodeMatchProperty(firstPart);
        const value2 = unicodeMatchPropertyValue(property, parts[1]);
        set = getUnicodePropertyValueSet(property, value2);
      }
      if (isNegative) {
        return UNICODE_SET.clone().remove(set);
      }
      return set.clone();
    };
    regenerate.prototype.iuAddRange = function(min, max) {
      const $this = this;
      do {
        const folded = caseFold(min);
        if (folded) {
          $this.add(folded);
        }
      } while (++min <= max);
      return $this;
    };
    var update = (item, pattern) => {
      let tree = parse4(pattern, config.useUnicodeFlag ? "u" : "");
      switch (tree.type) {
        case "characterClass":
        case "group":
        case "value":
          break;
        default:
          tree = wrap2(tree, pattern);
      }
      Object.assign(item, tree);
    };
    var wrap2 = (tree, pattern) => {
      return {
        "type": "group",
        "behavior": "ignore",
        "body": [tree],
        "raw": `(?:${pattern})`
      };
    };
    var caseFold = (codePoint) => {
      return iuMappings.get(codePoint) || false;
    };
    var processCharacterClass = (characterClassItem, regenerateOptions) => {
      let set = regenerate();
      for (const item of characterClassItem.body) {
        switch (item.type) {
          case "value":
            set.add(item.codePoint);
            if (config.ignoreCase && config.unicode && !config.useUnicodeFlag) {
              const folded = caseFold(item.codePoint);
              if (folded) {
                set.add(folded);
              }
            }
            break;
          case "characterClassRange":
            const min = item.min.codePoint;
            const max = item.max.codePoint;
            set.addRange(min, max);
            if (config.ignoreCase && config.unicode && !config.useUnicodeFlag) {
              set.iuAddRange(min, max);
            }
            break;
          case "characterClassEscape":
            set.add(getCharacterClassEscapeSet(
              item.value,
              config.unicode,
              config.ignoreCase
            ));
            break;
          case "unicodePropertyEscape":
            set.add(getUnicodePropertyEscapeSet(item.value, item.negative));
            break;
          default:
            throw new Error(`Unknown term type: ${item.type}`);
        }
      }
      if (characterClassItem.negative) {
        set = (config.unicode ? UNICODE_SET : BMP_SET).clone().remove(set);
      }
      update(characterClassItem, set.toString(regenerateOptions));
      return characterClassItem;
    };
    var updateNamedReference = (item, index) => {
      delete item.name;
      item.matchIndex = index;
    };
    var assertNoUnmatchedReferences = (groups) => {
      const unmatchedReferencesNames = Object.keys(groups.unmatchedReferences);
      if (unmatchedReferencesNames.length > 0) {
        throw new Error(`Unknown group names: ${unmatchedReferencesNames}`);
      }
    };
    var processTerm = (item, regenerateOptions, groups) => {
      switch (item.type) {
        case "dot":
          update(
            item,
            getDotSet(config.unicode, config.dotAll).toString(regenerateOptions)
          );
          break;
        case "characterClass":
          item = processCharacterClass(item, regenerateOptions);
          break;
        case "unicodePropertyEscape":
          update(
            item,
            getUnicodePropertyEscapeSet(item.value, item.negative).toString(regenerateOptions)
          );
          break;
        case "characterClassEscape":
          update(
            item,
            getCharacterClassEscapeSet(
              item.value,
              config.unicode,
              config.ignoreCase
            ).toString(regenerateOptions)
          );
          break;
        case "group":
          groups.lastIndex++;
          if (item.name) {
            const name = item.name.value;
            if (groups.names[name]) {
              throw new Error(
                `Multiple groups with the same name (${name}) are not allowed.`
              );
            }
            const index = groups.lastIndex;
            delete item.name;
            groups.names[name] = index;
            if (groups.onNamedGroup) {
              groups.onNamedGroup.call(null, name, index);
            }
            if (groups.unmatchedReferences[name]) {
              groups.unmatchedReferences[name].forEach((reference) => {
                updateNamedReference(reference, index);
              });
              delete groups.unmatchedReferences[name];
            }
          }
        case "alternative":
        case "disjunction":
        case "quantifier":
          item.body = item.body.map((term) => {
            return processTerm(term, regenerateOptions, groups);
          });
          break;
        case "value":
          const codePoint = item.codePoint;
          const set = regenerate(codePoint);
          if (config.ignoreCase && config.unicode && !config.useUnicodeFlag) {
            const folded = caseFold(codePoint);
            if (folded) {
              set.add(folded);
            }
          }
          update(item, set.toString(regenerateOptions));
          break;
        case "reference":
          if (item.name) {
            const name = item.name.value;
            const index = groups.names[name];
            if (index) {
              updateNamedReference(item, index);
              break;
            }
            if (!groups.unmatchedReferences[name]) {
              groups.unmatchedReferences[name] = [];
            }
            groups.unmatchedReferences[name].push(item);
          }
          break;
        case "anchor":
        case "empty":
        case "group":
          break;
        default:
          throw new Error(`Unknown term type: ${item.type}`);
      }
      return item;
    };
    var config = {
      "ignoreCase": false,
      "unicode": false,
      "dotAll": false,
      "useUnicodeFlag": false
    };
    var rewritePattern2 = (pattern, flags, options) => {
      const regjsparserFeatures = {
        "unicodePropertyEscape": options && options.unicodePropertyEscape,
        "namedGroups": options && options.namedGroup,
        "lookbehind": options && options.lookbehind
      };
      config.ignoreCase = flags && flags.includes("i");
      config.unicode = flags && flags.includes("u");
      const supportDotAllFlag = options && options.dotAllFlag;
      config.dotAll = supportDotAllFlag && flags && flags.includes("s");
      config.useUnicodeFlag = options && options.useUnicodeFlag;
      const regenerateOptions = {
        "hasUnicodeFlag": config.useUnicodeFlag,
        "bmpOnly": !config.unicode
      };
      const groups = {
        "onNamedGroup": options && options.onNamedGroup,
        "lastIndex": 0,
        "names": /* @__PURE__ */ Object.create(null),
        // { [name]: index }
        "unmatchedReferences": /* @__PURE__ */ Object.create(null)
        // { [name]: Array<reference> }
      };
      const tree = parse4(pattern, flags, regjsparserFeatures);
      processTerm(tree, regenerateOptions, groups);
      assertNoUnmatchedReferences(groups);
      return generate(tree);
    };
    module.exports = rewritePattern2;
  }
});

// ../BibliotecaDeDev/src/engine/StateManager.ts
var StateManager = class _StateManager {
  static customEvaluator;
  readonlyVariables = /* @__PURE__ */ new Set();
  variables = /* @__PURE__ */ new Map();
  localScopes = [];
  nodeOutputs = /* @__PURE__ */ new Map();
  nodeOutputsByName = /* @__PURE__ */ new Map();
  lastNodeOutput = {};
  constructor(initialVariables = {}, readonlyKeys = []) {
    this.reset(initialVariables, readonlyKeys);
    this.reset(initialVariables);
  }
  /**
   * Reseta o estado para os valores iniciais
   */
  reset(initialVariables = {}, readonlyKeys = []) {
    this.readonlyVariables.clear();
    for (const rk of readonlyKeys) {
      this.readonlyVariables.add(rk);
    }
    this.variables.clear();
    this.localScopes = [];
    this.nodeOutputs.clear();
    this.nodeOutputsByName.clear();
    this.lastNodeOutput = {};
    for (const [key, value] of Object.entries(initialVariables)) {
      this.variables.set(key, value);
    }
  }
  /**
   * Registra a saída de um nó após execução (transferência de variáveis estilo N8N)
   */
  recordNodeOutput(nodeId, nodeLabel, data2) {
    const normalizedData = data2 !== void 0 ? data2 : {};
    this.nodeOutputs.set(nodeId, normalizedData);
    if (nodeLabel && nodeLabel.trim()) {
      this.nodeOutputsByName.set(nodeLabel.trim(), normalizedData);
    }
    this.lastNodeOutput = normalizedData;
  }
  /**
   * Obtém os dados de saída de um nó por ID ou pelo Nome (Label)
   */
  getNodeOutput(nodeIdOrLabel) {
    if (this.nodeOutputsByName.has(nodeIdOrLabel)) {
      return this.nodeOutputsByName.get(nodeIdOrLabel);
    }
    if (this.nodeOutputs.has(nodeIdOrLabel)) {
      return this.nodeOutputs.get(nodeIdOrLabel);
    }
    return void 0;
  }
  /**
   * Obtém a saída do nó anterior ($json)
   */
  getLastNodeOutput() {
    return this.lastNodeOutput;
  }
  /**
   * Constrói o contexto de variáveis do N8N ($json, $node, $input, $vars)
   */
  buildN8NContext() {
    const $vars = this.getAll();
    const $json = this.lastNodeOutput;
    const $input = {
      first: () => Array.isArray($json) ? $json[0] : $json,
      all: () => Array.isArray($json) ? $json : [$json],
      item: { json: $json }
    };
    const nodeTargetMap = {};
    for (const [id, out] of this.nodeOutputs.entries()) {
      nodeTargetMap[id] = { json: out };
    }
    for (const [name, out] of this.nodeOutputsByName.entries()) {
      nodeTargetMap[name] = { json: out };
    }
    const $node = new Proxy(nodeTargetMap, {
      get: (target2, prop) => {
        if (typeof prop === "string") {
          if (prop in target2)
            return target2[prop];
          const found = this.getNodeOutput(prop);
          if (found !== void 0)
            return { json: found };
          return { json: void 0 };
        }
        return target2[prop];
      }
    });
    return { $json, $input, $node, $vars };
  }
  /**
   * Define o valor de uma variável no escopo atual
   */
  setReadonly(key, readonly = true) {
    if (readonly) {
      this.readonlyVariables.add(key);
    } else {
      this.readonlyVariables.delete(key);
    }
  }
  isReadonly(key) {
    return this.readonlyVariables.has(key);
  }
  getReadonlyVariables() {
    return Array.from(this.readonlyVariables);
  }
  getNodeOutputs() {
    const res2 = {};
    for (const [id, out] of this.nodeOutputs.entries()) {
      res2[id] = out;
    }
    return res2;
  }
  set(key, value, force = false) {
    if (!force && this.readonlyVariables.has(key)) {
      console.warn('[StateManager] Tentativa de alterar vari\xE1vel constante/somente leitura bloqueada: "' + key + '"');
      return false;
    }
    if (this.localScopes.length > 0) {
      const currentScope = this.localScopes[this.localScopes.length - 1];
      if (currentScope.has(key)) {
        currentScope.set(key, value);
        return true;
      }
    }
    this.variables.set(key, value);
    return true;
  }
  /**
   * Obtém o valor de uma variável (busca do escopo mais interno para o global)
   */
  get(key) {
    if (key === "$json")
      return this.lastNodeOutput;
    if (key === "$input")
      return this.buildN8NContext().$input;
    if (key === "$node")
      return this.buildN8NContext().$node;
    if (key === "$vars")
      return this.getAll();
    for (let i = this.localScopes.length - 1; i >= 0; i--) {
      if (this.localScopes[i].has(key)) {
        return this.localScopes[i].get(key);
      }
    }
    return this.variables.get(key);
  }
  /**
   * Retorna um snapshot de todas as variáveis acessíveis
   */
  getAll() {
    const result = {};
    for (const [k, v] of this.variables.entries()) {
      result[k] = v;
    }
    for (const scope of this.localScopes) {
      for (const [k, v] of scope.entries()) {
        result[k] = v;
      }
    }
    return result;
  }
  /**
   * Empilha um novo escopo de bloco (ex: corpo de loop)
   */
  pushScope(initialScopeVars = {}) {
    const scope = /* @__PURE__ */ new Map();
    for (const [k, v] of Object.entries(initialScopeVars)) {
      scope.set(k, v);
    }
    this.localScopes.push(scope);
  }
  /**
   * Desempilha o escopo de bloco mais recente
   */
  popScope() {
    if (this.localScopes.length > 0) {
      this.localScopes.pop();
    }
  }
  /**
   * Interpola strings com placeholders no formato:
   * {{variavel}}, {{objeto.campo[0]}}, {{ $json.campo }}, {{ $node["Meu Bloco"].json.campo }}, {{ $vars.x }}
   */
  interpolate(template) {
    if (typeof template !== "string")
      return template;
    return template.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (fullMatch, expression) => {
      const trimmed = expression.trim();
      const val = this.resolvePath(trimmed);
      if (val === void 0 || val === null) {
        return "";
      }
      if (typeof val === "object") {
        return JSON.stringify(val);
      }
      return String(val);
    });
  }
  /**
   * Resolve caminhos de propriedades aninhadas, suportando:
   * "user.profile.name", "$json.campo", "$node['Bloco A'].json.items[0]", "$vars.apiUrl"
   */
  resolvePath(path) {
    if (!path || !path.trim())
      return void 0;
    const cleanPath = path.trim();
    const nodeMatch = cleanPath.match(/^\$node\[['"]([^'"]+)['"]\](?:\.json)?(?:\.(.+))?$/);
    if (nodeMatch) {
      const nodeNameOrId = nodeMatch[1];
      const subPath = nodeMatch[2];
      const output = this.getNodeOutput(nodeNameOrId);
      if (!subPath)
        return output;
      return this.resolveSubPath(output, subPath);
    }
    if (cleanPath === "$json")
      return this.lastNodeOutput;
    if (cleanPath.startsWith("$json.")) {
      return this.resolveSubPath(this.lastNodeOutput, cleanPath.slice(6));
    }
    if (cleanPath === "$vars")
      return this.getAll();
    if (cleanPath.startsWith("$vars.")) {
      return this.resolveSubPath(this.getAll(), cleanPath.slice(6));
    }
    if (cleanPath.startsWith("$input.")) {
      const n8n = this.buildN8NContext();
      return this.resolveSubPath(n8n.$input, cleanPath.slice(7));
    }
    const normalized = cleanPath.replace(/\[['"]?(\w+)['"]?\]/g, ".$1").replace(/^\./, "");
    const parts = normalized.split(".");
    let current2 = this.get(parts[0]);
    for (let i = 1; i < parts.length; i++) {
      if (current2 === void 0 || current2 === null)
        return void 0;
      current2 = current2[parts[i]];
    }
    return current2;
  }
  /**
   * Auxiliar para navegar propriedades internas de um objeto ou array
   */
  resolveSubPath(rootObj, subPath) {
    if (rootObj === void 0 || rootObj === null)
      return void 0;
    const normalized = subPath.replace(/\[['"]?([^'"]+)['"]?\]/g, ".$1").replace(/^\./, "");
    const parts = normalized.split(".");
    let current2 = rootObj;
    for (const part of parts) {
      if (current2 === void 0 || current2 === null)
        return void 0;
      current2 = current2[part];
    }
    return current2;
  }
  /**
   * Avalia uma expressão ou script JS arbitrário no escopo atual das variáveis e variáveis do N8N
   */
  evaluateJsExpression(expressionOrCode, throwOnError = false) {
    if (!expressionOrCode || !expressionOrCode.trim())
      return false;
    const trimmed = this.interpolate(expressionOrCode.trim());
    const n8n = this.buildN8NContext();
    const vars = this.getAll();
    const scopeData = {
      ...vars,
      $json: n8n.$json,
      $input: n8n.$input,
      $node: n8n.$node,
      $vars: n8n.$vars
    };
    const keys2 = Object.keys(scopeData);
    const values = Object.values(scopeData);
    if (_StateManager.customEvaluator) {
      try {
        return _StateManager.customEvaluator(trimmed, scopeData);
      } catch (err) {
        if (throwOnError)
          throw err;
        console.warn(`[StateManager] Erro ao avaliar express\xE3o JS: "${trimmed}":`, err.message);
        return false;
      }
    }
    try {
      if (trimmed.includes(";") || trimmed.includes("return ") || trimmed.includes("\n")) {
        const body = trimmed.includes("return ") ? trimmed : `return (${trimmed});`;
        const fn2 = new Function(...keys2, body);
        return fn2(...values);
      }
      const fn = new Function(...keys2, `return (${trimmed});`);
      return fn(...values);
    } catch (err) {
      if (throwOnError)
        throw err;
      console.warn(`[StateManager] Erro ao avaliar express\xE3o JS: "${trimmed}":`, err.message);
      return false;
    }
  }
  /**
   * Avalia uma condição com operadores lógicos do Switch/While
   */
  evaluateCondition(leftRaw, operator, rightRaw) {
    const leftResolved = leftRaw !== void 0 ? this.interpolate(leftRaw) : "";
    const rightResolved = rightRaw !== void 0 ? this.interpolate(rightRaw) : void 0;
    switch (operator) {
      case "equals":
        return String(leftResolved) === String(rightResolved);
      case "not_equals":
        return String(leftResolved) !== String(rightResolved);
      case "contains":
        return String(leftResolved).includes(String(rightResolved));
      case "not_contains":
        return !String(leftResolved).includes(String(rightResolved));
      case "greater_than":
        return Number(leftResolved) > Number(rightResolved);
      case "less_than":
        return Number(leftResolved) < Number(rightResolved);
      case "greater_or_equal":
        return Number(leftResolved) >= Number(rightResolved);
      case "less_or_equal":
        return Number(leftResolved) <= Number(rightResolved);
      case "is_empty":
        return leftResolved === "" || leftResolved === null || leftResolved === void 0;
      case "is_not_empty":
        return leftResolved !== "" && leftResolved !== null && leftResolved !== void 0;
      case "regex_match":
        if (!rightResolved)
          return false;
        try {
          const regex = new RegExp(rightResolved);
          return regex.test(String(leftResolved));
        } catch {
          return false;
        }
      default:
        return false;
    }
  }
  /**
   * Avalia uma única regra de condição (seja comparação de valores ou expressão JS)
   */
  evaluateConditionRule(rule) {
    const mode = rule.evaluationMode || (rule.jsExpression && !rule.operator ? "js_eval" : "comparison");
    if (mode === "js_eval") {
      return Boolean(this.evaluateJsExpression(rule.jsExpression || ""));
    }
    return this.evaluateCondition(rule.leftOperand, rule.operator, rule.rightOperand);
  }
  /**
   * Avalia um grupo de regras com operador lógico 'and' ou 'or'
   */
  evaluateRulesGroup(rules, logicalOperator = "and") {
    if (!rules || rules.length === 0)
      return true;
    if (logicalOperator === "or") {
      return rules.some((r) => this.evaluateConditionRule(r));
    }
    return rules.every((r) => this.evaluateConditionRule(r));
  }
  /**
   * Avalia múltiplos grupos combinados com AND e OR:
   * Exemplo: ( (exp1 and exp2) ou (exp3 and exp4) or exp5 )
   */
  evaluateConditionGroups(groups) {
    if (!groups || groups.length === 0)
      return true;
    let runningResult = this.evaluateRulesGroup(groups[0].rules, groups[0].logicalOperator || "and");
    for (let i = 0; i < groups.length - 1; i++) {
      const currentGroup = groups[i];
      const nextGroup = groups[i + 1];
      const connector = currentGroup.nextOperator || "or";
      const nextGroupResult = this.evaluateRulesGroup(nextGroup.rules, nextGroup.logicalOperator || "and");
      if (connector === "and") {
        runningResult = runningResult && nextGroupResult;
      } else {
        runningResult = runningResult || nextGroupResult;
      }
    }
    return runningResult;
  }
};

// ../BibliotecaDeDev/src/engine/ExecutionContext.ts
var ExecutionContext = class {
  state;
  driver;
  status = "idle";
  logs = [];
  nodeResults = /* @__PURE__ */ new Map();
  events;
  isCancellationRequested = false;
  isPauseRequested = false;
  pauseResolver;
  constructor(initialVariables = {}, driver, events = {}, readonlyVariables = []) {
    this.state = new StateManager(initialVariables, readonlyVariables);
    this.driver = driver;
    this.events = events;
  }
  log(level, message, nodeId, payload) {
    const logItem = {
      timestamp: Date.now(),
      level,
      nodeId,
      message,
      payload
    };
    this.logs.push(logItem);
    this.events.onLog?.(logItem);
  }
  setStatus(status) {
    this.status = status;
    this.events.onStatusChange?.(status);
  }
  requestCancel() {
    this.isCancellationRequested = true;
    if (this.pauseResolver) {
      this.pauseResolver();
    }
  }
  requestPause() {
    this.isPauseRequested = true;
  }
  resume() {
    this.isPauseRequested = false;
    if (this.pauseResolver) {
      this.pauseResolver();
      this.pauseResolver = void 0;
    }
  }
  isCancelled() {
    return this.isCancellationRequested;
  }
  async checkPausePoint() {
    if (this.isPauseRequested && !this.isCancellationRequested) {
      this.setStatus("paused");
      await new Promise((resolve) => {
        this.pauseResolver = resolve;
      });
      if (!this.isCancellationRequested) {
        this.setStatus("running");
      }
    }
  }
};

// ../BibliotecaDeDev/src/engine/ExecutionEngine.ts
var ExecutionEngine = class {
  handlers = /* @__PURE__ */ new Map();
  /**
   * Registra um handler executor para um tipo de bloco
   */
  registerHandler(type, handler) {
    this.handlers.set(type, handler);
  }
  /**
   * Executa um grafo completo de automação
   */
  async runGraph(graph, driver, events = {}, overrideVariables = {}) {
    const initialVars = {
      ...graph.variables,
      ...overrideVariables
    };
    const readonlyKeys = [];
    if (Array.isArray(graph.variableDefinitions)) {
      for (const def of graph.variableDefinitions) {
        if (def.readonly)
          readonlyKeys.push(def.name);
      }
    }
    const context = new ExecutionContext(initialVars, driver, events, readonlyKeys);
    context.setStatus("running");
    try {
      const startNode = this.findStartNode(graph);
      if (!startNode) {
        throw new Error("Nenhum n\xF3 de In\xEDcio (start) v\xE1lido foi encontrado no grafo.");
      }
      context.log("info", `Iniciando automa\xE7\xE3o "${graph.metadata.name}" (v${graph.metadata.version})`);
      await this.traverseNode(startNode, graph, context);
      if (context.isCancelled()) {
        context.setStatus("cancelled");
        context.log("warn", "Execu\xE7\xE3o da automa\xE7\xE3o cancelada pelo usu\xE1rio.");
      } else {
        context.setStatus("completed");
        context.log("info", "Automa\xE7\xE3o finalizada com sucesso!");
      }
    } catch (error) {
      context.setStatus("failed");
      context.log("error", `Falha cr\xEDtica durante a execu\xE7\xE3o: ${error?.message || error}`);
    }
    return context;
  }
  /**
   * Localiza o nó inicial ativo no grafo
   */
  findStartNode(graph) {
    return graph.nodes.find((n2) => n2.type === "start" && !n2.disabled);
  }
  /**
   * Processa a execução de um nó e continua a travessia
   */
  async traverseNode(node, graph, context) {
    if (context.isCancelled())
      return;
    await context.checkPausePoint();
    if (node.disabled || node.type === "note" || node.type === "group") {
      const nextNodes2 = this.getNextNodes(node.id, graph, void 0);
      for (const nextNode of nextNodes2) {
        await this.traverseNode(nextNode, graph, context);
      }
      return;
    }
    if (node.type === "try_catch") {
      await this.executeTryCatch(node, graph, context);
      return;
    }
    if (node.type === "while_loop") {
      await this.executeWhileLoop(node, graph, context);
      return;
    }
    if (node.type === "for_loop") {
      await this.executeForLoop(node, graph, context);
      return;
    }
    context.events.onNodeStart?.(node);
    context.log("debug", `Executando n\xF3 [${node.type}] (ID: ${node.id})`, node.id);
    const startTime = Date.now();
    let result;
    try {
      const handler = this.handlers.get(node.type);
      if (!handler) {
        throw new Error(`Nenhum handler registrado para o tipo de n\xF3: ${node.type}`);
      }
      result = await handler.execute(node, context);
      result.startTime = startTime;
      result.endTime = Date.now();
      result.durationMs = result.endTime - startTime;
      const outputData = result.outputData !== void 0 ? result.outputData : {};
      context.state.recordNodeOutput(node.id, node.data?.label, outputData);
      context.nodeResults.set(node.id, result);
      context.events.onNodeComplete?.(node, result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      result = {
        nodeId: node.id,
        status: "failed",
        error,
        startTime,
        endTime: Date.now(),
        durationMs: Date.now() - startTime
      };
      const outputData = result.outputData !== void 0 ? result.outputData : {};
      context.state.recordNodeOutput(node.id, node.data?.label, outputData);
      context.nodeResults.set(node.id, result);
      context.events.onNodeError?.(node, error);
      context.log("error", `Erro no n\xF3 [${node.id}]: ${error.message}`, node.id);
      if (graph.settings?.stopOnError !== false) {
        throw error;
      }
      return;
    }
    if (context.isCancelled())
      return;
    const nextNodes = this.getNextNodes(node.id, graph, result.outputHandle);
    if (nextNodes.length === 0)
      return;
    const isParallel = graph.settings?.parallelBranchesEnabled === true && node.type === "switch" && node.data.executionMode === "all_matches_parallel";
    if (isParallel) {
      await Promise.all(nextNodes.map((nxt) => this.traverseNode(nxt, graph, context)));
    } else {
      for (const nextNode of nextNodes) {
        await this.traverseNode(nextNode, graph, context);
      }
    }
  }
  /**
   * Executa bloco de Try/Catch
   */
  async executeTryCatch(node, graph, context) {
    const data2 = node.data;
    const errorVar = data2.errorVarName || "lastError";
    context.events.onNodeStart?.(node);
    context.log("info", "Entrando no bloco Try / Catch...", node.id);
    const tryNodes = this.getNextNodes(node.id, graph, "try_body");
    const catchNodes = this.getNextNodes(node.id, graph, "catch_branch");
    const defaultNodes = this.getNextNodes(node.id, graph, "default");
    let succeeded = true;
    let caughtError = null;
    try {
      for (const tNode of tryNodes) {
        await this.traverseNode(tNode, graph, context);
      }
    } catch (err) {
      succeeded = false;
      const errorMsg = err?.message || String(err);
      caughtError = errorMsg;
      context.log("warn", `Exce\xE7\xE3o capturada no Try/Catch: ${errorMsg}`, node.id);
      context.state.set(errorVar, errorMsg);
      for (const cNode of catchNodes) {
        await this.traverseNode(cNode, graph, context);
      }
    }
    const tryCatchOutput = {
      succeeded,
      branch: succeeded ? "try_body" : "catch_branch",
      error: caughtError,
      errorVar,
      completedAt: Date.now()
    };
    context.state.recordNodeOutput(node.id, node.data?.label, tryCatchOutput);
    context.events.onNodeComplete?.(node, {
      nodeId: node.id,
      status: "success",
      outputHandle: succeeded ? "try_body" : "catch_branch",
      outputData: tryCatchOutput,
      startTime: Date.now(),
      endTime: Date.now(),
      durationMs: 0
    });
    for (const dNode of defaultNodes) {
      await this.traverseNode(dNode, graph, context);
    }
  }
  /**
   * Executa bloco de Loop While
   */
  async executeWhileLoop(node, graph, context) {
    const data2 = node.data;
    const maxIterations = data2.maxIterations || 1e3;
    let iteration = 0;
    const bodyNodes = this.getNextNodes(node.id, graph, "loop_body");
    const doneNodes = this.getNextNodes(node.id, graph, "loop_done");
    context.events.onNodeStart?.(node);
    while (iteration < maxIterations) {
      if (context.isCancelled())
        break;
      await context.checkPausePoint();
      let conditionPassed = false;
      if (Array.isArray(data2.conditionGroups) && data2.conditionGroups.length > 0) {
        conditionPassed = context.state.evaluateConditionGroups(data2.conditionGroups);
      } else if (Array.isArray(data2.rules) && data2.rules.length > 0) {
        conditionPassed = context.state.evaluateRulesGroup(data2.rules, data2.logicalOperator || "and");
      } else if (data2.evaluationMode === "js_eval" || data2.jsExpression && !data2.operator) {
        conditionPassed = Boolean(context.state.evaluateJsExpression(data2.jsExpression || ""));
      } else {
        conditionPassed = context.state.evaluateCondition(
          data2.leftOperand,
          data2.operator,
          data2.rightOperand
        );
      }
      if (!conditionPassed) {
        context.log("info", `Loop While finalizado (condi\xE7\xE3o falsa na itera\xE7\xE3o ${iteration}).`, node.id);
        break;
      }
      iteration++;
      context.log("debug", `Executando itera\xE7\xE3o #${iteration} do Loop While`, node.id);
      for (const bNode of bodyNodes) {
        await this.traverseNode(bNode, graph, context);
      }
    }
    if (iteration >= maxIterations) {
      context.log("warn", `Loop While atingiu o limite de seguran\xE7a de ${maxIterations} itera\xE7\xF5es.`, node.id);
    }
    const whileOutput = {
      completed: true,
      iterations: iteration,
      maxIterationsReached: iteration >= maxIterations,
      completedAt: Date.now()
    };
    context.state.recordNodeOutput(node.id, node.data?.label, whileOutput);
    context.events.onNodeComplete?.(node, {
      nodeId: node.id,
      status: "success",
      outputHandle: "loop_done",
      outputData: whileOutput,
      startTime: Date.now(),
      endTime: Date.now(),
      durationMs: 0
    });
    const nextAfterLoop = doneNodes.length > 0 ? doneNodes : this.getNextNodes(node.id, graph, "default");
    for (const dNode of nextAfterLoop) {
      await this.traverseNode(dNode, graph, context);
    }
  }
  /**
   * Executa bloco de Loop For
   */
  async executeForLoop(node, graph, context) {
    const data2 = node.data;
    const itemVar = data2.itemVarName || "item";
    const indexVar = data2.indexVarName || "index";
    const maxIterations = data2.maxIterations || 1e3;
    let itemsToIterate = [];
    if (data2.loopType === "count") {
      const resolvedCount = Number(context.state.interpolate(String(data2.countExpression || 0)));
      itemsToIterate = Array.from({ length: Math.min(resolvedCount, maxIterations) }, (_, i) => i);
    } else if (data2.loopType === "js_generator" || data2.jsExpression) {
      const evalResult = context.state.evaluateJsExpression(data2.jsExpression || "");
      if (Array.isArray(evalResult)) {
        itemsToIterate = evalResult.slice(0, maxIterations);
      } else if (typeof evalResult === "number") {
        itemsToIterate = Array.from({ length: Math.min(evalResult, maxIterations) }, (_, i) => i);
      } else {
        itemsToIterate = [];
      }
    } else {
      const resolvedArray = typeof data2.arrayExpression === "string" ? context.state.resolvePath(data2.arrayExpression.replace(/[{}]/g, "").trim()) || [] : [];
      itemsToIterate = Array.isArray(resolvedArray) ? resolvedArray.slice(0, maxIterations) : [];
    }
    context.events.onNodeStart?.(node);
    context.log("info", `Iniciando Loop For com ${itemsToIterate.length} itera\xE7\xF5es...`, node.id);
    const bodyNodes = this.getNextNodes(node.id, graph, "loop_body");
    const doneNodes = this.getNextNodes(node.id, graph, "loop_done");
    for (let i = 0; i < itemsToIterate.length; i++) {
      if (context.isCancelled())
        break;
      await context.checkPausePoint();
      const currentItem = itemsToIterate[i];
      context.state.set(indexVar, i);
      context.state.set(itemVar, currentItem);
      context.log("debug", `Loop For: itera\xE7\xE3o ${i + 1}/${itemsToIterate.length}`, node.id);
      for (const bNode of bodyNodes) {
        await this.traverseNode(bNode, graph, context);
      }
    }
    const forOutput = {
      completed: true,
      totalIterations: itemsToIterate.length,
      loopType: data2.loopType || "count",
      itemVar,
      indexVar,
      completedAt: Date.now()
    };
    context.state.recordNodeOutput(node.id, node.data?.label, forOutput);
    context.events.onNodeComplete?.(node, {
      nodeId: node.id,
      status: "success",
      outputHandle: "loop_done",
      outputData: forOutput,
      startTime: Date.now(),
      endTime: Date.now(),
      durationMs: 0
    });
    const nextAfterLoop = doneNodes.length > 0 ? doneNodes : this.getNextNodes(node.id, graph, "default");
    for (const dNode of nextAfterLoop) {
      await this.traverseNode(dNode, graph, context);
    }
  }
  /**
   * Obtém os próximos nós a serem executados a partir das arestas conectadas
   * Aplica a ordenação vertical (menor Y tem prioridade)
   */
  getNextNodes(sourceNodeId, graph, outputHandle) {
    const outgoingEdges = graph.edges.filter((edge) => {
      if (edge.source !== sourceNodeId)
        return false;
      if (outputHandle !== void 0) {
        if (!edge.sourceHandle || edge.sourceHandle === outputHandle)
          return true;
        if (outputHandle === "default" && (edge.sourceHandle === "output" || edge.sourceHandle === "out"))
          return true;
        return false;
      }
      return true;
    });
    const targetNodes = outgoingEdges.map((edge) => graph.nodes.find((n2) => n2.id === edge.target)).filter((n2) => n2 !== void 0);
    return targetNodes.sort((a, b) => a.position.y - b.position.y);
  }
};

// ../BibliotecaDeDev/src/engine/blocks/BaseBlockHandler.ts
var BaseBlockHandler = class {
  /**
   * Constrói resultado padronizado de sucesso
   */
  success(nodeId, outputHandle = "default", outputData) {
    return {
      nodeId,
      status: "success",
      outputHandle,
      outputData,
      startTime: 0,
      endTime: 0,
      durationMs: 0
    };
  }
  /**
   * Constrói resultado padronizado de falha
   */
  error(nodeId, err) {
    const errorObj = err instanceof Error ? err : new Error(String(err));
    return {
      nodeId,
      status: "failed",
      error: errorObj,
      startTime: 0,
      endTime: 0,
      durationMs: 0
    };
  }
};

// ../BibliotecaDeDev/src/engine/blocks/flow/StartBlock.ts
var StartBlockHandler = class extends BaseBlockHandler {
  type = "start";
  async execute(node, context) {
    const trigger = node.data.triggerType || "manual";
    context.log("info", `Gatilho acionado: ${trigger}`, node.id);
    const currentUrl = await context.driver.getCurrentUrl().catch(() => "");
    const now = Date.now();
    return this.success(node.id, "default", {
      started: true,
      trigger,
      url: currentUrl,
      currentUrl,
      timestamp: now,
      isoDate: new Date(now).toISOString(),
      variables: context.state.getAll()
    });
  }
};

// ../BibliotecaDeDev/src/engine/blocks/flow/DelayBlock.ts
var DelayBlockHandler = class extends BaseBlockHandler {
  type = "delay";
  async execute(node, context) {
    let delayMs = node.data.fixedMs ?? 1e3;
    if (node.data.isRandom && node.data.randomRange) {
      const { minMs, maxMs } = node.data.randomRange;
      delayMs = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    }
    context.log("debug", `Aguardando delay de ${delayMs}ms...`, node.id);
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    const now = Date.now();
    return this.success(node.id, "default", {
      delayed: true,
      delayedMs: delayMs,
      delayedSeconds: Number((delayMs / 1e3).toFixed(2)),
      isRandom: Boolean(node.data.isRandom),
      completedAt: now,
      isoDate: new Date(now).toISOString()
    });
  }
};

// ../BibliotecaDeDev/src/engine/blocks/flow/SwitchBlock.ts
var SwitchBlockHandler = class extends BaseBlockHandler {
  type = "switch";
  async execute(node, context) {
    const { cases, hasDefaultBranch } = node.data;
    const prevInput = context.state.getLastNodeOutput();
    const inputPayload = typeof prevInput === "object" && prevInput !== null && !Array.isArray(prevInput) ? prevInput : {};
    for (const testCase of cases) {
      let passed = false;
      if (Array.isArray(testCase.conditionGroups) && testCase.conditionGroups.length > 0) {
        passed = context.state.evaluateConditionGroups(testCase.conditionGroups);
      } else if (Array.isArray(testCase.rules) && testCase.rules.length > 0) {
        passed = context.state.evaluateRulesGroup(testCase.rules, testCase.logicalOperator || "and");
      } else if (testCase.evaluationMode === "js_eval" || testCase.jsExpression && !testCase.operator) {
        const result = context.state.evaluateJsExpression(testCase.jsExpression || "");
        passed = Boolean(result);
      } else {
        passed = context.state.evaluateCondition(
          testCase.leftOperand,
          testCase.operator,
          testCase.rightOperand
        );
      }
      if (passed) {
        context.log("info", `Condi\xE7\xE3o satisfeita para o caso [${testCase.label || testCase.id}]`, node.id);
        return this.success(node.id, testCase.id, {
          ...inputPayload,
          matched: true,
          matchedCase: testCase.id,
          matchedCaseId: testCase.id,
          matchedCaseLabel: testCase.label,
          branch: testCase.id,
          evaluatedAt: Date.now()
        });
      }
    }
    if (hasDefaultBranch) {
      context.log("info", "Nenhuma condi\xE7\xE3o satisfeita. Seguindo caminho default.", node.id);
      return this.success(node.id, "default", {
        ...inputPayload,
        matched: false,
        matchedCase: "default",
        matchedCaseId: "default",
        branch: "default",
        evaluatedAt: Date.now()
      });
    }
    return this.success(node.id, void 0, {
      ...inputPayload,
      matched: false,
      matchedCase: null,
      matchedCaseId: null,
      branch: null,
      evaluatedAt: Date.now()
    });
  }
};

// ../BibliotecaDeDev/src/engine/blocks/flow/IfElementExistsBlock.ts
var IfElementExistsBlockHandler = class extends BaseBlockHandler {
  type = "if_element_exists";
  async execute(node, context) {
    const { selector, selectorType, timeoutMs } = node.data;
    const interpolatedSelector = context.state.interpolate(selector);
    context.log("debug", `Verificando exist\xEAncia do elemento: ${interpolatedSelector}`, node.id);
    const exists = await context.driver.elementExists(interpolatedSelector, selectorType, timeoutMs);
    const branch = exists ? "true" : "false";
    context.log("info", `Elemento ${exists ? "encontrado" : "n\xE3o encontrado"}. Seguindo caminho: ${branch}`, node.id);
    return this.success(node.id, branch, {
      exists,
      selector: interpolatedSelector,
      selectorType: selectorType || "css",
      branch,
      checkedAt: Date.now()
    });
  }
};

// ../BibliotecaDeDev/src/engine/blocks/navigation/NavigateBlock.ts
var NavigateBlockHandler = class extends BaseBlockHandler {
  type = "navigate";
  async execute(node, context) {
    const url = context.state.interpolate(node.data.url);
    context.log("info", `Navegando para URL: ${url}`, node.id);
    await context.driver.navigateTo(url, node.data.waitUntil, node.data.timeoutMs);
    const finalUrl = await context.driver.getCurrentUrl().catch(() => url);
    return this.success(node.id, "default", {
      navigated: true,
      url: finalUrl,
      currentUrl: finalUrl,
      requestedUrl: url,
      waitUntil: node.data.waitUntil,
      timestamp: Date.now()
    });
  }
};

// ../BibliotecaDeDev/src/engine/blocks/navigation/TabActionBlock.ts
var TabActionBlockHandler = class extends BaseBlockHandler {
  type = "tab_action";
  async execute(node, context) {
    const { action, queryType, queryValue, saveUrlToVar, active } = node.data;
    let resultPayload = { action, success: true, timestamp: Date.now() };
    switch (action) {
      case "new_tab": {
        const targetUrl = node.data.url ? context.state.interpolate(node.data.url) : void 0;
        const res2 = await context.driver.createTab(targetUrl, active);
        if (saveUrlToVar && res2.url)
          context.state.set(saveUrlToVar, res2.url);
        resultPayload = { ...resultPayload, tabId: res2.tabId, url: res2.url, currentUrl: res2.url, active };
        break;
      }
      case "switch_tab": {
        const val = typeof queryValue === "string" ? context.state.interpolate(queryValue) : queryValue;
        await context.driver.switchTab(queryType || "title", val);
        const currentUrl = await context.driver.getCurrentUrl().catch(() => "");
        resultPayload = { ...resultPayload, queryType: queryType || "title", queryValue: val, currentUrl, url: currentUrl };
        break;
      }
      case "close_tab": {
        const val = typeof queryValue === "string" ? context.state.interpolate(queryValue) : queryValue;
        await context.driver.closeTab(queryType, val);
        resultPayload = { ...resultPayload, queryType, queryValue: val };
        break;
      }
      case "get_current_url": {
        const currentUrl = await context.driver.getCurrentUrl();
        if (saveUrlToVar)
          context.state.set(saveUrlToVar, currentUrl);
        resultPayload = { ...resultPayload, currentUrl, url: currentUrl };
        break;
      }
    }
    return this.success(node.id, "default", resultPayload);
  }
};

// ../BibliotecaDeDev/src/engine/blocks/navigation/HistoryNavigationBlock.ts
var HistoryNavigationBlockHandler = class extends BaseBlockHandler {
  type = "history_navigation";
  async execute(node, context) {
    await context.driver.navigateHistory(node.data.action, node.data.ignoreCache);
    const currentUrl = await context.driver.getCurrentUrl().catch(() => "");
    return this.success(node.id, "default", {
      navigated: true,
      action: node.data.action,
      currentUrl,
      url: currentUrl,
      ignoreCache: Boolean(node.data.ignoreCache),
      timestamp: Date.now()
    });
  }
};

// ../BibliotecaDeDev/src/engine/blocks/dom/ClickElementBlock.ts
var ClickElementBlockHandler = class extends BaseBlockHandler {
  type = "click_element";
  async execute(node, context) {
    const selector = context.state.interpolate(node.data.selector);
    await context.driver.clickElement(
      selector,
      node.data.selectorType,
      node.data.clickType,
      node.data.timeoutMs,
      node.data.clickCoordinates
    );
    const currentUrl = await context.driver.getCurrentUrl().catch(() => "");
    return this.success(node.id, "default", {
      clicked: true,
      selector,
      selectorType: node.data.selectorType || "css",
      clickType: node.data.clickType || "single",
      coordinates: node.data.clickCoordinates || null,
      currentUrl,
      url: currentUrl,
      timestamp: Date.now()
    });
  }
};

// ../BibliotecaDeDev/src/engine/blocks/dom/TypeInputBlock.ts
var TypeInputBlockHandler = class extends BaseBlockHandler {
  type = "type_input";
  async execute(node, context) {
    const selector = context.state.interpolate(node.data.selector);
    const text = context.state.interpolate(node.data.text);
    await context.driver.typeText(
      selector,
      node.data.selectorType,
      text,
      node.data.mode,
      node.data.minTypingDelayMs,
      node.data.maxTypingDelayMs,
      node.data.clearBeforeTyping,
      node.data.pressEnterAfter,
      node.data.timeoutMs
    );
    return this.success(node.id, "default", {
      typed: true,
      selector,
      selectorType: node.data.selectorType || "css",
      text,
      value: text,
      textLength: text.length,
      mode: node.data.mode || "human_typing",
      clearedBefore: Boolean(node.data.clearBeforeTyping),
      pressedEnter: Boolean(node.data.pressEnterAfter),
      timestamp: Date.now()
    });
  }
};

// ../BibliotecaDeDev/src/engine/blocks/dom/PressKeyBlock.ts
var PressKeyBlockHandler = class extends BaseBlockHandler {
  type = "press_key";
  async execute(node, context) {
    const selector = node.data.selector ? context.state.interpolate(node.data.selector) : void 0;
    await context.driver.pressKey(node.data.key, node.data.modifiers, selector, node.data.selectorType);
    return this.success(node.id, "default", {
      pressed: true,
      key: node.data.key,
      modifiers: node.data.modifiers || [],
      selector: selector || null,
      selectorType: node.data.selectorType || "css",
      timestamp: Date.now()
    });
  }
};

// ../BibliotecaDeDev/src/engine/blocks/dom/HoverFocusBlock.ts
var HoverFocusBlockHandler = class extends BaseBlockHandler {
  type = "hover_focus";
  async execute(node, context) {
    const selector = context.state.interpolate(node.data.selector);
    await context.driver.hoverOrFocus(selector, node.data.selectorType, node.data.action, node.data.timeoutMs);
    return this.success(node.id, "default", {
      success: true,
      action: node.data.action || "hover",
      selector,
      selectorType: node.data.selectorType || "css",
      timestamp: Date.now()
    });
  }
};

// ../BibliotecaDeDev/src/engine/blocks/dom/ScrollBlock.ts
var ScrollBlockHandler = class extends BaseBlockHandler {
  type = "scroll";
  async execute(node, context) {
    const selector = node.data.selector ? context.state.interpolate(node.data.selector) : void 0;
    await context.driver.scroll(
      node.data.target,
      selector,
      node.data.selectorType,
      node.data.deltaX,
      node.data.deltaY,
      node.data.smooth
    );
    return this.success(node.id, "default", {
      scrolled: true,
      target: node.data.target,
      selector: selector || null,
      selectorType: node.data.selectorType || "css",
      deltaX: node.data.deltaX ?? 0,
      deltaY: node.data.deltaY ?? 0,
      smooth: Boolean(node.data.smooth),
      timestamp: Date.now()
    });
  }
};

// ../BibliotecaDeDev/src/engine/blocks/dom/WaitForElementBlock.ts
var WaitForElementBlockHandler = class extends BaseBlockHandler {
  type = "wait_for_element";
  async execute(node, context) {
    const selector = context.state.interpolate(node.data.selector);
    const found = await context.driver.waitForElement(selector, node.data.selectorType, node.data.state, node.data.timeoutMs);
    return this.success(node.id, "default", {
      found,
      selector,
      selectorType: node.data.selectorType || "css",
      state: node.data.state || "visible",
      timeoutMs: node.data.timeoutMs,
      timestamp: Date.now()
    });
  }
};

// ../BibliotecaDeDev/src/engine/blocks/data/SetVariableBlock.ts
var SetVariableBlockHandler = class extends BaseBlockHandler {
  type = "set_variable";
  async execute(node, context) {
    const { varName, evaluationType, valueExpression, readonly } = node.data;
    if (context.state.isReadonly(varName)) {
      context.log("warn", "Vari\xE1vel [" + varName + "] \xE9 constante/somente leitura e n\xE3o pode ser modificada.", node.id);
      return this.success(node.id, "default", {
        varName,
        value: context.state.get(varName),
        [varName]: context.state.get(varName),
        blocked: true,
        isReadonly: true
      });
    }
    let finalValue;
    if (evaluationType === "template") {
      finalValue = context.state.interpolate(String(valueExpression));
    } else if (evaluationType === "js_eval") {
      finalValue = context.state.evaluateJsExpression(String(valueExpression), true);
    } else {
      finalValue = valueExpression;
    }
    context.state.set(varName, finalValue);
    if (readonly) {
      context.state.setReadonly(varName, true);
      context.log("info", "Vari\xE1vel [" + varName + "] foi protegida contra altera\xE7\xF5es futuras (Constante).", node.id);
    }
    context.events.onVariableChange?.(varName, finalValue);
    context.log("info", `Vari\xE1vel [${varName}] definida com valor: ${JSON.stringify(finalValue)}`, node.id);
    const valType = Array.isArray(finalValue) ? "array" : finalValue === null ? "null" : typeof finalValue;
    return this.success(node.id, "default", {
      varName,
      value: finalValue,
      [varName]: finalValue,
      type: valType,
      isReadonly: Boolean(readonly),
      updatedAt: Date.now()
    });
  }
};

// ../BibliotecaDeDev/src/engine/blocks/data/HttpRequestBlock.ts
var HttpRequestBlockHandler = class extends BaseBlockHandler {
  type = "http_request";
  async execute(node, context) {
    const { url, method, headers, body, responseType, saveResponseToVar, saveStatusToVar } = node.data;
    const resolvedUrl = context.state.interpolate(url);
    const resolvedHeaders = {};
    if (headers) {
      for (const [k, v] of Object.entries(headers)) {
        resolvedHeaders[k] = context.state.interpolate(v);
      }
    }
    const resolvedBody = body ? context.state.interpolate(body) : void 0;
    context.log("info", `Executando requisi\xE7\xE3o HTTP ${method} para ${resolvedUrl}`, node.id);
    const response = await fetch(resolvedUrl, {
      method,
      headers: resolvedHeaders,
      body: method !== "GET" && method !== "HEAD" ? resolvedBody : void 0
    });
    let data2;
    if (responseType === "text") {
      data2 = await response.text();
    } else {
      data2 = await response.json();
    }
    if (saveResponseToVar) {
      context.state.set(saveResponseToVar, data2);
    }
    if (saveStatusToVar) {
      context.state.set(saveStatusToVar, response.status);
    }
    const responseHeaders = {};
    try {
      response.headers.forEach((v, k) => {
        responseHeaders[k] = v;
      });
    } catch {
    }
    const outputData = {
      data: data2,
      response: data2,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: responseHeaders,
      url: resolvedUrl,
      method: method || "GET",
      timestamp: Date.now()
    };
    if (saveResponseToVar) {
      outputData[saveResponseToVar] = data2;
    }
    if (saveStatusToVar) {
      outputData[saveStatusToVar] = response.status;
    }
    return this.success(node.id, "default", outputData);
  }
};

// ../BibliotecaDeDev/src/engine/blocks/data/ExtractDataBlock.ts
var ExtractDataBlockHandler = class extends BaseBlockHandler {
  type = "extract_data";
  async execute(node, context) {
    const selector = context.state.interpolate(node.data.selector);
    const data2 = await context.driver.extractData(
      selector,
      node.data.selectorType,
      node.data.extractType,
      node.data.attributeName,
      node.data.timeoutMs
    );
    if (node.data.saveToVar) {
      context.state.set(node.data.saveToVar, data2);
    }
    context.log("info", `Dado extra\xEDdo salvo em [${node.data.saveToVar || "output"}]`, node.id);
    const outputData = {
      value: data2,
      extracted: data2,
      selector,
      selectorType: node.data.selectorType || "css",
      extractType: node.data.extractType,
      attributeName: node.data.attributeName || null,
      length: typeof data2 === "string" ? data2.length : Array.isArray(data2) ? data2.length : void 0,
      extractedAt: Date.now()
    };
    if (node.data.saveToVar) {
      outputData[node.data.saveToVar] = data2;
    }
    return this.success(node.id, "default", outputData);
  }
};

// ../BibliotecaDeDev/src/engine/blocks/data/ScrapeListBlock.ts
var ScrapeListBlockHandler = class extends BaseBlockHandler {
  type = "scrape_list";
  async execute(node, context) {
    const selector = context.state.interpolate(node.data.selector);
    const items = await context.driver.scrapeList(
      selector,
      node.data.selectorType,
      node.data.fields,
      node.data.maxItems,
      node.data.timeoutMs
    );
    if (node.data.saveToVar) {
      context.state.set(node.data.saveToVar, items);
    }
    context.log("info", `Lista raspada (${items.length} itens) salva em [${node.data.saveToVar || "output"}]`, node.id);
    const count = items.length;
    const firstItem = count > 0 ? items[0] : null;
    const lastItem = count > 0 ? items[count - 1] : null;
    const fieldNames = (node.data.fields || []).map((f) => f.name);
    const outputData = {
      items,
      count,
      total: count,
      firstItem,
      lastItem,
      fields: fieldNames,
      selector,
      scrapedAt: Date.now()
    };
    if (node.data.saveToVar) {
      outputData[node.data.saveToVar] = items;
    }
    return this.success(node.id, "default", outputData);
  }
};

// ../BibliotecaDeDev/src/engine/blocks/data/ExportFileBlock.ts
var ExportFileBlockHandler = class extends BaseBlockHandler {
  type = "export_file";
  async execute(node, context) {
    const rawData = context.state.get(node.data.sourceVar);
    const filename = context.state.interpolate(node.data.filename);
    let content = "";
    let mimeType = "text/plain";
    if (node.data.format === "json") {
      content = JSON.stringify(rawData, null, 2);
      mimeType = "application/json";
    } else if (node.data.format === "csv") {
      mimeType = "text/csv";
      const delimiter = node.data.csvDelimiter || ",";
      if (Array.isArray(rawData) && rawData.length > 0) {
        const headers = Object.keys(rawData[0]);
        const headerRow = headers.join(delimiter);
        const rows = rawData.map(
          (item) => headers.map((h) => JSON.stringify(item[h] ?? "")).join(delimiter)
        );
        content = [headerRow, ...rows].join("\n");
      }
    }
    await context.driver.downloadFile(content, filename, mimeType);
    context.log("info", `Arquivo ${filename} exportado com sucesso.`, node.id);
    const itemsCount = Array.isArray(rawData) ? rawData.length : void 0;
    return this.success(node.id, "default", {
      exported: true,
      filename,
      format: node.data.format,
      size: content.length,
      mimeType,
      sourceVar: node.data.sourceVar,
      itemsCount,
      timestamp: Date.now()
    });
  }
};

// ../BibliotecaDeDev/src/engine/blocks/injection/InjectJavascriptBlock.ts
var InjectJavascriptBlockHandler = class extends BaseBlockHandler {
  type = "inject_javascript";
  async execute(node, context) {
    const code = context.state.interpolate(node.data.code);
    const args = (node.data.args || []).map((arg) => context.state.get(arg));
    const result = await context.driver.injectScript(code, node.data.context, args);
    if (node.data.saveResultToVar) {
      context.state.set(node.data.saveResultToVar, result);
    }
    let outputData;
    if (typeof result === "object" && result !== null && !Array.isArray(result)) {
      outputData = {
        ...result,
        result,
        executed: true,
        context: node.data.context,
        timestamp: Date.now()
      };
    } else {
      outputData = {
        result,
        executed: true,
        context: node.data.context,
        timestamp: Date.now()
      };
    }
    if (node.data.saveResultToVar) {
      outputData[node.data.saveResultToVar] = result;
    }
    return this.success(node.id, "default", outputData);
  }
};

// ../BibliotecaDeDev/src/engine/blocks/injection/InjectHtmlBlock.ts
var InjectHtmlBlockHandler = class extends BaseBlockHandler {
  type = "inject_html";
  async execute(node, context) {
    const html = context.state.interpolate(node.data.html);
    const selector = context.state.interpolate(node.data.targetSelector);
    await context.driver.injectHtml(html, selector, node.data.position, node.data.selectorType);
    return this.success(node.id, "default", {
      injected: true,
      targetSelector: selector,
      selectorType: node.data.selectorType || "css",
      position: node.data.position || "beforeend",
      htmlLength: html.length,
      timestamp: Date.now()
    });
  }
};

// ../BibliotecaDeDev/src/engine/blocks/injection/InjectCssBlock.ts
var InjectCssBlockHandler = class extends BaseBlockHandler {
  type = "inject_css";
  async execute(node, context) {
    const css = context.state.interpolate(node.data.css);
    await context.driver.injectCss(css, node.data.target, node.data.styleId);
    return this.success(node.id, "default", {
      injected: true,
      target: node.data.target || "page",
      styleId: node.data.styleId || null,
      cssLength: css.length,
      timestamp: Date.now()
    });
  }
};

// ../BibliotecaDeDev/src/engine/blocks/injection/WebComponentBlock.ts
var WebComponentBlockHandler = class extends BaseBlockHandler {
  type = "web_component";
  async execute(node, context) {
    const html = context.state.interpolate(node.data.html);
    const css = context.state.interpolate(node.data.css);
    const js = context.state.interpolate(node.data.js);
    await context.driver.injectWebComponent(html, css, js, node.data.containerId, node.data.mode);
    return this.success(node.id, "default", {
      injected: true,
      containerId: node.data.containerId,
      mode: node.data.mode || "shadow_dom",
      hasScript: Boolean(js && js.trim()),
      hasStyle: Boolean(css && css.trim()),
      timestamp: Date.now()
    });
  }
};

// ../BibliotecaDeDev/src/engine/blocks/BlockRegistry.ts
var BlockRegistry = class {
  blocks = /* @__PURE__ */ new Map();
  constructor() {
    this.registerDefaults();
  }
  /**
   * Registra uma instância de bloco
   */
  register(block) {
    this.blocks.set(block.type, block);
    return this;
  }
  /**
   * Obtém a instância do executor de um bloco pelo tipo
   */
  get(type) {
    return this.blocks.get(type);
  }
  /**
   * Verifica se um bloco está registrado
   */
  has(type) {
    return this.blocks.has(type);
  }
  /**
   * Remove um bloco do registro
   */
  unregister(type) {
    return this.blocks.delete(type);
  }
  /**
   * Retorna todos os blocos registrados
   */
  getAll() {
    return Array.from(this.blocks.values());
  }
  /**
   * Vincula e registra todos os blocos em uma instância de ExecutionEngine
   */
  bindToEngine(engine) {
    for (const [type, handler] of this.blocks.entries()) {
      engine.registerHandler(type, handler);
    }
  }
  /**
   * Registra todas as implementações padrão dos blocos
   */
  registerDefaults() {
    this.register(new StartBlockHandler());
    this.register(new DelayBlockHandler());
    this.register(new SwitchBlockHandler());
    this.register(new IfElementExistsBlockHandler());
    this.register(new NavigateBlockHandler());
    this.register(new TabActionBlockHandler());
    this.register(new HistoryNavigationBlockHandler());
    this.register(new ClickElementBlockHandler());
    this.register(new TypeInputBlockHandler());
    this.register(new PressKeyBlockHandler());
    this.register(new HoverFocusBlockHandler());
    this.register(new ScrollBlockHandler());
    this.register(new WaitForElementBlockHandler());
    this.register(new SetVariableBlockHandler());
    this.register(new HttpRequestBlockHandler());
    this.register(new ExtractDataBlockHandler());
    this.register(new ScrapeListBlockHandler());
    this.register(new ExportFileBlockHandler());
    this.register(new InjectJavascriptBlockHandler());
    this.register(new InjectHtmlBlockHandler());
    this.register(new InjectCssBlockHandler());
    this.register(new WebComponentBlockHandler());
  }
};
var defaultBlockRegistry = new BlockRegistry();

// ../BibliotecaDeDev/src/engine/DefaultHandlers.ts
function registerAllDefaultHandlers(engine) {
  defaultBlockRegistry.bindToEngine(engine);
}

// ../BibliotecaDeDev/src/types/schema.ts
function getTriggerUrlPatterns(trigger) {
  if (!trigger)
    return [];
  const list = [];
  if (Array.isArray(trigger.urlPatterns) && trigger.urlPatterns.length > 0) {
    list.push(...trigger.urlPatterns.map((u) => u.trim()).filter((u) => u.length > 0));
  } else if (trigger.urlPattern && trigger.urlPattern.trim()) {
    list.push(trigger.urlPattern.trim());
  }
  if (trigger.floatingButton?.urlPattern && trigger.floatingButton.urlPattern.trim()) {
    if (!list.includes(trigger.floatingButton.urlPattern.trim())) {
      list.push(trigger.floatingButton.urlPattern.trim());
    }
  }
  return list.length > 0 ? list : [];
}
function getActiveTriggers(data2) {
  if (!data2)
    return [{ type: "manual", enabled: true }];
  if (Array.isArray(data2.triggers) && data2.triggers.length > 0) {
    return data2.triggers.filter((t) => t.enabled !== false);
  }
  const singleType = data2.triggerType || "manual";
  return [
    {
      type: singleType,
      enabled: true,
      urlPattern: data2.urlPattern,
      urlPatterns: data2.urlPatterns || (data2.urlPattern ? [data2.urlPattern] : void 0),
      shortcutKey: data2.shortcutKey,
      intervalMinutes: data2.intervalMinutes,
      cronExpression: data2.cronExpression,
      contextMenuTitle: data2.contextMenuTitle,
      floatingButton: data2.floatingButton
    }
  ];
}

// node_modules/buble/dist/buble-browser.es.js
var import_acorn = __toESM(require_acorn());
var import_acorn_jsx = __toESM(require_acorn_jsx());
var import_acorn_dynamic_import = __toESM(require_lib());

// node_modules/sourcemap-codec/dist/sourcemap-codec.es.js
var charToInteger = {};
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
for (i = 0; i < chars.length; i++) {
  charToInteger[chars.charCodeAt(i)] = i;
}
var i;
function encode(decoded) {
  var sourceFileIndex = 0;
  var sourceCodeLine = 0;
  var sourceCodeColumn = 0;
  var nameIndex = 0;
  var mappings = "";
  for (var i = 0; i < decoded.length; i++) {
    var line = decoded[i];
    if (i > 0)
      mappings += ";";
    if (line.length === 0)
      continue;
    var generatedCodeColumn = 0;
    var lineMappings = [];
    for (var _i = 0, line_1 = line; _i < line_1.length; _i++) {
      var segment = line_1[_i];
      var segmentMappings = encodeInteger(segment[0] - generatedCodeColumn);
      generatedCodeColumn = segment[0];
      if (segment.length > 1) {
        segmentMappings += encodeInteger(segment[1] - sourceFileIndex) + encodeInteger(segment[2] - sourceCodeLine) + encodeInteger(segment[3] - sourceCodeColumn);
        sourceFileIndex = segment[1];
        sourceCodeLine = segment[2];
        sourceCodeColumn = segment[3];
      }
      if (segment.length === 5) {
        segmentMappings += encodeInteger(segment[4] - nameIndex);
        nameIndex = segment[4];
      }
      lineMappings.push(segmentMappings);
    }
    mappings += lineMappings.join(",");
  }
  return mappings;
}
function encodeInteger(num) {
  var result = "";
  num = num < 0 ? -num << 1 | 1 : num << 1;
  do {
    var clamped = num & 31;
    num >>>= 5;
    if (num > 0) {
      clamped |= 32;
    }
    result += chars[clamped];
  } while (num > 0);
  return result;
}

// node_modules/magic-string/dist/magic-string.es.js
var BitSet = function BitSet2(arg) {
  this.bits = arg instanceof BitSet2 ? arg.bits.slice() : [];
};
BitSet.prototype.add = function add(n2) {
  this.bits[n2 >> 5] |= 1 << (n2 & 31);
};
BitSet.prototype.has = function has(n2) {
  return !!(this.bits[n2 >> 5] & 1 << (n2 & 31));
};
var Chunk = function Chunk2(start, end, content) {
  this.start = start;
  this.end = end;
  this.original = content;
  this.intro = "";
  this.outro = "";
  this.content = content;
  this.storeName = false;
  this.edited = false;
  Object.defineProperties(this, {
    previous: { writable: true, value: null },
    next: { writable: true, value: null }
  });
};
Chunk.prototype.appendLeft = function appendLeft(content) {
  this.outro += content;
};
Chunk.prototype.appendRight = function appendRight(content) {
  this.intro = this.intro + content;
};
Chunk.prototype.clone = function clone() {
  var chunk = new Chunk(this.start, this.end, this.original);
  chunk.intro = this.intro;
  chunk.outro = this.outro;
  chunk.content = this.content;
  chunk.storeName = this.storeName;
  chunk.edited = this.edited;
  return chunk;
};
Chunk.prototype.contains = function contains(index) {
  return this.start < index && index < this.end;
};
Chunk.prototype.eachNext = function eachNext(fn) {
  var chunk = this;
  while (chunk) {
    fn(chunk);
    chunk = chunk.next;
  }
};
Chunk.prototype.eachPrevious = function eachPrevious(fn) {
  var chunk = this;
  while (chunk) {
    fn(chunk);
    chunk = chunk.previous;
  }
};
Chunk.prototype.edit = function edit(content, storeName, contentOnly) {
  this.content = content;
  if (!contentOnly) {
    this.intro = "";
    this.outro = "";
  }
  this.storeName = storeName;
  this.edited = true;
  return this;
};
Chunk.prototype.prependLeft = function prependLeft(content) {
  this.outro = content + this.outro;
};
Chunk.prototype.prependRight = function prependRight(content) {
  this.intro = content + this.intro;
};
Chunk.prototype.split = function split(index) {
  var sliceIndex = index - this.start;
  var originalBefore = this.original.slice(0, sliceIndex);
  var originalAfter = this.original.slice(sliceIndex);
  this.original = originalBefore;
  var newChunk = new Chunk(index, this.end, originalAfter);
  newChunk.outro = this.outro;
  this.outro = "";
  this.end = index;
  if (this.edited) {
    newChunk.edit("", false);
    this.content = "";
  } else {
    this.content = originalBefore;
  }
  newChunk.next = this.next;
  if (newChunk.next) {
    newChunk.next.previous = newChunk;
  }
  newChunk.previous = this;
  this.next = newChunk;
  return newChunk;
};
Chunk.prototype.toString = function toString() {
  return this.intro + this.content + this.outro;
};
Chunk.prototype.trimEnd = function trimEnd(rx) {
  this.outro = this.outro.replace(rx, "");
  if (this.outro.length) {
    return true;
  }
  var trimmed = this.content.replace(rx, "");
  if (trimmed.length) {
    if (trimmed !== this.content) {
      this.split(this.start + trimmed.length).edit("", void 0, true);
    }
    return true;
  } else {
    this.edit("", void 0, true);
    this.intro = this.intro.replace(rx, "");
    if (this.intro.length) {
      return true;
    }
  }
};
Chunk.prototype.trimStart = function trimStart(rx) {
  this.intro = this.intro.replace(rx, "");
  if (this.intro.length) {
    return true;
  }
  var trimmed = this.content.replace(rx, "");
  if (trimmed.length) {
    if (trimmed !== this.content) {
      this.split(this.end - trimmed.length);
      this.edit("", void 0, true);
    }
    return true;
  } else {
    this.edit("", void 0, true);
    this.outro = this.outro.replace(rx, "");
    if (this.outro.length) {
      return true;
    }
  }
};
var btoa2 = function() {
  throw new Error("Unsupported environment: `window.btoa` or `Buffer` should be supported.");
};
if (typeof window !== "undefined" && typeof window.btoa === "function") {
  btoa2 = function(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
  };
} else if (typeof Buffer === "function") {
  btoa2 = function(str) {
    return Buffer.from(str, "utf-8").toString("base64");
  };
}
var SourceMap = function SourceMap2(properties) {
  this.version = 3;
  this.file = properties.file;
  this.sources = properties.sources;
  this.sourcesContent = properties.sourcesContent;
  this.names = properties.names;
  this.mappings = encode(properties.mappings);
};
SourceMap.prototype.toString = function toString2() {
  return JSON.stringify(this);
};
SourceMap.prototype.toUrl = function toUrl() {
  return "data:application/json;charset=utf-8;base64," + btoa2(this.toString());
};
function guessIndent(code) {
  var lines = code.split("\n");
  var tabbed = lines.filter(function(line) {
    return /^\t+/.test(line);
  });
  var spaced = lines.filter(function(line) {
    return /^ {2,}/.test(line);
  });
  if (tabbed.length === 0 && spaced.length === 0) {
    return null;
  }
  if (tabbed.length >= spaced.length) {
    return "	";
  }
  var min = spaced.reduce(function(previous, current2) {
    var numSpaces = /^ +/.exec(current2)[0].length;
    return Math.min(numSpaces, previous);
  }, Infinity);
  return new Array(min + 1).join(" ");
}
function getRelativePath(from, to) {
  var fromParts = from.split(/[/\\]/);
  var toParts = to.split(/[/\\]/);
  fromParts.pop();
  while (fromParts[0] === toParts[0]) {
    fromParts.shift();
    toParts.shift();
  }
  if (fromParts.length) {
    var i = fromParts.length;
    while (i--) {
      fromParts[i] = "..";
    }
  }
  return fromParts.concat(toParts).join("/");
}
var toString3 = Object.prototype.toString;
function isObject(thing) {
  return toString3.call(thing) === "[object Object]";
}
function getLocator(source) {
  var originalLines = source.split("\n");
  var lineOffsets = [];
  for (var i = 0, pos = 0; i < originalLines.length; i++) {
    lineOffsets.push(pos);
    pos += originalLines[i].length + 1;
  }
  return function locate2(index) {
    var i2 = 0;
    var j = lineOffsets.length;
    while (i2 < j) {
      var m = i2 + j >> 1;
      if (index < lineOffsets[m]) {
        j = m;
      } else {
        i2 = m + 1;
      }
    }
    var line = i2 - 1;
    var column = index - lineOffsets[line];
    return { line, column };
  };
}
var Mappings = function Mappings2(hires) {
  this.hires = hires;
  this.generatedCodeLine = 0;
  this.generatedCodeColumn = 0;
  this.raw = [];
  this.rawSegments = this.raw[this.generatedCodeLine] = [];
  this.pending = null;
};
Mappings.prototype.addEdit = function addEdit(sourceIndex, content, loc, nameIndex) {
  if (content.length) {
    var segment = [this.generatedCodeColumn, sourceIndex, loc.line, loc.column];
    if (nameIndex >= 0) {
      segment.push(nameIndex);
    }
    this.rawSegments.push(segment);
  } else if (this.pending) {
    this.rawSegments.push(this.pending);
  }
  this.advance(content);
  this.pending = null;
};
Mappings.prototype.addUneditedChunk = function addUneditedChunk(sourceIndex, chunk, original, loc, sourcemapLocations) {
  var originalCharIndex = chunk.start;
  var first = true;
  while (originalCharIndex < chunk.end) {
    if (this.hires || first || sourcemapLocations.has(originalCharIndex)) {
      this.rawSegments.push([this.generatedCodeColumn, sourceIndex, loc.line, loc.column]);
    }
    if (original[originalCharIndex] === "\n") {
      loc.line += 1;
      loc.column = 0;
      this.generatedCodeLine += 1;
      this.raw[this.generatedCodeLine] = this.rawSegments = [];
      this.generatedCodeColumn = 0;
      first = true;
    } else {
      loc.column += 1;
      this.generatedCodeColumn += 1;
      first = false;
    }
    originalCharIndex += 1;
  }
  this.pending = null;
};
Mappings.prototype.advance = function advance(str) {
  if (!str) {
    return;
  }
  var lines = str.split("\n");
  if (lines.length > 1) {
    for (var i = 0; i < lines.length - 1; i++) {
      this.generatedCodeLine++;
      this.raw[this.generatedCodeLine] = this.rawSegments = [];
    }
    this.generatedCodeColumn = 0;
  }
  this.generatedCodeColumn += lines[lines.length - 1].length;
};
var n = "\n";
var warned = {
  insertLeft: false,
  insertRight: false,
  storeName: false
};
var MagicString = function MagicString2(string, options) {
  if (options === void 0)
    options = {};
  var chunk = new Chunk(0, string.length, string);
  Object.defineProperties(this, {
    original: { writable: true, value: string },
    outro: { writable: true, value: "" },
    intro: { writable: true, value: "" },
    firstChunk: { writable: true, value: chunk },
    lastChunk: { writable: true, value: chunk },
    lastSearchedChunk: { writable: true, value: chunk },
    byStart: { writable: true, value: {} },
    byEnd: { writable: true, value: {} },
    filename: { writable: true, value: options.filename },
    indentExclusionRanges: { writable: true, value: options.indentExclusionRanges },
    sourcemapLocations: { writable: true, value: new BitSet() },
    storedNames: { writable: true, value: {} },
    indentStr: { writable: true, value: guessIndent(string) }
  });
  this.byStart[0] = chunk;
  this.byEnd[string.length] = chunk;
};
MagicString.prototype.addSourcemapLocation = function addSourcemapLocation(char) {
  this.sourcemapLocations.add(char);
};
MagicString.prototype.append = function append(content) {
  if (typeof content !== "string") {
    throw new TypeError("outro content must be a string");
  }
  this.outro += content;
  return this;
};
MagicString.prototype.appendLeft = function appendLeft2(index, content) {
  if (typeof content !== "string") {
    throw new TypeError("inserted content must be a string");
  }
  this._split(index);
  var chunk = this.byEnd[index];
  if (chunk) {
    chunk.appendLeft(content);
  } else {
    this.intro += content;
  }
  return this;
};
MagicString.prototype.appendRight = function appendRight2(index, content) {
  if (typeof content !== "string") {
    throw new TypeError("inserted content must be a string");
  }
  this._split(index);
  var chunk = this.byStart[index];
  if (chunk) {
    chunk.appendRight(content);
  } else {
    this.outro += content;
  }
  return this;
};
MagicString.prototype.clone = function clone2() {
  var cloned = new MagicString(this.original, { filename: this.filename });
  var originalChunk = this.firstChunk;
  var clonedChunk = cloned.firstChunk = cloned.lastSearchedChunk = originalChunk.clone();
  while (originalChunk) {
    cloned.byStart[clonedChunk.start] = clonedChunk;
    cloned.byEnd[clonedChunk.end] = clonedChunk;
    var nextOriginalChunk = originalChunk.next;
    var nextClonedChunk = nextOriginalChunk && nextOriginalChunk.clone();
    if (nextClonedChunk) {
      clonedChunk.next = nextClonedChunk;
      nextClonedChunk.previous = clonedChunk;
      clonedChunk = nextClonedChunk;
    }
    originalChunk = nextOriginalChunk;
  }
  cloned.lastChunk = clonedChunk;
  if (this.indentExclusionRanges) {
    cloned.indentExclusionRanges = this.indentExclusionRanges.slice();
  }
  cloned.sourcemapLocations = new BitSet(this.sourcemapLocations);
  cloned.intro = this.intro;
  cloned.outro = this.outro;
  return cloned;
};
MagicString.prototype.generateDecodedMap = function generateDecodedMap(options) {
  var this$1$1 = this;
  options = options || {};
  var sourceIndex = 0;
  var names = Object.keys(this.storedNames);
  var mappings = new Mappings(options.hires);
  var locate2 = getLocator(this.original);
  if (this.intro) {
    mappings.advance(this.intro);
  }
  this.firstChunk.eachNext(function(chunk) {
    var loc = locate2(chunk.start);
    if (chunk.intro.length) {
      mappings.advance(chunk.intro);
    }
    if (chunk.edited) {
      mappings.addEdit(
        sourceIndex,
        chunk.content,
        loc,
        chunk.storeName ? names.indexOf(chunk.original) : -1
      );
    } else {
      mappings.addUneditedChunk(sourceIndex, chunk, this$1$1.original, loc, this$1$1.sourcemapLocations);
    }
    if (chunk.outro.length) {
      mappings.advance(chunk.outro);
    }
  });
  return {
    file: options.file ? options.file.split(/[/\\]/).pop() : null,
    sources: [options.source ? getRelativePath(options.file || "", options.source) : null],
    sourcesContent: options.includeContent ? [this.original] : [null],
    names,
    mappings: mappings.raw
  };
};
MagicString.prototype.generateMap = function generateMap(options) {
  return new SourceMap(this.generateDecodedMap(options));
};
MagicString.prototype.getIndentString = function getIndentString() {
  return this.indentStr === null ? "	" : this.indentStr;
};
MagicString.prototype.indent = function indent(indentStr, options) {
  var pattern = /^[^\r\n]/gm;
  if (isObject(indentStr)) {
    options = indentStr;
    indentStr = void 0;
  }
  indentStr = indentStr !== void 0 ? indentStr : this.indentStr || "	";
  if (indentStr === "") {
    return this;
  }
  options = options || {};
  var isExcluded = {};
  if (options.exclude) {
    var exclusions = typeof options.exclude[0] === "number" ? [options.exclude] : options.exclude;
    exclusions.forEach(function(exclusion) {
      for (var i = exclusion[0]; i < exclusion[1]; i += 1) {
        isExcluded[i] = true;
      }
    });
  }
  var shouldIndentNextCharacter = options.indentStart !== false;
  var replacer = function(match) {
    if (shouldIndentNextCharacter) {
      return "" + indentStr + match;
    }
    shouldIndentNextCharacter = true;
    return match;
  };
  this.intro = this.intro.replace(pattern, replacer);
  var charIndex = 0;
  var chunk = this.firstChunk;
  while (chunk) {
    var end = chunk.end;
    if (chunk.edited) {
      if (!isExcluded[charIndex]) {
        chunk.content = chunk.content.replace(pattern, replacer);
        if (chunk.content.length) {
          shouldIndentNextCharacter = chunk.content[chunk.content.length - 1] === "\n";
        }
      }
    } else {
      charIndex = chunk.start;
      while (charIndex < end) {
        if (!isExcluded[charIndex]) {
          var char = this.original[charIndex];
          if (char === "\n") {
            shouldIndentNextCharacter = true;
          } else if (char !== "\r" && shouldIndentNextCharacter) {
            shouldIndentNextCharacter = false;
            if (charIndex === chunk.start) {
              chunk.prependRight(indentStr);
            } else {
              this._splitChunk(chunk, charIndex);
              chunk = chunk.next;
              chunk.prependRight(indentStr);
            }
          }
        }
        charIndex += 1;
      }
    }
    charIndex = chunk.end;
    chunk = chunk.next;
  }
  this.outro = this.outro.replace(pattern, replacer);
  return this;
};
MagicString.prototype.insert = function insert() {
  throw new Error(
    "magicString.insert(...) is deprecated. Use prependRight(...) or appendLeft(...)"
  );
};
MagicString.prototype.insertLeft = function insertLeft(index, content) {
  if (!warned.insertLeft) {
    console.warn(
      "magicString.insertLeft(...) is deprecated. Use magicString.appendLeft(...) instead"
    );
    warned.insertLeft = true;
  }
  return this.appendLeft(index, content);
};
MagicString.prototype.insertRight = function insertRight(index, content) {
  if (!warned.insertRight) {
    console.warn(
      "magicString.insertRight(...) is deprecated. Use magicString.prependRight(...) instead"
    );
    warned.insertRight = true;
  }
  return this.prependRight(index, content);
};
MagicString.prototype.move = function move(start, end, index) {
  if (index >= start && index <= end) {
    throw new Error("Cannot move a selection inside itself");
  }
  this._split(start);
  this._split(end);
  this._split(index);
  var first = this.byStart[start];
  var last = this.byEnd[end];
  var oldLeft = first.previous;
  var oldRight = last.next;
  var newRight = this.byStart[index];
  if (!newRight && last === this.lastChunk) {
    return this;
  }
  var newLeft = newRight ? newRight.previous : this.lastChunk;
  if (oldLeft) {
    oldLeft.next = oldRight;
  }
  if (oldRight) {
    oldRight.previous = oldLeft;
  }
  if (newLeft) {
    newLeft.next = first;
  }
  if (newRight) {
    newRight.previous = last;
  }
  if (!first.previous) {
    this.firstChunk = last.next;
  }
  if (!last.next) {
    this.lastChunk = first.previous;
    this.lastChunk.next = null;
  }
  first.previous = newLeft;
  last.next = newRight || null;
  if (!newLeft) {
    this.firstChunk = first;
  }
  if (!newRight) {
    this.lastChunk = last;
  }
  return this;
};
MagicString.prototype.overwrite = function overwrite(start, end, content, options) {
  if (typeof content !== "string") {
    throw new TypeError("replacement content must be a string");
  }
  while (start < 0) {
    start += this.original.length;
  }
  while (end < 0) {
    end += this.original.length;
  }
  if (end > this.original.length) {
    throw new Error("end is out of bounds");
  }
  if (start === end) {
    throw new Error(
      "Cannot overwrite a zero-length range \u2013 use appendLeft or prependRight instead"
    );
  }
  this._split(start);
  this._split(end);
  if (options === true) {
    if (!warned.storeName) {
      console.warn(
        "The final argument to magicString.overwrite(...) should be an options object. See https://github.com/rich-harris/magic-string"
      );
      warned.storeName = true;
    }
    options = { storeName: true };
  }
  var storeName = options !== void 0 ? options.storeName : false;
  var contentOnly = options !== void 0 ? options.contentOnly : false;
  if (storeName) {
    var original = this.original.slice(start, end);
    Object.defineProperty(this.storedNames, original, { writable: true, value: true, enumerable: true });
  }
  var first = this.byStart[start];
  var last = this.byEnd[end];
  if (first) {
    var chunk = first;
    while (chunk !== last) {
      if (chunk.next !== this.byStart[chunk.end]) {
        throw new Error("Cannot overwrite across a split point");
      }
      chunk = chunk.next;
      chunk.edit("", false);
    }
    first.edit(content, storeName, contentOnly);
  } else {
    var newChunk = new Chunk(start, end, "").edit(content, storeName);
    last.next = newChunk;
    newChunk.previous = last;
  }
  return this;
};
MagicString.prototype.prepend = function prepend(content) {
  if (typeof content !== "string") {
    throw new TypeError("outro content must be a string");
  }
  this.intro = content + this.intro;
  return this;
};
MagicString.prototype.prependLeft = function prependLeft2(index, content) {
  if (typeof content !== "string") {
    throw new TypeError("inserted content must be a string");
  }
  this._split(index);
  var chunk = this.byEnd[index];
  if (chunk) {
    chunk.prependLeft(content);
  } else {
    this.intro = content + this.intro;
  }
  return this;
};
MagicString.prototype.prependRight = function prependRight2(index, content) {
  if (typeof content !== "string") {
    throw new TypeError("inserted content must be a string");
  }
  this._split(index);
  var chunk = this.byStart[index];
  if (chunk) {
    chunk.prependRight(content);
  } else {
    this.outro = content + this.outro;
  }
  return this;
};
MagicString.prototype.remove = function remove(start, end) {
  while (start < 0) {
    start += this.original.length;
  }
  while (end < 0) {
    end += this.original.length;
  }
  if (start === end) {
    return this;
  }
  if (start < 0 || end > this.original.length) {
    throw new Error("Character is out of bounds");
  }
  if (start > end) {
    throw new Error("end must be greater than start");
  }
  this._split(start);
  this._split(end);
  var chunk = this.byStart[start];
  while (chunk) {
    chunk.intro = "";
    chunk.outro = "";
    chunk.edit("");
    chunk = end > chunk.end ? this.byStart[chunk.end] : null;
  }
  return this;
};
MagicString.prototype.lastChar = function lastChar() {
  if (this.outro.length) {
    return this.outro[this.outro.length - 1];
  }
  var chunk = this.lastChunk;
  do {
    if (chunk.outro.length) {
      return chunk.outro[chunk.outro.length - 1];
    }
    if (chunk.content.length) {
      return chunk.content[chunk.content.length - 1];
    }
    if (chunk.intro.length) {
      return chunk.intro[chunk.intro.length - 1];
    }
  } while (chunk = chunk.previous);
  if (this.intro.length) {
    return this.intro[this.intro.length - 1];
  }
  return "";
};
MagicString.prototype.lastLine = function lastLine() {
  var lineIndex = this.outro.lastIndexOf(n);
  if (lineIndex !== -1) {
    return this.outro.substr(lineIndex + 1);
  }
  var lineStr = this.outro;
  var chunk = this.lastChunk;
  do {
    if (chunk.outro.length > 0) {
      lineIndex = chunk.outro.lastIndexOf(n);
      if (lineIndex !== -1) {
        return chunk.outro.substr(lineIndex + 1) + lineStr;
      }
      lineStr = chunk.outro + lineStr;
    }
    if (chunk.content.length > 0) {
      lineIndex = chunk.content.lastIndexOf(n);
      if (lineIndex !== -1) {
        return chunk.content.substr(lineIndex + 1) + lineStr;
      }
      lineStr = chunk.content + lineStr;
    }
    if (chunk.intro.length > 0) {
      lineIndex = chunk.intro.lastIndexOf(n);
      if (lineIndex !== -1) {
        return chunk.intro.substr(lineIndex + 1) + lineStr;
      }
      lineStr = chunk.intro + lineStr;
    }
  } while (chunk = chunk.previous);
  lineIndex = this.intro.lastIndexOf(n);
  if (lineIndex !== -1) {
    return this.intro.substr(lineIndex + 1) + lineStr;
  }
  return this.intro + lineStr;
};
MagicString.prototype.slice = function slice(start, end) {
  if (start === void 0)
    start = 0;
  if (end === void 0)
    end = this.original.length;
  while (start < 0) {
    start += this.original.length;
  }
  while (end < 0) {
    end += this.original.length;
  }
  var result = "";
  var chunk = this.firstChunk;
  while (chunk && (chunk.start > start || chunk.end <= start)) {
    if (chunk.start < end && chunk.end >= end) {
      return result;
    }
    chunk = chunk.next;
  }
  if (chunk && chunk.edited && chunk.start !== start) {
    throw new Error("Cannot use replaced character " + start + " as slice start anchor.");
  }
  var startChunk = chunk;
  while (chunk) {
    if (chunk.intro && (startChunk !== chunk || chunk.start === start)) {
      result += chunk.intro;
    }
    var containsEnd = chunk.start < end && chunk.end >= end;
    if (containsEnd && chunk.edited && chunk.end !== end) {
      throw new Error("Cannot use replaced character " + end + " as slice end anchor.");
    }
    var sliceStart = startChunk === chunk ? start - chunk.start : 0;
    var sliceEnd = containsEnd ? chunk.content.length + end - chunk.end : chunk.content.length;
    result += chunk.content.slice(sliceStart, sliceEnd);
    if (chunk.outro && (!containsEnd || chunk.end === end)) {
      result += chunk.outro;
    }
    if (containsEnd) {
      break;
    }
    chunk = chunk.next;
  }
  return result;
};
MagicString.prototype.snip = function snip(start, end) {
  var clone4 = this.clone();
  clone4.remove(0, start);
  clone4.remove(end, clone4.original.length);
  return clone4;
};
MagicString.prototype._split = function _split(index) {
  if (this.byStart[index] || this.byEnd[index]) {
    return;
  }
  var chunk = this.lastSearchedChunk;
  var searchForward = index > chunk.end;
  while (chunk) {
    if (chunk.contains(index)) {
      return this._splitChunk(chunk, index);
    }
    chunk = searchForward ? this.byStart[chunk.end] : this.byEnd[chunk.start];
  }
};
MagicString.prototype._splitChunk = function _splitChunk(chunk, index) {
  if (chunk.edited && chunk.content.length) {
    var loc = getLocator(this.original)(index);
    throw new Error(
      "Cannot split a chunk that has already been edited (" + loc.line + ":" + loc.column + ' \u2013 "' + chunk.original + '")'
    );
  }
  var newChunk = chunk.split(index);
  this.byEnd[index] = chunk;
  this.byStart[index] = newChunk;
  this.byEnd[newChunk.end] = newChunk;
  if (chunk === this.lastChunk) {
    this.lastChunk = newChunk;
  }
  this.lastSearchedChunk = chunk;
  return true;
};
MagicString.prototype.toString = function toString4() {
  var str = this.intro;
  var chunk = this.firstChunk;
  while (chunk) {
    str += chunk.toString();
    chunk = chunk.next;
  }
  return str + this.outro;
};
MagicString.prototype.isEmpty = function isEmpty() {
  var chunk = this.firstChunk;
  do {
    if (chunk.intro.length && chunk.intro.trim() || chunk.content.length && chunk.content.trim() || chunk.outro.length && chunk.outro.trim()) {
      return false;
    }
  } while (chunk = chunk.next);
  return true;
};
MagicString.prototype.length = function length() {
  var chunk = this.firstChunk;
  var length3 = 0;
  do {
    length3 += chunk.intro.length + chunk.content.length + chunk.outro.length;
  } while (chunk = chunk.next);
  return length3;
};
MagicString.prototype.trimLines = function trimLines() {
  return this.trim("[\\r\\n]");
};
MagicString.prototype.trim = function trim(charType) {
  return this.trimStart(charType).trimEnd(charType);
};
MagicString.prototype.trimEndAborted = function trimEndAborted(charType) {
  var rx = new RegExp((charType || "\\s") + "+$");
  this.outro = this.outro.replace(rx, "");
  if (this.outro.length) {
    return true;
  }
  var chunk = this.lastChunk;
  do {
    var end = chunk.end;
    var aborted = chunk.trimEnd(rx);
    if (chunk.end !== end) {
      if (this.lastChunk === chunk) {
        this.lastChunk = chunk.next;
      }
      this.byEnd[chunk.end] = chunk;
      this.byStart[chunk.next.start] = chunk.next;
      this.byEnd[chunk.next.end] = chunk.next;
    }
    if (aborted) {
      return true;
    }
    chunk = chunk.previous;
  } while (chunk);
  return false;
};
MagicString.prototype.trimEnd = function trimEnd2(charType) {
  this.trimEndAborted(charType);
  return this;
};
MagicString.prototype.trimStartAborted = function trimStartAborted(charType) {
  var rx = new RegExp("^" + (charType || "\\s") + "+");
  this.intro = this.intro.replace(rx, "");
  if (this.intro.length) {
    return true;
  }
  var chunk = this.firstChunk;
  do {
    var end = chunk.end;
    var aborted = chunk.trimStart(rx);
    if (chunk.end !== end) {
      if (chunk === this.lastChunk) {
        this.lastChunk = chunk.next;
      }
      this.byEnd[chunk.end] = chunk;
      this.byStart[chunk.next.start] = chunk.next;
      this.byEnd[chunk.next.end] = chunk.next;
    }
    if (aborted) {
      return true;
    }
    chunk = chunk.next;
  } while (chunk);
  return false;
};
MagicString.prototype.trimStart = function trimStart2(charType) {
  this.trimStartAborted(charType);
  return this;
};
var hasOwnProp = Object.prototype.hasOwnProperty;
var Bundle = function Bundle2(options) {
  if (options === void 0)
    options = {};
  this.intro = options.intro || "";
  this.separator = options.separator !== void 0 ? options.separator : "\n";
  this.sources = [];
  this.uniqueSources = [];
  this.uniqueSourceIndexByFilename = {};
};
Bundle.prototype.addSource = function addSource(source) {
  if (source instanceof MagicString) {
    return this.addSource({
      content: source,
      filename: source.filename,
      separator: this.separator
    });
  }
  if (!isObject(source) || !source.content) {
    throw new Error(
      "bundle.addSource() takes an object with a `content` property, which should be an instance of MagicString, and an optional `filename`"
    );
  }
  ["filename", "indentExclusionRanges", "separator"].forEach(function(option) {
    if (!hasOwnProp.call(source, option)) {
      source[option] = source.content[option];
    }
  });
  if (source.separator === void 0) {
    source.separator = this.separator;
  }
  if (source.filename) {
    if (!hasOwnProp.call(this.uniqueSourceIndexByFilename, source.filename)) {
      this.uniqueSourceIndexByFilename[source.filename] = this.uniqueSources.length;
      this.uniqueSources.push({ filename: source.filename, content: source.content.original });
    } else {
      var uniqueSource = this.uniqueSources[this.uniqueSourceIndexByFilename[source.filename]];
      if (source.content.original !== uniqueSource.content) {
        throw new Error("Illegal source: same filename (" + source.filename + "), different contents");
      }
    }
  }
  this.sources.push(source);
  return this;
};
Bundle.prototype.append = function append2(str, options) {
  this.addSource({
    content: new MagicString(str),
    separator: options && options.separator || ""
  });
  return this;
};
Bundle.prototype.clone = function clone3() {
  var bundle = new Bundle({
    intro: this.intro,
    separator: this.separator
  });
  this.sources.forEach(function(source) {
    bundle.addSource({
      filename: source.filename,
      content: source.content.clone(),
      separator: source.separator
    });
  });
  return bundle;
};
Bundle.prototype.generateDecodedMap = function generateDecodedMap2(options) {
  var this$1$1 = this;
  if (options === void 0)
    options = {};
  var names = [];
  this.sources.forEach(function(source) {
    Object.keys(source.content.storedNames).forEach(function(name) {
      if (!~names.indexOf(name)) {
        names.push(name);
      }
    });
  });
  var mappings = new Mappings(options.hires);
  if (this.intro) {
    mappings.advance(this.intro);
  }
  this.sources.forEach(function(source, i) {
    if (i > 0) {
      mappings.advance(this$1$1.separator);
    }
    var sourceIndex = source.filename ? this$1$1.uniqueSourceIndexByFilename[source.filename] : -1;
    var magicString = source.content;
    var locate2 = getLocator(magicString.original);
    if (magicString.intro) {
      mappings.advance(magicString.intro);
    }
    magicString.firstChunk.eachNext(function(chunk) {
      var loc = locate2(chunk.start);
      if (chunk.intro.length) {
        mappings.advance(chunk.intro);
      }
      if (source.filename) {
        if (chunk.edited) {
          mappings.addEdit(
            sourceIndex,
            chunk.content,
            loc,
            chunk.storeName ? names.indexOf(chunk.original) : -1
          );
        } else {
          mappings.addUneditedChunk(
            sourceIndex,
            chunk,
            magicString.original,
            loc,
            magicString.sourcemapLocations
          );
        }
      } else {
        mappings.advance(chunk.content);
      }
      if (chunk.outro.length) {
        mappings.advance(chunk.outro);
      }
    });
    if (magicString.outro) {
      mappings.advance(magicString.outro);
    }
  });
  return {
    file: options.file ? options.file.split(/[/\\]/).pop() : null,
    sources: this.uniqueSources.map(function(source) {
      return options.file ? getRelativePath(options.file, source.filename) : source.filename;
    }),
    sourcesContent: this.uniqueSources.map(function(source) {
      return options.includeContent ? source.content : null;
    }),
    names,
    mappings: mappings.raw
  };
};
Bundle.prototype.generateMap = function generateMap2(options) {
  return new SourceMap(this.generateDecodedMap(options));
};
Bundle.prototype.getIndentString = function getIndentString2() {
  var indentStringCounts = {};
  this.sources.forEach(function(source) {
    var indentStr = source.content.indentStr;
    if (indentStr === null) {
      return;
    }
    if (!indentStringCounts[indentStr]) {
      indentStringCounts[indentStr] = 0;
    }
    indentStringCounts[indentStr] += 1;
  });
  return Object.keys(indentStringCounts).sort(function(a, b) {
    return indentStringCounts[a] - indentStringCounts[b];
  })[0] || "	";
};
Bundle.prototype.indent = function indent2(indentStr) {
  var this$1$1 = this;
  if (!arguments.length) {
    indentStr = this.getIndentString();
  }
  if (indentStr === "") {
    return this;
  }
  var trailingNewline = !this.intro || this.intro.slice(-1) === "\n";
  this.sources.forEach(function(source, i) {
    var separator = source.separator !== void 0 ? source.separator : this$1$1.separator;
    var indentStart = trailingNewline || i > 0 && /\r?\n$/.test(separator);
    source.content.indent(indentStr, {
      exclude: source.indentExclusionRanges,
      indentStart
      //: trailingNewline || /\r?\n$/.test( separator )  //true///\r?\n/.test( separator )
    });
    trailingNewline = source.content.lastChar() === "\n";
  });
  if (this.intro) {
    this.intro = indentStr + this.intro.replace(/^[^\n]/gm, function(match, index) {
      return index > 0 ? indentStr + match : match;
    });
  }
  return this;
};
Bundle.prototype.prepend = function prepend2(str) {
  this.intro = str + this.intro;
  return this;
};
Bundle.prototype.toString = function toString5() {
  var this$1$1 = this;
  var body = this.sources.map(function(source, i) {
    var separator = source.separator !== void 0 ? source.separator : this$1$1.separator;
    var str = (i > 0 ? separator : "") + source.content.toString();
    return str;
  }).join("");
  return this.intro + body;
};
Bundle.prototype.isEmpty = function isEmpty2() {
  if (this.intro.length && this.intro.trim()) {
    return false;
  }
  if (this.sources.some(function(source) {
    return !source.content.isEmpty();
  })) {
    return false;
  }
  return true;
};
Bundle.prototype.length = function length2() {
  return this.sources.reduce(
    function(length3, source) {
      return length3 + source.content.length();
    },
    this.intro.length
  );
};
Bundle.prototype.trimLines = function trimLines2() {
  return this.trim("[\\r\\n]");
};
Bundle.prototype.trim = function trim2(charType) {
  return this.trimStart(charType).trimEnd(charType);
};
Bundle.prototype.trimStart = function trimStart3(charType) {
  var rx = new RegExp("^" + (charType || "\\s") + "+");
  this.intro = this.intro.replace(rx, "");
  if (!this.intro) {
    var source;
    var i = 0;
    do {
      source = this.sources[i++];
      if (!source) {
        break;
      }
    } while (!source.content.trimStartAborted(charType));
  }
  return this;
};
Bundle.prototype.trimEnd = function trimEnd3(charType) {
  var rx = new RegExp((charType || "\\s") + "+$");
  var source;
  var i = this.sources.length - 1;
  do {
    source = this.sources[i--];
    if (!source) {
      this.intro = this.intro.replace(rx, "");
      break;
    }
  } while (!source.content.trimEndAborted(charType));
  return this;
};

// node_modules/buble/dist/buble-browser.es.js
var import_regexpu_core = __toESM(require_rewrite_pattern());
function toJSON(node) {
  var obj = {};
  Object.keys(node).forEach(function(key) {
    if (key === "parent" || key === "program" || key === "keys" || key === "__wrapped") {
      return;
    }
    if (Array.isArray(node[key])) {
      obj[key] = node[key].map(toJSON);
    } else if (node[key] && node[key].toJSON) {
      obj[key] = node[key].toJSON();
    } else {
      obj[key] = node[key];
    }
  });
  return obj;
}
var Node = function Node2() {
};
Node.prototype.ancestor = function ancestor(level) {
  var node = this;
  while (level--) {
    node = node.parent;
    if (!node) {
      return null;
    }
  }
  return node;
};
Node.prototype.contains = function contains2(node) {
  while (node) {
    if (node === this) {
      return true;
    }
    node = node.parent;
  }
  return false;
};
Node.prototype.findLexicalBoundary = function findLexicalBoundary() {
  return this.parent.findLexicalBoundary();
};
Node.prototype.findNearest = function findNearest(type) {
  if (typeof type === "string") {
    type = new RegExp("^" + type + "$");
  }
  if (type.test(this.type)) {
    return this;
  }
  return this.parent.findNearest(type);
};
Node.prototype.unparenthesizedParent = function unparenthesizedParent() {
  var node = this.parent;
  while (node && node.type === "ParenthesizedExpression") {
    node = node.parent;
  }
  return node;
};
Node.prototype.unparenthesize = function unparenthesize() {
  var node = this;
  while (node.type === "ParenthesizedExpression") {
    node = node.expression;
  }
  return node;
};
Node.prototype.findScope = function findScope(functionScope) {
  return this.parent.findScope(functionScope);
};
Node.prototype.getIndentation = function getIndentation() {
  return this.parent.getIndentation();
};
Node.prototype.initialise = function initialise(transforms) {
  for (var i = 0, list = this.keys; i < list.length; i += 1) {
    var key = list[i];
    var value = this[key];
    if (Array.isArray(value)) {
      value.forEach(function(node) {
        return node && node.initialise(transforms);
      });
    } else if (value && typeof value === "object") {
      value.initialise(transforms);
    }
  }
};
Node.prototype.toJSON = function toJSON$1() {
  return toJSON(this);
};
Node.prototype.toString = function toString6() {
  return this.program.magicString.original.slice(this.start, this.end);
};
Node.prototype.transpile = function transpile(code, transforms) {
  for (var i = 0, list = this.keys; i < list.length; i += 1) {
    var key = list[i];
    var value = this[key];
    if (Array.isArray(value)) {
      value.forEach(function(node) {
        return node && node.transpile(code, transforms);
      });
    } else if (value && typeof value === "object") {
      value.transpile(code, transforms);
    }
  }
};
function extractNames(node) {
  var names = [];
  extractors[node.type](names, node);
  return names;
}
var extractors = {
  Identifier: function Identifier(names, node) {
    names.push(node);
  },
  ObjectPattern: function ObjectPattern(names, node) {
    for (var i = 0, list = node.properties; i < list.length; i += 1) {
      var prop = list[i];
      extractors[prop.type](names, prop);
    }
  },
  Property: function Property(names, node) {
    extractors[node.value.type](names, node.value);
  },
  ArrayPattern: function ArrayPattern(names, node) {
    for (var i = 0, list = node.elements; i < list.length; i += 1) {
      var element = list[i];
      if (element) {
        extractors[element.type](names, element);
      }
    }
  },
  RestElement: function RestElement(names, node) {
    extractors[node.argument.type](names, node.argument);
  },
  AssignmentPattern: function AssignmentPattern(names, node) {
    extractors[node.left.type](names, node.left);
  }
};
var reserved = /* @__PURE__ */ Object.create(null);
"do if in for let new try var case else enum eval null this true void with await break catch class const false super throw while yield delete export import public return static switch typeof default extends finally package private continue debugger function arguments interface protected implements instanceof".split(" ").forEach(function(word) {
  return reserved[word] = true;
});
function Scope(options) {
  options = options || {};
  this.parent = options.parent;
  this.isBlockScope = !!options.block;
  this.createDeclarationCallback = options.declare;
  var scope = this;
  while (scope.isBlockScope) {
    scope = scope.parent;
  }
  this.functionScope = scope;
  this.identifiers = [];
  this.declarations = /* @__PURE__ */ Object.create(null);
  this.references = /* @__PURE__ */ Object.create(null);
  this.blockScopedDeclarations = this.isBlockScope ? null : /* @__PURE__ */ Object.create(null);
  this.aliases = /* @__PURE__ */ Object.create(null);
}
Scope.prototype = {
  addDeclaration: function addDeclaration(node, kind) {
    for (var i = 0, list = extractNames(node); i < list.length; i += 1) {
      var identifier = list[i];
      var name = identifier.name;
      var declaration = { name, node: identifier, kind, instances: [] };
      this.declarations[name] = declaration;
      if (this.isBlockScope) {
        if (!this.functionScope.blockScopedDeclarations[name]) {
          this.functionScope.blockScopedDeclarations[name] = [];
        }
        this.functionScope.blockScopedDeclarations[name].push(declaration);
      }
    }
  },
  addReference: function addReference(identifier) {
    if (this.consolidated) {
      this.consolidateReference(identifier);
    } else {
      this.identifiers.push(identifier);
    }
  },
  consolidate: function consolidate() {
    for (var i = 0; i < this.identifiers.length; i += 1) {
      var identifier = this.identifiers[i];
      this.consolidateReference(identifier);
    }
    this.consolidated = true;
  },
  consolidateReference: function consolidateReference(identifier) {
    var declaration = this.declarations[identifier.name];
    if (declaration) {
      declaration.instances.push(identifier);
    } else {
      this.references[identifier.name] = true;
      if (this.parent) {
        this.parent.addReference(identifier);
      }
    }
  },
  contains: function contains3(name) {
    return this.declarations[name] || (this.parent ? this.parent.contains(name) : false);
  },
  createIdentifier: function createIdentifier(base) {
    if (typeof base === "number") {
      base = base.toString();
    }
    base = base.replace(/\s/g, "").replace(/\[([^\]]+)\]/g, "_$1").replace(/[^a-zA-Z0-9_$]/g, "_").replace(/_{2,}/, "_");
    var name = base;
    var counter = 1;
    while (this.declarations[name] || this.references[name] || this.aliases[name] || name in reserved) {
      name = base + "$" + counter++;
    }
    this.aliases[name] = true;
    return name;
  },
  createDeclaration: function createDeclaration(base) {
    var id = this.createIdentifier(base);
    this.createDeclarationCallback(id);
    return id;
  },
  findDeclaration: function findDeclaration(name) {
    return this.declarations[name] || this.parent && this.parent.findDeclaration(name);
  },
  // Sometimes, block scope declarations change name during transpilation
  resolveName: function resolveName(name) {
    var declaration = this.findDeclaration(name);
    return declaration ? declaration.name : name;
  }
};
function locate(source, index) {
  var lines = source.split("\n");
  var len = lines.length;
  var lineStart = 0;
  var i;
  for (i = 0; i < len; i += 1) {
    var line = lines[i];
    var lineEnd = lineStart + line.length + 1;
    if (lineEnd > index) {
      return { line: i + 1, column: index - lineStart, char: i };
    }
    lineStart = lineEnd;
  }
  throw new Error("Could not determine location of character");
}
function pad(num, len) {
  var result = String(num);
  return result + repeat(" ", len - result.length);
}
function repeat(str, times) {
  var result = "";
  while (times--) {
    result += str;
  }
  return result;
}
function getSnippet(source, loc, length3) {
  if (length3 === void 0)
    length3 = 1;
  var first = Math.max(loc.line - 5, 0);
  var last = loc.line;
  var numDigits = String(last).length;
  var lines = source.split("\n").slice(first, last);
  var lastLine2 = lines[lines.length - 1];
  var offset2 = lastLine2.slice(0, loc.column).replace(/\t/g, "  ").length;
  var snippet = lines.map(function(line, i) {
    return pad(i + first + 1, numDigits) + " : " + line.replace(/\t/g, "  ");
  }).join("\n");
  snippet += "\n" + repeat(" ", numDigits + 3 + offset2) + repeat("^", length3);
  return snippet;
}
var CompileError = /* @__PURE__ */ function(Error2) {
  function CompileError2(message, node) {
    Error2.call(this, message);
    this.name = "CompileError";
    if (!node) {
      return;
    }
    var source = node.program.magicString.original;
    var loc = locate(source, node.start);
    this.message = message + " (" + loc.line + ":" + loc.column + ")";
    this.stack = new Error2().stack.replace(
      new RegExp(".+new " + this.name + ".+\\n", "m"),
      ""
    );
    this.loc = loc;
    this.snippet = getSnippet(source, loc, node.end - node.start);
  }
  if (Error2)
    CompileError2.__proto__ = Error2;
  CompileError2.prototype = Object.create(Error2 && Error2.prototype);
  CompileError2.prototype.constructor = CompileError2;
  CompileError2.prototype.toString = function toString8() {
    return this.name + ": " + this.message + "\n" + this.snippet;
  };
  CompileError2.missingTransform = function missingTransform(feature, transformKey, node, dangerousKey) {
    if (dangerousKey === void 0)
      dangerousKey = null;
    var maybeDangerous = dangerousKey ? ", or `transforms: { " + dangerousKey + ": true }` if you know what you're doing" : "";
    throw new CompileError2("Transforming " + feature + " is not " + (dangerousKey ? "fully supported" : "implemented") + ". Use `transforms: { " + transformKey + ": false }` to skip transformation and disable this error" + maybeDangerous + ".", node);
  };
  return CompileError2;
}(Error);
function findIndex(array, fn) {
  for (var i = 0; i < array.length; i += 1) {
    if (fn(array[i], i)) {
      return i;
    }
  }
  return -1;
}
var handlers = {
  Identifier: destructureIdentifier,
  AssignmentPattern: destructureAssignmentPattern,
  ArrayPattern: destructureArrayPattern,
  ObjectPattern: destructureObjectPattern
};
function destructure(code, createIdentifier2, resolveName2, node, ref2, inline, statementGenerators) {
  handlers[node.type](code, createIdentifier2, resolveName2, node, ref2, inline, statementGenerators);
}
function destructureIdentifier(code, createIdentifier2, resolveName2, node, ref2, inline, statementGenerators) {
  statementGenerators.push(function(start, prefix, suffix) {
    code.overwrite(node.start, node.end, (inline ? prefix : prefix + "var ") + resolveName2(node) + " = " + ref2 + suffix);
    code.move(node.start, node.end, start);
  });
}
function destructureMemberExpression(code, createIdentifier2, resolveName2, node, ref2, inline, statementGenerators) {
  statementGenerators.push(function(start, prefix, suffix) {
    code.prependRight(node.start, inline ? prefix : prefix + "var ");
    code.appendLeft(node.end, " = " + ref2 + suffix);
    code.move(node.start, node.end, start);
  });
}
function destructureAssignmentPattern(code, createIdentifier2, resolveName2, node, ref2, inline, statementGenerators) {
  var isIdentifier = node.left.type === "Identifier";
  var name = isIdentifier ? node.left.name : ref2;
  if (!inline) {
    statementGenerators.push(function(start, prefix, suffix) {
      code.prependRight(
        node.left.end,
        prefix + "if ( " + name + " === void 0 ) " + name
      );
      code.move(node.left.end, node.right.end, start);
      code.appendLeft(node.right.end, suffix);
    });
  }
  if (!isIdentifier) {
    destructure(code, createIdentifier2, resolveName2, node.left, ref2, inline, statementGenerators);
  }
}
function destructureArrayPattern(code, createIdentifier2, resolveName2, node, ref2, inline, statementGenerators) {
  var c = node.start;
  node.elements.forEach(function(element, i) {
    if (!element) {
      return;
    }
    if (element.type === "RestElement") {
      handleProperty(
        code,
        createIdentifier2,
        resolveName2,
        c,
        element.argument,
        ref2 + ".slice(" + i + ")",
        inline,
        statementGenerators
      );
    } else {
      handleProperty(
        code,
        createIdentifier2,
        resolveName2,
        c,
        element,
        ref2 + "[" + i + "]",
        inline,
        statementGenerators
      );
    }
    c = element.end;
  });
  code.remove(c, node.end);
}
function destructureObjectPattern(code, createIdentifier2, resolveName2, node, ref2, inline, statementGenerators) {
  var this$1 = this;
  var c = node.start;
  var nonRestKeys = [];
  node.properties.forEach(function(prop) {
    var value;
    var content;
    if (prop.type === "Property") {
      content = prop.value;
      if (!prop.computed && prop.key.type === "Identifier") {
        value = ref2 + "." + prop.key.name;
        nonRestKeys.push('"' + prop.key.name + '"');
      } else if (!prop.computed && prop.key.type === "Literal") {
        value = ref2 + "[" + prop.key.raw + "]";
        nonRestKeys.push(JSON.stringify(String(prop.key.value)));
      } else {
        var expr = code.slice(prop.key.start, prop.key.end);
        value = ref2 + "[" + expr + "]";
        nonRestKeys.push("String(" + expr + ")");
      }
    } else if (prop.type === "RestElement") {
      content = prop.argument;
      value = createIdentifier2("rest");
      statementGenerators.push(function(start, prefix, suffix) {
        var helper = prop.program.getObjectWithoutPropertiesHelper(code);
        code.overwrite(
          prop.start,
          c = prop.argument.start,
          (inline ? prefix : prefix + "var ") + value + " = " + helper + "( " + ref2 + ", [" + nonRestKeys.join(", ") + "] )" + suffix
        );
        code.move(prop.start, c, start);
      });
    } else {
      throw new CompileError(
        this$1,
        "Unexpected node of type " + prop.type + " in object pattern"
      );
    }
    handleProperty(code, createIdentifier2, resolveName2, c, content, value, inline, statementGenerators);
    c = prop.end;
  });
  code.remove(c, node.end);
}
function handleProperty(code, createIdentifier2, resolveName2, c, node, value, inline, statementGenerators) {
  switch (node.type) {
    case "Identifier": {
      code.remove(c, node.start);
      destructureIdentifier(
        code,
        createIdentifier2,
        resolveName2,
        node,
        value,
        inline,
        statementGenerators
      );
      break;
    }
    case "MemberExpression":
      code.remove(c, node.start);
      destructureMemberExpression(
        code,
        createIdentifier2,
        resolveName2,
        node,
        value,
        true,
        statementGenerators
      );
      break;
    case "AssignmentPattern": {
      var name;
      var isIdentifier = node.left.type === "Identifier";
      if (isIdentifier) {
        name = resolveName2(node.left);
      } else {
        name = createIdentifier2(value);
      }
      statementGenerators.push(function(start, prefix, suffix) {
        if (inline) {
          code.prependRight(
            node.right.start,
            name + " = " + value + ", " + name + " = " + name + " === void 0 ? "
          );
          code.appendLeft(node.right.end, " : " + name + suffix);
        } else {
          code.prependRight(
            node.right.start,
            prefix + "var " + name + " = " + value + "; if ( " + name + " === void 0 ) " + name + " = "
          );
          code.appendLeft(node.right.end, suffix);
        }
        code.move(node.right.start, node.right.end, start);
      });
      if (isIdentifier) {
        code.remove(c, node.right.start);
      } else {
        code.remove(c, node.left.start);
        code.remove(node.left.end, node.right.start);
        handleProperty(
          code,
          createIdentifier2,
          resolveName2,
          c,
          node.left,
          name,
          inline,
          statementGenerators
        );
      }
      break;
    }
    case "ObjectPattern": {
      code.remove(c, c = node.start);
      var ref2 = value;
      if (node.properties.length > 1) {
        ref2 = createIdentifier2(value);
        statementGenerators.push(function(start, prefix, suffix) {
          code.prependRight(node.start, (inline ? "" : prefix + "var ") + ref2 + " = ");
          code.overwrite(node.start, c = node.start + 1, value);
          code.appendLeft(c, suffix);
          code.overwrite(
            node.start,
            c = node.start + 1,
            (inline ? "" : prefix + "var ") + ref2 + " = " + value + suffix
          );
          code.move(node.start, c, start);
        });
      }
      destructureObjectPattern(
        code,
        createIdentifier2,
        resolveName2,
        node,
        ref2,
        inline,
        statementGenerators
      );
      break;
    }
    case "ArrayPattern": {
      code.remove(c, c = node.start);
      if (node.elements.filter(Boolean).length > 1) {
        var ref$1 = createIdentifier2(value);
        statementGenerators.push(function(start, prefix, suffix) {
          code.prependRight(node.start, (inline ? "" : prefix + "var ") + ref$1 + " = ");
          code.overwrite(node.start, c = node.start + 1, value, {
            contentOnly: true
          });
          code.appendLeft(c, suffix);
          code.move(node.start, c, start);
        });
        node.elements.forEach(function(element2, i) {
          if (!element2) {
            return;
          }
          if (element2.type === "RestElement") {
            handleProperty(
              code,
              createIdentifier2,
              resolveName2,
              c,
              element2.argument,
              ref$1 + ".slice(" + i + ")",
              inline,
              statementGenerators
            );
          } else {
            handleProperty(
              code,
              createIdentifier2,
              resolveName2,
              c,
              element2,
              ref$1 + "[" + i + "]",
              inline,
              statementGenerators
            );
          }
          c = element2.end;
        });
      } else {
        var index = findIndex(node.elements, Boolean);
        var element = node.elements[index];
        if (element.type === "RestElement") {
          handleProperty(
            code,
            createIdentifier2,
            resolveName2,
            c,
            element.argument,
            value + ".slice(" + index + ")",
            inline,
            statementGenerators
          );
        } else {
          handleProperty(
            code,
            createIdentifier2,
            resolveName2,
            c,
            element,
            value + "[" + index + "]",
            inline,
            statementGenerators
          );
        }
        c = element.end;
      }
      code.remove(c, node.end);
      break;
    }
    default: {
      throw new Error("Unexpected node type in destructuring (" + node.type + ")");
    }
  }
}
function isUseStrict(node) {
  if (!node) {
    return false;
  }
  if (node.type !== "ExpressionStatement") {
    return false;
  }
  if (node.expression.type !== "Literal") {
    return false;
  }
  return node.expression.value === "use strict";
}
var BlockStatement = /* @__PURE__ */ function(Node5) {
  function BlockStatement2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    BlockStatement2.__proto__ = Node5;
  BlockStatement2.prototype = Object.create(Node5 && Node5.prototype);
  BlockStatement2.prototype.constructor = BlockStatement2;
  BlockStatement2.prototype.createScope = function createScope2() {
    var this$1 = this;
    this.parentIsFunction = /Function/.test(this.parent.type);
    this.isFunctionBlock = this.parentIsFunction || this.parent.type === "Root";
    this.scope = new Scope({
      block: !this.isFunctionBlock,
      parent: this.parent.findScope(false),
      declare: function(id) {
        return this$1.createdDeclarations.push(id);
      }
    });
    if (this.parentIsFunction) {
      this.parent.params.forEach(function(node) {
        this$1.scope.addDeclaration(node, "param");
      });
    }
  };
  BlockStatement2.prototype.initialise = function initialise2(transforms) {
    this.thisAlias = null;
    this.argumentsAlias = null;
    this.defaultParameters = [];
    this.createdDeclarations = [];
    if (!this.scope) {
      this.createScope();
    }
    this.body.forEach(function(node) {
      return node.initialise(transforms);
    });
    this.scope.consolidate();
  };
  BlockStatement2.prototype.findLexicalBoundary = function findLexicalBoundary2() {
    if (this.type === "Program") {
      return this;
    }
    if (/^Function/.test(this.parent.type)) {
      return this;
    }
    return this.parent.findLexicalBoundary();
  };
  BlockStatement2.prototype.findScope = function findScope3(functionScope) {
    if (functionScope && !this.isFunctionBlock) {
      return this.parent.findScope(functionScope);
    }
    return this.scope;
  };
  BlockStatement2.prototype.getArgumentsAlias = function getArgumentsAlias() {
    if (!this.argumentsAlias) {
      this.argumentsAlias = this.scope.createIdentifier("arguments");
    }
    return this.argumentsAlias;
  };
  BlockStatement2.prototype.getArgumentsArrayAlias = function getArgumentsArrayAlias() {
    if (!this.argumentsArrayAlias) {
      this.argumentsArrayAlias = this.scope.createIdentifier("argsArray");
    }
    return this.argumentsArrayAlias;
  };
  BlockStatement2.prototype.getThisAlias = function getThisAlias() {
    if (!this.thisAlias) {
      this.thisAlias = this.scope.createIdentifier("this");
    }
    return this.thisAlias;
  };
  BlockStatement2.prototype.getIndentation = function getIndentation2() {
    if (this.indentation === void 0) {
      var source = this.program.magicString.original;
      var useOuter = this.synthetic || !this.body.length;
      var c = useOuter ? this.start : this.body[0].start;
      while (c && source[c] !== "\n") {
        c -= 1;
      }
      this.indentation = "";
      while (true) {
        c += 1;
        var char = source[c];
        if (char !== " " && char !== "	") {
          break;
        }
        this.indentation += char;
      }
      var indentString = this.program.magicString.getIndentString();
      var parent = this.parent;
      while (parent) {
        if (parent.kind === "constructor" && !parent.parent.parent.superClass) {
          this.indentation = this.indentation.replace(indentString, "");
        }
        parent = parent.parent;
      }
      if (useOuter) {
        this.indentation += indentString;
      }
    }
    return this.indentation;
  };
  BlockStatement2.prototype.transpile = function transpile2(code, transforms) {
    var this$1 = this;
    var indentation = this.getIndentation();
    var introStatementGenerators = [];
    if (this.argumentsAlias) {
      introStatementGenerators.push(function(start2, prefix2, suffix2) {
        var assignment = prefix2 + "var " + this$1.argumentsAlias + " = arguments" + suffix2;
        code.appendLeft(start2, assignment);
      });
    }
    if (this.thisAlias) {
      introStatementGenerators.push(function(start2, prefix2, suffix2) {
        var assignment = prefix2 + "var " + this$1.thisAlias + " = this" + suffix2;
        code.appendLeft(start2, assignment);
      });
    }
    if (this.argumentsArrayAlias) {
      introStatementGenerators.push(function(start2, prefix2, suffix2) {
        var i = this$1.scope.createIdentifier("i");
        var assignment = prefix2 + "var " + i + " = arguments.length, " + this$1.argumentsArrayAlias + " = Array(" + i + ");\n" + indentation + "while ( " + i + "-- ) " + this$1.argumentsArrayAlias + "[" + i + "] = arguments[" + i + "]" + suffix2;
        code.appendLeft(start2, assignment);
      });
    }
    if (/Function/.test(this.parent.type)) {
      this.transpileParameters(
        this.parent.params,
        code,
        transforms,
        indentation,
        introStatementGenerators
      );
    } else if ("CatchClause" === this.parent.type) {
      this.transpileParameters(
        [this.parent.param],
        code,
        transforms,
        indentation,
        introStatementGenerators
      );
    }
    if (transforms.letConst && this.isFunctionBlock) {
      this.transpileBlockScopedIdentifiers(code);
    }
    Node5.prototype.transpile.call(this, code, transforms);
    if (this.createdDeclarations.length) {
      introStatementGenerators.push(function(start2, prefix2, suffix2) {
        var assignment = prefix2 + "var " + this$1.createdDeclarations.join(", ") + suffix2;
        code.appendLeft(start2, assignment);
      });
    }
    if (this.synthetic) {
      if (this.parent.type === "ArrowFunctionExpression") {
        var expr = this.body[0];
        if (introStatementGenerators.length) {
          code.appendLeft(this.start, "{").prependRight(this.end, this.parent.getIndentation() + "}");
          code.prependRight(expr.start, "\n" + indentation + "return ");
          code.appendLeft(expr.end, ";\n");
        } else if (transforms.arrow) {
          code.prependRight(expr.start, "{ return ");
          code.appendLeft(expr.end, "; }");
        }
      } else if (introStatementGenerators.length) {
        code.prependRight(this.start, "{").appendLeft(this.end, "}");
      }
    }
    var start;
    if (isUseStrict(this.body[0])) {
      start = this.body[0].end;
    } else if (this.synthetic || this.parent.type === "Root") {
      start = this.start;
    } else {
      start = this.start + 1;
    }
    var prefix = "\n" + indentation;
    var suffix = ";";
    introStatementGenerators.forEach(function(fn, i) {
      if (i === introStatementGenerators.length - 1) {
        suffix = ";\n";
      }
      fn(start, prefix, suffix);
    });
  };
  BlockStatement2.prototype.transpileParameters = function transpileParameters(params, code, transforms, indentation, introStatementGenerators) {
    var this$1 = this;
    params.forEach(function(param) {
      if (param.type === "AssignmentPattern" && param.left.type === "Identifier") {
        if (transforms.defaultParameter) {
          introStatementGenerators.push(function(start, prefix, suffix) {
            var lhs = prefix + "if ( " + param.left.name + " === void 0 ) " + param.left.name;
            code.prependRight(param.left.end, lhs).move(param.left.end, param.right.end, start).appendLeft(param.right.end, suffix);
          });
        }
      } else if (param.type === "RestElement") {
        if (transforms.spreadRest) {
          introStatementGenerators.push(function(start, prefix, suffix) {
            var penultimateParam = params[params.length - 2];
            if (penultimateParam) {
              code.remove(
                penultimateParam ? penultimateParam.end : param.start,
                param.end
              );
            } else {
              var start$1 = param.start, end = param.end;
              while (/\s/.test(code.original[start$1 - 1])) {
                start$1 -= 1;
              }
              while (/\s/.test(code.original[end])) {
                end += 1;
              }
              code.remove(start$1, end);
            }
            var name = param.argument.name;
            var len = this$1.scope.createIdentifier("len");
            var count = params.length - 1;
            if (count) {
              code.prependRight(
                start,
                prefix + "var " + name + " = [], " + len + " = arguments.length - " + count + ";\n" + indentation + "while ( " + len + "-- > 0 ) " + name + "[ " + len + " ] = arguments[ " + len + " + " + count + " ]" + suffix
              );
            } else {
              code.prependRight(
                start,
                prefix + "var " + name + " = [], " + len + " = arguments.length;\n" + indentation + "while ( " + len + "-- ) " + name + "[ " + len + " ] = arguments[ " + len + " ]" + suffix
              );
            }
          });
        }
      } else if (param.type !== "Identifier") {
        if (transforms.parameterDestructuring) {
          var ref2 = this$1.scope.createIdentifier("ref");
          destructure(
            code,
            function(id) {
              return this$1.scope.createIdentifier(id);
            },
            function(ref3) {
              var name = ref3.name;
              return this$1.scope.resolveName(name);
            },
            param,
            ref2,
            false,
            introStatementGenerators
          );
          code.prependRight(param.start, ref2);
        }
      }
    });
  };
  BlockStatement2.prototype.transpileBlockScopedIdentifiers = function transpileBlockScopedIdentifiers(code) {
    var this$1 = this;
    Object.keys(this.scope.blockScopedDeclarations).forEach(function(name) {
      var declarations = this$1.scope.blockScopedDeclarations[name];
      for (var i$2 = 0, list$2 = declarations; i$2 < list$2.length; i$2 += 1) {
        var declaration = list$2[i$2];
        var cont = false;
        if (declaration.kind === "for.let") {
          var forStatement = declaration.node.findNearest("ForStatement");
          if (forStatement.shouldRewriteAsFunction) {
            var outerAlias = this$1.scope.createIdentifier(name);
            var innerAlias = forStatement.reassigned[name] ? this$1.scope.createIdentifier(name) : name;
            declaration.name = outerAlias;
            code.overwrite(
              declaration.node.start,
              declaration.node.end,
              outerAlias,
              { storeName: true }
            );
            forStatement.aliases[name] = {
              outer: outerAlias,
              inner: innerAlias
            };
            for (var i = 0, list = declaration.instances; i < list.length; i += 1) {
              var identifier = list[i];
              var alias = forStatement.body.contains(identifier) ? innerAlias : outerAlias;
              if (name !== alias) {
                code.overwrite(identifier.start, identifier.end, alias, {
                  storeName: true
                });
              }
            }
            cont = true;
          }
        }
        if (!cont) {
          var alias$1 = this$1.scope.createIdentifier(name);
          if (name !== alias$1) {
            var declarationParent = declaration.node.parent;
            declaration.name = alias$1;
            code.overwrite(
              declaration.node.start,
              declaration.node.end,
              alias$1,
              { storeName: true }
            );
            if (declarationParent.type === "Property" && declarationParent.shorthand) {
              declarationParent.shorthand = false;
              code.prependLeft(declaration.node.start, name + ": ");
            }
            for (var i$1 = 0, list$1 = declaration.instances; i$1 < list$1.length; i$1 += 1) {
              var identifier$1 = list$1[i$1];
              identifier$1.rewritten = true;
              var identifierParent = identifier$1.parent;
              code.overwrite(identifier$1.start, identifier$1.end, alias$1, {
                storeName: true
              });
              if (identifierParent.type === "Property" && identifierParent.shorthand) {
                identifierParent.shorthand = false;
                code.prependLeft(identifier$1.start, name + ": ");
              }
            }
          }
        }
      }
    });
  };
  return BlockStatement2;
}(Node);
function isArguments(node) {
  return node.type === "Identifier" && node.name === "arguments";
}
function inlineSpreads(code, node, elements) {
  var i = elements.length;
  while (i--) {
    var element = elements[i];
    if (!element || element.type !== "SpreadElement") {
      continue;
    }
    var argument = element.argument;
    if (argument.type !== "ArrayExpression") {
      continue;
    }
    var subelements = argument.elements;
    if (subelements.some(function(subelement) {
      return subelement === null;
    })) {
      continue;
    }
    var isLast = i === elements.length - 1;
    if (subelements.length === 0) {
      code.remove(
        isLast && i !== 0 ? elements[i - 1].end : element.start,
        isLast ? node.end - 1 : elements[i + 1].start
      );
    } else {
      code.remove(element.start, subelements[0].start);
      code.remove(
        // Strip a possible trailing comma after the last element
        subelements[subelements.length - 1].end,
        // And also a possible trailing comma after the spread
        isLast ? node.end - 1 : element.end
      );
    }
    elements.splice.apply(elements, [i, 1].concat(subelements));
    i += subelements.length;
  }
}
function needsParentheses(node) {
  switch (node.type) {
    case "ArrayExpression":
    case "CallExpression":
    case "Identifier":
    case "ParenthesizedExpression":
    case "ThisExpression":
      return false;
    default:
      return true;
  }
}
function spread(code, elements, start, argumentsArrayAlias, isNew) {
  var i = elements.length;
  var firstSpreadIndex = -1;
  while (i--) {
    var element$1 = elements[i];
    if (element$1 && element$1.type === "SpreadElement") {
      if (isArguments(element$1.argument)) {
        code.overwrite(
          element$1.argument.start,
          element$1.argument.end,
          argumentsArrayAlias
        );
      }
      firstSpreadIndex = i;
    }
  }
  if (firstSpreadIndex === -1) {
    return false;
  }
  if (isNew) {
    for (i = 0; i < elements.length; i += 1) {
      var element$2 = elements[i];
      if (element$2.type === "SpreadElement") {
        code.remove(element$2.start, element$2.argument.start);
      } else {
        code.prependRight(element$2.start, "[");
        code.prependRight(element$2.end, "]");
      }
    }
    return true;
  }
  var element = elements[firstSpreadIndex];
  var previousElement = elements[firstSpreadIndex - 1];
  if (!previousElement) {
    var addClosingParen;
    if (start !== element.start) {
      if (addClosingParen = needsParentheses(element.argument)) {
        code.overwrite(start, element.start, "( ");
      } else {
        code.remove(start, element.start);
      }
    } else if (element.parent.type === "CallExpression") {
      addClosingParen = needsParentheses(element.argument);
    } else {
      throw new CompileError(
        "Unsupported spread construct, please raise an issue at https://github.com/bublejs/buble/issues",
        element
      );
    }
    code.overwrite(
      element.end,
      elements[1].start,
      addClosingParen ? " ).concat( " : ".concat( "
    );
  } else {
    code.overwrite(previousElement.end, element.start, " ].concat( ");
  }
  for (i = firstSpreadIndex; i < elements.length; i += 1) {
    element = elements[i];
    if (element) {
      if (element.type === "SpreadElement") {
        code.remove(element.start, element.argument.start);
      } else {
        code.appendLeft(element.start, "[");
        code.appendLeft(element.end, "]");
      }
    }
  }
  return true;
}
var ArrayExpression = /* @__PURE__ */ function(Node5) {
  function ArrayExpression2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    ArrayExpression2.__proto__ = Node5;
  ArrayExpression2.prototype = Object.create(Node5 && Node5.prototype);
  ArrayExpression2.prototype.constructor = ArrayExpression2;
  ArrayExpression2.prototype.initialise = function initialise2(transforms) {
    if (transforms.spreadRest && this.elements.length) {
      var lexicalBoundary = this.findLexicalBoundary();
      var i = this.elements.length;
      while (i--) {
        var element = this.elements[i];
        if (element && element.type === "SpreadElement" && isArguments(element.argument)) {
          this.argumentsArrayAlias = lexicalBoundary.getArgumentsArrayAlias();
        }
      }
    }
    Node5.prototype.initialise.call(this, transforms);
  };
  ArrayExpression2.prototype.transpile = function transpile2(code, transforms) {
    Node5.prototype.transpile.call(this, code, transforms);
    if (transforms.spreadRest) {
      inlineSpreads(code, this, this.elements);
      if (this.elements.length) {
        var lastElement = this.elements[this.elements.length - 1];
        if (lastElement && /\s*,/.test(code.original.slice(lastElement.end, this.end))) {
          code.overwrite(lastElement.end, this.end - 1, " ");
        }
      }
      if (this.elements.length === 1) {
        var element = this.elements[0];
        if (element && element.type === "SpreadElement") {
          if (isArguments(element.argument)) {
            code.overwrite(
              this.start,
              this.end,
              "[].concat( " + this.argumentsArrayAlias + " )"
            );
          } else {
            code.overwrite(this.start, element.argument.start, "[].concat( ");
            code.overwrite(element.end, this.end, " )");
          }
        }
      } else {
        var hasSpreadElements = spread(
          code,
          this.elements,
          this.start,
          this.argumentsArrayAlias
        );
        if (hasSpreadElements) {
          code.overwrite(this.end - 1, this.end, ")");
        }
      }
    }
  };
  return ArrayExpression2;
}(Node);
function removeTrailingComma(code, c) {
  while (code.original[c] !== ")") {
    if (code.original[c] === ",") {
      code.remove(c, c + 1);
      return;
    }
    if (code.original[c] === "/") {
      if (code.original[c + 1] === "/") {
        c = code.original.indexOf("\n", c);
      } else {
        c = code.original.indexOf("*/", c) + 1;
      }
    }
    c += 1;
  }
}
var ArrowFunctionExpression = /* @__PURE__ */ function(Node5) {
  function ArrowFunctionExpression2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    ArrowFunctionExpression2.__proto__ = Node5;
  ArrowFunctionExpression2.prototype = Object.create(Node5 && Node5.prototype);
  ArrowFunctionExpression2.prototype.constructor = ArrowFunctionExpression2;
  ArrowFunctionExpression2.prototype.initialise = function initialise2(transforms) {
    if (this.async && transforms.asyncAwait) {
      CompileError.missingTransform("async arrow functions", "asyncAwait", this);
    }
    this.body.createScope();
    Node5.prototype.initialise.call(this, transforms);
  };
  ArrowFunctionExpression2.prototype.transpile = function transpile2(code, transforms) {
    var openParensPos = this.start;
    for (var end = (this.body || this.params[0]).start - 1; code.original[openParensPos] !== "(" && openParensPos < end; ) {
      ++openParensPos;
    }
    if (code.original[openParensPos] !== "(") {
      openParensPos = -1;
    }
    var naked = openParensPos === -1;
    if (transforms.arrow || this.needsArguments(transforms)) {
      var charIndex = this.body.start;
      while (code.original[charIndex] !== "=") {
        charIndex -= 1;
      }
      code.remove(charIndex, this.body.start);
      Node5.prototype.transpile.call(this, code, transforms);
      if (naked) {
        code.prependRight(this.params[0].start, "(");
        code.appendLeft(this.params[0].end, ")");
      }
      var standalone = this.parent && this.parent.type === "ExpressionStatement";
      var start, text = standalone ? "!" : "";
      if (this.async) {
        text += "async ";
      }
      text += "function";
      if (!standalone) {
        text += " ";
      }
      if (naked) {
        start = this.params[0].start;
      } else {
        start = openParensPos;
      }
      if (start > this.start) {
        code.overwrite(this.start, start, text);
      } else {
        code.prependRight(this.start, text);
      }
    } else {
      Node5.prototype.transpile.call(this, code, transforms);
    }
    if (transforms.trailingFunctionCommas && this.params.length && !naked) {
      removeTrailingComma(code, this.params[this.params.length - 1].end);
    }
  };
  ArrowFunctionExpression2.prototype.needsArguments = function needsArguments(transforms) {
    return transforms.spreadRest && this.params.filter(function(param) {
      return param.type === "RestElement";
    }).length > 0;
  };
  return ArrowFunctionExpression2;
}(Node);
function checkConst(identifier, scope) {
  var declaration = scope.findDeclaration(identifier.name);
  if (declaration && declaration.kind === "const") {
    throw new CompileError(identifier.name + " is read-only", identifier);
  }
}
var AssignmentExpression = /* @__PURE__ */ function(Node5) {
  function AssignmentExpression2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    AssignmentExpression2.__proto__ = Node5;
  AssignmentExpression2.prototype = Object.create(Node5 && Node5.prototype);
  AssignmentExpression2.prototype.constructor = AssignmentExpression2;
  AssignmentExpression2.prototype.initialise = function initialise2(transforms) {
    if (this.left.type === "Identifier") {
      var declaration = this.findScope(false).findDeclaration(this.left.name);
      var statement = declaration && declaration.node.ancestor(3);
      if (statement && statement.type === "ForStatement" && statement.body.contains(this)) {
        statement.reassigned[this.left.name] = true;
      }
    }
    Node5.prototype.initialise.call(this, transforms);
  };
  AssignmentExpression2.prototype.transpile = function transpile2(code, transforms) {
    if (this.left.type === "Identifier") {
      checkConst(this.left, this.findScope(false));
    }
    if (this.operator === "**=" && transforms.exponentiation) {
      this.transpileExponentiation(code, transforms);
    } else if (/Pattern/.test(this.left.type) && transforms.destructuring) {
      this.transpileDestructuring(code);
    }
    Node5.prototype.transpile.call(this, code, transforms);
  };
  AssignmentExpression2.prototype.transpileDestructuring = function transpileDestructuring(code) {
    var this$1 = this;
    var writeScope = this.findScope(true);
    var lookupScope = this.findScope(false);
    var assign = writeScope.createDeclaration("assign");
    code.appendRight(this.left.end, "(" + assign);
    code.appendLeft(this.right.end, ", ");
    var statementGenerators = [];
    destructure(
      code,
      function(id) {
        return writeScope.createDeclaration(id);
      },
      function(node) {
        var name = lookupScope.resolveName(node.name);
        checkConst(node, lookupScope);
        return name;
      },
      this.left,
      assign,
      true,
      statementGenerators
    );
    var suffix = ", ";
    statementGenerators.forEach(function(fn, j) {
      if (j === statementGenerators.length - 1) {
        suffix = "";
      }
      fn(this$1.end, "", suffix);
    });
    if (this.unparenthesizedParent().type === "ExpressionStatement") {
      code.prependRight(this.end, ")");
    } else {
      code.appendRight(this.end, ", " + assign + ")");
    }
  };
  AssignmentExpression2.prototype.transpileExponentiation = function transpileExponentiation(code) {
    var scope = this.findScope(false);
    var charIndex = this.left.end;
    while (code.original[charIndex] !== "*") {
      charIndex += 1;
    }
    code.remove(charIndex, charIndex + 2);
    var base;
    var left = this.left.unparenthesize();
    if (left.type === "Identifier") {
      base = scope.resolveName(left.name);
    } else if (left.type === "MemberExpression") {
      var object;
      var needsObjectVar = false;
      var property;
      var needsPropertyVar = false;
      var statement = this.findNearest(/(?:Statement|Declaration)$/);
      var i0 = statement.getIndentation();
      if (left.property.type === "Identifier") {
        property = left.computed ? scope.resolveName(left.property.name) : left.property.name;
      } else {
        property = scope.createDeclaration("property");
        needsPropertyVar = true;
      }
      if (left.object.type === "Identifier") {
        object = scope.resolveName(left.object.name);
      } else {
        object = scope.createDeclaration("object");
        needsObjectVar = true;
      }
      if (left.start === statement.start) {
        if (needsObjectVar && needsPropertyVar) {
          code.prependRight(statement.start, object + " = ");
          code.overwrite(
            left.object.end,
            left.property.start,
            ";\n" + i0 + property + " = "
          );
          code.overwrite(
            left.property.end,
            left.end,
            ";\n" + i0 + object + "[" + property + "]"
          );
        } else if (needsObjectVar) {
          code.prependRight(statement.start, object + " = ");
          code.appendLeft(left.object.end, ";\n" + i0);
          code.appendLeft(left.object.end, object);
        } else if (needsPropertyVar) {
          code.prependRight(left.property.start, property + " = ");
          code.appendLeft(left.property.end, ";\n" + i0);
          code.move(left.property.start, left.property.end, this.start);
          code.appendLeft(left.object.end, "[" + property + "]");
          code.remove(left.object.end, left.property.start);
          code.remove(left.property.end, left.end);
        }
      } else {
        if (needsObjectVar && needsPropertyVar) {
          code.prependRight(left.start, "( " + object + " = ");
          code.overwrite(
            left.object.end,
            left.property.start,
            ", " + property + " = "
          );
          code.overwrite(
            left.property.end,
            left.end,
            ", " + object + "[" + property + "]"
          );
        } else if (needsObjectVar) {
          code.prependRight(left.start, "( " + object + " = ");
          code.appendLeft(left.object.end, ", " + object);
        } else if (needsPropertyVar) {
          code.prependRight(left.property.start, "( " + property + " = ");
          code.appendLeft(left.property.end, ", ");
          code.move(left.property.start, left.property.end, left.start);
          code.overwrite(left.object.end, left.property.start, "[" + property + "]");
          code.remove(left.property.end, left.end);
        }
        if (needsPropertyVar) {
          code.appendLeft(this.end, " )");
        }
      }
      base = object + (left.computed || needsPropertyVar ? "[" + property + "]" : "." + property);
    }
    code.prependRight(this.right.start, "Math.pow( " + base + ", ");
    code.appendLeft(this.right.end, " )");
  };
  return AssignmentExpression2;
}(Node);
var AwaitExpression = /* @__PURE__ */ function(Node5) {
  function AwaitExpression2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    AwaitExpression2.__proto__ = Node5;
  AwaitExpression2.prototype = Object.create(Node5 && Node5.prototype);
  AwaitExpression2.prototype.constructor = AwaitExpression2;
  AwaitExpression2.prototype.initialise = function initialise2(transforms) {
    if (transforms.asyncAwait) {
      CompileError.missingTransform("await", "asyncAwait", this);
    }
    Node5.prototype.initialise.call(this, transforms);
  };
  return AwaitExpression2;
}(Node);
var BinaryExpression = /* @__PURE__ */ function(Node5) {
  function BinaryExpression2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    BinaryExpression2.__proto__ = Node5;
  BinaryExpression2.prototype = Object.create(Node5 && Node5.prototype);
  BinaryExpression2.prototype.constructor = BinaryExpression2;
  BinaryExpression2.prototype.transpile = function transpile2(code, transforms) {
    if (this.operator === "**" && transforms.exponentiation) {
      code.prependRight(this.start, "Math.pow( ");
      code.overwrite(this.left.end, this.right.start, ", ");
      code.appendLeft(this.end, " )");
    }
    Node5.prototype.transpile.call(this, code, transforms);
  };
  return BinaryExpression2;
}(Node);
var loopStatement = /(?:For(?:In|Of)?|While)Statement/;
var BreakStatement = /* @__PURE__ */ function(Node5) {
  function BreakStatement2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    BreakStatement2.__proto__ = Node5;
  BreakStatement2.prototype = Object.create(Node5 && Node5.prototype);
  BreakStatement2.prototype.constructor = BreakStatement2;
  BreakStatement2.prototype.initialise = function initialise2() {
    var loop = this.findNearest(loopStatement);
    var switchCase = this.findNearest("SwitchCase");
    if (loop && (!switchCase || loop.depth > switchCase.depth)) {
      loop.canBreak = true;
      this.loop = loop;
    }
  };
  BreakStatement2.prototype.transpile = function transpile2(code) {
    if (this.loop && this.loop.shouldRewriteAsFunction) {
      if (this.label) {
        throw new CompileError(
          "Labels are not currently supported in a loop with locally-scoped variables",
          this
        );
      }
      code.overwrite(this.start, this.start + 5, "return 'break'");
    }
  };
  return BreakStatement2;
}(Node);
var CallExpression = /* @__PURE__ */ function(Node5) {
  function CallExpression2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    CallExpression2.__proto__ = Node5;
  CallExpression2.prototype = Object.create(Node5 && Node5.prototype);
  CallExpression2.prototype.constructor = CallExpression2;
  CallExpression2.prototype.initialise = function initialise2(transforms) {
    if (transforms.spreadRest && this.arguments.length > 1) {
      var lexicalBoundary = this.findLexicalBoundary();
      var i = this.arguments.length;
      while (i--) {
        var arg = this.arguments[i];
        if (arg.type === "SpreadElement" && isArguments(arg.argument)) {
          this.argumentsArrayAlias = lexicalBoundary.getArgumentsArrayAlias();
        }
      }
    }
    Node5.prototype.initialise.call(this, transforms);
  };
  CallExpression2.prototype.transpile = function transpile2(code, transforms) {
    if (transforms.spreadRest && this.arguments.length) {
      inlineSpreads(code, this, this.arguments);
    }
    if (transforms.spreadRest && this.arguments.length) {
      var hasSpreadElements = false;
      var context;
      var firstArgument = this.arguments[0];
      if (this.arguments.length === 1) {
        if (firstArgument.type === "SpreadElement") {
          code.remove(firstArgument.start, firstArgument.argument.start);
          hasSpreadElements = true;
        }
      } else {
        hasSpreadElements = spread(
          code,
          this.arguments,
          firstArgument.start,
          this.argumentsArrayAlias
        );
      }
      if (hasSpreadElements) {
        var _super = null;
        if (this.callee.type === "Super") {
          _super = this.callee;
        } else if (this.callee.type === "MemberExpression" && this.callee.object.type === "Super") {
          _super = this.callee.object;
        }
        if (!_super && this.callee.type === "MemberExpression") {
          if (this.callee.object.type === "Identifier") {
            context = this.callee.object.name;
          } else {
            context = this.findScope(true).createDeclaration("ref");
            var callExpression = this.callee.object;
            code.prependRight(callExpression.start, "(" + context + " = ");
            code.appendLeft(callExpression.end, ")");
          }
        } else {
          context = "void 0";
        }
        code.appendLeft(this.callee.end, ".apply");
        if (_super) {
          _super.noCall = true;
          if (this.arguments.length > 1) {
            if (firstArgument.type === "SpreadElement") {
              if (needsParentheses(firstArgument.argument)) {
                code.prependRight(firstArgument.start, "( ");
              }
            } else {
              code.prependRight(firstArgument.start, "[ ");
            }
            code.appendLeft(
              this.arguments[this.arguments.length - 1].end,
              " )"
            );
          }
        } else if (this.arguments.length === 1) {
          code.prependRight(firstArgument.start, context + ", ");
        } else {
          if (firstArgument.type === "SpreadElement") {
            if (needsParentheses(firstArgument.argument)) {
              code.appendLeft(firstArgument.start, context + ", ( ");
            } else {
              code.appendLeft(firstArgument.start, context + ", ");
            }
          } else {
            code.appendLeft(firstArgument.start, context + ", [ ");
          }
          code.appendLeft(this.arguments[this.arguments.length - 1].end, " )");
        }
      }
    }
    if (transforms.trailingFunctionCommas && this.arguments.length) {
      removeTrailingComma(code, this.arguments[this.arguments.length - 1].end);
    }
    Node5.prototype.transpile.call(this, code, transforms);
  };
  return CallExpression2;
}(Node);
var CatchClause = /* @__PURE__ */ function(Node5) {
  function CatchClause2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    CatchClause2.__proto__ = Node5;
  CatchClause2.prototype = Object.create(Node5 && Node5.prototype);
  CatchClause2.prototype.constructor = CatchClause2;
  CatchClause2.prototype.initialise = function initialise2(transforms) {
    var this$1 = this;
    this.createdDeclarations = [];
    this.scope = new Scope({
      block: true,
      parent: this.parent.findScope(false),
      declare: function(id) {
        return this$1.createdDeclarations.push(id);
      }
    });
    this.scope.addDeclaration(this.param, "catch");
    Node5.prototype.initialise.call(this, transforms);
    this.scope.consolidate();
  };
  CatchClause2.prototype.findScope = function findScope3(functionScope) {
    return functionScope ? this.parent.findScope(functionScope) : this.scope;
  };
  return CatchClause2;
}(Node);
var ClassBody = /* @__PURE__ */ function(Node5) {
  function ClassBody2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    ClassBody2.__proto__ = Node5;
  ClassBody2.prototype = Object.create(Node5 && Node5.prototype);
  ClassBody2.prototype.constructor = ClassBody2;
  ClassBody2.prototype.transpile = function transpile2(code, transforms, inFunctionExpression, superName) {
    var this$1 = this;
    if (transforms.classes) {
      var name = this.parent.name;
      var indentStr = code.getIndentString();
      var i0 = this.getIndentation() + (inFunctionExpression ? indentStr : "");
      var i1 = i0 + indentStr;
      var constructorIndex = findIndex(
        this.body,
        function(node) {
          return node.kind === "constructor";
        }
      );
      var constructor = this.body[constructorIndex];
      var introBlock = "";
      var outroBlock = "";
      if (this.body.length) {
        code.remove(this.start, this.body[0].start);
        code.remove(this.body[this.body.length - 1].end, this.end);
      } else {
        code.remove(this.start, this.end);
      }
      if (constructor) {
        constructor.value.body.isConstructorBody = true;
        var previousMethod = this.body[constructorIndex - 1];
        var nextMethod = this.body[constructorIndex + 1];
        if (constructorIndex > 0) {
          code.remove(previousMethod.end, constructor.start);
          code.move(
            constructor.start,
            nextMethod ? nextMethod.start : this.end - 1,
            this.body[0].start
          );
        }
        if (!inFunctionExpression) {
          code.appendLeft(constructor.end, ";");
        }
      }
      var namedFunctions = this.program.options.namedFunctionExpressions !== false;
      var namedConstructor = namedFunctions || this.parent.superClass || this.parent.type !== "ClassDeclaration";
      if (this.parent.superClass) {
        var inheritanceBlock = "if ( " + superName + " ) " + name + ".__proto__ = " + superName + ";\n" + i0 + name + ".prototype = Object.create( " + superName + " && " + superName + ".prototype );\n" + i0 + name + ".prototype.constructor = " + name + ";";
        if (constructor) {
          introBlock += "\n\n" + i0 + inheritanceBlock;
        } else {
          var fn = "function " + name + " () {" + (superName ? "\n" + i1 + superName + ".apply(this, arguments);\n" + i0 + "}" : "}") + (inFunctionExpression ? "" : ";") + (this.body.length ? "\n\n" + i0 : "");
          inheritanceBlock = fn + inheritanceBlock;
          introBlock += inheritanceBlock + "\n\n" + i0;
        }
      } else if (!constructor) {
        var fn$1 = "function " + (namedConstructor ? name + " " : "") + "() {}";
        if (this.parent.type === "ClassDeclaration") {
          fn$1 += ";";
        }
        if (this.body.length) {
          fn$1 += "\n\n" + i0;
        }
        introBlock += fn$1;
      }
      var scope = this.findScope(false);
      var prototypeGettersAndSetters = [];
      var staticGettersAndSetters = [];
      var prototypeAccessors2;
      var staticAccessors;
      this.body.forEach(function(method, i) {
        if ((method.kind === "get" || method.kind === "set") && transforms.getterSetter) {
          CompileError.missingTransform("getters and setters", "getterSetter", method);
        }
        if (method.kind === "constructor") {
          var constructorName = namedConstructor ? " " + name : "";
          code.overwrite(
            method.key.start,
            method.key.end,
            "function" + constructorName
          );
          return;
        }
        if (method.static) {
          var len = code.original[method.start + 6] == " " ? 7 : 6;
          code.remove(method.start, method.start + len);
        }
        var isAccessor = method.kind !== "method";
        var lhs;
        var methodName = method.key.name;
        if (reserved[methodName] || method.value.body.scope.references[methodName]) {
          methodName = scope.createIdentifier(methodName);
        }
        var fake_computed = false;
        if (!method.computed && method.key.type === "Literal") {
          fake_computed = true;
          method.computed = true;
        }
        if (isAccessor) {
          if (method.computed) {
            throw new Error(
              "Computed accessor properties are not currently supported"
            );
          }
          code.remove(method.start, method.key.start);
          if (method.static) {
            if (!~staticGettersAndSetters.indexOf(method.key.name)) {
              staticGettersAndSetters.push(method.key.name);
            }
            if (!staticAccessors) {
              staticAccessors = scope.createIdentifier("staticAccessors");
            }
            lhs = "" + staticAccessors;
          } else {
            if (!~prototypeGettersAndSetters.indexOf(method.key.name)) {
              prototypeGettersAndSetters.push(method.key.name);
            }
            if (!prototypeAccessors2) {
              prototypeAccessors2 = scope.createIdentifier("prototypeAccessors");
            }
            lhs = "" + prototypeAccessors2;
          }
        } else {
          lhs = method.static ? "" + name : name + ".prototype";
        }
        if (!method.computed) {
          lhs += ".";
        }
        var insertNewlines = constructorIndex > 0 && i === constructorIndex + 1 || i === 0 && constructorIndex === this$1.body.length - 1;
        if (insertNewlines) {
          lhs = "\n\n" + i0 + lhs;
        }
        var c = method.key.end;
        if (method.computed) {
          if (fake_computed) {
            code.prependRight(method.key.start, "[");
            code.appendLeft(method.key.end, "]");
          } else {
            while (code.original[c] !== "]") {
              c += 1;
            }
            c += 1;
          }
        }
        var funcName = method.computed || isAccessor || !namedFunctions ? "" : methodName + " ";
        var rhs = (isAccessor ? "." + method.kind : "") + " = " + (method.value.async ? "async " : "") + "function" + (method.value.generator ? "* " : " ") + funcName;
        code.remove(c, method.value.start);
        code.prependRight(method.value.start, rhs);
        code.appendLeft(method.end, ";");
        if (method.value.generator) {
          code.remove(method.start, method.key.start);
        }
        var start = method.key.start;
        if (method.computed && !fake_computed) {
          while (code.original[start] != "[") {
            --start;
          }
        }
        if (method.start < start) {
          code.overwrite(method.start, start, lhs);
        } else {
          code.prependRight(method.start, lhs);
        }
      });
      if (prototypeGettersAndSetters.length || staticGettersAndSetters.length) {
        var intro = [];
        var outro = [];
        if (prototypeGettersAndSetters.length) {
          intro.push(
            "var " + prototypeAccessors2 + " = { " + prototypeGettersAndSetters.map(function(name2) {
              return name2 + ": { configurable: true }";
            }).join(",") + " };"
          );
          outro.push(
            "Object.defineProperties( " + name + ".prototype, " + prototypeAccessors2 + " );"
          );
        }
        if (staticGettersAndSetters.length) {
          intro.push(
            "var " + staticAccessors + " = { " + staticGettersAndSetters.map(function(name2) {
              return name2 + ": { configurable: true }";
            }).join(",") + " };"
          );
          outro.push("Object.defineProperties( " + name + ", " + staticAccessors + " );");
        }
        if (constructor) {
          introBlock += "\n\n" + i0;
        }
        introBlock += intro.join("\n" + i0);
        if (!constructor) {
          introBlock += "\n\n" + i0;
        }
        outroBlock += "\n\n" + i0 + outro.join("\n" + i0);
      }
      if (constructor) {
        code.appendLeft(constructor.end, introBlock);
      } else {
        code.prependRight(this.start, introBlock);
      }
      code.appendLeft(this.end, outroBlock);
    }
    Node5.prototype.transpile.call(this, code, transforms);
  };
  return ClassBody2;
}(Node);
function deindent(node, code) {
  var start = node.start;
  var end = node.end;
  var indentStr = code.getIndentString();
  var indentStrLen = indentStr.length;
  var indentStart = start - indentStrLen;
  if (!node.program.indentExclusions[indentStart] && code.original.slice(indentStart, start) === indentStr) {
    code.remove(indentStart, start);
  }
  var pattern = new RegExp(indentStr + "\\S", "g");
  var slice2 = code.original.slice(start, end);
  var match;
  while (match = pattern.exec(slice2)) {
    var removeStart = start + match.index;
    if (!node.program.indentExclusions[removeStart]) {
      code.remove(removeStart, removeStart + indentStrLen);
    }
  }
}
var ClassDeclaration = /* @__PURE__ */ function(Node5) {
  function ClassDeclaration2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    ClassDeclaration2.__proto__ = Node5;
  ClassDeclaration2.prototype = Object.create(Node5 && Node5.prototype);
  ClassDeclaration2.prototype.constructor = ClassDeclaration2;
  ClassDeclaration2.prototype.initialise = function initialise2(transforms) {
    if (this.id) {
      this.name = this.id.name;
      this.findScope(true).addDeclaration(this.id, "class");
    } else {
      this.name = this.findScope(true).createIdentifier("defaultExport");
    }
    Node5.prototype.initialise.call(this, transforms);
  };
  ClassDeclaration2.prototype.transpile = function transpile2(code, transforms) {
    if (transforms.classes) {
      if (!this.superClass) {
        deindent(this.body, code);
      }
      var superName = this.superClass && (this.superClass.name || "superclass");
      var i0 = this.getIndentation();
      var i1 = i0 + code.getIndentString();
      var isExportDefaultDeclaration = this.parent.type === "ExportDefaultDeclaration";
      if (isExportDefaultDeclaration) {
        code.remove(this.parent.start, this.start);
      }
      var c = this.start;
      if (this.id) {
        code.overwrite(c, this.id.start, "var ");
        c = this.id.end;
      } else {
        code.prependLeft(c, "var " + this.name);
      }
      if (this.superClass) {
        if (this.superClass.end === this.body.start) {
          code.remove(c, this.superClass.start);
          code.appendLeft(c, " = /*@__PURE__*/(function (" + superName + ") {\n" + i1);
        } else {
          code.overwrite(c, this.superClass.start, " = ");
          code.overwrite(
            this.superClass.end,
            this.body.start,
            "/*@__PURE__*/(function (" + superName + ") {\n" + i1
          );
        }
      } else {
        if (c === this.body.start) {
          code.appendLeft(c, " = ");
        } else {
          code.overwrite(c, this.body.start, " = ");
        }
      }
      this.body.transpile(code, transforms, !!this.superClass, superName);
      var syntheticDefaultExport = isExportDefaultDeclaration ? "\n\n" + i0 + "export default " + this.name + ";" : "";
      if (this.superClass) {
        code.appendLeft(this.end, "\n\n" + i1 + "return " + this.name + ";\n" + i0 + "}(");
        code.move(this.superClass.start, this.superClass.end, this.end);
        code.prependRight(this.end, "));" + syntheticDefaultExport);
      } else if (syntheticDefaultExport) {
        code.prependRight(this.end, syntheticDefaultExport);
      }
    } else {
      this.body.transpile(code, transforms, false, null);
    }
  };
  return ClassDeclaration2;
}(Node);
var ClassExpression = /* @__PURE__ */ function(Node5) {
  function ClassExpression2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    ClassExpression2.__proto__ = Node5;
  ClassExpression2.prototype = Object.create(Node5 && Node5.prototype);
  ClassExpression2.prototype.constructor = ClassExpression2;
  ClassExpression2.prototype.initialise = function initialise2(transforms) {
    this.name = (this.id ? this.id.name : this.parent.type === "VariableDeclarator" ? this.parent.id.name : this.parent.type !== "AssignmentExpression" ? null : this.parent.left.type === "Identifier" ? this.parent.left.name : this.parent.left.type === "MemberExpression" ? this.parent.left.property.name : null) || this.findScope(true).createIdentifier("anonymous");
    Node5.prototype.initialise.call(this, transforms);
  };
  ClassExpression2.prototype.transpile = function transpile2(code, transforms) {
    if (transforms.classes) {
      var superName = this.superClass && (this.superClass.name || "superclass");
      if (superName === this.name) {
        superName = this.findScope(true).createIdentifier(this.name);
      }
      var i0 = this.getIndentation();
      var i1 = i0 + code.getIndentString();
      if (this.superClass) {
        code.remove(this.start, this.superClass.start);
        code.remove(this.superClass.end, this.body.start);
        code.appendRight(this.start, "/*@__PURE__*/(function (" + superName + ") {\n" + i1);
      } else {
        code.overwrite(this.start, this.body.start, "/*@__PURE__*/(function () {\n" + i1);
      }
      this.body.transpile(code, transforms, true, superName);
      var superClass = "";
      if (this.superClass) {
        superClass = code.slice(this.superClass.start, this.superClass.end);
        code.remove(this.superClass.start, this.superClass.end);
      }
      code.appendLeft(this.end, "\n\n" + i1 + "return " + this.name + ";\n" + i0 + "}(" + superClass + "))");
    } else {
      this.body.transpile(code, transforms, false);
    }
  };
  return ClassExpression2;
}(Node);
var ContinueStatement = /* @__PURE__ */ function(Node5) {
  function ContinueStatement2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    ContinueStatement2.__proto__ = Node5;
  ContinueStatement2.prototype = Object.create(Node5 && Node5.prototype);
  ContinueStatement2.prototype.constructor = ContinueStatement2;
  ContinueStatement2.prototype.transpile = function transpile2(code) {
    var loop = this.findNearest(loopStatement);
    if (loop.shouldRewriteAsFunction) {
      if (this.label) {
        throw new CompileError(
          "Labels are not currently supported in a loop with locally-scoped variables",
          this
        );
      }
      code.overwrite(this.start, this.start + 8, "return");
    }
  };
  return ContinueStatement2;
}(Node);
var ExportDefaultDeclaration = /* @__PURE__ */ function(Node5) {
  function ExportDefaultDeclaration2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    ExportDefaultDeclaration2.__proto__ = Node5;
  ExportDefaultDeclaration2.prototype = Object.create(Node5 && Node5.prototype);
  ExportDefaultDeclaration2.prototype.constructor = ExportDefaultDeclaration2;
  ExportDefaultDeclaration2.prototype.initialise = function initialise2(transforms) {
    if (transforms.moduleExport) {
      CompileError.missingTransform("export", "moduleExport", this);
    }
    Node5.prototype.initialise.call(this, transforms);
  };
  return ExportDefaultDeclaration2;
}(Node);
var ExportNamedDeclaration = /* @__PURE__ */ function(Node5) {
  function ExportNamedDeclaration2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    ExportNamedDeclaration2.__proto__ = Node5;
  ExportNamedDeclaration2.prototype = Object.create(Node5 && Node5.prototype);
  ExportNamedDeclaration2.prototype.constructor = ExportNamedDeclaration2;
  ExportNamedDeclaration2.prototype.initialise = function initialise2(transforms) {
    if (transforms.moduleExport) {
      CompileError.missingTransform("export", "moduleExport", this);
    }
    Node5.prototype.initialise.call(this, transforms);
  };
  return ExportNamedDeclaration2;
}(Node);
var LoopStatement = /* @__PURE__ */ function(Node5) {
  function LoopStatement2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    LoopStatement2.__proto__ = Node5;
  LoopStatement2.prototype = Object.create(Node5 && Node5.prototype);
  LoopStatement2.prototype.constructor = LoopStatement2;
  LoopStatement2.prototype.findScope = function findScope3(functionScope) {
    return functionScope || !this.createdScope ? this.parent.findScope(functionScope) : this.body.scope;
  };
  LoopStatement2.prototype.initialise = function initialise2(transforms) {
    this.body.createScope();
    this.createdScope = true;
    this.reassigned = /* @__PURE__ */ Object.create(null);
    this.aliases = /* @__PURE__ */ Object.create(null);
    this.thisRefs = [];
    Node5.prototype.initialise.call(this, transforms);
    if (this.scope) {
      this.scope.consolidate();
    }
    var declarations = Object.assign({}, this.body.scope.declarations);
    if (this.scope) {
      Object.assign(declarations, this.scope.declarations);
    }
    if (transforms.letConst) {
      var names = Object.keys(declarations);
      var i = names.length;
      while (i--) {
        var name = names[i];
        var declaration = declarations[name];
        var j = declaration.instances.length;
        while (j--) {
          var instance = declaration.instances[j];
          var nearestFunctionExpression = instance.findNearest(/Function/);
          if (nearestFunctionExpression && nearestFunctionExpression.depth > this.depth) {
            this.shouldRewriteAsFunction = true;
            for (var i$1 = 0, list = this.thisRefs; i$1 < list.length; i$1 += 1) {
              var node = list[i$1];
              node.alias = node.alias || node.findLexicalBoundary().getThisAlias();
            }
            break;
          }
        }
        if (this.shouldRewriteAsFunction) {
          break;
        }
      }
    }
  };
  LoopStatement2.prototype.transpile = function transpile2(code, transforms) {
    var needsBlock = this.type != "ForOfStatement" && (this.body.type !== "BlockStatement" || this.body.type === "BlockStatement" && this.body.synthetic);
    if (this.shouldRewriteAsFunction) {
      var i0 = this.getIndentation();
      var i1 = i0 + code.getIndentString();
      var argString = this.args ? " " + this.args.join(", ") + " " : "";
      var paramString = this.params ? " " + this.params.join(", ") + " " : "";
      var functionScope = this.findScope(true);
      var loop = functionScope.createIdentifier("loop");
      var before = "var " + loop + " = function (" + paramString + ") " + (this.body.synthetic ? "{\n" + i0 + code.getIndentString() : "");
      var after = (this.body.synthetic ? "\n" + i0 + "}" : "") + ";\n\n" + i0;
      code.prependRight(this.body.start, before);
      code.appendLeft(this.body.end, after);
      code.move(this.start, this.body.start, this.body.end);
      if (this.canBreak || this.canReturn) {
        var returned = functionScope.createIdentifier("returned");
        var insert2 = "{\n" + i1 + "var " + returned + " = " + loop + "(" + argString + ");\n";
        if (this.canBreak) {
          insert2 += "\n" + i1 + "if ( " + returned + " === 'break' ) break;";
        }
        if (this.canReturn) {
          insert2 += "\n" + i1 + "if ( " + returned + " ) return " + returned + ".v;";
        }
        insert2 += "\n" + i0 + "}";
        code.prependRight(this.body.end, insert2);
      } else {
        var callExpression = loop + "(" + argString + ");";
        if (this.type === "DoWhileStatement") {
          code.overwrite(
            this.start,
            this.body.start,
            "do {\n" + i1 + callExpression + "\n" + i0 + "}"
          );
        } else {
          code.prependRight(this.body.end, callExpression);
        }
      }
    } else if (needsBlock) {
      code.appendLeft(this.body.start, "{ ");
      code.prependRight(this.body.end, " }");
    }
    Node5.prototype.transpile.call(this, code, transforms);
  };
  return LoopStatement2;
}(Node);
var ForStatement = /* @__PURE__ */ function(LoopStatement2) {
  function ForStatement2() {
    LoopStatement2.apply(this, arguments);
  }
  if (LoopStatement2)
    ForStatement2.__proto__ = LoopStatement2;
  ForStatement2.prototype = Object.create(LoopStatement2 && LoopStatement2.prototype);
  ForStatement2.prototype.constructor = ForStatement2;
  ForStatement2.prototype.initialise = function initialise2(transforms) {
    var this$1 = this;
    this.createdDeclarations = [];
    this.scope = new Scope({
      block: true,
      parent: this.parent.findScope(false),
      declare: function(id) {
        return this$1.createdDeclarations.push(id);
      }
    });
    LoopStatement2.prototype.initialise.call(this, transforms);
  };
  ForStatement2.prototype.findScope = function findScope3(functionScope) {
    return functionScope ? this.parent.findScope(functionScope) : this.scope;
  };
  ForStatement2.prototype.transpile = function transpile2(code, transforms) {
    var this$1 = this;
    var i1 = this.getIndentation() + code.getIndentString();
    if (this.shouldRewriteAsFunction) {
      var names = this.init && this.init.type === "VariableDeclaration" ? this.init.declarations.map(function(declarator) {
        return extractNames(declarator.id);
      }) : [];
      var aliases = this.aliases;
      this.args = names.map(
        function(name) {
          return name in this$1.aliases ? this$1.aliases[name].outer : name;
        }
      );
      this.params = names.map(
        function(name) {
          return name in this$1.aliases ? this$1.aliases[name].inner : name;
        }
      );
      var updates = Object.keys(this.reassigned).map(
        function(name) {
          return aliases[name].outer + " = " + aliases[name].inner + ";";
        }
      );
      if (updates.length) {
        if (this.body.synthetic) {
          code.appendLeft(this.body.body[0].end, "; " + updates.join(" "));
        } else {
          var lastStatement = this.body.body[this.body.body.length - 1];
          code.appendLeft(
            lastStatement.end,
            "\n\n" + i1 + updates.join("\n" + i1)
          );
        }
      }
    }
    LoopStatement2.prototype.transpile.call(this, code, transforms);
  };
  return ForStatement2;
}(LoopStatement);
var ForInStatement = /* @__PURE__ */ function(LoopStatement2) {
  function ForInStatement2() {
    LoopStatement2.apply(this, arguments);
  }
  if (LoopStatement2)
    ForInStatement2.__proto__ = LoopStatement2;
  ForInStatement2.prototype = Object.create(LoopStatement2 && LoopStatement2.prototype);
  ForInStatement2.prototype.constructor = ForInStatement2;
  ForInStatement2.prototype.initialise = function initialise2(transforms) {
    var this$1 = this;
    this.createdDeclarations = [];
    this.scope = new Scope({
      block: true,
      parent: this.parent.findScope(false),
      declare: function(id) {
        return this$1.createdDeclarations.push(id);
      }
    });
    LoopStatement2.prototype.initialise.call(this, transforms);
  };
  ForInStatement2.prototype.findScope = function findScope3(functionScope) {
    return functionScope ? this.parent.findScope(functionScope) : this.scope;
  };
  ForInStatement2.prototype.transpile = function transpile2(code, transforms) {
    var this$1 = this;
    var hasDeclaration = this.left.type === "VariableDeclaration";
    if (this.shouldRewriteAsFunction) {
      var names = hasDeclaration ? this.left.declarations.map(function(declarator) {
        return extractNames(declarator.id);
      }) : [];
      this.args = names.map(
        function(name) {
          return name in this$1.aliases ? this$1.aliases[name].outer : name;
        }
      );
      this.params = names.map(
        function(name) {
          return name in this$1.aliases ? this$1.aliases[name].inner : name;
        }
      );
    }
    LoopStatement2.prototype.transpile.call(this, code, transforms);
    var maybePattern = hasDeclaration ? this.left.declarations[0].id : this.left;
    if (maybePattern.type !== "Identifier" && maybePattern.type !== "MemberExpression") {
      this.destructurePattern(code, maybePattern, hasDeclaration);
    }
  };
  ForInStatement2.prototype.destructurePattern = function destructurePattern(code, pattern, isDeclaration) {
    var scope = this.findScope(true);
    var i0 = this.getIndentation();
    var i1 = i0 + code.getIndentString();
    var ref2 = scope.createIdentifier("ref");
    var bodyStart = this.body.body.length ? this.body.body[0].start : this.body.start + 1;
    code.move(pattern.start, pattern.end, bodyStart);
    code.prependRight(pattern.end, isDeclaration ? ref2 : "var " + ref2);
    var statementGenerators = [];
    destructure(
      code,
      function(id) {
        return scope.createIdentifier(id);
      },
      function(ref3) {
        var name = ref3.name;
        return scope.resolveName(name);
      },
      pattern,
      ref2,
      false,
      statementGenerators
    );
    var suffix = ";\n" + i1;
    statementGenerators.forEach(function(fn, i) {
      if (i === statementGenerators.length - 1) {
        suffix = ";\n\n" + i1;
      }
      fn(bodyStart, "", suffix);
    });
  };
  return ForInStatement2;
}(LoopStatement);
var ForOfStatement = /* @__PURE__ */ function(LoopStatement2) {
  function ForOfStatement2() {
    LoopStatement2.apply(this, arguments);
  }
  if (LoopStatement2)
    ForOfStatement2.__proto__ = LoopStatement2;
  ForOfStatement2.prototype = Object.create(LoopStatement2 && LoopStatement2.prototype);
  ForOfStatement2.prototype.constructor = ForOfStatement2;
  ForOfStatement2.prototype.initialise = function initialise2(transforms) {
    var this$1 = this;
    if (transforms.forOf && !transforms.dangerousForOf) {
      CompileError.missingTransform("for-of statements", "forOf", this, "dangerousForOf");
    }
    if (this.await && transforms.asyncAwait) {
      CompileError.missingTransform("for-await-of statements", "asyncAwait", this);
    }
    this.createdDeclarations = [];
    this.scope = new Scope({
      block: true,
      parent: this.parent.findScope(false),
      declare: function(id) {
        return this$1.createdDeclarations.push(id);
      }
    });
    LoopStatement2.prototype.initialise.call(this, transforms);
  };
  ForOfStatement2.prototype.findScope = function findScope3(functionScope) {
    return functionScope ? this.parent.findScope(functionScope) : this.scope;
  };
  ForOfStatement2.prototype.transpile = function transpile2(code, transforms) {
    LoopStatement2.prototype.transpile.call(this, code, transforms);
    if (!transforms.dangerousForOf) {
      return;
    }
    if (!this.body.body[0]) {
      if (this.left.type === "VariableDeclaration" && this.left.kind === "var") {
        code.remove(this.start, this.left.start);
        code.appendLeft(this.left.end, ";");
        code.remove(this.left.end, this.end);
      } else {
        code.remove(this.start, this.end);
      }
      return;
    }
    var scope = this.findScope(true);
    var i0 = this.getIndentation();
    var i1 = i0 + code.getIndentString();
    var key = scope.createIdentifier("i");
    var list = scope.createIdentifier("list");
    if (this.body.synthetic) {
      code.prependRight(this.left.start, "{\n" + i1);
      code.appendLeft(this.body.body[0].end, "\n" + i0 + "}");
    }
    var bodyStart = this.body.body[0].start;
    code.remove(this.left.end, this.right.start);
    code.move(this.left.start, this.left.end, bodyStart);
    code.prependRight(this.right.start, "var " + key + " = 0, " + list + " = ");
    code.appendLeft(this.right.end, "; " + key + " < " + list + ".length; " + key + " += 1");
    var isDeclaration = this.left.type === "VariableDeclaration";
    var maybeDestructuring = isDeclaration ? this.left.declarations[0].id : this.left;
    if (maybeDestructuring.type !== "Identifier") {
      var statementGenerators = [];
      var ref2 = scope.createIdentifier("ref");
      destructure(
        code,
        function(id) {
          return scope.createIdentifier(id);
        },
        function(ref3) {
          var name = ref3.name;
          return scope.resolveName(name);
        },
        maybeDestructuring,
        ref2,
        !isDeclaration,
        statementGenerators
      );
      var suffix = ";\n" + i1;
      statementGenerators.forEach(function(fn, i) {
        if (i === statementGenerators.length - 1) {
          suffix = ";\n\n" + i1;
        }
        fn(bodyStart, "", suffix);
      });
      if (isDeclaration) {
        code.appendLeft(this.left.start + this.left.kind.length + 1, ref2);
        code.appendLeft(this.left.end, " = " + list + "[" + key + "];\n" + i1);
      } else {
        code.appendLeft(this.left.end, "var " + ref2 + " = " + list + "[" + key + "];\n" + i1);
      }
    } else {
      code.appendLeft(this.left.end, " = " + list + "[" + key + "];\n\n" + i1);
    }
  };
  return ForOfStatement2;
}(LoopStatement);
var FunctionDeclaration = /* @__PURE__ */ function(Node5) {
  function FunctionDeclaration2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    FunctionDeclaration2.__proto__ = Node5;
  FunctionDeclaration2.prototype = Object.create(Node5 && Node5.prototype);
  FunctionDeclaration2.prototype.constructor = FunctionDeclaration2;
  FunctionDeclaration2.prototype.initialise = function initialise2(transforms) {
    if (this.generator && transforms.generator) {
      CompileError.missingTransform("generators", "generator", this);
    }
    if (this.async && transforms.asyncAwait) {
      CompileError.missingTransform("async functions", "asyncAwait", this);
    }
    this.body.createScope();
    if (this.id) {
      this.findScope(true).addDeclaration(this.id, "function");
    }
    Node5.prototype.initialise.call(this, transforms);
  };
  FunctionDeclaration2.prototype.transpile = function transpile2(code, transforms) {
    Node5.prototype.transpile.call(this, code, transforms);
    if (transforms.trailingFunctionCommas && this.params.length) {
      removeTrailingComma(code, this.params[this.params.length - 1].end);
    }
  };
  return FunctionDeclaration2;
}(Node);
var FunctionExpression = /* @__PURE__ */ function(Node5) {
  function FunctionExpression2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    FunctionExpression2.__proto__ = Node5;
  FunctionExpression2.prototype = Object.create(Node5 && Node5.prototype);
  FunctionExpression2.prototype.constructor = FunctionExpression2;
  FunctionExpression2.prototype.initialise = function initialise2(transforms) {
    if (this.generator && transforms.generator) {
      CompileError.missingTransform("generators", "generator", this);
    }
    if (this.async && transforms.asyncAwait) {
      CompileError.missingTransform("async functions", "asyncAwait", this);
    }
    this.body.createScope();
    if (this.id) {
      this.body.scope.addDeclaration(this.id, "function");
    }
    Node5.prototype.initialise.call(this, transforms);
    var parent = this.parent;
    var methodName;
    if (transforms.conciseMethodProperty && parent.type === "Property" && parent.kind === "init" && parent.method && parent.key.type === "Identifier") {
      methodName = parent.key.name;
    } else if (transforms.classes && parent.type === "MethodDefinition" && parent.kind === "method" && parent.key.type === "Identifier") {
      methodName = parent.key.name;
    } else if (this.id && this.id.type === "Identifier") {
      methodName = this.id.alias || this.id.name;
    }
    if (methodName) {
      for (var i$1 = 0, list$1 = this.params; i$1 < list$1.length; i$1 += 1) {
        var param = list$1[i$1];
        if (param.type === "Identifier" && methodName === param.name) {
          var scope = this.body.scope;
          var declaration = scope.declarations[methodName];
          var alias = scope.createIdentifier(methodName);
          param.alias = alias;
          for (var i = 0, list = declaration.instances; i < list.length; i += 1) {
            var identifier = list[i];
            identifier.alias = alias;
          }
          break;
        }
      }
    }
  };
  FunctionExpression2.prototype.transpile = function transpile2(code, transforms) {
    Node5.prototype.transpile.call(this, code, transforms);
    if (transforms.trailingFunctionCommas && this.params.length) {
      removeTrailingComma(code, this.params[this.params.length - 1].end);
    }
  };
  return FunctionExpression2;
}(Node);
function isReference(node, parent) {
  if (node.type === "MemberExpression") {
    return !node.computed && isReference(node.object, node);
  }
  if (node.type === "Identifier") {
    if (!parent) {
      return true;
    }
    if (/(Function|Class)Expression/.test(parent.type)) {
      return false;
    }
    if (parent.type === "VariableDeclarator") {
      return node === parent.init;
    }
    if (parent.type === "MemberExpression" || parent.type === "MethodDefinition") {
      return parent.computed || node === parent.object;
    }
    if (parent.type === "ArrayPattern") {
      return false;
    }
    if (parent.type === "Property") {
      if (parent.parent.type === "ObjectPattern") {
        return false;
      }
      return parent.computed || node === parent.value;
    }
    if (parent.type === "MethodDefinition") {
      return false;
    }
    if (parent.type === "ExportSpecifier" && node !== parent.local) {
      return false;
    }
    return true;
  }
}
var Identifier2 = /* @__PURE__ */ function(Node5) {
  function Identifier3() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    Identifier3.__proto__ = Node5;
  Identifier3.prototype = Object.create(Node5 && Node5.prototype);
  Identifier3.prototype.constructor = Identifier3;
  Identifier3.prototype.findScope = function findScope3(functionScope) {
    if (this.parent.params && ~this.parent.params.indexOf(this)) {
      return this.parent.body.scope;
    }
    if (this.parent.type === "FunctionExpression" && this === this.parent.id) {
      return this.parent.body.scope;
    }
    return this.parent.findScope(functionScope);
  };
  Identifier3.prototype.initialise = function initialise2(transforms) {
    if (this.isLabel()) {
      return;
    }
    if (isReference(this, this.parent)) {
      if (transforms.arrow && this.name === "arguments" && !this.findScope(false).contains(this.name)) {
        var lexicalBoundary = this.findLexicalBoundary();
        var arrowFunction = this.findNearest("ArrowFunctionExpression");
        var loop = this.findNearest(loopStatement);
        if (arrowFunction && arrowFunction.depth > lexicalBoundary.depth) {
          this.alias = lexicalBoundary.getArgumentsAlias();
        }
        if (loop && loop.body.contains(this) && loop.depth > lexicalBoundary.depth) {
          this.alias = lexicalBoundary.getArgumentsAlias();
        }
      }
      this.findScope(false).addReference(this);
    }
  };
  Identifier3.prototype.isLabel = function isLabel() {
    switch (this.parent.type) {
      case "BreakStatement":
        return true;
      case "ContinueStatement":
        return true;
      case "LabeledStatement":
        return true;
      default:
        return false;
    }
  };
  Identifier3.prototype.transpile = function transpile2(code) {
    if (this.alias) {
      code.overwrite(this.start, this.end, this.alias, {
        storeName: true,
        contentOnly: true
      });
    }
  };
  return Identifier3;
}(Node);
var IfStatement = /* @__PURE__ */ function(Node5) {
  function IfStatement2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    IfStatement2.__proto__ = Node5;
  IfStatement2.prototype = Object.create(Node5 && Node5.prototype);
  IfStatement2.prototype.constructor = IfStatement2;
  IfStatement2.prototype.initialise = function initialise2(transforms) {
    Node5.prototype.initialise.call(this, transforms);
  };
  IfStatement2.prototype.transpile = function transpile2(code, transforms) {
    if (this.consequent.type !== "BlockStatement" || this.consequent.type === "BlockStatement" && this.consequent.synthetic) {
      code.appendLeft(this.consequent.start, "{ ");
      code.prependRight(this.consequent.end, " }");
    }
    if (this.alternate && this.alternate.type !== "IfStatement" && (this.alternate.type !== "BlockStatement" || this.alternate.type === "BlockStatement" && this.alternate.synthetic)) {
      code.appendLeft(this.alternate.start, "{ ");
      code.prependRight(this.alternate.end, " }");
    }
    Node5.prototype.transpile.call(this, code, transforms);
  };
  return IfStatement2;
}(Node);
var Import = /* @__PURE__ */ function(Node5) {
  function Import2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    Import2.__proto__ = Node5;
  Import2.prototype = Object.create(Node5 && Node5.prototype);
  Import2.prototype.constructor = Import2;
  Import2.prototype.initialise = function initialise2(transforms) {
    if (transforms.moduleImport) {
      CompileError.missingTransform("dynamic import expressions", "moduleImport", this);
    }
    Node5.prototype.initialise.call(this, transforms);
  };
  return Import2;
}(Node);
var ImportDeclaration = /* @__PURE__ */ function(Node5) {
  function ImportDeclaration2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    ImportDeclaration2.__proto__ = Node5;
  ImportDeclaration2.prototype = Object.create(Node5 && Node5.prototype);
  ImportDeclaration2.prototype.constructor = ImportDeclaration2;
  ImportDeclaration2.prototype.initialise = function initialise2(transforms) {
    if (transforms.moduleImport) {
      CompileError.missingTransform("import", "moduleImport", this);
    }
    Node5.prototype.initialise.call(this, transforms);
  };
  return ImportDeclaration2;
}(Node);
var ImportDefaultSpecifier = /* @__PURE__ */ function(Node5) {
  function ImportDefaultSpecifier2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    ImportDefaultSpecifier2.__proto__ = Node5;
  ImportDefaultSpecifier2.prototype = Object.create(Node5 && Node5.prototype);
  ImportDefaultSpecifier2.prototype.constructor = ImportDefaultSpecifier2;
  ImportDefaultSpecifier2.prototype.initialise = function initialise2(transforms) {
    this.findScope(true).addDeclaration(this.local, "import");
    Node5.prototype.initialise.call(this, transforms);
  };
  return ImportDefaultSpecifier2;
}(Node);
var ImportSpecifier = /* @__PURE__ */ function(Node5) {
  function ImportSpecifier2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    ImportSpecifier2.__proto__ = Node5;
  ImportSpecifier2.prototype = Object.create(Node5 && Node5.prototype);
  ImportSpecifier2.prototype.constructor = ImportSpecifier2;
  ImportSpecifier2.prototype.initialise = function initialise2(transforms) {
    this.findScope(true).addDeclaration(this.local, "import");
    Node5.prototype.initialise.call(this, transforms);
  };
  return ImportSpecifier2;
}(Node);
var hasDashes = function(val) {
  return /-/.test(val);
};
var formatKey = function(key) {
  return hasDashes(key) ? "'" + key + "'" : key;
};
var formatVal = function(val) {
  return val ? "" : "true";
};
var JSXAttribute = /* @__PURE__ */ function(Node5) {
  function JSXAttribute2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    JSXAttribute2.__proto__ = Node5;
  JSXAttribute2.prototype = Object.create(Node5 && Node5.prototype);
  JSXAttribute2.prototype.constructor = JSXAttribute2;
  JSXAttribute2.prototype.transpile = function transpile2(code, transforms) {
    var ref2 = this.name;
    var start = ref2.start;
    var name = ref2.name;
    var end = this.value ? this.value.start : this.name.end;
    code.overwrite(start, end, formatKey(name) + ": " + formatVal(this.value));
    Node5.prototype.transpile.call(this, code, transforms);
  };
  return JSXAttribute2;
}(Node);
function containsNewLine(node) {
  return node.type === "JSXText" && !/\S/.test(node.value) && /\n/.test(node.value);
}
var JSXClosingElement = /* @__PURE__ */ function(Node5) {
  function JSXClosingElement2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    JSXClosingElement2.__proto__ = Node5;
  JSXClosingElement2.prototype = Object.create(Node5 && Node5.prototype);
  JSXClosingElement2.prototype.constructor = JSXClosingElement2;
  JSXClosingElement2.prototype.transpile = function transpile2(code) {
    var spaceBeforeParen = true;
    var lastChild = this.parent.children[this.parent.children.length - 1];
    if (lastChild && containsNewLine(lastChild) || this.parent.openingElement.attributes.length) {
      spaceBeforeParen = false;
    }
    code.overwrite(this.start, this.end, spaceBeforeParen ? " )" : ")");
  };
  return JSXClosingElement2;
}(Node);
function containsNewLine$1(node) {
  return node.type === "JSXText" && !/\S/.test(node.value) && /\n/.test(node.value);
}
var JSXClosingFragment = /* @__PURE__ */ function(Node5) {
  function JSXClosingFragment2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    JSXClosingFragment2.__proto__ = Node5;
  JSXClosingFragment2.prototype = Object.create(Node5 && Node5.prototype);
  JSXClosingFragment2.prototype.constructor = JSXClosingFragment2;
  JSXClosingFragment2.prototype.transpile = function transpile2(code) {
    var spaceBeforeParen = true;
    var lastChild = this.parent.children[this.parent.children.length - 1];
    if (lastChild && containsNewLine$1(lastChild)) {
      spaceBeforeParen = false;
    }
    code.overwrite(this.start, this.end, spaceBeforeParen ? " )" : ")");
  };
  return JSXClosingFragment2;
}(Node);
function normalise(str, removeTrailingWhitespace) {
  if (removeTrailingWhitespace && /\n/.test(str)) {
    str = str.replace(/[ \f\n\r\t\v]+$/, "");
  }
  str = str.replace(/^\n\r?[ \f\n\r\t\v]+/, "").replace(/[ \f\n\r\t\v]*\n\r?[ \f\n\r\t\v]*/gm, " ");
  return JSON.stringify(str);
}
var JSXElement = /* @__PURE__ */ function(Node5) {
  function JSXElement2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    JSXElement2.__proto__ = Node5;
  JSXElement2.prototype = Object.create(Node5 && Node5.prototype);
  JSXElement2.prototype.constructor = JSXElement2;
  JSXElement2.prototype.transpile = function transpile2(code, transforms) {
    Node5.prototype.transpile.call(this, code, transforms);
    var children = this.children.filter(function(child2) {
      if (child2.type !== "JSXText") {
        return true;
      }
      return /[^ \f\n\r\t\v]/.test(child2.raw) || !/\n/.test(child2.raw);
    });
    if (children.length) {
      var c = (this.openingElement || this.openingFragment).end;
      var i;
      for (i = 0; i < children.length; i += 1) {
        var child = children[i];
        if (child.type === "JSXExpressionContainer" && child.expression.type === "JSXEmptyExpression")
          ;
        else {
          var tail = code.original[c] === "\n" && child.type !== "JSXText" ? "" : " ";
          code.appendLeft(c, "," + tail);
        }
        if (child.type === "JSXText") {
          var str = normalise(child.value, i === children.length - 1);
          code.overwrite(child.start, child.end, str);
        }
        c = child.end;
      }
    }
  };
  return JSXElement2;
}(Node);
var JSXExpressionContainer = /* @__PURE__ */ function(Node5) {
  function JSXExpressionContainer2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    JSXExpressionContainer2.__proto__ = Node5;
  JSXExpressionContainer2.prototype = Object.create(Node5 && Node5.prototype);
  JSXExpressionContainer2.prototype.constructor = JSXExpressionContainer2;
  JSXExpressionContainer2.prototype.transpile = function transpile2(code, transforms) {
    code.remove(this.start, this.expression.start);
    code.remove(this.expression.end, this.end);
    Node5.prototype.transpile.call(this, code, transforms);
  };
  return JSXExpressionContainer2;
}(Node);
var JSXFragment = /* @__PURE__ */ function(JSXElement2) {
  function JSXFragment2() {
    JSXElement2.apply(this, arguments);
  }
  if (JSXElement2)
    JSXFragment2.__proto__ = JSXElement2;
  JSXFragment2.prototype = Object.create(JSXElement2 && JSXElement2.prototype);
  JSXFragment2.prototype.constructor = JSXFragment2;
  return JSXFragment2;
}(JSXElement);
var JSXOpeningElement = /* @__PURE__ */ function(Node5) {
  function JSXOpeningElement2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    JSXOpeningElement2.__proto__ = Node5;
  JSXOpeningElement2.prototype = Object.create(Node5 && Node5.prototype);
  JSXOpeningElement2.prototype.constructor = JSXOpeningElement2;
  JSXOpeningElement2.prototype.transpile = function transpile2(code, transforms) {
    Node5.prototype.transpile.call(this, code, transforms);
    code.overwrite(this.start, this.name.start, this.program.jsx + "( ");
    var html = this.name.type === "JSXIdentifier" && this.name.name[0] === this.name.name[0].toLowerCase();
    if (html) {
      code.prependRight(this.name.start, "'");
    }
    var len = this.attributes.length;
    var c = this.name.end;
    if (len) {
      var i;
      var hasSpread = false;
      for (i = 0; i < len; i += 1) {
        if (this.attributes[i].type === "JSXSpreadAttribute") {
          hasSpread = true;
          break;
        }
      }
      c = this.attributes[0].end;
      for (i = 0; i < len; i += 1) {
        var attr = this.attributes[i];
        if (i > 0) {
          if (attr.start === c) {
            code.prependRight(c, ", ");
          } else {
            code.overwrite(c, attr.start, ", ");
          }
        }
        if (hasSpread && attr.type !== "JSXSpreadAttribute") {
          var lastAttr = this.attributes[i - 1];
          var nextAttr = this.attributes[i + 1];
          if (!lastAttr || lastAttr.type === "JSXSpreadAttribute") {
            code.prependRight(attr.start, "{ ");
          }
          if (!nextAttr || nextAttr.type === "JSXSpreadAttribute") {
            code.appendLeft(attr.end, " }");
          }
        }
        c = attr.end;
      }
      var after;
      var before;
      if (hasSpread) {
        if (len === 1) {
          before = html ? "'," : ",";
        } else {
          if (!this.program.options.objectAssign) {
            throw new CompileError(
              "Mixed JSX attributes ending in spread requires specified objectAssign option with 'Object.assign' or polyfill helper.",
              this
            );
          }
          before = html ? "', " + this.program.options.objectAssign + "({}," : ", " + this.program.options.objectAssign + "({},";
          after = ")";
        }
      } else {
        before = html ? "', {" : ", {";
        after = " }";
      }
      code.prependRight(this.name.end, before);
      if (after) {
        code.appendLeft(this.attributes[len - 1].end, after);
      }
    } else {
      code.appendLeft(this.name.end, html ? "', null" : ", null");
      c = this.name.end;
    }
    if (this.selfClosing) {
      code.overwrite(c, this.end, this.attributes.length ? ")" : " )");
    } else {
      code.remove(c, this.end);
    }
  };
  return JSXOpeningElement2;
}(Node);
var JSXOpeningFragment = /* @__PURE__ */ function(Node5) {
  function JSXOpeningFragment2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    JSXOpeningFragment2.__proto__ = Node5;
  JSXOpeningFragment2.prototype = Object.create(Node5 && Node5.prototype);
  JSXOpeningFragment2.prototype.constructor = JSXOpeningFragment2;
  JSXOpeningFragment2.prototype.transpile = function transpile2(code) {
    code.overwrite(this.start, this.end, this.program.jsx + "( " + this.program.jsxFragment + ", null");
  };
  return JSXOpeningFragment2;
}(Node);
var JSXSpreadAttribute = /* @__PURE__ */ function(Node5) {
  function JSXSpreadAttribute2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    JSXSpreadAttribute2.__proto__ = Node5;
  JSXSpreadAttribute2.prototype = Object.create(Node5 && Node5.prototype);
  JSXSpreadAttribute2.prototype.constructor = JSXSpreadAttribute2;
  JSXSpreadAttribute2.prototype.transpile = function transpile2(code, transforms) {
    code.remove(this.start, this.argument.start);
    code.remove(this.argument.end, this.end);
    Node5.prototype.transpile.call(this, code, transforms);
  };
  return JSXSpreadAttribute2;
}(Node);
var nonAsciiLsOrPs = /[\u2028-\u2029]/g;
var Literal = /* @__PURE__ */ function(Node5) {
  function Literal2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    Literal2.__proto__ = Node5;
  Literal2.prototype = Object.create(Node5 && Node5.prototype);
  Literal2.prototype.constructor = Literal2;
  Literal2.prototype.initialise = function initialise2() {
    if (typeof this.value === "string") {
      this.program.indentExclusionElements.push(this);
    }
  };
  Literal2.prototype.transpile = function transpile2(code, transforms) {
    if (transforms.numericLiteral) {
      if (this.raw.match(/^0[bo]/i)) {
        code.overwrite(this.start, this.end, String(this.value), {
          storeName: true,
          contentOnly: true
        });
      }
    }
    if (this.regex) {
      var ref2 = this.regex;
      var pattern = ref2.pattern;
      var flags = ref2.flags;
      if (transforms.stickyRegExp && /y/.test(flags)) {
        CompileError.missingTransform("the regular expression sticky flag", "stickyRegExp", this);
      }
      if (transforms.unicodeRegExp && /u/.test(flags)) {
        code.overwrite(
          this.start,
          this.end,
          "/" + (0, import_regexpu_core.default)(pattern, flags) + "/" + flags.replace("u", ""),
          {
            contentOnly: true
          }
        );
      }
    } else if (typeof this.value === "string" && this.value.match(nonAsciiLsOrPs)) {
      code.overwrite(
        this.start,
        this.end,
        this.raw.replace(nonAsciiLsOrPs, function(m) {
          return m == "\u2028" ? "\\u2028" : "\\u2029";
        }),
        {
          contentOnly: true
        }
      );
    }
  };
  return Literal2;
}(Node);
var MemberExpression = /* @__PURE__ */ function(Node5) {
  function MemberExpression2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    MemberExpression2.__proto__ = Node5;
  MemberExpression2.prototype = Object.create(Node5 && Node5.prototype);
  MemberExpression2.prototype.constructor = MemberExpression2;
  MemberExpression2.prototype.transpile = function transpile2(code, transforms) {
    if (transforms.reservedProperties && reserved[this.property.name]) {
      code.overwrite(this.object.end, this.property.start, "['");
      code.appendLeft(this.property.end, "']");
    }
    Node5.prototype.transpile.call(this, code, transforms);
  };
  return MemberExpression2;
}(Node);
var NewExpression = /* @__PURE__ */ function(Node5) {
  function NewExpression2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    NewExpression2.__proto__ = Node5;
  NewExpression2.prototype = Object.create(Node5 && Node5.prototype);
  NewExpression2.prototype.constructor = NewExpression2;
  NewExpression2.prototype.initialise = function initialise2(transforms) {
    if (transforms.spreadRest && this.arguments.length) {
      var lexicalBoundary = this.findLexicalBoundary();
      var i = this.arguments.length;
      while (i--) {
        var arg = this.arguments[i];
        if (arg.type === "SpreadElement" && isArguments(arg.argument)) {
          this.argumentsArrayAlias = lexicalBoundary.getArgumentsArrayAlias();
          break;
        }
      }
    }
    Node5.prototype.initialise.call(this, transforms);
  };
  NewExpression2.prototype.transpile = function transpile2(code, transforms) {
    Node5.prototype.transpile.call(this, code, transforms);
    if (transforms.spreadRest && this.arguments.length) {
      inlineSpreads(code, this, this.arguments);
    }
    if (transforms.spreadRest && this.arguments.length) {
      var firstArgument = this.arguments[0];
      var isNew = true;
      var hasSpreadElements = spread(
        code,
        this.arguments,
        firstArgument.start,
        this.argumentsArrayAlias,
        isNew
      );
      if (hasSpreadElements) {
        code.prependRight(
          this.start + "new".length,
          " (Function.prototype.bind.apply("
        );
        code.overwrite(
          this.callee.end,
          firstArgument.start,
          ", [ null ].concat( "
        );
        code.appendLeft(this.end, " ))");
      }
    }
    if (this.arguments.length) {
      removeTrailingComma(code, this.arguments[this.arguments.length - 1].end);
    }
  };
  return NewExpression2;
}(Node);
var ObjectExpression = /* @__PURE__ */ function(Node5) {
  function ObjectExpression2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    ObjectExpression2.__proto__ = Node5;
  ObjectExpression2.prototype = Object.create(Node5 && Node5.prototype);
  ObjectExpression2.prototype.constructor = ObjectExpression2;
  ObjectExpression2.prototype.transpile = function transpile2(code, transforms) {
    var ref2;
    Node5.prototype.transpile.call(this, code, transforms);
    var firstPropertyStart = this.start + 1;
    var spreadPropertyCount = 0;
    var computedPropertyCount = 0;
    var firstSpreadProperty = null;
    var firstComputedProperty = null;
    for (var i = 0; i < this.properties.length; ++i) {
      var prop = this.properties[i];
      if (prop.type === "SpreadElement") {
        var argument = prop.argument;
        if (argument.type === "ObjectExpression" || argument.type === "Literal" && typeof argument.value !== "string") {
          if (argument.type === "ObjectExpression" && argument.properties.length > 0) {
            code.remove(prop.start, argument.properties[0].start);
            code.remove(argument.properties[argument.properties.length - 1].end, prop.end);
            (ref2 = this.properties).splice.apply(ref2, [i, 1].concat(argument.properties));
            i--;
          } else {
            code.remove(prop.start, i === this.properties.length - 1 ? prop.end : this.properties[i + 1].start);
            this.properties.splice(i, 1);
            i--;
          }
        } else {
          spreadPropertyCount += 1;
          if (firstSpreadProperty === null) {
            firstSpreadProperty = i;
          }
        }
      } else if (prop.computed && transforms.computedProperty) {
        computedPropertyCount += 1;
        if (firstComputedProperty === null) {
          firstComputedProperty = i;
        }
      }
    }
    if (spreadPropertyCount && !transforms.objectRestSpread && !(computedPropertyCount && transforms.computedProperty)) {
      spreadPropertyCount = 0;
      firstSpreadProperty = null;
    } else if (spreadPropertyCount) {
      if (!this.program.options.objectAssign) {
        throw new CompileError(
          "Object spread operator requires specified objectAssign option with 'Object.assign' or polyfill helper.",
          this
        );
      }
      var i$1 = this.properties.length;
      while (i$1--) {
        var prop$1 = this.properties[i$1];
        if (prop$1.type === "Property" && !computedPropertyCount) {
          var lastProp = this.properties[i$1 - 1];
          var nextProp = this.properties[i$1 + 1];
          if (!lastProp || lastProp.type !== "Property") {
            code.prependRight(prop$1.start, "{");
          }
          if (!nextProp || nextProp.type !== "Property") {
            code.appendLeft(prop$1.end, "}");
          }
        }
        if (prop$1.type === "SpreadElement") {
          code.remove(prop$1.start, prop$1.argument.start);
          code.remove(prop$1.argument.end, prop$1.end);
        }
      }
      firstPropertyStart = this.properties[0].start;
      if (!computedPropertyCount) {
        code.overwrite(
          this.start,
          firstPropertyStart,
          this.program.options.objectAssign + "({}, "
        );
        code.overwrite(
          this.properties[this.properties.length - 1].end,
          this.end,
          ")"
        );
      } else if (this.properties[0].type === "SpreadElement") {
        code.overwrite(
          this.start,
          firstPropertyStart,
          this.program.options.objectAssign + "({}, "
        );
        code.remove(this.end - 1, this.end);
        code.appendRight(this.end, ")");
      } else {
        code.prependLeft(this.start, this.program.options.objectAssign + "(");
        code.appendRight(this.end, ")");
      }
    }
    if (computedPropertyCount && transforms.computedProperty) {
      var i0 = this.getIndentation();
      var isSimpleAssignment;
      var name;
      if (this.parent.type === "VariableDeclarator" && this.parent.parent.declarations.length === 1 && this.parent.id.type === "Identifier") {
        isSimpleAssignment = true;
        name = this.parent.id.alias || this.parent.id.name;
      } else if (this.parent.type === "AssignmentExpression" && this.parent.parent.type === "ExpressionStatement" && this.parent.left.type === "Identifier") {
        isSimpleAssignment = true;
        name = this.parent.left.alias || this.parent.left.name;
      } else if (this.parent.type === "AssignmentPattern" && this.parent.left.type === "Identifier") {
        isSimpleAssignment = true;
        name = this.parent.left.alias || this.parent.left.name;
      }
      if (spreadPropertyCount) {
        isSimpleAssignment = false;
      }
      name = this.findScope(false).resolveName(name);
      var start = firstPropertyStart;
      var end = this.end;
      if (isSimpleAssignment)
        ;
      else {
        if (firstSpreadProperty === null || firstComputedProperty < firstSpreadProperty) {
          name = this.findScope(true).createDeclaration("obj");
          code.prependRight(this.start, "( " + name + " = ");
        } else {
          name = null;
        }
      }
      var len = this.properties.length;
      var lastComputedProp;
      var sawNonComputedProperty = false;
      var isFirst = true;
      for (var i$2 = 0; i$2 < len; i$2 += 1) {
        var prop$2 = this.properties[i$2];
        var moveStart = i$2 > 0 ? this.properties[i$2 - 1].end : start;
        if (prop$2.type === "Property" && (prop$2.computed || lastComputedProp && !spreadPropertyCount)) {
          if (i$2 === 0) {
            moveStart = this.start + 1;
          }
          lastComputedProp = prop$2;
          if (!name) {
            name = this.findScope(true).createDeclaration("obj");
            var propId = name + (prop$2.computed ? "" : ".");
            code.appendRight(prop$2.start, "( " + name + " = {}, " + propId);
          } else {
            var propId$1 = (isSimpleAssignment ? ";\n" + i0 + name : ", " + name) + (prop$2.key.type === "Literal" || prop$2.computed ? "" : ".");
            if (moveStart < prop$2.start) {
              code.overwrite(moveStart, prop$2.start, propId$1);
            } else {
              code.prependRight(prop$2.start, propId$1);
            }
          }
          var c = prop$2.key.end;
          if (prop$2.computed) {
            while (code.original[c] !== "]") {
              c += 1;
            }
            c += 1;
          }
          if (prop$2.key.type === "Literal" && !prop$2.computed) {
            code.overwrite(
              prop$2.start,
              prop$2.value.start,
              "[" + code.slice(prop$2.start, prop$2.key.end) + "] = "
            );
          } else if (prop$2.shorthand || prop$2.method && !prop$2.computed && transforms.conciseMethodProperty) {
            code.overwrite(
              prop$2.key.start,
              prop$2.key.end,
              code.slice(prop$2.key.start, prop$2.key.end).replace(/:/, " =")
            );
          } else {
            if (prop$2.value.start > c) {
              code.remove(c, prop$2.value.start);
            }
            code.prependLeft(c, " = ");
          }
          if (prop$2.method && (prop$2.computed || !transforms.conciseMethodProperty)) {
            if (prop$2.value.generator) {
              code.remove(prop$2.start, prop$2.key.start);
            }
            code.prependRight(prop$2.value.start, "function" + (prop$2.value.generator ? "*" : "") + " ");
          }
        } else if (prop$2.type === "SpreadElement") {
          if (name && i$2 > 0) {
            if (!lastComputedProp) {
              lastComputedProp = this.properties[i$2 - 1];
            }
            code.appendLeft(lastComputedProp.end, ", " + name + " )");
            lastComputedProp = null;
            name = null;
          }
        } else {
          if (!isFirst && spreadPropertyCount) {
            code.prependRight(prop$2.start, "{");
            code.appendLeft(prop$2.end, "}");
          }
          sawNonComputedProperty = true;
        }
        if (isFirst && (prop$2.type === "SpreadElement" || prop$2.computed)) {
          var beginEnd = sawNonComputedProperty ? this.properties[this.properties.length - 1].end : this.end - 1;
          if (code.original[beginEnd] == ",") {
            ++beginEnd;
          }
          var closing = code.slice(beginEnd, end);
          code.prependLeft(moveStart, closing);
          code.remove(beginEnd, end);
          isFirst = false;
        }
        var c$1 = prop$2.end;
        if (i$2 < len - 1 && !sawNonComputedProperty) {
          while (code.original[c$1] !== ",") {
            c$1 += 1;
          }
        } else if (i$2 == len - 1) {
          c$1 = this.end;
        }
        if (prop$2.end != c$1) {
          code.overwrite(prop$2.end, c$1, "", { contentOnly: true });
        }
      }
      if (!isSimpleAssignment && name) {
        code.appendLeft(lastComputedProp.end, ", " + name + " )");
      }
    }
  };
  return ObjectExpression2;
}(Node);
var Property2 = /* @__PURE__ */ function(Node5) {
  function Property3() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    Property3.__proto__ = Node5;
  Property3.prototype = Object.create(Node5 && Node5.prototype);
  Property3.prototype.constructor = Property3;
  Property3.prototype.initialise = function initialise2(transforms) {
    if ((this.kind === "get" || this.kind === "set") && transforms.getterSetter) {
      CompileError.missingTransform("getters and setters", "getterSetter", this);
    }
    Node5.prototype.initialise.call(this, transforms);
  };
  Property3.prototype.transpile = function transpile2(code, transforms) {
    Node5.prototype.transpile.call(this, code, transforms);
    if (transforms.conciseMethodProperty && !this.computed && this.parent.type !== "ObjectPattern") {
      if (this.shorthand) {
        code.prependRight(this.start, this.key.name + ": ");
      } else if (this.method) {
        var name = "";
        if (this.program.options.namedFunctionExpressions !== false) {
          if (this.key.type === "Literal" && typeof this.key.value === "number") {
            name = "";
          } else if (this.key.type === "Identifier") {
            if (reserved[this.key.name] || !/^[a-z_$][a-z0-9_$]*$/i.test(this.key.name) || this.value.body.scope.references[this.key.name]) {
              name = this.findScope(true).createIdentifier(this.key.name);
            } else {
              name = this.key.name;
            }
          } else {
            name = this.findScope(true).createIdentifier(this.key.value);
          }
          name = " " + name;
        }
        if (this.start < this.key.start) {
          code.remove(this.start, this.key.start);
        }
        code.appendLeft(
          this.key.end,
          ": " + (this.value.async ? "async " : "") + "function" + (this.value.generator ? "*" : "") + name
        );
      }
    }
    if (transforms.reservedProperties && reserved[this.key.name]) {
      code.prependRight(this.key.start, "'");
      code.appendLeft(this.key.end, "'");
    }
  };
  return Property3;
}(Node);
var ReturnStatement = /* @__PURE__ */ function(Node5) {
  function ReturnStatement2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    ReturnStatement2.__proto__ = Node5;
  ReturnStatement2.prototype = Object.create(Node5 && Node5.prototype);
  ReturnStatement2.prototype.constructor = ReturnStatement2;
  ReturnStatement2.prototype.initialise = function initialise2(transforms) {
    this.loop = this.findNearest(loopStatement);
    this.nearestFunction = this.findNearest(/Function/);
    if (this.loop && (!this.nearestFunction || this.loop.depth > this.nearestFunction.depth)) {
      this.loop.canReturn = true;
      this.shouldWrap = true;
    }
    if (this.argument) {
      this.argument.initialise(transforms);
    }
  };
  ReturnStatement2.prototype.transpile = function transpile2(code, transforms) {
    var shouldWrap = this.shouldWrap && this.loop && this.loop.shouldRewriteAsFunction;
    if (this.argument) {
      if (shouldWrap) {
        code.prependRight(this.argument.start, "{ v: ");
      }
      this.argument.transpile(code, transforms);
      if (shouldWrap) {
        code.appendLeft(this.argument.end, " }");
      }
    } else if (shouldWrap) {
      code.appendLeft(this.start + 6, " {}");
    }
  };
  return ReturnStatement2;
}(Node);
var Super = /* @__PURE__ */ function(Node5) {
  function Super2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    Super2.__proto__ = Node5;
  Super2.prototype = Object.create(Node5 && Node5.prototype);
  Super2.prototype.constructor = Super2;
  Super2.prototype.initialise = function initialise2(transforms) {
    if (transforms.classes) {
      this.method = this.findNearest("MethodDefinition");
      if (!this.method) {
        throw new CompileError("use of super outside class method", this);
      }
      var parentClass = this.findNearest("ClassBody").parent;
      this.superClassName = parentClass.superClass && (parentClass.superClass.name || "superclass");
      if (!this.superClassName) {
        throw new CompileError("super used in base class", this);
      }
      this.isCalled = this.parent.type === "CallExpression" && this === this.parent.callee;
      if (this.method.kind !== "constructor" && this.isCalled) {
        throw new CompileError(
          "super() not allowed outside class constructor",
          this
        );
      }
      this.isMember = this.parent.type === "MemberExpression";
      if (!this.isCalled && !this.isMember) {
        throw new CompileError(
          "Unexpected use of `super` (expected `super(...)` or `super.*`)",
          this
        );
      }
    }
    if (transforms.arrow) {
      var lexicalBoundary = this.findLexicalBoundary();
      var arrowFunction = this.findNearest("ArrowFunctionExpression");
      var loop = this.findNearest(loopStatement);
      if (arrowFunction && arrowFunction.depth > lexicalBoundary.depth) {
        this.thisAlias = lexicalBoundary.getThisAlias();
      }
      if (loop && loop.body.contains(this) && loop.depth > lexicalBoundary.depth) {
        this.thisAlias = lexicalBoundary.getThisAlias();
      }
    }
  };
  Super2.prototype.transpile = function transpile2(code, transforms) {
    if (transforms.classes) {
      var expression = this.isCalled || this.method.static ? this.superClassName : this.superClassName + ".prototype";
      code.overwrite(this.start, this.end, expression, {
        storeName: true,
        contentOnly: true
      });
      var callExpression = this.isCalled ? this.parent : this.parent.parent;
      if (callExpression && callExpression.type === "CallExpression") {
        if (!this.noCall) {
          code.appendLeft(callExpression.callee.end, ".call");
        }
        var thisAlias = this.thisAlias || "this";
        if (callExpression.arguments.length) {
          code.appendLeft(callExpression.arguments[0].start, thisAlias + ", ");
        } else {
          code.appendLeft(callExpression.end - 1, "" + thisAlias);
        }
      }
    }
  };
  return Super2;
}(Node);
var TaggedTemplateExpression = /* @__PURE__ */ function(Node5) {
  function TaggedTemplateExpression2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    TaggedTemplateExpression2.__proto__ = Node5;
  TaggedTemplateExpression2.prototype = Object.create(Node5 && Node5.prototype);
  TaggedTemplateExpression2.prototype.constructor = TaggedTemplateExpression2;
  TaggedTemplateExpression2.prototype.initialise = function initialise2(transforms) {
    if (transforms.templateString && !transforms.dangerousTaggedTemplateString) {
      CompileError.missingTransform(
        "tagged template strings",
        "templateString",
        this,
        "dangerousTaggedTemplateString"
      );
    }
    Node5.prototype.initialise.call(this, transforms);
  };
  TaggedTemplateExpression2.prototype.transpile = function transpile2(code, transforms) {
    if (transforms.templateString && transforms.dangerousTaggedTemplateString) {
      var ordered = this.quasi.expressions.concat(this.quasi.quasis).sort(function(a, b) {
        return a.start - b.start;
      });
      var program = this.program;
      var rootScope = program.body.scope;
      var templateStrings = this.quasi.quasis.map(
        function(quasi) {
          return JSON.stringify(quasi.value.cooked);
        }
      ).join(", ");
      var templateObject = this.program.templateLiteralQuasis[templateStrings];
      if (!templateObject) {
        templateObject = rootScope.createIdentifier("templateObject");
        code.prependLeft(this.program.prependAt, "var " + templateObject + " = Object.freeze([" + templateStrings + "]);\n");
        this.program.templateLiteralQuasis[templateStrings] = templateObject;
      }
      code.overwrite(
        this.tag.end,
        ordered[0].start,
        "(" + templateObject
      );
      var lastIndex = ordered[0].start;
      ordered.forEach(function(node) {
        if (node.type === "TemplateElement") {
          code.remove(lastIndex, node.end);
        } else {
          code.overwrite(lastIndex, node.start, ", ");
        }
        lastIndex = node.end;
      });
      code.overwrite(lastIndex, this.end, ")");
    }
    Node5.prototype.transpile.call(this, code, transforms);
  };
  return TaggedTemplateExpression2;
}(Node);
var TemplateElement = /* @__PURE__ */ function(Node5) {
  function TemplateElement2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    TemplateElement2.__proto__ = Node5;
  TemplateElement2.prototype = Object.create(Node5 && Node5.prototype);
  TemplateElement2.prototype.constructor = TemplateElement2;
  TemplateElement2.prototype.initialise = function initialise2() {
    this.program.indentExclusionElements.push(this);
  };
  return TemplateElement2;
}(Node);
var TemplateLiteral = /* @__PURE__ */ function(Node5) {
  function TemplateLiteral2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    TemplateLiteral2.__proto__ = Node5;
  TemplateLiteral2.prototype = Object.create(Node5 && Node5.prototype);
  TemplateLiteral2.prototype.constructor = TemplateLiteral2;
  TemplateLiteral2.prototype.transpile = function transpile2(code, transforms) {
    Node5.prototype.transpile.call(this, code, transforms);
    if (transforms.templateString && this.parent.type !== "TaggedTemplateExpression") {
      var ordered = this.expressions.concat(this.quasis).sort(function(a, b) {
        return a.start - b.start || a.end - b.end;
      }).filter(function(node, i) {
        if (node.type !== "TemplateElement") {
          return true;
        }
        if (node.value.raw) {
          return true;
        }
        return !i;
      });
      if (ordered.length >= 3) {
        var first = ordered[0];
        var third = ordered[2];
        if (first.type === "TemplateElement" && first.value.raw === "" && third.type === "TemplateElement") {
          ordered.shift();
        }
      }
      var parenthesise = (this.quasis.length !== 1 || this.expressions.length !== 0) && this.parent.type !== "TemplateLiteral" && this.parent.type !== "AssignmentExpression" && this.parent.type !== "AssignmentPattern" && this.parent.type !== "VariableDeclarator" && (this.parent.type !== "BinaryExpression" || this.parent.operator !== "+");
      if (parenthesise) {
        code.appendRight(this.start, "(");
      }
      var lastIndex = this.start;
      ordered.forEach(function(node, i) {
        var prefix = i === 0 ? parenthesise ? "(" : "" : " + ";
        if (node.type === "TemplateElement") {
          code.overwrite(
            lastIndex,
            node.end,
            prefix + JSON.stringify(node.value.cooked)
          );
        } else {
          var parenthesise$1 = node.type !== "Identifier";
          if (parenthesise$1) {
            prefix += "(";
          }
          code.remove(lastIndex, node.start);
          if (prefix) {
            code.prependRight(node.start, prefix);
          }
          if (parenthesise$1) {
            code.appendLeft(node.end, ")");
          }
        }
        lastIndex = node.end;
      });
      if (parenthesise) {
        code.appendLeft(lastIndex, ")");
      }
      code.overwrite(lastIndex, this.end, "", { contentOnly: true });
    }
  };
  return TemplateLiteral2;
}(Node);
var ThisExpression = /* @__PURE__ */ function(Node5) {
  function ThisExpression2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    ThisExpression2.__proto__ = Node5;
  ThisExpression2.prototype = Object.create(Node5 && Node5.prototype);
  ThisExpression2.prototype.constructor = ThisExpression2;
  ThisExpression2.prototype.initialise = function initialise2(transforms) {
    var lexicalBoundary = this.findLexicalBoundary();
    if (transforms.letConst) {
      var node = this.findNearest(loopStatement);
      while (node && node.depth > lexicalBoundary.depth) {
        node.thisRefs.push(this);
        node = node.parent.findNearest(loopStatement);
      }
    }
    if (transforms.arrow) {
      var arrowFunction = this.findNearest("ArrowFunctionExpression");
      if (arrowFunction && arrowFunction.depth > lexicalBoundary.depth) {
        this.alias = lexicalBoundary.getThisAlias();
      }
    }
  };
  ThisExpression2.prototype.transpile = function transpile2(code) {
    if (this.alias) {
      code.overwrite(this.start, this.end, this.alias, {
        storeName: true,
        contentOnly: true
      });
    }
  };
  return ThisExpression2;
}(Node);
var UpdateExpression = /* @__PURE__ */ function(Node5) {
  function UpdateExpression2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    UpdateExpression2.__proto__ = Node5;
  UpdateExpression2.prototype = Object.create(Node5 && Node5.prototype);
  UpdateExpression2.prototype.constructor = UpdateExpression2;
  UpdateExpression2.prototype.initialise = function initialise2(transforms) {
    if (this.argument.type === "Identifier") {
      var declaration = this.findScope(false).findDeclaration(
        this.argument.name
      );
      var statement = declaration && declaration.node.ancestor(3);
      if (statement && statement.type === "ForStatement" && statement.body.contains(this)) {
        statement.reassigned[this.argument.name] = true;
      }
    }
    Node5.prototype.initialise.call(this, transforms);
  };
  UpdateExpression2.prototype.transpile = function transpile2(code, transforms) {
    if (this.argument.type === "Identifier") {
      checkConst(this.argument, this.findScope(false));
    }
    Node5.prototype.transpile.call(this, code, transforms);
  };
  return UpdateExpression2;
}(Node);
var VariableDeclaration = /* @__PURE__ */ function(Node5) {
  function VariableDeclaration2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    VariableDeclaration2.__proto__ = Node5;
  VariableDeclaration2.prototype = Object.create(Node5 && Node5.prototype);
  VariableDeclaration2.prototype.constructor = VariableDeclaration2;
  VariableDeclaration2.prototype.initialise = function initialise2(transforms) {
    this.scope = this.findScope(this.kind === "var");
    this.declarations.forEach(function(declarator) {
      return declarator.initialise(transforms);
    });
  };
  VariableDeclaration2.prototype.transpile = function transpile2(code, transforms) {
    var this$1 = this;
    var i0 = this.getIndentation();
    var kind = this.kind;
    if (transforms.letConst && kind !== "var") {
      kind = "var";
      code.overwrite(this.start, this.start + this.kind.length, kind, {
        contentOnly: true,
        storeName: true
      });
    }
    if (transforms.destructuring && this.parent.type !== "ForOfStatement" && this.parent.type !== "ForInStatement") {
      var c = this.start;
      var lastDeclaratorIsPattern;
      this.declarations.forEach(function(declarator, i) {
        declarator.transpile(code, transforms);
        if (declarator.id.type === "Identifier") {
          if (i > 0 && this$1.declarations[i - 1].id.type !== "Identifier") {
            code.overwrite(c, declarator.id.start, "var ");
          }
        } else {
          var inline = loopStatement.test(this$1.parent.type);
          if (i === 0) {
            code.remove(c, declarator.id.start);
          } else {
            code.overwrite(c, declarator.id.start, ";\n" + i0);
          }
          var simple = declarator.init.type === "Identifier" && !declarator.init.rewritten;
          var name = simple ? declarator.init.alias || declarator.init.name : declarator.findScope(true).createIdentifier("ref");
          c = declarator.start;
          var statementGenerators = [];
          if (simple) {
            code.remove(declarator.id.end, declarator.end);
          } else {
            statementGenerators.push(function(start, prefix2, suffix2) {
              code.prependRight(declarator.id.end, "var " + name);
              code.appendLeft(declarator.init.end, "" + suffix2);
              code.move(declarator.id.end, declarator.end, start);
            });
          }
          var scope = declarator.findScope(false);
          destructure(
            code,
            function(id) {
              return scope.createIdentifier(id);
            },
            function(ref2) {
              var name2 = ref2.name;
              return scope.resolveName(name2);
            },
            declarator.id,
            name,
            inline,
            statementGenerators
          );
          var prefix = inline ? "var " : "";
          var suffix = inline ? ", " : ";\n" + i0;
          statementGenerators.forEach(function(fn, j) {
            if (i === this$1.declarations.length - 1 && j === statementGenerators.length - 1) {
              suffix = inline ? "" : ";";
            }
            fn(declarator.start, j === 0 ? prefix : "", suffix);
          });
        }
        c = declarator.end;
        lastDeclaratorIsPattern = declarator.id.type !== "Identifier";
      });
      if (lastDeclaratorIsPattern && this.end > c) {
        code.overwrite(c, this.end, "", { contentOnly: true });
      }
    } else {
      this.declarations.forEach(function(declarator) {
        declarator.transpile(code, transforms);
      });
    }
  };
  return VariableDeclaration2;
}(Node);
var VariableDeclarator = /* @__PURE__ */ function(Node5) {
  function VariableDeclarator2() {
    Node5.apply(this, arguments);
  }
  if (Node5)
    VariableDeclarator2.__proto__ = Node5;
  VariableDeclarator2.prototype = Object.create(Node5 && Node5.prototype);
  VariableDeclarator2.prototype.constructor = VariableDeclarator2;
  VariableDeclarator2.prototype.initialise = function initialise2(transforms) {
    var kind = this.parent.kind;
    if (kind === "let" && this.parent.parent.type === "ForStatement") {
      kind = "for.let";
    }
    this.parent.scope.addDeclaration(this.id, kind);
    Node5.prototype.initialise.call(this, transforms);
  };
  VariableDeclarator2.prototype.transpile = function transpile2(code, transforms) {
    if (!this.init && transforms.letConst && this.parent.kind !== "var") {
      var inLoop = this.findNearest(
        /Function|^For(In|Of)?Statement|^(?:Do)?WhileStatement/
      );
      if (inLoop && !/Function/.test(inLoop.type) && !this.isLeftDeclaratorOfLoop()) {
        code.appendLeft(this.id.end, " = (void 0)");
      }
    }
    if (this.id) {
      this.id.transpile(code, transforms);
    }
    if (this.init) {
      this.init.transpile(code, transforms);
    }
  };
  VariableDeclarator2.prototype.isLeftDeclaratorOfLoop = function isLeftDeclaratorOfLoop() {
    return this.parent && this.parent.type === "VariableDeclaration" && this.parent.parent && (this.parent.parent.type === "ForInStatement" || this.parent.parent.type === "ForOfStatement") && this.parent.parent.left && this.parent.parent.left.declarations[0] === this;
  };
  return VariableDeclarator2;
}(Node);
var types = {
  ArrayExpression,
  ArrowFunctionExpression,
  AssignmentExpression,
  AwaitExpression,
  BinaryExpression,
  BreakStatement,
  CallExpression,
  CatchClause,
  ClassBody,
  ClassDeclaration,
  ClassExpression,
  ContinueStatement,
  DoWhileStatement: LoopStatement,
  ExportNamedDeclaration,
  ExportDefaultDeclaration,
  ForStatement,
  ForInStatement,
  ForOfStatement,
  FunctionDeclaration,
  FunctionExpression,
  Identifier: Identifier2,
  IfStatement,
  Import,
  ImportDeclaration,
  ImportDefaultSpecifier,
  ImportSpecifier,
  JSXAttribute,
  JSXClosingElement,
  JSXClosingFragment,
  JSXElement,
  JSXExpressionContainer,
  JSXFragment,
  JSXOpeningElement,
  JSXOpeningFragment,
  JSXSpreadAttribute,
  Literal,
  MemberExpression,
  NewExpression,
  ObjectExpression,
  Property: Property2,
  ReturnStatement,
  Super,
  TaggedTemplateExpression,
  TemplateElement,
  TemplateLiteral,
  ThisExpression,
  UpdateExpression,
  VariableDeclaration,
  VariableDeclarator,
  WhileStatement: LoopStatement
};
var keys = {
  Program: ["body"],
  Literal: []
};
var statementsWithBlocks = {
  IfStatement: "consequent",
  ForStatement: "body",
  ForInStatement: "body",
  ForOfStatement: "body",
  WhileStatement: "body",
  DoWhileStatement: "body",
  ArrowFunctionExpression: "body"
};
function wrap(raw, parent) {
  if (!raw) {
    return;
  }
  if ("length" in raw) {
    var i = raw.length;
    while (i--) {
      wrap(raw[i], parent);
    }
    return;
  }
  if (raw.__wrapped) {
    return;
  }
  raw.__wrapped = true;
  if (!keys[raw.type]) {
    keys[raw.type] = Object.keys(raw).filter(
      function(key2) {
        return typeof raw[key2] === "object";
      }
    );
  }
  var bodyType = statementsWithBlocks[raw.type];
  if (bodyType && raw[bodyType].type !== "BlockStatement") {
    var expression = raw[bodyType];
    raw[bodyType] = {
      start: expression.start,
      end: expression.end,
      type: "BlockStatement",
      body: [expression],
      synthetic: true
    };
  }
  raw.parent = parent;
  raw.program = parent.program || parent;
  raw.depth = parent.depth + 1;
  raw.keys = keys[raw.type];
  raw.indentation = void 0;
  for (var i$1 = 0, list = keys[raw.type]; i$1 < list.length; i$1 += 1) {
    var key = list[i$1];
    wrap(raw[key], raw);
  }
  raw.program.magicString.addSourcemapLocation(raw.start);
  raw.program.magicString.addSourcemapLocation(raw.end);
  var type = (raw.type === "BlockStatement" ? BlockStatement : types[raw.type]) || Node;
  raw.__proto__ = type.prototype;
}
function Program(source, ast, transforms, options) {
  this.type = "Root";
  this.jsx = options.jsx || "React.createElement";
  this.jsxFragment = options.jsxFragment || "React.Fragment";
  this.options = options;
  this.source = source;
  this.magicString = new MagicString(source);
  this.ast = ast;
  this.depth = 0;
  wrap(this.body = ast, this);
  this.body.__proto__ = BlockStatement.prototype;
  this.templateLiteralQuasis = /* @__PURE__ */ Object.create(null);
  for (var i = 0; i < this.body.body.length; ++i) {
    if (!this.body.body[i].directive) {
      this.prependAt = this.body.body[i].start;
      break;
    }
  }
  this.objectWithoutPropertiesHelper = null;
  this.indentExclusionElements = [];
  this.body.initialise(transforms);
  this.indentExclusions = /* @__PURE__ */ Object.create(null);
  for (var i$2 = 0, list = this.indentExclusionElements; i$2 < list.length; i$2 += 1) {
    var node = list[i$2];
    for (var i$1 = node.start; i$1 < node.end; i$1 += 1) {
      this.indentExclusions[i$1] = true;
    }
  }
  this.body.transpile(this.magicString, transforms);
}
Program.prototype = {
  export: function export$1(options) {
    if (options === void 0)
      options = {};
    return {
      code: this.magicString.toString(),
      map: this.magicString.generateMap({
        file: options.file,
        source: options.source,
        includeContent: options.includeContent !== false
      })
    };
  },
  findNearest: function findNearest2() {
    return null;
  },
  findScope: function findScope2() {
    return null;
  },
  getObjectWithoutPropertiesHelper: function getObjectWithoutPropertiesHelper(code) {
    if (!this.objectWithoutPropertiesHelper) {
      this.objectWithoutPropertiesHelper = this.body.scope.createIdentifier("objectWithoutProperties");
      code.prependLeft(
        this.prependAt,
        "function " + this.objectWithoutPropertiesHelper + " (obj, exclude) { var target = {}; for (var k in obj) if (Object.prototype.hasOwnProperty.call(obj, k) && exclude.indexOf(k) === -1) target[k] = obj[k]; return target; }\n"
      );
    }
    return this.objectWithoutPropertiesHelper;
  }
};
var matrix = {
  chrome: {
    48: 610719,
    49: 652287,
    50: 783359,
    51: 783359,
    52: 1045503,
    53: 1045503,
    54: 1045503,
    55: 3142655,
    56: 3142655,
    57: 3142655,
    58: 4191231,
    59: 4191231,
    60: 8385535,
    61: 8385535,
    62: 8385535,
    63: 8385535,
    64: 8385535,
    65: 8385535,
    66: 8385535,
    67: 8385535,
    68: 8385535,
    69: 8385535,
    70: 8385535,
    71: 8385535
  },
  firefox: {
    43: 643515,
    44: 643515,
    45: 643519,
    46: 774591,
    47: 774655,
    48: 774655,
    49: 774655,
    50: 774655,
    51: 775167,
    52: 4191231,
    53: 4191231,
    54: 4191231,
    55: 8385535,
    56: 8385535,
    57: 8385535,
    58: 8385535,
    59: 8385535,
    60: 8385535,
    61: 8385535,
    62: 8385535,
    63: 8385535,
    64: 8385535
  },
  safari: {
    8: 524297,
    9: 594141,
    10: 1831935,
    "10.1": 4191231,
    11: 4191231,
    "11.1": 8385535,
    12: 8385535
  },
  ie: {
    8: 0,
    9: 524289,
    10: 524289,
    11: 524289
    // no let/const in for loops
  },
  edge: {
    12: 610459,
    13: 774559,
    14: 2085887,
    15: 4183039,
    16: 4183039,
    17: 4183039,
    18: 4183039,
    19: 4183039
  },
  node: {
    "0.10": 524289,
    "0.12": 524417,
    4: 594335,
    5: 594335,
    6: 783359,
    8: 4191231,
    "8.3": 8385535,
    "8.7": 8385535,
    "8.10": 8385535
  }
};
var features = [
  "getterSetter",
  "arrow",
  "classes",
  "computedProperty",
  "conciseMethodProperty",
  "defaultParameter",
  "destructuring",
  "forOf",
  "generator",
  "letConst",
  "moduleExport",
  "moduleImport",
  "numericLiteral",
  "parameterDestructuring",
  "spreadRest",
  "stickyRegExp",
  "templateString",
  "unicodeRegExp",
  // ES2016
  "exponentiation",
  // additional transforms, not from
  // https://featuretests.io
  "reservedProperties",
  "trailingFunctionCommas",
  "asyncAwait",
  "objectRestSpread"
];
var parser = import_acorn.Parser.extend(import_acorn_dynamic_import.default, (0, import_acorn_jsx.default)());
var dangerousTransforms = ["dangerousTaggedTemplateString", "dangerousForOf"];
function target(target2) {
  var targets = Object.keys(target2);
  var bitmask = targets.length ? 8388607 : 524289;
  Object.keys(target2).forEach(function(environment) {
    var versions = matrix[environment];
    if (!versions) {
      throw new Error(
        "Unknown environment '" + environment + "'. Please raise an issue at https://github.com/bublejs/buble/issues"
      );
    }
    var targetVersion = target2[environment];
    if (!(targetVersion in versions)) {
      throw new Error(
        "Support data exists for the following versions of " + environment + ": " + Object.keys(
          versions
        ).join(
          ", "
        ) + ". Please raise an issue at https://github.com/bublejs/buble/issues"
      );
    }
    var support = versions[targetVersion];
    bitmask &= support;
  });
  var transforms = /* @__PURE__ */ Object.create(null);
  features.forEach(function(name, i) {
    transforms[name] = !(bitmask & 1 << i);
  });
  dangerousTransforms.forEach(function(name) {
    transforms[name] = false;
  });
  return transforms;
}
function transform(source, options) {
  if (options === void 0)
    options = {};
  var ast;
  var jsx = null;
  try {
    ast = parser.parse(source, {
      ecmaVersion: 10,
      preserveParens: true,
      sourceType: "module",
      allowAwaitOutsideFunction: true,
      allowReturnOutsideFunction: true,
      allowHashBang: true,
      onComment: function(block, text) {
        if (!jsx) {
          var match = /@jsx\s+([^\s]+)/.exec(text);
          if (match) {
            jsx = match[1];
          }
        }
      }
    });
    options.jsx = jsx || options.jsx;
  } catch (err) {
    err.snippet = getSnippet(source, err.loc);
    err.toString = function() {
      return err.name + ": " + err.message + "\n" + err.snippet;
    };
    throw err;
  }
  var transforms = target(options.target || {});
  Object.keys(options.transforms || {}).forEach(function(name) {
    if (name === "modules") {
      if (!("moduleImport" in options.transforms)) {
        transforms.moduleImport = options.transforms.modules;
      }
      if (!("moduleExport" in options.transforms)) {
        transforms.moduleExport = options.transforms.modules;
      }
      return;
    }
    if (!(name in transforms)) {
      throw new Error("Unknown transform '" + name + "'");
    }
    transforms[name] = options.transforms[name];
  });
  if (options.objectAssign === true) {
    options.objectAssign = "Object.assign";
  }
  return new Program(source, ast, transforms, options).export(options);
}

// node_modules/eval5/node_modules/acorn/dist/acorn.mjs
var reservedWords = {
  3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",
  5: "class enum extends super const export import",
  6: "enum",
  strict: "implements interface let package private protected public static yield",
  strictBind: "eval arguments"
};
var ecma5AndLessKeywords = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this";
var keywords = {
  5: ecma5AndLessKeywords,
  "5module": ecma5AndLessKeywords + " export import",
  6: ecma5AndLessKeywords + " const class extends export import super"
};
var keywordRelationalOperator = /^in(stanceof)?$/;
var nonASCIIidentifierStartChars = "\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08C7\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\u9FFC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7BF\uA7C2-\uA7CA\uA7F5-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC";
var nonASCIIidentifierChars = "\u200C\u200D\xB7\u0300-\u036F\u0387\u0483-\u0487\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u0669\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u06F0-\u06F9\u0711\u0730-\u074A\u07A6-\u07B0\u07C0-\u07C9\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D3-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0966-\u096F\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09E6-\u09EF\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A66-\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AE6-\u0AEF\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B55-\u0B57\u0B62\u0B63\u0B66-\u0B6F\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0BE6-\u0BEF\u0C00-\u0C04\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0CE6-\u0CEF\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D66-\u0D6F\u0D81-\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0E50-\u0E59\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECD\u0ED0-\u0ED9\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1040-\u1049\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F-\u109D\u135D-\u135F\u1369-\u1371\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u18A9\u1920-\u192B\u1930-\u193B\u1946-\u194F\u19D0-\u19DA\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AB0-\u1ABD\u1ABF\u1AC0\u1B00-\u1B04\u1B34-\u1B44\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BB0-\u1BB9\u1BE6-\u1BF3\u1C24-\u1C37\u1C40-\u1C49\u1C50-\u1C59\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DF9\u1DFB-\u1DFF\u203F\u2040\u2054\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA620-\uA629\uA66F\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA82C\uA880\uA881\uA8B4-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F1\uA8FF-\uA909\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9D0-\uA9D9\uA9E5\uA9F0-\uA9F9\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA50-\uAA59\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uABF0-\uABF9\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFF10-\uFF19\uFF3F";
var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");
nonASCIIidentifierStartChars = nonASCIIidentifierChars = null;
var astralIdentifierStartCodes = [0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 14, 29, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 19, 35, 5, 35, 5, 39, 9, 51, 157, 310, 10, 21, 11, 7, 153, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11, 25, 71, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 28, 43, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14, 50, 14, 35, 349, 41, 7, 1, 79, 28, 11, 0, 9, 21, 107, 20, 28, 22, 13, 52, 76, 44, 33, 24, 27, 35, 30, 0, 3, 0, 9, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 85, 6, 2, 0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 19, 0, 13, 4, 159, 52, 19, 3, 21, 2, 31, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0, 60, 42, 14, 0, 72, 26, 230, 43, 117, 63, 32, 7, 3, 0, 3, 7, 2, 1, 2, 23, 16, 0, 2, 0, 95, 7, 3, 38, 17, 0, 2, 0, 29, 0, 11, 39, 8, 0, 22, 0, 12, 45, 20, 0, 35, 56, 264, 8, 2, 36, 18, 0, 50, 29, 113, 6, 2, 1, 2, 37, 22, 0, 26, 5, 2, 1, 2, 31, 15, 0, 328, 18, 190, 0, 80, 921, 103, 110, 18, 195, 2749, 1070, 4050, 582, 8634, 568, 8, 30, 114, 29, 19, 47, 17, 3, 32, 20, 6, 18, 689, 63, 129, 74, 6, 0, 67, 12, 65, 1, 2, 0, 29, 6135, 9, 1237, 43, 8, 8952, 286, 50, 2, 18, 3, 9, 395, 2309, 106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 2357, 44, 11, 6, 17, 0, 370, 43, 1301, 196, 60, 67, 8, 0, 1205, 3, 2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42717, 35, 4148, 12, 221, 3, 5761, 15, 7472, 3104, 541, 1507, 4938];
var astralIdentifierCodes = [509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 574, 3, 9, 9, 370, 1, 154, 10, 176, 2, 54, 14, 32, 9, 16, 3, 46, 10, 54, 9, 7, 2, 37, 13, 2, 9, 6, 1, 45, 0, 13, 2, 49, 13, 9, 3, 2, 11, 83, 11, 7, 0, 161, 11, 6, 9, 7, 3, 56, 1, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 193, 17, 10, 9, 5, 0, 82, 19, 13, 9, 214, 6, 3, 8, 28, 1, 83, 16, 16, 9, 82, 12, 9, 9, 84, 14, 5, 9, 243, 14, 166, 9, 71, 5, 2, 1, 3, 3, 2, 0, 2, 1, 13, 9, 120, 6, 3, 6, 4, 0, 29, 9, 41, 6, 2, 3, 9, 0, 10, 10, 47, 15, 406, 7, 2, 7, 17, 9, 57, 21, 2, 13, 123, 5, 4, 0, 2, 1, 2, 6, 2, 0, 9, 9, 49, 4, 2, 1, 2, 4, 9, 9, 330, 3, 19306, 9, 135, 4, 60, 6, 26, 9, 1014, 0, 2, 54, 8, 3, 82, 0, 12, 1, 19628, 1, 5319, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 513, 54, 5, 49, 9, 0, 15, 0, 23, 4, 2, 14, 1361, 6, 2, 16, 3, 6, 2, 1, 2, 4, 262, 6, 10, 9, 419, 13, 1495, 6, 110, 6, 6, 9, 4759, 9, 787719, 239];
function isInAstralSet(code, set) {
  var pos = 65536;
  for (var i = 0; i < set.length; i += 2) {
    pos += set[i];
    if (pos > code) {
      return false;
    }
    pos += set[i + 1];
    if (pos >= code) {
      return true;
    }
  }
}
function isIdentifierStart(code, astral) {
  if (code < 65) {
    return code === 36;
  }
  if (code < 91) {
    return true;
  }
  if (code < 97) {
    return code === 95;
  }
  if (code < 123) {
    return true;
  }
  if (code <= 65535) {
    return code >= 170 && nonASCIIidentifierStart.test(String.fromCharCode(code));
  }
  if (astral === false) {
    return false;
  }
  return isInAstralSet(code, astralIdentifierStartCodes);
}
function isIdentifierChar(code, astral) {
  if (code < 48) {
    return code === 36;
  }
  if (code < 58) {
    return true;
  }
  if (code < 65) {
    return false;
  }
  if (code < 91) {
    return true;
  }
  if (code < 97) {
    return code === 95;
  }
  if (code < 123) {
    return true;
  }
  if (code <= 65535) {
    return code >= 170 && nonASCIIidentifier.test(String.fromCharCode(code));
  }
  if (astral === false) {
    return false;
  }
  return isInAstralSet(code, astralIdentifierStartCodes) || isInAstralSet(code, astralIdentifierCodes);
}
var TokenType = function TokenType2(label, conf) {
  if (conf === void 0)
    conf = {};
  this.label = label;
  this.keyword = conf.keyword;
  this.beforeExpr = !!conf.beforeExpr;
  this.startsExpr = !!conf.startsExpr;
  this.isLoop = !!conf.isLoop;
  this.isAssign = !!conf.isAssign;
  this.prefix = !!conf.prefix;
  this.postfix = !!conf.postfix;
  this.binop = conf.binop || null;
  this.updateContext = null;
};
function binop(name, prec) {
  return new TokenType(name, { beforeExpr: true, binop: prec });
}
var beforeExpr = { beforeExpr: true };
var startsExpr = { startsExpr: true };
var keywords$1 = {};
function kw(name, options) {
  if (options === void 0)
    options = {};
  options.keyword = name;
  return keywords$1[name] = new TokenType(name, options);
}
var types2 = {
  num: new TokenType("num", startsExpr),
  regexp: new TokenType("regexp", startsExpr),
  string: new TokenType("string", startsExpr),
  name: new TokenType("name", startsExpr),
  eof: new TokenType("eof"),
  // Punctuation token types.
  bracketL: new TokenType("[", { beforeExpr: true, startsExpr: true }),
  bracketR: new TokenType("]"),
  braceL: new TokenType("{", { beforeExpr: true, startsExpr: true }),
  braceR: new TokenType("}"),
  parenL: new TokenType("(", { beforeExpr: true, startsExpr: true }),
  parenR: new TokenType(")"),
  comma: new TokenType(",", beforeExpr),
  semi: new TokenType(";", beforeExpr),
  colon: new TokenType(":", beforeExpr),
  dot: new TokenType("."),
  question: new TokenType("?", beforeExpr),
  questionDot: new TokenType("?."),
  arrow: new TokenType("=>", beforeExpr),
  template: new TokenType("template"),
  invalidTemplate: new TokenType("invalidTemplate"),
  ellipsis: new TokenType("...", beforeExpr),
  backQuote: new TokenType("`", startsExpr),
  dollarBraceL: new TokenType("${", { beforeExpr: true, startsExpr: true }),
  // Operators. These carry several kinds of properties to help the
  // parser use them properly (the presence of these properties is
  // what categorizes them as operators).
  //
  // `binop`, when present, specifies that this operator is a binary
  // operator, and will refer to its precedence.
  //
  // `prefix` and `postfix` mark the operator as a prefix or postfix
  // unary operator.
  //
  // `isAssign` marks all of `=`, `+=`, `-=` etcetera, which act as
  // binary operators with a very low precedence, that should result
  // in AssignmentExpression nodes.
  eq: new TokenType("=", { beforeExpr: true, isAssign: true }),
  assign: new TokenType("_=", { beforeExpr: true, isAssign: true }),
  incDec: new TokenType("++/--", { prefix: true, postfix: true, startsExpr: true }),
  prefix: new TokenType("!/~", { beforeExpr: true, prefix: true, startsExpr: true }),
  logicalOR: binop("||", 1),
  logicalAND: binop("&&", 2),
  bitwiseOR: binop("|", 3),
  bitwiseXOR: binop("^", 4),
  bitwiseAND: binop("&", 5),
  equality: binop("==/!=/===/!==", 6),
  relational: binop("</>/<=/>=", 7),
  bitShift: binop("<</>>/>>>", 8),
  plusMin: new TokenType("+/-", { beforeExpr: true, binop: 9, prefix: true, startsExpr: true }),
  modulo: binop("%", 10),
  star: binop("*", 10),
  slash: binop("/", 10),
  starstar: new TokenType("**", { beforeExpr: true }),
  coalesce: binop("??", 1),
  // Keyword token types.
  _break: kw("break"),
  _case: kw("case", beforeExpr),
  _catch: kw("catch"),
  _continue: kw("continue"),
  _debugger: kw("debugger"),
  _default: kw("default", beforeExpr),
  _do: kw("do", { isLoop: true, beforeExpr: true }),
  _else: kw("else", beforeExpr),
  _finally: kw("finally"),
  _for: kw("for", { isLoop: true }),
  _function: kw("function", startsExpr),
  _if: kw("if"),
  _return: kw("return", beforeExpr),
  _switch: kw("switch"),
  _throw: kw("throw", beforeExpr),
  _try: kw("try"),
  _var: kw("var"),
  _const: kw("const"),
  _while: kw("while", { isLoop: true }),
  _with: kw("with"),
  _new: kw("new", { beforeExpr: true, startsExpr: true }),
  _this: kw("this", startsExpr),
  _super: kw("super", startsExpr),
  _class: kw("class", startsExpr),
  _extends: kw("extends", beforeExpr),
  _export: kw("export"),
  _import: kw("import", startsExpr),
  _null: kw("null", startsExpr),
  _true: kw("true", startsExpr),
  _false: kw("false", startsExpr),
  _in: kw("in", { beforeExpr: true, binop: 7 }),
  _instanceof: kw("instanceof", { beforeExpr: true, binop: 7 }),
  _typeof: kw("typeof", { beforeExpr: true, prefix: true, startsExpr: true }),
  _void: kw("void", { beforeExpr: true, prefix: true, startsExpr: true }),
  _delete: kw("delete", { beforeExpr: true, prefix: true, startsExpr: true })
};
var lineBreak = /\r\n?|\n|\u2028|\u2029/;
var lineBreakG = new RegExp(lineBreak.source, "g");
function isNewLine(code, ecma2019String) {
  return code === 10 || code === 13 || !ecma2019String && (code === 8232 || code === 8233);
}
var nonASCIIwhitespace = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/;
var skipWhiteSpace = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g;
var ref = Object.prototype;
var hasOwnProperty = ref.hasOwnProperty;
var toString7 = ref.toString;
function has2(obj, propName) {
  return hasOwnProperty.call(obj, propName);
}
var isArray = Array.isArray || function(obj) {
  return toString7.call(obj) === "[object Array]";
};
function wordsRegexp(words) {
  return new RegExp("^(?:" + words.replace(/ /g, "|") + ")$");
}
var Position = function Position2(line, col) {
  this.line = line;
  this.column = col;
};
Position.prototype.offset = function offset(n2) {
  return new Position(this.line, this.column + n2);
};
var SourceLocation = function SourceLocation2(p, start, end) {
  this.start = start;
  this.end = end;
  if (p.sourceFile !== null) {
    this.source = p.sourceFile;
  }
};
function getLineInfo(input, offset2) {
  for (var line = 1, cur = 0; ; ) {
    lineBreakG.lastIndex = cur;
    var match = lineBreakG.exec(input);
    if (match && match.index < offset2) {
      ++line;
      cur = match.index + match[0].length;
    } else {
      return new Position(line, offset2 - cur);
    }
  }
}
var defaultOptions = {
  // `ecmaVersion` indicates the ECMAScript version to parse. Must be
  // either 3, 5, 6 (2015), 7 (2016), 8 (2017), 9 (2018), or 10
  // (2019). This influences support for strict mode, the set of
  // reserved words, and support for new syntax features. The default
  // is 10.
  ecmaVersion: 10,
  // `sourceType` indicates the mode the code should be parsed in.
  // Can be either `"script"` or `"module"`. This influences global
  // strict mode and parsing of `import` and `export` declarations.
  sourceType: "script",
  // `onInsertedSemicolon` can be a callback that will be called
  // when a semicolon is automatically inserted. It will be passed
  // the position of the comma as an offset, and if `locations` is
  // enabled, it is given the location as a `{line, column}` object
  // as second argument.
  onInsertedSemicolon: null,
  // `onTrailingComma` is similar to `onInsertedSemicolon`, but for
  // trailing commas.
  onTrailingComma: null,
  // By default, reserved words are only enforced if ecmaVersion >= 5.
  // Set `allowReserved` to a boolean value to explicitly turn this on
  // an off. When this option has the value "never", reserved words
  // and keywords can also not be used as property names.
  allowReserved: null,
  // When enabled, a return at the top level is not considered an
  // error.
  allowReturnOutsideFunction: false,
  // When enabled, import/export statements are not constrained to
  // appearing at the top of the program.
  allowImportExportEverywhere: false,
  // When enabled, await identifiers are allowed to appear at the top-level scope,
  // but they are still not allowed in non-async functions.
  allowAwaitOutsideFunction: false,
  // When enabled, hashbang directive in the beginning of file
  // is allowed and treated as a line comment.
  allowHashBang: false,
  // When `locations` is on, `loc` properties holding objects with
  // `start` and `end` properties in `{line, column}` form (with
  // line being 1-based and column 0-based) will be attached to the
  // nodes.
  locations: false,
  // A function can be passed as `onToken` option, which will
  // cause Acorn to call that function with object in the same
  // format as tokens returned from `tokenizer().getToken()`. Note
  // that you are not allowed to call the parser from the
  // callback—that will corrupt its internal state.
  onToken: null,
  // A function can be passed as `onComment` option, which will
  // cause Acorn to call that function with `(block, text, start,
  // end)` parameters whenever a comment is skipped. `block` is a
  // boolean indicating whether this is a block (`/* */`) comment,
  // `text` is the content of the comment, and `start` and `end` are
  // character offsets that denote the start and end of the comment.
  // When the `locations` option is on, two more parameters are
  // passed, the full `{line, column}` locations of the start and
  // end of the comments. Note that you are not allowed to call the
  // parser from the callback—that will corrupt its internal state.
  onComment: null,
  // Nodes have their start and end characters offsets recorded in
  // `start` and `end` properties (directly on the node, rather than
  // the `loc` object, which holds line/column data. To also add a
  // [semi-standardized][range] `range` property holding a `[start,
  // end]` array with the same numbers, set the `ranges` option to
  // `true`.
  //
  // [range]: https://bugzilla.mozilla.org/show_bug.cgi?id=745678
  ranges: false,
  // It is possible to parse multiple files into a single AST by
  // passing the tree produced by parsing the first file as
  // `program` option in subsequent parses. This will add the
  // toplevel forms of the parsed file to the `Program` (top) node
  // of an existing parse tree.
  program: null,
  // When `locations` is on, you can pass this to record the source
  // file in every node's `loc` object.
  sourceFile: null,
  // This value, if given, is stored in every node, whether
  // `locations` is on or off.
  directSourceFile: null,
  // When enabled, parenthesized expressions are represented by
  // (non-standard) ParenthesizedExpression nodes
  preserveParens: false
};
function getOptions(opts) {
  var options = {};
  for (var opt in defaultOptions) {
    options[opt] = opts && has2(opts, opt) ? opts[opt] : defaultOptions[opt];
  }
  if (options.ecmaVersion >= 2015) {
    options.ecmaVersion -= 2009;
  }
  if (options.allowReserved == null) {
    options.allowReserved = options.ecmaVersion < 5;
  }
  if (isArray(options.onToken)) {
    var tokens = options.onToken;
    options.onToken = function(token) {
      return tokens.push(token);
    };
  }
  if (isArray(options.onComment)) {
    options.onComment = pushComment(options, options.onComment);
  }
  return options;
}
function pushComment(options, array) {
  return function(block, text, start, end, startLoc, endLoc) {
    var comment = {
      type: block ? "Block" : "Line",
      value: text,
      start,
      end
    };
    if (options.locations) {
      comment.loc = new SourceLocation(this, startLoc, endLoc);
    }
    if (options.ranges) {
      comment.range = [start, end];
    }
    array.push(comment);
  };
}
var SCOPE_TOP = 1;
var SCOPE_FUNCTION = 2;
var SCOPE_VAR = SCOPE_TOP | SCOPE_FUNCTION;
var SCOPE_ASYNC = 4;
var SCOPE_GENERATOR = 8;
var SCOPE_ARROW = 16;
var SCOPE_SIMPLE_CATCH = 32;
var SCOPE_SUPER = 64;
var SCOPE_DIRECT_SUPER = 128;
function functionFlags(async, generator) {
  return SCOPE_FUNCTION | (async ? SCOPE_ASYNC : 0) | (generator ? SCOPE_GENERATOR : 0);
}
var BIND_NONE = 0;
var BIND_VAR = 1;
var BIND_LEXICAL = 2;
var BIND_FUNCTION = 3;
var BIND_SIMPLE_CATCH = 4;
var BIND_OUTSIDE = 5;
var Parser2 = function Parser3(options, input, startPos) {
  this.options = options = getOptions(options);
  this.sourceFile = options.sourceFile;
  this.keywords = wordsRegexp(keywords[options.ecmaVersion >= 6 ? 6 : options.sourceType === "module" ? "5module" : 5]);
  var reserved2 = "";
  if (options.allowReserved !== true) {
    for (var v = options.ecmaVersion; ; v--) {
      if (reserved2 = reservedWords[v]) {
        break;
      }
    }
    if (options.sourceType === "module") {
      reserved2 += " await";
    }
  }
  this.reservedWords = wordsRegexp(reserved2);
  var reservedStrict = (reserved2 ? reserved2 + " " : "") + reservedWords.strict;
  this.reservedWordsStrict = wordsRegexp(reservedStrict);
  this.reservedWordsStrictBind = wordsRegexp(reservedStrict + " " + reservedWords.strictBind);
  this.input = String(input);
  this.containsEsc = false;
  if (startPos) {
    this.pos = startPos;
    this.lineStart = this.input.lastIndexOf("\n", startPos - 1) + 1;
    this.curLine = this.input.slice(0, this.lineStart).split(lineBreak).length;
  } else {
    this.pos = this.lineStart = 0;
    this.curLine = 1;
  }
  this.type = types2.eof;
  this.value = null;
  this.start = this.end = this.pos;
  this.startLoc = this.endLoc = this.curPosition();
  this.lastTokEndLoc = this.lastTokStartLoc = null;
  this.lastTokStart = this.lastTokEnd = this.pos;
  this.context = this.initialContext();
  this.exprAllowed = true;
  this.inModule = options.sourceType === "module";
  this.strict = this.inModule || this.strictDirective(this.pos);
  this.potentialArrowAt = -1;
  this.yieldPos = this.awaitPos = this.awaitIdentPos = 0;
  this.labels = [];
  this.undefinedExports = {};
  if (this.pos === 0 && options.allowHashBang && this.input.slice(0, 2) === "#!") {
    this.skipLineComment(2);
  }
  this.scopeStack = [];
  this.enterScope(SCOPE_TOP);
  this.regexpState = null;
};
var prototypeAccessors = { inFunction: { configurable: true }, inGenerator: { configurable: true }, inAsync: { configurable: true }, allowSuper: { configurable: true }, allowDirectSuper: { configurable: true }, treatFunctionsAsVar: { configurable: true } };
Parser2.prototype.parse = function parse() {
  var node = this.options.program || this.startNode();
  this.nextToken();
  return this.parseTopLevel(node);
};
prototypeAccessors.inFunction.get = function() {
  return (this.currentVarScope().flags & SCOPE_FUNCTION) > 0;
};
prototypeAccessors.inGenerator.get = function() {
  return (this.currentVarScope().flags & SCOPE_GENERATOR) > 0;
};
prototypeAccessors.inAsync.get = function() {
  return (this.currentVarScope().flags & SCOPE_ASYNC) > 0;
};
prototypeAccessors.allowSuper.get = function() {
  return (this.currentThisScope().flags & SCOPE_SUPER) > 0;
};
prototypeAccessors.allowDirectSuper.get = function() {
  return (this.currentThisScope().flags & SCOPE_DIRECT_SUPER) > 0;
};
prototypeAccessors.treatFunctionsAsVar.get = function() {
  return this.treatFunctionsAsVarInScope(this.currentScope());
};
Parser2.prototype.inNonArrowFunction = function inNonArrowFunction() {
  return (this.currentThisScope().flags & SCOPE_FUNCTION) > 0;
};
Parser2.extend = function extend() {
  var plugins = [], len = arguments.length;
  while (len--)
    plugins[len] = arguments[len];
  var cls = this;
  for (var i = 0; i < plugins.length; i++) {
    cls = plugins[i](cls);
  }
  return cls;
};
Parser2.parse = function parse2(input, options) {
  return new this(options, input).parse();
};
Parser2.parseExpressionAt = function parseExpressionAt(input, pos, options) {
  var parser2 = new this(options, input, pos);
  parser2.nextToken();
  return parser2.parseExpression();
};
Parser2.tokenizer = function tokenizer(input, options) {
  return new this(options, input);
};
Object.defineProperties(Parser2.prototype, prototypeAccessors);
var pp = Parser2.prototype;
var literal = /^(?:'((?:\\.|[^'\\])*?)'|"((?:\\.|[^"\\])*?)")/;
pp.strictDirective = function(start) {
  for (; ; ) {
    skipWhiteSpace.lastIndex = start;
    start += skipWhiteSpace.exec(this.input)[0].length;
    var match = literal.exec(this.input.slice(start));
    if (!match) {
      return false;
    }
    if ((match[1] || match[2]) === "use strict") {
      skipWhiteSpace.lastIndex = start + match[0].length;
      var spaceAfter = skipWhiteSpace.exec(this.input), end = spaceAfter.index + spaceAfter[0].length;
      var next = this.input.charAt(end);
      return next === ";" || next === "}" || lineBreak.test(spaceAfter[0]) && !(/[(`.[+\-/*%<>=,?^&]/.test(next) || next === "!" && this.input.charAt(end + 1) === "=");
    }
    start += match[0].length;
    skipWhiteSpace.lastIndex = start;
    start += skipWhiteSpace.exec(this.input)[0].length;
    if (this.input[start] === ";") {
      start++;
    }
  }
};
pp.eat = function(type) {
  if (this.type === type) {
    this.next();
    return true;
  } else {
    return false;
  }
};
pp.isContextual = function(name) {
  return this.type === types2.name && this.value === name && !this.containsEsc;
};
pp.eatContextual = function(name) {
  if (!this.isContextual(name)) {
    return false;
  }
  this.next();
  return true;
};
pp.expectContextual = function(name) {
  if (!this.eatContextual(name)) {
    this.unexpected();
  }
};
pp.canInsertSemicolon = function() {
  return this.type === types2.eof || this.type === types2.braceR || lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
};
pp.insertSemicolon = function() {
  if (this.canInsertSemicolon()) {
    if (this.options.onInsertedSemicolon) {
      this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc);
    }
    return true;
  }
};
pp.semicolon = function() {
  if (!this.eat(types2.semi) && !this.insertSemicolon()) {
    this.unexpected();
  }
};
pp.afterTrailingComma = function(tokType, notNext) {
  if (this.type === tokType) {
    if (this.options.onTrailingComma) {
      this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc);
    }
    if (!notNext) {
      this.next();
    }
    return true;
  }
};
pp.expect = function(type) {
  this.eat(type) || this.unexpected();
};
pp.unexpected = function(pos) {
  this.raise(pos != null ? pos : this.start, "Unexpected token");
};
function DestructuringErrors() {
  this.shorthandAssign = this.trailingComma = this.parenthesizedAssign = this.parenthesizedBind = this.doubleProto = -1;
}
pp.checkPatternErrors = function(refDestructuringErrors, isAssign) {
  if (!refDestructuringErrors) {
    return;
  }
  if (refDestructuringErrors.trailingComma > -1) {
    this.raiseRecoverable(refDestructuringErrors.trailingComma, "Comma is not permitted after the rest element");
  }
  var parens = isAssign ? refDestructuringErrors.parenthesizedAssign : refDestructuringErrors.parenthesizedBind;
  if (parens > -1) {
    this.raiseRecoverable(parens, "Parenthesized pattern");
  }
};
pp.checkExpressionErrors = function(refDestructuringErrors, andThrow) {
  if (!refDestructuringErrors) {
    return false;
  }
  var shorthandAssign = refDestructuringErrors.shorthandAssign;
  var doubleProto = refDestructuringErrors.doubleProto;
  if (!andThrow) {
    return shorthandAssign >= 0 || doubleProto >= 0;
  }
  if (shorthandAssign >= 0) {
    this.raise(shorthandAssign, "Shorthand property assignments are valid only in destructuring patterns");
  }
  if (doubleProto >= 0) {
    this.raiseRecoverable(doubleProto, "Redefinition of __proto__ property");
  }
};
pp.checkYieldAwaitInDefaultParams = function() {
  if (this.yieldPos && (!this.awaitPos || this.yieldPos < this.awaitPos)) {
    this.raise(this.yieldPos, "Yield expression cannot be a default value");
  }
  if (this.awaitPos) {
    this.raise(this.awaitPos, "Await expression cannot be a default value");
  }
};
pp.isSimpleAssignTarget = function(expr) {
  if (expr.type === "ParenthesizedExpression") {
    return this.isSimpleAssignTarget(expr.expression);
  }
  return expr.type === "Identifier" || expr.type === "MemberExpression";
};
var pp$1 = Parser2.prototype;
pp$1.parseTopLevel = function(node) {
  var exports = {};
  if (!node.body) {
    node.body = [];
  }
  while (this.type !== types2.eof) {
    var stmt = this.parseStatement(null, true, exports);
    node.body.push(stmt);
  }
  if (this.inModule) {
    for (var i = 0, list = Object.keys(this.undefinedExports); i < list.length; i += 1) {
      var name = list[i];
      this.raiseRecoverable(this.undefinedExports[name].start, "Export '" + name + "' is not defined");
    }
  }
  this.adaptDirectivePrologue(node.body);
  this.next();
  node.sourceType = this.options.sourceType;
  return this.finishNode(node, "Program");
};
var loopLabel = { kind: "loop" };
var switchLabel = { kind: "switch" };
pp$1.isLet = function(context) {
  if (this.options.ecmaVersion < 6 || !this.isContextual("let")) {
    return false;
  }
  skipWhiteSpace.lastIndex = this.pos;
  var skip = skipWhiteSpace.exec(this.input);
  var next = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next);
  if (nextCh === 91) {
    return true;
  }
  if (context) {
    return false;
  }
  if (nextCh === 123) {
    return true;
  }
  if (isIdentifierStart(nextCh, true)) {
    var pos = next + 1;
    while (isIdentifierChar(this.input.charCodeAt(pos), true)) {
      ++pos;
    }
    var ident = this.input.slice(next, pos);
    if (!keywordRelationalOperator.test(ident)) {
      return true;
    }
  }
  return false;
};
pp$1.isAsyncFunction = function() {
  if (this.options.ecmaVersion < 8 || !this.isContextual("async")) {
    return false;
  }
  skipWhiteSpace.lastIndex = this.pos;
  var skip = skipWhiteSpace.exec(this.input);
  var next = this.pos + skip[0].length;
  return !lineBreak.test(this.input.slice(this.pos, next)) && this.input.slice(next, next + 8) === "function" && (next + 8 === this.input.length || !isIdentifierChar(this.input.charAt(next + 8)));
};
pp$1.parseStatement = function(context, topLevel, exports) {
  var starttype = this.type, node = this.startNode(), kind;
  if (this.isLet(context)) {
    starttype = types2._var;
    kind = "let";
  }
  switch (starttype) {
    case types2._break:
    case types2._continue:
      return this.parseBreakContinueStatement(node, starttype.keyword);
    case types2._debugger:
      return this.parseDebuggerStatement(node);
    case types2._do:
      return this.parseDoStatement(node);
    case types2._for:
      return this.parseForStatement(node);
    case types2._function:
      if (context && (this.strict || context !== "if" && context !== "label") && this.options.ecmaVersion >= 6) {
        this.unexpected();
      }
      return this.parseFunctionStatement(node, false, !context);
    case types2._class:
      if (context) {
        this.unexpected();
      }
      return this.parseClass(node, true);
    case types2._if:
      return this.parseIfStatement(node);
    case types2._return:
      return this.parseReturnStatement(node);
    case types2._switch:
      return this.parseSwitchStatement(node);
    case types2._throw:
      return this.parseThrowStatement(node);
    case types2._try:
      return this.parseTryStatement(node);
    case types2._const:
    case types2._var:
      kind = kind || this.value;
      if (context && kind !== "var") {
        this.unexpected();
      }
      return this.parseVarStatement(node, kind);
    case types2._while:
      return this.parseWhileStatement(node);
    case types2._with:
      return this.parseWithStatement(node);
    case types2.braceL:
      return this.parseBlock(true, node);
    case types2.semi:
      return this.parseEmptyStatement(node);
    case types2._export:
    case types2._import:
      if (this.options.ecmaVersion > 10 && starttype === types2._import) {
        skipWhiteSpace.lastIndex = this.pos;
        var skip = skipWhiteSpace.exec(this.input);
        var next = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next);
        if (nextCh === 40 || nextCh === 46) {
          return this.parseExpressionStatement(node, this.parseExpression());
        }
      }
      if (!this.options.allowImportExportEverywhere) {
        if (!topLevel) {
          this.raise(this.start, "'import' and 'export' may only appear at the top level");
        }
        if (!this.inModule) {
          this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'");
        }
      }
      return starttype === types2._import ? this.parseImport(node) : this.parseExport(node, exports);
    default:
      if (this.isAsyncFunction()) {
        if (context) {
          this.unexpected();
        }
        this.next();
        return this.parseFunctionStatement(node, true, !context);
      }
      var maybeName = this.value, expr = this.parseExpression();
      if (starttype === types2.name && expr.type === "Identifier" && this.eat(types2.colon)) {
        return this.parseLabeledStatement(node, maybeName, expr, context);
      } else {
        return this.parseExpressionStatement(node, expr);
      }
  }
};
pp$1.parseBreakContinueStatement = function(node, keyword) {
  var isBreak = keyword === "break";
  this.next();
  if (this.eat(types2.semi) || this.insertSemicolon()) {
    node.label = null;
  } else if (this.type !== types2.name) {
    this.unexpected();
  } else {
    node.label = this.parseIdent();
    this.semicolon();
  }
  var i = 0;
  for (; i < this.labels.length; ++i) {
    var lab = this.labels[i];
    if (node.label == null || lab.name === node.label.name) {
      if (lab.kind != null && (isBreak || lab.kind === "loop")) {
        break;
      }
      if (node.label && isBreak) {
        break;
      }
    }
  }
  if (i === this.labels.length) {
    this.raise(node.start, "Unsyntactic " + keyword);
  }
  return this.finishNode(node, isBreak ? "BreakStatement" : "ContinueStatement");
};
pp$1.parseDebuggerStatement = function(node) {
  this.next();
  this.semicolon();
  return this.finishNode(node, "DebuggerStatement");
};
pp$1.parseDoStatement = function(node) {
  this.next();
  this.labels.push(loopLabel);
  node.body = this.parseStatement("do");
  this.labels.pop();
  this.expect(types2._while);
  node.test = this.parseParenExpression();
  if (this.options.ecmaVersion >= 6) {
    this.eat(types2.semi);
  } else {
    this.semicolon();
  }
  return this.finishNode(node, "DoWhileStatement");
};
pp$1.parseForStatement = function(node) {
  this.next();
  var awaitAt = this.options.ecmaVersion >= 9 && (this.inAsync || !this.inFunction && this.options.allowAwaitOutsideFunction) && this.eatContextual("await") ? this.lastTokStart : -1;
  this.labels.push(loopLabel);
  this.enterScope(0);
  this.expect(types2.parenL);
  if (this.type === types2.semi) {
    if (awaitAt > -1) {
      this.unexpected(awaitAt);
    }
    return this.parseFor(node, null);
  }
  var isLet = this.isLet();
  if (this.type === types2._var || this.type === types2._const || isLet) {
    var init$1 = this.startNode(), kind = isLet ? "let" : this.value;
    this.next();
    this.parseVar(init$1, true, kind);
    this.finishNode(init$1, "VariableDeclaration");
    if ((this.type === types2._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) && init$1.declarations.length === 1) {
      if (this.options.ecmaVersion >= 9) {
        if (this.type === types2._in) {
          if (awaitAt > -1) {
            this.unexpected(awaitAt);
          }
        } else {
          node.await = awaitAt > -1;
        }
      }
      return this.parseForIn(node, init$1);
    }
    if (awaitAt > -1) {
      this.unexpected(awaitAt);
    }
    return this.parseFor(node, init$1);
  }
  var refDestructuringErrors = new DestructuringErrors();
  var init = this.parseExpression(true, refDestructuringErrors);
  if (this.type === types2._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) {
    if (this.options.ecmaVersion >= 9) {
      if (this.type === types2._in) {
        if (awaitAt > -1) {
          this.unexpected(awaitAt);
        }
      } else {
        node.await = awaitAt > -1;
      }
    }
    this.toAssignable(init, false, refDestructuringErrors);
    this.checkLVal(init);
    return this.parseForIn(node, init);
  } else {
    this.checkExpressionErrors(refDestructuringErrors, true);
  }
  if (awaitAt > -1) {
    this.unexpected(awaitAt);
  }
  return this.parseFor(node, init);
};
pp$1.parseFunctionStatement = function(node, isAsync, declarationPosition) {
  this.next();
  return this.parseFunction(node, FUNC_STATEMENT | (declarationPosition ? 0 : FUNC_HANGING_STATEMENT), false, isAsync);
};
pp$1.parseIfStatement = function(node) {
  this.next();
  node.test = this.parseParenExpression();
  node.consequent = this.parseStatement("if");
  node.alternate = this.eat(types2._else) ? this.parseStatement("if") : null;
  return this.finishNode(node, "IfStatement");
};
pp$1.parseReturnStatement = function(node) {
  if (!this.inFunction && !this.options.allowReturnOutsideFunction) {
    this.raise(this.start, "'return' outside of function");
  }
  this.next();
  if (this.eat(types2.semi) || this.insertSemicolon()) {
    node.argument = null;
  } else {
    node.argument = this.parseExpression();
    this.semicolon();
  }
  return this.finishNode(node, "ReturnStatement");
};
pp$1.parseSwitchStatement = function(node) {
  this.next();
  node.discriminant = this.parseParenExpression();
  node.cases = [];
  this.expect(types2.braceL);
  this.labels.push(switchLabel);
  this.enterScope(0);
  var cur;
  for (var sawDefault = false; this.type !== types2.braceR; ) {
    if (this.type === types2._case || this.type === types2._default) {
      var isCase = this.type === types2._case;
      if (cur) {
        this.finishNode(cur, "SwitchCase");
      }
      node.cases.push(cur = this.startNode());
      cur.consequent = [];
      this.next();
      if (isCase) {
        cur.test = this.parseExpression();
      } else {
        if (sawDefault) {
          this.raiseRecoverable(this.lastTokStart, "Multiple default clauses");
        }
        sawDefault = true;
        cur.test = null;
      }
      this.expect(types2.colon);
    } else {
      if (!cur) {
        this.unexpected();
      }
      cur.consequent.push(this.parseStatement(null));
    }
  }
  this.exitScope();
  if (cur) {
    this.finishNode(cur, "SwitchCase");
  }
  this.next();
  this.labels.pop();
  return this.finishNode(node, "SwitchStatement");
};
pp$1.parseThrowStatement = function(node) {
  this.next();
  if (lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) {
    this.raise(this.lastTokEnd, "Illegal newline after throw");
  }
  node.argument = this.parseExpression();
  this.semicolon();
  return this.finishNode(node, "ThrowStatement");
};
var empty = [];
pp$1.parseTryStatement = function(node) {
  this.next();
  node.block = this.parseBlock();
  node.handler = null;
  if (this.type === types2._catch) {
    var clause = this.startNode();
    this.next();
    if (this.eat(types2.parenL)) {
      clause.param = this.parseBindingAtom();
      var simple = clause.param.type === "Identifier";
      this.enterScope(simple ? SCOPE_SIMPLE_CATCH : 0);
      this.checkLVal(clause.param, simple ? BIND_SIMPLE_CATCH : BIND_LEXICAL);
      this.expect(types2.parenR);
    } else {
      if (this.options.ecmaVersion < 10) {
        this.unexpected();
      }
      clause.param = null;
      this.enterScope(0);
    }
    clause.body = this.parseBlock(false);
    this.exitScope();
    node.handler = this.finishNode(clause, "CatchClause");
  }
  node.finalizer = this.eat(types2._finally) ? this.parseBlock() : null;
  if (!node.handler && !node.finalizer) {
    this.raise(node.start, "Missing catch or finally clause");
  }
  return this.finishNode(node, "TryStatement");
};
pp$1.parseVarStatement = function(node, kind) {
  this.next();
  this.parseVar(node, false, kind);
  this.semicolon();
  return this.finishNode(node, "VariableDeclaration");
};
pp$1.parseWhileStatement = function(node) {
  this.next();
  node.test = this.parseParenExpression();
  this.labels.push(loopLabel);
  node.body = this.parseStatement("while");
  this.labels.pop();
  return this.finishNode(node, "WhileStatement");
};
pp$1.parseWithStatement = function(node) {
  if (this.strict) {
    this.raise(this.start, "'with' in strict mode");
  }
  this.next();
  node.object = this.parseParenExpression();
  node.body = this.parseStatement("with");
  return this.finishNode(node, "WithStatement");
};
pp$1.parseEmptyStatement = function(node) {
  this.next();
  return this.finishNode(node, "EmptyStatement");
};
pp$1.parseLabeledStatement = function(node, maybeName, expr, context) {
  for (var i$1 = 0, list = this.labels; i$1 < list.length; i$1 += 1) {
    var label = list[i$1];
    if (label.name === maybeName) {
      this.raise(expr.start, "Label '" + maybeName + "' is already declared");
    }
  }
  var kind = this.type.isLoop ? "loop" : this.type === types2._switch ? "switch" : null;
  for (var i = this.labels.length - 1; i >= 0; i--) {
    var label$1 = this.labels[i];
    if (label$1.statementStart === node.start) {
      label$1.statementStart = this.start;
      label$1.kind = kind;
    } else {
      break;
    }
  }
  this.labels.push({ name: maybeName, kind, statementStart: this.start });
  node.body = this.parseStatement(context ? context.indexOf("label") === -1 ? context + "label" : context : "label");
  this.labels.pop();
  node.label = expr;
  return this.finishNode(node, "LabeledStatement");
};
pp$1.parseExpressionStatement = function(node, expr) {
  node.expression = expr;
  this.semicolon();
  return this.finishNode(node, "ExpressionStatement");
};
pp$1.parseBlock = function(createNewLexicalScope, node, exitStrict) {
  if (createNewLexicalScope === void 0)
    createNewLexicalScope = true;
  if (node === void 0)
    node = this.startNode();
  node.body = [];
  this.expect(types2.braceL);
  if (createNewLexicalScope) {
    this.enterScope(0);
  }
  while (this.type !== types2.braceR) {
    var stmt = this.parseStatement(null);
    node.body.push(stmt);
  }
  if (exitStrict) {
    this.strict = false;
  }
  this.next();
  if (createNewLexicalScope) {
    this.exitScope();
  }
  return this.finishNode(node, "BlockStatement");
};
pp$1.parseFor = function(node, init) {
  node.init = init;
  this.expect(types2.semi);
  node.test = this.type === types2.semi ? null : this.parseExpression();
  this.expect(types2.semi);
  node.update = this.type === types2.parenR ? null : this.parseExpression();
  this.expect(types2.parenR);
  node.body = this.parseStatement("for");
  this.exitScope();
  this.labels.pop();
  return this.finishNode(node, "ForStatement");
};
pp$1.parseForIn = function(node, init) {
  var isForIn = this.type === types2._in;
  this.next();
  if (init.type === "VariableDeclaration" && init.declarations[0].init != null && (!isForIn || this.options.ecmaVersion < 8 || this.strict || init.kind !== "var" || init.declarations[0].id.type !== "Identifier")) {
    this.raise(
      init.start,
      (isForIn ? "for-in" : "for-of") + " loop variable declaration may not have an initializer"
    );
  } else if (init.type === "AssignmentPattern") {
    this.raise(init.start, "Invalid left-hand side in for-loop");
  }
  node.left = init;
  node.right = isForIn ? this.parseExpression() : this.parseMaybeAssign();
  this.expect(types2.parenR);
  node.body = this.parseStatement("for");
  this.exitScope();
  this.labels.pop();
  return this.finishNode(node, isForIn ? "ForInStatement" : "ForOfStatement");
};
pp$1.parseVar = function(node, isFor, kind) {
  node.declarations = [];
  node.kind = kind;
  for (; ; ) {
    var decl = this.startNode();
    this.parseVarId(decl, kind);
    if (this.eat(types2.eq)) {
      decl.init = this.parseMaybeAssign(isFor);
    } else if (kind === "const" && !(this.type === types2._in || this.options.ecmaVersion >= 6 && this.isContextual("of"))) {
      this.unexpected();
    } else if (decl.id.type !== "Identifier" && !(isFor && (this.type === types2._in || this.isContextual("of")))) {
      this.raise(this.lastTokEnd, "Complex binding patterns require an initialization value");
    } else {
      decl.init = null;
    }
    node.declarations.push(this.finishNode(decl, "VariableDeclarator"));
    if (!this.eat(types2.comma)) {
      break;
    }
  }
  return node;
};
pp$1.parseVarId = function(decl, kind) {
  decl.id = this.parseBindingAtom();
  this.checkLVal(decl.id, kind === "var" ? BIND_VAR : BIND_LEXICAL, false);
};
var FUNC_STATEMENT = 1;
var FUNC_HANGING_STATEMENT = 2;
var FUNC_NULLABLE_ID = 4;
pp$1.parseFunction = function(node, statement, allowExpressionBody, isAsync) {
  this.initFunction(node);
  if (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !isAsync) {
    if (this.type === types2.star && statement & FUNC_HANGING_STATEMENT) {
      this.unexpected();
    }
    node.generator = this.eat(types2.star);
  }
  if (this.options.ecmaVersion >= 8) {
    node.async = !!isAsync;
  }
  if (statement & FUNC_STATEMENT) {
    node.id = statement & FUNC_NULLABLE_ID && this.type !== types2.name ? null : this.parseIdent();
    if (node.id && !(statement & FUNC_HANGING_STATEMENT)) {
      this.checkLVal(node.id, this.strict || node.generator || node.async ? this.treatFunctionsAsVar ? BIND_VAR : BIND_LEXICAL : BIND_FUNCTION);
    }
  }
  var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
  this.yieldPos = 0;
  this.awaitPos = 0;
  this.awaitIdentPos = 0;
  this.enterScope(functionFlags(node.async, node.generator));
  if (!(statement & FUNC_STATEMENT)) {
    node.id = this.type === types2.name ? this.parseIdent() : null;
  }
  this.parseFunctionParams(node);
  this.parseFunctionBody(node, allowExpressionBody, false);
  this.yieldPos = oldYieldPos;
  this.awaitPos = oldAwaitPos;
  this.awaitIdentPos = oldAwaitIdentPos;
  return this.finishNode(node, statement & FUNC_STATEMENT ? "FunctionDeclaration" : "FunctionExpression");
};
pp$1.parseFunctionParams = function(node) {
  this.expect(types2.parenL);
  node.params = this.parseBindingList(types2.parenR, false, this.options.ecmaVersion >= 8);
  this.checkYieldAwaitInDefaultParams();
};
pp$1.parseClass = function(node, isStatement) {
  this.next();
  var oldStrict = this.strict;
  this.strict = true;
  this.parseClassId(node, isStatement);
  this.parseClassSuper(node);
  var classBody = this.startNode();
  var hadConstructor = false;
  classBody.body = [];
  this.expect(types2.braceL);
  while (this.type !== types2.braceR) {
    var element = this.parseClassElement(node.superClass !== null);
    if (element) {
      classBody.body.push(element);
      if (element.type === "MethodDefinition" && element.kind === "constructor") {
        if (hadConstructor) {
          this.raise(element.start, "Duplicate constructor in the same class");
        }
        hadConstructor = true;
      }
    }
  }
  this.strict = oldStrict;
  this.next();
  node.body = this.finishNode(classBody, "ClassBody");
  return this.finishNode(node, isStatement ? "ClassDeclaration" : "ClassExpression");
};
pp$1.parseClassElement = function(constructorAllowsSuper) {
  var this$1 = this;
  if (this.eat(types2.semi)) {
    return null;
  }
  var method = this.startNode();
  var tryContextual = function(k, noLineBreak) {
    if (noLineBreak === void 0)
      noLineBreak = false;
    var start = this$1.start, startLoc = this$1.startLoc;
    if (!this$1.eatContextual(k)) {
      return false;
    }
    if (this$1.type !== types2.parenL && (!noLineBreak || !this$1.canInsertSemicolon())) {
      return true;
    }
    if (method.key) {
      this$1.unexpected();
    }
    method.computed = false;
    method.key = this$1.startNodeAt(start, startLoc);
    method.key.name = k;
    this$1.finishNode(method.key, "Identifier");
    return false;
  };
  method.kind = "method";
  method.static = tryContextual("static");
  var isGenerator = this.eat(types2.star);
  var isAsync = false;
  if (!isGenerator) {
    if (this.options.ecmaVersion >= 8 && tryContextual("async", true)) {
      isAsync = true;
      isGenerator = this.options.ecmaVersion >= 9 && this.eat(types2.star);
    } else if (tryContextual("get")) {
      method.kind = "get";
    } else if (tryContextual("set")) {
      method.kind = "set";
    }
  }
  if (!method.key) {
    this.parsePropertyName(method);
  }
  var key = method.key;
  var allowsDirectSuper = false;
  if (!method.computed && !method.static && (key.type === "Identifier" && key.name === "constructor" || key.type === "Literal" && key.value === "constructor")) {
    if (method.kind !== "method") {
      this.raise(key.start, "Constructor can't have get/set modifier");
    }
    if (isGenerator) {
      this.raise(key.start, "Constructor can't be a generator");
    }
    if (isAsync) {
      this.raise(key.start, "Constructor can't be an async method");
    }
    method.kind = "constructor";
    allowsDirectSuper = constructorAllowsSuper;
  } else if (method.static && key.type === "Identifier" && key.name === "prototype") {
    this.raise(key.start, "Classes may not have a static property named prototype");
  }
  this.parseClassMethod(method, isGenerator, isAsync, allowsDirectSuper);
  if (method.kind === "get" && method.value.params.length !== 0) {
    this.raiseRecoverable(method.value.start, "getter should have no params");
  }
  if (method.kind === "set" && method.value.params.length !== 1) {
    this.raiseRecoverable(method.value.start, "setter should have exactly one param");
  }
  if (method.kind === "set" && method.value.params[0].type === "RestElement") {
    this.raiseRecoverable(method.value.params[0].start, "Setter cannot use rest params");
  }
  return method;
};
pp$1.parseClassMethod = function(method, isGenerator, isAsync, allowsDirectSuper) {
  method.value = this.parseMethod(isGenerator, isAsync, allowsDirectSuper);
  return this.finishNode(method, "MethodDefinition");
};
pp$1.parseClassId = function(node, isStatement) {
  if (this.type === types2.name) {
    node.id = this.parseIdent();
    if (isStatement) {
      this.checkLVal(node.id, BIND_LEXICAL, false);
    }
  } else {
    if (isStatement === true) {
      this.unexpected();
    }
    node.id = null;
  }
};
pp$1.parseClassSuper = function(node) {
  node.superClass = this.eat(types2._extends) ? this.parseExprSubscripts() : null;
};
pp$1.parseExport = function(node, exports) {
  this.next();
  if (this.eat(types2.star)) {
    if (this.options.ecmaVersion >= 11) {
      if (this.eatContextual("as")) {
        node.exported = this.parseIdent(true);
        this.checkExport(exports, node.exported.name, this.lastTokStart);
      } else {
        node.exported = null;
      }
    }
    this.expectContextual("from");
    if (this.type !== types2.string) {
      this.unexpected();
    }
    node.source = this.parseExprAtom();
    this.semicolon();
    return this.finishNode(node, "ExportAllDeclaration");
  }
  if (this.eat(types2._default)) {
    this.checkExport(exports, "default", this.lastTokStart);
    var isAsync;
    if (this.type === types2._function || (isAsync = this.isAsyncFunction())) {
      var fNode = this.startNode();
      this.next();
      if (isAsync) {
        this.next();
      }
      node.declaration = this.parseFunction(fNode, FUNC_STATEMENT | FUNC_NULLABLE_ID, false, isAsync);
    } else if (this.type === types2._class) {
      var cNode = this.startNode();
      node.declaration = this.parseClass(cNode, "nullableID");
    } else {
      node.declaration = this.parseMaybeAssign();
      this.semicolon();
    }
    return this.finishNode(node, "ExportDefaultDeclaration");
  }
  if (this.shouldParseExportStatement()) {
    node.declaration = this.parseStatement(null);
    if (node.declaration.type === "VariableDeclaration") {
      this.checkVariableExport(exports, node.declaration.declarations);
    } else {
      this.checkExport(exports, node.declaration.id.name, node.declaration.id.start);
    }
    node.specifiers = [];
    node.source = null;
  } else {
    node.declaration = null;
    node.specifiers = this.parseExportSpecifiers(exports);
    if (this.eatContextual("from")) {
      if (this.type !== types2.string) {
        this.unexpected();
      }
      node.source = this.parseExprAtom();
    } else {
      for (var i = 0, list = node.specifiers; i < list.length; i += 1) {
        var spec = list[i];
        this.checkUnreserved(spec.local);
        this.checkLocalExport(spec.local);
      }
      node.source = null;
    }
    this.semicolon();
  }
  return this.finishNode(node, "ExportNamedDeclaration");
};
pp$1.checkExport = function(exports, name, pos) {
  if (!exports) {
    return;
  }
  if (has2(exports, name)) {
    this.raiseRecoverable(pos, "Duplicate export '" + name + "'");
  }
  exports[name] = true;
};
pp$1.checkPatternExport = function(exports, pat) {
  var type = pat.type;
  if (type === "Identifier") {
    this.checkExport(exports, pat.name, pat.start);
  } else if (type === "ObjectPattern") {
    for (var i = 0, list = pat.properties; i < list.length; i += 1) {
      var prop = list[i];
      this.checkPatternExport(exports, prop);
    }
  } else if (type === "ArrayPattern") {
    for (var i$1 = 0, list$1 = pat.elements; i$1 < list$1.length; i$1 += 1) {
      var elt = list$1[i$1];
      if (elt) {
        this.checkPatternExport(exports, elt);
      }
    }
  } else if (type === "Property") {
    this.checkPatternExport(exports, pat.value);
  } else if (type === "AssignmentPattern") {
    this.checkPatternExport(exports, pat.left);
  } else if (type === "RestElement") {
    this.checkPatternExport(exports, pat.argument);
  } else if (type === "ParenthesizedExpression") {
    this.checkPatternExport(exports, pat.expression);
  }
};
pp$1.checkVariableExport = function(exports, decls) {
  if (!exports) {
    return;
  }
  for (var i = 0, list = decls; i < list.length; i += 1) {
    var decl = list[i];
    this.checkPatternExport(exports, decl.id);
  }
};
pp$1.shouldParseExportStatement = function() {
  return this.type.keyword === "var" || this.type.keyword === "const" || this.type.keyword === "class" || this.type.keyword === "function" || this.isLet() || this.isAsyncFunction();
};
pp$1.parseExportSpecifiers = function(exports) {
  var nodes = [], first = true;
  this.expect(types2.braceL);
  while (!this.eat(types2.braceR)) {
    if (!first) {
      this.expect(types2.comma);
      if (this.afterTrailingComma(types2.braceR)) {
        break;
      }
    } else {
      first = false;
    }
    var node = this.startNode();
    node.local = this.parseIdent(true);
    node.exported = this.eatContextual("as") ? this.parseIdent(true) : node.local;
    this.checkExport(exports, node.exported.name, node.exported.start);
    nodes.push(this.finishNode(node, "ExportSpecifier"));
  }
  return nodes;
};
pp$1.parseImport = function(node) {
  this.next();
  if (this.type === types2.string) {
    node.specifiers = empty;
    node.source = this.parseExprAtom();
  } else {
    node.specifiers = this.parseImportSpecifiers();
    this.expectContextual("from");
    node.source = this.type === types2.string ? this.parseExprAtom() : this.unexpected();
  }
  this.semicolon();
  return this.finishNode(node, "ImportDeclaration");
};
pp$1.parseImportSpecifiers = function() {
  var nodes = [], first = true;
  if (this.type === types2.name) {
    var node = this.startNode();
    node.local = this.parseIdent();
    this.checkLVal(node.local, BIND_LEXICAL);
    nodes.push(this.finishNode(node, "ImportDefaultSpecifier"));
    if (!this.eat(types2.comma)) {
      return nodes;
    }
  }
  if (this.type === types2.star) {
    var node$1 = this.startNode();
    this.next();
    this.expectContextual("as");
    node$1.local = this.parseIdent();
    this.checkLVal(node$1.local, BIND_LEXICAL);
    nodes.push(this.finishNode(node$1, "ImportNamespaceSpecifier"));
    return nodes;
  }
  this.expect(types2.braceL);
  while (!this.eat(types2.braceR)) {
    if (!first) {
      this.expect(types2.comma);
      if (this.afterTrailingComma(types2.braceR)) {
        break;
      }
    } else {
      first = false;
    }
    var node$2 = this.startNode();
    node$2.imported = this.parseIdent(true);
    if (this.eatContextual("as")) {
      node$2.local = this.parseIdent();
    } else {
      this.checkUnreserved(node$2.imported);
      node$2.local = node$2.imported;
    }
    this.checkLVal(node$2.local, BIND_LEXICAL);
    nodes.push(this.finishNode(node$2, "ImportSpecifier"));
  }
  return nodes;
};
pp$1.adaptDirectivePrologue = function(statements) {
  for (var i = 0; i < statements.length && this.isDirectiveCandidate(statements[i]); ++i) {
    statements[i].directive = statements[i].expression.raw.slice(1, -1);
  }
};
pp$1.isDirectiveCandidate = function(statement) {
  return statement.type === "ExpressionStatement" && statement.expression.type === "Literal" && typeof statement.expression.value === "string" && // Reject parenthesized strings.
  (this.input[statement.start] === '"' || this.input[statement.start] === "'");
};
var pp$2 = Parser2.prototype;
pp$2.toAssignable = function(node, isBinding, refDestructuringErrors) {
  if (this.options.ecmaVersion >= 6 && node) {
    switch (node.type) {
      case "Identifier":
        if (this.inAsync && node.name === "await") {
          this.raise(node.start, "Cannot use 'await' as identifier inside an async function");
        }
        break;
      case "ObjectPattern":
      case "ArrayPattern":
      case "RestElement":
        break;
      case "ObjectExpression":
        node.type = "ObjectPattern";
        if (refDestructuringErrors) {
          this.checkPatternErrors(refDestructuringErrors, true);
        }
        for (var i = 0, list = node.properties; i < list.length; i += 1) {
          var prop = list[i];
          this.toAssignable(prop, isBinding);
          if (prop.type === "RestElement" && (prop.argument.type === "ArrayPattern" || prop.argument.type === "ObjectPattern")) {
            this.raise(prop.argument.start, "Unexpected token");
          }
        }
        break;
      case "Property":
        if (node.kind !== "init") {
          this.raise(node.key.start, "Object pattern can't contain getter or setter");
        }
        this.toAssignable(node.value, isBinding);
        break;
      case "ArrayExpression":
        node.type = "ArrayPattern";
        if (refDestructuringErrors) {
          this.checkPatternErrors(refDestructuringErrors, true);
        }
        this.toAssignableList(node.elements, isBinding);
        break;
      case "SpreadElement":
        node.type = "RestElement";
        this.toAssignable(node.argument, isBinding);
        if (node.argument.type === "AssignmentPattern") {
          this.raise(node.argument.start, "Rest elements cannot have a default value");
        }
        break;
      case "AssignmentExpression":
        if (node.operator !== "=") {
          this.raise(node.left.end, "Only '=' operator can be used for specifying default value.");
        }
        node.type = "AssignmentPattern";
        delete node.operator;
        this.toAssignable(node.left, isBinding);
      case "AssignmentPattern":
        break;
      case "ParenthesizedExpression":
        this.toAssignable(node.expression, isBinding, refDestructuringErrors);
        break;
      case "ChainExpression":
        this.raiseRecoverable(node.start, "Optional chaining cannot appear in left-hand side");
        break;
      case "MemberExpression":
        if (!isBinding) {
          break;
        }
      default:
        this.raise(node.start, "Assigning to rvalue");
    }
  } else if (refDestructuringErrors) {
    this.checkPatternErrors(refDestructuringErrors, true);
  }
  return node;
};
pp$2.toAssignableList = function(exprList, isBinding) {
  var end = exprList.length;
  for (var i = 0; i < end; i++) {
    var elt = exprList[i];
    if (elt) {
      this.toAssignable(elt, isBinding);
    }
  }
  if (end) {
    var last = exprList[end - 1];
    if (this.options.ecmaVersion === 6 && isBinding && last && last.type === "RestElement" && last.argument.type !== "Identifier") {
      this.unexpected(last.argument.start);
    }
  }
  return exprList;
};
pp$2.parseSpread = function(refDestructuringErrors) {
  var node = this.startNode();
  this.next();
  node.argument = this.parseMaybeAssign(false, refDestructuringErrors);
  return this.finishNode(node, "SpreadElement");
};
pp$2.parseRestBinding = function() {
  var node = this.startNode();
  this.next();
  if (this.options.ecmaVersion === 6 && this.type !== types2.name) {
    this.unexpected();
  }
  node.argument = this.parseBindingAtom();
  return this.finishNode(node, "RestElement");
};
pp$2.parseBindingAtom = function() {
  if (this.options.ecmaVersion >= 6) {
    switch (this.type) {
      case types2.bracketL:
        var node = this.startNode();
        this.next();
        node.elements = this.parseBindingList(types2.bracketR, true, true);
        return this.finishNode(node, "ArrayPattern");
      case types2.braceL:
        return this.parseObj(true);
    }
  }
  return this.parseIdent();
};
pp$2.parseBindingList = function(close, allowEmpty, allowTrailingComma) {
  var elts = [], first = true;
  while (!this.eat(close)) {
    if (first) {
      first = false;
    } else {
      this.expect(types2.comma);
    }
    if (allowEmpty && this.type === types2.comma) {
      elts.push(null);
    } else if (allowTrailingComma && this.afterTrailingComma(close)) {
      break;
    } else if (this.type === types2.ellipsis) {
      var rest = this.parseRestBinding();
      this.parseBindingListItem(rest);
      elts.push(rest);
      if (this.type === types2.comma) {
        this.raise(this.start, "Comma is not permitted after the rest element");
      }
      this.expect(close);
      break;
    } else {
      var elem = this.parseMaybeDefault(this.start, this.startLoc);
      this.parseBindingListItem(elem);
      elts.push(elem);
    }
  }
  return elts;
};
pp$2.parseBindingListItem = function(param) {
  return param;
};
pp$2.parseMaybeDefault = function(startPos, startLoc, left) {
  left = left || this.parseBindingAtom();
  if (this.options.ecmaVersion < 6 || !this.eat(types2.eq)) {
    return left;
  }
  var node = this.startNodeAt(startPos, startLoc);
  node.left = left;
  node.right = this.parseMaybeAssign();
  return this.finishNode(node, "AssignmentPattern");
};
pp$2.checkLVal = function(expr, bindingType, checkClashes) {
  if (bindingType === void 0)
    bindingType = BIND_NONE;
  switch (expr.type) {
    case "Identifier":
      if (bindingType === BIND_LEXICAL && expr.name === "let") {
        this.raiseRecoverable(expr.start, "let is disallowed as a lexically bound name");
      }
      if (this.strict && this.reservedWordsStrictBind.test(expr.name)) {
        this.raiseRecoverable(expr.start, (bindingType ? "Binding " : "Assigning to ") + expr.name + " in strict mode");
      }
      if (checkClashes) {
        if (has2(checkClashes, expr.name)) {
          this.raiseRecoverable(expr.start, "Argument name clash");
        }
        checkClashes[expr.name] = true;
      }
      if (bindingType !== BIND_NONE && bindingType !== BIND_OUTSIDE) {
        this.declareName(expr.name, bindingType, expr.start);
      }
      break;
    case "ChainExpression":
      this.raiseRecoverable(expr.start, "Optional chaining cannot appear in left-hand side");
      break;
    case "MemberExpression":
      if (bindingType) {
        this.raiseRecoverable(expr.start, "Binding member expression");
      }
      break;
    case "ObjectPattern":
      for (var i = 0, list = expr.properties; i < list.length; i += 1) {
        var prop = list[i];
        this.checkLVal(prop, bindingType, checkClashes);
      }
      break;
    case "Property":
      this.checkLVal(expr.value, bindingType, checkClashes);
      break;
    case "ArrayPattern":
      for (var i$1 = 0, list$1 = expr.elements; i$1 < list$1.length; i$1 += 1) {
        var elem = list$1[i$1];
        if (elem) {
          this.checkLVal(elem, bindingType, checkClashes);
        }
      }
      break;
    case "AssignmentPattern":
      this.checkLVal(expr.left, bindingType, checkClashes);
      break;
    case "RestElement":
      this.checkLVal(expr.argument, bindingType, checkClashes);
      break;
    case "ParenthesizedExpression":
      this.checkLVal(expr.expression, bindingType, checkClashes);
      break;
    default:
      this.raise(expr.start, (bindingType ? "Binding" : "Assigning to") + " rvalue");
  }
};
var pp$3 = Parser2.prototype;
pp$3.checkPropClash = function(prop, propHash, refDestructuringErrors) {
  if (this.options.ecmaVersion >= 9 && prop.type === "SpreadElement") {
    return;
  }
  if (this.options.ecmaVersion >= 6 && (prop.computed || prop.method || prop.shorthand)) {
    return;
  }
  var key = prop.key;
  var name;
  switch (key.type) {
    case "Identifier":
      name = key.name;
      break;
    case "Literal":
      name = String(key.value);
      break;
    default:
      return;
  }
  var kind = prop.kind;
  if (this.options.ecmaVersion >= 6) {
    if (name === "__proto__" && kind === "init") {
      if (propHash.proto) {
        if (refDestructuringErrors) {
          if (refDestructuringErrors.doubleProto < 0) {
            refDestructuringErrors.doubleProto = key.start;
          }
        } else {
          this.raiseRecoverable(key.start, "Redefinition of __proto__ property");
        }
      }
      propHash.proto = true;
    }
    return;
  }
  name = "$" + name;
  var other = propHash[name];
  if (other) {
    var redefinition;
    if (kind === "init") {
      redefinition = this.strict && other.init || other.get || other.set;
    } else {
      redefinition = other.init || other[kind];
    }
    if (redefinition) {
      this.raiseRecoverable(key.start, "Redefinition of property");
    }
  } else {
    other = propHash[name] = {
      init: false,
      get: false,
      set: false
    };
  }
  other[kind] = true;
};
pp$3.parseExpression = function(noIn, refDestructuringErrors) {
  var startPos = this.start, startLoc = this.startLoc;
  var expr = this.parseMaybeAssign(noIn, refDestructuringErrors);
  if (this.type === types2.comma) {
    var node = this.startNodeAt(startPos, startLoc);
    node.expressions = [expr];
    while (this.eat(types2.comma)) {
      node.expressions.push(this.parseMaybeAssign(noIn, refDestructuringErrors));
    }
    return this.finishNode(node, "SequenceExpression");
  }
  return expr;
};
pp$3.parseMaybeAssign = function(noIn, refDestructuringErrors, afterLeftParse) {
  if (this.isContextual("yield")) {
    if (this.inGenerator) {
      return this.parseYield(noIn);
    } else {
      this.exprAllowed = false;
    }
  }
  var ownDestructuringErrors = false, oldParenAssign = -1, oldTrailingComma = -1;
  if (refDestructuringErrors) {
    oldParenAssign = refDestructuringErrors.parenthesizedAssign;
    oldTrailingComma = refDestructuringErrors.trailingComma;
    refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = -1;
  } else {
    refDestructuringErrors = new DestructuringErrors();
    ownDestructuringErrors = true;
  }
  var startPos = this.start, startLoc = this.startLoc;
  if (this.type === types2.parenL || this.type === types2.name) {
    this.potentialArrowAt = this.start;
  }
  var left = this.parseMaybeConditional(noIn, refDestructuringErrors);
  if (afterLeftParse) {
    left = afterLeftParse.call(this, left, startPos, startLoc);
  }
  if (this.type.isAssign) {
    var node = this.startNodeAt(startPos, startLoc);
    node.operator = this.value;
    node.left = this.type === types2.eq ? this.toAssignable(left, false, refDestructuringErrors) : left;
    if (!ownDestructuringErrors) {
      refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = refDestructuringErrors.doubleProto = -1;
    }
    if (refDestructuringErrors.shorthandAssign >= node.left.start) {
      refDestructuringErrors.shorthandAssign = -1;
    }
    this.checkLVal(left);
    this.next();
    node.right = this.parseMaybeAssign(noIn);
    return this.finishNode(node, "AssignmentExpression");
  } else {
    if (ownDestructuringErrors) {
      this.checkExpressionErrors(refDestructuringErrors, true);
    }
  }
  if (oldParenAssign > -1) {
    refDestructuringErrors.parenthesizedAssign = oldParenAssign;
  }
  if (oldTrailingComma > -1) {
    refDestructuringErrors.trailingComma = oldTrailingComma;
  }
  return left;
};
pp$3.parseMaybeConditional = function(noIn, refDestructuringErrors) {
  var startPos = this.start, startLoc = this.startLoc;
  var expr = this.parseExprOps(noIn, refDestructuringErrors);
  if (this.checkExpressionErrors(refDestructuringErrors)) {
    return expr;
  }
  if (this.eat(types2.question)) {
    var node = this.startNodeAt(startPos, startLoc);
    node.test = expr;
    node.consequent = this.parseMaybeAssign();
    this.expect(types2.colon);
    node.alternate = this.parseMaybeAssign(noIn);
    return this.finishNode(node, "ConditionalExpression");
  }
  return expr;
};
pp$3.parseExprOps = function(noIn, refDestructuringErrors) {
  var startPos = this.start, startLoc = this.startLoc;
  var expr = this.parseMaybeUnary(refDestructuringErrors, false);
  if (this.checkExpressionErrors(refDestructuringErrors)) {
    return expr;
  }
  return expr.start === startPos && expr.type === "ArrowFunctionExpression" ? expr : this.parseExprOp(expr, startPos, startLoc, -1, noIn);
};
pp$3.parseExprOp = function(left, leftStartPos, leftStartLoc, minPrec, noIn) {
  var prec = this.type.binop;
  if (prec != null && (!noIn || this.type !== types2._in)) {
    if (prec > minPrec) {
      var logical = this.type === types2.logicalOR || this.type === types2.logicalAND;
      var coalesce = this.type === types2.coalesce;
      if (coalesce) {
        prec = types2.logicalAND.binop;
      }
      var op = this.value;
      this.next();
      var startPos = this.start, startLoc = this.startLoc;
      var right = this.parseExprOp(this.parseMaybeUnary(null, false), startPos, startLoc, prec, noIn);
      var node = this.buildBinary(leftStartPos, leftStartLoc, left, right, op, logical || coalesce);
      if (logical && this.type === types2.coalesce || coalesce && (this.type === types2.logicalOR || this.type === types2.logicalAND)) {
        this.raiseRecoverable(this.start, "Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses");
      }
      return this.parseExprOp(node, leftStartPos, leftStartLoc, minPrec, noIn);
    }
  }
  return left;
};
pp$3.buildBinary = function(startPos, startLoc, left, right, op, logical) {
  var node = this.startNodeAt(startPos, startLoc);
  node.left = left;
  node.operator = op;
  node.right = right;
  return this.finishNode(node, logical ? "LogicalExpression" : "BinaryExpression");
};
pp$3.parseMaybeUnary = function(refDestructuringErrors, sawUnary) {
  var startPos = this.start, startLoc = this.startLoc, expr;
  if (this.isContextual("await") && (this.inAsync || !this.inFunction && this.options.allowAwaitOutsideFunction)) {
    expr = this.parseAwait();
    sawUnary = true;
  } else if (this.type.prefix) {
    var node = this.startNode(), update = this.type === types2.incDec;
    node.operator = this.value;
    node.prefix = true;
    this.next();
    node.argument = this.parseMaybeUnary(null, true);
    this.checkExpressionErrors(refDestructuringErrors, true);
    if (update) {
      this.checkLVal(node.argument);
    } else if (this.strict && node.operator === "delete" && node.argument.type === "Identifier") {
      this.raiseRecoverable(node.start, "Deleting local variable in strict mode");
    } else {
      sawUnary = true;
    }
    expr = this.finishNode(node, update ? "UpdateExpression" : "UnaryExpression");
  } else {
    expr = this.parseExprSubscripts(refDestructuringErrors);
    if (this.checkExpressionErrors(refDestructuringErrors)) {
      return expr;
    }
    while (this.type.postfix && !this.canInsertSemicolon()) {
      var node$1 = this.startNodeAt(startPos, startLoc);
      node$1.operator = this.value;
      node$1.prefix = false;
      node$1.argument = expr;
      this.checkLVal(expr);
      this.next();
      expr = this.finishNode(node$1, "UpdateExpression");
    }
  }
  if (!sawUnary && this.eat(types2.starstar)) {
    return this.buildBinary(startPos, startLoc, expr, this.parseMaybeUnary(null, false), "**", false);
  } else {
    return expr;
  }
};
pp$3.parseExprSubscripts = function(refDestructuringErrors) {
  var startPos = this.start, startLoc = this.startLoc;
  var expr = this.parseExprAtom(refDestructuringErrors);
  if (expr.type === "ArrowFunctionExpression" && this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")") {
    return expr;
  }
  var result = this.parseSubscripts(expr, startPos, startLoc);
  if (refDestructuringErrors && result.type === "MemberExpression") {
    if (refDestructuringErrors.parenthesizedAssign >= result.start) {
      refDestructuringErrors.parenthesizedAssign = -1;
    }
    if (refDestructuringErrors.parenthesizedBind >= result.start) {
      refDestructuringErrors.parenthesizedBind = -1;
    }
  }
  return result;
};
pp$3.parseSubscripts = function(base, startPos, startLoc, noCalls) {
  var maybeAsyncArrow = this.options.ecmaVersion >= 8 && base.type === "Identifier" && base.name === "async" && this.lastTokEnd === base.end && !this.canInsertSemicolon() && base.end - base.start === 5 && this.potentialArrowAt === base.start;
  var optionalChained = false;
  while (true) {
    var element = this.parseSubscript(base, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained);
    if (element.optional) {
      optionalChained = true;
    }
    if (element === base || element.type === "ArrowFunctionExpression") {
      if (optionalChained) {
        var chainNode = this.startNodeAt(startPos, startLoc);
        chainNode.expression = element;
        element = this.finishNode(chainNode, "ChainExpression");
      }
      return element;
    }
    base = element;
  }
};
pp$3.parseSubscript = function(base, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained) {
  var optionalSupported = this.options.ecmaVersion >= 11;
  var optional = optionalSupported && this.eat(types2.questionDot);
  if (noCalls && optional) {
    this.raise(this.lastTokStart, "Optional chaining cannot appear in the callee of new expressions");
  }
  var computed = this.eat(types2.bracketL);
  if (computed || optional && this.type !== types2.parenL && this.type !== types2.backQuote || this.eat(types2.dot)) {
    var node = this.startNodeAt(startPos, startLoc);
    node.object = base;
    node.property = computed ? this.parseExpression() : this.parseIdent(this.options.allowReserved !== "never");
    node.computed = !!computed;
    if (computed) {
      this.expect(types2.bracketR);
    }
    if (optionalSupported) {
      node.optional = optional;
    }
    base = this.finishNode(node, "MemberExpression");
  } else if (!noCalls && this.eat(types2.parenL)) {
    var refDestructuringErrors = new DestructuringErrors(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
    this.yieldPos = 0;
    this.awaitPos = 0;
    this.awaitIdentPos = 0;
    var exprList = this.parseExprList(types2.parenR, this.options.ecmaVersion >= 8, false, refDestructuringErrors);
    if (maybeAsyncArrow && !optional && !this.canInsertSemicolon() && this.eat(types2.arrow)) {
      this.checkPatternErrors(refDestructuringErrors, false);
      this.checkYieldAwaitInDefaultParams();
      if (this.awaitIdentPos > 0) {
        this.raise(this.awaitIdentPos, "Cannot use 'await' as identifier inside an async function");
      }
      this.yieldPos = oldYieldPos;
      this.awaitPos = oldAwaitPos;
      this.awaitIdentPos = oldAwaitIdentPos;
      return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList, true);
    }
    this.checkExpressionErrors(refDestructuringErrors, true);
    this.yieldPos = oldYieldPos || this.yieldPos;
    this.awaitPos = oldAwaitPos || this.awaitPos;
    this.awaitIdentPos = oldAwaitIdentPos || this.awaitIdentPos;
    var node$1 = this.startNodeAt(startPos, startLoc);
    node$1.callee = base;
    node$1.arguments = exprList;
    if (optionalSupported) {
      node$1.optional = optional;
    }
    base = this.finishNode(node$1, "CallExpression");
  } else if (this.type === types2.backQuote) {
    if (optional || optionalChained) {
      this.raise(this.start, "Optional chaining cannot appear in the tag of tagged template expressions");
    }
    var node$2 = this.startNodeAt(startPos, startLoc);
    node$2.tag = base;
    node$2.quasi = this.parseTemplate({ isTagged: true });
    base = this.finishNode(node$2, "TaggedTemplateExpression");
  }
  return base;
};
pp$3.parseExprAtom = function(refDestructuringErrors) {
  if (this.type === types2.slash) {
    this.readRegexp();
  }
  var node, canBeArrow = this.potentialArrowAt === this.start;
  switch (this.type) {
    case types2._super:
      if (!this.allowSuper) {
        this.raise(this.start, "'super' keyword outside a method");
      }
      node = this.startNode();
      this.next();
      if (this.type === types2.parenL && !this.allowDirectSuper) {
        this.raise(node.start, "super() call outside constructor of a subclass");
      }
      if (this.type !== types2.dot && this.type !== types2.bracketL && this.type !== types2.parenL) {
        this.unexpected();
      }
      return this.finishNode(node, "Super");
    case types2._this:
      node = this.startNode();
      this.next();
      return this.finishNode(node, "ThisExpression");
    case types2.name:
      var startPos = this.start, startLoc = this.startLoc, containsEsc = this.containsEsc;
      var id = this.parseIdent(false);
      if (this.options.ecmaVersion >= 8 && !containsEsc && id.name === "async" && !this.canInsertSemicolon() && this.eat(types2._function)) {
        return this.parseFunction(this.startNodeAt(startPos, startLoc), 0, false, true);
      }
      if (canBeArrow && !this.canInsertSemicolon()) {
        if (this.eat(types2.arrow)) {
          return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], false);
        }
        if (this.options.ecmaVersion >= 8 && id.name === "async" && this.type === types2.name && !containsEsc) {
          id = this.parseIdent(false);
          if (this.canInsertSemicolon() || !this.eat(types2.arrow)) {
            this.unexpected();
          }
          return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], true);
        }
      }
      return id;
    case types2.regexp:
      var value = this.value;
      node = this.parseLiteral(value.value);
      node.regex = { pattern: value.pattern, flags: value.flags };
      return node;
    case types2.num:
    case types2.string:
      return this.parseLiteral(this.value);
    case types2._null:
    case types2._true:
    case types2._false:
      node = this.startNode();
      node.value = this.type === types2._null ? null : this.type === types2._true;
      node.raw = this.type.keyword;
      this.next();
      return this.finishNode(node, "Literal");
    case types2.parenL:
      var start = this.start, expr = this.parseParenAndDistinguishExpression(canBeArrow);
      if (refDestructuringErrors) {
        if (refDestructuringErrors.parenthesizedAssign < 0 && !this.isSimpleAssignTarget(expr)) {
          refDestructuringErrors.parenthesizedAssign = start;
        }
        if (refDestructuringErrors.parenthesizedBind < 0) {
          refDestructuringErrors.parenthesizedBind = start;
        }
      }
      return expr;
    case types2.bracketL:
      node = this.startNode();
      this.next();
      node.elements = this.parseExprList(types2.bracketR, true, true, refDestructuringErrors);
      return this.finishNode(node, "ArrayExpression");
    case types2.braceL:
      return this.parseObj(false, refDestructuringErrors);
    case types2._function:
      node = this.startNode();
      this.next();
      return this.parseFunction(node, 0);
    case types2._class:
      return this.parseClass(this.startNode(), false);
    case types2._new:
      return this.parseNew();
    case types2.backQuote:
      return this.parseTemplate();
    case types2._import:
      if (this.options.ecmaVersion >= 11) {
        return this.parseExprImport();
      } else {
        return this.unexpected();
      }
    default:
      this.unexpected();
  }
};
pp$3.parseExprImport = function() {
  var node = this.startNode();
  if (this.containsEsc) {
    this.raiseRecoverable(this.start, "Escape sequence in keyword import");
  }
  var meta = this.parseIdent(true);
  switch (this.type) {
    case types2.parenL:
      return this.parseDynamicImport(node);
    case types2.dot:
      node.meta = meta;
      return this.parseImportMeta(node);
    default:
      this.unexpected();
  }
};
pp$3.parseDynamicImport = function(node) {
  this.next();
  node.source = this.parseMaybeAssign();
  if (!this.eat(types2.parenR)) {
    var errorPos = this.start;
    if (this.eat(types2.comma) && this.eat(types2.parenR)) {
      this.raiseRecoverable(errorPos, "Trailing comma is not allowed in import()");
    } else {
      this.unexpected(errorPos);
    }
  }
  return this.finishNode(node, "ImportExpression");
};
pp$3.parseImportMeta = function(node) {
  this.next();
  var containsEsc = this.containsEsc;
  node.property = this.parseIdent(true);
  if (node.property.name !== "meta") {
    this.raiseRecoverable(node.property.start, "The only valid meta property for import is 'import.meta'");
  }
  if (containsEsc) {
    this.raiseRecoverable(node.start, "'import.meta' must not contain escaped characters");
  }
  if (this.options.sourceType !== "module") {
    this.raiseRecoverable(node.start, "Cannot use 'import.meta' outside a module");
  }
  return this.finishNode(node, "MetaProperty");
};
pp$3.parseLiteral = function(value) {
  var node = this.startNode();
  node.value = value;
  node.raw = this.input.slice(this.start, this.end);
  if (node.raw.charCodeAt(node.raw.length - 1) === 110) {
    node.bigint = node.raw.slice(0, -1).replace(/_/g, "");
  }
  this.next();
  return this.finishNode(node, "Literal");
};
pp$3.parseParenExpression = function() {
  this.expect(types2.parenL);
  var val = this.parseExpression();
  this.expect(types2.parenR);
  return val;
};
pp$3.parseParenAndDistinguishExpression = function(canBeArrow) {
  var startPos = this.start, startLoc = this.startLoc, val, allowTrailingComma = this.options.ecmaVersion >= 8;
  if (this.options.ecmaVersion >= 6) {
    this.next();
    var innerStartPos = this.start, innerStartLoc = this.startLoc;
    var exprList = [], first = true, lastIsComma = false;
    var refDestructuringErrors = new DestructuringErrors(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, spreadStart;
    this.yieldPos = 0;
    this.awaitPos = 0;
    while (this.type !== types2.parenR) {
      first ? first = false : this.expect(types2.comma);
      if (allowTrailingComma && this.afterTrailingComma(types2.parenR, true)) {
        lastIsComma = true;
        break;
      } else if (this.type === types2.ellipsis) {
        spreadStart = this.start;
        exprList.push(this.parseParenItem(this.parseRestBinding()));
        if (this.type === types2.comma) {
          this.raise(this.start, "Comma is not permitted after the rest element");
        }
        break;
      } else {
        exprList.push(this.parseMaybeAssign(false, refDestructuringErrors, this.parseParenItem));
      }
    }
    var innerEndPos = this.start, innerEndLoc = this.startLoc;
    this.expect(types2.parenR);
    if (canBeArrow && !this.canInsertSemicolon() && this.eat(types2.arrow)) {
      this.checkPatternErrors(refDestructuringErrors, false);
      this.checkYieldAwaitInDefaultParams();
      this.yieldPos = oldYieldPos;
      this.awaitPos = oldAwaitPos;
      return this.parseParenArrowList(startPos, startLoc, exprList);
    }
    if (!exprList.length || lastIsComma) {
      this.unexpected(this.lastTokStart);
    }
    if (spreadStart) {
      this.unexpected(spreadStart);
    }
    this.checkExpressionErrors(refDestructuringErrors, true);
    this.yieldPos = oldYieldPos || this.yieldPos;
    this.awaitPos = oldAwaitPos || this.awaitPos;
    if (exprList.length > 1) {
      val = this.startNodeAt(innerStartPos, innerStartLoc);
      val.expressions = exprList;
      this.finishNodeAt(val, "SequenceExpression", innerEndPos, innerEndLoc);
    } else {
      val = exprList[0];
    }
  } else {
    val = this.parseParenExpression();
  }
  if (this.options.preserveParens) {
    var par = this.startNodeAt(startPos, startLoc);
    par.expression = val;
    return this.finishNode(par, "ParenthesizedExpression");
  } else {
    return val;
  }
};
pp$3.parseParenItem = function(item) {
  return item;
};
pp$3.parseParenArrowList = function(startPos, startLoc, exprList) {
  return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList);
};
var empty$1 = [];
pp$3.parseNew = function() {
  if (this.containsEsc) {
    this.raiseRecoverable(this.start, "Escape sequence in keyword new");
  }
  var node = this.startNode();
  var meta = this.parseIdent(true);
  if (this.options.ecmaVersion >= 6 && this.eat(types2.dot)) {
    node.meta = meta;
    var containsEsc = this.containsEsc;
    node.property = this.parseIdent(true);
    if (node.property.name !== "target") {
      this.raiseRecoverable(node.property.start, "The only valid meta property for new is 'new.target'");
    }
    if (containsEsc) {
      this.raiseRecoverable(node.start, "'new.target' must not contain escaped characters");
    }
    if (!this.inNonArrowFunction()) {
      this.raiseRecoverable(node.start, "'new.target' can only be used in functions");
    }
    return this.finishNode(node, "MetaProperty");
  }
  var startPos = this.start, startLoc = this.startLoc, isImport = this.type === types2._import;
  node.callee = this.parseSubscripts(this.parseExprAtom(), startPos, startLoc, true);
  if (isImport && node.callee.type === "ImportExpression") {
    this.raise(startPos, "Cannot use new with import()");
  }
  if (this.eat(types2.parenL)) {
    node.arguments = this.parseExprList(types2.parenR, this.options.ecmaVersion >= 8, false);
  } else {
    node.arguments = empty$1;
  }
  return this.finishNode(node, "NewExpression");
};
pp$3.parseTemplateElement = function(ref2) {
  var isTagged = ref2.isTagged;
  var elem = this.startNode();
  if (this.type === types2.invalidTemplate) {
    if (!isTagged) {
      this.raiseRecoverable(this.start, "Bad escape sequence in untagged template literal");
    }
    elem.value = {
      raw: this.value,
      cooked: null
    };
  } else {
    elem.value = {
      raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, "\n"),
      cooked: this.value
    };
  }
  this.next();
  elem.tail = this.type === types2.backQuote;
  return this.finishNode(elem, "TemplateElement");
};
pp$3.parseTemplate = function(ref2) {
  if (ref2 === void 0)
    ref2 = {};
  var isTagged = ref2.isTagged;
  if (isTagged === void 0)
    isTagged = false;
  var node = this.startNode();
  this.next();
  node.expressions = [];
  var curElt = this.parseTemplateElement({ isTagged });
  node.quasis = [curElt];
  while (!curElt.tail) {
    if (this.type === types2.eof) {
      this.raise(this.pos, "Unterminated template literal");
    }
    this.expect(types2.dollarBraceL);
    node.expressions.push(this.parseExpression());
    this.expect(types2.braceR);
    node.quasis.push(curElt = this.parseTemplateElement({ isTagged }));
  }
  this.next();
  return this.finishNode(node, "TemplateLiteral");
};
pp$3.isAsyncProp = function(prop) {
  return !prop.computed && prop.key.type === "Identifier" && prop.key.name === "async" && (this.type === types2.name || this.type === types2.num || this.type === types2.string || this.type === types2.bracketL || this.type.keyword || this.options.ecmaVersion >= 9 && this.type === types2.star) && !lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
};
pp$3.parseObj = function(isPattern, refDestructuringErrors) {
  var node = this.startNode(), first = true, propHash = {};
  node.properties = [];
  this.next();
  while (!this.eat(types2.braceR)) {
    if (!first) {
      this.expect(types2.comma);
      if (this.options.ecmaVersion >= 5 && this.afterTrailingComma(types2.braceR)) {
        break;
      }
    } else {
      first = false;
    }
    var prop = this.parseProperty(isPattern, refDestructuringErrors);
    if (!isPattern) {
      this.checkPropClash(prop, propHash, refDestructuringErrors);
    }
    node.properties.push(prop);
  }
  return this.finishNode(node, isPattern ? "ObjectPattern" : "ObjectExpression");
};
pp$3.parseProperty = function(isPattern, refDestructuringErrors) {
  var prop = this.startNode(), isGenerator, isAsync, startPos, startLoc;
  if (this.options.ecmaVersion >= 9 && this.eat(types2.ellipsis)) {
    if (isPattern) {
      prop.argument = this.parseIdent(false);
      if (this.type === types2.comma) {
        this.raise(this.start, "Comma is not permitted after the rest element");
      }
      return this.finishNode(prop, "RestElement");
    }
    if (this.type === types2.parenL && refDestructuringErrors) {
      if (refDestructuringErrors.parenthesizedAssign < 0) {
        refDestructuringErrors.parenthesizedAssign = this.start;
      }
      if (refDestructuringErrors.parenthesizedBind < 0) {
        refDestructuringErrors.parenthesizedBind = this.start;
      }
    }
    prop.argument = this.parseMaybeAssign(false, refDestructuringErrors);
    if (this.type === types2.comma && refDestructuringErrors && refDestructuringErrors.trailingComma < 0) {
      refDestructuringErrors.trailingComma = this.start;
    }
    return this.finishNode(prop, "SpreadElement");
  }
  if (this.options.ecmaVersion >= 6) {
    prop.method = false;
    prop.shorthand = false;
    if (isPattern || refDestructuringErrors) {
      startPos = this.start;
      startLoc = this.startLoc;
    }
    if (!isPattern) {
      isGenerator = this.eat(types2.star);
    }
  }
  var containsEsc = this.containsEsc;
  this.parsePropertyName(prop);
  if (!isPattern && !containsEsc && this.options.ecmaVersion >= 8 && !isGenerator && this.isAsyncProp(prop)) {
    isAsync = true;
    isGenerator = this.options.ecmaVersion >= 9 && this.eat(types2.star);
    this.parsePropertyName(prop, refDestructuringErrors);
  } else {
    isAsync = false;
  }
  this.parsePropertyValue(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc);
  return this.finishNode(prop, "Property");
};
pp$3.parsePropertyValue = function(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc) {
  if ((isGenerator || isAsync) && this.type === types2.colon) {
    this.unexpected();
  }
  if (this.eat(types2.colon)) {
    prop.value = isPattern ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(false, refDestructuringErrors);
    prop.kind = "init";
  } else if (this.options.ecmaVersion >= 6 && this.type === types2.parenL) {
    if (isPattern) {
      this.unexpected();
    }
    prop.kind = "init";
    prop.method = true;
    prop.value = this.parseMethod(isGenerator, isAsync);
  } else if (!isPattern && !containsEsc && this.options.ecmaVersion >= 5 && !prop.computed && prop.key.type === "Identifier" && (prop.key.name === "get" || prop.key.name === "set") && (this.type !== types2.comma && this.type !== types2.braceR && this.type !== types2.eq)) {
    if (isGenerator || isAsync) {
      this.unexpected();
    }
    prop.kind = prop.key.name;
    this.parsePropertyName(prop);
    prop.value = this.parseMethod(false);
    var paramCount = prop.kind === "get" ? 0 : 1;
    if (prop.value.params.length !== paramCount) {
      var start = prop.value.start;
      if (prop.kind === "get") {
        this.raiseRecoverable(start, "getter should have no params");
      } else {
        this.raiseRecoverable(start, "setter should have exactly one param");
      }
    } else {
      if (prop.kind === "set" && prop.value.params[0].type === "RestElement") {
        this.raiseRecoverable(prop.value.params[0].start, "Setter cannot use rest params");
      }
    }
  } else if (this.options.ecmaVersion >= 6 && !prop.computed && prop.key.type === "Identifier") {
    if (isGenerator || isAsync) {
      this.unexpected();
    }
    this.checkUnreserved(prop.key);
    if (prop.key.name === "await" && !this.awaitIdentPos) {
      this.awaitIdentPos = startPos;
    }
    prop.kind = "init";
    if (isPattern) {
      prop.value = this.parseMaybeDefault(startPos, startLoc, prop.key);
    } else if (this.type === types2.eq && refDestructuringErrors) {
      if (refDestructuringErrors.shorthandAssign < 0) {
        refDestructuringErrors.shorthandAssign = this.start;
      }
      prop.value = this.parseMaybeDefault(startPos, startLoc, prop.key);
    } else {
      prop.value = prop.key;
    }
    prop.shorthand = true;
  } else {
    this.unexpected();
  }
};
pp$3.parsePropertyName = function(prop) {
  if (this.options.ecmaVersion >= 6) {
    if (this.eat(types2.bracketL)) {
      prop.computed = true;
      prop.key = this.parseMaybeAssign();
      this.expect(types2.bracketR);
      return prop.key;
    } else {
      prop.computed = false;
    }
  }
  return prop.key = this.type === types2.num || this.type === types2.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never");
};
pp$3.initFunction = function(node) {
  node.id = null;
  if (this.options.ecmaVersion >= 6) {
    node.generator = node.expression = false;
  }
  if (this.options.ecmaVersion >= 8) {
    node.async = false;
  }
};
pp$3.parseMethod = function(isGenerator, isAsync, allowDirectSuper) {
  var node = this.startNode(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
  this.initFunction(node);
  if (this.options.ecmaVersion >= 6) {
    node.generator = isGenerator;
  }
  if (this.options.ecmaVersion >= 8) {
    node.async = !!isAsync;
  }
  this.yieldPos = 0;
  this.awaitPos = 0;
  this.awaitIdentPos = 0;
  this.enterScope(functionFlags(isAsync, node.generator) | SCOPE_SUPER | (allowDirectSuper ? SCOPE_DIRECT_SUPER : 0));
  this.expect(types2.parenL);
  node.params = this.parseBindingList(types2.parenR, false, this.options.ecmaVersion >= 8);
  this.checkYieldAwaitInDefaultParams();
  this.parseFunctionBody(node, false, true);
  this.yieldPos = oldYieldPos;
  this.awaitPos = oldAwaitPos;
  this.awaitIdentPos = oldAwaitIdentPos;
  return this.finishNode(node, "FunctionExpression");
};
pp$3.parseArrowExpression = function(node, params, isAsync) {
  var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
  this.enterScope(functionFlags(isAsync, false) | SCOPE_ARROW);
  this.initFunction(node);
  if (this.options.ecmaVersion >= 8) {
    node.async = !!isAsync;
  }
  this.yieldPos = 0;
  this.awaitPos = 0;
  this.awaitIdentPos = 0;
  node.params = this.toAssignableList(params, true);
  this.parseFunctionBody(node, true, false);
  this.yieldPos = oldYieldPos;
  this.awaitPos = oldAwaitPos;
  this.awaitIdentPos = oldAwaitIdentPos;
  return this.finishNode(node, "ArrowFunctionExpression");
};
pp$3.parseFunctionBody = function(node, isArrowFunction, isMethod) {
  var isExpression = isArrowFunction && this.type !== types2.braceL;
  var oldStrict = this.strict, useStrict = false;
  if (isExpression) {
    node.body = this.parseMaybeAssign();
    node.expression = true;
    this.checkParams(node, false);
  } else {
    var nonSimple = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(node.params);
    if (!oldStrict || nonSimple) {
      useStrict = this.strictDirective(this.end);
      if (useStrict && nonSimple) {
        this.raiseRecoverable(node.start, "Illegal 'use strict' directive in function with non-simple parameter list");
      }
    }
    var oldLabels = this.labels;
    this.labels = [];
    if (useStrict) {
      this.strict = true;
    }
    this.checkParams(node, !oldStrict && !useStrict && !isArrowFunction && !isMethod && this.isSimpleParamList(node.params));
    if (this.strict && node.id) {
      this.checkLVal(node.id, BIND_OUTSIDE);
    }
    node.body = this.parseBlock(false, void 0, useStrict && !oldStrict);
    node.expression = false;
    this.adaptDirectivePrologue(node.body.body);
    this.labels = oldLabels;
  }
  this.exitScope();
};
pp$3.isSimpleParamList = function(params) {
  for (var i = 0, list = params; i < list.length; i += 1) {
    var param = list[i];
    if (param.type !== "Identifier") {
      return false;
    }
  }
  return true;
};
pp$3.checkParams = function(node, allowDuplicates) {
  var nameHash = {};
  for (var i = 0, list = node.params; i < list.length; i += 1) {
    var param = list[i];
    this.checkLVal(param, BIND_VAR, allowDuplicates ? null : nameHash);
  }
};
pp$3.parseExprList = function(close, allowTrailingComma, allowEmpty, refDestructuringErrors) {
  var elts = [], first = true;
  while (!this.eat(close)) {
    if (!first) {
      this.expect(types2.comma);
      if (allowTrailingComma && this.afterTrailingComma(close)) {
        break;
      }
    } else {
      first = false;
    }
    var elt = void 0;
    if (allowEmpty && this.type === types2.comma) {
      elt = null;
    } else if (this.type === types2.ellipsis) {
      elt = this.parseSpread(refDestructuringErrors);
      if (refDestructuringErrors && this.type === types2.comma && refDestructuringErrors.trailingComma < 0) {
        refDestructuringErrors.trailingComma = this.start;
      }
    } else {
      elt = this.parseMaybeAssign(false, refDestructuringErrors);
    }
    elts.push(elt);
  }
  return elts;
};
pp$3.checkUnreserved = function(ref2) {
  var start = ref2.start;
  var end = ref2.end;
  var name = ref2.name;
  if (this.inGenerator && name === "yield") {
    this.raiseRecoverable(start, "Cannot use 'yield' as identifier inside a generator");
  }
  if (this.inAsync && name === "await") {
    this.raiseRecoverable(start, "Cannot use 'await' as identifier inside an async function");
  }
  if (this.keywords.test(name)) {
    this.raise(start, "Unexpected keyword '" + name + "'");
  }
  if (this.options.ecmaVersion < 6 && this.input.slice(start, end).indexOf("\\") !== -1) {
    return;
  }
  var re = this.strict ? this.reservedWordsStrict : this.reservedWords;
  if (re.test(name)) {
    if (!this.inAsync && name === "await") {
      this.raiseRecoverable(start, "Cannot use keyword 'await' outside an async function");
    }
    this.raiseRecoverable(start, "The keyword '" + name + "' is reserved");
  }
};
pp$3.parseIdent = function(liberal, isBinding) {
  var node = this.startNode();
  if (this.type === types2.name) {
    node.name = this.value;
  } else if (this.type.keyword) {
    node.name = this.type.keyword;
    if ((node.name === "class" || node.name === "function") && (this.lastTokEnd !== this.lastTokStart + 1 || this.input.charCodeAt(this.lastTokStart) !== 46)) {
      this.context.pop();
    }
  } else {
    this.unexpected();
  }
  this.next(!!liberal);
  this.finishNode(node, "Identifier");
  if (!liberal) {
    this.checkUnreserved(node);
    if (node.name === "await" && !this.awaitIdentPos) {
      this.awaitIdentPos = node.start;
    }
  }
  return node;
};
pp$3.parseYield = function(noIn) {
  if (!this.yieldPos) {
    this.yieldPos = this.start;
  }
  var node = this.startNode();
  this.next();
  if (this.type === types2.semi || this.canInsertSemicolon() || this.type !== types2.star && !this.type.startsExpr) {
    node.delegate = false;
    node.argument = null;
  } else {
    node.delegate = this.eat(types2.star);
    node.argument = this.parseMaybeAssign(noIn);
  }
  return this.finishNode(node, "YieldExpression");
};
pp$3.parseAwait = function() {
  if (!this.awaitPos) {
    this.awaitPos = this.start;
  }
  var node = this.startNode();
  this.next();
  node.argument = this.parseMaybeUnary(null, false);
  return this.finishNode(node, "AwaitExpression");
};
var pp$4 = Parser2.prototype;
pp$4.raise = function(pos, message) {
  var loc = getLineInfo(this.input, pos);
  message += " (" + loc.line + ":" + loc.column + ")";
  var err = new SyntaxError(message);
  err.pos = pos;
  err.loc = loc;
  err.raisedAt = this.pos;
  throw err;
};
pp$4.raiseRecoverable = pp$4.raise;
pp$4.curPosition = function() {
  if (this.options.locations) {
    return new Position(this.curLine, this.pos - this.lineStart);
  }
};
var pp$5 = Parser2.prototype;
var Scope2 = function Scope3(flags) {
  this.flags = flags;
  this.var = [];
  this.lexical = [];
  this.functions = [];
};
pp$5.enterScope = function(flags) {
  this.scopeStack.push(new Scope2(flags));
};
pp$5.exitScope = function() {
  this.scopeStack.pop();
};
pp$5.treatFunctionsAsVarInScope = function(scope) {
  return scope.flags & SCOPE_FUNCTION || !this.inModule && scope.flags & SCOPE_TOP;
};
pp$5.declareName = function(name, bindingType, pos) {
  var redeclared = false;
  if (bindingType === BIND_LEXICAL) {
    var scope = this.currentScope();
    redeclared = scope.lexical.indexOf(name) > -1 || scope.functions.indexOf(name) > -1 || scope.var.indexOf(name) > -1;
    scope.lexical.push(name);
    if (this.inModule && scope.flags & SCOPE_TOP) {
      delete this.undefinedExports[name];
    }
  } else if (bindingType === BIND_SIMPLE_CATCH) {
    var scope$1 = this.currentScope();
    scope$1.lexical.push(name);
  } else if (bindingType === BIND_FUNCTION) {
    var scope$2 = this.currentScope();
    if (this.treatFunctionsAsVar) {
      redeclared = scope$2.lexical.indexOf(name) > -1;
    } else {
      redeclared = scope$2.lexical.indexOf(name) > -1 || scope$2.var.indexOf(name) > -1;
    }
    scope$2.functions.push(name);
  } else {
    for (var i = this.scopeStack.length - 1; i >= 0; --i) {
      var scope$3 = this.scopeStack[i];
      if (scope$3.lexical.indexOf(name) > -1 && !(scope$3.flags & SCOPE_SIMPLE_CATCH && scope$3.lexical[0] === name) || !this.treatFunctionsAsVarInScope(scope$3) && scope$3.functions.indexOf(name) > -1) {
        redeclared = true;
        break;
      }
      scope$3.var.push(name);
      if (this.inModule && scope$3.flags & SCOPE_TOP) {
        delete this.undefinedExports[name];
      }
      if (scope$3.flags & SCOPE_VAR) {
        break;
      }
    }
  }
  if (redeclared) {
    this.raiseRecoverable(pos, "Identifier '" + name + "' has already been declared");
  }
};
pp$5.checkLocalExport = function(id) {
  if (this.scopeStack[0].lexical.indexOf(id.name) === -1 && this.scopeStack[0].var.indexOf(id.name) === -1) {
    this.undefinedExports[id.name] = id;
  }
};
pp$5.currentScope = function() {
  return this.scopeStack[this.scopeStack.length - 1];
};
pp$5.currentVarScope = function() {
  for (var i = this.scopeStack.length - 1; ; i--) {
    var scope = this.scopeStack[i];
    if (scope.flags & SCOPE_VAR) {
      return scope;
    }
  }
};
pp$5.currentThisScope = function() {
  for (var i = this.scopeStack.length - 1; ; i--) {
    var scope = this.scopeStack[i];
    if (scope.flags & SCOPE_VAR && !(scope.flags & SCOPE_ARROW)) {
      return scope;
    }
  }
};
var Node3 = function Node4(parser2, pos, loc) {
  this.type = "";
  this.start = pos;
  this.end = 0;
  if (parser2.options.locations) {
    this.loc = new SourceLocation(parser2, loc);
  }
  if (parser2.options.directSourceFile) {
    this.sourceFile = parser2.options.directSourceFile;
  }
  if (parser2.options.ranges) {
    this.range = [pos, 0];
  }
};
var pp$6 = Parser2.prototype;
pp$6.startNode = function() {
  return new Node3(this, this.start, this.startLoc);
};
pp$6.startNodeAt = function(pos, loc) {
  return new Node3(this, pos, loc);
};
function finishNodeAt(node, type, pos, loc) {
  node.type = type;
  node.end = pos;
  if (this.options.locations) {
    node.loc.end = loc;
  }
  if (this.options.ranges) {
    node.range[1] = pos;
  }
  return node;
}
pp$6.finishNode = function(node, type) {
  return finishNodeAt.call(this, node, type, this.lastTokEnd, this.lastTokEndLoc);
};
pp$6.finishNodeAt = function(node, type, pos, loc) {
  return finishNodeAt.call(this, node, type, pos, loc);
};
var TokContext = function TokContext2(token, isExpr, preserveSpace, override, generator) {
  this.token = token;
  this.isExpr = !!isExpr;
  this.preserveSpace = !!preserveSpace;
  this.override = override;
  this.generator = !!generator;
};
var types$1 = {
  b_stat: new TokContext("{", false),
  b_expr: new TokContext("{", true),
  b_tmpl: new TokContext("${", false),
  p_stat: new TokContext("(", false),
  p_expr: new TokContext("(", true),
  q_tmpl: new TokContext("`", true, true, function(p) {
    return p.tryReadTemplateToken();
  }),
  f_stat: new TokContext("function", false),
  f_expr: new TokContext("function", true),
  f_expr_gen: new TokContext("function", true, false, null, true),
  f_gen: new TokContext("function", false, false, null, true)
};
var pp$7 = Parser2.prototype;
pp$7.initialContext = function() {
  return [types$1.b_stat];
};
pp$7.braceIsBlock = function(prevType) {
  var parent = this.curContext();
  if (parent === types$1.f_expr || parent === types$1.f_stat) {
    return true;
  }
  if (prevType === types2.colon && (parent === types$1.b_stat || parent === types$1.b_expr)) {
    return !parent.isExpr;
  }
  if (prevType === types2._return || prevType === types2.name && this.exprAllowed) {
    return lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
  }
  if (prevType === types2._else || prevType === types2.semi || prevType === types2.eof || prevType === types2.parenR || prevType === types2.arrow) {
    return true;
  }
  if (prevType === types2.braceL) {
    return parent === types$1.b_stat;
  }
  if (prevType === types2._var || prevType === types2._const || prevType === types2.name) {
    return false;
  }
  return !this.exprAllowed;
};
pp$7.inGeneratorContext = function() {
  for (var i = this.context.length - 1; i >= 1; i--) {
    var context = this.context[i];
    if (context.token === "function") {
      return context.generator;
    }
  }
  return false;
};
pp$7.updateContext = function(prevType) {
  var update, type = this.type;
  if (type.keyword && prevType === types2.dot) {
    this.exprAllowed = false;
  } else if (update = type.updateContext) {
    update.call(this, prevType);
  } else {
    this.exprAllowed = type.beforeExpr;
  }
};
types2.parenR.updateContext = types2.braceR.updateContext = function() {
  if (this.context.length === 1) {
    this.exprAllowed = true;
    return;
  }
  var out = this.context.pop();
  if (out === types$1.b_stat && this.curContext().token === "function") {
    out = this.context.pop();
  }
  this.exprAllowed = !out.isExpr;
};
types2.braceL.updateContext = function(prevType) {
  this.context.push(this.braceIsBlock(prevType) ? types$1.b_stat : types$1.b_expr);
  this.exprAllowed = true;
};
types2.dollarBraceL.updateContext = function() {
  this.context.push(types$1.b_tmpl);
  this.exprAllowed = true;
};
types2.parenL.updateContext = function(prevType) {
  var statementParens = prevType === types2._if || prevType === types2._for || prevType === types2._with || prevType === types2._while;
  this.context.push(statementParens ? types$1.p_stat : types$1.p_expr);
  this.exprAllowed = true;
};
types2.incDec.updateContext = function() {
};
types2._function.updateContext = types2._class.updateContext = function(prevType) {
  if (prevType.beforeExpr && prevType !== types2.semi && prevType !== types2._else && !(prevType === types2._return && lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) && !((prevType === types2.colon || prevType === types2.braceL) && this.curContext() === types$1.b_stat)) {
    this.context.push(types$1.f_expr);
  } else {
    this.context.push(types$1.f_stat);
  }
  this.exprAllowed = false;
};
types2.backQuote.updateContext = function() {
  if (this.curContext() === types$1.q_tmpl) {
    this.context.pop();
  } else {
    this.context.push(types$1.q_tmpl);
  }
  this.exprAllowed = false;
};
types2.star.updateContext = function(prevType) {
  if (prevType === types2._function) {
    var index = this.context.length - 1;
    if (this.context[index] === types$1.f_expr) {
      this.context[index] = types$1.f_expr_gen;
    } else {
      this.context[index] = types$1.f_gen;
    }
  }
  this.exprAllowed = true;
};
types2.name.updateContext = function(prevType) {
  var allowed = false;
  if (this.options.ecmaVersion >= 6 && prevType !== types2.dot) {
    if (this.value === "of" && !this.exprAllowed || this.value === "yield" && this.inGeneratorContext()) {
      allowed = true;
    }
  }
  this.exprAllowed = allowed;
};
var ecma9BinaryProperties = "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS";
var ecma10BinaryProperties = ecma9BinaryProperties + " Extended_Pictographic";
var ecma11BinaryProperties = ecma10BinaryProperties;
var unicodeBinaryProperties = {
  9: ecma9BinaryProperties,
  10: ecma10BinaryProperties,
  11: ecma11BinaryProperties
};
var unicodeGeneralCategoryValues = "Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu";
var ecma9ScriptValues = "Adlam Adlm Ahom Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb";
var ecma10ScriptValues = ecma9ScriptValues + " Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd";
var ecma11ScriptValues = ecma10ScriptValues + " Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho";
var unicodeScriptValues = {
  9: ecma9ScriptValues,
  10: ecma10ScriptValues,
  11: ecma11ScriptValues
};
var data = {};
function buildUnicodeData(ecmaVersion) {
  var d = data[ecmaVersion] = {
    binary: wordsRegexp(unicodeBinaryProperties[ecmaVersion] + " " + unicodeGeneralCategoryValues),
    nonBinary: {
      General_Category: wordsRegexp(unicodeGeneralCategoryValues),
      Script: wordsRegexp(unicodeScriptValues[ecmaVersion])
    }
  };
  d.nonBinary.Script_Extensions = d.nonBinary.Script;
  d.nonBinary.gc = d.nonBinary.General_Category;
  d.nonBinary.sc = d.nonBinary.Script;
  d.nonBinary.scx = d.nonBinary.Script_Extensions;
}
buildUnicodeData(9);
buildUnicodeData(10);
buildUnicodeData(11);
var pp$8 = Parser2.prototype;
var RegExpValidationState = function RegExpValidationState2(parser2) {
  this.parser = parser2;
  this.validFlags = "gim" + (parser2.options.ecmaVersion >= 6 ? "uy" : "") + (parser2.options.ecmaVersion >= 9 ? "s" : "");
  this.unicodeProperties = data[parser2.options.ecmaVersion >= 11 ? 11 : parser2.options.ecmaVersion];
  this.source = "";
  this.flags = "";
  this.start = 0;
  this.switchU = false;
  this.switchN = false;
  this.pos = 0;
  this.lastIntValue = 0;
  this.lastStringValue = "";
  this.lastAssertionIsQuantifiable = false;
  this.numCapturingParens = 0;
  this.maxBackReference = 0;
  this.groupNames = [];
  this.backReferenceNames = [];
};
RegExpValidationState.prototype.reset = function reset(start, pattern, flags) {
  var unicode = flags.indexOf("u") !== -1;
  this.start = start | 0;
  this.source = pattern + "";
  this.flags = flags;
  this.switchU = unicode && this.parser.options.ecmaVersion >= 6;
  this.switchN = unicode && this.parser.options.ecmaVersion >= 9;
};
RegExpValidationState.prototype.raise = function raise(message) {
  this.parser.raiseRecoverable(this.start, "Invalid regular expression: /" + this.source + "/: " + message);
};
RegExpValidationState.prototype.at = function at(i, forceU) {
  if (forceU === void 0)
    forceU = false;
  var s = this.source;
  var l = s.length;
  if (i >= l) {
    return -1;
  }
  var c = s.charCodeAt(i);
  if (!(forceU || this.switchU) || c <= 55295 || c >= 57344 || i + 1 >= l) {
    return c;
  }
  var next = s.charCodeAt(i + 1);
  return next >= 56320 && next <= 57343 ? (c << 10) + next - 56613888 : c;
};
RegExpValidationState.prototype.nextIndex = function nextIndex(i, forceU) {
  if (forceU === void 0)
    forceU = false;
  var s = this.source;
  var l = s.length;
  if (i >= l) {
    return l;
  }
  var c = s.charCodeAt(i), next;
  if (!(forceU || this.switchU) || c <= 55295 || c >= 57344 || i + 1 >= l || (next = s.charCodeAt(i + 1)) < 56320 || next > 57343) {
    return i + 1;
  }
  return i + 2;
};
RegExpValidationState.prototype.current = function current(forceU) {
  if (forceU === void 0)
    forceU = false;
  return this.at(this.pos, forceU);
};
RegExpValidationState.prototype.lookahead = function lookahead(forceU) {
  if (forceU === void 0)
    forceU = false;
  return this.at(this.nextIndex(this.pos, forceU), forceU);
};
RegExpValidationState.prototype.advance = function advance2(forceU) {
  if (forceU === void 0)
    forceU = false;
  this.pos = this.nextIndex(this.pos, forceU);
};
RegExpValidationState.prototype.eat = function eat(ch, forceU) {
  if (forceU === void 0)
    forceU = false;
  if (this.current(forceU) === ch) {
    this.advance(forceU);
    return true;
  }
  return false;
};
function codePointToString(ch) {
  if (ch <= 65535) {
    return String.fromCharCode(ch);
  }
  ch -= 65536;
  return String.fromCharCode((ch >> 10) + 55296, (ch & 1023) + 56320);
}
pp$8.validateRegExpFlags = function(state) {
  var validFlags = state.validFlags;
  var flags = state.flags;
  for (var i = 0; i < flags.length; i++) {
    var flag = flags.charAt(i);
    if (validFlags.indexOf(flag) === -1) {
      this.raise(state.start, "Invalid regular expression flag");
    }
    if (flags.indexOf(flag, i + 1) > -1) {
      this.raise(state.start, "Duplicate regular expression flag");
    }
  }
};
pp$8.validateRegExpPattern = function(state) {
  this.regexp_pattern(state);
  if (!state.switchN && this.options.ecmaVersion >= 9 && state.groupNames.length > 0) {
    state.switchN = true;
    this.regexp_pattern(state);
  }
};
pp$8.regexp_pattern = function(state) {
  state.pos = 0;
  state.lastIntValue = 0;
  state.lastStringValue = "";
  state.lastAssertionIsQuantifiable = false;
  state.numCapturingParens = 0;
  state.maxBackReference = 0;
  state.groupNames.length = 0;
  state.backReferenceNames.length = 0;
  this.regexp_disjunction(state);
  if (state.pos !== state.source.length) {
    if (state.eat(
      41
      /* ) */
    )) {
      state.raise("Unmatched ')'");
    }
    if (state.eat(
      93
      /* ] */
    ) || state.eat(
      125
      /* } */
    )) {
      state.raise("Lone quantifier brackets");
    }
  }
  if (state.maxBackReference > state.numCapturingParens) {
    state.raise("Invalid escape");
  }
  for (var i = 0, list = state.backReferenceNames; i < list.length; i += 1) {
    var name = list[i];
    if (state.groupNames.indexOf(name) === -1) {
      state.raise("Invalid named capture referenced");
    }
  }
};
pp$8.regexp_disjunction = function(state) {
  this.regexp_alternative(state);
  while (state.eat(
    124
    /* | */
  )) {
    this.regexp_alternative(state);
  }
  if (this.regexp_eatQuantifier(state, true)) {
    state.raise("Nothing to repeat");
  }
  if (state.eat(
    123
    /* { */
  )) {
    state.raise("Lone quantifier brackets");
  }
};
pp$8.regexp_alternative = function(state) {
  while (state.pos < state.source.length && this.regexp_eatTerm(state)) {
  }
};
pp$8.regexp_eatTerm = function(state) {
  if (this.regexp_eatAssertion(state)) {
    if (state.lastAssertionIsQuantifiable && this.regexp_eatQuantifier(state)) {
      if (state.switchU) {
        state.raise("Invalid quantifier");
      }
    }
    return true;
  }
  if (state.switchU ? this.regexp_eatAtom(state) : this.regexp_eatExtendedAtom(state)) {
    this.regexp_eatQuantifier(state);
    return true;
  }
  return false;
};
pp$8.regexp_eatAssertion = function(state) {
  var start = state.pos;
  state.lastAssertionIsQuantifiable = false;
  if (state.eat(
    94
    /* ^ */
  ) || state.eat(
    36
    /* $ */
  )) {
    return true;
  }
  if (state.eat(
    92
    /* \ */
  )) {
    if (state.eat(
      66
      /* B */
    ) || state.eat(
      98
      /* b */
    )) {
      return true;
    }
    state.pos = start;
  }
  if (state.eat(
    40
    /* ( */
  ) && state.eat(
    63
    /* ? */
  )) {
    var lookbehind = false;
    if (this.options.ecmaVersion >= 9) {
      lookbehind = state.eat(
        60
        /* < */
      );
    }
    if (state.eat(
      61
      /* = */
    ) || state.eat(
      33
      /* ! */
    )) {
      this.regexp_disjunction(state);
      if (!state.eat(
        41
        /* ) */
      )) {
        state.raise("Unterminated group");
      }
      state.lastAssertionIsQuantifiable = !lookbehind;
      return true;
    }
  }
  state.pos = start;
  return false;
};
pp$8.regexp_eatQuantifier = function(state, noError) {
  if (noError === void 0)
    noError = false;
  if (this.regexp_eatQuantifierPrefix(state, noError)) {
    state.eat(
      63
      /* ? */
    );
    return true;
  }
  return false;
};
pp$8.regexp_eatQuantifierPrefix = function(state, noError) {
  return state.eat(
    42
    /* * */
  ) || state.eat(
    43
    /* + */
  ) || state.eat(
    63
    /* ? */
  ) || this.regexp_eatBracedQuantifier(state, noError);
};
pp$8.regexp_eatBracedQuantifier = function(state, noError) {
  var start = state.pos;
  if (state.eat(
    123
    /* { */
  )) {
    var min = 0, max = -1;
    if (this.regexp_eatDecimalDigits(state)) {
      min = state.lastIntValue;
      if (state.eat(
        44
        /* , */
      ) && this.regexp_eatDecimalDigits(state)) {
        max = state.lastIntValue;
      }
      if (state.eat(
        125
        /* } */
      )) {
        if (max !== -1 && max < min && !noError) {
          state.raise("numbers out of order in {} quantifier");
        }
        return true;
      }
    }
    if (state.switchU && !noError) {
      state.raise("Incomplete quantifier");
    }
    state.pos = start;
  }
  return false;
};
pp$8.regexp_eatAtom = function(state) {
  return this.regexp_eatPatternCharacters(state) || state.eat(
    46
    /* . */
  ) || this.regexp_eatReverseSolidusAtomEscape(state) || this.regexp_eatCharacterClass(state) || this.regexp_eatUncapturingGroup(state) || this.regexp_eatCapturingGroup(state);
};
pp$8.regexp_eatReverseSolidusAtomEscape = function(state) {
  var start = state.pos;
  if (state.eat(
    92
    /* \ */
  )) {
    if (this.regexp_eatAtomEscape(state)) {
      return true;
    }
    state.pos = start;
  }
  return false;
};
pp$8.regexp_eatUncapturingGroup = function(state) {
  var start = state.pos;
  if (state.eat(
    40
    /* ( */
  )) {
    if (state.eat(
      63
      /* ? */
    ) && state.eat(
      58
      /* : */
    )) {
      this.regexp_disjunction(state);
      if (state.eat(
        41
        /* ) */
      )) {
        return true;
      }
      state.raise("Unterminated group");
    }
    state.pos = start;
  }
  return false;
};
pp$8.regexp_eatCapturingGroup = function(state) {
  if (state.eat(
    40
    /* ( */
  )) {
    if (this.options.ecmaVersion >= 9) {
      this.regexp_groupSpecifier(state);
    } else if (state.current() === 63) {
      state.raise("Invalid group");
    }
    this.regexp_disjunction(state);
    if (state.eat(
      41
      /* ) */
    )) {
      state.numCapturingParens += 1;
      return true;
    }
    state.raise("Unterminated group");
  }
  return false;
};
pp$8.regexp_eatExtendedAtom = function(state) {
  return state.eat(
    46
    /* . */
  ) || this.regexp_eatReverseSolidusAtomEscape(state) || this.regexp_eatCharacterClass(state) || this.regexp_eatUncapturingGroup(state) || this.regexp_eatCapturingGroup(state) || this.regexp_eatInvalidBracedQuantifier(state) || this.regexp_eatExtendedPatternCharacter(state);
};
pp$8.regexp_eatInvalidBracedQuantifier = function(state) {
  if (this.regexp_eatBracedQuantifier(state, true)) {
    state.raise("Nothing to repeat");
  }
  return false;
};
pp$8.regexp_eatSyntaxCharacter = function(state) {
  var ch = state.current();
  if (isSyntaxCharacter(ch)) {
    state.lastIntValue = ch;
    state.advance();
    return true;
  }
  return false;
};
function isSyntaxCharacter(ch) {
  return ch === 36 || ch >= 40 && ch <= 43 || ch === 46 || ch === 63 || ch >= 91 && ch <= 94 || ch >= 123 && ch <= 125;
}
pp$8.regexp_eatPatternCharacters = function(state) {
  var start = state.pos;
  var ch = 0;
  while ((ch = state.current()) !== -1 && !isSyntaxCharacter(ch)) {
    state.advance();
  }
  return state.pos !== start;
};
pp$8.regexp_eatExtendedPatternCharacter = function(state) {
  var ch = state.current();
  if (ch !== -1 && ch !== 36 && !(ch >= 40 && ch <= 43) && ch !== 46 && ch !== 63 && ch !== 91 && ch !== 94 && ch !== 124) {
    state.advance();
    return true;
  }
  return false;
};
pp$8.regexp_groupSpecifier = function(state) {
  if (state.eat(
    63
    /* ? */
  )) {
    if (this.regexp_eatGroupName(state)) {
      if (state.groupNames.indexOf(state.lastStringValue) !== -1) {
        state.raise("Duplicate capture group name");
      }
      state.groupNames.push(state.lastStringValue);
      return;
    }
    state.raise("Invalid group");
  }
};
pp$8.regexp_eatGroupName = function(state) {
  state.lastStringValue = "";
  if (state.eat(
    60
    /* < */
  )) {
    if (this.regexp_eatRegExpIdentifierName(state) && state.eat(
      62
      /* > */
    )) {
      return true;
    }
    state.raise("Invalid capture group name");
  }
  return false;
};
pp$8.regexp_eatRegExpIdentifierName = function(state) {
  state.lastStringValue = "";
  if (this.regexp_eatRegExpIdentifierStart(state)) {
    state.lastStringValue += codePointToString(state.lastIntValue);
    while (this.regexp_eatRegExpIdentifierPart(state)) {
      state.lastStringValue += codePointToString(state.lastIntValue);
    }
    return true;
  }
  return false;
};
pp$8.regexp_eatRegExpIdentifierStart = function(state) {
  var start = state.pos;
  var forceU = this.options.ecmaVersion >= 11;
  var ch = state.current(forceU);
  state.advance(forceU);
  if (ch === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU)) {
    ch = state.lastIntValue;
  }
  if (isRegExpIdentifierStart(ch)) {
    state.lastIntValue = ch;
    return true;
  }
  state.pos = start;
  return false;
};
function isRegExpIdentifierStart(ch) {
  return isIdentifierStart(ch, true) || ch === 36 || ch === 95;
}
pp$8.regexp_eatRegExpIdentifierPart = function(state) {
  var start = state.pos;
  var forceU = this.options.ecmaVersion >= 11;
  var ch = state.current(forceU);
  state.advance(forceU);
  if (ch === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU)) {
    ch = state.lastIntValue;
  }
  if (isRegExpIdentifierPart(ch)) {
    state.lastIntValue = ch;
    return true;
  }
  state.pos = start;
  return false;
};
function isRegExpIdentifierPart(ch) {
  return isIdentifierChar(ch, true) || ch === 36 || ch === 95 || ch === 8204 || ch === 8205;
}
pp$8.regexp_eatAtomEscape = function(state) {
  if (this.regexp_eatBackReference(state) || this.regexp_eatCharacterClassEscape(state) || this.regexp_eatCharacterEscape(state) || state.switchN && this.regexp_eatKGroupName(state)) {
    return true;
  }
  if (state.switchU) {
    if (state.current() === 99) {
      state.raise("Invalid unicode escape");
    }
    state.raise("Invalid escape");
  }
  return false;
};
pp$8.regexp_eatBackReference = function(state) {
  var start = state.pos;
  if (this.regexp_eatDecimalEscape(state)) {
    var n2 = state.lastIntValue;
    if (state.switchU) {
      if (n2 > state.maxBackReference) {
        state.maxBackReference = n2;
      }
      return true;
    }
    if (n2 <= state.numCapturingParens) {
      return true;
    }
    state.pos = start;
  }
  return false;
};
pp$8.regexp_eatKGroupName = function(state) {
  if (state.eat(
    107
    /* k */
  )) {
    if (this.regexp_eatGroupName(state)) {
      state.backReferenceNames.push(state.lastStringValue);
      return true;
    }
    state.raise("Invalid named reference");
  }
  return false;
};
pp$8.regexp_eatCharacterEscape = function(state) {
  return this.regexp_eatControlEscape(state) || this.regexp_eatCControlLetter(state) || this.regexp_eatZero(state) || this.regexp_eatHexEscapeSequence(state) || this.regexp_eatRegExpUnicodeEscapeSequence(state, false) || !state.switchU && this.regexp_eatLegacyOctalEscapeSequence(state) || this.regexp_eatIdentityEscape(state);
};
pp$8.regexp_eatCControlLetter = function(state) {
  var start = state.pos;
  if (state.eat(
    99
    /* c */
  )) {
    if (this.regexp_eatControlLetter(state)) {
      return true;
    }
    state.pos = start;
  }
  return false;
};
pp$8.regexp_eatZero = function(state) {
  if (state.current() === 48 && !isDecimalDigit(state.lookahead())) {
    state.lastIntValue = 0;
    state.advance();
    return true;
  }
  return false;
};
pp$8.regexp_eatControlEscape = function(state) {
  var ch = state.current();
  if (ch === 116) {
    state.lastIntValue = 9;
    state.advance();
    return true;
  }
  if (ch === 110) {
    state.lastIntValue = 10;
    state.advance();
    return true;
  }
  if (ch === 118) {
    state.lastIntValue = 11;
    state.advance();
    return true;
  }
  if (ch === 102) {
    state.lastIntValue = 12;
    state.advance();
    return true;
  }
  if (ch === 114) {
    state.lastIntValue = 13;
    state.advance();
    return true;
  }
  return false;
};
pp$8.regexp_eatControlLetter = function(state) {
  var ch = state.current();
  if (isControlLetter(ch)) {
    state.lastIntValue = ch % 32;
    state.advance();
    return true;
  }
  return false;
};
function isControlLetter(ch) {
  return ch >= 65 && ch <= 90 || ch >= 97 && ch <= 122;
}
pp$8.regexp_eatRegExpUnicodeEscapeSequence = function(state, forceU) {
  if (forceU === void 0)
    forceU = false;
  var start = state.pos;
  var switchU = forceU || state.switchU;
  if (state.eat(
    117
    /* u */
  )) {
    if (this.regexp_eatFixedHexDigits(state, 4)) {
      var lead = state.lastIntValue;
      if (switchU && lead >= 55296 && lead <= 56319) {
        var leadSurrogateEnd = state.pos;
        if (state.eat(
          92
          /* \ */
        ) && state.eat(
          117
          /* u */
        ) && this.regexp_eatFixedHexDigits(state, 4)) {
          var trail = state.lastIntValue;
          if (trail >= 56320 && trail <= 57343) {
            state.lastIntValue = (lead - 55296) * 1024 + (trail - 56320) + 65536;
            return true;
          }
        }
        state.pos = leadSurrogateEnd;
        state.lastIntValue = lead;
      }
      return true;
    }
    if (switchU && state.eat(
      123
      /* { */
    ) && this.regexp_eatHexDigits(state) && state.eat(
      125
      /* } */
    ) && isValidUnicode(state.lastIntValue)) {
      return true;
    }
    if (switchU) {
      state.raise("Invalid unicode escape");
    }
    state.pos = start;
  }
  return false;
};
function isValidUnicode(ch) {
  return ch >= 0 && ch <= 1114111;
}
pp$8.regexp_eatIdentityEscape = function(state) {
  if (state.switchU) {
    if (this.regexp_eatSyntaxCharacter(state)) {
      return true;
    }
    if (state.eat(
      47
      /* / */
    )) {
      state.lastIntValue = 47;
      return true;
    }
    return false;
  }
  var ch = state.current();
  if (ch !== 99 && (!state.switchN || ch !== 107)) {
    state.lastIntValue = ch;
    state.advance();
    return true;
  }
  return false;
};
pp$8.regexp_eatDecimalEscape = function(state) {
  state.lastIntValue = 0;
  var ch = state.current();
  if (ch >= 49 && ch <= 57) {
    do {
      state.lastIntValue = 10 * state.lastIntValue + (ch - 48);
      state.advance();
    } while ((ch = state.current()) >= 48 && ch <= 57);
    return true;
  }
  return false;
};
pp$8.regexp_eatCharacterClassEscape = function(state) {
  var ch = state.current();
  if (isCharacterClassEscape(ch)) {
    state.lastIntValue = -1;
    state.advance();
    return true;
  }
  if (state.switchU && this.options.ecmaVersion >= 9 && (ch === 80 || ch === 112)) {
    state.lastIntValue = -1;
    state.advance();
    if (state.eat(
      123
      /* { */
    ) && this.regexp_eatUnicodePropertyValueExpression(state) && state.eat(
      125
      /* } */
    )) {
      return true;
    }
    state.raise("Invalid property name");
  }
  return false;
};
function isCharacterClassEscape(ch) {
  return ch === 100 || ch === 68 || ch === 115 || ch === 83 || ch === 119 || ch === 87;
}
pp$8.regexp_eatUnicodePropertyValueExpression = function(state) {
  var start = state.pos;
  if (this.regexp_eatUnicodePropertyName(state) && state.eat(
    61
    /* = */
  )) {
    var name = state.lastStringValue;
    if (this.regexp_eatUnicodePropertyValue(state)) {
      var value = state.lastStringValue;
      this.regexp_validateUnicodePropertyNameAndValue(state, name, value);
      return true;
    }
  }
  state.pos = start;
  if (this.regexp_eatLoneUnicodePropertyNameOrValue(state)) {
    var nameOrValue = state.lastStringValue;
    this.regexp_validateUnicodePropertyNameOrValue(state, nameOrValue);
    return true;
  }
  return false;
};
pp$8.regexp_validateUnicodePropertyNameAndValue = function(state, name, value) {
  if (!has2(state.unicodeProperties.nonBinary, name)) {
    state.raise("Invalid property name");
  }
  if (!state.unicodeProperties.nonBinary[name].test(value)) {
    state.raise("Invalid property value");
  }
};
pp$8.regexp_validateUnicodePropertyNameOrValue = function(state, nameOrValue) {
  if (!state.unicodeProperties.binary.test(nameOrValue)) {
    state.raise("Invalid property name");
  }
};
pp$8.regexp_eatUnicodePropertyName = function(state) {
  var ch = 0;
  state.lastStringValue = "";
  while (isUnicodePropertyNameCharacter(ch = state.current())) {
    state.lastStringValue += codePointToString(ch);
    state.advance();
  }
  return state.lastStringValue !== "";
};
function isUnicodePropertyNameCharacter(ch) {
  return isControlLetter(ch) || ch === 95;
}
pp$8.regexp_eatUnicodePropertyValue = function(state) {
  var ch = 0;
  state.lastStringValue = "";
  while (isUnicodePropertyValueCharacter(ch = state.current())) {
    state.lastStringValue += codePointToString(ch);
    state.advance();
  }
  return state.lastStringValue !== "";
};
function isUnicodePropertyValueCharacter(ch) {
  return isUnicodePropertyNameCharacter(ch) || isDecimalDigit(ch);
}
pp$8.regexp_eatLoneUnicodePropertyNameOrValue = function(state) {
  return this.regexp_eatUnicodePropertyValue(state);
};
pp$8.regexp_eatCharacterClass = function(state) {
  if (state.eat(
    91
    /* [ */
  )) {
    state.eat(
      94
      /* ^ */
    );
    this.regexp_classRanges(state);
    if (state.eat(
      93
      /* ] */
    )) {
      return true;
    }
    state.raise("Unterminated character class");
  }
  return false;
};
pp$8.regexp_classRanges = function(state) {
  while (this.regexp_eatClassAtom(state)) {
    var left = state.lastIntValue;
    if (state.eat(
      45
      /* - */
    ) && this.regexp_eatClassAtom(state)) {
      var right = state.lastIntValue;
      if (state.switchU && (left === -1 || right === -1)) {
        state.raise("Invalid character class");
      }
      if (left !== -1 && right !== -1 && left > right) {
        state.raise("Range out of order in character class");
      }
    }
  }
};
pp$8.regexp_eatClassAtom = function(state) {
  var start = state.pos;
  if (state.eat(
    92
    /* \ */
  )) {
    if (this.regexp_eatClassEscape(state)) {
      return true;
    }
    if (state.switchU) {
      var ch$1 = state.current();
      if (ch$1 === 99 || isOctalDigit(ch$1)) {
        state.raise("Invalid class escape");
      }
      state.raise("Invalid escape");
    }
    state.pos = start;
  }
  var ch = state.current();
  if (ch !== 93) {
    state.lastIntValue = ch;
    state.advance();
    return true;
  }
  return false;
};
pp$8.regexp_eatClassEscape = function(state) {
  var start = state.pos;
  if (state.eat(
    98
    /* b */
  )) {
    state.lastIntValue = 8;
    return true;
  }
  if (state.switchU && state.eat(
    45
    /* - */
  )) {
    state.lastIntValue = 45;
    return true;
  }
  if (!state.switchU && state.eat(
    99
    /* c */
  )) {
    if (this.regexp_eatClassControlLetter(state)) {
      return true;
    }
    state.pos = start;
  }
  return this.regexp_eatCharacterClassEscape(state) || this.regexp_eatCharacterEscape(state);
};
pp$8.regexp_eatClassControlLetter = function(state) {
  var ch = state.current();
  if (isDecimalDigit(ch) || ch === 95) {
    state.lastIntValue = ch % 32;
    state.advance();
    return true;
  }
  return false;
};
pp$8.regexp_eatHexEscapeSequence = function(state) {
  var start = state.pos;
  if (state.eat(
    120
    /* x */
  )) {
    if (this.regexp_eatFixedHexDigits(state, 2)) {
      return true;
    }
    if (state.switchU) {
      state.raise("Invalid escape");
    }
    state.pos = start;
  }
  return false;
};
pp$8.regexp_eatDecimalDigits = function(state) {
  var start = state.pos;
  var ch = 0;
  state.lastIntValue = 0;
  while (isDecimalDigit(ch = state.current())) {
    state.lastIntValue = 10 * state.lastIntValue + (ch - 48);
    state.advance();
  }
  return state.pos !== start;
};
function isDecimalDigit(ch) {
  return ch >= 48 && ch <= 57;
}
pp$8.regexp_eatHexDigits = function(state) {
  var start = state.pos;
  var ch = 0;
  state.lastIntValue = 0;
  while (isHexDigit(ch = state.current())) {
    state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
    state.advance();
  }
  return state.pos !== start;
};
function isHexDigit(ch) {
  return ch >= 48 && ch <= 57 || ch >= 65 && ch <= 70 || ch >= 97 && ch <= 102;
}
function hexToInt(ch) {
  if (ch >= 65 && ch <= 70) {
    return 10 + (ch - 65);
  }
  if (ch >= 97 && ch <= 102) {
    return 10 + (ch - 97);
  }
  return ch - 48;
}
pp$8.regexp_eatLegacyOctalEscapeSequence = function(state) {
  if (this.regexp_eatOctalDigit(state)) {
    var n1 = state.lastIntValue;
    if (this.regexp_eatOctalDigit(state)) {
      var n2 = state.lastIntValue;
      if (n1 <= 3 && this.regexp_eatOctalDigit(state)) {
        state.lastIntValue = n1 * 64 + n2 * 8 + state.lastIntValue;
      } else {
        state.lastIntValue = n1 * 8 + n2;
      }
    } else {
      state.lastIntValue = n1;
    }
    return true;
  }
  return false;
};
pp$8.regexp_eatOctalDigit = function(state) {
  var ch = state.current();
  if (isOctalDigit(ch)) {
    state.lastIntValue = ch - 48;
    state.advance();
    return true;
  }
  state.lastIntValue = 0;
  return false;
};
function isOctalDigit(ch) {
  return ch >= 48 && ch <= 55;
}
pp$8.regexp_eatFixedHexDigits = function(state, length3) {
  var start = state.pos;
  state.lastIntValue = 0;
  for (var i = 0; i < length3; ++i) {
    var ch = state.current();
    if (!isHexDigit(ch)) {
      state.pos = start;
      return false;
    }
    state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
    state.advance();
  }
  return true;
};
var Token = function Token2(p) {
  this.type = p.type;
  this.value = p.value;
  this.start = p.start;
  this.end = p.end;
  if (p.options.locations) {
    this.loc = new SourceLocation(p, p.startLoc, p.endLoc);
  }
  if (p.options.ranges) {
    this.range = [p.start, p.end];
  }
};
var pp$9 = Parser2.prototype;
pp$9.next = function(ignoreEscapeSequenceInKeyword) {
  if (!ignoreEscapeSequenceInKeyword && this.type.keyword && this.containsEsc) {
    this.raiseRecoverable(this.start, "Escape sequence in keyword " + this.type.keyword);
  }
  if (this.options.onToken) {
    this.options.onToken(new Token(this));
  }
  this.lastTokEnd = this.end;
  this.lastTokStart = this.start;
  this.lastTokEndLoc = this.endLoc;
  this.lastTokStartLoc = this.startLoc;
  this.nextToken();
};
pp$9.getToken = function() {
  this.next();
  return new Token(this);
};
if (typeof Symbol !== "undefined") {
  pp$9[Symbol.iterator] = function() {
    var this$1 = this;
    return {
      next: function() {
        var token = this$1.getToken();
        return {
          done: token.type === types2.eof,
          value: token
        };
      }
    };
  };
}
pp$9.curContext = function() {
  return this.context[this.context.length - 1];
};
pp$9.nextToken = function() {
  var curContext = this.curContext();
  if (!curContext || !curContext.preserveSpace) {
    this.skipSpace();
  }
  this.start = this.pos;
  if (this.options.locations) {
    this.startLoc = this.curPosition();
  }
  if (this.pos >= this.input.length) {
    return this.finishToken(types2.eof);
  }
  if (curContext.override) {
    return curContext.override(this);
  } else {
    this.readToken(this.fullCharCodeAtPos());
  }
};
pp$9.readToken = function(code) {
  if (isIdentifierStart(code, this.options.ecmaVersion >= 6) || code === 92) {
    return this.readWord();
  }
  return this.getTokenFromCode(code);
};
pp$9.fullCharCodeAtPos = function() {
  var code = this.input.charCodeAt(this.pos);
  if (code <= 55295 || code >= 57344) {
    return code;
  }
  var next = this.input.charCodeAt(this.pos + 1);
  return (code << 10) + next - 56613888;
};
pp$9.skipBlockComment = function() {
  var startLoc = this.options.onComment && this.curPosition();
  var start = this.pos, end = this.input.indexOf("*/", this.pos += 2);
  if (end === -1) {
    this.raise(this.pos - 2, "Unterminated comment");
  }
  this.pos = end + 2;
  if (this.options.locations) {
    lineBreakG.lastIndex = start;
    var match;
    while ((match = lineBreakG.exec(this.input)) && match.index < this.pos) {
      ++this.curLine;
      this.lineStart = match.index + match[0].length;
    }
  }
  if (this.options.onComment) {
    this.options.onComment(
      true,
      this.input.slice(start + 2, end),
      start,
      this.pos,
      startLoc,
      this.curPosition()
    );
  }
};
pp$9.skipLineComment = function(startSkip) {
  var start = this.pos;
  var startLoc = this.options.onComment && this.curPosition();
  var ch = this.input.charCodeAt(this.pos += startSkip);
  while (this.pos < this.input.length && !isNewLine(ch)) {
    ch = this.input.charCodeAt(++this.pos);
  }
  if (this.options.onComment) {
    this.options.onComment(
      false,
      this.input.slice(start + startSkip, this.pos),
      start,
      this.pos,
      startLoc,
      this.curPosition()
    );
  }
};
pp$9.skipSpace = function() {
  loop:
    while (this.pos < this.input.length) {
      var ch = this.input.charCodeAt(this.pos);
      switch (ch) {
        case 32:
        case 160:
          ++this.pos;
          break;
        case 13:
          if (this.input.charCodeAt(this.pos + 1) === 10) {
            ++this.pos;
          }
        case 10:
        case 8232:
        case 8233:
          ++this.pos;
          if (this.options.locations) {
            ++this.curLine;
            this.lineStart = this.pos;
          }
          break;
        case 47:
          switch (this.input.charCodeAt(this.pos + 1)) {
            case 42:
              this.skipBlockComment();
              break;
            case 47:
              this.skipLineComment(2);
              break;
            default:
              break loop;
          }
          break;
        default:
          if (ch > 8 && ch < 14 || ch >= 5760 && nonASCIIwhitespace.test(String.fromCharCode(ch))) {
            ++this.pos;
          } else {
            break loop;
          }
      }
    }
};
pp$9.finishToken = function(type, val) {
  this.end = this.pos;
  if (this.options.locations) {
    this.endLoc = this.curPosition();
  }
  var prevType = this.type;
  this.type = type;
  this.value = val;
  this.updateContext(prevType);
};
pp$9.readToken_dot = function() {
  var next = this.input.charCodeAt(this.pos + 1);
  if (next >= 48 && next <= 57) {
    return this.readNumber(true);
  }
  var next2 = this.input.charCodeAt(this.pos + 2);
  if (this.options.ecmaVersion >= 6 && next === 46 && next2 === 46) {
    this.pos += 3;
    return this.finishToken(types2.ellipsis);
  } else {
    ++this.pos;
    return this.finishToken(types2.dot);
  }
};
pp$9.readToken_slash = function() {
  var next = this.input.charCodeAt(this.pos + 1);
  if (this.exprAllowed) {
    ++this.pos;
    return this.readRegexp();
  }
  if (next === 61) {
    return this.finishOp(types2.assign, 2);
  }
  return this.finishOp(types2.slash, 1);
};
pp$9.readToken_mult_modulo_exp = function(code) {
  var next = this.input.charCodeAt(this.pos + 1);
  var size = 1;
  var tokentype = code === 42 ? types2.star : types2.modulo;
  if (this.options.ecmaVersion >= 7 && code === 42 && next === 42) {
    ++size;
    tokentype = types2.starstar;
    next = this.input.charCodeAt(this.pos + 2);
  }
  if (next === 61) {
    return this.finishOp(types2.assign, size + 1);
  }
  return this.finishOp(tokentype, size);
};
pp$9.readToken_pipe_amp = function(code) {
  var next = this.input.charCodeAt(this.pos + 1);
  if (next === code) {
    if (this.options.ecmaVersion >= 12) {
      var next2 = this.input.charCodeAt(this.pos + 2);
      if (next2 === 61) {
        return this.finishOp(types2.assign, 3);
      }
    }
    return this.finishOp(code === 124 ? types2.logicalOR : types2.logicalAND, 2);
  }
  if (next === 61) {
    return this.finishOp(types2.assign, 2);
  }
  return this.finishOp(code === 124 ? types2.bitwiseOR : types2.bitwiseAND, 1);
};
pp$9.readToken_caret = function() {
  var next = this.input.charCodeAt(this.pos + 1);
  if (next === 61) {
    return this.finishOp(types2.assign, 2);
  }
  return this.finishOp(types2.bitwiseXOR, 1);
};
pp$9.readToken_plus_min = function(code) {
  var next = this.input.charCodeAt(this.pos + 1);
  if (next === code) {
    if (next === 45 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 62 && (this.lastTokEnd === 0 || lineBreak.test(this.input.slice(this.lastTokEnd, this.pos)))) {
      this.skipLineComment(3);
      this.skipSpace();
      return this.nextToken();
    }
    return this.finishOp(types2.incDec, 2);
  }
  if (next === 61) {
    return this.finishOp(types2.assign, 2);
  }
  return this.finishOp(types2.plusMin, 1);
};
pp$9.readToken_lt_gt = function(code) {
  var next = this.input.charCodeAt(this.pos + 1);
  var size = 1;
  if (next === code) {
    size = code === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2;
    if (this.input.charCodeAt(this.pos + size) === 61) {
      return this.finishOp(types2.assign, size + 1);
    }
    return this.finishOp(types2.bitShift, size);
  }
  if (next === 33 && code === 60 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 45 && this.input.charCodeAt(this.pos + 3) === 45) {
    this.skipLineComment(4);
    this.skipSpace();
    return this.nextToken();
  }
  if (next === 61) {
    size = 2;
  }
  return this.finishOp(types2.relational, size);
};
pp$9.readToken_eq_excl = function(code) {
  var next = this.input.charCodeAt(this.pos + 1);
  if (next === 61) {
    return this.finishOp(types2.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2);
  }
  if (code === 61 && next === 62 && this.options.ecmaVersion >= 6) {
    this.pos += 2;
    return this.finishToken(types2.arrow);
  }
  return this.finishOp(code === 61 ? types2.eq : types2.prefix, 1);
};
pp$9.readToken_question = function() {
  var ecmaVersion = this.options.ecmaVersion;
  if (ecmaVersion >= 11) {
    var next = this.input.charCodeAt(this.pos + 1);
    if (next === 46) {
      var next2 = this.input.charCodeAt(this.pos + 2);
      if (next2 < 48 || next2 > 57) {
        return this.finishOp(types2.questionDot, 2);
      }
    }
    if (next === 63) {
      if (ecmaVersion >= 12) {
        var next2$1 = this.input.charCodeAt(this.pos + 2);
        if (next2$1 === 61) {
          return this.finishOp(types2.assign, 3);
        }
      }
      return this.finishOp(types2.coalesce, 2);
    }
  }
  return this.finishOp(types2.question, 1);
};
pp$9.getTokenFromCode = function(code) {
  switch (code) {
    case 46:
      return this.readToken_dot();
    case 40:
      ++this.pos;
      return this.finishToken(types2.parenL);
    case 41:
      ++this.pos;
      return this.finishToken(types2.parenR);
    case 59:
      ++this.pos;
      return this.finishToken(types2.semi);
    case 44:
      ++this.pos;
      return this.finishToken(types2.comma);
    case 91:
      ++this.pos;
      return this.finishToken(types2.bracketL);
    case 93:
      ++this.pos;
      return this.finishToken(types2.bracketR);
    case 123:
      ++this.pos;
      return this.finishToken(types2.braceL);
    case 125:
      ++this.pos;
      return this.finishToken(types2.braceR);
    case 58:
      ++this.pos;
      return this.finishToken(types2.colon);
    case 96:
      if (this.options.ecmaVersion < 6) {
        break;
      }
      ++this.pos;
      return this.finishToken(types2.backQuote);
    case 48:
      var next = this.input.charCodeAt(this.pos + 1);
      if (next === 120 || next === 88) {
        return this.readRadixNumber(16);
      }
      if (this.options.ecmaVersion >= 6) {
        if (next === 111 || next === 79) {
          return this.readRadixNumber(8);
        }
        if (next === 98 || next === 66) {
          return this.readRadixNumber(2);
        }
      }
    case 49:
    case 50:
    case 51:
    case 52:
    case 53:
    case 54:
    case 55:
    case 56:
    case 57:
      return this.readNumber(false);
    case 34:
    case 39:
      return this.readString(code);
    case 47:
      return this.readToken_slash();
    case 37:
    case 42:
      return this.readToken_mult_modulo_exp(code);
    case 124:
    case 38:
      return this.readToken_pipe_amp(code);
    case 94:
      return this.readToken_caret();
    case 43:
    case 45:
      return this.readToken_plus_min(code);
    case 60:
    case 62:
      return this.readToken_lt_gt(code);
    case 61:
    case 33:
      return this.readToken_eq_excl(code);
    case 63:
      return this.readToken_question();
    case 126:
      return this.finishOp(types2.prefix, 1);
  }
  this.raise(this.pos, "Unexpected character '" + codePointToString$1(code) + "'");
};
pp$9.finishOp = function(type, size) {
  var str = this.input.slice(this.pos, this.pos + size);
  this.pos += size;
  return this.finishToken(type, str);
};
pp$9.readRegexp = function() {
  var escaped, inClass, start = this.pos;
  for (; ; ) {
    if (this.pos >= this.input.length) {
      this.raise(start, "Unterminated regular expression");
    }
    var ch = this.input.charAt(this.pos);
    if (lineBreak.test(ch)) {
      this.raise(start, "Unterminated regular expression");
    }
    if (!escaped) {
      if (ch === "[") {
        inClass = true;
      } else if (ch === "]" && inClass) {
        inClass = false;
      } else if (ch === "/" && !inClass) {
        break;
      }
      escaped = ch === "\\";
    } else {
      escaped = false;
    }
    ++this.pos;
  }
  var pattern = this.input.slice(start, this.pos);
  ++this.pos;
  var flagsStart = this.pos;
  var flags = this.readWord1();
  if (this.containsEsc) {
    this.unexpected(flagsStart);
  }
  var state = this.regexpState || (this.regexpState = new RegExpValidationState(this));
  state.reset(start, pattern, flags);
  this.validateRegExpFlags(state);
  this.validateRegExpPattern(state);
  var value = null;
  try {
    value = new RegExp(pattern, flags);
  } catch (e) {
  }
  return this.finishToken(types2.regexp, { pattern, flags, value });
};
pp$9.readInt = function(radix, len, maybeLegacyOctalNumericLiteral) {
  var allowSeparators = this.options.ecmaVersion >= 12 && len === void 0;
  var isLegacyOctalNumericLiteral = maybeLegacyOctalNumericLiteral && this.input.charCodeAt(this.pos) === 48;
  var start = this.pos, total = 0, lastCode = 0;
  for (var i = 0, e = len == null ? Infinity : len; i < e; ++i, ++this.pos) {
    var code = this.input.charCodeAt(this.pos), val = void 0;
    if (allowSeparators && code === 95) {
      if (isLegacyOctalNumericLiteral) {
        this.raiseRecoverable(this.pos, "Numeric separator is not allowed in legacy octal numeric literals");
      }
      if (lastCode === 95) {
        this.raiseRecoverable(this.pos, "Numeric separator must be exactly one underscore");
      }
      if (i === 0) {
        this.raiseRecoverable(this.pos, "Numeric separator is not allowed at the first of digits");
      }
      lastCode = code;
      continue;
    }
    if (code >= 97) {
      val = code - 97 + 10;
    } else if (code >= 65) {
      val = code - 65 + 10;
    } else if (code >= 48 && code <= 57) {
      val = code - 48;
    } else {
      val = Infinity;
    }
    if (val >= radix) {
      break;
    }
    lastCode = code;
    total = total * radix + val;
  }
  if (allowSeparators && lastCode === 95) {
    this.raiseRecoverable(this.pos - 1, "Numeric separator is not allowed at the last of digits");
  }
  if (this.pos === start || len != null && this.pos - start !== len) {
    return null;
  }
  return total;
};
function stringToNumber(str, isLegacyOctalNumericLiteral) {
  if (isLegacyOctalNumericLiteral) {
    return parseInt(str, 8);
  }
  return parseFloat(str.replace(/_/g, ""));
}
function stringToBigInt(str) {
  if (typeof BigInt !== "function") {
    return null;
  }
  return BigInt(str.replace(/_/g, ""));
}
pp$9.readRadixNumber = function(radix) {
  var start = this.pos;
  this.pos += 2;
  var val = this.readInt(radix);
  if (val == null) {
    this.raise(this.start + 2, "Expected number in radix " + radix);
  }
  if (this.options.ecmaVersion >= 11 && this.input.charCodeAt(this.pos) === 110) {
    val = stringToBigInt(this.input.slice(start, this.pos));
    ++this.pos;
  } else if (isIdentifierStart(this.fullCharCodeAtPos())) {
    this.raise(this.pos, "Identifier directly after number");
  }
  return this.finishToken(types2.num, val);
};
pp$9.readNumber = function(startsWithDot) {
  var start = this.pos;
  if (!startsWithDot && this.readInt(10, void 0, true) === null) {
    this.raise(start, "Invalid number");
  }
  var octal = this.pos - start >= 2 && this.input.charCodeAt(start) === 48;
  if (octal && this.strict) {
    this.raise(start, "Invalid number");
  }
  var next = this.input.charCodeAt(this.pos);
  if (!octal && !startsWithDot && this.options.ecmaVersion >= 11 && next === 110) {
    var val$1 = stringToBigInt(this.input.slice(start, this.pos));
    ++this.pos;
    if (isIdentifierStart(this.fullCharCodeAtPos())) {
      this.raise(this.pos, "Identifier directly after number");
    }
    return this.finishToken(types2.num, val$1);
  }
  if (octal && /[89]/.test(this.input.slice(start, this.pos))) {
    octal = false;
  }
  if (next === 46 && !octal) {
    ++this.pos;
    this.readInt(10);
    next = this.input.charCodeAt(this.pos);
  }
  if ((next === 69 || next === 101) && !octal) {
    next = this.input.charCodeAt(++this.pos);
    if (next === 43 || next === 45) {
      ++this.pos;
    }
    if (this.readInt(10) === null) {
      this.raise(start, "Invalid number");
    }
  }
  if (isIdentifierStart(this.fullCharCodeAtPos())) {
    this.raise(this.pos, "Identifier directly after number");
  }
  var val = stringToNumber(this.input.slice(start, this.pos), octal);
  return this.finishToken(types2.num, val);
};
pp$9.readCodePoint = function() {
  var ch = this.input.charCodeAt(this.pos), code;
  if (ch === 123) {
    if (this.options.ecmaVersion < 6) {
      this.unexpected();
    }
    var codePos = ++this.pos;
    code = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos);
    ++this.pos;
    if (code > 1114111) {
      this.invalidStringToken(codePos, "Code point out of bounds");
    }
  } else {
    code = this.readHexChar(4);
  }
  return code;
};
function codePointToString$1(code) {
  if (code <= 65535) {
    return String.fromCharCode(code);
  }
  code -= 65536;
  return String.fromCharCode((code >> 10) + 55296, (code & 1023) + 56320);
}
pp$9.readString = function(quote) {
  var out = "", chunkStart = ++this.pos;
  for (; ; ) {
    if (this.pos >= this.input.length) {
      this.raise(this.start, "Unterminated string constant");
    }
    var ch = this.input.charCodeAt(this.pos);
    if (ch === quote) {
      break;
    }
    if (ch === 92) {
      out += this.input.slice(chunkStart, this.pos);
      out += this.readEscapedChar(false);
      chunkStart = this.pos;
    } else {
      if (isNewLine(ch, this.options.ecmaVersion >= 10)) {
        this.raise(this.start, "Unterminated string constant");
      }
      ++this.pos;
    }
  }
  out += this.input.slice(chunkStart, this.pos++);
  return this.finishToken(types2.string, out);
};
var INVALID_TEMPLATE_ESCAPE_ERROR = {};
pp$9.tryReadTemplateToken = function() {
  this.inTemplateElement = true;
  try {
    this.readTmplToken();
  } catch (err) {
    if (err === INVALID_TEMPLATE_ESCAPE_ERROR) {
      this.readInvalidTemplateToken();
    } else {
      throw err;
    }
  }
  this.inTemplateElement = false;
};
pp$9.invalidStringToken = function(position, message) {
  if (this.inTemplateElement && this.options.ecmaVersion >= 9) {
    throw INVALID_TEMPLATE_ESCAPE_ERROR;
  } else {
    this.raise(position, message);
  }
};
pp$9.readTmplToken = function() {
  var out = "", chunkStart = this.pos;
  for (; ; ) {
    if (this.pos >= this.input.length) {
      this.raise(this.start, "Unterminated template");
    }
    var ch = this.input.charCodeAt(this.pos);
    if (ch === 96 || ch === 36 && this.input.charCodeAt(this.pos + 1) === 123) {
      if (this.pos === this.start && (this.type === types2.template || this.type === types2.invalidTemplate)) {
        if (ch === 36) {
          this.pos += 2;
          return this.finishToken(types2.dollarBraceL);
        } else {
          ++this.pos;
          return this.finishToken(types2.backQuote);
        }
      }
      out += this.input.slice(chunkStart, this.pos);
      return this.finishToken(types2.template, out);
    }
    if (ch === 92) {
      out += this.input.slice(chunkStart, this.pos);
      out += this.readEscapedChar(true);
      chunkStart = this.pos;
    } else if (isNewLine(ch)) {
      out += this.input.slice(chunkStart, this.pos);
      ++this.pos;
      switch (ch) {
        case 13:
          if (this.input.charCodeAt(this.pos) === 10) {
            ++this.pos;
          }
        case 10:
          out += "\n";
          break;
        default:
          out += String.fromCharCode(ch);
          break;
      }
      if (this.options.locations) {
        ++this.curLine;
        this.lineStart = this.pos;
      }
      chunkStart = this.pos;
    } else {
      ++this.pos;
    }
  }
};
pp$9.readInvalidTemplateToken = function() {
  for (; this.pos < this.input.length; this.pos++) {
    switch (this.input[this.pos]) {
      case "\\":
        ++this.pos;
        break;
      case "$":
        if (this.input[this.pos + 1] !== "{") {
          break;
        }
      case "`":
        return this.finishToken(types2.invalidTemplate, this.input.slice(this.start, this.pos));
    }
  }
  this.raise(this.start, "Unterminated template");
};
pp$9.readEscapedChar = function(inTemplate) {
  var ch = this.input.charCodeAt(++this.pos);
  ++this.pos;
  switch (ch) {
    case 110:
      return "\n";
    case 114:
      return "\r";
    case 120:
      return String.fromCharCode(this.readHexChar(2));
    case 117:
      return codePointToString$1(this.readCodePoint());
    case 116:
      return "	";
    case 98:
      return "\b";
    case 118:
      return "\v";
    case 102:
      return "\f";
    case 13:
      if (this.input.charCodeAt(this.pos) === 10) {
        ++this.pos;
      }
    case 10:
      if (this.options.locations) {
        this.lineStart = this.pos;
        ++this.curLine;
      }
      return "";
    case 56:
    case 57:
      if (inTemplate) {
        var codePos = this.pos - 1;
        this.invalidStringToken(
          codePos,
          "Invalid escape sequence in template string"
        );
        return null;
      }
    default:
      if (ch >= 48 && ch <= 55) {
        var octalStr = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0];
        var octal = parseInt(octalStr, 8);
        if (octal > 255) {
          octalStr = octalStr.slice(0, -1);
          octal = parseInt(octalStr, 8);
        }
        this.pos += octalStr.length - 1;
        ch = this.input.charCodeAt(this.pos);
        if ((octalStr !== "0" || ch === 56 || ch === 57) && (this.strict || inTemplate)) {
          this.invalidStringToken(
            this.pos - 1 - octalStr.length,
            inTemplate ? "Octal literal in template string" : "Octal literal in strict mode"
          );
        }
        return String.fromCharCode(octal);
      }
      if (isNewLine(ch)) {
        return "";
      }
      return String.fromCharCode(ch);
  }
};
pp$9.readHexChar = function(len) {
  var codePos = this.pos;
  var n2 = this.readInt(16, len);
  if (n2 === null) {
    this.invalidStringToken(codePos, "Bad character escape sequence");
  }
  return n2;
};
pp$9.readWord1 = function() {
  this.containsEsc = false;
  var word = "", first = true, chunkStart = this.pos;
  var astral = this.options.ecmaVersion >= 6;
  while (this.pos < this.input.length) {
    var ch = this.fullCharCodeAtPos();
    if (isIdentifierChar(ch, astral)) {
      this.pos += ch <= 65535 ? 1 : 2;
    } else if (ch === 92) {
      this.containsEsc = true;
      word += this.input.slice(chunkStart, this.pos);
      var escStart = this.pos;
      if (this.input.charCodeAt(++this.pos) !== 117) {
        this.invalidStringToken(this.pos, "Expecting Unicode escape sequence \\uXXXX");
      }
      ++this.pos;
      var esc = this.readCodePoint();
      if (!(first ? isIdentifierStart : isIdentifierChar)(esc, astral)) {
        this.invalidStringToken(escStart, "Invalid Unicode escape");
      }
      word += codePointToString$1(esc);
      chunkStart = this.pos;
    } else {
      break;
    }
    first = false;
  }
  return word + this.input.slice(chunkStart, this.pos);
};
pp$9.readWord = function() {
  var word = this.readWord1();
  var type = types2.name;
  if (this.keywords.test(word)) {
    type = keywords$1[word];
  }
  return this.finishToken(type, word);
};
var version = "7.4.1";
Parser2.acorn = {
  Parser: Parser2,
  version,
  defaultOptions,
  Position,
  SourceLocation,
  getLineInfo,
  Node: Node3,
  TokenType,
  tokTypes: types2,
  keywordTypes: keywords$1,
  TokContext,
  tokContexts: types$1,
  isIdentifierChar,
  isIdentifierStart,
  Token,
  isNewLine,
  lineBreak,
  lineBreakG,
  nonASCIIwhitespace
};
function parse3(input, options) {
  return Parser2.parse(input, options);
}

// node_modules/eval5/dist/esm/interpreter/messages.js
var ThrowError = class extends Error {
};
var ThrowSyntaxError = class extends SyntaxError {
};
var ThrowReferenceError = class extends ReferenceError {
};
var ThrowTypeError = class extends TypeError {
};
var InterruptThrowError = class extends ThrowError {
};
var InterruptThrowSyntaxError = class extends ThrowSyntaxError {
};
var InterruptThrowReferenceError = class extends ThrowReferenceError {
};
var Messages = {
  UnknownError: [3001, "%0", InterruptThrowError],
  ExecutionTimeOutError: [3002, "Script execution timed out after %0ms", InterruptThrowError],
  NodeTypeSyntaxError: [1001, "Unknown node type: %0", InterruptThrowReferenceError],
  BinaryOperatorSyntaxError: [1002, "Unknown binary operator: %0", InterruptThrowReferenceError],
  LogicalOperatorSyntaxError: [
    1003,
    "Unknown logical operator: %0",
    InterruptThrowReferenceError
  ],
  UnaryOperatorSyntaxError: [1004, "Unknown unary operator: %0", InterruptThrowReferenceError],
  UpdateOperatorSyntaxError: [1005, "Unknown update operator: %0", InterruptThrowReferenceError],
  ObjectStructureSyntaxError: [
    1006,
    "Unknown object structure: %0",
    InterruptThrowReferenceError
  ],
  AssignmentExpressionSyntaxError: [
    1007,
    "Unknown assignment expression: %0",
    InterruptThrowReferenceError
  ],
  VariableTypeSyntaxError: [1008, "Unknown variable type: %0", InterruptThrowReferenceError],
  ParamTypeSyntaxError: [1009, "Unknown param type: %0", InterruptThrowReferenceError],
  AssignmentTypeSyntaxError: [1010, "Unknown assignment type: %0", InterruptThrowReferenceError],
  FunctionUndefinedReferenceError: [2001, "%0 is not a function", ThrowReferenceError],
  VariableUndefinedReferenceError: [2002, "%0 is not defined", ThrowReferenceError],
  IsNotConstructor: [2003, "%0 is not a constructor", ThrowTypeError]
};

// node_modules/eval5/dist/esm/interpreter/main.js
var version2 = "1.4.8";
function defineFunctionName(func, name) {
  Object.defineProperty(func, "name", {
    value: name,
    writable: false,
    enumerable: false,
    configurable: true
  });
}
var hasOwnProperty2 = Object.prototype.hasOwnProperty;
var Break = Symbol("Break");
var Continue = Symbol("Continue");
var DefaultCase = Symbol("DefaultCase");
var EmptyStatementReturn = Symbol("EmptyStatementReturn");
var WithScopeName = Symbol("WithScopeName");
var SuperScopeName = Symbol("SuperScopeName");
var RootScopeName = Symbol("RootScopeName");
var GlobalScopeName = Symbol("GlobalScopeName");
function isFunction(func) {
  return typeof func === "function";
}
var InternalInterpreterReflection = class {
  constructor(interpreter) {
    this.interpreter = interpreter;
  }
  generator() {
    const interpreter = this.interpreter;
    function getCurrentScope() {
      return this.getCurrentScope();
    }
    function getGlobalScope() {
      return this.getGlobalScope();
    }
    function getCurrentContext() {
      return this.getCurrentContext();
    }
    return {
      getOptions: interpreter.getOptions.bind(interpreter),
      getCurrentScope: getCurrentScope.bind(interpreter),
      getGlobalScope: getGlobalScope.bind(interpreter),
      getCurrentContext: getCurrentContext.bind(interpreter),
      getExecStartTime: interpreter.getExecStartTime.bind(interpreter)
    };
  }
};
function internalEval(reflection, code, useGlobalScope = true) {
  if (!(reflection instanceof InternalInterpreterReflection)) {
    throw new Error("Illegal call");
  }
  if (typeof code !== "string")
    return code;
  if (!code)
    return void 0;
  const instance = reflection.generator();
  const opts = instance.getOptions();
  const options = {
    timeout: opts.timeout,
    _initEnv: function() {
      if (!useGlobalScope) {
        this.setCurrentContext(instance.getCurrentContext());
      }
      this.execStartTime = instance.getExecStartTime();
      this.execEndTime = this.execStartTime;
    }
  };
  const currentScope = useGlobalScope ? instance.getGlobalScope() : instance.getCurrentScope();
  const interpreter = new Interpreter(currentScope, options);
  return interpreter.evaluate(code);
}
Object.defineProperty(internalEval, "__IS_EVAL_FUNC", {
  value: true,
  writable: false,
  enumerable: false,
  configurable: false
});
function internalFunction(reflection, ...params) {
  if (!(reflection instanceof InternalInterpreterReflection)) {
    throw new Error("Illegal call");
  }
  const instance = reflection.generator();
  const code = params.pop();
  const interpreter = new Interpreter(instance.getGlobalScope(), instance.getOptions());
  const wrapCode = `
		    (function anonymous(${params.join(",")}){
		        ${code}
		    });
		    `;
  return interpreter.evaluate(wrapCode);
}
Object.defineProperty(internalFunction, "__IS_FUNCTION_FUNC", {
  value: true,
  writable: false,
  enumerable: false,
  configurable: false
});
var Return = class {
  constructor(value) {
    this.value = value;
  }
};
var BreakLabel = class {
  constructor(value) {
    this.value = value;
  }
};
var ContinueLabel = class {
  constructor(value) {
    this.value = value;
  }
};
var Scope4 = class {
  constructor(data2, parent = null, name) {
    this.name = name;
    this.parent = parent;
    this.data = data2;
    this.labelStack = [];
  }
};
function noop() {
}
function createScope(parent = null, name) {
  return new Scope4(/* @__PURE__ */ Object.create(null), parent, name);
}
function createRootContext(data2) {
  return Object.create(data2);
}
var BuildInObjects = {
  NaN: NaN,
  Infinity: Infinity,
  undefined: void 0,
  // null,
  Object,
  Array,
  String,
  Boolean,
  Number,
  Date,
  RegExp,
  Error,
  URIError,
  TypeError,
  RangeError,
  SyntaxError,
  ReferenceError,
  Math,
  parseInt,
  parseFloat,
  isNaN,
  isFinite,
  decodeURI,
  decodeURIComponent,
  encodeURI,
  encodeURIComponent,
  escape,
  unescape,
  eval: internalEval,
  Function: internalFunction
};
if (typeof JSON !== "undefined") {
  BuildInObjects.JSON = JSON;
}
if (typeof Promise !== "undefined") {
  BuildInObjects.Promise = Promise;
}
if (typeof Set !== "undefined") {
  BuildInObjects.Set = Set;
}
if (typeof Map !== "undefined") {
  BuildInObjects.Map = Map;
}
if (typeof Symbol !== "undefined") {
  BuildInObjects.Symbol = Symbol;
}
if (typeof Proxy !== "undefined") {
  BuildInObjects.Proxy = Proxy;
}
if (typeof WeakMap !== "undefined") {
  BuildInObjects.WeakMap = WeakMap;
}
if (typeof WeakSet !== "undefined") {
  BuildInObjects.WeakSet = WeakSet;
}
if (typeof Reflect !== "undefined") {
  BuildInObjects.Reflect = Reflect;
}
var Interpreter = class _Interpreter {
  constructor(context = _Interpreter.global, options = {}) {
    this.sourceList = [];
    this.collectDeclVars = /* @__PURE__ */ Object.create(null);
    this.collectDeclFuncs = /* @__PURE__ */ Object.create(null);
    this.isVarDeclMode = false;
    this.lastExecNode = null;
    this.isRunning = false;
    this.options = {
      ecmaVersion: options.ecmaVersion || _Interpreter.ecmaVersion,
      timeout: options.timeout || 0,
      rootContext: options.rootContext,
      globalContextInFunction: options.globalContextInFunction === void 0 ? _Interpreter.globalContextInFunction : options.globalContextInFunction,
      _initEnv: options._initEnv
    };
    this.context = context || /* @__PURE__ */ Object.create(null);
    this.callStack = [];
    this.initEnvironment(this.context);
  }
  initEnvironment(ctx) {
    let scope;
    if (ctx instanceof Scope4) {
      scope = ctx;
    } else {
      let rootScope = null;
      const superScope = this.createSuperScope(ctx);
      if (this.options.rootContext) {
        rootScope = new Scope4(createRootContext(this.options.rootContext), superScope, RootScopeName);
      }
      scope = new Scope4(ctx, rootScope || superScope, GlobalScopeName);
    }
    this.globalScope = scope;
    this.currentScope = this.globalScope;
    this.globalContext = scope.data;
    this.currentContext = scope.data;
    this.collectDeclVars = /* @__PURE__ */ Object.create(null);
    this.collectDeclFuncs = /* @__PURE__ */ Object.create(null);
    this.execStartTime = Date.now();
    this.execEndTime = this.execStartTime;
    const _initEnv = this.options._initEnv;
    if (_initEnv) {
      _initEnv.call(this);
    }
  }
  getExecStartTime() {
    return this.execStartTime;
  }
  getExecutionTime() {
    return this.execEndTime - this.execStartTime;
  }
  setExecTimeout(timeout = 0) {
    this.options.timeout = timeout;
  }
  getOptions() {
    return this.options;
  }
  getGlobalScope() {
    return this.globalScope;
  }
  getCurrentScope() {
    return this.currentScope;
  }
  getCurrentContext() {
    return this.currentContext;
  }
  isInterruptThrow(err) {
    return err instanceof InterruptThrowError || err instanceof InterruptThrowReferenceError || err instanceof InterruptThrowSyntaxError;
  }
  createSuperScope(ctx) {
    let data2 = Object.assign({}, BuildInObjects);
    const buildInObjectKeys = Object.keys(data2);
    buildInObjectKeys.forEach((key) => {
      if (key in ctx) {
        delete data2[key];
      }
    });
    return new Scope4(data2, null, SuperScopeName);
  }
  setCurrentContext(ctx) {
    this.currentContext = ctx;
  }
  setCurrentScope(scope) {
    this.currentScope = scope;
  }
  evaluate(code = "") {
    let node;
    if (!code)
      return;
    node = parse3(code, {
      ranges: true,
      locations: true,
      ecmaVersion: this.options.ecmaVersion || _Interpreter.ecmaVersion
    });
    return this.evaluateNode(node, code);
  }
  appendCode(code) {
    return this.evaluate(code);
  }
  evaluateNode(node, source = "") {
    this.value = void 0;
    this.source = source;
    this.sourceList.push(source);
    this.isRunning = true;
    this.execStartTime = Date.now();
    this.execEndTime = this.execStartTime;
    this.collectDeclVars = /* @__PURE__ */ Object.create(null);
    this.collectDeclFuncs = /* @__PURE__ */ Object.create(null);
    const currentScope = this.getCurrentScope();
    const currentContext = this.getCurrentContext();
    const labelStack = currentScope.labelStack.concat([]);
    const callStack = this.callStack.concat([]);
    const reset2 = () => {
      this.setCurrentScope(currentScope);
      this.setCurrentContext(currentContext);
      currentScope.labelStack = labelStack;
      this.callStack = callStack;
    };
    try {
      const bodyClosure = this.createClosure(node);
      this.addDeclarationsToScope(this.collectDeclVars, this.collectDeclFuncs, this.getCurrentScope());
      bodyClosure();
    } catch (e) {
      throw e;
    } finally {
      reset2();
      this.execEndTime = Date.now();
    }
    this.isRunning = false;
    return this.getValue();
  }
  createErrorMessage(msg, value, node) {
    let message = msg[1].replace("%0", String(value));
    if (node !== null) {
      message += this.getNodePosition(node || this.lastExecNode);
    }
    return message;
  }
  createError(message, error) {
    return new error(message);
  }
  createThrowError(message, error) {
    return this.createError(message, error);
  }
  createInternalThrowError(msg, value, node) {
    return this.createError(this.createErrorMessage(msg, value, node), msg[2]);
  }
  checkTimeout() {
    if (!this.isRunning)
      return false;
    const timeout = this.options.timeout || 0;
    const now = Date.now();
    if (now - this.execStartTime > timeout) {
      return true;
    }
    return false;
  }
  getNodePosition(node) {
    if (node) {
      const errorCode = "";
      return node.loc ? ` [${node.loc.start.line}:${node.loc.start.column}]${errorCode}` : "";
    }
    return "";
  }
  createClosure(node) {
    let closure;
    switch (node.type) {
      case "BinaryExpression":
        closure = this.binaryExpressionHandler(node);
        break;
      case "LogicalExpression":
        closure = this.logicalExpressionHandler(node);
        break;
      case "UnaryExpression":
        closure = this.unaryExpressionHandler(node);
        break;
      case "UpdateExpression":
        closure = this.updateExpressionHandler(node);
        break;
      case "ObjectExpression":
        closure = this.objectExpressionHandler(node);
        break;
      case "ArrayExpression":
        closure = this.arrayExpressionHandler(node);
        break;
      case "CallExpression":
        closure = this.callExpressionHandler(node);
        break;
      case "NewExpression":
        closure = this.newExpressionHandler(node);
        break;
      case "MemberExpression":
        closure = this.memberExpressionHandler(node);
        break;
      case "ThisExpression":
        closure = this.thisExpressionHandler(node);
        break;
      case "SequenceExpression":
        closure = this.sequenceExpressionHandler(node);
        break;
      case "Literal":
        closure = this.literalHandler(node);
        break;
      case "Identifier":
        closure = this.identifierHandler(node);
        break;
      case "AssignmentExpression":
        closure = this.assignmentExpressionHandler(node);
        break;
      case "FunctionDeclaration":
        closure = this.functionDeclarationHandler(node);
        break;
      case "VariableDeclaration":
        closure = this.variableDeclarationHandler(node);
        break;
      case "BlockStatement":
      case "Program":
        closure = this.programHandler(node);
        break;
      case "ExpressionStatement":
        closure = this.expressionStatementHandler(node);
        break;
      case "EmptyStatement":
        closure = this.emptyStatementHandler(node);
        break;
      case "ReturnStatement":
        closure = this.returnStatementHandler(node);
        break;
      case "FunctionExpression":
        closure = this.functionExpressionHandler(node);
        break;
      case "IfStatement":
        closure = this.ifStatementHandler(node);
        break;
      case "ConditionalExpression":
        closure = this.conditionalExpressionHandler(node);
        break;
      case "ForStatement":
        closure = this.forStatementHandler(node);
        break;
      case "WhileStatement":
        closure = this.whileStatementHandler(node);
        break;
      case "DoWhileStatement":
        closure = this.doWhileStatementHandler(node);
        break;
      case "ForInStatement":
        closure = this.forInStatementHandler(node);
        break;
      case "WithStatement":
        closure = this.withStatementHandler(node);
        break;
      case "ThrowStatement":
        closure = this.throwStatementHandler(node);
        break;
      case "TryStatement":
        closure = this.tryStatementHandler(node);
        break;
      case "ContinueStatement":
        closure = this.continueStatementHandler(node);
        break;
      case "BreakStatement":
        closure = this.breakStatementHandler(node);
        break;
      case "SwitchStatement":
        closure = this.switchStatementHandler(node);
        break;
      case "LabeledStatement":
        closure = this.labeledStatementHandler(node);
        break;
      case "DebuggerStatement":
        closure = this.debuggerStatementHandler(node);
        break;
      default:
        throw this.createInternalThrowError(Messages.NodeTypeSyntaxError, node.type, node);
    }
    return (...args) => {
      const timeout = this.options.timeout;
      if (timeout && timeout > 0 && this.checkTimeout()) {
        throw this.createInternalThrowError(Messages.ExecutionTimeOutError, timeout, null);
      }
      this.lastExecNode = node;
      return closure(...args);
    };
  }
  // a==b a/b
  binaryExpressionHandler(node) {
    const leftExpression = this.createClosure(node.left);
    const rightExpression = this.createClosure(node.right);
    return () => {
      const leftValue = leftExpression();
      const rightValue = rightExpression();
      switch (node.operator) {
        case "==":
          return leftValue == rightValue;
        case "!=":
          return leftValue != rightValue;
        case "===":
          return leftValue === rightValue;
        case "!==":
          return leftValue !== rightValue;
        case "<":
          return leftValue < rightValue;
        case "<=":
          return leftValue <= rightValue;
        case ">":
          return leftValue > rightValue;
        case ">=":
          return leftValue >= rightValue;
        case "<<":
          return leftValue << rightValue;
        case ">>":
          return leftValue >> rightValue;
        case ">>>":
          return leftValue >>> rightValue;
        case "+":
          return leftValue + rightValue;
        case "-":
          return leftValue - rightValue;
        case "*":
          return leftValue * rightValue;
        case "**":
          return Math.pow(leftValue, rightValue);
        case "/":
          return leftValue / rightValue;
        case "%":
          return leftValue % rightValue;
        case "|":
          return leftValue | rightValue;
        case "^":
          return leftValue ^ rightValue;
        case "&":
          return leftValue & rightValue;
        case "in":
          return leftValue in rightValue;
        case "instanceof":
          return leftValue instanceof rightValue;
        default:
          throw this.createInternalThrowError(Messages.BinaryOperatorSyntaxError, node.operator, node);
      }
    };
  }
  // a && b
  logicalExpressionHandler(node) {
    const leftExpression = this.createClosure(node.left);
    const rightExpression = this.createClosure(node.right);
    return () => {
      switch (node.operator) {
        case "||":
          return leftExpression() || rightExpression();
        case "&&":
          return leftExpression() && rightExpression();
        default:
          throw this.createInternalThrowError(Messages.LogicalOperatorSyntaxError, node.operator, node);
      }
    };
  }
  // protected isRootScope(node: ESTree.Expression | ESTree.Pattern): boolean {
  // 	if (node.type === "Identifier") {
  // 		const scope = this.getScopeFromName(node.name, this.getCurrentScope());
  // 		return scope.name === "rootScope";
  // 	}
  // 	return false;
  // }
  // typeof a !a()
  unaryExpressionHandler(node) {
    switch (node.operator) {
      case "delete":
        const objectGetter = this.createObjectGetter(node.argument);
        const nameGetter = this.createNameGetter(node.argument);
        return () => {
          let obj = objectGetter();
          const name = nameGetter();
          return delete obj[name];
        };
      default:
        let expression;
        if (node.operator === "typeof" && node.argument.type === "Identifier") {
          const objectGetter2 = this.createObjectGetter(node.argument);
          const nameGetter2 = this.createNameGetter(node.argument);
          expression = () => objectGetter2()[nameGetter2()];
        } else {
          expression = this.createClosure(node.argument);
        }
        return () => {
          const value = expression();
          switch (node.operator) {
            case "-":
              return -value;
            case "+":
              return +value;
            case "!":
              return !value;
            case "~":
              return ~value;
            case "void":
              return void 0;
            case "typeof":
              return typeof value;
            default:
              throw this.createInternalThrowError(Messages.UnaryOperatorSyntaxError, node.operator, node);
          }
        };
    }
  }
  // ++a --a
  updateExpressionHandler(node) {
    const objectGetter = this.createObjectGetter(node.argument);
    const nameGetter = this.createNameGetter(node.argument);
    return () => {
      const obj = objectGetter();
      const name = nameGetter();
      this.assertVariable(obj, name, node);
      switch (node.operator) {
        case "++":
          return node.prefix ? ++obj[name] : obj[name]++;
        case "--":
          return node.prefix ? --obj[name] : obj[name]--;
        default:
          throw this.createInternalThrowError(Messages.UpdateOperatorSyntaxError, node.operator, node);
      }
    };
  }
  // var o = {a: 1, b: 's', get name(){}, set name(){}  ...}
  objectExpressionHandler(node) {
    const items = [];
    function getKey(keyNode) {
      if (keyNode.type === "Identifier") {
        return keyNode.name;
      } else if (keyNode.type === "Literal") {
        return keyNode.value;
      } else {
        return this.throwError(Messages.ObjectStructureSyntaxError, keyNode.type, keyNode);
      }
    }
    const properties = /* @__PURE__ */ Object.create(null);
    node.properties.forEach((property) => {
      const kind = property.kind;
      const key = getKey(property.key);
      if (!properties[key] || kind === "init") {
        properties[key] = {};
      }
      properties[key][kind] = this.createClosure(property.value);
      items.push({
        key,
        property
      });
    });
    return () => {
      const result = {};
      const len = items.length;
      for (let i = 0; i < len; i++) {
        const item = items[i];
        const key = item.key;
        const kinds = properties[key];
        const value = kinds.init ? kinds.init() : void 0;
        const getter = kinds.get ? kinds.get() : function() {
        };
        const setter = kinds.set ? kinds.set() : function(a) {
        };
        if ("set" in kinds || "get" in kinds) {
          const descriptor = {
            configurable: true,
            enumerable: true,
            get: getter,
            set: setter
          };
          Object.defineProperty(result, key, descriptor);
        } else {
          const property = item.property;
          const kind = property.kind;
          if (property.key.type === "Identifier" && property.value.type === "FunctionExpression" && kind === "init" && !property.value.id) {
            defineFunctionName(value, property.key.name);
          }
          result[key] = value;
        }
      }
      return result;
    };
  }
  // [1,2,3]
  arrayExpressionHandler(node) {
    const items = node.elements.map((element) => element ? this.createClosure(element) : element);
    return () => {
      const len = items.length;
      const result = Array(len);
      for (let i = 0; i < len; i++) {
        const item = items[i];
        if (item) {
          result[i] = item();
        }
      }
      return result;
    };
  }
  safeObjectGet(obj, key, node) {
    return obj[key];
  }
  createCallFunctionGetter(node) {
    switch (node.type) {
      case "MemberExpression":
        const objectGetter = this.createClosure(node.object);
        const keyGetter = this.createMemberKeyGetter(node);
        const source = this.source;
        return () => {
          const obj = objectGetter();
          const key = keyGetter();
          const func = this.safeObjectGet(obj, key, node);
          if (!func || !isFunction(func)) {
            const name = source.slice(node.start, node.end);
            throw this.createInternalThrowError(Messages.FunctionUndefinedReferenceError, name, node);
          }
          if (func.__IS_EVAL_FUNC) {
            return (code) => {
              return func(new InternalInterpreterReflection(this), code, true);
            };
          }
          if (func.__IS_FUNCTION_FUNC) {
            return (...args) => {
              return func(new InternalInterpreterReflection(this), ...args);
            };
          }
          return func.bind(obj);
        };
      default:
        const closure = this.createClosure(node);
        return () => {
          let name = "";
          if (node.type === "Identifier") {
            name = node.name;
          }
          const func = closure();
          if (!func || !isFunction(func)) {
            throw this.createInternalThrowError(Messages.FunctionUndefinedReferenceError, name, node);
          }
          if (node.type === "Identifier" && func.__IS_EVAL_FUNC && name === "eval") {
            return (code) => {
              const scope = this.getScopeFromName(name, this.getCurrentScope());
              const useGlobalScope = scope.name === SuperScopeName || // !scope.parent || // super scope
              scope.name === GlobalScopeName || // this.globalScope === scope ||
              scope.name === RootScopeName;
              return func(new InternalInterpreterReflection(this), code, !useGlobalScope);
            };
          }
          if (func.__IS_EVAL_FUNC) {
            return (code) => {
              return func(new InternalInterpreterReflection(this), code, true);
            };
          }
          if (func.__IS_FUNCTION_FUNC) {
            return (...args) => {
              return func(new InternalInterpreterReflection(this), ...args);
            };
          }
          let ctx = this.options.globalContextInFunction;
          if (node.type === "Identifier") {
            const scope = this.getIdentifierScope(node);
            if (scope.name === WithScopeName) {
              ctx = scope.data;
            }
          }
          return func.bind(ctx);
        };
    }
  }
  // func()
  callExpressionHandler(node) {
    const funcGetter = this.createCallFunctionGetter(node.callee);
    const argsGetter = node.arguments.map((arg) => this.createClosure(arg));
    return () => {
      return funcGetter()(...argsGetter.map((arg) => arg()));
    };
  }
  // var f = function() {...}
  functionExpressionHandler(node) {
    const self2 = this;
    const source = this.source;
    const oldDeclVars = this.collectDeclVars;
    const oldDeclFuncs = this.collectDeclFuncs;
    this.collectDeclVars = /* @__PURE__ */ Object.create(null);
    this.collectDeclFuncs = /* @__PURE__ */ Object.create(null);
    const name = node.id ? node.id.name : "";
    const paramLength = node.params.length;
    const paramsGetter = node.params.map((param) => this.createParamNameGetter(param));
    const bodyClosure = this.createClosure(node.body);
    const declVars = this.collectDeclVars;
    const declFuncs = this.collectDeclFuncs;
    this.collectDeclVars = oldDeclVars;
    this.collectDeclFuncs = oldDeclFuncs;
    return () => {
      const runtimeScope = self2.getCurrentScope();
      const func = function(...args) {
        self2.callStack.push(`${name}`);
        const prevScope = self2.getCurrentScope();
        const currentScope = createScope(runtimeScope, `FunctionScope(${name})`);
        self2.setCurrentScope(currentScope);
        self2.addDeclarationsToScope(declVars, declFuncs, currentScope);
        if (name) {
          currentScope.data[name] = func;
        }
        currentScope.data["arguments"] = arguments;
        paramsGetter.forEach((getter, i) => {
          currentScope.data[getter()] = args[i];
        });
        const prevContext = self2.getCurrentContext();
        self2.setCurrentContext(this);
        const result = bodyClosure();
        self2.setCurrentContext(prevContext);
        self2.setCurrentScope(prevScope);
        self2.callStack.pop();
        if (result instanceof Return) {
          return result.value;
        }
      };
      defineFunctionName(func, name);
      Object.defineProperty(func, "length", {
        value: paramLength,
        writable: false,
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(func, "toString", {
        value: () => {
          return source.slice(node.start, node.end);
        },
        writable: true,
        configurable: true,
        enumerable: false
      });
      Object.defineProperty(func, "valueOf", {
        value: () => {
          return source.slice(node.start, node.end);
        },
        writable: true,
        configurable: true,
        enumerable: false
      });
      return func;
    };
  }
  // new Ctrl()
  newExpressionHandler(node) {
    const source = this.source;
    const expression = this.createClosure(node.callee);
    const args = node.arguments.map((arg) => this.createClosure(arg));
    return () => {
      const construct = expression();
      if (!isFunction(construct) || construct.__IS_EVAL_FUNC) {
        const callee = node.callee;
        const name = source.slice(callee.start, callee.end);
        throw this.createInternalThrowError(Messages.IsNotConstructor, name, node);
      }
      if (construct.__IS_FUNCTION_FUNC) {
        return construct(new InternalInterpreterReflection(this), ...args.map((arg) => arg()));
      }
      return new construct(...args.map((arg) => arg()));
    };
  }
  // a.b a['b']
  memberExpressionHandler(node) {
    const objectGetter = this.createClosure(node.object);
    const keyGetter = this.createMemberKeyGetter(node);
    return () => {
      const obj = objectGetter();
      let key = keyGetter();
      return obj[key];
    };
  }
  //this
  thisExpressionHandler(node) {
    return () => this.getCurrentContext();
  }
  // var1,var2,...
  sequenceExpressionHandler(node) {
    const expressions = node.expressions.map((item) => this.createClosure(item));
    return () => {
      let result;
      const len = expressions.length;
      for (let i = 0; i < len; i++) {
        const expression = expressions[i];
        result = expression();
      }
      return result;
    };
  }
  // 1 'name'
  literalHandler(node) {
    return () => {
      if (node.regex) {
        return new RegExp(node.regex.pattern, node.regex.flags);
      }
      return node.value;
    };
  }
  // var1 ...
  identifierHandler(node) {
    return () => {
      const currentScope = this.getCurrentScope();
      const data2 = this.getScopeDataFromName(node.name, currentScope);
      this.assertVariable(data2, node.name, node);
      return data2[node.name];
    };
  }
  getIdentifierScope(node) {
    const currentScope = this.getCurrentScope();
    const scope = this.getScopeFromName(node.name, currentScope);
    return scope;
  }
  // a=1 a+=2
  assignmentExpressionHandler(node) {
    if (node.left.type === "Identifier" && node.right.type === "FunctionExpression" && !node.right.id) {
      node.right.id = {
        type: "Identifier",
        name: node.left.name
      };
    }
    const dataGetter = this.createObjectGetter(node.left);
    const nameGetter = this.createNameGetter(node.left);
    const rightValueGetter = this.createClosure(node.right);
    return () => {
      const data2 = dataGetter();
      const name = nameGetter();
      const rightValue = rightValueGetter();
      if (node.operator !== "=") {
        this.assertVariable(data2, name, node);
      }
      switch (node.operator) {
        case "=":
          return data2[name] = rightValue;
        case "+=":
          return data2[name] += rightValue;
        case "-=":
          return data2[name] -= rightValue;
        case "*=":
          return data2[name] *= rightValue;
        case "**=":
          return data2[name] = Math.pow(data2[name], rightValue);
        case "/=":
          return data2[name] /= rightValue;
        case "%=":
          return data2[name] %= rightValue;
        case "<<=":
          return data2[name] <<= rightValue;
        case ">>=":
          return data2[name] >>= rightValue;
        case ">>>=":
          return data2[name] >>>= rightValue;
        case "&=":
          return data2[name] &= rightValue;
        case "^=":
          return data2[name] ^= rightValue;
        case "|=":
          return data2[name] |= rightValue;
        default:
          throw this.createInternalThrowError(Messages.AssignmentExpressionSyntaxError, node.type, node);
      }
    };
  }
  // function test(){}
  functionDeclarationHandler(node) {
    if (node.id) {
      const functionClosure = this.functionExpressionHandler(node);
      Object.defineProperty(functionClosure, "isFunctionDeclareClosure", {
        value: true,
        writable: false,
        configurable: false,
        enumerable: false
      });
      this.funcDeclaration(node.id.name, functionClosure);
    }
    return () => {
      return EmptyStatementReturn;
    };
  }
  getVariableName(node) {
    if (node.type === "Identifier") {
      return node.name;
    } else {
      throw this.createInternalThrowError(Messages.VariableTypeSyntaxError, node.type, node);
    }
  }
  // var i;
  // var i=1;
  variableDeclarationHandler(node) {
    let assignmentsClosure;
    const assignments = [];
    for (let i = 0; i < node.declarations.length; i++) {
      const decl = node.declarations[i];
      this.varDeclaration(this.getVariableName(decl.id));
      if (decl.init) {
        assignments.push({
          type: "AssignmentExpression",
          operator: "=",
          left: decl.id,
          right: decl.init
        });
      }
    }
    if (assignments.length) {
      assignmentsClosure = this.createClosure({
        type: "BlockStatement",
        body: assignments
      });
    }
    return () => {
      if (assignmentsClosure) {
        const oldValue = this.isVarDeclMode;
        this.isVarDeclMode = true;
        assignmentsClosure();
        this.isVarDeclMode = oldValue;
      }
      return EmptyStatementReturn;
    };
  }
  assertVariable(data2, name, node) {
    if (data2 === this.globalScope.data && !(name in data2)) {
      throw this.createInternalThrowError(Messages.VariableUndefinedReferenceError, name, node);
    }
  }
  // {...}
  programHandler(node) {
    const stmtClosures = node.body.map((stmt) => {
      return this.createClosure(stmt);
    });
    return () => {
      let result = EmptyStatementReturn;
      for (let i = 0; i < stmtClosures.length; i++) {
        const stmtClosure = stmtClosures[i];
        const ret = this.setValue(stmtClosure());
        if (ret === EmptyStatementReturn)
          continue;
        result = ret;
        if (result instanceof Return || result instanceof BreakLabel || result instanceof ContinueLabel || result === Break || result === Continue) {
          break;
        }
      }
      return result;
    };
  }
  // all expression: a+1 a&&b a() a.b ...
  expressionStatementHandler(node) {
    return this.createClosure(node.expression);
  }
  emptyStatementHandler(node) {
    return () => EmptyStatementReturn;
  }
  // return xx;
  returnStatementHandler(node) {
    const argumentClosure = node.argument ? this.createClosure(node.argument) : noop;
    return () => new Return(argumentClosure());
  }
  // if else
  ifStatementHandler(node) {
    const testClosure = this.createClosure(node.test);
    const consequentClosure = this.createClosure(node.consequent);
    const alternateClosure = node.alternate ? this.createClosure(node.alternate) : (
      /*!important*/
      () => EmptyStatementReturn
    );
    return () => {
      return testClosure() ? consequentClosure() : alternateClosure();
    };
  }
  // test() ? true : false
  conditionalExpressionHandler(node) {
    return this.ifStatementHandler(node);
  }
  // for(var i = 0; i < 10; i++) {...}
  forStatementHandler(node) {
    let initClosure = noop;
    let testClosure = node.test ? this.createClosure(node.test) : () => true;
    let updateClosure = noop;
    const bodyClosure = this.createClosure(node.body);
    if (node.type === "ForStatement") {
      initClosure = node.init ? this.createClosure(node.init) : initClosure;
      updateClosure = node.update ? this.createClosure(node.update) : noop;
    }
    return (pNode) => {
      let labelName;
      let result = EmptyStatementReturn;
      let shouldInitExec = node.type === "DoWhileStatement";
      if (pNode && pNode.type === "LabeledStatement") {
        labelName = pNode.label.name;
      }
      for (initClosure(); shouldInitExec || testClosure(); updateClosure()) {
        shouldInitExec = false;
        const ret = this.setValue(bodyClosure());
        if (ret === EmptyStatementReturn || ret === Continue)
          continue;
        if (ret === Break) {
          break;
        }
        result = ret;
        if (result instanceof ContinueLabel && result.value === labelName) {
          result = EmptyStatementReturn;
          continue;
        }
        if (result instanceof Return || result instanceof BreakLabel || result instanceof ContinueLabel) {
          break;
        }
      }
      return result;
    };
  }
  // while(1) {...}
  whileStatementHandler(node) {
    return this.forStatementHandler(node);
  }
  doWhileStatementHandler(node) {
    return this.forStatementHandler(node);
  }
  forInStatementHandler(node) {
    let left = node.left;
    const rightClosure = this.createClosure(node.right);
    const bodyClosure = this.createClosure(node.body);
    if (node.left.type === "VariableDeclaration") {
      this.createClosure(node.left)();
      left = node.left.declarations[0].id;
    }
    return (pNode) => {
      let labelName;
      let result = EmptyStatementReturn;
      let x;
      if (pNode && pNode.type === "LabeledStatement") {
        labelName = pNode.label.name;
      }
      const data2 = rightClosure();
      for (x in data2) {
        this.assignmentExpressionHandler({
          type: "AssignmentExpression",
          operator: "=",
          left,
          right: {
            type: "Literal",
            value: x
          }
        })();
        const ret = this.setValue(bodyClosure());
        if (ret === EmptyStatementReturn || ret === Continue)
          continue;
        if (ret === Break) {
          break;
        }
        result = ret;
        if (result instanceof ContinueLabel && result.value === labelName) {
          result = EmptyStatementReturn;
          continue;
        }
        if (result instanceof Return || result instanceof BreakLabel || result instanceof ContinueLabel) {
          break;
        }
      }
      return result;
    };
  }
  withStatementHandler(node) {
    const objectClosure = this.createClosure(node.object);
    const bodyClosure = this.createClosure(node.body);
    return () => {
      const data2 = objectClosure();
      const currentScope = this.getCurrentScope();
      const newScope = new Scope4(data2, currentScope, WithScopeName);
      this.setCurrentScope(newScope);
      const result = this.setValue(bodyClosure());
      this.setCurrentScope(currentScope);
      return result;
    };
  }
  throwStatementHandler(node) {
    const argumentClosure = this.createClosure(node.argument);
    return () => {
      this.setValue(void 0);
      throw argumentClosure();
    };
  }
  // try{...}catch(e){...}finally{}
  tryStatementHandler(node) {
    const blockClosure = this.createClosure(node.block);
    const handlerClosure = node.handler ? this.catchClauseHandler(node.handler) : null;
    const finalizerClosure = node.finalizer ? this.createClosure(node.finalizer) : null;
    return () => {
      const currentScope = this.getCurrentScope();
      const currentContext = this.getCurrentContext();
      const labelStack = currentScope.labelStack.concat([]);
      const callStack = this.callStack.concat([]);
      let result = EmptyStatementReturn;
      let finalReturn;
      let throwError;
      const reset2 = () => {
        this.setCurrentScope(currentScope);
        this.setCurrentContext(currentContext);
        currentScope.labelStack = labelStack;
        this.callStack = callStack;
      };
      try {
        result = this.setValue(blockClosure());
        if (result instanceof Return) {
          finalReturn = result;
        }
      } catch (err) {
        reset2();
        if (this.isInterruptThrow(err)) {
          throw err;
        }
        if (handlerClosure) {
          try {
            result = this.setValue(handlerClosure(err));
            if (result instanceof Return) {
              finalReturn = result;
            }
          } catch (err2) {
            reset2();
            if (this.isInterruptThrow(err2)) {
              throw err2;
            }
            throwError = err2;
          }
        }
      }
      if (finalizerClosure) {
        try {
          result = finalizerClosure();
          if (result instanceof Return) {
            finalReturn = result;
          }
        } catch (err) {
          reset2();
          if (this.isInterruptThrow(err)) {
            throw err;
          }
          throwError = err;
        }
      }
      if (throwError)
        throw throwError;
      if (finalReturn) {
        return finalReturn;
      }
      return result;
    };
  }
  // ... catch(e){...}
  catchClauseHandler(node) {
    const paramNameGetter = this.createParamNameGetter(node.param);
    const bodyClosure = this.createClosure(node.body);
    return (e) => {
      let result;
      const currentScope = this.getCurrentScope();
      const scopeData = currentScope.data;
      const paramName = paramNameGetter();
      const isInScope = hasOwnProperty2.call(scopeData, paramName);
      const oldValue = scopeData[paramName];
      scopeData[paramName] = e;
      result = bodyClosure();
      if (isInScope) {
        scopeData[paramName] = oldValue;
      } else {
        delete scopeData[paramName];
      }
      return result;
    };
  }
  continueStatementHandler(node) {
    return () => node.label ? new ContinueLabel(node.label.name) : Continue;
  }
  breakStatementHandler(node) {
    return () => node.label ? new BreakLabel(node.label.name) : Break;
  }
  switchStatementHandler(node) {
    const discriminantClosure = this.createClosure(node.discriminant);
    const caseClosures = node.cases.map((item) => this.switchCaseHandler(item));
    return () => {
      const value = discriminantClosure();
      let match = false;
      let result;
      let ret, start = 0, hasDefaultCase = false;
      for (let j = 0; j < 2; j++) {
        for (let i = start; i < caseClosures.length; i++) {
          const item = caseClosures[i]();
          const test = item.testClosure();
          if (!hasDefaultCase && test === DefaultCase) {
            hasDefaultCase = true;
            start = i;
          }
          if (match || test === value) {
            match = true;
            ret = this.setValue(item.bodyClosure());
            if (ret === EmptyStatementReturn)
              continue;
            if (ret === Break) {
              break;
            }
            result = ret;
            if (result instanceof Return || result instanceof BreakLabel || result instanceof ContinueLabel || result === Continue) {
              break;
            }
          }
        }
        if (!match && hasDefaultCase) {
          match = true;
        } else {
          break;
        }
      }
      return result;
    };
  }
  switchCaseHandler(node) {
    const testClosure = node.test ? this.createClosure(node.test) : () => DefaultCase;
    const bodyClosure = this.createClosure({
      type: "BlockStatement",
      body: node.consequent
    });
    return () => ({
      testClosure,
      bodyClosure
    });
  }
  // label: xxx
  labeledStatementHandler(node) {
    const labelName = node.label.name;
    const bodyClosure = this.createClosure(node.body);
    return () => {
      let result;
      const currentScope = this.getCurrentScope();
      currentScope.labelStack.push(labelName);
      result = bodyClosure(node);
      if (result instanceof BreakLabel && result.value === labelName) {
        result = EmptyStatementReturn;
      }
      currentScope.labelStack.pop();
      return result;
    };
  }
  debuggerStatementHandler(node) {
    return () => {
      debugger;
      return EmptyStatementReturn;
    };
  }
  // get es3/5 param name
  createParamNameGetter(node) {
    if (node.type === "Identifier") {
      return () => node.name;
    } else {
      throw this.createInternalThrowError(Messages.ParamTypeSyntaxError, node.type, node);
    }
  }
  createObjectKeyGetter(node) {
    let getter;
    if (node.type === "Identifier") {
      getter = () => node.name;
    } else {
      getter = this.createClosure(node);
    }
    return function() {
      return getter();
    };
  }
  createMemberKeyGetter(node) {
    return node.computed ? this.createClosure(node.property) : this.createObjectKeyGetter(node.property);
  }
  // for UnaryExpression UpdateExpression AssignmentExpression
  createObjectGetter(node) {
    switch (node.type) {
      case "Identifier":
        return () => this.getScopeDataFromName(node.name, this.getCurrentScope());
      case "MemberExpression":
        return this.createClosure(node.object);
      default:
        throw this.createInternalThrowError(Messages.AssignmentTypeSyntaxError, node.type, node);
    }
  }
  // for UnaryExpression UpdateExpression AssignmentExpression
  createNameGetter(node) {
    switch (node.type) {
      case "Identifier":
        return () => node.name;
      case "MemberExpression":
        return this.createMemberKeyGetter(node);
      default:
        throw this.createInternalThrowError(Messages.AssignmentTypeSyntaxError, node.type, node);
    }
  }
  varDeclaration(name) {
    const context = this.collectDeclVars;
    context[name] = void 0;
  }
  funcDeclaration(name, func) {
    const context = this.collectDeclFuncs;
    context[name] = func;
  }
  addDeclarationsToScope(declVars, declFuncs, scope) {
    const scopeData = scope.data;
    for (let key in declFuncs) {
      const value = declFuncs[key];
      scopeData[key] = value ? value() : value;
    }
    for (let key in declVars) {
      if (!(key in scopeData)) {
        scopeData[key] = void 0;
      }
    }
  }
  getScopeValue(name, startScope) {
    const scope = this.getScopeFromName(name, startScope);
    return scope.data[name];
  }
  getScopeDataFromName(name, startScope) {
    return this.getScopeFromName(name, startScope).data;
  }
  getScopeFromName(name, startScope) {
    let scope = startScope;
    do {
      if (name in scope.data) {
        return scope;
      }
    } while (scope = scope.parent);
    return this.globalScope;
  }
  setValue(value) {
    const isFunctionCall = this.callStack.length;
    if (this.isVarDeclMode || isFunctionCall || value === EmptyStatementReturn || value === Break || value === Continue || value instanceof BreakLabel || value instanceof ContinueLabel) {
      return value;
    }
    this.value = value instanceof Return ? value.value : value;
    return value;
  }
  getValue() {
    return this.value;
  }
};
Interpreter.version = version2;
Interpreter.eval = internalEval;
Interpreter.Function = internalFunction;
Interpreter.ecmaVersion = 5;
Interpreter.globalContextInFunction = void 0;
Interpreter.global = /* @__PURE__ */ Object.create(null);

// src/utils/safeJsEvaluator.ts
var SafeJsEvaluator = class {
  /**
   * Avalia uma expressão ou bloco de código JS arbitrário com o escopo de variáveis fornecido
   */
  static evaluate(expressionOrCode, vars = {}, throwOnError = false) {
    if (!expressionOrCode || !expressionOrCode.trim())
      return false;
    const trimmed = expressionOrCode.trim();
    const hasReturn = /\breturn\b/.test(trimmed);
    const withoutTrailingSemicolon = trimmed.replace(/;+$/, "");
    let codeToTransform = trimmed;
    if (!hasReturn) {
      const isStatement = /^\s*(const|let|var|function|class|if|for|while|switch|try|throw)\b/.test(trimmed);
      if (!isStatement && !trimmed.includes("\n")) {
        codeToTransform = `return (${withoutTrailingSemicolon});`;
      } else {
        codeToTransform = trimmed;
      }
    }
    let es5Code = codeToTransform;
    try {
      es5Code = transform(codeToTransform, {
        transforms: {
          dangerousForOf: true,
          dangerousTaggedTemplateString: true
        }
      }).code;
    } catch {
      if (codeToTransform !== trimmed) {
        try {
          es5Code = transform(trimmed, {
            transforms: {
              dangerousForOf: true,
              dangerousTaggedTemplateString: true
            }
          }).code;
        } catch {
          es5Code = trimmed.replace(/\bconst\b/g, "var").replace(/\blet\b/g, "var");
        }
      } else {
        es5Code = trimmed.replace(/\bconst\b/g, "var").replace(/\blet\b/g, "var");
      }
    }
    const globalScope = {};
    if (typeof globalThis !== "undefined") {
      const standardGlobals = [
        "console",
        "Math",
        "Date",
        "JSON",
        "parseInt",
        "parseFloat",
        "isNaN",
        "isFinite",
        "encodeURI",
        "decodeURI",
        "encodeURIComponent",
        "decodeURIComponent",
        "String",
        "Number",
        "Boolean",
        "Array",
        "Object",
        "RegExp",
        "Map",
        "Set",
        "Promise",
        "window",
        "document",
        "location",
        "navigator",
        "history",
        "localStorage",
        "sessionStorage",
        "setTimeout",
        "clearTimeout",
        "setInterval",
        "clearInterval"
      ];
      for (const g of standardGlobals) {
        try {
          if (g in globalThis) {
            globalScope[g] = globalThis[g];
          }
        } catch {
        }
      }
    }
    Object.assign(globalScope, vars);
    globalScope.chrome = void 0;
    globalScope.browser = void 0;
    try {
      const interpreter = new Interpreter(globalScope, {
        timeout: 1e4,
        rootContext: globalScope
      });
      const wrapped = `(function() {
${es5Code}
})()`;
      const result = interpreter.evaluate(wrapped);
      if (typeof result === "function" && result.length === 0) {
        try {
          return result();
        } catch {
          return result;
        }
      }
      return result;
    } catch (err) {
      if (throwOnError)
        throw err;
      console.warn(`[SafeJsEvaluator] Erro ao avaliar c\xF3digo JS:`, err?.message || err);
      return false;
    }
  }
};

// src/driver/ChromeBrowserDriver.ts
var ChromeBrowserDriver = class {
  activeTabId;
  constructor(initialTabId) {
    this.activeTabId = initialTabId;
  }
  setActiveTab(tabId) {
    this.activeTabId = tabId;
  }
  isRestrictedTab(tab) {
    if (!tab?.url)
      return false;
    return tab.url.startsWith("chrome-extension://") || tab.url.startsWith("chrome://") || tab.url.startsWith("edge://") || tab.url.startsWith("devtools://") || tab.url.startsWith("view-source:");
  }
  async getTargetTabId() {
    if (this.activeTabId) {
      const tab = await chrome.tabs.get(this.activeTabId).catch(() => null);
      if (tab?.id && !this.isRestrictedTab(tab)) {
        return this.activeTabId;
      }
    }
    const tabs = await chrome.tabs.query({});
    const webTabs = tabs.filter(
      (t) => t.id && t.url && (t.url.startsWith("http://") || t.url.startsWith("https://") || t.url.startsWith("file://"))
    );
    const currentWindowActive = webTabs.find((t) => t.active && t.windowId === chrome.windows?.WINDOW_ID_CURRENT);
    const anyActive = webTabs.find((t) => t.active);
    const target2 = currentWindowActive || anyActive || webTabs[webTabs.length - 1];
    if (target2?.id) {
      this.activeTabId = target2.id;
      return target2.id;
    }
    const newTab = await chrome.tabs.create({ url: "about:blank", active: false });
    this.activeTabId = newTab.id;
    return newTab.id;
  }
  async sendToContentScript(action, payload) {
    const tabId = await this.getTargetTabId();
    try {
      const response = await chrome.tabs.sendMessage(tabId, { action, payload });
      if (response && response.error) {
        throw new Error(response.error);
      }
      return response?.data ?? response;
    } catch (err) {
      if (err?.message?.includes("Receiving end does not exist") || err?.message?.includes("Could not establish connection")) {
        await chrome.scripting.executeScript({
          target: { tabId },
          files: ["dist/contentDriver.js"]
        });
        const retryResponse = await chrome.tabs.sendMessage(tabId, { action, payload });
        if (retryResponse && retryResponse.error)
          throw new Error(retryResponse.error);
        return retryResponse?.data ?? retryResponse;
      }
      throw err;
    }
  }
  // -------------------------------------------------------------
  // NAVEGAÇÃO E ABAS
  // -------------------------------------------------------------
  async navigateTo(url, waitUntil = "load", timeoutMs = 3e4) {
    const tabId = await this.getTargetTabId();
    const tabInfo = await chrome.tabs.get(tabId).catch(() => null);
    if (tabInfo && (tabInfo.url === "about:blank" || tabInfo.url === "")) {
      chrome.tabs.update(tabId, { active: true }).catch(() => {
      });
    }
    if (waitUntil === "none") {
      await chrome.tabs.update(tabId, { url });
      return;
    }
    return new Promise((resolve, reject) => {
      let isResolved = false;
      const timer = setTimeout(() => {
        if (!isResolved) {
          isResolved = true;
          chrome.tabs.onUpdated.removeListener(listener);
          reject(new Error(`Timeout (${timeoutMs}ms) aguardando carregamento da URL: ${url}`));
        }
      }, timeoutMs);
      const listener = (updatedTabId, changeInfo) => {
        if (updatedTabId === tabId && !isResolved) {
          if (changeInfo.status === "complete") {
            isResolved = true;
            clearTimeout(timer);
            chrome.tabs.onUpdated.removeListener(listener);
            if (waitUntil === "networkidle") {
              setTimeout(resolve, 500);
            } else {
              setTimeout(resolve, 100);
            }
          }
        }
      };
      chrome.tabs.onUpdated.addListener(listener);
      chrome.tabs.update(tabId, { url }).catch((err) => {
        if (!isResolved) {
          isResolved = true;
          clearTimeout(timer);
          chrome.tabs.onUpdated.removeListener(listener);
          reject(err);
        }
      });
    });
  }
  async createTab(url, active = true) {
    const tab = await chrome.tabs.create({ url, active });
    if (tab.id && active) {
      this.activeTabId = tab.id;
    }
    return { tabId: tab.id, url: tab.url };
  }
  async switchTab(queryType, queryValue) {
    let targetTab;
    if (queryType === "index") {
      const tabs = await chrome.tabs.query({ currentWindow: true });
      targetTab = tabs[Number(queryValue)];
    } else if (queryType === "title") {
      const tabs = await chrome.tabs.query({ currentWindow: true });
      targetTab = tabs.find((t) => t.title?.toLowerCase().includes(String(queryValue).toLowerCase()));
    } else if (queryType === "url_match") {
      const tabs = await chrome.tabs.query({ currentWindow: true });
      const regex = new RegExp(String(queryValue));
      targetTab = tabs.find((t) => t.url && regex.test(t.url));
    }
    if (!targetTab?.id) {
      throw new Error(`Aba n\xE3o encontrada com crit\xE9rio ${queryType}: ${queryValue}`);
    }
    await chrome.tabs.update(targetTab.id, { active: true });
    this.activeTabId = targetTab.id;
  }
  async closeTab(queryType, queryValue) {
    if (!queryType) {
      const tabId2 = await this.getTargetTabId();
      await chrome.tabs.remove(tabId2);
      this.activeTabId = void 0;
      return;
    }
    await this.switchTab(queryType, queryValue);
    const tabId = await this.getTargetTabId();
    await chrome.tabs.remove(tabId);
    this.activeTabId = void 0;
  }
  async getCurrentUrl() {
    const tabId = await this.getTargetTabId();
    const tab = await chrome.tabs.get(tabId);
    return tab.url || "";
  }
  async navigateHistory(action, ignoreCache = false) {
    const tabId = await this.getTargetTabId();
    if (action === "reload") {
      await chrome.tabs.reload(tabId, { bypassCache: ignoreCache });
    } else if (action === "back") {
      await chrome.tabs.goBack(tabId);
    } else if (action === "forward") {
      await chrome.tabs.goForward(tabId);
    }
  }
  // -------------------------------------------------------------
  // OPERAÇÕES NO DOM
  // -------------------------------------------------------------
  async clickElement(selector, selectorType, clickType, timeoutMs, coordinates) {
    await this.sendToContentScript("CLICK_ELEMENT", {
      selector,
      selectorType,
      clickType,
      timeoutMs,
      coordinates
    });
  }
  async typeText(selector, selectorType, text, mode, minDelay, maxDelay, clear, pressEnter, timeoutMs) {
    await this.sendToContentScript("TYPE_INPUT", {
      selector,
      selectorType,
      text,
      mode,
      minDelay,
      maxDelay,
      clear,
      pressEnter,
      timeoutMs
    });
  }
  async pressKey(key, modifiers, selector, selectorType) {
    await this.sendToContentScript("PRESS_KEY", { key, modifiers, selector, selectorType });
  }
  async hoverOrFocus(selector, selectorType, action, timeoutMs) {
    await this.sendToContentScript("HOVER_FOCUS", { selector, selectorType, action, timeoutMs });
  }
  async scroll(target2, selector, selectorType, deltaX, deltaY, smooth) {
    await this.sendToContentScript("SCROLL", { target: target2, selector, selectorType, deltaX, deltaY, smooth });
  }
  async waitForElement(selector, selectorType, state, timeoutMs) {
    const res2 = await this.sendToContentScript("WAIT_FOR_ELEMENT", { selector, selectorType, state, timeoutMs });
    return !!res2?.success;
  }
  async elementExists(selector, selectorType, timeoutMs) {
    const res2 = await this.sendToContentScript("ELEMENT_EXISTS", { selector, selectorType, timeoutMs });
    return !!res2;
  }
  async extractData(selector, selectorType, extractType, attributeName, timeoutMs) {
    return await this.sendToContentScript("EXTRACT_DATA", {
      selector,
      selectorType,
      extractType,
      attributeName,
      timeoutMs
    });
  }
  async scrapeList(selector, selectorType, fields, maxItems, timeoutMs) {
    return await this.sendToContentScript("SCRAPE_LIST", {
      selector,
      selectorType,
      fields,
      maxItems,
      timeoutMs
    });
  }
  async injectScript(code, _context, args = []) {
    const tabId = await this.getTargetTabId();
    const tab = await chrome.tabs.get(tabId).catch(() => null);
    const isExtensionPage = !tab?.url || tab.url.startsWith("chrome-extension://") || tab.url.startsWith("chrome://");
    if (isExtensionPage) {
      const evalRes = SafeJsEvaluator.evaluate(`(function(args, $args) {
${code}
})(args, args)`, {
        args,
        $args: args,
        chrome: void 0,
        browser: void 0
      });
      return evalRes !== void 0 ? evalRes : { success: true, executed: true };
    }
    const response = await this.sendToContentScript("INJECT_SCRIPT", { code, args });
    if (response && response.data && response.data.result !== void 0) {
      return response.data.result;
    }
    return response?.data ?? response;
  }
  async injectHtml(html, targetSelector, position, selectorType) {
    await this.sendToContentScript("INJECT_HTML", { html, targetSelector, position, selectorType });
  }
  async injectCss(css, target2, styleId) {
    await this.sendToContentScript("INJECT_CSS", { css, target: target2, styleId });
  }
  async injectWebComponent(html, css, js, containerId, mode) {
    await this.sendToContentScript("INJECT_WEB_COMPONENT", { html, css, js, containerId, mode });
  }
  async downloadFile(content, filename, mimeType) {
    const base64Data = btoa(unescape(encodeURIComponent(content)));
    const dataUrl = `data:${mimeType};base64,${base64Data}`;
    await chrome.downloads.download({
      url: dataUrl,
      filename,
      saveAs: false
    });
  }
};

// src/defaultAutomation.ts
var DEFAULT_AUTOMATION = {
  schemaVersion: "1.0.0",
  metadata: {
    id: "auto_wiki_scraping_default",
    name: "Pesquisa e Extra\xE7\xE3o na Wikipedia",
    description: "Navega at\xE9 a Wikipedia, pesquisa por Intelig\xEAncia Artificial com digita\xE7\xE3o humana, aguarda o carregamento e extrai o t\xEDtulo.",
    version: "1.0.0",
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    tags: ["wikipedia", "scraping", "demo"]
  },
  settings: {
    stopOnError: true,
    defaultTimeoutMs: 15e3,
    logLevel: "info",
    parallelBranchesEnabled: false
  },
  variables: {
    termoPesquisa: "Intelig\xEAncia Artificial",
    tituloArtigo: ""
  },
  nodes: [
    {
      id: "node_start",
      type: "start",
      category: "flow_logic",
      position: { x: 50, y: 180 },
      data: {
        label: "Iniciar Demonstra\xE7\xE3o",
        triggerType: "manual"
      }
    },
    {
      id: "node_navigate",
      type: "navigate",
      category: "browser_navigation",
      position: { x: 300, y: 180 },
      data: {
        label: "Acessar Wikipedia",
        url: "https://pt.wikipedia.org/wiki/Wikip%C3%A9dia:P%C3%A1gina_principal",
        waitUntil: "domcontentloaded",
        timeoutMs: 15e3
      }
    },
    {
      id: "node_type",
      type: "type_input",
      category: "dom_interaction",
      position: { x: 550, y: 180 },
      data: {
        label: "Digitar Busca",
        selector: 'input.cdx-text-input__input, input[name="search"]',
        selectorType: "css",
        text: "{{termoPesquisa}}",
        mode: "human_typing",
        minTypingDelayMs: 40,
        maxTypingDelayMs: 120,
        clearBeforeTyping: true,
        pressEnterAfter: true
      }
    },
    {
      id: "node_wait",
      type: "wait_for_element",
      category: "dom_interaction",
      position: { x: 800, y: 180 },
      data: {
        label: "Aguardar Artigo",
        selector: "#firstHeading",
        selectorType: "css",
        state: "visible",
        timeoutMs: 1e4
      }
    },
    {
      id: "node_extract",
      type: "extract_data",
      category: "data_network",
      position: { x: 1050, y: 180 },
      data: {
        label: "Extrair T\xEDtulo",
        selector: "#firstHeading",
        selectorType: "css",
        extractType: "innerText",
        saveToVar: "tituloArtigo"
      }
    },
    {
      id: "node_inject_banner",
      type: "inject_html",
      category: "injection_customization",
      position: { x: 1300, y: 180 },
      data: {
        label: "Notifica\xE7\xE3o na P\xE1gina",
        html: '<div style="position:fixed; top:20px; right:20px; z-index:999999; background:linear-gradient(135deg, #4f46e5, #9333ea); color:white; padding:16px 22px; border-radius:12px; font-family:sans-serif; font-size:14px; font-weight:bold; box-shadow:0 10px 30px rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.3); animation: slideIn 0.5s ease;">\u26A1 WebAutomations: Artigo Extra\xEDdo com Sucesso!</div>',
        targetSelector: "body",
        position: "beforeend"
      }
    }
  ],
  edges: [
    { id: "e1", source: "node_start", target: "node_navigate" },
    { id: "e2", source: "node_navigate", target: "node_type" },
    { id: "e3", source: "node_type", target: "node_wait" },
    { id: "e4", source: "node_wait", target: "node_extract" },
    { id: "e5", source: "node_extract", target: "node_inject_banner" }
  ],
  viewport: { x: 0, y: 0, zoom: 1 }
};

// src/background/serviceWorker.ts
StateManager.customEvaluator = (code, vars) => SafeJsEvaluator.evaluate(code, vars, true);
var ExtensionController = class {
  engine;
  activeContexts = /* @__PURE__ */ new Map();
  mcpEnabled = false;
  mcpPort = 3001;
  constructor() {
    this.engine = new ExecutionEngine();
    registerAllDefaultHandlers(this.engine);
    this.initMessageListeners();
    this.initStorageDefaults();
    this.checkAndInitMCP();
  }
  async checkAndInitMCP() {
    const data2 = await chrome.storage.local.get("mcp_config");
    if (data2.mcp_config?.enabled) {
      this.mcpEnabled = true;
      this.mcpPort = data2.mcp_config.port || 3001;
      this.connectMCPBridge();
    }
  }
  initStorageDefaults() {
    chrome.runtime.onInstalled?.addListener(async () => {
      const automations = await this.getSavedAutomations();
      if (automations.length === 0) {
        await this.saveAutomation(DEFAULT_AUTOMATION);
        console.log("[WebAutomations] Automa\xE7\xE3o padr\xE3o carregada com sucesso.");
      }
      await this.syncTriggers();
    });
    chrome.runtime.onStartup?.addListener(async () => {
      console.log("[WebAutomations] Navegador iniciado. Verificando gatilhos de browser_startup...");
      await this.syncTriggers();
      const automations = await this.getSavedAutomations();
      for (const auto of automations) {
        const startNode = auto.nodes.find((n2) => n2.type === "start");
        if (!startNode)
          continue;
        const triggers = getActiveTriggers(startNode.data);
        if (triggers.some((t) => t.type === "browser_startup")) {
          console.log(`[WebAutomations] Disparando automa\xE7\xE3o no in\xEDcio do navegador: ${auto.metadata.name}`);
          this.executeAutomation(auto);
        }
      }
    });
  }
  /**
   * Sincroniza alarmes (schedule) e itens de menu de contexto (context_menu) com base nos fluxos salvos
   */
  async syncTriggers() {
    try {
      const automations = await this.getSavedAutomations();
      if (chrome.contextMenus) {
        chrome.contextMenus.removeAll(() => {
          for (const auto of automations) {
            const startNode = auto.nodes.find((n2) => n2.type === "start");
            if (!startNode)
              continue;
            const triggers = getActiveTriggers(startNode.data);
            const contextTriggers = triggers.filter((t) => t.type === "context_menu");
            contextTriggers.forEach((trigger, idx) => {
              const title = trigger.contextMenuTitle || `Executar: ${auto.metadata.name}`;
              chrome.contextMenus.create({
                id: `menu_flow_${auto.metadata.id}_${idx}`,
                title,
                contexts: ["all"]
              });
            });
          }
        });
      }
      if (chrome.alarms) {
        await chrome.alarms.clearAll();
        for (const auto of automations) {
          const startNode = auto.nodes.find((n2) => n2.type === "start");
          if (!startNode)
            continue;
          const triggers = getActiveTriggers(startNode.data);
          triggers.forEach((trigger, idx) => {
            if (trigger.type === "schedule") {
              let minutes = trigger.intervalMinutes || 15;
              if (trigger.intervalValue && trigger.intervalUnit) {
                if (trigger.intervalUnit === "minutes")
                  minutes = trigger.intervalValue;
                else if (trigger.intervalUnit === "hours")
                  minutes = trigger.intervalValue * 60;
                else if (trigger.intervalUnit === "seconds")
                  minutes = Math.max(0.1, trigger.intervalValue / 60);
                else if (trigger.intervalUnit === "ms")
                  minutes = Math.max(0.1, trigger.intervalValue / 6e4);
              }
              chrome.alarms.create(`alarm_flow_${auto.metadata.id}_${idx}`, {
                periodInMinutes: Math.max(0.1, minutes)
              });
              console.log(`[WebAutomations] Alarme de intervalo registrado para "${auto.metadata.name}" a cada ${minutes} min.`);
            } else if (trigger.type === "date_schedule") {
              chrome.alarms.create(`date_alarm_flow_${auto.metadata.id}_${idx}`, {
                periodInMinutes: 1
              });
              console.log(`[WebAutomations] Alarme por data registrado para "${auto.metadata.name}".`);
            }
          });
        }
      }
      if (chrome.tabs) {
        chrome.tabs.query({}, (tabs) => {
          for (const tab of tabs) {
            if (!tab.id || !tab.url || tab.url.startsWith("chrome://") || tab.url.startsWith("edge://"))
              continue;
            chrome.tabs.sendMessage(tab.id, {
              action: "SYNC_FLOATING_TRIGGER_BUTTONS"
            }).catch(() => {
            });
            for (const auto of automations) {
              const startNode = auto.nodes.find((n2) => n2.type === "start");
              if (!startNode)
                continue;
              const triggers = getActiveTriggers(startNode.data);
              const floatingTriggers = triggers.filter((t) => t.type === "floating_button");
              for (const trig of floatingTriggers) {
                const patterns = trig.urlPatterns || (trig.urlPattern ? [trig.urlPattern] : ["*://*/*"]);
                const floatingPatterns = patterns.length > 0 ? patterns : ["*://*/*"];
                const matches = floatingPatterns.some((p) => {
                  if (!p || p === "*://*/*" || p === "https://*/*" || p === "<all_urls>" || p === ".*")
                    return true;
                  try {
                    const escaped = p.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
                    return new RegExp(`^${escaped}$`, "i").test(tab.url);
                  } catch {
                    return false;
                  }
                });
                if (matches && tab.id) {
                  chrome.tabs.sendMessage(tab.id, {
                    action: "INJECT_FLOATING_TRIGGER_BUTTON",
                    payload: {
                      automationId: auto.metadata.id,
                      automationName: auto.metadata.name,
                      buttonConfig: trig.floatingButton
                    }
                  }).catch(() => {
                  });
                }
              }
            }
          }
        });
      }
    } catch (err) {
      console.warn("[WebAutomations] Erro ao sincronizar gatilhos:", err);
    }
  }
  initMessageListeners() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleExtensionMessage(message, sender).then((res2) => sendResponse(res2)).catch((err) => sendResponse({ success: false, error: err.message }));
      return true;
    });
    chrome.commands?.onCommand.addListener(async (command) => {
      console.log(`Comando de atalho acionado: ${command}`);
      const automations = await this.getSavedAutomations();
      for (const auto of automations) {
        const startNode = auto.nodes.find((n2) => n2.type === "start");
        if (!startNode)
          continue;
        const triggers = getActiveTriggers(startNode.data);
        if (triggers.some((t) => t.type === "shortcut" && t.shortcutKey === command)) {
          this.executeAutomation(auto);
        }
      }
    });
    chrome.contextMenus?.onClicked.addListener(async (info, tab) => {
      if (typeof info.menuItemId === "string" && info.menuItemId.startsWith("menu_flow_")) {
        const parts = info.menuItemId.replace("menu_flow_", "").split("_");
        const flowId = parts.slice(0, -1).join("_") || parts[0];
        const automations = await this.getSavedAutomations();
        const targetAuto = automations.find((a) => a.metadata.id === flowId || a.metadata.id === info.menuItemId.replace("menu_flow_", ""));
        if (targetAuto) {
          const driver = tab?.id ? new ChromeBrowserDriver(tab.id) : new ChromeBrowserDriver();
          console.log(`[WebAutomations] Disparando fluxo pelo menu de contexto: ${targetAuto.metadata.name}`);
          this.executeAutomation(targetAuto, driver);
        }
      }
    });
    chrome.alarms?.onAlarm.addListener(async (alarm) => {
      if (alarm.name.startsWith("alarm_flow_")) {
        const parts = alarm.name.replace("alarm_flow_", "").split("_");
        const flowId = parts.slice(0, -1).join("_") || parts[0];
        const automations = await this.getSavedAutomations();
        const targetAuto = automations.find((a) => a.metadata.id === flowId || a.metadata.id === alarm.name.replace("alarm_flow_", ""));
        if (targetAuto) {
          console.log(`[WebAutomations] Disparando fluxo por intervalo agendado: ${targetAuto.metadata.name}`);
          this.executeAutomation(targetAuto);
        }
      } else if (alarm.name.startsWith("date_alarm_flow_")) {
        const parts = alarm.name.replace("date_alarm_flow_", "").split("_");
        const trigIdx = Number(parts[parts.length - 1]);
        const flowId = parts.slice(0, -1).join("_");
        const automations = await this.getSavedAutomations();
        const targetAuto = automations.find((a) => a.metadata.id === flowId);
        if (!targetAuto)
          return;
        const startNode = targetAuto.nodes.find((n2) => n2.type === "start");
        if (!startNode)
          return;
        const triggers = getActiveTriggers(startNode.data);
        const trigger = triggers[trigIdx] || triggers.find((t) => t.type === "date_schedule");
        if (!trigger || trigger.type !== "date_schedule" || !trigger.dateSchedule)
          return;
        const ds = trigger.dateSchedule;
        const now = /* @__PURE__ */ new Date();
        const currentHours = String(now.getHours()).padStart(2, "0");
        const currentMinutes = String(now.getMinutes()).padStart(2, "0");
        const currentTime = `${currentHours}:${currentMinutes}`;
        if (ds.time && ds.time !== currentTime) {
          return;
        }
        let isDateMatched = false;
        if (ds.mode === "weekdays") {
          const currentDayOfWeek = now.getDay();
          isDateMatched = Array.isArray(ds.weekdays) && ds.weekdays.includes(currentDayOfWeek);
        } else if (ds.mode === "month_days") {
          const currentDayOfMonth = now.getDate();
          isDateMatched = Array.isArray(ds.monthDays) && ds.monthDays.includes(currentDayOfMonth);
        } else if (ds.mode === "full_dates") {
          const y = now.getFullYear();
          const m = String(now.getMonth() + 1).padStart(2, "0");
          const d = String(now.getDate()).padStart(2, "0");
          const todayDateStr = `${y}-${m}-${d}`;
          isDateMatched = Array.isArray(ds.fullDates) && ds.fullDates.includes(todayDateStr);
        }
        if (isDateMatched) {
          console.log(`[WebAutomations] Disparando fluxo por data agendada (${ds.mode}): ${targetAuto.metadata.name}`);
          this.executeAutomation(targetAuto);
        }
      }
    });
    chrome.webNavigation?.onCompleted.addListener(async (details) => {
      if (details.frameId !== 0)
        return;
      const automations = await this.getSavedAutomations();
      for (const auto of automations) {
        const startNode = auto.nodes.find((n2) => n2.type === "start");
        if (!startNode)
          continue;
        const triggers = getActiveTriggers(startNode.data);
        for (const trigger of triggers) {
          const patterns = getTriggerUrlPatterns(trigger);
          if (trigger.type === "on_url_load" && patterns.length > 0) {
            const matches = patterns.some((p) => {
              const regex = new RegExp(p.replace(/\*/g, ".*"));
              return regex.test(details.url);
            });
            if (matches) {
              const driver = new ChromeBrowserDriver(details.tabId);
              this.executeAutomation(auto, driver);
            }
          }
          if (trigger.type === "floating_button") {
            const floatingPatterns = patterns.length > 0 ? patterns : ["*://*/*"];
            const matches = floatingPatterns.some((p) => {
              if (!p || p === "*://*/*" || p === "https://*/*" || p === "<all_urls>" || p === ".*")
                return true;
              try {
                const escaped = p.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
                return new RegExp(`^${escaped}$`, "i").test(details.url);
              } catch {
                return false;
              }
            });
            if (matches && details.tabId) {
              chrome.tabs.sendMessage(details.tabId, {
                action: "INJECT_FLOATING_TRIGGER_BUTTON",
                payload: {
                  automationId: auto.metadata.id,
                  automationName: auto.metadata.name,
                  buttonConfig: trigger.floatingButton
                }
              }).catch(() => {
              });
            }
          }
        }
      }
    });
  }
  /**
   * Conecta a extensão ao servidor MCP apenas se habilitado pelo usuário
   */
  connectMCPBridge() {
    if (!this.mcpEnabled)
      return;
    if (this.mcpWebSocket && (this.mcpWebSocket.readyState === WebSocket.OPEN || this.mcpWebSocket.readyState === WebSocket.CONNECTING)) {
      return;
    }
    try {
      const ws = new WebSocket(`ws://localhost:${this.mcpPort}/mcp-extension-bridge`);
      ws.onopen = () => {
        console.log("[WebAutomations MCP] Conectado ao Servidor MCP com sucesso.");
        this.mcpWebSocket = ws;
        ws.send(JSON.stringify({ type: "REGISTER_EXTENSION", timestamp: Date.now() }));
      };
      ws.onmessage = async (event) => {
        try {
          const data2 = JSON.parse(event.data);
          await this.handleMCPRequest(data2);
        } catch (e) {
          console.error("[WebAutomations MCP] Erro ao processar mensagem:", e);
        }
      };
      ws.onclose = () => {
        this.mcpWebSocket = void 0;
        if (this.mcpEnabled) {
          setTimeout(() => this.connectMCPBridge(), 15e3);
        }
      };
      ws.onerror = () => {
        ws.close();
      };
    } catch {
    }
  }
  disconnectMCPBridge() {
    this.mcpEnabled = false;
    if (this.mcpWebSocket) {
      this.mcpWebSocket.close();
      this.mcpWebSocket = void 0;
    }
  }
  async handleMCPRequest(msg) {
    const { id, action, payload } = msg;
    try {
      if (action === "RUN_GRAPH") {
        const graph = payload.graph;
        const driver = new ChromeBrowserDriver();
        const ctx = await this.executeAutomation(graph, driver, (event, data2) => {
          this.mcpWebSocket?.send(JSON.stringify({ type: "EXECUTION_EVENT", id, event, data: data2 }));
        });
        this.mcpWebSocket?.send(JSON.stringify({
          type: "MCP_RESPONSE",
          id,
          success: true,
          status: ctx.status,
          variables: ctx.state.getAll(),
          logs: ctx.logs
        }));
      } else if (action === "LIST_AUTOMATIONS") {
        const automations = await this.getSavedAutomations();
        this.mcpWebSocket?.send(JSON.stringify({
          type: "MCP_RESPONSE",
          id,
          success: true,
          data: automations.map((a) => a.metadata)
        }));
      } else if (action === "GET_STATUS") {
        const ctx = this.activeContexts.get(payload.automationId);
        this.mcpWebSocket?.send(JSON.stringify({
          type: "MCP_RESPONSE",
          id,
          success: true,
          status: ctx ? ctx.status : "not_found",
          variables: ctx ? ctx.state.getAll() : {}
        }));
      }
    } catch (err) {
      this.mcpWebSocket?.send(JSON.stringify({
        type: "MCP_RESPONSE",
        id,
        success: false,
        error: err.message
      }));
    }
  }
  async handleExtensionMessage(message, sender) {
    const { action, payload } = message;
    switch (action) {
      case "EXECUTE_AUTOMATION": {
        const graph = payload.graph;
        const isSenderExtension = sender.tab?.url?.startsWith("chrome-extension://") || !sender.tab;
        const targetTabId = payload.tabId || (isSenderExtension ? void 0 : sender.tab?.id);
        const driver = new ChromeBrowserDriver(targetTabId);
        const ctx = await this.executeAutomation(graph, driver);
        const isSuccess = ctx.status === "completed";
        const errorMsg = !isSuccess ? ctx.logs.find((l) => l.level === "error")?.message || "Falha na execu\xE7\xE3o do fluxo" : void 0;
        return {
          success: isSuccess,
          status: ctx.status,
          variables: ctx.state.getAll(),
          nodeOutputs: ctx.state.getNodeOutputs(),
          readonlyVariables: ctx.state.getReadonlyVariables(),
          logs: ctx.logs,
          error: errorMsg
        };
      }
      case "CANCEL_AUTOMATION": {
        const ctx = this.activeContexts.get(payload.automationId);
        if (ctx) {
          ctx.requestCancel();
          return { success: true };
        }
        return { success: false, error: "Automa\xE7\xE3o n\xE3o encontrada em execu\xE7\xE3o." };
      }
      case "SAVE_AUTOMATION": {
        const graph = payload.graph;
        await this.saveAutomation(graph);
        return { success: true };
      }
      case "SYNC_TRIGGERS": {
        await this.syncTriggers();
        return { success: true };
      }
      case "SET_MCP_CONFIG": {
        const { enabled, port = 3001 } = payload;
        this.mcpEnabled = !!enabled;
        this.mcpPort = port;
        await chrome.storage.local.set({ mcp_config: { enabled: this.mcpEnabled, port: this.mcpPort } });
        if (this.mcpEnabled) {
          this.connectMCPBridge();
        } else {
          this.disconnectMCPBridge();
        }
        return { success: true, enabled: this.mcpEnabled, port: this.mcpPort };
      }
      case "GET_MCP_STATUS": {
        const isConnected = !!this.mcpWebSocket && this.mcpWebSocket.readyState === WebSocket.OPEN;
        return {
          success: true,
          enabled: this.mcpEnabled,
          connected: isConnected,
          port: this.mcpPort
        };
      }
      case "RELAY_PICKER_KEY": {
        const { tabId, key, code } = payload || {};
        if (tabId && chrome.tabs?.sendMessage) {
          chrome.tabs.sendMessage(tabId, { action: "FORWARD_PICKER_KEY", payload: { key, code } }, () => void chrome.runtime.lastError);
        }
        return { success: true };
      }
      default:
        return { success: false, error: `A\xE7\xE3o n\xE3o reconhecida: ${action}` };
    }
  }
  async executeAutomation(graph, driver = new ChromeBrowserDriver(), onProgress) {
    const autoId = graph.metadata.id;
    const runtimeOutputs = {};
    const ctx = await this.engine.runGraph(graph, driver, {
      onStatusChange: (status) => {
        onProgress?.("status_change", { automationId: autoId, status });
        this.broadcastToUI({ type: "STATUS_CHANGE", automationId: autoId, status });
      },
      onNodeStart: (node) => {
        onProgress?.("node_start", { automationId: autoId, nodeId: node.id });
        this.broadcastToUI({ type: "NODE_START", automationId: autoId, nodeId: node.id });
      },
      onNodeComplete: (node, result) => {
        if (result.outputData !== void 0) {
          runtimeOutputs[node.id] = result.outputData;
        }
        onProgress?.("node_complete", { automationId: autoId, nodeId: node.id, nodeLabel: node.data?.label, result });
        this.broadcastToUI({
          type: "NODE_COMPLETE",
          automationId: autoId,
          nodeId: node.id,
          nodeLabel: node.data?.label,
          result,
          nodeOutputs: runtimeOutputs
        });
      },
      onNodeError: (node, error) => {
        onProgress?.("node_error", { automationId: autoId, nodeId: node.id, error: error.message });
        this.broadcastToUI({ type: "NODE_ERROR", automationId: autoId, nodeId: node.id, error: error.message });
      },
      onLog: (log) => {
        onProgress?.("log", { automationId: autoId, log });
        this.broadcastToUI({ type: "LOG", automationId: autoId, log });
      }
    });
    this.activeContexts.set(autoId, ctx);
    return ctx;
  }
  broadcastToUI(message) {
    chrome.runtime.sendMessage(message).catch(() => {
    });
  }
  async getSavedAutomations() {
    const data2 = await chrome.storage.local.get("web_automations");
    return data2.web_automations || [];
  }
  async saveAutomation(graph) {
    const current2 = await this.getSavedAutomations();
    const index = current2.findIndex((a) => a.metadata.id === graph.metadata.id);
    if (index >= 0) {
      current2[index] = graph;
    } else {
      current2.push(graph);
    }
    await chrome.storage.local.set({ web_automations: current2 });
    await this.syncTriggers();
  }
};
var controller = new ExtensionController();
/*! Bundled license information:

regjsgen/regjsgen.js:
  (*!
   * regjsgen 0.5.2
   * Copyright 2014-2020 Benjamin Tan <https://ofcr.se/>
   * Available under the MIT license <https://github.com/bnjmnt4n/regjsgen/blob/master/LICENSE-MIT.txt>
   *)

regenerate/regenerate.js:
  (*! https://mths.be/regenerate v1.4.2 by @mathias | MIT license *)
*/
//# sourceMappingURL=background.js.map
