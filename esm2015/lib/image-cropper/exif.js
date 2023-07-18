export class Fraction extends Number {
}
export class Exif {
    constructor() {
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
    addEvent(element, event, handler) {
        if (element.addEventListener) {
            element.addEventListener(event, handler, false);
        }
        else {
            // Hello, IE!
            if (element.attachEvent) {
                element.attachEvent('on' + event, handler);
            }
        }
    }
    imageHasData(img) {
        return !!img.exifdata;
    }
    base64ToArrayBuffer(base64) {
        base64 = base64.replace(/^data:([^;]+);base64,/gim, '');
        const binary = atob(base64);
        const len = binary.length;
        const buffer = new ArrayBuffer(len);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < len; i++) {
            view[i] = binary.charCodeAt(i);
        }
        return buffer;
    }
    objectURLToBlob(url, callback) {
        const http = new XMLHttpRequest();
        http.open('GET', url, true);
        http.responseType = 'blob';
        http.onload = () => {
            if (http.status === 200 || http.status === 0) {
                callback(http.response);
            }
        };
        http.send();
    }
    getImageData(img, callback) {
        const handleBinaryFile = (binFile) => {
            const data = this.findEXIFinJPEG(binFile);
            const iptcdata = this.findIPTCinJPEG(binFile);
            img.exifdata = data || {};
            img.iptcdata = iptcdata || {};
            if (callback) {
                callback.call(img);
            }
        };
        if ('src' in img && img.src) {
            if (/^data:/i.test(img.src)) {
                // Data URI
                const arrayBuffer = this.base64ToArrayBuffer(img.src);
                handleBinaryFile(arrayBuffer);
            }
            else {
                if (/^blob:/i.test(img.src)) {
                    // Object URL
                    const fileReader = new FileReader();
                    fileReader.onload = (e) => {
                        handleBinaryFile(e.target.result);
                    };
                    this.objectURLToBlob(img.src, (blob) => {
                        fileReader.readAsArrayBuffer(blob);
                    });
                }
                else {
                    const http = new XMLHttpRequest();
                    http.onload = () => {
                        if (http.status === 200 || http.status === 0) {
                            handleBinaryFile(http.response);
                        }
                        else {
                            throw new Error('Could not load image');
                        }
                    };
                    http.open('GET', img.src, true);
                    http.responseType = 'arraybuffer';
                    http.send(null);
                }
            }
        }
        else {
            if (FileReader && (img instanceof Blob || img instanceof File)) {
                const fileReader = new FileReader();
                fileReader.onload = (e) => {
                    this.log('Got file of length ' + e.target.result.byteLength);
                    handleBinaryFile(e.target.result);
                };
                fileReader.readAsArrayBuffer(img);
            }
        }
    }
    findEXIFinJPEG(file) {
        const dataView = new DataView(file);
        this.log('Got file of length ' + file.byteLength);
        if (dataView.getUint8(0) !== 0xff || dataView.getUint8(1) !== 0xd8) {
            this.log('Not a valid JPEG');
            return false; // not a valid jpeg
        }
        let offset = 2;
        const length = file.byteLength;
        let marker;
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
    }
    findIPTCinJPEG(file) {
        const dataView = new DataView(file);
        this.log('Got file of length ' + file.byteLength);
        if (dataView.getUint8(0) !== 0xff || dataView.getUint8(1) !== 0xd8) {
            this.log('Not a valid JPEG');
            return false; // not a valid jpeg
        }
        let offset = 2;
        const length = file.byteLength;
        // tslint:disable-next-line:variable-name
        const isFieldSegmentStart = (_dataView, _offset) => {
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
                let nameHeaderLength = dataView.getUint8(offset + 7);
                if (nameHeaderLength % 2 !== 0) {
                    nameHeaderLength += 1;
                }
                // Check for pre photoshop 6 format
                if (nameHeaderLength === 0) {
                    // Always 4
                    nameHeaderLength = 4;
                }
                const startOffset = offset + 8 + nameHeaderLength;
                const sectionLength = dataView.getUint16(offset + 6 + nameHeaderLength);
                return this.readIPTCData(file, startOffset, sectionLength);
            }
            // Not the marker, continue searching
            offset++;
        }
    }
    readIPTCData(file, startOffset, sectionLength) {
        const dataView = new DataView(file);
        const data = {};
        let fieldValue;
        let fieldName;
        let dataSize;
        let segmentType;
        let segmentSize;
        let segmentStartPos = startOffset;
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
    }
    readTags(file, tiffStart, dirStart, strings, bigEnd) {
        const entries = file.getUint16(dirStart, !bigEnd);
        const tags = {};
        let entryOffset;
        let tag;
        for (let i = 0; i < entries; i++) {
            entryOffset = dirStart + i * 12 + 2;
            tag = strings[file.getUint16(entryOffset, !bigEnd)];
            if (!tag) {
                this.log('Unknown tag: ' + file.getUint16(entryOffset, !bigEnd));
            }
            tags[tag] = this.readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd);
        }
        return tags;
    }
    readTagValue(file, entryOffset, tiffStart, dirStart, bigEnd) {
        const type = file.getUint16(entryOffset + 2, !bigEnd);
        const numValues = file.getUint32(entryOffset + 4, !bigEnd);
        const valueOffset = file.getUint32(entryOffset + 8, !bigEnd) + tiffStart;
        let offset;
        let vals;
        let val;
        let n;
        let numerator;
        let denominator;
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
    }
    getStringFromDB(buffer, start, length) {
        let outstr = '';
        for (let n = start; n < start + length; n++) {
            outstr += String.fromCharCode(buffer.getUint8(n));
        }
        return outstr;
    }
    readEXIFData(file, start) {
        if (this.getStringFromDB(file, start, 4) !== 'Exif') {
            this.log('Not valid EXIF data! ' + this.getStringFromDB(file, start, 4));
            return false;
        }
        let bigEnd;
        let tags;
        let tag;
        let exifData;
        let gpsData;
        const tiffOffset = start + 6;
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
        const firstIFDOffset = file.getUint32(tiffOffset + 4, !bigEnd);
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
                            const compopents = 'Components';
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
    }
    //   get rid of this silly issue
    checkImageType(img) {
        return img instanceof Image || img instanceof HTMLImageElement;
    }
    getData(img, callback) {
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
    }
    getTag(img, tag) {
        if (!this.imageHasData(img)) {
            return;
        }
        return img.exifdata[tag];
    }
    getAllTags(img) {
        if (!this.imageHasData(img)) {
            return {};
        }
        let a;
        const data = img.exifdata;
        const tags = {};
        for (a in data) {
            if (data.hasOwnProperty(a)) {
                tags[a] = data[a];
            }
        }
        return tags;
    }
    pretty(img) {
        if (!this.imageHasData(img)) {
            return '';
        }
        let a;
        const data = img.exifdata;
        let strPretty = '';
        for (a in data) {
            if (data.hasOwnProperty(a)) {
                if (typeof data[a] === 'object') {
                    if (data[a] instanceof Number) {
                        strPretty += `${a} : ${data[a]} [${data[a].numerator}/${data[a].denominator}]\r\n`;
                    }
                    else {
                        strPretty += `${a} : [${data[a].length} values]\r\n`;
                    }
                }
                else {
                    strPretty += `${a} : ${data[a]}\r\n`;
                }
            }
        }
        return strPretty;
    }
    readFromBinaryFile(file) {
        return this.findEXIFinJPEG(file);
    }
    log(...args) {
        if (this.debug) {
            console.log(args);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhpZi5qcyIsInNvdXJjZVJvb3QiOiJDOi93b3Jrc3BhY2Uvbmd4LWltZy1jcm9wcGVyL3Byb2plY3RzL25neC1pbWctY3JvcHBlci9zcmMvIiwic291cmNlcyI6WyJsaWIvaW1hZ2UtY3JvcHBlci9leGlmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sT0FBTyxRQUFTLFNBQVEsTUFBTTtDQUduQztBQU9ELE1BQU0sT0FBTyxJQUFJO0lBQWpCO1FBQ1MsVUFBSyxHQUFHLEtBQUssQ0FBQztRQUVkLGlCQUFZLEdBQVE7WUFDekIsSUFBSSxFQUFFLFNBQVM7WUFDZixJQUFJLEVBQUUsUUFBUTtZQUNkLElBQUksRUFBRSxVQUFVO1lBQ2hCLElBQUksRUFBRSxhQUFhO1lBQ25CLElBQUksRUFBRSxRQUFRO1lBQ2QsSUFBSSxFQUFFLGFBQWE7WUFDbkIsSUFBSSxFQUFFLGVBQWU7WUFDckIsSUFBSSxFQUFFLFVBQVU7WUFDaEIsSUFBSSxFQUFFLFdBQVc7WUFDakIsSUFBSSxFQUFFLFVBQVU7U0FDakIsQ0FBQztRQUVLLFNBQUksR0FBUTtZQUNqQixlQUFlO1lBQ2YsTUFBTSxFQUFFLGFBQWE7WUFDckIsTUFBTSxFQUFFLGlCQUFpQjtZQUV6QixrQkFBa0I7WUFDbEIsTUFBTSxFQUFFLFlBQVk7WUFFcEIsc0JBQXNCO1lBQ3RCLE1BQU0sRUFBRSxpQkFBaUI7WUFDekIsTUFBTSxFQUFFLGlCQUFpQjtZQUN6QixNQUFNLEVBQUUseUJBQXlCO1lBQ2pDLE1BQU0sRUFBRSx3QkFBd0I7WUFFaEMsbUJBQW1CO1lBQ25CLE1BQU0sRUFBRSxXQUFXO1lBQ25CLE1BQU0sRUFBRSxhQUFhO1lBRXJCLGVBQWU7WUFDZixNQUFNLEVBQUUsa0JBQWtCO1lBRTFCLGdCQUFnQjtZQUNoQixNQUFNLEVBQUUsa0JBQWtCO1lBQzFCLE1BQU0sRUFBRSxtQkFBbUI7WUFDM0IsTUFBTSxFQUFFLFlBQVk7WUFDcEIsTUFBTSxFQUFFLG9CQUFvQjtZQUM1QixNQUFNLEVB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YmVyIHtcclxuICBudW1lcmF0b3I6IG51bWJlcjtcclxuICBkZW5vbWluYXRvcjogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElJbWFnZUV4dGVuZGVkIGV4dGVuZHMgSFRNTEltYWdlRWxlbWVudCB7XHJcbiAgZXhpZmRhdGE6IGFueTtcclxuICBpcHRjZGF0YTogYW55O1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgRXhpZiB7XHJcbiAgcHVibGljIGRlYnVnID0gZmFsc2U7XHJcblxyXG4gIHB1YmxpYyBJcHRjRmllbGRNYXA6IGFueSA9IHtcclxuICAgIDB4Nzg6ICdjYXB0aW9uJyxcclxuICAgIDB4NmU6ICdjcmVkaXQnLFxyXG4gICAgMHgxOTogJ2tleXdvcmRzJyxcclxuICAgIDB4Mzc6ICdkYXRlQ3JlYXRlZCcsXHJcbiAgICAweDUwOiAnYnlsaW5lJyxcclxuICAgIDB4NTU6ICdieWxpbmVUaXRsZScsXHJcbiAgICAweDdhOiAnY2FwdGlvbldyaXRlcicsXHJcbiAgICAweDY5OiAnaGVhZGxpbmUnLFxyXG4gICAgMHg3NDogJ2NvcHlyaWdodCcsXHJcbiAgICAweDBmOiAnY2F0ZWdvcnknXHJcbiAgfTtcclxuXHJcbiAgcHVibGljIFRhZ3M6IGFueSA9IHtcclxuICAgIC8vIHZlcnNpb24gdGFnc1xyXG4gICAgMHg5MDAwOiAnRXhpZlZlcnNpb24nLCAvLyBFWElGIHZlcnNpb25cclxuICAgIDB4YTAwMDogJ0ZsYXNocGl4VmVyc2lvbicsIC8vIEZsYXNocGl4IGZvcm1hdCB2ZXJzaW9uXHJcblxyXG4gICAgLy8gY29sb3JzcGFjZSB0YWdzXHJcbiAgICAweGEwMDE6ICdDb2xvclNwYWNlJywgLy8gQ29sb3Igc3BhY2UgaW5mb3JtYXRpb24gdGFnXHJcblxyXG4gICAgLy8gaW1hZ2UgY29uZmlndXJhdGlvblxyXG4gICAgMHhhMDAyOiAnUGl4ZWxYRGltZW5zaW9uJywgLy8gVmFsaWQgd2lkdGggb2YgbWVhbmluZ2Z1bCBpbWFnZVxyXG4gICAgMHhhMDAzOiAnUGl4ZWxZRGltZW5zaW9uJywgLy8gVmFsaWQgaGVpZ2h0IG9mIG1lYW5pbmdmdWwgaW1hZ2VcclxuICAgIDB4OTEwMTogJ0NvbXBvbmVudHNDb25maWd1cmF0aW9uJywgLy8gSW5mb3JtYXRpb24gYWJvdXQgY2hhbm5lbHNcclxuICAgIDB4OTEwMjogJ0NvbXByZXNzZWRCaXRzUGVyUGl4ZWwnLCAvLyBDb21wcmVzc2VkIGJpdHMgcGVyIHBpeGVsXHJcblxyXG4gICAgLy8gdXNlciBpbmZvcm1hdGlvblxyXG4gICAgMHg5MjdjOiAnTWFrZXJOb3RlJywgLy8gQW55IGRlc2lyZWQgaW5mb3JtYXRpb24gd3JpdHRlbiBieSB0aGUgbWFudWZhY3R1cmVyXHJcbiAgICAweDkyODY6ICdVc2VyQ29tbWVudCcsIC8vIENvbW1lbnRzIGJ5IHVzZXJcclxuXHJcbiAgICAvLyByZWxhdGVkIGZpbGVcclxuICAgIDB4YTAwNDogJ1JlbGF0ZWRTb3VuZEZpbGUnLCAvLyBOYW1lIG9mIHJlbGF0ZWQgc291bmQgZmlsZVxyXG5cclxuICAgIC8vIGRhdGUgYW5kIHRpbWVcclxuICAgIDB4OTAwMzogJ0RhdGVUaW1lT3JpZ2luYWwnLCAvLyBEYXRlIGFuZCB0aW1lIHdoZW4gdGhlIG9yaWdpbmFsIGltYWdlIHdhcyBnZW5lcmF0ZWRcclxuICAgIDB4OTAwNDogJ0RhdGVUaW1lRGlnaXRpemVkJywgLy8gRGF0ZSBhbmQgdGltZSB3aGVuIHRoZSBpbWFnZSB3YXMgc3RvcmVkIGRpZ2l0YWxseVxyXG4gICAgMHg5MjkwOiAnU3Vic2VjVGltZScsIC8vIEZyYWN0aW9ucyBvZiBzZWNvbmRzIGZvciBEYXRlVGltZVxyXG4gICAgMHg5MjkxOiAnU3Vic2VjVGltZU9yaWdpbmFsJywgLy8gRnJhY3Rpb25zIG9mIHNlY29uZHMgZm9yIERhdGVUaW1lT3JpZ2luYWxcclxuICAgIDB4OTI5MjogJ1N1YnNlY1RpbWVEaWdpdGl6ZWQnLCAvLyBGcmFjdGlvbnMgb2Ygc2Vjb25kcyBmb3IgRGF0ZVRpbWVEaWdpdGl6ZWRcclxuXHJcbiAgICAvLyBwaWN0dXJlLXRha2luZyBjb25kaXRpb25zXHJcbiAgICAweDgyOWE6ICdFeHBvc3VyZVRpbWUnLCAvLyBFeHBvc3VyZSB0aW1lIChpbiBzZWNvbmRzKVxyXG4gICAgMHg4MjlkOiAnRk51bWJlcicsIC8vIEYgbnVtYmVyXHJcbiAgICAweDg4MjI6ICdFeHBvc3VyZVByb2dyYW0nLCAvLyBFeHBvc3VyZSBwcm9ncmFtXHJcbiAgICAweDg4MjQ6ICdTcGVjdHJhbFNlbnNpdGl2aXR5JywgLy8gU3BlY3RyYWwgc2Vuc2l0aXZpdHlcclxuICAgIDB4ODgyNzogJ0lTT1NwZWVkUmF0aW5ncycsIC8vIElTTyBzcGVlZCByYXRpbmdcclxuICAgIDB4ODgyODogJ09FQ0YnLCAvLyBPcHRvZWxlY3RyaWMgY29udmVyc2lvbiBmYWN0b3JcclxuICAgIDB4OTIwMTogJ1NodXR0ZXJTcGVlZFZhbHVlJywgLy8gU2h1dHRlciBzcGVlZFxyXG4gICAgMHg5MjAyOiAnQXBlcnR1cmVWYWx1ZScsIC8vIExlbnMgYXBlcnR1cmVcclxuICAgIDB4OTIwMzogJ0JyaWdodG5lc3NWYWx1ZScsIC8vIFZhbHVlIG9mIGJyaWdodG5lc3NcclxuICAgIDB4OTIwNDogJ0V4cG9zdXJlQmlhcycsIC8vIEV4cG9zdXJlIGJpYXNcclxuICAgIDB4OTIwNTogJ01heEFwZXJ0dXJlVmFsdWUnLCAvLyBTbWFsbGVzdCBGIG51bWJlciBvZiBsZW5zXHJcbiAgICAweDkyMDY6ICdTdWJqZWN0RGlzdGFuY2UnLCAvLyBEaXN0YW5jZSB0byBzdWJqZWN0IGluIG1ldGVyc1xyXG4gICAgMHg5MjA3OiAnTWV0ZXJpbmdNb2RlJywgLy8gTWV0ZXJpbmcgbW9kZVxyXG4gICAgMHg5MjA4OiAnTGlnaHRTb3VyY2UnLCAvLyBLaW5kIG9mIGxpZ2h0IHNvdXJjZVxyXG4gICAgMHg5MjA5OiAnRmxhc2gnLCAvLyBGbGFzaCBzdGF0dXNcclxuICAgIDB4OTIxNDogJ1N1YmplY3RBcmVhJywgLy8gTG9jYXRpb24gYW5kIGFyZWEgb2YgbWFpbiBzdWJqZWN0XHJcbiAgICAweDkyMGE6ICdGb2NhbExlbmd0aCcsIC8vIEZvY2FsIGxlbmd0aCBvZiB0aGUgbGVucyBpbiBtbVxyXG4gICAgMHhhMjBiOiAnRmxhc2hFbmVyZ3knLCAvLyBTdHJvYmUgZW5lcmd5IGluIEJDUFNcclxuICAgIDB4YTIwYzogJ1NwYXRpYWxGcmVxdWVuY3lSZXNwb25zZScsIC8vXHJcbiAgICAweGEyMGU6ICdGb2NhbFBsYW5lWFJlc29sdXRpb24nLCAvLyBOdW1iZXIgb2YgcGl4ZWxzIGluIHdpZHRoIGRpcmVjdGlvbiBwZXIgRm9jYWxQbGFuZVJlc29sdXRpb25Vbml0XHJcbiAgICAweGEyMGY6ICdGb2NhbFBsYW5lWVJlc29sdXRpb24nLCAvLyBOdW1iZXIgb2YgcGl4ZWxzIGluIGhlaWdodCBkaXJlY3Rpb24gcGVyIEZvY2FsUGxhbmVSZXNvbHV0aW9uVW5pdFxyXG4gICAgMHhhMjEwOiAnRm9jYWxQbGFuZVJlc29sdXRpb25Vbml0JywgLy8gVW5pdCBmb3IgbWVhc3VyaW5nIEZvY2FsUGxhbmVYUmVzb2x1dGlvbiBhbmQgRm9jYWxQbGFuZVlSZXNvbHV0aW9uXHJcbiAgICAweGEyMTQ6ICdTdWJqZWN0TG9jYXRpb24nLCAvLyBMb2NhdGlvbiBvZiBzdWJqZWN0IGluIGltYWdlXHJcbiAgICAweGEyMTU6ICdFeHBvc3VyZUluZGV4JywgLy8gRXhwb3N1cmUgaW5kZXggc2VsZWN0ZWQgb24gY2FtZXJhXHJcbiAgICAweGEyMTc6ICdTZW5zaW5nTWV0aG9kJywgLy8gSW1hZ2Ugc2Vuc29yIHR5cGVcclxuICAgIDB4YTMwMDogJ0ZpbGVTb3VyY2UnLCAvLyBJbWFnZSBzb3VyY2UgKDMgPT0gRFNDKVxyXG4gICAgMHhhMzAxOiAnU2NlbmVUeXBlJywgLy8gU2NlbmUgdHlwZSAoMSA9PSBkaXJlY3RseSBwaG90b2dyYXBoZWQpXHJcbiAgICAweGEzMDI6ICdDRkFQYXR0ZXJuJywgLy8gQ29sb3IgZmlsdGVyIGFycmF5IGdlb21ldHJpYyBwYXR0ZXJuXHJcbiAgICAweGE0MDE6ICdDdXN0b21SZW5kZXJlZCcsIC8vIFNwZWNpYWwgcHJvY2Vzc2luZ1xyXG4gICAgMHhhNDAyOiAnRXhwb3N1cmVNb2RlJywgLy8gRXhwb3N1cmUgbW9kZVxyXG4gICAgMHhhNDAzOiAnV2hpdGVCYWxhbmNlJywgLy8gMSA9IGF1dG8gd2hpdGUgYmFsYW5jZSwgMiA9IG1hbnVhbFxyXG4gICAgMHhhNDA0OiAnRGlnaXRhbFpvb21SYXRpb24nLCAvLyBEaWdpdGFsIHpvb20gcmF0aW9cclxuICAgIDB4YTQwNTogJ0ZvY2FsTGVuZ3RoSW4zNW1tRmlsbScsIC8vIEVxdWl2YWxlbnQgZm9hY2wgbGVuZ3RoIGFzc3VtaW5nIDM1bW0gZmlsbSBjYW1lcmEgKGluIG1tKVxyXG4gICAgMHhhNDA2OiAnU2NlbmVDYXB0dXJlVHlwZScsIC8vIFR5cGUgb2Ygc2NlbmVcclxuICAgIDB4YTQwNzogJ0dhaW5Db250cm9sJywgLy8gRGVncmVlIG9mIG92ZXJhbGwgaW1hZ2UgZ2FpbiBhZGp1c3RtZW50XHJcbiAgICAweGE0MDg6ICdDb250cmFzdCcsIC8vIERpcmVjdGlvbiBvZiBjb250cmFzdCBwcm9jZXNzaW5nIGFwcGxpZWQgYnkgY2FtZXJhXHJcbiAgICAweGE0MDk6ICdTYXR1cmF0aW9uJywgLy8gRGlyZWN0aW9uIG9mIHNhdHVyYXRpb24gcHJvY2Vzc2luZyBhcHBsaWVkIGJ5IGNhbWVyYVxyXG4gICAgMHhhNDBhOiAnU2hhcnBuZXNzJywgLy8gRGlyZWN0aW9uIG9mIHNoYXJwbmVzcyBwcm9jZXNzaW5nIGFwcGxpZWQgYnkgY2FtZXJhXHJcbiAgICAweGE0MGI6ICdEZXZpY2VTZXR0aW5nRGVzY3JpcHRpb24nLCAvL1xyXG4gICAgMHhhNDBjOiAnU3ViamVjdERpc3RhbmNlUmFuZ2UnLCAvLyBEaXN0YW5jZSB0byBzdWJqZWN0XHJcblxyXG4gICAgLy8gb3RoZXIgdGFnc1xyXG4gICAgMHhhMDA1OiAnSW50ZXJvcGVyYWJpbGl0eUlGRFBvaW50ZXInLFxyXG4gICAgMHhhNDIwOiAnSW1hZ2VVbmlxdWVJRCcgLy8gSWRlbnRpZmllciBhc3NpZ25lZCB1bmlxdWVseSB0byBlYWNoIGltYWdlXHJcbiAgfTtcclxuXHJcbiAgcHVibGljIFRpZmZUYWdzOiBhbnkgPSB7XHJcbiAgICAweDAxMDA6ICdJbWFnZVdpZHRoJyxcclxuICAgIDB4MDEwMTogJ0ltYWdlSGVpZ2h0JyxcclxuICAgIDB4ODc2OTogJ0V4aWZJRkRQb2ludGVyJyxcclxuICAgIDB4ODgyNTogJ0dQU0luZm9JRkRQb2ludGVyJyxcclxuICAgIDB4YTAwNTogJ0ludGVyb3BlcmFiaWxpdHlJRkRQb2ludGVyJyxcclxuICAgIDB4MDEwMjogJ0JpdHNQZXJTYW1wbGUnLFxyXG4gICAgMHgwMTAzOiAnQ29tcHJlc3Npb24nLFxyXG4gICAgMHgwMTA2OiAnUGhvdG9tZXRyaWNJbnRlcnByZXRhdGlvbicsXHJcbiAgICAweDAxMTI6ICdPcmllbnRhdGlvbicsXHJcbiAgICAweDAxMTU6ICdTYW1wbGVzUGVyUGl4ZWwnLFxyXG4gICAgMHgwMTFjOiAnUGxhbmFyQ29uZmlndXJhdGlvbicsXHJcbiAgICAweDAyMTI6ICdZQ2JDclN1YlNhbXBsaW5nJyxcclxuICAgIDB4MDIxMzogJ1lDYkNyUG9zaXRpb25pbmcnLFxyXG4gICAgMHgwMTFhOiAnWFJlc29sdXRpb24nLFxyXG4gICAgMHgwMTFiOiAnWVJlc29sdXRpb24nLFxyXG4gICAgMHgwMTI4OiAnUmVzb2x1dGlvblVuaXQnLFxyXG4gICAgMHgwMTExOiAnU3RyaXBPZmZzZXRzJyxcclxuICAgIDB4MDExNjogJ1Jvd3NQZXJTdHJpcCcsXHJcbiAgICAweDAxMTc6ICdTdHJpcEJ5dGVDb3VudHMnLFxyXG4gICAgMHgwMjAxOiAnSlBFR0ludGVyY2hhbmdlRm9ybWF0JyxcclxuICAgIDB4MDIwMjogJ0pQRUdJbnRlcmNoYW5nZUZvcm1hdExlbmd0aCcsXHJcbiAgICAweDAxMmQ6ICdUcmFuc2ZlckZ1bmN0aW9uJyxcclxuICAgIDB4MDEzZTogJ1doaXRlUG9pbnQnLFxyXG4gICAgMHgwMTNmOiAnUHJpbWFyeUNocm9tYXRpY2l0aWVzJyxcclxuICAgIDB4MDIxMTogJ1lDYkNyQ29lZmZpY2llbnRzJyxcclxuICAgIDB4MDIxNDogJ1JlZmVyZW5jZUJsYWNrV2hpdGUnLFxyXG4gICAgMHgwMTMyOiAnRGF0ZVRpbWUnLFxyXG4gICAgMHgwMTBlOiAnSW1hZ2VEZXNjcmlwdGlvbicsXHJcbiAgICAweDAxMGY6ICdNYWtlJyxcclxuICAgIDB4MDExMDogJ01vZGVsJyxcclxuICAgIDB4MDEzMTogJ1NvZnR3YXJlJyxcclxuICAgIDB4MDEzYjogJ0FydGlzdCcsXHJcbiAgICAweDgyOTg6ICdDb3B5cmlnaHQnXHJcbiAgfTtcclxuXHJcbiAgcHVibGljIEdQU1RhZ3M6IGFueSA9IHtcclxuICAgIDB4MDAwMDogJ0dQU1ZlcnNpb25JRCcsXHJcbiAgICAweDAwMDE6ICdHUFNMYXRpdHVkZVJlZicsXHJcbiAgICAweDAwMDI6ICdHUFNMYXRpdHVkZScsXHJcbiAgICAweDAwMDM6ICdHUFNMb25naXR1ZGVSZWYnLFxyXG4gICAgMHgwMDA0OiAnR1BTTG9uZ2l0dWRlJyxcclxuICAgIDB4MDAwNTogJ0dQU0FsdGl0dWRlUmVmJyxcclxuICAgIDB4MDAwNjogJ0dQU0FsdGl0dWRlJyxcclxuICAgIDB4MDAwNzogJ0dQU1RpbWVTdGFtcCcsXHJcbiAgICAweDAwMDg6ICdHUFNTYXRlbGxpdGVzJyxcclxuICAgIDB4MDAwOTogJ0dQU1N0YXR1cycsXHJcbiAgICAweDAwMGE6ICdHUFNNZWFzdXJlTW9kZScsXHJcbiAgICAweDAwMGI6ICdHUFNET1AnLFxyXG4gICAgMHgwMDBjOiAnR1BTU3BlZWRSZWYnLFxyXG4gICAgMHgwMDBkOiAnR1BTU3BlZWQnLFxyXG4gICAgMHgwMDBlOiAnR1BTVHJhY2tSZWYnLFxyXG4gICAgMHgwMDBmOiAnR1BTVHJhY2snLFxyXG4gICAgMHgwMDEwOiAnR1BTSW1nRGlyZWN0aW9uUmVmJyxcclxuICAgIDB4MDAxMTogJ0dQU0ltZ0RpcmVjdGlvbicsXHJcbiAgICAweDAwMTI6ICdHUFNNYXBEYXR1bScsXHJcbiAgICAweDAwMTM6ICdHUFNEZXN0TGF0aXR1ZGVSZWYnLFxyXG4gICAgMHgwMDE0OiAnR1BTRGVzdExhdGl0dWRlJyxcclxuICAgIDB4MDAxNTogJ0dQU0Rlc3RMb25naXR1ZGVSZWYnLFxyXG4gICAgMHgwMDE2OiAnR1BTRGVzdExvbmdpdHVkZScsXHJcbiAgICAweDAwMTc6ICdHUFNEZXN0QmVhcmluZ1JlZicsXHJcbiAgICAweDAwMTg6ICdHUFNEZXN0QmVhcmluZycsXHJcbiAgICAweDAwMTk6ICdHUFNEZXN0RGlzdGFuY2VSZWYnLFxyXG4gICAgMHgwMDFhOiAnR1BTRGVzdERpc3RhbmNlJyxcclxuICAgIDB4MDAxYjogJ0dQU1Byb2Nlc3NpbmdNZXRob2QnLFxyXG4gICAgMHgwMDFjOiAnR1BTQXJlYUluZm9ybWF0aW9uJyxcclxuICAgIDB4MDAxZDogJ0dQU0RhdGVTdGFtcCcsXHJcbiAgICAweDAwMWU6ICdHUFNEaWZmZXJlbnRpYWwnXHJcbiAgfTtcclxuXHJcbiAgcHVibGljIFN0cmluZ1ZhbHVlczogYW55ID0ge1xyXG4gICAgRXhwb3N1cmVQcm9ncmFtOiB7XHJcbiAgICAgIDA6ICdOb3QgZGVmaW5lZCcsXHJcbiAgICAgIDE6ICdNYW51YWwnLFxyXG4gICAgICAyOiAnTm9ybWFsIHByb2dyYW0nLFxyXG4gICAgICAzOiAnQXBlcnR1cmUgcHJpb3JpdHknLFxyXG4gICAgICA0OiAnU2h1dHRlciBwcmlvcml0eScsXHJcbiAgICAgIDU6ICdDcmVhdGl2ZSBwcm9ncmFtJyxcclxuICAgICAgNjogJ0FjdGlvbiBwcm9ncmFtJyxcclxuICAgICAgNzogJ1BvcnRyYWl0IG1vZGUnLFxyXG4gICAgICA4OiAnTGFuZHNjYXBlIG1vZGUnXHJcbiAgICB9LFxyXG4gICAgTWV0ZXJpbmdNb2RlOiB7XHJcbiAgICAgIDA6ICdVbmtub3duJyxcclxuICAgICAgMTogJ0F2ZXJhZ2UnLFxyXG4gICAgICAyOiAnQ2VudGVyV2VpZ2h0ZWRBdmVyYWdlJyxcclxuICAgICAgMzogJ1Nwb3QnLFxyXG4gICAgICA0OiAnTXVsdGlTcG90JyxcclxuICAgICAgNTogJ1BhdHRlcm4nLFxyXG4gICAgICA2OiAnUGFydGlhbCcsXHJcbiAgICAgIDI1NTogJ090aGVyJ1xyXG4gICAgfSxcclxuICAgIExpZ2h0U291cmNlOiB7XHJcbiAgICAgIDA6ICdVbmtub3duJyxcclxuICAgICAgMTogJ0RheWxpZ2h0JyxcclxuICAgICAgMjogJ0ZsdW9yZXNjZW50JyxcclxuICAgICAgMzogJ1R1bmdzdGVuIChpbmNhbmRlc2NlbnQgbGlnaHQpJyxcclxuICAgICAgNDogJ0ZsYXNoJyxcclxuICAgICAgOTogJ0ZpbmUgd2VhdGhlcicsXHJcbiAgICAgIDEwOiAnQ2xvdWR5IHdlYXRoZXInLFxyXG4gICAgICAxMTogJ1NoYWRlJyxcclxuICAgICAgMTI6ICdEYXlsaWdodCBmbHVvcmVzY2VudCAoRCA1NzAwIC0gNzEwMEspJyxcclxuICAgICAgMTM6ICdEYXkgd2hpdGUgZmx1b3Jlc2NlbnQgKE4gNDYwMCAtIDU0MDBLKScsXHJcbiAgICAgIDE0OiAnQ29vbCB3aGl0ZSBmbHVvcmVzY2VudCAoVyAzOTAwIC0gNDUwMEspJyxcclxuICAgICAgMTU6ICdXaGl0ZSBmbHVvcmVzY2VudCAoV1cgMzIwMCAtIDM3MDBLKScsXHJcbiAgICAgIDE3OiAnU3RhbmRhcmQgbGlnaHQgQScsXHJcbiAgICAgIDE4OiAnU3RhbmRhcmQgbGlnaHQgQicsXHJcbiAgICAgIDE5OiAnU3RhbmRhcmQgbGlnaHQgQycsXHJcbiAgICAgIDIwOiAnRDU1JyxcclxuICAgICAgMjE6ICdENjUnLFxyXG4gICAgICAyMjogJ0Q3NScsXHJcbiAgICAgIDIzOiAnRDUwJyxcclxuICAgICAgMjQ6ICdJU08gc3R1ZGlvIHR1bmdzdGVuJyxcclxuICAgICAgMjU1OiAnT3RoZXInXHJcbiAgICB9LFxyXG4gICAgRmxhc2g6IHtcclxuICAgICAgMHgwMDAwOiAnRmxhc2ggZGlkIG5vdCBmaXJlJyxcclxuICAgICAgMHgwMDAxOiAnRmxhc2ggZmlyZWQnLFxyXG4gICAgICAweDAwMDU6ICdTdHJvYmUgcmV0dXJuIGxpZ2h0IG5vdCBkZXRlY3RlZCcsXHJcbiAgICAgIDB4MDAwNzogJ1N0cm9iZSByZXR1cm4gbGlnaHQgZGV0ZWN0ZWQnLFxyXG4gICAgICAweDAwMDk6ICdGbGFzaCBmaXJlZCwgY29tcHVsc29yeSBmbGFzaCBtb2RlJyxcclxuICAgICAgMHgwMDBkOiAnRmxhc2ggZmlyZWQsIGNvbXB1bHNvcnkgZmxhc2ggbW9kZSwgcmV0dXJuIGxpZ2h0IG5vdCBkZXRlY3RlZCcsXHJcbiAgICAgIDB4MDAwZjogJ0ZsYXNoIGZpcmVkLCBjb21wdWxzb3J5IGZsYXNoIG1vZGUsIHJldHVybiBsaWdodCBkZXRlY3RlZCcsXHJcbiAgICAgIDB4MDAxMDogJ0ZsYXNoIGRpZCBub3QgZmlyZSwgY29tcHVsc29yeSBmbGFzaCBtb2RlJyxcclxuICAgICAgMHgwMDE4OiAnRmxhc2ggZGlkIG5vdCBmaXJlLCBhdXRvIG1vZGUnLFxyXG4gICAgICAweDAwMTk6ICdGbGFzaCBmaXJlZCwgYXV0byBtb2RlJyxcclxuICAgICAgMHgwMDFkOiAnRmxhc2ggZmlyZWQsIGF1dG8gbW9kZSwgcmV0dXJuIGxpZ2h0IG5vdCBkZXRlY3RlZCcsXHJcbiAgICAgIDB4MDAxZjogJ0ZsYXNoIGZpcmVkLCBhdXRvIG1vZGUsIHJldHVybiBsaWdodCBkZXRlY3RlZCcsXHJcbiAgICAgIDB4MDAyMDogJ05vIGZsYXNoIGZ1bmN0aW9uJyxcclxuICAgICAgMHgwMDQxOiAnRmxhc2ggZmlyZWQsIHJlZC1leWUgcmVkdWN0aW9uIG1vZGUnLFxyXG4gICAgICAweDAwNDU6ICdGbGFzaCBmaXJlZCwgcmVkLWV5ZSByZWR1Y3Rpb24gbW9kZSwgcmV0dXJuIGxpZ2h0IG5vdCBkZXRlY3RlZCcsXHJcbiAgICAgIDB4MDA0NzogJ0ZsYXNoIGZpcmVkLCByZWQtZXllIHJlZHVjdGlvbiBtb2RlLCByZXR1cm4gbGlnaHQgZGV0ZWN0ZWQnLFxyXG4gICAgICAweDAwNDk6ICdGbGFzaCBmaXJlZCwgY29tcHVsc29yeSBmbGFzaCBtb2RlLCByZWQtZXllIHJlZHVjdGlvbiBtb2RlJyxcclxuICAgICAgMHgwMDRkOiAnRmxhc2ggZmlyZWQsIGNvbXB1bHNvcnkgZmxhc2ggbW9kZSwgcmVkLWV5ZSByZWR1Y3Rpb24gbW9kZSwgcmV0dXJuIGxpZ2h0IG5vdCBkZXRlY3RlZCcsXHJcbiAgICAgIDB4MDA0ZjogJ0ZsYXNoIGZpcmVkLCBjb21wdWxzb3J5IGZsYXNoIG1vZGUsIHJlZC1leWUgcmVkdWN0aW9uIG1vZGUsIHJldHVybiBsaWdodCBkZXRlY3RlZCcsXHJcbiAgICAgIDB4MDA1OTogJ0ZsYXNoIGZpcmVkLCBhdXRvIG1vZGUsIHJlZC1leWUgcmVkdWN0aW9uIG1vZGUnLFxyXG4gICAgICAweDAwNWQ6ICdGbGFzaCBmaXJlZCwgYXV0byBtb2RlLCByZXR1cm4gbGlnaHQgbm90IGRldGVjdGVkLCByZWQtZXllIHJlZHVjdGlvbiBtb2RlJyxcclxuICAgICAgMHgwMDVmOiAnRmxhc2ggZmlyZWQsIGF1dG8gbW9kZSwgcmV0dXJuIGxpZ2h0IGRldGVjdGVkLCByZWQtZXllIHJlZHVjdGlvbiBtb2RlJ1xyXG4gICAgfSxcclxuICAgIFNlbnNpbmdNZXRob2Q6IHtcclxuICAgICAgMTogJ05vdCBkZWZpbmVkJyxcclxuICAgICAgMjogJ09uZS1jaGlwIGNvbG9yIGFyZWEgc2Vuc29yJyxcclxuICAgICAgMzogJ1R3by1jaGlwIGNvbG9yIGFyZWEgc2Vuc29yJyxcclxuICAgICAgNDogJ1RocmVlLWNoaXAgY29sb3IgYXJlYSBzZW5zb3InLFxyXG4gICAgICA1OiAnQ29sb3Igc2VxdWVudGlhbCBhcmVhIHNlbnNvcicsXHJcbiAgICAgIDc6ICdUcmlsaW5lYXIgc2Vuc29yJyxcclxuICAgICAgODogJ0NvbG9yIHNlcXVlbnRpYWwgbGluZWFyIHNlbnNvcidcclxuICAgIH0sXHJcbiAgICBTY2VuZUNhcHR1cmVUeXBlOiB7XHJcbiAgICAgIDA6ICdTdGFuZGFyZCcsXHJcbiAgICAgIDE6ICdMYW5kc2NhcGUnLFxyXG4gICAgICAyOiAnUG9ydHJhaXQnLFxyXG4gICAgICAzOiAnTmlnaHQgc2NlbmUnXHJcbiAgICB9LFxyXG4gICAgU2NlbmVUeXBlOiB7XHJcbiAgICAgIDE6ICdEaXJlY3RseSBwaG90b2dyYXBoZWQnXHJcbiAgICB9LFxyXG4gICAgQ3VzdG9tUmVuZGVyZWQ6IHtcclxuICAgICAgMDogJ05vcm1hbCBwcm9jZXNzJyxcclxuICAgICAgMTogJ0N1c3RvbSBwcm9jZXNzJ1xyXG4gICAgfSxcclxuICAgIFdoaXRlQmFsYW5jZToge1xyXG4gICAgICAwOiAnQXV0byB3aGl0ZSBiYWxhbmNlJyxcclxuICAgICAgMTogJ01hbnVhbCB3aGl0ZSBiYWxhbmNlJ1xyXG4gICAgfSxcclxuICAgIEdhaW5Db250cm9sOiB7XHJcbiAgICAgIDA6ICdOb25lJyxcclxuICAgICAgMTogJ0xvdyBnYWluIHVwJyxcclxuICAgICAgMjogJ0hpZ2ggZ2FpbiB1cCcsXHJcbiAgICAgIDM6ICdMb3cgZ2FpbiBkb3duJyxcclxuICAgICAgNDogJ0hpZ2ggZ2FpbiBkb3duJ1xyXG4gICAgfSxcclxuICAgIENvbnRyYXN0OiB7XHJcbiAgICAgIDA6ICdOb3JtYWwnLFxyXG4gICAgICAxOiAnU29mdCcsXHJcbiAgICAgIDI6ICdIYXJkJ1xyXG4gICAgfSxcclxuICAgIFNhdHVyYXRpb246IHtcclxuICAgICAgMDogJ05vcm1hbCcsXHJcbiAgICAgIDE6ICdMb3cgc2F0dXJhdGlvbicsXHJcbiAgICAgIDI6ICdIaWdoIHNhdHVyYXRpb24nXHJcbiAgICB9LFxyXG4gICAgU2hhcnBuZXNzOiB7XHJcbiAgICAgIDA6ICdOb3JtYWwnLFxyXG4gICAgICAxOiAnU29mdCcsXHJcbiAgICAgIDI6ICdIYXJkJ1xyXG4gICAgfSxcclxuICAgIFN1YmplY3REaXN0YW5jZVJhbmdlOiB7XHJcbiAgICAgIDA6ICdVbmtub3duJyxcclxuICAgICAgMTogJ01hY3JvJyxcclxuICAgICAgMjogJ0Nsb3NlIHZpZXcnLFxyXG4gICAgICAzOiAnRGlzdGFudCB2aWV3J1xyXG4gICAgfSxcclxuICAgIEZpbGVTb3VyY2U6IHtcclxuICAgICAgMzogJ0RTQydcclxuICAgIH0sXHJcblxyXG4gICAgQ29tcG9uZW50czoge1xyXG4gICAgICAwOiAnJyxcclxuICAgICAgMTogJ1knLFxyXG4gICAgICAyOiAnQ2InLFxyXG4gICAgICAzOiAnQ3InLFxyXG4gICAgICA0OiAnUicsXHJcbiAgICAgIDU6ICdHJyxcclxuICAgICAgNjogJ0InXHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgcHVibGljIGFkZEV2ZW50KFxyXG4gICAgZWxlbWVudDogRXZlbnRUYXJnZXQgfCBhbnksXHJcbiAgICBldmVudDogc3RyaW5nLFxyXG4gICAgaGFuZGxlcjogRXZlbnRMaXN0ZW5lclxyXG4gICkge1xyXG4gICAgaWYgKGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikge1xyXG4gICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIsIGZhbHNlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIEhlbGxvLCBJRSFcclxuICAgICAgaWYgKGVsZW1lbnQuYXR0YWNoRXZlbnQpIHtcclxuICAgICAgICBlbGVtZW50LmF0dGFjaEV2ZW50KCdvbicgKyBldmVudCwgaGFuZGxlcik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBpbWFnZUhhc0RhdGEoaW1nOiBJSW1hZ2VFeHRlbmRlZCkge1xyXG4gICAgcmV0dXJuICEhaW1nLmV4aWZkYXRhO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGJhc2U2NFRvQXJyYXlCdWZmZXIoYmFzZTY0OiBzdHJpbmcpOiBBcnJheUJ1ZmZlciB7XHJcbiAgICBiYXNlNjQgPSBiYXNlNjQucmVwbGFjZSgvXmRhdGE6KFteO10rKTtiYXNlNjQsL2dpbSwgJycpO1xyXG4gICAgY29uc3QgYmluYXJ5OiBzdHJpbmcgPSBhdG9iKGJhc2U2NCk7XHJcbiAgICBjb25zdCBsZW46IG51bWJlciA9IGJpbmFyeS5sZW5ndGg7XHJcbiAgICBjb25zdCBidWZmZXI6IEFycmF5QnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKGxlbik7XHJcbiAgICBjb25zdCB2aWV3OiBVaW50OEFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYnVmZmVyKTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgdmlld1tpXSA9IGJpbmFyeS5jaGFyQ29kZUF0KGkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGJ1ZmZlcjtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBvYmplY3RVUkxUb0Jsb2IodXJsOiBzdHJpbmcsIGNhbGxiYWNrOiAoYmxvYjogQmxvYikgPT4gdm9pZCkge1xyXG4gICAgY29uc3QgaHR0cDogWE1MSHR0cFJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgIGh0dHAub3BlbignR0VUJywgdXJsLCB0cnVlKTtcclxuICAgIGh0dHAucmVzcG9uc2VUeXBlID0gJ2Jsb2InO1xyXG4gICAgaHR0cC5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgIGlmIChodHRwLnN0YXR1cyA9PT0gMjAwIHx8IGh0dHAuc3RhdHVzID09PSAwKSB7XHJcbiAgICAgICAgY2FsbGJhY2soaHR0cC5yZXNwb25zZSk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICBodHRwLnNlbmQoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXRJbWFnZURhdGEoXHJcbiAgICBpbWc6IElJbWFnZUV4dGVuZGVkIHwgQmxvYiB8IEZpbGUsXHJcbiAgICBjYWxsYmFjazogKGltZzogSUltYWdlRXh0ZW5kZWQpID0+IHZvaWRcclxuICApIHtcclxuICAgIGNvbnN0IGhhbmRsZUJpbmFyeUZpbGUgPSAoYmluRmlsZTogQXJyYXlCdWZmZXIpID0+IHtcclxuICAgICAgY29uc3QgZGF0YSA9IHRoaXMuZmluZEVYSUZpbkpQRUcoYmluRmlsZSk7XHJcbiAgICAgIGNvbnN0IGlwdGNkYXRhID0gdGhpcy5maW5kSVBUQ2luSlBFRyhiaW5GaWxlKTtcclxuICAgICAgKGltZyBhcyBJSW1hZ2VFeHRlbmRlZCkuZXhpZmRhdGEgPSBkYXRhIHx8IHt9O1xyXG4gICAgICAoaW1nIGFzIElJbWFnZUV4dGVuZGVkKS5pcHRjZGF0YSA9IGlwdGNkYXRhIHx8IHt9O1xyXG4gICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICBjYWxsYmFjay5jYWxsKGltZyk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgaWYgKCdzcmMnIGluIGltZyAmJiAoaW1nIGFzIElJbWFnZUV4dGVuZGVkKS5zcmMpIHtcclxuICAgICAgaWYgKC9eZGF0YTovaS50ZXN0KChpbWcgYXMgSUltYWdlRXh0ZW5kZWQpLnNyYykpIHtcclxuICAgICAgICAvLyBEYXRhIFVSSVxyXG4gICAgICAgIGNvbnN0IGFycmF5QnVmZmVyID0gdGhpcy5iYXNlNjRUb0FycmF5QnVmZmVyKFxyXG4gICAgICAgICAgKGltZyBhcyBJSW1hZ2VFeHRlbmRlZCkuc3JjXHJcbiAgICAgICAgKTtcclxuICAgICAgICBoYW5kbGVCaW5hcnlGaWxlKGFycmF5QnVmZmVyKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoL15ibG9iOi9pLnRlc3QoKGltZyBhcyBJSW1hZ2VFeHRlbmRlZCkuc3JjKSkge1xyXG4gICAgICAgICAgLy8gT2JqZWN0IFVSTFxyXG4gICAgICAgICAgY29uc3QgZmlsZVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgICAgICBmaWxlUmVhZGVyLm9ubG9hZCA9IChlOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgaGFuZGxlQmluYXJ5RmlsZShlLnRhcmdldC5yZXN1bHQpO1xyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIHRoaXMub2JqZWN0VVJMVG9CbG9iKChpbWcgYXMgSUltYWdlRXh0ZW5kZWQpLnNyYywgKGJsb2I6IEJsb2IpID0+IHtcclxuICAgICAgICAgICAgZmlsZVJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihibG9iKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjb25zdCBodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICBodHRwLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKGh0dHAuc3RhdHVzID09PSAyMDAgfHwgaHR0cC5zdGF0dXMgPT09IDApIHtcclxuICAgICAgICAgICAgICBoYW5kbGVCaW5hcnlGaWxlKGh0dHAucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IGxvYWQgaW1hZ2UnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIGh0dHAub3BlbignR0VUJywgKGltZyBhcyBJSW1hZ2VFeHRlbmRlZCkuc3JjLCB0cnVlKTtcclxuICAgICAgICAgIGh0dHAucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJztcclxuICAgICAgICAgIGh0dHAuc2VuZChudWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChGaWxlUmVhZGVyICYmIChpbWcgaW5zdGFuY2VvZiBCbG9iIHx8IGltZyBpbnN0YW5jZW9mIEZpbGUpKSB7XHJcbiAgICAgICAgY29uc3QgZmlsZVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgICAgZmlsZVJlYWRlci5vbmxvYWQgPSAoZTogYW55KSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmxvZygnR290IGZpbGUgb2YgbGVuZ3RoICcgKyBlLnRhcmdldC5yZXN1bHQuYnl0ZUxlbmd0aCk7XHJcbiAgICAgICAgICBoYW5kbGVCaW5hcnlGaWxlKGUudGFyZ2V0LnJlc3VsdCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZmlsZVJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihpbWcpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZmluZEVYSUZpbkpQRUcoZmlsZTogQXJyYXlCdWZmZXIpIHtcclxuICAgIGNvbnN0IGRhdGFWaWV3ID0gbmV3IERhdGFWaWV3KGZpbGUpO1xyXG5cclxuICAgIHRoaXMubG9nKCdHb3QgZmlsZSBvZiBsZW5ndGggJyArIGZpbGUuYnl0ZUxlbmd0aCk7XHJcbiAgICBpZiAoZGF0YVZpZXcuZ2V0VWludDgoMCkgIT09IDB4ZmYgfHwgZGF0YVZpZXcuZ2V0VWludDgoMSkgIT09IDB4ZDgpIHtcclxuICAgICAgdGhpcy5sb2coJ05vdCBhIHZhbGlkIEpQRUcnKTtcclxuICAgICAgcmV0dXJuIGZhbHNlOyAvLyBub3QgYSB2YWxpZCBqcGVnXHJcbiAgICB9XHJcblxyXG4gICAgbGV0IG9mZnNldCA9IDI7XHJcbiAgICBjb25zdCBsZW5ndGg6IG51bWJlciA9IGZpbGUuYnl0ZUxlbmd0aDtcclxuICAgIGxldCBtYXJrZXI6IG51bWJlcjtcclxuXHJcbiAgICB3aGlsZSAob2Zmc2V0IDwgbGVuZ3RoKSB7XHJcbiAgICAgIGlmIChkYXRhVmlldy5nZXRVaW50OChvZmZzZXQpICE9PSAweGZmKSB7XHJcbiAgICAgICAgdGhpcy5sb2coXHJcbiAgICAgICAgICAnTm90IGEgdmFsaWQgbWFya2VyIGF0IG9mZnNldCAnICtcclxuICAgICAgICAgICAgb2Zmc2V0ICtcclxuICAgICAgICAgICAgJywgZm91bmQ6ICcgK1xyXG4gICAgICAgICAgICBkYXRhVmlldy5nZXRVaW50OChvZmZzZXQpXHJcbiAgICAgICAgKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7IC8vIG5vdCBhIHZhbGlkIG1hcmtlciwgc29tZXRoaW5nIGlzIHdyb25nXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIG1hcmtlciA9IGRhdGFWaWV3LmdldFVpbnQ4KG9mZnNldCArIDEpO1xyXG4gICAgICB0aGlzLmxvZyhtYXJrZXIpO1xyXG5cclxuICAgICAgLy8gd2UgY291bGQgaW1wbGVtZW50IGhhbmRsaW5nIGZvciBvdGhlciBtYXJrZXJzIGhlcmUsXHJcbiAgICAgIC8vIGJ1dCB3ZSdyZSBvbmx5IGxvb2tpbmcgZm9yIDB4RkZFMSBmb3IgRVhJRiBkYXRhXHJcbiAgICAgIGlmIChtYXJrZXIgPT09IDIyNSkge1xyXG4gICAgICAgIHRoaXMubG9nKCdGb3VuZCAweEZGRTEgbWFya2VyJyk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVhZEVYSUZEYXRhKGRhdGFWaWV3LCBvZmZzZXQgKyA0KTsgLy8gLCBkYXRhVmlldy5nZXRVaW50MTYob2Zmc2V0ICsgMikgLSAyKTtcclxuICAgICAgICAvLyBvZmZzZXQgKz0gMiArIGZpbGUuZ2V0U2hvcnRBdChvZmZzZXQrMiwgdHJ1ZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb2Zmc2V0ICs9IDIgKyBkYXRhVmlldy5nZXRVaW50MTYob2Zmc2V0ICsgMik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBmaW5kSVBUQ2luSlBFRyhmaWxlOiBBcnJheUJ1ZmZlcikge1xyXG4gICAgY29uc3QgZGF0YVZpZXcgPSBuZXcgRGF0YVZpZXcoZmlsZSk7XHJcblxyXG4gICAgdGhpcy5sb2coJ0dvdCBmaWxlIG9mIGxlbmd0aCAnICsgZmlsZS5ieXRlTGVuZ3RoKTtcclxuICAgIGlmIChkYXRhVmlldy5nZXRVaW50OCgwKSAhPT0gMHhmZiB8fCBkYXRhVmlldy5nZXRVaW50OCgxKSAhPT0gMHhkOCkge1xyXG4gICAgICB0aGlzLmxvZygnTm90IGEgdmFsaWQgSlBFRycpO1xyXG4gICAgICByZXR1cm4gZmFsc2U7IC8vIG5vdCBhIHZhbGlkIGpwZWdcclxuICAgIH1cclxuXHJcbiAgICBsZXQgb2Zmc2V0ID0gMjtcclxuICAgIGNvbnN0IGxlbmd0aCA9IGZpbGUuYnl0ZUxlbmd0aDtcclxuXHJcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dmFyaWFibGUtbmFtZVxyXG4gICAgY29uc3QgaXNGaWVsZFNlZ21lbnRTdGFydCA9IChfZGF0YVZpZXc6IERhdGFWaWV3LCBfb2Zmc2V0OiBudW1iZXIpID0+IHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICBfZGF0YVZpZXcuZ2V0VWludDgoX29mZnNldCkgPT09IDB4MzggJiZcclxuICAgICAgICBfZGF0YVZpZXcuZ2V0VWludDgoX29mZnNldCArIDEpID09PSAweDQyICYmXHJcbiAgICAgICAgX2RhdGFWaWV3LmdldFVpbnQ4KF9vZmZzZXQgKyAyKSA9PT0gMHg0OSAmJlxyXG4gICAgICAgIF9kYXRhVmlldy5nZXRVaW50OChfb2Zmc2V0ICsgMykgPT09IDB4NGQgJiZcclxuICAgICAgICBfZGF0YVZpZXcuZ2V0VWludDgoX29mZnNldCArIDQpID09PSAweDA0ICYmXHJcbiAgICAgICAgX2RhdGFWaWV3LmdldFVpbnQ4KF9vZmZzZXQgKyA1KSA9PT0gMHgwNFxyXG4gICAgICApO1xyXG4gICAgfTtcclxuXHJcbiAgICB3aGlsZSAob2Zmc2V0IDwgbGVuZ3RoKSB7XHJcbiAgICAgIGlmIChpc0ZpZWxkU2VnbWVudFN0YXJ0KGRhdGFWaWV3LCBvZmZzZXQpKSB7XHJcbiAgICAgICAgLy8gR2V0IHRoZSBsZW5ndGggb2YgdGhlIG5hbWUgaGVhZGVyICh3aGljaCBpcyBwYWRkZWQgdG8gYW4gZXZlbiBudW1iZXIgb2YgYnl0ZXMpXHJcbiAgICAgICAgbGV0IG5hbWVIZWFkZXJMZW5ndGggPSBkYXRhVmlldy5nZXRVaW50OChvZmZzZXQgKyA3KTtcclxuICAgICAgICBpZiAobmFtZUhlYWRlckxlbmd0aCAlIDIgIT09IDApIHtcclxuICAgICAgICAgIG5hbWVIZWFkZXJMZW5ndGggKz0gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gQ2hlY2sgZm9yIHByZSBwaG90b3Nob3AgNiBmb3JtYXRcclxuICAgICAgICBpZiAobmFtZUhlYWRlckxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgLy8gQWx3YXlzIDRcclxuICAgICAgICAgIG5hbWVIZWFkZXJMZW5ndGggPSA0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgc3RhcnRPZmZzZXQgPSBvZmZzZXQgKyA4ICsgbmFtZUhlYWRlckxlbmd0aDtcclxuICAgICAgICBjb25zdCBzZWN0aW9uTGVuZ3RoID0gZGF0YVZpZXcuZ2V0VWludDE2KG9mZnNldCArIDYgKyBuYW1lSGVhZGVyTGVuZ3RoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVhZElQVENEYXRhKGZpbGUsIHN0YXJ0T2Zmc2V0LCBzZWN0aW9uTGVuZ3RoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gTm90IHRoZSBtYXJrZXIsIGNvbnRpbnVlIHNlYXJjaGluZ1xyXG4gICAgICBvZmZzZXQrKztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyByZWFkSVBUQ0RhdGEoXHJcbiAgICBmaWxlOiBBcnJheUJ1ZmZlcixcclxuICAgIHN0YXJ0T2Zmc2V0OiBudW1iZXIsXHJcbiAgICBzZWN0aW9uTGVuZ3RoOiBudW1iZXJcclxuICApIHtcclxuICAgIGNvbnN0IGRhdGFWaWV3ID0gbmV3IERhdGFWaWV3KGZpbGUpO1xyXG4gICAgY29uc3QgZGF0YTogYW55ID0ge307XHJcbiAgICBsZXQgZmllbGRWYWx1ZTogYW55O1xyXG4gICAgbGV0IGZpZWxkTmFtZTogc3RyaW5nO1xyXG4gICAgbGV0IGRhdGFTaXplOiBudW1iZXI7XHJcbiAgICBsZXQgc2VnbWVudFR5cGU6IGFueTtcclxuICAgIGxldCBzZWdtZW50U2l6ZTogbnVtYmVyO1xyXG4gICAgbGV0IHNlZ21lbnRTdGFydFBvcyA9IHN0YXJ0T2Zmc2V0O1xyXG4gICAgd2hpbGUgKHNlZ21lbnRTdGFydFBvcyA8IHN0YXJ0T2Zmc2V0ICsgc2VjdGlvbkxlbmd0aCkge1xyXG4gICAgICBpZiAoXHJcbiAgICAgICAgZGF0YVZpZXcuZ2V0VWludDgoc2VnbWVudFN0YXJ0UG9zKSA9PT0gMHgxYyAmJlxyXG4gICAgICAgIGRhdGFWaWV3LmdldFVpbnQ4KHNlZ21lbnRTdGFydFBvcyArIDEpID09PSAweDAyXHJcbiAgICAgICkge1xyXG4gICAgICAgIHNlZ21lbnRUeXBlID0gZGF0YVZpZXcuZ2V0VWludDgoc2VnbWVudFN0YXJ0UG9zICsgMik7XHJcbiAgICAgICAgaWYgKHNlZ21lbnRUeXBlIGluIHRoaXMuSXB0Y0ZpZWxkTWFwKSB7XHJcbiAgICAgICAgICBkYXRhU2l6ZSA9IGRhdGFWaWV3LmdldEludDE2KHNlZ21lbnRTdGFydFBvcyArIDMpO1xyXG4gICAgICAgICAgc2VnbWVudFNpemUgPSBkYXRhU2l6ZSArIDU7XHJcbiAgICAgICAgICBmaWVsZE5hbWUgPSB0aGlzLklwdGNGaWVsZE1hcFtzZWdtZW50VHlwZV07XHJcbiAgICAgICAgICBmaWVsZFZhbHVlID0gdGhpcy5nZXRTdHJpbmdGcm9tREIoXHJcbiAgICAgICAgICAgIGRhdGFWaWV3LFxyXG4gICAgICAgICAgICBzZWdtZW50U3RhcnRQb3MgKyA1LFxyXG4gICAgICAgICAgICBkYXRhU2l6ZVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICAgIC8vIENoZWNrIGlmIHdlIGFscmVhZHkgc3RvcmVkIGEgdmFsdWUgd2l0aCB0aGlzIG5hbWVcclxuICAgICAgICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KGZpZWxkTmFtZSkpIHtcclxuICAgICAgICAgICAgLy8gVmFsdWUgYWxyZWFkeSBzdG9yZWQgd2l0aCB0aGlzIG5hbWUsIGNyZWF0ZSBtdWx0aXZhbHVlIGZpZWxkXHJcbiAgICAgICAgICAgIGlmIChkYXRhW2ZpZWxkTmFtZV0gaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgIGRhdGFbZmllbGROYW1lXS5wdXNoKGZpZWxkVmFsdWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIGRhdGFbZmllbGROYW1lXSA9IFtkYXRhW2ZpZWxkTmFtZV0sIGZpZWxkVmFsdWVdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBkYXRhW2ZpZWxkTmFtZV0gPSBmaWVsZFZhbHVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBzZWdtZW50U3RhcnRQb3MrKztcclxuICAgIH1cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlYWRUYWdzKFxyXG4gICAgZmlsZTogRGF0YVZpZXcsXHJcbiAgICB0aWZmU3RhcnQ6IG51bWJlcixcclxuICAgIGRpclN0YXJ0OiBudW1iZXIsXHJcbiAgICBzdHJpbmdzOiBzdHJpbmdbXSxcclxuICAgIGJpZ0VuZDogYm9vbGVhblxyXG4gICk6IGFueSB7XHJcbiAgICBjb25zdCBlbnRyaWVzOiBudW1iZXIgPSBmaWxlLmdldFVpbnQxNihkaXJTdGFydCwgIWJpZ0VuZCk7XHJcbiAgICBjb25zdCB0YWdzOiBhbnkgPSB7fTtcclxuICAgIGxldCBlbnRyeU9mZnNldDogbnVtYmVyO1xyXG4gICAgbGV0IHRhZzogc3RyaW5nO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW50cmllczsgaSsrKSB7XHJcbiAgICAgIGVudHJ5T2Zmc2V0ID0gZGlyU3RhcnQgKyBpICogMTIgKyAyO1xyXG4gICAgICB0YWcgPSBzdHJpbmdzW2ZpbGUuZ2V0VWludDE2KGVudHJ5T2Zmc2V0LCAhYmlnRW5kKV07XHJcbiAgICAgIGlmICghdGFnKSB7XHJcbiAgICAgICAgdGhpcy5sb2coJ1Vua25vd24gdGFnOiAnICsgZmlsZS5nZXRVaW50MTYoZW50cnlPZmZzZXQsICFiaWdFbmQpKTtcclxuICAgICAgfVxyXG4gICAgICB0YWdzW3RhZ10gPSB0aGlzLnJlYWRUYWdWYWx1ZShcclxuICAgICAgICBmaWxlLFxyXG4gICAgICAgIGVudHJ5T2Zmc2V0LFxyXG4gICAgICAgIHRpZmZTdGFydCxcclxuICAgICAgICBkaXJTdGFydCxcclxuICAgICAgICBiaWdFbmRcclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0YWdzO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlYWRUYWdWYWx1ZShcclxuICAgIGZpbGU6IGFueSxcclxuICAgIGVudHJ5T2Zmc2V0OiBudW1iZXIsXHJcbiAgICB0aWZmU3RhcnQ6IG51bWJlcixcclxuICAgIGRpclN0YXJ0OiBudW1iZXIsXHJcbiAgICBiaWdFbmQ6IGJvb2xlYW5cclxuICApOiBhbnkge1xyXG4gICAgY29uc3QgdHlwZTogbnVtYmVyID0gZmlsZS5nZXRVaW50MTYoZW50cnlPZmZzZXQgKyAyLCAhYmlnRW5kKTtcclxuICAgIGNvbnN0IG51bVZhbHVlcyA9IGZpbGUuZ2V0VWludDMyKGVudHJ5T2Zmc2V0ICsgNCwgIWJpZ0VuZCk7XHJcbiAgICBjb25zdCB2YWx1ZU9mZnNldCA9IGZpbGUuZ2V0VWludDMyKGVudHJ5T2Zmc2V0ICsgOCwgIWJpZ0VuZCkgKyB0aWZmU3RhcnQ7XHJcbiAgICBsZXQgb2Zmc2V0OiBudW1iZXI7XHJcbiAgICBsZXQgdmFsczogYW55W107XHJcbiAgICBsZXQgdmFsOiBhbnk7XHJcbiAgICBsZXQgbjogbnVtYmVyO1xyXG4gICAgbGV0IG51bWVyYXRvcjogYW55O1xyXG4gICAgbGV0IGRlbm9taW5hdG9yOiBhbnk7XHJcblxyXG4gICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgIGNhc2UgMTogLy8gYnl0ZSwgOC1iaXQgdW5zaWduZWQgaW50XHJcbiAgICAgIGNhc2UgNzogLy8gdW5kZWZpbmVkLCA4LWJpdCBieXRlLCB2YWx1ZSBkZXBlbmRpbmcgb24gZmllbGRcclxuICAgICAgICBpZiAobnVtVmFsdWVzID09PSAxKSB7XHJcbiAgICAgICAgICByZXR1cm4gZmlsZS5nZXRVaW50OChlbnRyeU9mZnNldCArIDgsICFiaWdFbmQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBvZmZzZXQgPSBudW1WYWx1ZXMgPiA0ID8gdmFsdWVPZmZzZXQgOiBlbnRyeU9mZnNldCArIDg7XHJcbiAgICAgICAgICB2YWxzID0gW107XHJcbiAgICAgICAgICBmb3IgKG4gPSAwOyBuIDwgbnVtVmFsdWVzOyBuKyspIHtcclxuICAgICAgICAgICAgdmFsc1tuXSA9IGZpbGUuZ2V0VWludDgob2Zmc2V0ICsgbik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gdmFscztcclxuICAgICAgICB9XHJcblxyXG4gICAgICBjYXNlIDI6IC8vIGFzY2lpLCA4LWJpdCBieXRlXHJcbiAgICAgICAgb2Zmc2V0ID0gbnVtVmFsdWVzID4gNCA/IHZhbHVlT2Zmc2V0IDogZW50cnlPZmZzZXQgKyA4O1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldFN0cmluZ0Zyb21EQihmaWxlLCBvZmZzZXQsIG51bVZhbHVlcyAtIDEpO1xyXG5cclxuICAgICAgY2FzZSAzOiAvLyBzaG9ydCwgMTYgYml0IGludFxyXG4gICAgICAgIGlmIChudW1WYWx1ZXMgPT09IDEpIHtcclxuICAgICAgICAgIHJldHVybiBmaWxlLmdldFVpbnQxNihlbnRyeU9mZnNldCArIDgsICFiaWdFbmQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBvZmZzZXQgPSBudW1WYWx1ZXMgPiAyID8gdmFsdWVPZmZzZXQgOiBlbnRyeU9mZnNldCArIDg7XHJcbiAgICAgICAgICB2YWxzID0gW107XHJcbiAgICAgICAgICBmb3IgKG4gPSAwOyBuIDwgbnVtVmFsdWVzOyBuKyspIHtcclxuICAgICAgICAgICAgdmFsc1tuXSA9IGZpbGUuZ2V0VWludDE2KG9mZnNldCArIDIgKiBuLCAhYmlnRW5kKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiB2YWxzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIGNhc2UgNDogLy8gbG9uZywgMzIgYml0IGludFxyXG4gICAgICAgIGlmIChudW1WYWx1ZXMgPT09IDEpIHtcclxuICAgICAgICAgIHJldHVybiBmaWxlLmdldFVpbnQzMihlbnRyeU9mZnNldCArIDgsICFiaWdFbmQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB2YWxzID0gW107XHJcbiAgICAgICAgICBmb3IgKG4gPSAwOyBuIDwgbnVtVmFsdWVzOyBuKyspIHtcclxuICAgICAgICAgICAgdmFsc1tuXSA9IGZpbGUuZ2V0VWludDMyKHZhbHVlT2Zmc2V0ICsgNCAqIG4sICFiaWdFbmQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIHZhbHM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgY2FzZSA1OiAvLyByYXRpb25hbCA9IHR3byBsb25nIHZhbHVlcywgZmlyc3QgaXMgbnVtZXJhdG9yLCBzZWNvbmQgaXMgZGVub21pbmF0b3JcclxuICAgICAgICBpZiAobnVtVmFsdWVzID09PSAxKSB7XHJcbiAgICAgICAgICBudW1lcmF0b3IgPSBmaWxlLmdldFVpbnQzMih2YWx1ZU9mZnNldCwgIWJpZ0VuZCk7XHJcbiAgICAgICAgICBkZW5vbWluYXRvciA9IGZpbGUuZ2V0VWludDMyKHZhbHVlT2Zmc2V0ICsgNCwgIWJpZ0VuZCk7XHJcbiAgICAgICAgICB2YWwgPSBuZXcgRnJhY3Rpb24obnVtZXJhdG9yIC8gZGVub21pbmF0b3IpO1xyXG4gICAgICAgICAgdmFsLm51bWVyYXRvciA9IG51bWVyYXRvcjtcclxuICAgICAgICAgIHZhbC5kZW5vbWluYXRvciA9IGRlbm9taW5hdG9yO1xyXG4gICAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdmFscyA9IFtdO1xyXG4gICAgICAgICAgZm9yIChuID0gMDsgbiA8IG51bVZhbHVlczsgbisrKSB7XHJcbiAgICAgICAgICAgIG51bWVyYXRvciA9IGZpbGUuZ2V0VWludDMyKHZhbHVlT2Zmc2V0ICsgOCAqIG4sICFiaWdFbmQpO1xyXG4gICAgICAgICAgICBkZW5vbWluYXRvciA9IGZpbGUuZ2V0VWludDMyKHZhbHVlT2Zmc2V0ICsgNCArIDggKiBuLCAhYmlnRW5kKTtcclxuICAgICAgICAgICAgdmFsc1tuXSA9IG5ldyBGcmFjdGlvbihudW1lcmF0b3IgLyBkZW5vbWluYXRvcik7XHJcbiAgICAgICAgICAgIHZhbHNbbl0ubnVtZXJhdG9yID0gbnVtZXJhdG9yO1xyXG4gICAgICAgICAgICB2YWxzW25dLmRlbm9taW5hdG9yID0gZGVub21pbmF0b3I7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gdmFscztcclxuICAgICAgICB9XHJcblxyXG4gICAgICBjYXNlIDk6IC8vIHNsb25nLCAzMiBiaXQgc2lnbmVkIGludFxyXG4gICAgICAgIGlmIChudW1WYWx1ZXMgPT09IDEpIHtcclxuICAgICAgICAgIHJldHVybiBmaWxlLmdldEludDMyKGVudHJ5T2Zmc2V0ICsgOCwgIWJpZ0VuZCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHZhbHMgPSBbXTtcclxuICAgICAgICAgIGZvciAobiA9IDA7IG4gPCBudW1WYWx1ZXM7IG4rKykge1xyXG4gICAgICAgICAgICB2YWxzW25dID0gZmlsZS5nZXRJbnQzMih2YWx1ZU9mZnNldCArIDQgKiBuLCAhYmlnRW5kKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiB2YWxzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgIGNhc2UgMTA6IC8vIHNpZ25lZCByYXRpb25hbCwgdHdvIHNsb25ncywgZmlyc3QgaXMgbnVtZXJhdG9yLCBzZWNvbmQgaXMgZGVub21pbmF0b3JcclxuICAgICAgICBpZiAobnVtVmFsdWVzID09PSAxKSB7XHJcbiAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICBmaWxlLmdldEludDMyKHZhbHVlT2Zmc2V0LCAhYmlnRW5kKSAvXHJcbiAgICAgICAgICAgIGZpbGUuZ2V0SW50MzIodmFsdWVPZmZzZXQgKyA0LCAhYmlnRW5kKVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdmFscyA9IFtdO1xyXG4gICAgICAgICAgZm9yIChuID0gMDsgbiA8IG51bVZhbHVlczsgbisrKSB7XHJcbiAgICAgICAgICAgIHZhbHNbbl0gPVxyXG4gICAgICAgICAgICAgIGZpbGUuZ2V0SW50MzIodmFsdWVPZmZzZXQgKyA4ICogbiwgIWJpZ0VuZCkgL1xyXG4gICAgICAgICAgICAgIGZpbGUuZ2V0SW50MzIodmFsdWVPZmZzZXQgKyA0ICsgOCAqIG4sICFiaWdFbmQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIHZhbHM7XHJcbiAgICAgICAgfVxyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldFN0cmluZ0Zyb21EQihcclxuICAgIGJ1ZmZlcjogRGF0YVZpZXcsXHJcbiAgICBzdGFydDogbnVtYmVyLFxyXG4gICAgbGVuZ3RoOiBudW1iZXJcclxuICApOiBzdHJpbmcge1xyXG4gICAgbGV0IG91dHN0ciA9ICcnO1xyXG4gICAgZm9yIChsZXQgbiA9IHN0YXJ0OyBuIDwgc3RhcnQgKyBsZW5ndGg7IG4rKykge1xyXG4gICAgICBvdXRzdHIgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZmZXIuZ2V0VWludDgobikpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG91dHN0cjtcclxuICB9XHJcblxyXG4gIHB1YmxpYyByZWFkRVhJRkRhdGEoZmlsZTogRGF0YVZpZXcsIHN0YXJ0OiBudW1iZXIpOiBhbnkge1xyXG4gICAgaWYgKHRoaXMuZ2V0U3RyaW5nRnJvbURCKGZpbGUsIHN0YXJ0LCA0KSAhPT0gJ0V4aWYnKSB7XHJcbiAgICAgIHRoaXMubG9nKCdOb3QgdmFsaWQgRVhJRiBkYXRhISAnICsgdGhpcy5nZXRTdHJpbmdGcm9tREIoZmlsZSwgc3RhcnQsIDQpKTtcclxuXHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgYmlnRW5kOiBib29sZWFuO1xyXG4gICAgbGV0IHRhZ3M6IGFueTtcclxuICAgIGxldCB0YWc6IHN0cmluZztcclxuICAgIGxldCBleGlmRGF0YTogYW55O1xyXG4gICAgbGV0IGdwc0RhdGE6IGFueTtcclxuICAgIGNvbnN0IHRpZmZPZmZzZXQ6IG51bWJlciA9IHN0YXJ0ICsgNjtcclxuXHJcbiAgICAvLyB0ZXN0IGZvciBUSUZGIHZhbGlkaXR5IGFuZCBlbmRpYW5uZXNzXHJcbiAgICBpZiAoZmlsZS5nZXRVaW50MTYodGlmZk9mZnNldCkgPT09IDB4NDk0OSkge1xyXG4gICAgICBiaWdFbmQgPSBmYWxzZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChmaWxlLmdldFVpbnQxNih0aWZmT2Zmc2V0KSA9PT0gMHg0ZDRkKSB7XHJcbiAgICAgICAgYmlnRW5kID0gdHJ1ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmxvZygnTm90IHZhbGlkIFRJRkYgZGF0YSEgKG5vIDB4NDk0OSBvciAweDRENEQpJyk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGZpbGUuZ2V0VWludDE2KHRpZmZPZmZzZXQgKyAyLCAhYmlnRW5kKSAhPT0gMHgwMDJhKSB7XHJcbiAgICAgIHRoaXMubG9nKCdOb3QgdmFsaWQgVElGRiBkYXRhISAobm8gMHgwMDJBKScpO1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZmlyc3RJRkRPZmZzZXQgPSBmaWxlLmdldFVpbnQzMih0aWZmT2Zmc2V0ICsgNCwgIWJpZ0VuZCk7XHJcblxyXG4gICAgaWYgKGZpcnN0SUZET2Zmc2V0IDwgMHgwMDAwMDAwOCkge1xyXG4gICAgICB0aGlzLmxvZyhcclxuICAgICAgICAnTm90IHZhbGlkIFRJRkYgZGF0YSEgKEZpcnN0IG9mZnNldCBsZXNzIHRoYW4gOCknLFxyXG4gICAgICAgIGZpbGUuZ2V0VWludDMyKHRpZmZPZmZzZXQgKyA0LCAhYmlnRW5kKVxyXG4gICAgICApO1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgdGFncyA9IHRoaXMucmVhZFRhZ3MoXHJcbiAgICAgIGZpbGUsXHJcbiAgICAgIHRpZmZPZmZzZXQsXHJcbiAgICAgIHRpZmZPZmZzZXQgKyBmaXJzdElGRE9mZnNldCxcclxuICAgICAgdGhpcy5UaWZmVGFncyxcclxuICAgICAgYmlnRW5kXHJcbiAgICApO1xyXG5cclxuICAgIGlmICh0YWdzLkV4aWZJRkRQb2ludGVyKSB7XHJcbiAgICAgIGV4aWZEYXRhID0gdGhpcy5yZWFkVGFncyhcclxuICAgICAgICBmaWxlLFxyXG4gICAgICAgIHRpZmZPZmZzZXQsXHJcbiAgICAgICAgdGlmZk9mZnNldCArIHRhZ3MuRXhpZklGRFBvaW50ZXIsXHJcbiAgICAgICAgdGhpcy5UYWdzLFxyXG4gICAgICAgIGJpZ0VuZFxyXG4gICAgICApO1xyXG4gICAgICBmb3IgKHRhZyBpbiBleGlmRGF0YSkge1xyXG4gICAgICAgIGlmICh7fS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGV4aWZEYXRhLCB0YWcpKSB7XHJcbiAgICAgICAgICBzd2l0Y2ggKHRhZykge1xyXG4gICAgICAgICAgICBjYXNlICdMaWdodFNvdXJjZSc6XHJcbiAgICAgICAgICAgIGNhc2UgJ0ZsYXNoJzpcclxuICAgICAgICAgICAgY2FzZSAnTWV0ZXJpbmdNb2RlJzpcclxuICAgICAgICAgICAgY2FzZSAnRXhwb3N1cmVQcm9ncmFtJzpcclxuICAgICAgICAgICAgY2FzZSAnU2Vuc2luZ01ldGhvZCc6XHJcbiAgICAgICAgICAgIGNhc2UgJ1NjZW5lQ2FwdHVyZVR5cGUnOlxyXG4gICAgICAgICAgICBjYXNlICdTY2VuZVR5cGUnOlxyXG4gICAgICAgICAgICBjYXNlICdDdXN0b21SZW5kZXJlZCc6XHJcbiAgICAgICAgICAgIGNhc2UgJ1doaXRlQmFsYW5jZSc6XHJcbiAgICAgICAgICAgIGNhc2UgJ0dhaW5Db250cm9sJzpcclxuICAgICAgICAgICAgY2FzZSAnQ29udHJhc3QnOlxyXG4gICAgICAgICAgICBjYXNlICdTYXR1cmF0aW9uJzpcclxuICAgICAgICAgICAgY2FzZSAnU2hhcnBuZXNzJzpcclxuICAgICAgICAgICAgY2FzZSAnU3ViamVjdERpc3RhbmNlUmFuZ2UnOlxyXG4gICAgICAgICAgICBjYXNlICdGaWxlU291cmNlJzpcclxuICAgICAgICAgICAgICBleGlmRGF0YVt0YWddID0gdGhpcy5TdHJpbmdWYWx1ZXNbdGFnXVtleGlmRGF0YVt0YWddXTtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnRXhpZlZlcnNpb24nOlxyXG4gICAgICAgICAgICBjYXNlICdGbGFzaHBpeFZlcnNpb24nOlxyXG4gICAgICAgICAgICAgIGV4aWZEYXRhW3RhZ10gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKFxyXG4gICAgICAgICAgICAgICAgZXhpZkRhdGFbdGFnXVswXSxcclxuICAgICAgICAgICAgICAgIGV4aWZEYXRhW3RhZ11bMV0sXHJcbiAgICAgICAgICAgICAgICBleGlmRGF0YVt0YWddWzJdLFxyXG4gICAgICAgICAgICAgICAgZXhpZkRhdGFbdGFnXVszXVxyXG4gICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ0NvbXBvbmVudHNDb25maWd1cmF0aW9uJzpcclxuICAgICAgICAgICAgICBjb25zdCBjb21wb3BlbnRzID0gJ0NvbXBvbmVudHMnO1xyXG4gICAgICAgICAgICAgIGV4aWZEYXRhW3RhZ10gPVxyXG4gICAgICAgICAgICAgICAgdGhpcy5TdHJpbmdWYWx1ZXNbY29tcG9wZW50c11bZXhpZkRhdGFbdGFnXVswXV0gK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5TdHJpbmdWYWx1ZXNbY29tcG9wZW50c11bZXhpZkRhdGFbdGFnXVsxXV0gK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5TdHJpbmdWYWx1ZXNbY29tcG9wZW50c11bZXhpZkRhdGFbdGFnXVsyXV0gK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5TdHJpbmdWYWx1ZXNbY29tcG9wZW50c11bZXhpZkRhdGFbdGFnXVszXV07XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0YWdzW3RhZ10gPSBleGlmRGF0YVt0YWddO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0YWdzLkdQU0luZm9JRkRQb2ludGVyKSB7XHJcbiAgICAgIGdwc0RhdGEgPSB0aGlzLnJlYWRUYWdzKFxyXG4gICAgICAgIGZpbGUsXHJcbiAgICAgICAgdGlmZk9mZnNldCxcclxuICAgICAgICB0aWZmT2Zmc2V0ICsgdGFncy5HUFNJbmZvSUZEUG9pbnRlcixcclxuICAgICAgICB0aGlzLkdQU1RhZ3MsXHJcbiAgICAgICAgYmlnRW5kXHJcbiAgICAgICk7XHJcbiAgICAgIGZvciAodGFnIGluIGdwc0RhdGEpIHtcclxuICAgICAgICBpZiAoe30uaGFzT3duUHJvcGVydHkuY2FsbChncHNEYXRhLCB0YWcpKSB7XHJcbiAgICAgICAgICBzd2l0Y2ggKHRhZykge1xyXG4gICAgICAgICAgICBjYXNlICdHUFNWZXJzaW9uSUQnOlxyXG4gICAgICAgICAgICAgIGdwc0RhdGFbdGFnXSA9XHJcbiAgICAgICAgICAgICAgICBncHNEYXRhW3RhZ11bMF0gK1xyXG4gICAgICAgICAgICAgICAgJy4nICtcclxuICAgICAgICAgICAgICAgIGdwc0RhdGFbdGFnXVsxXSArXHJcbiAgICAgICAgICAgICAgICAnLicgK1xyXG4gICAgICAgICAgICAgICAgZ3BzRGF0YVt0YWddWzJdICtcclxuICAgICAgICAgICAgICAgICcuJyArXHJcbiAgICAgICAgICAgICAgICBncHNEYXRhW3RhZ11bM107XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0YWdzW3RhZ10gPSBncHNEYXRhW3RhZ107XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRhZ3M7XHJcbiAgfVxyXG5cclxuICAvLyAgIGdldCByaWQgb2YgdGhpcyBzaWxseSBpc3N1ZVxyXG4gIHByaXZhdGUgY2hlY2tJbWFnZVR5cGUoaW1nOiBhbnkpIHtcclxuICAgIHJldHVybiBpbWcgaW5zdGFuY2VvZiBJbWFnZSB8fCBpbWcgaW5zdGFuY2VvZiBIVE1MSW1hZ2VFbGVtZW50O1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldERhdGEoaW1nOiBJSW1hZ2VFeHRlbmRlZCB8IEhUTUxJbWFnZUVsZW1lbnQsIGNhbGxiYWNrOiAoKSA9PiB2b2lkKSB7XHJcbiAgICBpZiAodGhpcy5jaGVja0ltYWdlVHlwZShpbWcpICYmICFpbWcuY29tcGxldGUpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghdGhpcy5pbWFnZUhhc0RhdGEoaW1nIGFzIElJbWFnZUV4dGVuZGVkKSkge1xyXG4gICAgICB0aGlzLmdldEltYWdlRGF0YShpbWcgYXMgSUltYWdlRXh0ZW5kZWQsIGNhbGxiYWNrKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgIGNhbGxiYWNrLmNhbGwoaW1nKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0VGFnKGltZzogYW55LCB0YWc6IHN0cmluZykge1xyXG4gICAgaWYgKCF0aGlzLmltYWdlSGFzRGF0YShpbWcpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHJldHVybiBpbWcuZXhpZmRhdGFbdGFnXTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXRBbGxUYWdzKGltZzogYW55KSB7XHJcbiAgICBpZiAoIXRoaXMuaW1hZ2VIYXNEYXRhKGltZykpIHtcclxuICAgICAgcmV0dXJuIHt9O1xyXG4gICAgfVxyXG4gICAgbGV0IGE6IHN0cmluZztcclxuICAgIGNvbnN0IGRhdGE6IGFueSA9IGltZy5leGlmZGF0YTtcclxuICAgIGNvbnN0IHRhZ3M6IGFueSA9IHt9O1xyXG4gICAgZm9yIChhIGluIGRhdGEpIHtcclxuICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkoYSkpIHtcclxuICAgICAgICB0YWdzW2FdID0gZGF0YVthXTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRhZ3M7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcHJldHR5KGltZzogSUltYWdlRXh0ZW5kZWQpIHtcclxuICAgIGlmICghdGhpcy5pbWFnZUhhc0RhdGEoaW1nKSkge1xyXG4gICAgICByZXR1cm4gJyc7XHJcbiAgICB9XHJcbiAgICBsZXQgYTogYW55O1xyXG4gICAgY29uc3QgZGF0YTogYW55ID0gaW1nLmV4aWZkYXRhO1xyXG4gICAgbGV0IHN0clByZXR0eSA9ICcnO1xyXG4gICAgZm9yIChhIGluIGRhdGEpIHtcclxuICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkoYSkpIHtcclxuICAgICAgICBpZiAodHlwZW9mIGRhdGFbYV0gPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICBpZiAoZGF0YVthXSBpbnN0YW5jZW9mIE51bWJlcikge1xyXG4gICAgICAgICAgICBzdHJQcmV0dHkgKz0gYCR7YX0gOiAke2RhdGFbYV19IFske2RhdGFbYV0ubnVtZXJhdG9yfS8ke1xyXG4gICAgICAgICAgICAgIGRhdGFbYV0uZGVub21pbmF0b3JcclxuICAgICAgICAgICAgfV1cXHJcXG5gO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc3RyUHJldHR5ICs9IGAke2F9IDogWyR7ZGF0YVthXS5sZW5ndGh9IHZhbHVlc11cXHJcXG5gO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzdHJQcmV0dHkgKz0gYCR7YX0gOiAke2RhdGFbYV19XFxyXFxuYDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBzdHJQcmV0dHk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcmVhZEZyb21CaW5hcnlGaWxlKGZpbGU6IEFycmF5QnVmZmVyKSB7XHJcbiAgICByZXR1cm4gdGhpcy5maW5kRVhJRmluSlBFRyhmaWxlKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBsb2coLi4uYXJnczogYW55W10pIHtcclxuICAgIGlmICh0aGlzLmRlYnVnKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGFyZ3MpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=