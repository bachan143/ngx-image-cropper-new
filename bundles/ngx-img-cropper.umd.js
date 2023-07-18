(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('ngx-img-cropper', ['exports', '@angular/core', '@angular/common'], factory) :
    (global = global || self, factory(global['ngx-img-cropper'] = {}, global.ng.core, global.ng.common));
}(this, (function (exports, i0, common) { 'use strict';

    var CropperDrawSettings = /** @class */ (function () {
        function CropperDrawSettings(settings) {
            this.lineDash = false;
            this.strokeWidth = 1;
            this.strokeColor = 'rgba(255,255,255,1)';
            this.fillColor = 'rgba(255,255,255,1)';
            this.dragIconStrokeWidth = 1;
            this.dragIconStrokeColor = 'rgba(0,0,0,1)';
            this.dragIconFillColor = 'rgba(255,255,255,1)';
            this.backgroundFillColor = 'rgba(0,0,0,0.6)';
            if (typeof settings === 'object') {
                this.lineDash = settings.lineDash || this.lineDash;
                this.strokeWidth = settings.strokeWidth || this.strokeWidth;
                this.fillColor = settings.fillColor || this.fillColor;
                this.strokeColor = settings.strokeColor || this.strokeColor;
                this.dragIconStrokeWidth =
                    settings.dragIconStrokeWidth || this.dragIconStrokeWidth;
                this.dragIconStrokeColor =
                    settings.dragIconStrokeColor || this.dragIconStrokeColor;
                this.dragIconFillColor =
                    settings.dragIconFillColor || this.dragIconFillColor;
                this.backgroundFillColor =
                    settings.backgroundFillColor || this.backgroundFillColor;
            }
        }
        return CropperDrawSettings;
    }());

    var CropperSettings = /** @class */ (function () {
        function CropperSettings(settings) {
            this.canvasWidth = 300;
            this.canvasHeight = 300;
            this.dynamicSizing = false;
            this.width = 200;
            this.height = 200;
            this.minWidth = 50;
            this.minHeight = 50;
            this.minWithRelativeToResolution = true;
            this.croppedWidth = 100;
            this.croppedHeight = 100;
            this.cropperDrawSettings = new CropperDrawSettings();
            this.touchRadius = 20;
            this.noFileInput = false;
            this.markerSizeMultiplier = 1;
            this.centerTouchRadius = 20;
            this.showCenterMarker = true;
            this.allowedFilesRegex = /\.(jpe?g|png|gif|bmp)$/i;
            this.cropOnResize = true;
            this.preserveSize = false;
            this.compressRatio = 1.0;
            this.showFullCropInitial=true;
            // tslint:disable-next-line:variable-name
            this._rounded = false;
            // tslint:disable-next-line:variable-name
            this._keepAspect = true;
            if (typeof settings === 'object') {
                Object.assign(this, settings);
            }
        }
        Object.defineProperty(CropperSettings.prototype, "rounded", {
            get: function () {
                return this._rounded;
            },
            set: function (val) {
                this._rounded = val;
                if (val) {
                    this._keepAspect = true;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(CropperSettings.prototype, "keepAspect", {
            get: function () {
                return this._keepAspect;
            },
            set: function (val) {
                this._keepAspect = val;
                if (this._rounded === true && this._keepAspect === false) {
                    console.error('Cannot set keep aspect to false on rounded cropper. Ellipsis not supported');
                    this._keepAspect = true;
                }
            },
            enumerable: false,
            configurable: true
        });
        return CropperSettings;
    }());

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    /** @deprecated */
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    /** @deprecated */
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    function __spreadArray(to, from) {
        for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
            to[j] = from[i];
        return to;
    }
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, state, kind, f) {
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }
    function __classPrivateFieldSet(receiver, state, value, kind, f) {
        if (kind === "m")
            throw new TypeError("Private method is not writable");
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    }

    var Fraction = /** @class */ (function (_super) {
        __extends(Fraction, _super);
        function Fraction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Fraction;
    }(Number));
    var Exif = /** @class */ (function () {
        function Exif() {
            this.debug = false;
            this.IptcFieldMap = {
                0x78: 'caption',
                0x6e: 'credit',
                0x19: 'keywords',
                0x37: 'dateCreated',
                0x50: 'byline',
                0x55: 'bylineTitle',
                0x7a: 'captionWriter',
                0x69: 'headline',
                0x74: 'copyright',
                0x0f: 'category'
            };
            this.Tags = {
                // version tags
                0x9000: 'ExifVersion',
                0xa000: 'FlashpixVersion',
                // colorspace tags
                0xa001: 'ColorSpace',
                // image configuration
                0xa002: 'PixelXDimension',
                0xa003: 'PixelYDimension',
                0x9101: 'ComponentsConfiguration',
                0x9102: 'CompressedBitsPerPixel',
                // user information
                0x927c: 'MakerNote',
                0x9286: 'UserComment',
                // related file
                0xa004: 'RelatedSoundFile',
                // date and time
                0x9003: 'DateTimeOriginal',
                0x9004: 'DateTimeDigitized',
                0x9290: 'SubsecTime',
                0x9291: 'SubsecTimeOriginal',
                0x9292: 'SubsecTimeDigitized',
                // picture-taking conditions
                0x829a: 'ExposureTime',
                0x829d: 'FNumber',
                0x8822: 'ExposureProgram',
                0x8824: 'SpectralSensitivity',
                0x8827: 'ISOSpeedRatings',
                0x8828: 'OECF',
                0x9201: 'ShutterSpeedValue',
                0x9202: 'ApertureValue',
                0x9203: 'BrightnessValue',
                0x9204: 'ExposureBias',
                0x9205: 'MaxApertureValue',
                0x9206: 'SubjectDistance',
                0x9207: 'MeteringMode',
                0x9208: 'LightSource',
                0x9209: 'Flash',
                0x9214: 'SubjectArea',
                0x920a: 'FocalLength',
                0xa20b: 'FlashEnergy',
                0xa20c: 'SpatialFrequencyResponse',
                0xa20e: 'FocalPlaneXResolution',
                0xa20f: 'FocalPlaneYResolution',
                0xa210: 'FocalPlaneResolutionUnit',
                0xa214: 'SubjectLocation',
                0xa215: 'ExposureIndex',
                0xa217: 'SensingMethod',
                0xa300: 'FileSource',
                0xa301: 'SceneType',
                0xa302: 'CFAPattern',
                0xa401: 'CustomRendered',
                0xa402: 'ExposureMode',
                0xa403: 'WhiteBalance',
                0xa404: 'DigitalZoomRation',
                0xa405: 'FocalLengthIn35mmFilm',
                0xa406: 'SceneCaptureType',
                0xa407: 'GainControl',
                0xa408: 'Contrast',
                0xa409: 'Saturation',
                0xa40a: 'Sharpness',
                0xa40b: 'DeviceSettingDescription',
                0xa40c: 'SubjectDistanceRange',
                // other tags
                0xa005: 'InteroperabilityIFDPointer',
                0xa420: 'ImageUniqueID' // Identifier assigned uniquely to each image
            };
            this.TiffTags = {
                0x0100: 'ImageWidth',
                0x0101: 'ImageHeight',
                0x8769: 'ExifIFDPointer',
                0x8825: 'GPSInfoIFDPointer',
                0xa005: 'InteroperabilityIFDPointer',
                0x0102: 'BitsPerSample',
                0x0103: 'Compression',
                0x0106: 'PhotometricInterpretation',
                0x0112: 'Orientation',
                0x0115: 'SamplesPerPixel',
                0x011c: 'PlanarConfiguration',
                0x0212: 'YCbCrSubSampling',
                0x0213: 'YCbCrPositioning',
                0x011a: 'XResolution',
                0x011b: 'YResolution',
                0x0128: 'ResolutionUnit',
                0x0111: 'StripOffsets',
                0x0116: 'RowsPerStrip',
                0x0117: 'StripByteCounts',
                0x0201: 'JPEGInterchangeFormat',
                0x0202: 'JPEGInterchangeFormatLength',
                0x012d: 'TransferFunction',
                0x013e: 'WhitePoint',
                0x013f: 'PrimaryChromaticities',
                0x0211: 'YCbCrCoefficients',
                0x0214: 'ReferenceBlackWhite',
                0x0132: 'DateTime',
                0x010e: 'ImageDescription',
                0x010f: 'Make',
                0x0110: 'Model',
                0x0131: 'Software',
                0x013b: 'Artist',
                0x8298: 'Copyright'
            };
            this.GPSTags = {
                0x0000: 'GPSVersionID',
                0x0001: 'GPSLatitudeRef',
                0x0002: 'GPSLatitude',
                0x0003: 'GPSLongitudeRef',
                0x0004: 'GPSLongitude',
                0x0005: 'GPSAltitudeRef',
                0x0006: 'GPSAltitude',
                0x0007: 'GPSTimeStamp',
                0x0008: 'GPSSatellites',
                0x0009: 'GPSStatus',
                0x000a: 'GPSMeasureMode',
                0x000b: 'GPSDOP',
                0x000c: 'GPSSpeedRef',
                0x000d: 'GPSSpeed',
                0x000e: 'GPSTrackRef',
                0x000f: 'GPSTrack',
                0x0010: 'GPSImgDirectionRef',
                0x0011: 'GPSImgDirection',
                0x0012: 'GPSMapDatum',
                0x0013: 'GPSDestLatitudeRef',
                0x0014: 'GPSDestLatitude',
                0x0015: 'GPSDestLongitudeRef',
                0x0016: 'GPSDestLongitude',
                0x0017: 'GPSDestBearingRef',
                0x0018: 'GPSDestBearing',
                0x0019: 'GPSDestDistanceRef',
                0x001a: 'GPSDestDistance',
                0x001b: 'GPSProcessingMethod',
                0x001c: 'GPSAreaInformation',
                0x001d: 'GPSDateStamp',
                0x001e: 'GPSDifferential'
            };
            this.StringValues = {
                ExposureProgram: {
                    0: 'Not defined',
                    1: 'Manual',
                    2: 'Normal program',
                    3: 'Aperture priority',
                    4: 'Shutter priority',
                    5: 'Creative program',
                    6: 'Action program',
                    7: 'Portrait mode',
                    8: 'Landscape mode'
                },
                MeteringMode: {
                    0: 'Unknown',
                    1: 'Average',
                    2: 'CenterWeightedAverage',
                    3: 'Spot',
                    4: 'MultiSpot',
                    5: 'Pattern',
                    6: 'Partial',
                    255: 'Other'
                },
                LightSource: {
                    0: 'Unknown',
                    1: 'Daylight',
                    2: 'Fluorescent',
                    3: 'Tungsten (incandescent light)',
                    4: 'Flash',
                    9: 'Fine weather',
                    10: 'Cloudy weather',
                    11: 'Shade',
                    12: 'Daylight fluorescent (D 5700 - 7100K)',
                    13: 'Day white fluorescent (N 4600 - 5400K)',
                    14: 'Cool white fluorescent (W 3900 - 4500K)',
                    15: 'White fluorescent (WW 3200 - 3700K)',
                    17: 'Standard light A',
                    18: 'Standard light B',
                    19: 'Standard light C',
                    20: 'D55',
                    21: 'D65',
                    22: 'D75',
                    23: 'D50',
                    24: 'ISO studio tungsten',
                    255: 'Other'
                },
                Flash: {
                    0x0000: 'Flash did not fire',
                    0x0001: 'Flash fired',
                    0x0005: 'Strobe return light not detected',
                    0x0007: 'Strobe return light detected',
                    0x0009: 'Flash fired, compulsory flash mode',
                    0x000d: 'Flash fired, compulsory flash mode, return light not detected',
                    0x000f: 'Flash fired, compulsory flash mode, return light detected',
                    0x0010: 'Flash did not fire, compulsory flash mode',
                    0x0018: 'Flash did not fire, auto mode',
                    0x0019: 'Flash fired, auto mode',
                    0x001d: 'Flash fired, auto mode, return light not detected',
                    0x001f: 'Flash fired, auto mode, return light detected',
                    0x0020: 'No flash function',
                    0x0041: 'Flash fired, red-eye reduction mode',
                    0x0045: 'Flash fired, red-eye reduction mode, return light not detected',
                    0x0047: 'Flash fired, red-eye reduction mode, return light detected',
                    0x0049: 'Flash fired, compulsory flash mode, red-eye reduction mode',
                    0x004d: 'Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected',
                    0x004f: 'Flash fired, compulsory flash mode, red-eye reduction mode, return light detected',
                    0x0059: 'Flash fired, auto mode, red-eye reduction mode',
                    0x005d: 'Flash fired, auto mode, return light not detected, red-eye reduction mode',
                    0x005f: 'Flash fired, auto mode, return light detected, red-eye reduction mode'
                },
                SensingMethod: {
                    1: 'Not defined',
                    2: 'One-chip color area sensor',
                    3: 'Two-chip color area sensor',
                    4: 'Three-chip color area sensor',
                    5: 'Color sequential area sensor',
                    7: 'Trilinear sensor',
                    8: 'Color sequential linear sensor'
                },
                SceneCaptureType: {
                    0: 'Standard',
                    1: 'Landscape',
                    2: 'Portrait',
                    3: 'Night scene'
                },
                SceneType: {
                    1: 'Directly photographed'
                },
                CustomRendered: {
                    0: 'Normal process',
                    1: 'Custom process'
                },
                WhiteBalance: {
                    0: 'Auto white balance',
                    1: 'Manual white balance'
                },
                GainControl: {
                    0: 'None',
                    1: 'Low gain up',
                    2: 'High gain up',
                    3: 'Low gain down',
                    4: 'High gain down'
                },
                Contrast: {
                    0: 'Normal',
                    1: 'Soft',
                    2: 'Hard'
                },
                Saturation: {
                    0: 'Normal',
                    1: 'Low saturation',
                    2: 'High saturation'
                },
                Sharpness: {
                    0: 'Normal',
                    1: 'Soft',
                    2: 'Hard'
                },
                SubjectDistanceRange: {
                    0: 'Unknown',
                    1: 'Macro',
                    2: 'Close view',
                    3: 'Distant view'
                },
                FileSource: {
                    3: 'DSC'
                },
                Components: {
                    0: '',
                    1: 'Y',
                    2: 'Cb',
                    3: 'Cr',
                    4: 'R',
                    5: 'G',
                    6: 'B'
                }
            };
        }
        Exif.prototype.addEvent = function (element, event, handler) {
            if (element.addEventListener) {
                element.addEventListener(event, handler, false);
            }
            else {
                // Hello, IE!
                if (element.attachEvent) {
                    element.attachEvent('on' + event, handler);
                }
            }
        };
        Exif.prototype.imageHasData = function (img) {
            return !!img.exifdata;
        };
        Exif.prototype.base64ToArrayBuffer = function (base64) {
            base64 = base64.replace(/^data:([^;]+);base64,/gim, '');
            var binary = atob(base64);
            var len = binary.length;
            var buffer = new ArrayBuffer(len);
            var view = new Uint8Array(buffer);
            for (var i = 0; i < len; i++) {
                view[i] = binary.charCodeAt(i);
            }
            return buffer;
        };
        Exif.prototype.objectURLToBlob = function (url, callback) {
            var http = new XMLHttpRequest();
            http.open('GET', url, true);
            http.responseType = 'blob';
            http.onload = function () {
                if (http.status === 200 || http.status === 0) {
                    callback(http.response);
                }
            };
            http.send();
        };
        Exif.prototype.getImageData = function (img, callback) {
            var _this = this;
            var handleBinaryFile = function (binFile) {
                var data = _this.findEXIFinJPEG(binFile);
                var iptcdata = _this.findIPTCinJPEG(binFile);
                img.exifdata = data || {};
                img.iptcdata = iptcdata || {};
                if (callback) {
                    callback.call(img);
                }
            };
            if ('src' in img && img.src) {
                if (/^data:/i.test(img.src)) {
                    // Data URI
                    var arrayBuffer = this.base64ToArrayBuffer(img.src);
                    handleBinaryFile(arrayBuffer);
                }
                else {
                    if (/^blob:/i.test(img.src)) {
                        // Object URL
                        var fileReader_1 = new FileReader();
                        fileReader_1.onload = function (e) {
                            handleBinaryFile(e.target.result);
                        };
                        this.objectURLToBlob(img.src, function (blob) {
                            fileReader_1.readAsArrayBuffer(blob);
                        });
                    }
                    else {
                        var http_1 = new XMLHttpRequest();
                        http_1.onload = function () {
                            if (http_1.status === 200 || http_1.status === 0) {
                                handleBinaryFile(http_1.response);
                            }
                            else {
                                throw new Error('Could not load image');
                            }
                        };
                        http_1.open('GET', img.src, true);
                        http_1.responseType = 'arraybuffer';
                        http_1.send(null);
                    }
                }
            }
            else {
                if (FileReader && (img instanceof Blob || img instanceof File)) {
                    var fileReader = new FileReader();
                    fileReader.onload = function (e) {
                        _this.log('Got file of length ' + e.target.result.byteLength);
                        handleBinaryFile(e.target.result);
                    };
                    fileReader.readAsArrayBuffer(img);
                }
            }
        };
        Exif.prototype.findEXIFinJPEG = function (file) {
            var dataView = new DataView(file);
            this.log('Got file of length ' + file.byteLength);
            if (dataView.getUint8(0) !== 0xff || dataView.getUint8(1) !== 0xd8) {
                this.log('Not a valid JPEG');
                return false; // not a valid jpeg
            }
            var offset = 2;
            var length = file.byteLength;
            var marker;
            while (offset < length) {
                if (dataView.getUint8(offset) !== 0xff) {
                    this.log('Not a valid marker at offset ' +
                        offset +
                        ', found: ' +
                        dataView.getUint8(offset));
                    return false; // not a valid marker, something is wrong
                }
                marker = dataView.getUint8(offset + 1);
                this.log(marker);
                // we could implement handling for other markers here,
                // but we're only looking for 0xFFE1 for EXIF data
                if (marker === 225) {
                    this.log('Found 0xFFE1 marker');
                    return this.readEXIFData(dataView, offset + 4); // , dataView.getUint16(offset + 2) - 2);
                    // offset += 2 + file.getShortAt(offset+2, true);
                }
                else {
                    offset += 2 + dataView.getUint16(offset + 2);
                }
            }
        };
        Exif.prototype.findIPTCinJPEG = function (file) {
            var dataView = new DataView(file);
            this.log('Got file of length ' + file.byteLength);
            if (dataView.getUint8(0) !== 0xff || dataView.getUint8(1) !== 0xd8) {
                this.log('Not a valid JPEG');
                return false; // not a valid jpeg
            }
            var offset = 2;
            var length = file.byteLength;
            // tslint:disable-next-line:variable-name
            var isFieldSegmentStart = function (_dataView, _offset) {
                return (_dataView.getUint8(_offset) === 0x38 &&
                    _dataView.getUint8(_offset + 1) === 0x42 &&
                    _dataView.getUint8(_offset + 2) === 0x49 &&
                    _dataView.getUint8(_offset + 3) === 0x4d &&
                    _dataView.getUint8(_offset + 4) === 0x04 &&
                    _dataView.getUint8(_offset + 5) === 0x04);
            };
            while (offset < length) {
                if (isFieldSegmentStart(dataView, offset)) {
                    // Get the length of the name header (which is padded to an even number of bytes)
                    var nameHeaderLength = dataView.getUint8(offset + 7);
                    if (nameHeaderLength % 2 !== 0) {
                        nameHeaderLength += 1;
                    }
                    // Check for pre photoshop 6 format
                    if (nameHeaderLength === 0) {
                        // Always 4
                        nameHeaderLength = 4;
                    }
                    var startOffset = offset + 8 + nameHeaderLength;
                    var sectionLength = dataView.getUint16(offset + 6 + nameHeaderLength);
                    return this.readIPTCData(file, startOffset, sectionLength);
                }
                // Not the marker, continue searching
                offset++;
            }
        };
        Exif.prototype.readIPTCData = function (file, startOffset, sectionLength) {
            var dataView = new DataView(file);
            var data = {};
            var fieldValue;
            var fieldName;
            var dataSize;
            var segmentType;
            var segmentSize;
            var segmentStartPos = startOffset;
            while (segmentStartPos < startOffset + sectionLength) {
                if (dataView.getUint8(segmentStartPos) === 0x1c &&
                    dataView.getUint8(segmentStartPos + 1) === 0x02) {
                    segmentType = dataView.getUint8(segmentStartPos + 2);
                    if (segmentType in this.IptcFieldMap) {
                        dataSize = dataView.getInt16(segmentStartPos + 3);
                        segmentSize = dataSize + 5;
                        fieldName = this.IptcFieldMap[segmentType];
                        fieldValue = this.getStringFromDB(dataView, segmentStartPos + 5, dataSize);
                        // Check if we already stored a value with this name
                        if (data.hasOwnProperty(fieldName)) {
                            // Value already stored with this name, create multivalue field
                            if (data[fieldName] instanceof Array) {
                                data[fieldName].push(fieldValue);
                            }
                            else {
                                data[fieldName] = [data[fieldName], fieldValue];
                            }
                        }
                        else {
                            data[fieldName] = fieldValue;
                        }
                    }
                }
                segmentStartPos++;
            }
            return data;
        };
        Exif.prototype.readTags = function (file, tiffStart, dirStart, strings, bigEnd) {
            var entries = file.getUint16(dirStart, !bigEnd);
            var tags = {};
            var entryOffset;
            var tag;
            for (var i = 0; i < entries; i++) {
                entryOffset = dirStart + i * 12 + 2;
                tag = strings[file.getUint16(entryOffset, !bigEnd)];
                if (!tag) {
                    this.log('Unknown tag: ' + file.getUint16(entryOffset, !bigEnd));
                }
                tags[tag] = this.readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
            }
            return tags;
        };
        Exif.prototype.readTagValue = function (file, entryOffset, tiffStart, dirStart, bigEnd) {
            var type = file.getUint16(entryOffset + 2, !bigEnd);
            var numValues = file.getUint32(entryOffset + 4, !bigEnd);
            var valueOffset = file.getUint32(entryOffset + 8, !bigEnd) + tiffStart;
            var offset;
            var vals;
            var val;
            var n;
            var numerator;
            var denominator;
            switch (type) {
                case 1: // byte, 8-bit unsigned int
                case 7: // undefined, 8-bit byte, value depending on field
                    if (numValues === 1) {
                        return file.getUint8(entryOffset + 8, !bigEnd);
                    }
                    else {
                        offset = numValues > 4 ? valueOffset : entryOffset + 8;
                        vals = [];
                        for (n = 0; n < numValues; n++) {
                            vals[n] = file.getUint8(offset + n);
                        }
                        return vals;
                    }
                case 2: // ascii, 8-bit byte
                    offset = numValues > 4 ? valueOffset : entryOffset + 8;
                    return this.getStringFromDB(file, offset, numValues - 1);
                case 3: // short, 16 bit int
                    if (numValues === 1) {
                        return file.getUint16(entryOffset + 8, !bigEnd);
                    }
                    else {
                        offset = numValues > 2 ? valueOffset : entryOffset + 8;
                        vals = [];
                        for (n = 0; n < numValues; n++) {
                            vals[n] = file.getUint16(offset + 2 * n, !bigEnd);
                        }
                        return vals;
                    }
                case 4: // long, 32 bit int
                    if (numValues === 1) {
                        return file.getUint32(entryOffset + 8, !bigEnd);
                    }
                    else {
                        vals = [];
                        for (n = 0; n < numValues; n++) {
                            vals[n] = file.getUint32(valueOffset + 4 * n, !bigEnd);
                        }
                        return vals;
                    }
                case 5: // rational = two long values, first is numerator, second is denominator
                    if (numValues === 1) {
                        numerator = file.getUint32(valueOffset, !bigEnd);
                        denominator = file.getUint32(valueOffset + 4, !bigEnd);
                        val = new Fraction(numerator / denominator);
                        val.numerator = numerator;
                        val.denominator = denominator;
                        return val;
                    }
                    else {
                        vals = [];
                        for (n = 0; n < numValues; n++) {
                            numerator = file.getUint32(valueOffset + 8 * n, !bigEnd);
                            denominator = file.getUint32(valueOffset + 4 + 8 * n, !bigEnd);
                            vals[n] = new Fraction(numerator / denominator);
                            vals[n].numerator = numerator;
                            vals[n].denominator = denominator;
                        }
                        return vals;
                    }
                case 9: // slong, 32 bit signed int
                    if (numValues === 1) {
                        return file.getInt32(entryOffset + 8, !bigEnd);
                    }
                    else {
                        vals = [];
                        for (n = 0; n < numValues; n++) {
                            vals[n] = file.getInt32(valueOffset + 4 * n, !bigEnd);
                        }
                        return vals;
                    }
                case 10: // signed rational, two slongs, first is numerator, second is denominator
                    if (numValues === 1) {
                        return (file.getInt32(valueOffset, !bigEnd) /
                            file.getInt32(valueOffset + 4, !bigEnd));
                    }
                    else {
                        vals = [];
                        for (n = 0; n < numValues; n++) {
                            vals[n] =
                                file.getInt32(valueOffset + 8 * n, !bigEnd) /
                                    file.getInt32(valueOffset + 4 + 8 * n, !bigEnd);
                        }
                        return vals;
                    }
                default:
                    break;
            }
        };
        Exif.prototype.getStringFromDB = function (buffer, start, length) {
            var outstr = '';
            for (var n = start; n < start + length; n++) {
                outstr += String.fromCharCode(buffer.getUint8(n));
            }
            return outstr;
        };
        Exif.prototype.readEXIFData = function (file, start) {
            if (this.getStringFromDB(file, start, 4) !== 'Exif') {
                this.log('Not valid EXIF data! ' + this.getStringFromDB(file, start, 4));
                return false;
            }
            var bigEnd;
            var tags;
            var tag;
            var exifData;
            var gpsData;
            var tiffOffset = start + 6;
            // test for TIFF validity and endianness
            if (file.getUint16(tiffOffset) === 0x4949) {
                bigEnd = false;
            }
            else {
                if (file.getUint16(tiffOffset) === 0x4d4d) {
                    bigEnd = true;
                }
                else {
                    this.log('Not valid TIFF data! (no 0x4949 or 0x4D4D)');
                    return false;
                }
            }
            if (file.getUint16(tiffOffset + 2, !bigEnd) !== 0x002a) {
                this.log('Not valid TIFF data! (no 0x002A)');
                return false;
            }
            var firstIFDOffset = file.getUint32(tiffOffset + 4, !bigEnd);
            if (firstIFDOffset < 0x00000008) {
                this.log('Not valid TIFF data! (First offset less than 8)', file.getUint32(tiffOffset + 4, !bigEnd));
                return false;
            }
            tags = this.readTags(file, tiffOffset, tiffOffset + firstIFDOffset, this.TiffTags, bigEnd);
            if (tags.ExifIFDPointer) {
                exifData = this.readTags(file, tiffOffset, tiffOffset + tags.ExifIFDPointer, this.Tags, bigEnd);
                for (tag in exifData) {
                    if ({}.hasOwnProperty.call(exifData, tag)) {
                        switch (tag) {
                            case 'LightSource':
                            case 'Flash':
                            case 'MeteringMode':
                            case 'ExposureProgram':
                            case 'SensingMethod':
                            case 'SceneCaptureType':
                            case 'SceneType':
                            case 'CustomRendered':
                            case 'WhiteBalance':
                            case 'GainControl':
                            case 'Contrast':
                            case 'Saturation':
                            case 'Sharpness':
                            case 'SubjectDistanceRange':
                            case 'FileSource':
                                exifData[tag] = this.StringValues[tag][exifData[tag]];
                                break;
                            case 'ExifVersion':
                            case 'FlashpixVersion':
                                exifData[tag] = String.fromCharCode(exifData[tag][0], exifData[tag][1], exifData[tag][2], exifData[tag][3]);
                                break;
                            case 'ComponentsConfiguration':
                                var compopents = 'Components';
                                exifData[tag] =
                                    this.StringValues[compopents][exifData[tag][0]] +
                                        this.StringValues[compopents][exifData[tag][1]] +
                                        this.StringValues[compopents][exifData[tag][2]] +
                                        this.StringValues[compopents][exifData[tag][3]];
                                break;
                            default:
                                break;
                        }
                        tags[tag] = exifData[tag];
                    }
                }
            }
            if (tags.GPSInfoIFDPointer) {
                gpsData = this.readTags(file, tiffOffset, tiffOffset + tags.GPSInfoIFDPointer, this.GPSTags, bigEnd);
                for (tag in gpsData) {
                    if ({}.hasOwnProperty.call(gpsData, tag)) {
                        switch (tag) {
                            case 'GPSVersionID':
                                gpsData[tag] =
                                    gpsData[tag][0] +
                                        '.' +
                                        gpsData[tag][1] +
                                        '.' +
                                        gpsData[tag][2] +
                                        '.' +
                                        gpsData[tag][3];
                                break;
                            default:
                                break;
                        }
                        tags[tag] = gpsData[tag];
                    }
                }
            }
            return tags;
        };
        //   get rid of this silly issue
        Exif.prototype.checkImageType = function (img) {
            return img instanceof Image || img instanceof HTMLImageElement;
        };
        Exif.prototype.getData = function (img, callback) {
            if (this.checkImageType(img) && !img.complete) {
                return false;
            }
            if (!this.imageHasData(img)) {
                this.getImageData(img, callback);
            }
            else {
                if (callback) {
                    callback.call(img);
                }
            }
            return true;
        };
        Exif.prototype.getTag = function (img, tag) {
            if (!this.imageHasData(img)) {
                return;
            }
            return img.exifdata[tag];
        };
        Exif.prototype.getAllTags = function (img) {
            if (!this.imageHasData(img)) {
                return {};
            }
            var a;
            var data = img.exifdata;
            var tags = {};
            for (a in data) {
                if (data.hasOwnProperty(a)) {
                    tags[a] = data[a];
                }
            }
            return tags;
        };
        Exif.prototype.pretty = function (img) {
            if (!this.imageHasData(img)) {
                return '';
            }
            var a;
            var data = img.exifdata;
            var strPretty = '';
            for (a in data) {
                if (data.hasOwnProperty(a)) {
                    if (typeof data[a] === 'object') {
                        if (data[a] instanceof Number) {
                            strPretty += a + " : " + data[a] + " [" + data[a].numerator + "/" + data[a].denominator + "]\r\n";
                        }
                        else {
                            strPretty += a + " : [" + data[a].length + " values]\r\n";
                        }
                    }
                    else {
                        strPretty += a + " : " + data[a] + "\r\n";
                    }
                }
            }
            return strPretty;
        };
        Exif.prototype.readFromBinaryFile = function (file) {
            return this.findEXIFinJPEG(file);
        };
        Exif.prototype.log = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (this.debug) {
                console.log(args);
            }
        };
        return Exif;
    }());

    var Point = /** @class */ (function () {
        function Point(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        Object.defineProperty(Point.prototype, "next", {
            get: function () {
                return this.myNext;
            },
            set: function (p) {
                this.myNext = p;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Point.prototype, "prev", {
            get: function () {
                return this.myPrev;
            },
            set: function (p) {
                this.myPrev = p;
            },
            enumerable: false,
            configurable: true
        });
        return Point;
    }());

    var PointPool = /** @class */ (function () {
        function PointPool(initialSize) {
            if (initialSize === void 0) { initialSize = 1; }
            var prev = (this.firstAvailable = new Point());
            for (var i = 1; i < initialSize; i++) {
                var p = new Point();
                prev.next = p;
                prev = p;
            }
        }
        Object.defineProperty(PointPool.prototype, "instance", {
            get: function () {
                return this;
            },
            enumerable: false,
            configurable: true
        });
        PointPool.prototype.borrow = function (x, y) {
            if (this.firstAvailable == null) {
                throw new Error('Pool exhausted');
            }
            this.borrowed++;
            var p = this.firstAvailable;
            this.firstAvailable = p.next;
            p.x = x;
            p.y = y;
            return p;
        };
        PointPool.prototype.returnPoint = function (p) {
            this.borrowed--;
            p.x = 0;
            p.y = 0;
            p.next = this.firstAvailable;
            this.firstAvailable = p;
        };
        return PointPool;
    }());

    var Bounds = /** @class */ (function () {
        function Bounds(x, y, width, height) {
            if (x === void 0) {
                x = 0;
            }
            if (y === void 0) {
                y = 0;
            }
            if (width === void 0) {
                width = 0;
            }
            if (height === void 0) {
                height = 0;
            }
            this.left = x;
            this.right = x + width;
            this.top = y;
            this.bottom = y + height;
        }
        Object.defineProperty(Bounds.prototype, "width", {
            get: function () {
                return this.right - this.left;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Bounds.prototype, "height", {
            get: function () {
                return this.bottom - this.top;
            },
            enumerable: false,
            configurable: true
        });
        Bounds.prototype.getCentre = function () {
            var w = this.width;
            var h = this.height;
            return new PointPool().instance.borrow(this.left + w / 2, this.top + h / 2);
        };
        return Bounds;
    }());

    var Handle = /** @class */ (function () {
        function Handle(x, y, radius, settings) {
            this.cropperSettings = new CropperSettings();
            this.over = false;
            this.drag = false;
            this._position = new Point(x, y);
            this.offset = new Point(0, 0);
            this.radius = radius;
            this.cropperSettings = settings;
        }
        Handle.prototype.setDrag = function (value) {
            this.drag = value;
            this.setOver(value);
        };
        Handle.prototype.draw = function (ctx) {
            // this should't be empty
        };
        Handle.prototype.setOver = function (over) {
            this.over = over;
        };
        Handle.prototype.touchInBounds = function (x, y) {
            return (x > this.position.x - this.radius + this.offset.x &&
                x < this.position.x + this.radius + this.offset.x &&
                y > this.position.y - this.radius + this.offset.y &&
                y < this.position.y + this.radius + this.offset.y);
        };
        Object.defineProperty(Handle.prototype, "position", {
            get: function () {
                return this._position;
            },
            enumerable: false,
            configurable: true
        });
        Handle.prototype.setPosition = function (x, y) {
            this._position.x = x;
            this._position.y = y;
        };
        return Handle;
    }());

    var CornerMarker = /** @class */ (function (_super) {
        __extends(CornerMarker, _super);
        function CornerMarker(x, y, radius, cropperSettings) {
            return _super.call(this, x, y, radius, cropperSettings) || this;
        }
        CornerMarker.prototype.drawCornerBorder = function (ctx) {
            var sideLength = 10;
            if (this.over || this.drag) {
                sideLength = 12;
            }
            var hDirection = this.cropperSettings.markerSizeMultiplier;
            var vDirection = this.cropperSettings.markerSizeMultiplier;
            if (this.horizontalNeighbour.position.x < this.position.x) {
                hDirection = -this.cropperSettings.markerSizeMultiplier;
            }
            if (this.verticalNeighbour.position.y < this.position.y) {
                vDirection = -this.cropperSettings.markerSizeMultiplier;
            }
            ctx.beginPath();
            if (this.cropperSettings.cropperDrawSettings.lineDash) {
                ctx.setLineDash([1, 3]);
            }
            ctx.lineJoin = 'miter';
            ctx.moveTo(this.position.x + this.offset.x, this.position.y + this.offset.y);
            ctx.lineTo(this.position.x + this.offset.x + sideLength * hDirection, this.position.y + this.offset.y);
            ctx.lineTo(this.position.x + this.offset.x + sideLength * hDirection, this.position.y + this.offset.y + sideLength * vDirection);
            ctx.lineTo(this.position.x + this.offset.x, this.position.y + this.offset.y + sideLength * vDirection);
            ctx.lineTo(this.position.x + this.offset.x, this.position.y + this.offset.y);
            ctx.closePath();
            ctx.lineWidth = this.cropperSettings.cropperDrawSettings.strokeWidth;
            ctx.strokeStyle =
                this.cropperSettings.cropperDrawSettings.strokeColor ||
                    'rgba(255,255,255,.7)';
            ctx.stroke();
        };
        CornerMarker.prototype.drawCornerFill = function (ctx) {
            var sideLength = 10;
            if (this.over || this.drag) {
                sideLength = 12;
            }
            var hDirection = this.cropperSettings.markerSizeMultiplier;
            var vDirection = this.cropperSettings.markerSizeMultiplier;
            if (this.horizontalNeighbour.position.x < this.position.x) {
                hDirection = -this.cropperSettings.markerSizeMultiplier;
            }
            if (this.verticalNeighbour.position.y < this.position.y) {
                vDirection = -this.cropperSettings.markerSizeMultiplier;
            }
            if (this.cropperSettings.rounded) {
                var width = this.position.x - this.horizontalNeighbour.position.x;
                var height = this.position.y - this.verticalNeighbour.position.y;
                var offX = Math.round(Math.sin(Math.PI / 2) * Math.abs(width / 2)) / 4;
                var offY = Math.round(Math.sin(Math.PI / 2) * Math.abs(height / 2)) / 4;
                this.offset.x = hDirection > 0 ? offX : -offX;
                this.offset.y = vDirection > 0 ? offY : -offY;
            }
            else {
                this.offset.x = 0;
                this.offset.y = 0;
            }
            ctx.beginPath();
            if (this.cropperSettings.cropperDrawSettings.lineDash) {
                ctx.setLineDash([1, 3]);
            }
            ctx.moveTo(this.position.x + this.offset.x, this.position.y + this.offset.y);
            ctx.lineTo(this.position.x + this.offset.x + sideLength * hDirection, this.position.y + this.offset.y);
            ctx.lineTo(this.position.x + this.offset.x + sideLength * hDirection, this.position.y + this.offset.y + sideLength * vDirection);
            ctx.lineTo(this.position.x + this.offset.x, this.position.y + this.offset.y + sideLength * vDirection);
            ctx.lineTo(this.position.x + this.offset.x, this.position.y + this.offset.y);
            ctx.closePath();
            ctx.fillStyle =
                this.cropperSettings.cropperDrawSettings.fillColor ||
                    'rgba(255,255,255,.7)';
            ctx.fill();
        };
        CornerMarker.prototype.moveX = function (x) {
            this.setPosition(x, this.position.y);
        };
        CornerMarker.prototype.moveY = function (y) {
            this.setPosition(this.position.x, y);
        };
        CornerMarker.prototype.move = function (x, y) {
            this.setPosition(x, y);
            this.verticalNeighbour.moveX(x);
            this.horizontalNeighbour.moveY(y);
        };
        CornerMarker.prototype.addHorizontalNeighbour = function (neighbour) {
            this.horizontalNeighbour = neighbour;
        };
        CornerMarker.prototype.addVerticalNeighbour = function (neighbour) {
            this.verticalNeighbour = neighbour;
        };
        CornerMarker.prototype.getHorizontalNeighbour = function () {
            return this.horizontalNeighbour;
        };
        CornerMarker.prototype.getVerticalNeighbour = function () {
            return this.verticalNeighbour;
        };
        CornerMarker.prototype.draw = function (ctx) {
            this.drawCornerFill(ctx);
            this.drawCornerBorder(ctx);
        };
        return CornerMarker;
    }(Handle));

    var CropTouch = /** @class */ (function () {
        function CropTouch(x, y, id) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (id === void 0) { id = 0; }
            this.id = id;
            this.x = x;
            this.y = y;
        }
        return CropTouch;
    }());

    var DragMarker = /** @class */ (function (_super) {
        __extends(DragMarker, _super);
        function DragMarker(x, y, radius, cropperSettings) {
            var _this = _super.call(this, x, y, radius, cropperSettings) || this;
            _this.iconPoints = [];
            _this.scaledIconPoints = [];
            _this.getDragIconPoints(_this.iconPoints, 1);
            _this.getDragIconPoints(_this.scaledIconPoints, 1.2);
            return _this;
        }
        DragMarker.prototype.draw = function (ctx) {
            if (this.over || this.drag) {
                this.drawIcon(ctx, this.scaledIconPoints);
            }
            else {
                this.drawIcon(ctx, this.iconPoints);
            }
        };
        DragMarker.prototype.getDragIconPoints = function (arr, scale) {
            var maxLength = 17 * scale;
            var arrowWidth = 14 * scale;
            var arrowLength = 8 * scale;
            var connectorThroat = 4 * scale;
            arr.push(new PointPool().instance.borrow(-connectorThroat / 2, maxLength - arrowLength));
            arr.push(new PointPool().instance.borrow(-arrowWidth / 2, maxLength - arrowLength));
            arr.push(new PointPool().instance.borrow(0, maxLength));
            arr.push(new PointPool().instance.borrow(arrowWidth / 2, maxLength - arrowLength));
            arr.push(new PointPool().instance.borrow(connectorThroat / 2, maxLength - arrowLength));
            arr.push(new PointPool().instance.borrow(connectorThroat / 2, connectorThroat / 2));
            arr.push(new PointPool().instance.borrow(maxLength - arrowLength, connectorThroat / 2));
            arr.push(new PointPool().instance.borrow(maxLength - arrowLength, arrowWidth / 2));
            arr.push(new PointPool().instance.borrow(maxLength, 0));
            arr.push(new PointPool().instance.borrow(maxLength - arrowLength, -arrowWidth / 2));
            arr.push(new PointPool().instance.borrow(maxLength - arrowLength, -connectorThroat / 2));
            arr.push(new PointPool().instance.borrow(connectorThroat / 2, -connectorThroat / 2));
            arr.push(new PointPool().instance.borrow(connectorThroat / 2, -maxLength + arrowLength));
            arr.push(new PointPool().instance.borrow(arrowWidth / 2, -maxLength + arrowLength));
            arr.push(new PointPool().instance.borrow(0, -maxLength));
            arr.push(new PointPool().instance.borrow(-arrowWidth / 2, -maxLength + arrowLength));
            arr.push(new PointPool().instance.borrow(-connectorThroat / 2, -maxLength + arrowLength));
            arr.push(new PointPool().instance.borrow(-connectorThroat / 2, -connectorThroat / 2));
            arr.push(new PointPool().instance.borrow(-maxLength + arrowLength, -connectorThroat / 2));
            arr.push(new PointPool().instance.borrow(-maxLength + arrowLength, -arrowWidth / 2));
            arr.push(new PointPool().instance.borrow(-maxLength, 0));
            arr.push(new PointPool().instance.borrow(-maxLength + arrowLength, arrowWidth / 2));
            arr.push(new PointPool().instance.borrow(-maxLength + arrowLength, connectorThroat / 2));
            arr.push(new PointPool().instance.borrow(-connectorThroat / 2, connectorThroat / 2));
        };
        DragMarker.prototype.drawIcon = function (ctx, points) {
            var e_1, _a;
            if (this.cropperSettings.showCenterMarker) {
                ctx.beginPath();
                ctx.moveTo(points[0].x + this.position.x, points[0].y + this.position.y);
                try {
                    for (var points_1 = __values(points), points_1_1 = points_1.next(); !points_1_1.done; points_1_1 = points_1.next()) {
                        var p = points_1_1.value;
                        ctx.lineTo(p.x + this.position.x, p.y + this.position.y);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (points_1_1 && !points_1_1.done && (_a = points_1.return)) _a.call(points_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                ctx.closePath();
                ctx.fillStyle = this.cropperSettings.cropperDrawSettings.dragIconFillColor;
                ctx.fill();
                ctx.lineWidth = this.cropperSettings.cropperDrawSettings.dragIconStrokeWidth;
                ctx.strokeStyle = this.cropperSettings.cropperDrawSettings.dragIconStrokeColor;
                ctx.stroke();
            }
        };
        DragMarker.prototype.recalculatePosition = function (bounds) {
            var c = bounds.getCentre();
            this.setPosition(c.x, c.y);
            new PointPool().instance.returnPoint(c);
        };
        return DragMarker;
    }(Handle));

    var ImageCropperModel = /** @class */ (function () {
        function ImageCropperModel() {
        }
        return ImageCropperModel;
    }());

    var ImageCropperDataShare = /** @class */ (function () {
        function ImageCropperDataShare() {
            this.share = {};
        }
        ImageCropperDataShare.prototype.setPressed = function (canvas) {
            this.pressed = canvas;
        };
        ImageCropperDataShare.prototype.setReleased = function (canvas) {
            if (canvas === this.pressed) {
                //  this.pressed = undefined;
            }
        };
        ImageCropperDataShare.prototype.setOver = function (canvas) {
            this.over = canvas;
        };
        ImageCropperDataShare.prototype.setStyle = function (canvas, style) {
            if (this.pressed !== undefined) {
                if (this.pressed === canvas) {
                    // TODO: check this
                    // angular.element(document.documentElement).css('cursor', style);
                }
            }
            else {
                if (canvas === this.over) {
                    // TODO: check this
                    // angular.element(document.documentElement).css('cursor', style);
                }
            }
        };
        return ImageCropperDataShare;
    }());

    var ImageCropper = /** @class */ (function (_super) {
        __extends(ImageCropper, _super);
        function ImageCropper(cropperSettings) {
            var _this = _super.call(this) || this;
            _this.imageCropperDataShare = new ImageCropperDataShare();
            var x = 0;
            var y = 0;
            var width = cropperSettings.width;
            var height = cropperSettings.height;
            var keepAspect = cropperSettings.keepAspect;
            var touchRadius = cropperSettings.touchRadius;
            var centerTouchRadius = cropperSettings.centerTouchRadius;
            var minWidth = cropperSettings.minWidth;
            var minHeight = cropperSettings.minHeight;
            var croppedWidth = cropperSettings.croppedWidth;
            var croppedHeight = cropperSettings.croppedHeight;
            _this.cropperSettings = cropperSettings;
            _this.crop = _this;
            _this.x = x;
            _this.y = y;
            _this.canvasHeight = cropperSettings.canvasHeight;
            _this.canvasWidth = cropperSettings.canvasWidth;
            _this.width = width;
            if (width === void 0) {
                _this.width = 100;
            }
            _this.height = height;
            if (height === void 0) {
                _this.height = 50;
            }
            _this.keepAspect = keepAspect;
            if (keepAspect === void 0) {
                _this.keepAspect = true;
            }
            _this.touchRadius = touchRadius;
            if (touchRadius === void 0) {
                _this.touchRadius = 20;
            }
            _this.minWidth = minWidth;
            _this.minHeight = minHeight;
            _this.aspectRatio = 0;
            _this.currentDragTouches = [];
            _this.isMouseDown = false;
            _this.ratioW = 1;
            _this.ratioH = 1;
            _this.fileType = cropperSettings.fileType;
            _this.imageSet = false;
            _this.pointPool = new PointPool(200);
            _this.tl = new CornerMarker(x, y, touchRadius, _this.cropperSettings);
            _this.tr = new CornerMarker(x + width, y, touchRadius, _this.cropperSettings);
            _this.bl = new CornerMarker(x, y + height, touchRadius, _this.cropperSettings);
            _this.br = new CornerMarker(x + width, y + height, touchRadius, _this.cropperSettings);
            _this.tl.addHorizontalNeighbour(_this.tr);
            _this.tl.addVerticalNeighbour(_this.bl);
            _this.tr.addHorizontalNeighbour(_this.tl);
            _this.tr.addVerticalNeighbour(_this.br);
            _this.bl.addHorizontalNeighbour(_this.br);
            _this.bl.addVerticalNeighbour(_this.tl);
            _this.br.addHorizontalNeighbour(_this.bl);
            _this.br.addVerticalNeighbour(_this.tr);
            _this.markers = [_this.tl, _this.tr, _this.bl, _this.br];
            _this.center = new DragMarker(x + width / 2, y + height / 2, centerTouchRadius, _this.cropperSettings);
            _this.aspectRatio = height / width;
            _this.croppedImage = new Image();
            _this.currentlyInteracting = false;
            _this.cropWidth = croppedWidth;
            _this.cropHeight = croppedHeight;
            return _this;
        }
        ImageCropper.prototype.sign = function (x) {
            if (+x === x) {
                return x === 0 ? x : x > 0 ? 1 : -1;
            }
            return NaN;
        };
        ImageCropper.prototype.getMousePos = function (canvas, evt) {
            var rect = canvas.getBoundingClientRect();
            return new PointPool().instance.borrow(evt.clientX - rect.left, evt.clientY - rect.top);
        };
        ImageCropper.prototype.getTouchPos = function (canvas, touch) {
            var rect = canvas.getBoundingClientRect();
            return new PointPool().instance.borrow(touch.clientX - rect.left, touch.clientY - rect.top);
        };
        ImageCropper.prototype.detectVerticalSquash = function (img) {
            var ih = img.height;
            var canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = ih;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            var imageData = ctx.getImageData(0, 0, 1, ih);
            if (imageData) {
                var data = imageData.data;
                // search image edge pixel position in case it is squashed vertically.
                var sy = 0;
                var ey = ih;
                var py = ih;
                while (py > sy) {
                    var alpha = data[(py - 1) * 4 + 3];
                    if (alpha === 0) {
                        ey = py;
                    }
                    else {
                        sy = py;
                    }
                    // tslint:disable-next-line:no-bitwise
                    py = (ey + sy) >> 1;
                }
                var ratio = py / ih;
                return ratio === 0 ? 1 : ratio;
            }
            else {
                return 1;
            }
        };
        ImageCropper.prototype.getDataUriMimeType = function (dataUri) {
            // Get a substring because the regex does not perform well on very large strings.
            // Cater for optional charset. Length 50 shoould be enough.
            var dataUriSubstring = dataUri.substring(0, 50);
            var mimeType = 'image/png';
            // data-uri scheme
            // data:[<media type>][;charset=<character set>][;base64],<data>
            var regEx = RegExp(/^(data:)([\w\/\+]+);(charset=[\w-]+|base64).*,(.*)/gi);
            var matches = regEx.exec(dataUriSubstring);
            if (matches && matches[2]) {
                mimeType = matches[2];
                if (mimeType === 'image/jpg') {
                    mimeType = 'image/jpeg';
                }
            }
            return mimeType;
        };
        ImageCropper.prototype.prepare = function (canvas) {
            this.buffer = document.createElement('canvas');
            this.cropCanvas = document.createElement('canvas');
            // todo get more reliable parent width value.
            var responsiveWidth = canvas.parentElement
                ? canvas.parentElement.clientWidth
                : 0;
            if (responsiveWidth > 0 && this.cropperSettings.dynamicSizing) {
                this.cropCanvas.width = responsiveWidth;
                this.buffer.width = responsiveWidth;
                canvas.width = responsiveWidth;
            }
            else {
                this.cropCanvas.width = this.cropWidth;
                this.buffer.width = canvas.width;
            }
            this.cropCanvas.height = this.cropHeight;
            this.buffer.height = canvas.height;
            this.canvas = canvas;
            this.ctx = this.canvas.getContext('2d');
            this.draw(this.ctx);
        };
        ImageCropper.prototype.updateSettings = function (cropperSettings) {
            this.cropperSettings = cropperSettings;
        };
        ImageCropper.prototype.resizeCanvas = function (width, height, setImage) {
            if (setImage === void 0) { setImage = false; }
            this.canvas.width = this.cropCanvas.width = this.width = this.canvasWidth = this.buffer.width = width;
            this.canvas.height = this.cropCanvas.height = this.height = this.canvasHeight = this.buffer.height = height;
            if (setImage) {
                this.setImage(this.srcImage);
            }
        };
        ImageCropper.prototype.reset = function () {
            this.setImage(undefined);
        };
        ImageCropper.prototype.draw = function (ctx) {
            var bounds = this.getBounds();
            if (this.srcImage) {
                ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
                var sourceAspect = this.srcImage.height / this.srcImage.width;
                var canvasAspect = this.canvasHeight / this.canvasWidth;
                var w = this.canvasWidth;
                var h = this.canvasHeight;
                if (canvasAspect > sourceAspect) {
                    w = this.canvasWidth;
                    h = this.canvasWidth * sourceAspect;
                }
                else {
                    h = this.canvasHeight;
                    w = this.canvasHeight / sourceAspect;
                }
                this.ratioW = w / this.srcImage.width;
                this.ratioH = h / this.srcImage.height;
                if (canvasAspect < sourceAspect) {
                    this.drawImageIOSFix(ctx, this.srcImage, 0, 0, this.srcImage.width, this.srcImage.height, this.buffer.width / 2 - w / 2, 0, w, h);
                }
                else {
                    this.drawImageIOSFix(ctx, this.srcImage, 0, 0, this.srcImage.width, this.srcImage.height, 0, this.buffer.height / 2 - h / 2, w, h);
                }
                this.buffer.getContext('2d').drawImage(this.canvas, 0, 0, this.canvasWidth, this.canvasHeight);
                ctx.lineWidth = this.cropperSettings.cropperDrawSettings.strokeWidth;
                ctx.strokeStyle = this.cropperSettings.cropperDrawSettings.strokeColor;
                ctx.fillStyle = this.cropperSettings.cropperDrawSettings.backgroundFillColor;
                if (!this.cropperSettings.rounded) {
                    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
                    ctx.drawImage(this.buffer, bounds.left, bounds.top, Math.max(bounds.width, 1), Math.max(bounds.height, 1), bounds.left, bounds.top, bounds.width, bounds.height);
                    ctx.strokeRect(bounds.left, bounds.top, bounds.width, bounds.height);
                }
                else {
                    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2, bounds.width / 2, 0, 2 * Math.PI);
                    ctx.stroke();
                    ctx.clip();
                    if (canvasAspect < sourceAspect) {
                        this.drawImageIOSFix(ctx, this.srcImage, 0, 0, this.srcImage.width, this.srcImage.height, this.buffer.width / 2 - w / 2, 0, w, h);
                    }
                    else {
                        this.drawImageIOSFix(ctx, this.srcImage, 0, 0, this.srcImage.width, this.srcImage.height, 0, this.buffer.height / 2 - h / 2, w, h);
                    }
                    ctx.restore();
                }
                var marker = void 0;
                // tslint:disable-next-line:prefer-for-of
                for (var i = 0; i < this.markers.length; i++) {
                    marker = this.markers[i];
                    marker.draw(ctx);
                }
                this.center.draw(ctx);
            }
            else {
                ctx.fillStyle = 'rgba(192,192,192,1)';
                ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            }
        };
        ImageCropper.prototype.dragCenter = function (x, y, marker) {
            var bounds = this.getBounds();
            var left = x - bounds.width / 2;
            var right = x + bounds.width / 2;
            var top = y - bounds.height / 2;
            var bottom = y + bounds.height / 2;
            if (right >= this.maxXClamp) {
                x = this.maxXClamp - bounds.width / 2;
            }
            if (left <= this.minXClamp) {
                x = bounds.width / 2 + this.minXClamp;
            }
            if (top < this.minYClamp) {
                y = bounds.height / 2 + this.minYClamp;
            }
            if (bottom >= this.maxYClamp) {
                y = this.maxYClamp - bounds.height / 2;
            }
            this.tl.moveX(x - bounds.width / 2);
            this.tl.moveY(y - bounds.height / 2);
            this.tr.moveX(x + bounds.width / 2);
            this.tr.moveY(y - bounds.height / 2);
            this.bl.moveX(x - bounds.width / 2);
            this.bl.moveY(y + bounds.height / 2);
            this.br.moveX(x + bounds.width / 2);
            this.br.moveY(y + bounds.height / 2);
            marker.setPosition(x, y);
        };
        ImageCropper.prototype.enforceMinSize = function (x, y, marker) {
            var xLength = x - marker.getHorizontalNeighbour().position.x;
            var yLength = y - marker.getVerticalNeighbour().position.y;
            var xOver = this.minWidth - Math.abs(xLength);
            var yOver = this.minHeight - Math.abs(yLength);
            if (xLength === 0 || yLength === 0) {
                x = marker.position.x;
                y = marker.position.y;
                return new PointPool().instance.borrow(x, y);
            }
            if (this.keepAspect) {
                if (xOver > 0 && yOver / this.aspectRatio > 0) {
                    if (xOver > yOver / this.aspectRatio) {
                        if (xLength < 0) {
                            x -= xOver;
                            if (yLength < 0) {
                                y -= xOver * this.aspectRatio;
                            }
                            else {
                                y += xOver * this.aspectRatio;
                            }
                        }
                        else {
                            x += xOver;
                            if (yLength < 0) {
                                y -= xOver * this.aspectRatio;
                            }
                            else {
                                y += xOver * this.aspectRatio;
                            }
                        }
                    }
                    else {
                        if (yLength < 0) {
                            y -= yOver;
                            if (xLength < 0) {
                                x -= yOver / this.aspectRatio;
                            }
                            else {
                                x += yOver / this.aspectRatio;
                            }
                        }
                        else {
                            y += yOver;
                            if (xLength < 0) {
                                x -= yOver / this.aspectRatio;
                            }
                            else {
                                x += yOver / this.aspectRatio;
                            }
                        }
                    }
                }
                else {
                    if (xOver > 0) {
                        if (xLength < 0) {
                            x -= xOver;
                            if (yLength < 0) {
                                y -= xOver * this.aspectRatio;
                            }
                            else {
                                y += xOver * this.aspectRatio;
                            }
                        }
                        else {
                            x += xOver;
                            if (yLength < 0) {
                                y -= xOver * this.aspectRatio;
                            }
                            else {
                                y += xOver * this.aspectRatio;
                            }
                        }
                    }
                    else {
                        if (yOver > 0) {
                            if (yLength < 0) {
                                y -= yOver;
                                if (xLength < 0) {
                                    x -= yOver / this.aspectRatio;
                                }
                                else {
                                    x += yOver / this.aspectRatio;
                                }
                            }
                            else {
                                y += yOver;
                                if (xLength < 0) {
                                    x -= yOver / this.aspectRatio;
                                }
                                else {
                                    x += yOver / this.aspectRatio;
                                }
                            }
                        }
                    }
                }
            }
            else {
                if (xOver > 0) {
                    if (xLength < 0) {
                        x -= xOver;
                    }
                    else {
                        x += xOver;
                    }
                }
                if (yOver > 0) {
                    if (yLength < 0) {
                        y -= yOver;
                    }
                    else {
                        y += yOver;
                    }
                }
            }
            if (x < this.minXClamp ||
                x > this.maxXClamp ||
                y < this.minYClamp ||
                y > this.maxYClamp) {
                x = marker.position.x;
                y = marker.position.y;
            }
            return new PointPool().instance.borrow(x, y);
        };
        ImageCropper.prototype.dragCorner = function (x, y, marker) {
            var iX = 0;
            var iY = 0;
            var ax = 0;
            var ay = 0;
            var newHeight = 0;
            var newWidth = 0;
            var newY = 0;
            var newX = 0;
            var anchorMarker;
            var fold = 0;
            if (this.keepAspect) {
                anchorMarker = marker.getHorizontalNeighbour().getVerticalNeighbour();
                ax = anchorMarker.position.x;
                ay = anchorMarker.position.y;
                if (x <= anchorMarker.position.x) {
                    if (y <= anchorMarker.position.y) {
                        iX = ax - 100 / this.aspectRatio;
                        iY = ay - (100 / this.aspectRatio) * this.aspectRatio;
                        fold = this.getSide(new PointPool().instance.borrow(iX, iY), anchorMarker.position, new PointPool().instance.borrow(x, y));
                        if (fold > 0) {
                            newHeight = Math.abs(anchorMarker.position.y - y);
                            newWidth = newHeight / this.aspectRatio;
                            newY = anchorMarker.position.y - newHeight;
                            newX = anchorMarker.position.x - newWidth;
                            var min = this.enforceMinSize(newX, newY, marker);
                            marker.move(min.x, min.y);
                            new PointPool().instance.returnPoint(min);
                        }
                        else {
                            if (fold < 0) {
                                newWidth = Math.abs(anchorMarker.position.x - x);
                                newHeight = newWidth * this.aspectRatio;
                                newY = anchorMarker.position.y - newHeight;
                                newX = anchorMarker.position.x - newWidth;
                                var min = this.enforceMinSize(newX, newY, marker);
                                marker.move(min.x, min.y);
                                new PointPool().instance.returnPoint(min);
                            }
                        }
                    }
                    else {
                        iX = ax - 100 / this.aspectRatio;
                        iY = ay + (100 / this.aspectRatio) * this.aspectRatio;
                        fold = this.getSide(new PointPool().instance.borrow(iX, iY), anchorMarker.position, new PointPool().instance.borrow(x, y));
                        if (fold > 0) {
                            newWidth = Math.abs(anchorMarker.position.x - x);
                            newHeight = newWidth * this.aspectRatio;
                            newY = anchorMarker.position.y + newHeight;
                            newX = anchorMarker.position.x - newWidth;
                            var min = this.enforceMinSize(newX, newY, marker);
                            marker.move(min.x, min.y);
                            new PointPool().instance.returnPoint(min);
                        }
                        else {
                            if (fold < 0) {
                                newHeight = Math.abs(anchorMarker.position.y - y);
                                newWidth = newHeight / this.aspectRatio;
                                newY = anchorMarker.position.y + newHeight;
                                newX = anchorMarker.position.x - newWidth;
                                var min = this.enforceMinSize(newX, newY, marker);
                                marker.move(min.x, min.y);
                                new PointPool().instance.returnPoint(min);
                            }
                        }
                    }
                }
                else {
                    if (y <= anchorMarker.position.y) {
                        iX = ax + 100 / this.aspectRatio;
                        iY = ay - (100 / this.aspectRatio) * this.aspectRatio;
                        fold = this.getSide(new PointPool().instance.borrow(iX, iY), anchorMarker.position, new PointPool().instance.borrow(x, y));
                        if (fold < 0) {
                            newHeight = Math.abs(anchorMarker.position.y - y);
                            newWidth = newHeight / this.aspectRatio;
                            newY = anchorMarker.position.y - newHeight;
                            newX = anchorMarker.position.x + newWidth;
                            var min = this.enforceMinSize(newX, newY, marker);
                            marker.move(min.x, min.y);
                            new PointPool().instance.returnPoint(min);
                        }
                        else {
                            if (fold > 0) {
                                newWidth = Math.abs(anchorMarker.position.x - x);
                                newHeight = newWidth * this.aspectRatio;
                                newY = anchorMarker.position.y - newHeight;
                                newX = anchorMarker.position.x + newWidth;
                                var min = this.enforceMinSize(newX, newY, marker);
                                marker.move(min.x, min.y);
                                new PointPool().instance.returnPoint(min);
                            }
                        }
                    }
                    else {
                        iX = ax + 100 / this.aspectRatio;
                        iY = ay + (100 / this.aspectRatio) * this.aspectRatio;
                        fold = this.getSide(new PointPool().instance.borrow(iX, iY), anchorMarker.position, new PointPool().instance.borrow(x, y));
                        if (fold < 0) {
                            newWidth = Math.abs(anchorMarker.position.x - x);
                            newHeight = newWidth * this.aspectRatio;
                            newY = anchorMarker.position.y + newHeight;
                            newX = anchorMarker.position.x + newWidth;
                            var min = this.enforceMinSize(newX, newY, marker);
                            marker.move(min.x, min.y);
                            new PointPool().instance.returnPoint(min);
                        }
                        else {
                            if (fold > 0) {
                                newHeight = Math.abs(anchorMarker.position.y - y);
                                newWidth = newHeight / this.aspectRatio;
                                newY = anchorMarker.position.y + newHeight;
                                newX = anchorMarker.position.x + newWidth;
                                var min = this.enforceMinSize(newX, newY, marker);
                                marker.move(min.x, min.y);
                                new PointPool().instance.returnPoint(min);
                            }
                        }
                    }
                }
            }
            else {
                var min = this.enforceMinSize(x, y, marker);
                marker.move(min.x, min.y);
                new PointPool().instance.returnPoint(min);
            }
            this.center.recalculatePosition(this.getBounds());
        };
        ImageCropper.prototype.getSide = function (a, b, c) {
            var n = this.sign((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x));
            // TODO move the return of the pools to outside of this function
            new PointPool().instance.returnPoint(a);
            new PointPool().instance.returnPoint(c);
            return n;
        };
        ImageCropper.prototype.handleRelease = function (newCropTouch) {
            if (newCropTouch == null) {
                return;
            }
            var index = 0;
            for (var k = 0; k < this.currentDragTouches.length; k++) {
                if (newCropTouch.id === this.currentDragTouches[k].id) {
                    this.currentDragTouches[k].dragHandle.setDrag(false);
                    index = k;
                }
            }
            this.currentDragTouches.splice(index, 1);
            this.draw(this.ctx);
        };
        ImageCropper.prototype.handleMove = function (newCropTouch) {
            var e_1, _a;
            var matched = false;
            // tslint:disable-next-line:prefer-for-of
            for (var k = 0; k < this.currentDragTouches.length; k++) {
                if (newCropTouch.id === this.currentDragTouches[k].id &&
                    this.currentDragTouches[k].dragHandle != null) {
                    var dragTouch = this.currentDragTouches[k];
                    var clampedPositions = this.clampPosition(newCropTouch.x - dragTouch.dragHandle.offset.x, newCropTouch.y - dragTouch.dragHandle.offset.y);
                    newCropTouch.x = clampedPositions.x;
                    newCropTouch.y = clampedPositions.y;
                    new PointPool().instance.returnPoint(clampedPositions);
                    if (dragTouch.dragHandle instanceof CornerMarker) {
                        this.dragCorner(newCropTouch.x, newCropTouch.y, dragTouch.dragHandle);
                    }
                    else {
                        this.dragCenter(newCropTouch.x, newCropTouch.y, dragTouch.dragHandle);
                    }
                    this.currentlyInteracting = true;
                    matched = true;
                    this.imageCropperDataShare.setPressed(this.canvas);
                    break;
                }
            }
            if (!matched) {
                try {
                    for (var _b = __values(this.markers), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var marker = _c.value;
                        if (marker.touchInBounds(newCropTouch.x, newCropTouch.y)) {
                            newCropTouch.dragHandle = marker;
                            this.currentDragTouches.push(newCropTouch);
                            marker.setDrag(true);
                            newCropTouch.dragHandle.offset.x =
                                newCropTouch.x - newCropTouch.dragHandle.position.x;
                            newCropTouch.dragHandle.offset.y =
                                newCropTouch.y - newCropTouch.dragHandle.position.y;
                            this.dragCorner(newCropTouch.x - newCropTouch.dragHandle.offset.x, newCropTouch.y - newCropTouch.dragHandle.offset.y, newCropTouch.dragHandle);
                            break;
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                if (newCropTouch.dragHandle === null ||
                    typeof newCropTouch.dragHandle === 'undefined') {
                    if (this.center.touchInBounds(newCropTouch.x, newCropTouch.y)) {
                        newCropTouch.dragHandle = this.center;
                        this.currentDragTouches.push(newCropTouch);
                        newCropTouch.dragHandle.setDrag(true);
                        newCropTouch.dragHandle.offset.x =
                            newCropTouch.x - newCropTouch.dragHandle.position.x;
                        newCropTouch.dragHandle.offset.y =
                            newCropTouch.y - newCropTouch.dragHandle.position.y;
                        this.dragCenter(newCropTouch.x - newCropTouch.dragHandle.offset.x, newCropTouch.y - newCropTouch.dragHandle.offset.y, newCropTouch.dragHandle);
                    }
                }
            }
        };
        ImageCropper.prototype.updateClampBounds = function () {
            var sourceAspect = this.srcImage.height / this.srcImage.width;
            var canvasAspect = this.canvas.height / this.canvas.width;
            var w = this.canvas.width;
            var h = this.canvas.height;
            if (canvasAspect > sourceAspect) {
                w = this.canvas.width;
                h = this.canvas.width * sourceAspect;
            }
            else {
                h = this.canvas.height;
                w = this.canvas.height / sourceAspect;
            }
            this.minXClamp = this.canvas.width / 2 - w / 2;
            this.minYClamp = this.canvas.height / 2 - h / 2;
            this.maxXClamp = this.canvas.width / 2 + w / 2;
            this.maxYClamp = this.canvas.height / 2 + h / 2;
        };
        ImageCropper.prototype.getCropBounds = function () {
            var bounds = this.getBounds();
            bounds.top = Math.round((bounds.top - this.minYClamp) / this.ratioH);
            bounds.bottom = Math.round((bounds.bottom - this.minYClamp) / this.ratioH);
            bounds.left = Math.round((bounds.left - this.minXClamp) / this.ratioW);
            bounds.right = Math.round((bounds.right - this.minXClamp) / this.ratioW);
            return bounds;
        };
        ImageCropper.prototype.clampPosition = function (x, y) {
            if (x < this.minXClamp) {
                x = this.minXClamp;
            }
            if (x > this.maxXClamp) {
                x = this.maxXClamp;
            }
            if (y < this.minYClamp) {
                y = this.minYClamp;
            }
            if (y > this.maxYClamp) {
                y = this.maxYClamp;
            }
            return new PointPool().instance.borrow(x, y);
        };
        ImageCropper.prototype.isImageSet = function () {
            return this.imageSet;
        };
        ImageCropper.prototype.setImage = function (img) {
            this.srcImage = img;
            if (!img) {
                this.imageSet = false;
                this.draw(this.ctx);
            }
            else {
                this.imageSet = true;
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                var bufferContext = this.buffer.getContext('2d');
                bufferContext.clearRect(0, 0, this.buffer.width, this.buffer.height);
                if (!this.cropperSettings.fileType) {
                    this.fileType = this.getDataUriMimeType(img.src);
                }
                if (this.cropperSettings.minWithRelativeToResolution) {
                    this.minWidth =
                        (this.canvas.width * this.cropperSettings.minWidth) /
                            this.srcImage.width;
                    this.minHeight =
                        (this.canvas.height * this.cropperSettings.minHeight) /
                            this.srcImage.height;
                }
                this.updateClampBounds();
                this.canvasWidth = this.canvas.width;
                this.canvasHeight = this.canvas.height;
                var cropPosition = this.getCropPositionFromMarkers();
                this.setCropPosition(cropPosition);
            }
        };
        ImageCropper.prototype.updateCropPosition = function (cropBounds) {
            var cropPosition = this.getCropPositionFromBounds(cropBounds);
            this.setCropPosition(cropPosition);
        };
        ImageCropper.prototype.setCropPosition = function (cropPosition) {
            var e_2, _a;
            this.tl.setPosition(cropPosition[0].x, cropPosition[0].y);
            this.tr.setPosition(cropPosition[1].x, cropPosition[1].y);
            this.bl.setPosition(cropPosition[2].x, cropPosition[2].y);
            this.br.setPosition(cropPosition[3].x, cropPosition[3].y);
            this.center.setPosition(cropPosition[4].x, cropPosition[4].y);
            try {
                for (var cropPosition_1 = __values(cropPosition), cropPosition_1_1 = cropPosition_1.next(); !cropPosition_1_1.done; cropPosition_1_1 = cropPosition_1.next()) {
                    var position = cropPosition_1_1.value;
                    new PointPool().instance.returnPoint(position);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (cropPosition_1_1 && !cropPosition_1_1.done && (_a = cropPosition_1.return)) _a.call(cropPosition_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            this.vertSquashRatio = this.detectVerticalSquash(this.srcImage);
            this.draw(this.ctx);
            this.croppedImage = this.getCroppedImageHelper(false, this.cropWidth, this.cropHeight);
        };
        ImageCropper.prototype.getCropPositionFromMarkers = function () {
            var w = this.canvas.width;
            var h = this.canvas.height;
            var tlPos;
            var trPos;
            var blPos;
            var brPos;
            var center;
            var sourceAspect = this.srcImage.height / this.srcImage.width;
            var cropBounds = this.getBounds();
            var cropAspect = cropBounds.height / cropBounds.width;
            var cX = this.canvas.width / 2;
            var cY = this.canvas.height / 2;
            if (cropAspect > sourceAspect) {
                var imageH = Math.min(w * sourceAspect, h);
                var cropW = imageH / cropAspect;
                tlPos = new PointPool().instance.borrow(cX - cropW / 2, cY + imageH / 2);
                trPos = new PointPool().instance.borrow(cX + cropW / 2, cY + imageH / 2);
                blPos = new PointPool().instance.borrow(cX - cropW / 2, cY - imageH / 2);
                brPos = new PointPool().instance.borrow(cX + cropW / 2, cY - imageH / 2);
            }
            else {
                var imageW = Math.min(h / sourceAspect, w);
                var cropH = imageW * cropAspect;
                tlPos = new PointPool().instance.borrow(cX - imageW / 2, cY + cropH / 2);
                trPos = new PointPool().instance.borrow(cX + imageW / 2, cY + cropH / 2);
                blPos = new PointPool().instance.borrow(cX - imageW / 2, cY - cropH / 2);
                brPos = new PointPool().instance.borrow(cX + imageW / 2, cY - cropH / 2);
            }
            center = new PointPool().instance.borrow(cX, cY);
            var positions = [tlPos, trPos, blPos, brPos, center];
            return positions;
        };
        ImageCropper.prototype.getCropPositionFromBounds = function (cropPosition) {
            var marginTop = 0;
            var marginLeft = 0;
            var canvasAspect = this.canvasHeight / this.canvasWidth;
            var sourceAspect = this.srcImage.height / this.srcImage.width;
            if (canvasAspect > sourceAspect) {
                marginTop =
                    this.buffer.height / 2 - (this.canvasWidth * sourceAspect) / 2;
            }
            else {
                marginLeft = this.buffer.width / 2 - this.canvasHeight / sourceAspect / 2;
            }
            var ratioW = (this.canvasWidth - marginLeft * 2) / this.srcImage.width;
            var ratioH = (this.canvasHeight - marginTop * 2) / this.srcImage.height;
            var actualH = cropPosition.height * ratioH;
            var actualW = cropPosition.width * ratioW;
            var actualX = cropPosition.left * ratioW + marginLeft;
            var actualY = cropPosition.top * ratioH + marginTop;
            if (this.keepAspect) {
                var scaledW = actualH / this.aspectRatio;
                var scaledH = actualW * this.aspectRatio;
                if (this.getCropBounds().height === cropPosition.height) {
                    // only width changed
                    actualH = scaledH;
                }
                else if (this.getCropBounds().width === cropPosition.width) {
                    // only height changed
                    actualW = scaledW;
                }
                else {
                    // height and width changed
                    if (Math.abs(scaledH - actualH) < Math.abs(scaledW - actualW)) {
                        actualW = scaledW;
                    }
                    else {
                        actualH = scaledH;
                    }
                }
            }
            var tlPos = new PointPool().instance.borrow(actualX, actualY + actualH);
            var trPos = new PointPool().instance.borrow(actualX + actualW, actualY + actualH);
            var blPos = new PointPool().instance.borrow(actualX, actualY);
            var brPos = new PointPool().instance.borrow(actualX + actualW, actualY);
            var center = new PointPool().instance.borrow(actualX + actualW / 2, actualY + actualH / 2);
            var positions = [tlPos, trPos, blPos, brPos, center];
            return positions;
        };
        ImageCropper.prototype.getCroppedImageHelper = function (preserveSize, fillWidth, fillHeight) {
            if (this.cropperSettings.cropOnResize) {
                return this.getCroppedImage(preserveSize, fillWidth, fillHeight);
            }
            return this.croppedImage
                ? this.croppedImage
                : document.createElement('img');
        };
        // todo: Unused parameters?
        ImageCropper.prototype.getCroppedImage = function (preserveSize, fillWidth, fillHeight) {
            var bounds = this.getBounds();
            if (!this.srcImage) {
                return document.createElement('img');
            }
            else {
                var sourceAspect = this.srcImage.height / this.srcImage.width;
                var canvasAspect = this.canvas.height / this.canvas.width;
                var w = this.canvas.width;
                var h = this.canvas.height;
                if (canvasAspect > sourceAspect) {
                    w = this.canvas.width;
                    h = this.canvas.width * sourceAspect;
                }
                else {
                    if (canvasAspect < sourceAspect) {
                        h = this.canvas.height;
                        w = this.canvas.height / sourceAspect;
                    }
                    else {
                        h = this.canvas.height;
                        w = this.canvas.width;
                    }
                }
                this.ratioW = w / this.srcImage.width;
                this.ratioH = h / this.srcImage.height;
                var offsetH = (this.buffer.height - h) / 2 / this.ratioH;
                var offsetW = (this.buffer.width - w) / 2 / this.ratioW;
                var ctx = this.cropCanvas.getContext('2d');
                if (this.cropperSettings.preserveSize || preserveSize) {
                    var width = Math.round(bounds.right / this.ratioW - bounds.left / this.ratioW);
                    var height = Math.round(bounds.bottom / this.ratioH - bounds.top / this.ratioH);
                    this.cropCanvas.width = width;
                    this.cropCanvas.height = height;
                    this.cropperSettings.croppedWidth = this.cropCanvas.width;
                    this.cropperSettings.croppedHeight = this.cropCanvas.height;
                }
                else {
                    this.cropCanvas.width = this.cropWidth;
                    this.cropCanvas.height = this.cropHeight;
                }
                ctx.clearRect(0, 0, this.cropCanvas.width, this.cropCanvas.height);
                this.drawImageIOSFix(ctx, this.srcImage, Math.max(Math.round(bounds.left / this.ratioW - offsetW), 0), Math.max(Math.round(bounds.top / this.ratioH - offsetH), 0), Math.max(Math.round(bounds.width / this.ratioW), 1), Math.max(Math.round(bounds.height / this.ratioH), 1), 0, 0, this.cropCanvas.width, this.cropCanvas.height);
                if (this.cropperSettings.resampleFn) {
                    this.cropperSettings.resampleFn(this.cropCanvas);
                }
                this.croppedImage.width = this.cropCanvas.width;
                this.croppedImage.height = this.cropCanvas.height;
                this.croppedImage.src = this.cropCanvas.toDataURL(this.fileType, this.cropperSettings.compressRatio);
                return this.croppedImage;
            }
        };
        ImageCropper.prototype.getBounds = function () {
            var e_3, _a;
            var minX = Number.MAX_VALUE;
            var minY = Number.MAX_VALUE;
            var maxX = -Number.MAX_VALUE;
            var maxY = -Number.MAX_VALUE;
            try {
                for (var _b = __values(this.markers), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var marker = _c.value;
                    if (marker.position.x < minX) {
                        minX = marker.position.x;
                    }
                    if (marker.position.x > maxX) {
                        maxX = marker.position.x;
                    }
                    if (marker.position.y < minY) {
                        minY = marker.position.y;
                    }
                    if (marker.position.y > maxY) {
                        maxY = marker.position.y;
                    }
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_3) throw e_3.error; }
            }
            var bounds = new Bounds();
            bounds.left = minX;
            bounds.right = maxX;
            bounds.top = minY;
            bounds.bottom = maxY;
            return bounds;
        };
        ImageCropper.prototype.setBounds = function (bounds) {
            var e_4, _a;
            // const topLeft: CornerMarker;
            // const topRight: CornerMarker;
            // const bottomLeft: CornerMarker;
            // const bottomRight: CornerMarker;
            var currentBounds = this.getBounds();
            try {
                for (var _b = __values(this.markers), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var marker = _c.value;
                    if (marker.position.x === currentBounds.left) {
                        if (marker.position.y === currentBounds.top) {
                            marker.setPosition(bounds.left, bounds.top);
                        }
                        else {
                            marker.setPosition(bounds.left, bounds.bottom);
                        }
                    }
                    else {
                        if (marker.position.y === currentBounds.top) {
                            marker.setPosition(bounds.right, bounds.top);
                        }
                        else {
                            marker.setPosition(bounds.right, bounds.bottom);
                        }
                    }
                }
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_4) throw e_4.error; }
            }
            this.center.recalculatePosition(bounds);
            this.center.draw(this.ctx);
            this.draw(this.ctx); // we need to redraw all canvas if we have changed bounds
        };
        ImageCropper.prototype.onTouchMove = function (event) {
            if (this.crop.isImageSet()) {
                if (event.touches.length === 1) {
                    if (this.isMouseDown) {
                        event.preventDefault();
                        // tslint:disable-next-line:prefer-for-of
                        for (var i = 0; i < event.touches.length; i++) {
                            var touch = event.touches[i];
                            var touchPosition = this.getTouchPos(this.canvas, touch);
                            var cropTouch = new CropTouch(touchPosition.x, touchPosition.y, touch.identifier);
                            new PointPool().instance.returnPoint(touchPosition);
                            this.move(cropTouch);
                        }
                    }
                }
                else {
                    if (event.touches.length === 2) {
                        event.preventDefault();
                        var distance = (event.touches[0].clientX - event.touches[1].clientX) *
                            (event.touches[0].clientX - event.touches[1].clientX) +
                            (event.touches[0].clientY - event.touches[1].clientY) *
                                (event.touches[0].clientY - event.touches[1].clientY);
                        if (this.previousDistance && this.previousDistance !== distance) {
                            var bounds = this.getBounds();
                            if (distance < this.previousDistance) {
                                bounds.top += 1;
                                bounds.left += 1;
                                bounds.right -= 1;
                                bounds.bottom -= 1;
                            }
                            if (distance > this.previousDistance) {
                                if (bounds.top !== this.minYClamp &&
                                    bounds.bottom !== this.maxYClamp &&
                                    bounds.left !== this.minXClamp &&
                                    bounds.right !== this.maxXClamp) {
                                    // none
                                    bounds.top -= 1;
                                    bounds.left -= 1;
                                    bounds.right += 1;
                                    bounds.bottom += 1;
                                }
                                else if (bounds.top !== this.minYClamp &&
                                    bounds.bottom !== this.maxYClamp &&
                                    bounds.left === this.minXClamp &&
                                    bounds.right !== this.maxXClamp) {
                                    // left
                                    bounds.top -= 1;
                                    bounds.right += 2;
                                    bounds.bottom += 1;
                                }
                                else if (bounds.top !== this.minYClamp &&
                                    bounds.bottom !== this.maxYClamp &&
                                    bounds.left !== this.minXClamp &&
                                    bounds.right === this.maxXClamp) {
                                    // right
                                    bounds.top -= 1;
                                    bounds.left -= 2;
                                    bounds.bottom += 1;
                                }
                                else if (bounds.top === this.minYClamp &&
                                    bounds.bottom !== this.maxYClamp &&
                                    bounds.left !== this.minXClamp &&
                                    bounds.right !== this.maxXClamp) {
                                    // top
                                    bounds.left -= 1;
                                    bounds.right += 1;
                                    bounds.bottom += 2;
                                }
                                else if (bounds.top !== this.minYClamp &&
                                    bounds.bottom === this.maxYClamp &&
                                    bounds.left !== this.minXClamp &&
                                    bounds.right !== this.maxXClamp) {
                                    // bottom
                                    bounds.top -= 2;
                                    bounds.left -= 1;
                                    bounds.right += 1;
                                }
                                else if (bounds.top === this.minYClamp &&
                                    bounds.bottom !== this.maxYClamp &&
                                    bounds.left === this.minXClamp &&
                                    bounds.right !== this.maxXClamp) {
                                    // top left
                                    bounds.right += 2;
                                    bounds.bottom += 2;
                                }
                                else if (bounds.top === this.minYClamp &&
                                    bounds.bottom !== this.maxYClamp &&
                                    bounds.left !== this.minXClamp &&
                                    bounds.right === this.maxXClamp) {
                                    // top right
                                    bounds.left -= 2;
                                    bounds.bottom += 2;
                                }
                                else if (bounds.top !== this.minYClamp &&
                                    bounds.bottom === this.maxYClamp &&
                                    bounds.left === this.minXClamp &&
                                    bounds.right !== this.maxXClamp) {
                                    // bottom left
                                    bounds.top -= 2;
                                    bounds.right += 2;
                                }
                                else if (bounds.top !== this.minYClamp &&
                                    bounds.bottom === this.maxYClamp &&
                                    bounds.left !== this.minXClamp &&
                                    bounds.right === this.maxXClamp) {
                                    // bottom right
                                    bounds.top -= 2;
                                    bounds.left -= 2;
                                }
                            }
                            if (bounds.top < this.minYClamp) {
                                bounds.top = this.minYClamp;
                            }
                            if (bounds.bottom > this.maxYClamp) {
                                bounds.bottom = this.maxYClamp;
                            }
                            if (bounds.left < this.minXClamp) {
                                bounds.left = this.minXClamp;
                            }
                            if (bounds.right > this.maxXClamp) {
                                bounds.right = this.maxXClamp;
                            }
                            this.setBounds(bounds);
                        }
                        this.previousDistance = distance;
                    }
                }
                this.draw(this.ctx);
            }
        };
        ImageCropper.prototype.onMouseMove = function (e) {
            if (this.crop.isImageSet() && this.isMouseDown) {
                var mousePosition = this.getMousePos(this.canvas, e);
                this.move(new CropTouch(mousePosition.x, mousePosition.y, 0));
                var dragTouch = this.getDragTouchForID(0);
                if (dragTouch) {
                    dragTouch.x = mousePosition.x;
                    dragTouch.y = mousePosition.y;
                }
                else {
                    dragTouch = new CropTouch(mousePosition.x, mousePosition.y, 0);
                }
                new PointPool().instance.returnPoint(mousePosition);
                this.drawCursors(dragTouch);
                this.draw(this.ctx);
            }
        };
        ImageCropper.prototype.move = function (cropTouch) {
            if (this.isMouseDown) {
                this.handleMove(cropTouch);
            }
        };
        ImageCropper.prototype.getDragTouchForID = function (id) {
            // tslint:disable-next-line:prefer-for-of
            for (var i = 0; i < this.currentDragTouches.length; i++) {
                if (id === this.currentDragTouches[i].id) {
                    return this.currentDragTouches[i];
                }
            }
            return undefined;
        };
        ImageCropper.prototype.drawCursors = function (cropTouch) {
            var cursorDrawn = false;
            if (cropTouch != null) {
                if (cropTouch.dragHandle === this.center) {
                    this.imageCropperDataShare.setStyle(this.canvas, 'move');
                    cursorDrawn = true;
                }
                if (cropTouch.dragHandle !== null &&
                    cropTouch.dragHandle instanceof CornerMarker) {
                    this.drawCornerCursor(cropTouch.dragHandle, cropTouch.dragHandle.position.x, cropTouch.dragHandle.position.y);
                    cursorDrawn = true;
                }
            }
            var didDraw = false;
            if (!cursorDrawn) {
                // tslint:disable-next-line:prefer-for-of
                for (var i = 0; i < this.markers.length; i++) {
                    didDraw =
                        didDraw ||
                            this.drawCornerCursor(this.markers[i], cropTouch.x, cropTouch.y);
                }
                if (!didDraw) {
                    this.imageCropperDataShare.setStyle(this.canvas, 'initial');
                }
            }
            if (!didDraw &&
                !cursorDrawn &&
                this.center.touchInBounds(cropTouch.x, cropTouch.y)) {
                this.center.setOver(true);
                this.imageCropperDataShare.setOver(this.canvas);
                this.imageCropperDataShare.setStyle(this.canvas, 'move');
            }
            else {
                this.center.setOver(false);
            }
        };
        ImageCropper.prototype.drawCornerCursor = function (marker, x, y) {
            if (marker.touchInBounds(x, y)) {
                marker.setOver(true);
                if (marker.getHorizontalNeighbour().position.x > marker.position.x) {
                    if (marker.getVerticalNeighbour().position.y > marker.position.y) {
                        this.imageCropperDataShare.setOver(this.canvas);
                        this.imageCropperDataShare.setStyle(this.canvas, 'nwse-resize');
                    }
                    else {
                        this.imageCropperDataShare.setOver(this.canvas);
                        this.imageCropperDataShare.setStyle(this.canvas, 'nesw-resize');
                    }
                }
                else {
                    if (marker.getVerticalNeighbour().position.y > marker.position.y) {
                        this.imageCropperDataShare.setOver(this.canvas);
                        this.imageCropperDataShare.setStyle(this.canvas, 'nesw-resize');
                    }
                    else {
                        this.imageCropperDataShare.setOver(this.canvas);
                        this.imageCropperDataShare.setStyle(this.canvas, 'nwse-resize');
                    }
                }
                return true;
            }
            marker.setOver(false);
            return false;
        };
        ImageCropper.prototype.onTouchStart = function (event) {
            var e_5, _a;
            if (this.crop.isImageSet()) {
                var touch = event.touches[0];
                var touchPosition = this.getTouchPos(this.canvas, touch);
                var cropTouch = new CropTouch(touchPosition.x, touchPosition.y, touch.identifier);
                new PointPool().instance.returnPoint(touchPosition);
                this.isMouseDown = false;
                try {
                    for (var _b = __values(this.markers), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var marker = _c.value;
                        if (marker.touchInBounds(cropTouch.x, cropTouch.y)) {
                            this.isMouseDown = true;
                        }
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
                if (this.center.touchInBounds(cropTouch.x, cropTouch.y)) {
                    this.isMouseDown = true;
                }
            }
        };
        ImageCropper.prototype.onTouchEnd = function (event) {
            if (this.crop.isImageSet()) {
                // tslint:disable-next-line:prefer-for-of
                for (var i = 0; i < event.changedTouches.length; i++) {
                    var touch = event.changedTouches[i];
                    var dragTouch = this.getDragTouchForID(touch.identifier);
                    if (dragTouch && dragTouch !== undefined) {
                        if (dragTouch.dragHandle instanceof CornerMarker ||
                            dragTouch.dragHandle instanceof DragMarker) {
                            dragTouch.dragHandle.setOver(false);
                        }
                        this.handleRelease(dragTouch);
                    }
                }
                if (this.currentDragTouches.length === 0) {
                    this.isMouseDown = false;
                    this.currentlyInteracting = false;
                }
            }
        };
        // http://stackoverflow.com/questions/11929099/html5-canvas-drawimage-ratio-bug-ios
        ImageCropper.prototype.drawImageIOSFix = function (ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
            // Works only if whole image is displayed:
            // ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
            // The following works correct also when only a part of the image is displayed:
            // ctx.drawImage(img, sx * this.vertSquashRatio, sy * this.vertSquashRatio, sw * this.vertSquashRatio, sh *
            // this.vertSquashRatio, dx, dy, dw, dh);
            ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
        };
        ImageCropper.prototype.onMouseDown = function (event) {
            if (this.crop.isImageSet()) {
                this.isMouseDown = true;
            }
        };
        ImageCropper.prototype.onMouseUp = function (event) {
            if (this.crop.isImageSet()) {
                this.imageCropperDataShare.setReleased(this.canvas);
                this.isMouseDown = false;
                this.handleRelease(new CropTouch(0, 0, 0));
            }
        };
        return ImageCropper;
    }(ImageCropperModel));

    var CropPosition = /** @class */ (function () {
        function CropPosition(x, y, w, h) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (w === void 0) { w = 0; }
            if (h === void 0) { h = 0; }
            this.x = +x;
            this.y = +y;
            this.w = +w;
            this.h = +h;
        }
        CropPosition.prototype.toBounds = function () {
            return new Bounds(this.x, this.y, this.w, this.h);
        };
        CropPosition.prototype.isInitialized = function () {
            return this.x !== 0 && this.y !== 0 && this.w !== 0 && this.h !== 0;
        };
        return CropPosition;
    }());

    var ImageCropperComponent = /** @class */ (function () {
        function ImageCropperComponent(renderer, document) {
            this.document = document;
            this.cropPositionChange = new i0.EventEmitter();
            this.exif = new Exif();
            // tslint:disable-next-line:no-output-on-prefix
            this.onCrop = new i0.EventEmitter();
            this.imageSet = new i0.EventEmitter();
            this.dragUnsubscribers = [];
            this.renderer = renderer;
        }
        ImageCropperComponent.prototype.ngAfterViewInit = function () {
            var canvas = this.cropcanvas.nativeElement;
            if (!this.settings) {
                this.settings = new CropperSettings();
            }
            if (this.settings.cropperClass) {
                this.renderer.setAttribute(canvas, 'class', this.settings.cropperClass);
            }
            if (!this.settings.dynamicSizing) {
                this.renderer.setAttribute(canvas, 'width', this.settings.canvasWidth.toString());
                this.renderer.setAttribute(canvas, 'height', this.settings.canvasHeight.toString());
            }
            else {
                this.windowListener = this.resize.bind(this);
                window.addEventListener('resize', this.windowListener);
            }
            if (!this.cropper) {
                this.cropper = new ImageCropper(this.settings);
            }
            this.cropper.prepare(canvas);
        };
        ImageCropperComponent.prototype.ngOnChanges = function (changes) {
            if (this.isCropPositionChanged(changes)) {
                this.cropper.updateCropPosition(this.cropPosition.toBounds());
                if (this.cropper.isImageSet()) {
                    var bounds = this.cropper.getCropBounds();
                    this.image.image = this.cropper.getCroppedImageHelper().src;
                    this.onCrop.emit(bounds);
                }
                this.updateCropBounds();
            }
            if (changes.inputImage) {
                this.setImage(changes.inputImage.currentValue);
            }
            if (changes.settings && this.cropper) {
                this.cropper.updateSettings(this.settings);
                if (this.cropper.isImageSet()) {
                    this.image.image = this.cropper.getCroppedImageHelper().src;
                    this.onCrop.emit(this.cropper.getCropBounds());
                }
            }
        };
        ImageCropperComponent.prototype.ngOnDestroy = function () {
            this.removeDragListeners();
            if (this.settings.dynamicSizing && this.windowListener) {
                window.removeEventListener('resize', this.windowListener);
            }
        };
        ImageCropperComponent.prototype.onTouchMove = function (event) {
            this.cropper.onTouchMove(event);
        };
        ImageCropperComponent.prototype.onTouchStart = function (event) {
            this.cropper.onTouchStart(event);
        };
        ImageCropperComponent.prototype.onTouchEnd = function (event) {
            this.cropper.onTouchEnd(event);
            if (this.cropper.isImageSet()) {
                this.image.image = this.cropper.getCroppedImageHelper().src;
                this.onCrop.emit(this.cropper.getCropBounds());
                this.updateCropBounds();
            }
        };
        ImageCropperComponent.prototype.onMouseDown = function (event) {
            this.dragUnsubscribers.push(this.renderer.listen(this.document, 'mousemove', this.onMouseMove.bind(this)));
            this.dragUnsubscribers.push(this.renderer.listen(this.document, 'mouseup', this.onMouseUp.bind(this)));
            this.cropper.onMouseDown(event);
            // if (!this.cropper.isImageSet() && !this.settings.noFileInput) {
            //   // load img
            //   this.fileInput.nativeElement.click();
            // }
        };
        ImageCropperComponent.prototype.removeDragListeners = function () {
            this.dragUnsubscribers.forEach(function (unsubscribe) { return unsubscribe(); });
        };
        ImageCropperComponent.prototype.onMouseUp = function (event) {
            this.removeDragListeners();
            if (this.cropper.isImageSet()) {
                this.cropper.onMouseUp(event);
                this.image.image = this.cropper.getCroppedImageHelper().src;
                this.onCrop.emit(this.cropper.getCropBounds());
                this.updateCropBounds();
            }
        };
        ImageCropperComponent.prototype.onMouseMove = function (event) {
            this.cropper.onMouseMove(event);
        };
        ImageCropperComponent.prototype.fileChangeListener = function ($event) {
            var _this = this;
            if ($event.target.files.length === 0) {
                return;
            }
            var file = $event.target.files[0];
            if (this.settings.allowedFilesRegex.test(file.name)) {
                var image_1 = new Image();
                var fileReader = new FileReader();
                fileReader.addEventListener('loadend', function (loadEvent) {
                    image_1.addEventListener('load', function () {
                        _this.setImage(image_1);
                    });
                    image_1.src = loadEvent.target.result;
                });
                fileReader.readAsDataURL(file);
            }
        };
        ImageCropperComponent.prototype.resize = function () {
            var canvas = this.cropcanvas.nativeElement;
            this.settings.canvasWidth = canvas.offsetWidth;
            this.settings.canvasHeight = canvas.offsetHeight;
            this.cropper.resizeCanvas(canvas.offsetWidth, canvas.offsetHeight, true);
        };
        ImageCropperComponent.prototype.reset = function () {
            this.cropper.reset();
            this.renderer.setAttribute(this.cropcanvas.nativeElement, 'class', this.settings.cropperClass);
            this.image.image = this.cropper.getCroppedImageHelper().src;
        };
        ImageCropperComponent.prototype.setImage = function (image, newBounds) {
            var _this = this;
            if (newBounds === void 0) { newBounds = null; }
            this.imageSet.emit(true);
            this.renderer.setAttribute(this.cropcanvas.nativeElement, 'class', this.settings.cropperClass + " " + this.settings.croppingClass);
            this.raf = window.requestAnimationFrame(function () {
                if (_this.raf) {
                    window.cancelAnimationFrame(_this.raf);
                }
                if (image.naturalHeight > 0 && image.naturalWidth > 0) {
                    image.height = image.naturalHeight;
                    image.width = image.naturalWidth;
                    window.cancelAnimationFrame(_this.raf);
                    _this.getOrientedImage(image, function (img) {
                        if (_this.settings.dynamicSizing) {
                            var canvas = _this.cropcanvas.nativeElement;
                            _this.settings.canvasWidth = canvas.offsetWidth;
                            _this.settings.canvasHeight = canvas.offsetHeight;
                            _this.cropper.resizeCanvas(canvas.offsetWidth, canvas.offsetHeight, false);
                        }
                        _this.cropper.setImage(img);
                        if (_this.cropPosition && _this.cropPosition.isInitialized()) {
                            _this.cropper.updateCropPosition(_this.cropPosition.toBounds());
                        }
                        _this.image.original = img;
                        var bounds = _this.cropper.getCropBounds();
                        _this.image.image = _this.cropper.getCroppedImageHelper().src;
                        if (!_this.image) {
                            _this.image = image;
                        }
                        if (newBounds != null) {
                            bounds = newBounds;
                            _this.cropper.setBounds(bounds);
                            _this.cropper.updateCropPosition(bounds);
                        }
                        _this.onCrop.emit(bounds);
                    });
                }
            });
        };
        ImageCropperComponent.prototype.isCropPositionChanged = function (changes) {
            if (this.cropper &&
                changes.cropPosition &&
                this.isCropPositionUpdateNeeded) {
                return true;
            }
            else {
                this.isCropPositionUpdateNeeded = true;
                return false;
            }
        };
        ImageCropperComponent.prototype.updateCropBounds = function () {
            var cropBound = this.cropper.getCropBounds();
            this.cropPositionChange.emit(new CropPosition(cropBound.left, cropBound.top, cropBound.width, cropBound.height));
            this.isCropPositionUpdateNeeded = false;
        };
        ImageCropperComponent.prototype.getOrientedImage = function (image, callback) {
            var _this = this;
            var img;
            this.exif.getData(image, function () {
                var orientation = _this.exif.getTag(image, 'Orientation');
                if ([3, 6, 8].indexOf(orientation) > -1) {
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');
                    var cw = image.width;
                    var ch = image.height;
                    var cx = 0;
                    var cy = 0;
                    var deg = 0;
                    switch (orientation) {
                        case 3:
                            cx = -image.width;
                            cy = -image.height;
                            deg = 180;
                            break;
                        case 6:
                            cw = image.height;
                            ch = image.width;
                            cy = -image.height;
                            deg = 90;
                            break;
                        case 8:
                            cw = image.height;
                            ch = image.width;
                            cx = -image.width;
                            deg = 270;
                            break;
                        default:
                            break;
                    }
                    canvas.width = cw;
                    canvas.height = ch;
                    ctx.rotate((deg * Math.PI) / 180);
                    ctx.drawImage(image, cx, cy);
                    img = document.createElement('img');
                    img.width = cw;
                    img.height = ch;
                    img.addEventListener('load', function () {
                        callback(img);
                    });
                    img.src = canvas.toDataURL('image/png');
                }
                else {
                    img = image;
                    callback(img);
                }
            });
        };
        return ImageCropperComponent;
    }());
    ImageCropperComponent.decorators = [
        { type: i0.Component, args: [{
                    // tslint:disable-next-line:component-selector
                    selector: 'img-cropper',
                    template: "<span class=\"ng2-imgcrop\">\r\n  <input\r\n    *ngIf=\"!settings.noFileInput\"\r\n    #fileInput\r\n    type=\"file\"\r\n    accept=\"image/*\"\r\n    (change)=\"fileChangeListener($event)\"\r\n  />\r\n  <canvas\r\n    #cropcanvas\r\n    (mousedown)=\"onMouseDown($event)\"\r\n    (touchmove)=\"onTouchMove($event)\"\r\n    (touchend)=\"onTouchEnd($event)\"\r\n    (touchstart)=\"onTouchStart($event)\"\r\n  >\r\n  </canvas>\r\n</span>\r\n"
                },] }
    ];
    ImageCropperComponent.ctorParameters = function () { return [
        { type: i0.Renderer2 },
        { type: undefined, decorators: [{ type: i0.Inject, args: [common.DOCUMENT,] }] }
    ]; };
    ImageCropperComponent.propDecorators = {
        cropcanvas: [{ type: i0.ViewChild, args: ['cropcanvas', { static: true },] }],
        fileInput: [{ type: i0.ViewChild, args: ['fileInput',] }],
        settings: [{ type: i0.Input }],
        image: [{ type: i0.Input }],
        inputImage: [{ type: i0.Input }],
        cropper: [{ type: i0.Input }],
        cropPosition: [{ type: i0.Input }],
        cropPositionChange: [{ type: i0.Output }],
        onCrop: [{ type: i0.Output }],
        imageSet: [{ type: i0.Output }]
    };

    var ImageCropperModule = /** @class */ (function () {
        function ImageCropperModule() {
        }
        return ImageCropperModule;
    }());
    ImageCropperModule.decorators = [
        { type: i0.NgModule, args: [{
                    declarations: [ImageCropperComponent],
                    exports: [ImageCropperComponent],
                    imports: [common.CommonModule]
                },] }
    ];

    var ImageCropperService = /** @class */ (function () {
        function ImageCropperService() {
        }
        return ImageCropperService;
    }());
    ImageCropperService.ɵprov = i0.ɵɵdefineInjectable({ factory: function ImageCropperService_Factory() { return new ImageCropperService(); }, token: ImageCropperService, providedIn: "root" });
    ImageCropperService.decorators = [
        { type: i0.Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    ImageCropperService.ctorParameters = function () { return []; };

    // looks like this CropService is never used
    var CropService = /** @class */ (function () {
        function CropService() {
        }
        CropService.prototype.init = function (canvas) {
            this.canvas = canvas;
            this.ctx = this.canvas.getContext('2d');
        };
        return CropService;
    }());

    /*
     * Public API Surface of ngx-img-cropper
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.Bounds = Bounds;
    exports.CornerMarker = CornerMarker;
    exports.CropPosition = CropPosition;
    exports.CropService = CropService;
    exports.CropTouch = CropTouch;
    exports.CropperDrawSettings = CropperDrawSettings;
    exports.CropperSettings = CropperSettings;
    exports.DragMarker = DragMarker;
    exports.Exif = Exif;
    exports.Fraction = Fraction;
    exports.Handle = Handle;
    exports.ImageCropper = ImageCropper;
    exports.ImageCropperComponent = ImageCropperComponent;
    exports.ImageCropperDataShare = ImageCropperDataShare;
    exports.ImageCropperModel = ImageCropperModel;
    exports.ImageCropperModule = ImageCropperModule;
    exports.ImageCropperService = ImageCropperService;
    exports.Point = Point;
    exports.PointPool = PointPool;
    exports.ɵa = ImageCropperModel;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-img-cropper.umd.js.map
