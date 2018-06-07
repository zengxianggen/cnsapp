var QRCode; !
    function() {
        function QR8bitByte(data) {
            this.mode = QRMode.MODE_8BIT_BYTE,
                this.data = data,
                this.parsedData = [];
            for (var i = 0,
                     l = this.data.length; l > i; i++) {
                var byteArray = [],
                    code = this.data.charCodeAt(i);
                code > 65536 ? (byteArray[0] = 240 | (1835008 & code) >>> 18, byteArray[1] = 128 | (258048 & code) >>> 12, byteArray[2] = 128 | (4032 & code) >>> 6, byteArray[3] = 128 | 63 & code) : code > 2048 ? (byteArray[0] = 224 | (61440 & code) >>> 12, byteArray[1] = 128 | (4032 & code) >>> 6, byteArray[2] = 128 | 63 & code) : code > 128 ? (byteArray[0] = 192 | (1984 & code) >>> 6, byteArray[1] = 128 | 63 & code) : byteArray[0] = code,
                    this.parsedData.push(byteArray)
            }
            this.parsedData = Array.prototype.concat.apply([], this.parsedData),
            this.parsedData.length != this.data.length && (this.parsedData.unshift(191), this.parsedData.unshift(187), this.parsedData.unshift(239))
        }
        function QRCodeModel(typeNumber, errorCorrectLevel) {
            this.typeNumber = typeNumber,
                this.errorCorrectLevel = errorCorrectLevel,
                this.modules = null,
                this.moduleCount = 0,
                this.dataCache = null,
                this.dataList = []
        }
        function QRPolynomial(num, shift) {
            if (void 0 == num.length) throw new Error(num.length + "/" + shift);
            for (var offset = 0; offset < num.length && 0 == num[offset];) offset++;
            this.num = new Array(num.length - offset + shift);
            for (var i = 0; i < num.length - offset; i++) this.num[i] = num[i + offset]
        }
        function QRRSBlock(totalCount, dataCount) {
            this.totalCount = totalCount,
                this.dataCount = dataCount
        }
        function QRBitBuffer() {
            this.buffer = [],
                this.length = 0
        }
        function _isSupportCanvas() {
            return "undefined" != typeof CanvasRenderingContext2D
        }
        function _getAndroid() {
            var android = !1,
                sAgent = navigator.userAgent;
            return /android/i.test(sAgent) && (android = !0, aMat = sAgent.toString().match(/android ([0-9]\.[0-9])/i), aMat && aMat[1] && (android = parseFloat(aMat[1]))),
                android
        }
        function _getTypeNumber(sText, nCorrectLevel) {
            for (var nType = 1,
                     length = _getUTF8Length(sText), i = 0, len = QRCodeLimitLength.length; len >= i; i++) {
                var nLimit = 0;
                switch (nCorrectLevel) {
                    case QRErrorCorrectLevel.L:
                        nLimit = QRCodeLimitLength[i][0];
                        break;
                    case QRErrorCorrectLevel.M:
                        nLimit = QRCodeLimitLength[i][1];
                        break;
                    case QRErrorCorrectLevel.Q:
                        nLimit = QRCodeLimitLength[i][2];
                        break;
                    case QRErrorCorrectLevel.H:
                        nLimit = QRCodeLimitLength[i][3]
                }
                if (nLimit >= length) break;
                nType++
            }
            if (nType > QRCodeLimitLength.length) throw new Error("Too long data");
            return nType
        }
        function _getUTF8Length(sText) {
            var replacedText = encodeURI(sText).toString().replace(/\%[0-9a-fA-F]{2}/g, "a");
            return replacedText.length + (replacedText.length != sText ? 3 : 0)
        }
        QR8bitByte.prototype = {
            getLength: function() {
                return this.parsedData.length
            },
            write: function(buffer) {
                for (var i = 0,
                         l = this.parsedData.length; l > i; i++) buffer.put(this.parsedData[i], 8)
            }
        },
            QRCodeModel.prototype = {
                addData: function(data) {
                    var newData = new QR8bitByte(data);
                    this.dataList.push(newData),
                        this.dataCache = null
                },
                isDark: function(row, col) {
                    if (0 > row || this.moduleCount <= row || 0 > col || this.moduleCount <= col) throw new Error(row + "," + col);
                    return this.modules[row][col]
                },
                getModuleCount: function() {
                    return this.moduleCount
                },
                make: function() {
                    this.makeImpl(!1, this.getBestMaskPattern())
                },
                makeImpl: function(test, maskPattern) {
                    this.moduleCount = 4 * this.typeNumber + 17,
                        this.modules = new Array(this.moduleCount);
                    for (var row = 0; row < this.moduleCount; row++) {
                        this.modules[row] = new Array(this.moduleCount);
                        for (var col = 0; col < this.moduleCount; col++) this.modules[row][col] = null
                    }
                    this.setupPositionProbePattern(0, 0),
                        this.setupPositionProbePattern(this.moduleCount - 7, 0),
                        this.setupPositionProbePattern(0, this.moduleCount - 7),
                        this.setupPositionAdjustPattern(),
                        this.setupTimingPattern(),
                        this.setupTypeInfo(test, maskPattern),
                    this.typeNumber >= 7 && this.setupTypeNumber(test),
                    null == this.dataCache && (this.dataCache = QRCodeModel.createData(this.typeNumber, this.errorCorrectLevel, this.dataList)),
                        this.mapData(this.dataCache, maskPattern)
                },
                setupPositionProbePattern: function(row, col) {
                    for (var r = -1; 7 >= r; r++) if (! ( - 1 >= row + r || this.moduleCount <= row + r)) for (var c = -1; 7 >= c; c++) - 1 >= col + c || this.moduleCount <= col + c || (this.modules[row + r][col + c] = r >= 0 && 6 >= r && (0 == c || 6 == c) || c >= 0 && 6 >= c && (0 == r || 6 == r) || r >= 2 && 4 >= r && c >= 2 && 4 >= c ? !0 : !1)
                },
                getBestMaskPattern: function() {
                    for (var minLostPoint = 0,
                             pattern = 0,
                             i = 0; 8 > i; i++) {
                        this.makeImpl(!0, i);
                        var lostPoint = QRUtil.getLostPoint(this); (0 == i || minLostPoint > lostPoint) && (minLostPoint = lostPoint, pattern = i)
                    }
                    return pattern
                },
                createMovieClip: function(target_mc, instance_name, depth) {
                    var qr_mc = target_mc.createEmptyMovieClip(instance_name, depth),
                        cs = 1;
                    this.make();
                    for (var row = 0; row < this.modules.length; row++) for (var y = row * cs,
                                                                                 col = 0; col < this.modules[row].length; col++) {
                        var x = col * cs,
                            dark = this.modules[row][col];
                        dark && (qr_mc.beginFill(0, 100), qr_mc.moveTo(x, y), qr_mc.lineTo(x + cs, y), qr_mc.lineTo(x + cs, y + cs), qr_mc.lineTo(x, y + cs), qr_mc.endFill())
                    }
                    return qr_mc
                },
                setupTimingPattern: function() {
                    for (var r = 8; r < this.moduleCount - 8; r++) null == this.modules[r][6] && (this.modules[r][6] = r % 2 == 0);
                    for (var c = 8; c < this.moduleCount - 8; c++) null == this.modules[6][c] && (this.modules[6][c] = c % 2 == 0)
                },
                setupPositionAdjustPattern: function() {
                    for (var pos = QRUtil.getPatternPosition(this.typeNumber), i = 0; i < pos.length; i++) for (var j = 0; j < pos.length; j++) {
                        var row = pos[i],
                            col = pos[j];
                        if (null == this.modules[row][col]) for (var r = -2; 2 >= r; r++) for (var c = -2; 2 >= c; c++) this.modules[row + r][col + c] = -2 == r || 2 == r || -2 == c || 2 == c || 0 == r && 0 == c ? !0 : !1
                    }
                },
                setupTypeNumber: function(test) {
                    for (var bits = QRUtil.getBCHTypeNumber(this.typeNumber), i = 0; 18 > i; i++) {
                        var mod = !test && 1 == (bits >> i & 1);
                        this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod
                    }
                    for (var i = 0; 18 > i; i++) {
                        var mod = !test && 1 == (bits >> i & 1);
                        this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod
                    }
                },
                setupTypeInfo: function(test, maskPattern) {
                    for (var data = this.errorCorrectLevel << 3 | maskPattern,
                             bits = QRUtil.getBCHTypeInfo(data), i = 0; 15 > i; i++) {
                        var mod = !test && 1 == (bits >> i & 1);
                        6 > i ? this.modules[i][8] = mod: 8 > i ? this.modules[i + 1][8] = mod: this.modules[this.moduleCount - 15 + i][8] = mod
                    }
                    for (var i = 0; 15 > i; i++) {
                        var mod = !test && 1 == (bits >> i & 1);
                        8 > i ? this.modules[8][this.moduleCount - i - 1] = mod: 9 > i ? this.modules[8][15 - i - 1 + 1] = mod: this.modules[8][15 - i - 1] = mod
                    }
                    this.modules[this.moduleCount - 8][8] = !test
                },
                mapData: function(data, maskPattern) {
                    for (var inc = -1,
                             row = this.moduleCount - 1,
                             bitIndex = 7,
                             byteIndex = 0,
                             col = this.moduleCount - 1; col > 0; col -= 2) for (6 == col && col--;;) {
                        for (var c = 0; 2 > c; c++) if (null == this.modules[row][col - c]) {
                            var dark = !1;
                            byteIndex < data.length && (dark = 1 == (data[byteIndex] >>> bitIndex & 1));
                            var mask = QRUtil.getMask(maskPattern, row, col - c);
                            mask && (dark = !dark),
                                this.modules[row][col - c] = dark,
                                bitIndex--,
                            -1 == bitIndex && (byteIndex++, bitIndex = 7)
                        }
                        if (row += inc, 0 > row || this.moduleCount <= row) {
                            row -= inc,
                                inc = -inc;
                            break
                        }
                    }
                }
            },
            QRCodeModel.PAD0 = 236,
            QRCodeModel.PAD1 = 17,
            QRCodeModel.createData = function(typeNumber, errorCorrectLevel, dataList) {
                for (var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel), buffer = new QRBitBuffer, i = 0; i < dataList.length; i++) {
                    var data = dataList[i];
                    buffer.put(data.mode, 4),
                        buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber)),
                        data.write(buffer)
                }
                for (var totalDataCount = 0,
                         i = 0; i < rsBlocks.length; i++) totalDataCount += rsBlocks[i].dataCount;
                if (buffer.getLengthInBits() > 8 * totalDataCount) throw new Error("code length overflow. (" + buffer.getLengthInBits() + ">" + 8 * totalDataCount + ")");
                for (buffer.getLengthInBits() + 4 <= 8 * totalDataCount && buffer.put(0, 4); buffer.getLengthInBits() % 8 != 0;) buffer.putBit(!1);
                for (;;) {
                    if (buffer.getLengthInBits() >= 8 * totalDataCount) break;
                    if (buffer.put(QRCodeModel.PAD0, 8), buffer.getLengthInBits() >= 8 * totalDataCount) break;
                    buffer.put(QRCodeModel.PAD1, 8)
                }
                return QRCodeModel.createBytes(buffer, rsBlocks)
            },
            QRCodeModel.createBytes = function(buffer, rsBlocks) {
                for (var offset = 0,
                         maxDcCount = 0,
                         maxEcCount = 0,
                         dcdata = new Array(rsBlocks.length), ecdata = new Array(rsBlocks.length), r = 0; r < rsBlocks.length; r++) {
                    var dcCount = rsBlocks[r].dataCount,
                        ecCount = rsBlocks[r].totalCount - dcCount;
                    maxDcCount = Math.max(maxDcCount, dcCount),
                        maxEcCount = Math.max(maxEcCount, ecCount),
                        dcdata[r] = new Array(dcCount);
                    for (var i = 0; i < dcdata[r].length; i++) dcdata[r][i] = 255 & buffer.buffer[i + offset];
                    offset += dcCount;
                    var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount),
                        rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1),
                        modPoly = rawPoly.mod(rsPoly);
                    ecdata[r] = new Array(rsPoly.getLength() - 1);
                    for (var i = 0; i < ecdata[r].length; i++) {
                        var modIndex = i + modPoly.getLength() - ecdata[r].length;
                        ecdata[r][i] = modIndex >= 0 ? modPoly.get(modIndex) : 0
                    }
                }
                for (var totalCodeCount = 0,
                         i = 0; i < rsBlocks.length; i++) totalCodeCount += rsBlocks[i].totalCount;
                for (var data = new Array(totalCodeCount), index = 0, i = 0; maxDcCount > i; i++) for (var r = 0; r < rsBlocks.length; r++) i < dcdata[r].length && (data[index++] = dcdata[r][i]);
                for (var i = 0; maxEcCount > i; i++) for (var r = 0; r < rsBlocks.length; r++) i < ecdata[r].length && (data[index++] = ecdata[r][i]);
                return data
            };
        for (var QRMode = {
                MODE_NUMBER: 1,
                MODE_ALPHA_NUM: 2,
                MODE_8BIT_BYTE: 4,
                MODE_KANJI: 8
            },
                 QRErrorCorrectLevel = {
                     L: 1,
                     M: 0,
                     Q: 3,
                     H: 2
                 },
                 QRMaskPattern = {
                     PATTERN000: 0,
                     PATTERN001: 1,
                     PATTERN010: 2,
                     PATTERN011: 3,
                     PATTERN100: 4,
                     PATTERN101: 5,
                     PATTERN110: 6,
                     PATTERN111: 7
                 },
                 QRUtil = {
                     PATTERN_POSITION_TABLE: [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]],
                     G15: 1335,
                     G18: 7973,
                     G15_MASK: 21522,
                     getBCHTypeInfo: function(data) {
                         for (var d = data << 10; QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0;) d ^= QRUtil.G15 << QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15);
                         return (data << 10 | d) ^ QRUtil.G15_MASK
                     },
                     getBCHTypeNumber: function(data) {
                         for (var d = data << 12; QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0;) d ^= QRUtil.G18 << QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18);
                         return data << 12 | d
                     },
                     getBCHDigit: function(data) {
                         for (var digit = 0; 0 != data;) digit++,
                             data >>>= 1;
                         return digit
                     },
                     getPatternPosition: function(typeNumber) {
                         return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1]
                     },
                     getMask: function(maskPattern, i, j) {
                         switch (maskPattern) {
                             case QRMaskPattern.PATTERN000:
                                 return (i + j) % 2 == 0;
                             case QRMaskPattern.PATTERN001:
                                 return i % 2 == 0;
                             case QRMaskPattern.PATTERN010:
                                 return j % 3 == 0;
                             case QRMaskPattern.PATTERN011:
                                 return (i + j) % 3 == 0;
                             case QRMaskPattern.PATTERN100:
                                 return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0;
                             case QRMaskPattern.PATTERN101:
                                 return i * j % 2 + i * j % 3 == 0;
                             case QRMaskPattern.PATTERN110:
                                 return (i * j % 2 + i * j % 3) % 2 == 0;
                             case QRMaskPattern.PATTERN111:
                                 return (i * j % 3 + (i + j) % 2) % 2 == 0;
                             default:
                                 throw new Error("bad maskPattern:" + maskPattern)
                         }
                     },
                     getErrorCorrectPolynomial: function(errorCorrectLength) {
                         for (var a = new QRPolynomial([1], 0), i = 0; errorCorrectLength > i; i++) a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0));
                         return a
                     },
                     getLengthInBits: function(mode, type) {
                         if (type >= 1 && 10 > type) switch (mode) {
                             case QRMode.MODE_NUMBER:
                                 return 10;
                             case QRMode.MODE_ALPHA_NUM:
                                 return 9;
                             case QRMode.MODE_8BIT_BYTE:
                                 return 8;
                             case QRMode.MODE_KANJI:
                                 return 8;
                             default:
                                 throw new Error("mode:" + mode)
                         } else if (27 > type) switch (mode) {
                             case QRMode.MODE_NUMBER:
                                 return 12;
                             case QRMode.MODE_ALPHA_NUM:
                                 return 11;
                             case QRMode.MODE_8BIT_BYTE:
                                 return 16;
                             case QRMode.MODE_KANJI:
                                 return 10;
                             default:
                                 throw new Error("mode:" + mode)
                         } else {
                             if (! (41 > type)) throw new Error("type:" + type);
                             switch (mode) {
                                 case QRMode.MODE_NUMBER:
                                     return 14;
                                 case QRMode.MODE_ALPHA_NUM:
                                     return 13;
                                 case QRMode.MODE_8BIT_BYTE:
                                     return 16;
                                 case QRMode.MODE_KANJI:
                                     return 12;
                                 default:
                                     throw new Error("mode:" + mode)
                             }
                         }
                     },
                     getLostPoint: function(qrCode) {
                         for (var moduleCount = qrCode.getModuleCount(), lostPoint = 0, row = 0; moduleCount > row; row++) for (var col = 0; moduleCount > col; col++) {
                             for (var sameCount = 0,
                                      dark = qrCode.isDark(row, col), r = -1; 1 >= r; r++) if (! (0 > row + r || row + r >= moduleCount)) for (var c = -1; 1 >= c; c++) 0 > col + c || col + c >= moduleCount || (0 != r || 0 != c) && dark == qrCode.isDark(row + r, col + c) && sameCount++;
                             sameCount > 5 && (lostPoint += 3 + sameCount - 5)
                         }
                         for (var row = 0; moduleCount - 1 > row; row++) for (var col = 0; moduleCount - 1 > col; col++) {
                             var count = 0;
                             qrCode.isDark(row, col) && count++,
                             qrCode.isDark(row + 1, col) && count++,
                             qrCode.isDark(row, col + 1) && count++,
                             qrCode.isDark(row + 1, col + 1) && count++,
                             (0 == count || 4 == count) && (lostPoint += 3)
                         }
                         for (var row = 0; moduleCount > row; row++) for (var col = 0; moduleCount - 6 > col; col++) qrCode.isDark(row, col) && !qrCode.isDark(row, col + 1) && qrCode.isDark(row, col + 2) && qrCode.isDark(row, col + 3) && qrCode.isDark(row, col + 4) && !qrCode.isDark(row, col + 5) && qrCode.isDark(row, col + 6) && (lostPoint += 40);
                         for (var col = 0; moduleCount > col; col++) for (var row = 0; moduleCount - 6 > row; row++) qrCode.isDark(row, col) && !qrCode.isDark(row + 1, col) && qrCode.isDark(row + 2, col) && qrCode.isDark(row + 3, col) && qrCode.isDark(row + 4, col) && !qrCode.isDark(row + 5, col) && qrCode.isDark(row + 6, col) && (lostPoint += 40);
                         for (var darkCount = 0,
                                  col = 0; moduleCount > col; col++) for (var row = 0; moduleCount > row; row++) qrCode.isDark(row, col) && darkCount++;
                         var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
                         return lostPoint += 10 * ratio
                     }
                 },
                 QRMath = {
                     glog: function(n) {
                         if (1 > n) throw new Error("glog(" + n + ")");
                         return QRMath.LOG_TABLE[n]
                     },
                     gexp: function(n) {
                         for (; 0 > n;) n += 255;
                         for (; n >= 256;) n -= 255;
                         return QRMath.EXP_TABLE[n]
                     },
                     EXP_TABLE: new Array(256),
                     LOG_TABLE: new Array(256)
                 },
                 i = 0; 8 > i; i++) QRMath.EXP_TABLE[i] = 1 << i;
        for (var i = 8; 256 > i; i++) QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4] ^ QRMath.EXP_TABLE[i - 5] ^ QRMath.EXP_TABLE[i - 6] ^ QRMath.EXP_TABLE[i - 8];
        for (var i = 0; 255 > i; i++) QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i;
        QRPolynomial.prototype = {
            get: function(index) {
                return this.num[index]
            },
            getLength: function() {
                return this.num.length
            },
            multiply: function(e) {
                for (var num = new Array(this.getLength() + e.getLength() - 1), i = 0; i < this.getLength(); i++) for (var j = 0; j < e.getLength(); j++) num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i)) + QRMath.glog(e.get(j)));
                return new QRPolynomial(num, 0)
            },
            mod: function(e) {
                if (this.getLength() - e.getLength() < 0) return this;
                for (var ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0)), num = new Array(this.getLength()), i = 0; i < this.getLength(); i++) num[i] = this.get(i);
                for (var i = 0; i < e.getLength(); i++) num[i] ^= QRMath.gexp(QRMath.glog(e.get(i)) + ratio);
                return new QRPolynomial(num, 0).mod(e)
            }
        },
            QRRSBlock.RS_BLOCK_TABLE = [[1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9], [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16], [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13], [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9], [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12], [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15], [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14], [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15], [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13], [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16], [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 50, 22, 4, 51, 23], [3, 36, 12, 8, 37, 13], [2, 116, 92, 2, 117, 93], [6, 58, 36, 2, 59, 37], [4, 46, 20, 6, 47, 21], [7, 42, 14, 4, 43, 15], [4, 133, 107], [8, 59, 37, 1, 60, 38], [8, 44, 20, 4, 45, 21], [12, 33, 11, 4, 34, 12], [3, 145, 115, 1, 146, 116], [4, 64, 40, 5, 65, 41], [11, 36, 16, 5, 37, 17], [11, 36, 12, 5, 37, 13], [5, 109, 87, 1, 110, 88], [5, 65, 41, 5, 66, 42], [5, 54, 24, 7, 55, 25], [11, 36, 12], [5, 122, 98, 1, 123, 99], [7, 73, 45, 3, 74, 46], [15, 43, 19, 2, 44, 20], [3, 45, 15, 13, 46, 16], [1, 135, 107, 5, 136, 108], [10, 74, 46, 1, 75, 47], [1, 50, 22, 15, 51, 23], [2, 42, 14, 17, 43, 15], [5, 150, 120, 1, 151, 121], [9, 69, 43, 4, 70, 44], [17, 50, 22, 1, 51, 23], [2, 42, 14, 19, 43, 15], [3, 141, 113, 4, 142, 114], [3, 70, 44, 11, 71, 45], [17, 47, 21, 4, 48, 22], [9, 39, 13, 16, 40, 14], [3, 135, 107, 5, 136, 108], [3, 67, 41, 13, 68, 42], [15, 54, 24, 5, 55, 25], [15, 43, 15, 10, 44, 16], [4, 144, 116, 4, 145, 117], [17, 68, 42], [17, 50, 22, 6, 51, 23], [19, 46, 16, 6, 47, 17], [2, 139, 111, 7, 140, 112], [17, 74, 46], [7, 54, 24, 16, 55, 25], [34, 37, 13], [4, 151, 121, 5, 152, 122], [4, 75, 47, 14, 76, 48], [11, 54, 24, 14, 55, 25], [16, 45, 15, 14, 46, 16], [6, 147, 117, 4, 148, 118], [6, 73, 45, 14, 74, 46], [11, 54, 24, 16, 55, 25], [30, 46, 16, 2, 47, 17], [8, 132, 106, 4, 133, 107], [8, 75, 47, 13, 76, 48], [7, 54, 24, 22, 55, 25], [22, 45, 15, 13, 46, 16], [10, 142, 114, 2, 143, 115], [19, 74, 46, 4, 75, 47], [28, 50, 22, 6, 51, 23], [33, 46, 16, 4, 47, 17], [8, 152, 122, 4, 153, 123], [22, 73, 45, 3, 74, 46], [8, 53, 23, 26, 54, 24], [12, 45, 15, 28, 46, 16], [3, 147, 117, 10, 148, 118], [3, 73, 45, 23, 74, 46], [4, 54, 24, 31, 55, 25], [11, 45, 15, 31, 46, 16], [7, 146, 116, 7, 147, 117], [21, 73, 45, 7, 74, 46], [1, 53, 23, 37, 54, 24], [19, 45, 15, 26, 46, 16], [5, 145, 115, 10, 146, 116], [19, 75, 47, 10, 76, 48], [15, 54, 24, 25, 55, 25], [23, 45, 15, 25, 46, 16], [13, 145, 115, 3, 146, 116], [2, 74, 46, 29, 75, 47], [42, 54, 24, 1, 55, 25], [23, 45, 15, 28, 46, 16], [17, 145, 115], [10, 74, 46, 23, 75, 47], [10, 54, 24, 35, 55, 25], [19, 45, 15, 35, 46, 16], [17, 145, 115, 1, 146, 116], [14, 74, 46, 21, 75, 47], [29, 54, 24, 19, 55, 25], [11, 45, 15, 46, 46, 16], [13, 145, 115, 6, 146, 116], [14, 74, 46, 23, 75, 47], [44, 54, 24, 7, 55, 25], [59, 46, 16, 1, 47, 17], [12, 151, 121, 7, 152, 122], [12, 75, 47, 26, 76, 48], [39, 54, 24, 14, 55, 25], [22, 45, 15, 41, 46, 16], [6, 151, 121, 14, 152, 122], [6, 75, 47, 34, 76, 48], [46, 54, 24, 10, 55, 25], [2, 45, 15, 64, 46, 16], [17, 152, 122, 4, 153, 123], [29, 74, 46, 14, 75, 47], [49, 54, 24, 10, 55, 25], [24, 45, 15, 46, 46, 16], [4, 152, 122, 18, 153, 123], [13, 74, 46, 32, 75, 47], [48, 54, 24, 14, 55, 25], [42, 45, 15, 32, 46, 16], [20, 147, 117, 4, 148, 118], [40, 75, 47, 7, 76, 48], [43, 54, 24, 22, 55, 25], [10, 45, 15, 67, 46, 16], [19, 148, 118, 6, 149, 119], [18, 75, 47, 31, 76, 48], [34, 54, 24, 34, 55, 25], [20, 45, 15, 61, 46, 16]],
            QRRSBlock.getRSBlocks = function(typeNumber, errorCorrectLevel) {
                var rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel);
                if (void 0 == rsBlock) throw new Error("bad rs block @ typeNumber:" + typeNumber + "/errorCorrectLevel:" + errorCorrectLevel);
                for (var length = rsBlock.length / 3,
                         list = [], i = 0; length > i; i++) for (var count = rsBlock[3 * i + 0], totalCount = rsBlock[3 * i + 1], dataCount = rsBlock[3 * i + 2], j = 0; count > j; j++) list.push(new QRRSBlock(totalCount, dataCount));
                return list
            },
            QRRSBlock.getRsBlockTable = function(typeNumber, errorCorrectLevel) {
                switch (errorCorrectLevel) {
                    case QRErrorCorrectLevel.L:
                        return QRRSBlock.RS_BLOCK_TABLE[4 * (typeNumber - 1) + 0];
                    case QRErrorCorrectLevel.M:
                        return QRRSBlock.RS_BLOCK_TABLE[4 * (typeNumber - 1) + 1];
                    case QRErrorCorrectLevel.Q:
                        return QRRSBlock.RS_BLOCK_TABLE[4 * (typeNumber - 1) + 2];
                    case QRErrorCorrectLevel.H:
                        return QRRSBlock.RS_BLOCK_TABLE[4 * (typeNumber - 1) + 3];
                    default:
                        return void 0
                }
            },
            QRBitBuffer.prototype = {
                get: function(index) {
                    var bufIndex = Math.floor(index / 8);
                    return 1 == (this.buffer[bufIndex] >>> 7 - index % 8 & 1)
                },
                put: function(num, length) {
                    for (var i = 0; length > i; i++) this.putBit(1 == (num >>> length - i - 1 & 1))
                },
                getLengthInBits: function() {
                    return this.length
                },
                putBit: function(bit) {
                    var bufIndex = Math.floor(this.length / 8);
                    this.buffer.length <= bufIndex && this.buffer.push(0),
                    bit && (this.buffer[bufIndex] |= 128 >>> this.length % 8),
                        this.length++
                }
            };
        var QRCodeLimitLength = [[17, 14, 11, 7], [32, 26, 20, 14], [53, 42, 32, 24], [78, 62, 46, 34], [106, 84, 60, 44], [134, 106, 74, 58], [154, 122, 86, 64], [192, 152, 108, 84], [230, 180, 130, 98], [271, 213, 151, 119], [321, 251, 177, 137], [367, 287, 203, 155], [425, 331, 241, 177], [458, 362, 258, 194], [520, 412, 292, 220], [586, 450, 322, 250], [644, 504, 364, 280], [718, 560, 394, 310], [792, 624, 442, 338], [858, 666, 482, 382], [929, 711, 509, 403], [1003, 779, 565, 439], [1091, 857, 611, 461], [1171, 911, 661, 511], [1273, 997, 715, 535], [1367, 1059, 751, 593], [1465, 1125, 805, 625], [1528, 1190, 868, 658], [1628, 1264, 908, 698], [1732, 1370, 982, 742], [1840, 1452, 1030, 790], [1952, 1538, 1112, 842], [2068, 1628, 1168, 898], [2188, 1722, 1228, 958], [2303, 1809, 1283, 983], [2431, 1911, 1351, 1051], [2563, 1989, 1423, 1093], [2699, 2099, 1499, 1139], [2809, 2213, 1579, 1219], [2953, 2331, 1663, 1273]],
            svgDrawer = function() {
                var Drawing = function(el, htOption) {
                    this._el = el,
                        this._htOption = htOption
                };
                return Drawing.prototype.draw = function(oQRCode) {
                    function makeSVG(tag, attrs) {
                        var el = document.createElementNS("http://www.w3.org/2000/svg", tag);
                        for (var k in attrs) attrs.hasOwnProperty(k) && el.setAttribute(k, attrs[k]);
                        return el
                    } {
                        var _htOption = this._htOption,
                            _el = this._el,
                            nCount = oQRCode.getModuleCount();
                        Math.floor(_htOption.width / nCount),
                            Math.floor(_htOption.height / nCount)
                    }
                    this.clear();
                    var svg = makeSVG("svg", {
                        viewBox: "0 0 " + String(nCount) + " " + String(nCount),
                        width: "100%",
                        height: "100%",
                        fill: _htOption.colorLight
                    });
                    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink"),
                        _el.appendChild(svg),
                        svg.appendChild(makeSVG("rect", {
                            fill: _htOption.colorDark,
                            width: "1",
                            height: "1",
                            id: "template"
                        }));
                    for (var row = 0; nCount > row; row++) for (var col = 0; nCount > col; col++) if (oQRCode.isDark(row, col)) {
                        var child = makeSVG("use", {
                            x: String(row),
                            y: String(col)
                        });
                        child.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#template"),
                            svg.appendChild(child)
                    }
                },
                    Drawing.prototype.clear = function() {
                        for (; this._el.hasChildNodes();) this._el.removeChild(this._el.lastChild)
                    },
                    Drawing
            } (),
            useSVG = "svg" === document.documentElement.tagName.toLowerCase(),
            Drawing = useSVG ? svgDrawer: _isSupportCanvas() ?
                function() {
                    function _onMakeImage() {
                        this._elImage.style.display = "" === this._htOption.logoSrc ? "none": "block",
                            this._elImage.style.overflow = "auto",
                            this._elImage.style.margin = "auto",
                            this._elImage.style.position = "absolute",
                            this._elImage.style.top = 0,
                            this._elImage.style.left = 0,
                            this._elImage.style.bottom = 0,
                            this._elImage.style.right = 0
                    }
                    function _safeSetDataURI(fSuccess, fFail) {
                        var self = this;
                        if (self._fFail = fFail, self._fSuccess = fSuccess, null === self._bSupportDataURI) {
                            var el = document.createElement("img"),
                                fOnError = function() {
                                    self._bSupportDataURI = !1,
                                    self._fFail && _fFail.call(self)
                                },
                                fOnSuccess = function() {
                                    self._bSupportDataURI = !0,
                                    self._fSuccess && self._fSuccess.call(self)
                                };
                            return el.onabort = fOnError,
                                el.onerror = fOnError,
                                el.onload = fOnSuccess,
                                void(el.src = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==")
                        }
                        self._bSupportDataURI === !0 && self._fSuccess ? self._fSuccess.call(self) : self._bSupportDataURI === !1 && self._fFail && self._fFail.call(self)
                    }
                    if (this._android && this._android <= 2.1) {
                        var factor = 1 / window.devicePixelRatio,
                            drawImage = CanvasRenderingContext2D.prototype.drawImage;
                        CanvasRenderingContext2D.prototype.drawImage = function(image, sx, sy, sw, sh, dx, dy, dw) {
                            if ("nodeName" in image && /img/i.test(image.nodeName)) for (var i = arguments.length - 1; i >= 1; i--) arguments[i] = arguments[i] * factor;
                            else "undefined" == typeof dw && (arguments[1] *= factor, arguments[2] *= factor, arguments[3] *= factor, arguments[4] *= factor);
                            drawImage.apply(this, arguments)
                        }
                    }
                    var Drawing = function(el, htOption) {
                        this._bIsPainted = !1,
                            this._android = _getAndroid(),
                            this._htOption = htOption,
                            this._elCanvas = document.createElement("canvas"),
                            this._elCanvas.width = htOption.width,
                            this._elCanvas.height = htOption.height,
                            el.appendChild(this._elCanvas),
                            this._el = el,
                            this._oContext = this._elCanvas.getContext("2d"),
                            this._bIsPainted = !1,
                            this._elImage = document.createElement("img"),
                            this._elImage.alt = "Scan me!",
                            this._elImage.style.display = "none",
                            this._el.appendChild(this._elImage),
                            this._bSupportDataURI = null
                    };
                    return Drawing.prototype.draw = function(oQRCode) {
                        var _elImage = this._elImage,
                            _oContext = this._oContext,
                            _htOption = this._htOption,
                            nCount = oQRCode.getModuleCount(),
                            nWidth = _htOption.width / nCount,
                            nHeight = _htOption.height / nCount,
                            nRoundedWidth = Math.round(nWidth),
                            nRoundedHeight = Math.round(nHeight);
                        _elImage.style.display = "none",
                            this.clear();
                        for (var row = 0; nCount > row; row++) for (var col = 0; nCount > col; col++) {
                            var bIsDark = oQRCode.isDark(row, col),
                                nLeft = col * nWidth + this._el.scrollLeft,
                                nTop = row * nHeight + this._el.scrollTop;
                            _oContext.strokeStyle = bIsDark ? _htOption.colorDark: _htOption.colorLight,
                                _oContext.lineWidth = 1,
                                _oContext.fillStyle = bIsDark ? _htOption.colorDark: _htOption.colorLight,
                                _oContext.fillRect(nLeft, nTop, nWidth, nHeight),
                                _oContext.strokeRect(Math.floor(nLeft) + .5, Math.floor(nTop) + .5, nRoundedWidth, nRoundedHeight),
                                _oContext.strokeRect(Math.ceil(nLeft) - .5, Math.ceil(nTop) - .5, nRoundedWidth, nRoundedHeight)
                        }
                        _elImage.src = _htOption.logoSrc,
                            this._bIsPainted = !0
                    },
                        Drawing.prototype.makeImage = function() {
                            this._bIsPainted && _safeSetDataURI.call(this, _onMakeImage)
                        },
                        Drawing.prototype.isPainted = function() {
                            return this._bIsPainted
                        },
                        Drawing.prototype.clear = function() {
                            this._oContext.clearRect(0, 0, this._elCanvas.width, this._elCanvas.height),
                                this._bIsPainted = !1
                        },
                        Drawing.prototype.round = function(nNumber) {
                            return nNumber ? Math.floor(1e3 * nNumber) / 1e3: nNumber
                        },
                        Drawing
                } () : function() {
                    var Drawing = function(el, htOption) {
                        this._el = el,
                            this._htOption = htOption
                    };
                    return Drawing.prototype.draw = function(oQRCode) {
                        for (var _htOption = this._htOption,
                                 _el = this._el,
                                 nCount = oQRCode.getModuleCount(), nWidth = Math.floor(_htOption.width / nCount), nHeight = Math.floor(_htOption.height / nCount), aHTML = ['<table style="border:0;border-collapse:collapse;">'], row = 0; nCount > row; row++) {
                            aHTML.push("<tr>");
                            for (var col = 0; nCount > col; col++) aHTML.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + nWidth + "px;height:" + nHeight + "px;background-color:" + (oQRCode.isDark(row, col) ? _htOption.colorDark: _htOption.colorLight) + ';"></td>');
                            aHTML.push("</tr>")
                        }
                        aHTML.push("</table>"),
                            _el.innerHTML = aHTML.join("");
                        var elTable = _el.childNodes[0],
                            nLeftMarginTable = (_htOption.width - elTable.offsetWidth) / 2,
                            nTopMarginTable = (_htOption.height - elTable.offsetHeight) / 2;
                        nLeftMarginTable > 0 && nTopMarginTable > 0 && (elTable.style.margin = nTopMarginTable + "px " + nLeftMarginTable + "px")
                    },
                        Drawing.prototype.clear = function() {
                            this._el.innerHTML = ""
                        },
                        Drawing
                } ();
        QRCode = function(el, vOption) {
            if (this._htOption = {
                    width: 256,
                    height: 256,
                    typeNumber: 4,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRErrorCorrectLevel.H,
                    logoSrc: ""
                },
                "string" == typeof vOption && (vOption = {
                    text: vOption
                }), vOption) for (var i in vOption) this._htOption[i] = vOption[i];
            "string" == typeof el && (el = document.getElementById(el)),
                this._android = _getAndroid(),
                this._el = el,
                this._oQRCode = null,
                this._oDrawing = new Drawing(this._el, this._htOption),
            this._htOption.text && this.makeCode(this._htOption.text)
        },
            QRCode.prototype.makeCode = function(sText) {
                this._oQRCode = new QRCodeModel(_getTypeNumber(sText, this._htOption.correctLevel), this._htOption.correctLevel),
                    this._oQRCode.addData(sText),
                    this._oQRCode.make(),
                    this._el.title = sText,
                    this._oDrawing.draw(this._oQRCode),
                    this.makeImage()
            },
            QRCode.prototype.makeImage = function() {
                "function" == typeof this._oDrawing.makeImage && (!this._android || this._android >= 3) && this._oDrawing.makeImage()
            },
            QRCode.prototype.clear = function() {
                this._oDrawing.clear(),
                    this._oDrawing._elImage.style.display = "none"
            },
            QRCode.prototype.changeLevel = function(ecLevel) {
                ecLevel > 0 && 4 > ecLevel && (this._htOption.correctLevel = ecLevel)
            },
            QRCode.CorrectLevel = QRErrorCorrectLevel
    } ();var QRCode; !
    function() {
        function QR8bitByte(data) {
            this.mode = QRMode.MODE_8BIT_BYTE,
                this.data = data,
                this.parsedData = [];
            for (var i = 0,
                     l = this.data.length; l > i; i++) {
                var byteArray = [],
                    code = this.data.charCodeAt(i);
                code > 65536 ? (byteArray[0] = 240 | (1835008 & code) >>> 18, byteArray[1] = 128 | (258048 & code) >>> 12, byteArray[2] = 128 | (4032 & code) >>> 6, byteArray[3] = 128 | 63 & code) : code > 2048 ? (byteArray[0] = 224 | (61440 & code) >>> 12, byteArray[1] = 128 | (4032 & code) >>> 6, byteArray[2] = 128 | 63 & code) : code > 128 ? (byteArray[0] = 192 | (1984 & code) >>> 6, byteArray[1] = 128 | 63 & code) : byteArray[0] = code,
                    this.parsedData.push(byteArray)
            }
            this.parsedData = Array.prototype.concat.apply([], this.parsedData),
            this.parsedData.length != this.data.length && (this.parsedData.unshift(191), this.parsedData.unshift(187), this.parsedData.unshift(239))
        }
        function QRCodeModel(typeNumber, errorCorrectLevel) {
            this.typeNumber = typeNumber,
                this.errorCorrectLevel = errorCorrectLevel,
                this.modules = null,
                this.moduleCount = 0,
                this.dataCache = null,
                this.dataList = []
        }
        function QRPolynomial(num, shift) {
            if (void 0 == num.length) throw new Error(num.length + "/" + shift);
            for (var offset = 0; offset < num.length && 0 == num[offset];) offset++;
            this.num = new Array(num.length - offset + shift);
            for (var i = 0; i < num.length - offset; i++) this.num[i] = num[i + offset]
        }
        function QRRSBlock(totalCount, dataCount) {
            this.totalCount = totalCount,
                this.dataCount = dataCount
        }
        function QRBitBuffer() {
            this.buffer = [],
                this.length = 0
        }
        function _isSupportCanvas() {
            return "undefined" != typeof CanvasRenderingContext2D
        }
        function _getAndroid() {
            var android = !1,
                sAgent = navigator.userAgent;
            return /android/i.test(sAgent) && (android = !0, aMat = sAgent.toString().match(/android ([0-9]\.[0-9])/i), aMat && aMat[1] && (android = parseFloat(aMat[1]))),
                android
        }
        function _getTypeNumber(sText, nCorrectLevel) {
            for (var nType = 1,
                     length = _getUTF8Length(sText), i = 0, len = QRCodeLimitLength.length; len >= i; i++) {
                var nLimit = 0;
                switch (nCorrectLevel) {
                    case QRErrorCorrectLevel.L:
                        nLimit = QRCodeLimitLength[i][0];
                        break;
                    case QRErrorCorrectLevel.M:
                        nLimit = QRCodeLimitLength[i][1];
                        break;
                    case QRErrorCorrectLevel.Q:
                        nLimit = QRCodeLimitLength[i][2];
                        break;
                    case QRErrorCorrectLevel.H:
                        nLimit = QRCodeLimitLength[i][3]
                }
                if (nLimit >= length) break;
                nType++
            }
            if (nType > QRCodeLimitLength.length) throw new Error("Too long data");
            return nType
        }
        function _getUTF8Length(sText) {
            var replacedText = encodeURI(sText).toString().replace(/\%[0-9a-fA-F]{2}/g, "a");
            return replacedText.length + (replacedText.length != sText ? 3 : 0)
        }
        QR8bitByte.prototype = {
            getLength: function() {
                return this.parsedData.length
            },
            write: function(buffer) {
                for (var i = 0,
                         l = this.parsedData.length; l > i; i++) buffer.put(this.parsedData[i], 8)
            }
        },
            QRCodeModel.prototype = {
                addData: function(data) {
                    var newData = new QR8bitByte(data);
                    this.dataList.push(newData),
                        this.dataCache = null
                },
                isDark: function(row, col) {
                    if (0 > row || this.moduleCount <= row || 0 > col || this.moduleCount <= col) throw new Error(row + "," + col);
                    return this.modules[row][col]
                },
                getModuleCount: function() {
                    return this.moduleCount
                },
                make: function() {
                    this.makeImpl(!1, this.getBestMaskPattern())
                },
                makeImpl: function(test, maskPattern) {
                    this.moduleCount = 4 * this.typeNumber + 17,
                        this.modules = new Array(this.moduleCount);
                    for (var row = 0; row < this.moduleCount; row++) {
                        this.modules[row] = new Array(this.moduleCount);
                        for (var col = 0; col < this.moduleCount; col++) this.modules[row][col] = null
                    }
                    this.setupPositionProbePattern(0, 0),
                        this.setupPositionProbePattern(this.moduleCount - 7, 0),
                        this.setupPositionProbePattern(0, this.moduleCount - 7),
                        this.setupPositionAdjustPattern(),
                        this.setupTimingPattern(),
                        this.setupTypeInfo(test, maskPattern),
                    this.typeNumber >= 7 && this.setupTypeNumber(test),
                    null == this.dataCache && (this.dataCache = QRCodeModel.createData(this.typeNumber, this.errorCorrectLevel, this.dataList)),
                        this.mapData(this.dataCache, maskPattern)
                },
                setupPositionProbePattern: function(row, col) {
                    for (var r = -1; 7 >= r; r++) if (! ( - 1 >= row + r || this.moduleCount <= row + r)) for (var c = -1; 7 >= c; c++) - 1 >= col + c || this.moduleCount <= col + c || (this.modules[row + r][col + c] = r >= 0 && 6 >= r && (0 == c || 6 == c) || c >= 0 && 6 >= c && (0 == r || 6 == r) || r >= 2 && 4 >= r && c >= 2 && 4 >= c ? !0 : !1)
                },
                getBestMaskPattern: function() {
                    for (var minLostPoint = 0,
                             pattern = 0,
                             i = 0; 8 > i; i++) {
                        this.makeImpl(!0, i);
                        var lostPoint = QRUtil.getLostPoint(this); (0 == i || minLostPoint > lostPoint) && (minLostPoint = lostPoint, pattern = i)
                    }
                    return pattern
                },
                createMovieClip: function(target_mc, instance_name, depth) {
                    var qr_mc = target_mc.createEmptyMovieClip(instance_name, depth),
                        cs = 1;
                    this.make();
                    for (var row = 0; row < this.modules.length; row++) for (var y = row * cs,
                                                                                 col = 0; col < this.modules[row].length; col++) {
                        var x = col * cs,
                            dark = this.modules[row][col];
                        dark && (qr_mc.beginFill(0, 100), qr_mc.moveTo(x, y), qr_mc.lineTo(x + cs, y), qr_mc.lineTo(x + cs, y + cs), qr_mc.lineTo(x, y + cs), qr_mc.endFill())
                    }
                    return qr_mc
                },
                setupTimingPattern: function() {
                    for (var r = 8; r < this.moduleCount - 8; r++) null == this.modules[r][6] && (this.modules[r][6] = r % 2 == 0);
                    for (var c = 8; c < this.moduleCount - 8; c++) null == this.modules[6][c] && (this.modules[6][c] = c % 2 == 0)
                },
                setupPositionAdjustPattern: function() {
                    for (var pos = QRUtil.getPatternPosition(this.typeNumber), i = 0; i < pos.length; i++) for (var j = 0; j < pos.length; j++) {
                        var row = pos[i],
                            col = pos[j];
                        if (null == this.modules[row][col]) for (var r = -2; 2 >= r; r++) for (var c = -2; 2 >= c; c++) this.modules[row + r][col + c] = -2 == r || 2 == r || -2 == c || 2 == c || 0 == r && 0 == c ? !0 : !1
                    }
                },
                setupTypeNumber: function(test) {
                    for (var bits = QRUtil.getBCHTypeNumber(this.typeNumber), i = 0; 18 > i; i++) {
                        var mod = !test && 1 == (bits >> i & 1);
                        this.modules[Math.floor(i / 3)][i % 3 + this.moduleCount - 8 - 3] = mod
                    }
                    for (var i = 0; 18 > i; i++) {
                        var mod = !test && 1 == (bits >> i & 1);
                        this.modules[i % 3 + this.moduleCount - 8 - 3][Math.floor(i / 3)] = mod
                    }
                },
                setupTypeInfo: function(test, maskPattern) {
                    for (var data = this.errorCorrectLevel << 3 | maskPattern,
                             bits = QRUtil.getBCHTypeInfo(data), i = 0; 15 > i; i++) {
                        var mod = !test && 1 == (bits >> i & 1);
                        6 > i ? this.modules[i][8] = mod: 8 > i ? this.modules[i + 1][8] = mod: this.modules[this.moduleCount - 15 + i][8] = mod
                    }
                    for (var i = 0; 15 > i; i++) {
                        var mod = !test && 1 == (bits >> i & 1);
                        8 > i ? this.modules[8][this.moduleCount - i - 1] = mod: 9 > i ? this.modules[8][15 - i - 1 + 1] = mod: this.modules[8][15 - i - 1] = mod
                    }
                    this.modules[this.moduleCount - 8][8] = !test
                },
                mapData: function(data, maskPattern) {
                    for (var inc = -1,
                             row = this.moduleCount - 1,
                             bitIndex = 7,
                             byteIndex = 0,
                             col = this.moduleCount - 1; col > 0; col -= 2) for (6 == col && col--;;) {
                        for (var c = 0; 2 > c; c++) if (null == this.modules[row][col - c]) {
                            var dark = !1;
                            byteIndex < data.length && (dark = 1 == (data[byteIndex] >>> bitIndex & 1));
                            var mask = QRUtil.getMask(maskPattern, row, col - c);
                            mask && (dark = !dark),
                                this.modules[row][col - c] = dark,
                                bitIndex--,
                            -1 == bitIndex && (byteIndex++, bitIndex = 7)
                        }
                        if (row += inc, 0 > row || this.moduleCount <= row) {
                            row -= inc,
                                inc = -inc;
                            break
                        }
                    }
                }
            },
            QRCodeModel.PAD0 = 236,
            QRCodeModel.PAD1 = 17,
            QRCodeModel.createData = function(typeNumber, errorCorrectLevel, dataList) {
                for (var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectLevel), buffer = new QRBitBuffer, i = 0; i < dataList.length; i++) {
                    var data = dataList[i];
                    buffer.put(data.mode, 4),
                        buffer.put(data.getLength(), QRUtil.getLengthInBits(data.mode, typeNumber)),
                        data.write(buffer)
                }
                for (var totalDataCount = 0,
                         i = 0; i < rsBlocks.length; i++) totalDataCount += rsBlocks[i].dataCount;
                if (buffer.getLengthInBits() > 8 * totalDataCount) throw new Error("code length overflow. (" + buffer.getLengthInBits() + ">" + 8 * totalDataCount + ")");
                for (buffer.getLengthInBits() + 4 <= 8 * totalDataCount && buffer.put(0, 4); buffer.getLengthInBits() % 8 != 0;) buffer.putBit(!1);
                for (;;) {
                    if (buffer.getLengthInBits() >= 8 * totalDataCount) break;
                    if (buffer.put(QRCodeModel.PAD0, 8), buffer.getLengthInBits() >= 8 * totalDataCount) break;
                    buffer.put(QRCodeModel.PAD1, 8)
                }
                return QRCodeModel.createBytes(buffer, rsBlocks)
            },
            QRCodeModel.createBytes = function(buffer, rsBlocks) {
                for (var offset = 0,
                         maxDcCount = 0,
                         maxEcCount = 0,
                         dcdata = new Array(rsBlocks.length), ecdata = new Array(rsBlocks.length), r = 0; r < rsBlocks.length; r++) {
                    var dcCount = rsBlocks[r].dataCount,
                        ecCount = rsBlocks[r].totalCount - dcCount;
                    maxDcCount = Math.max(maxDcCount, dcCount),
                        maxEcCount = Math.max(maxEcCount, ecCount),
                        dcdata[r] = new Array(dcCount);
                    for (var i = 0; i < dcdata[r].length; i++) dcdata[r][i] = 255 & buffer.buffer[i + offset];
                    offset += dcCount;
                    var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount),
                        rawPoly = new QRPolynomial(dcdata[r], rsPoly.getLength() - 1),
                        modPoly = rawPoly.mod(rsPoly);
                    ecdata[r] = new Array(rsPoly.getLength() - 1);
                    for (var i = 0; i < ecdata[r].length; i++) {
                        var modIndex = i + modPoly.getLength() - ecdata[r].length;
                        ecdata[r][i] = modIndex >= 0 ? modPoly.get(modIndex) : 0
                    }
                }
                for (var totalCodeCount = 0,
                         i = 0; i < rsBlocks.length; i++) totalCodeCount += rsBlocks[i].totalCount;
                for (var data = new Array(totalCodeCount), index = 0, i = 0; maxDcCount > i; i++) for (var r = 0; r < rsBlocks.length; r++) i < dcdata[r].length && (data[index++] = dcdata[r][i]);
                for (var i = 0; maxEcCount > i; i++) for (var r = 0; r < rsBlocks.length; r++) i < ecdata[r].length && (data[index++] = ecdata[r][i]);
                return data
            };
        for (var QRMode = {
                MODE_NUMBER: 1,
                MODE_ALPHA_NUM: 2,
                MODE_8BIT_BYTE: 4,
                MODE_KANJI: 8
            },
                 QRErrorCorrectLevel = {
                     L: 1,
                     M: 0,
                     Q: 3,
                     H: 2
                 },
                 QRMaskPattern = {
                     PATTERN000: 0,
                     PATTERN001: 1,
                     PATTERN010: 2,
                     PATTERN011: 3,
                     PATTERN100: 4,
                     PATTERN101: 5,
                     PATTERN110: 6,
                     PATTERN111: 7
                 },
                 QRUtil = {
                     PATTERN_POSITION_TABLE: [[], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50], [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90], [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118], [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134], [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146], [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158], [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]],
                     G15: 1335,
                     G18: 7973,
                     G15_MASK: 21522,
                     getBCHTypeInfo: function(data) {
                         for (var d = data << 10; QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0;) d ^= QRUtil.G15 << QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15);
                         return (data << 10 | d) ^ QRUtil.G15_MASK
                     },
                     getBCHTypeNumber: function(data) {
                         for (var d = data << 12; QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18) >= 0;) d ^= QRUtil.G18 << QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G18);
                         return data << 12 | d
                     },
                     getBCHDigit: function(data) {
                         for (var digit = 0; 0 != data;) digit++,
                             data >>>= 1;
                         return digit
                     },
                     getPatternPosition: function(typeNumber) {
                         return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1]
                     },
                     getMask: function(maskPattern, i, j) {
                         switch (maskPattern) {
                             case QRMaskPattern.PATTERN000:
                                 return (i + j) % 2 == 0;
                             case QRMaskPattern.PATTERN001:
                                 return i % 2 == 0;
                             case QRMaskPattern.PATTERN010:
                                 return j % 3 == 0;
                             case QRMaskPattern.PATTERN011:
                                 return (i + j) % 3 == 0;
                             case QRMaskPattern.PATTERN100:
                                 return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 == 0;
                             case QRMaskPattern.PATTERN101:
                                 return i * j % 2 + i * j % 3 == 0;
                             case QRMaskPattern.PATTERN110:
                                 return (i * j % 2 + i * j % 3) % 2 == 0;
                             case QRMaskPattern.PATTERN111:
                                 return (i * j % 3 + (i + j) % 2) % 2 == 0;
                             default:
                                 throw new Error("bad maskPattern:" + maskPattern)
                         }
                     },
                     getErrorCorrectPolynomial: function(errorCorrectLength) {
                         for (var a = new QRPolynomial([1], 0), i = 0; errorCorrectLength > i; i++) a = a.multiply(new QRPolynomial([1, QRMath.gexp(i)], 0));
                         return a
                     },
                     getLengthInBits: function(mode, type) {
                         if (type >= 1 && 10 > type) switch (mode) {
                             case QRMode.MODE_NUMBER:
                                 return 10;
                             case QRMode.MODE_ALPHA_NUM:
                                 return 9;
                             case QRMode.MODE_8BIT_BYTE:
                                 return 8;
                             case QRMode.MODE_KANJI:
                                 return 8;
                             default:
                                 throw new Error("mode:" + mode)
                         } else if (27 > type) switch (mode) {
                             case QRMode.MODE_NUMBER:
                                 return 12;
                             case QRMode.MODE_ALPHA_NUM:
                                 return 11;
                             case QRMode.MODE_8BIT_BYTE:
                                 return 16;
                             case QRMode.MODE_KANJI:
                                 return 10;
                             default:
                                 throw new Error("mode:" + mode)
                         } else {
                             if (! (41 > type)) throw new Error("type:" + type);
                             switch (mode) {
                                 case QRMode.MODE_NUMBER:
                                     return 14;
                                 case QRMode.MODE_ALPHA_NUM:
                                     return 13;
                                 case QRMode.MODE_8BIT_BYTE:
                                     return 16;
                                 case QRMode.MODE_KANJI:
                                     return 12;
                                 default:
                                     throw new Error("mode:" + mode)
                             }
                         }
                     },
                     getLostPoint: function(qrCode) {
                         for (var moduleCount = qrCode.getModuleCount(), lostPoint = 0, row = 0; moduleCount > row; row++) for (var col = 0; moduleCount > col; col++) {
                             for (var sameCount = 0,
                                      dark = qrCode.isDark(row, col), r = -1; 1 >= r; r++) if (! (0 > row + r || row + r >= moduleCount)) for (var c = -1; 1 >= c; c++) 0 > col + c || col + c >= moduleCount || (0 != r || 0 != c) && dark == qrCode.isDark(row + r, col + c) && sameCount++;
                             sameCount > 5 && (lostPoint += 3 + sameCount - 5)
                         }
                         for (var row = 0; moduleCount - 1 > row; row++) for (var col = 0; moduleCount - 1 > col; col++) {
                             var count = 0;
                             qrCode.isDark(row, col) && count++,
                             qrCode.isDark(row + 1, col) && count++,
                             qrCode.isDark(row, col + 1) && count++,
                             qrCode.isDark(row + 1, col + 1) && count++,
                             (0 == count || 4 == count) && (lostPoint += 3)
                         }
                         for (var row = 0; moduleCount > row; row++) for (var col = 0; moduleCount - 6 > col; col++) qrCode.isDark(row, col) && !qrCode.isDark(row, col + 1) && qrCode.isDark(row, col + 2) && qrCode.isDark(row, col + 3) && qrCode.isDark(row, col + 4) && !qrCode.isDark(row, col + 5) && qrCode.isDark(row, col + 6) && (lostPoint += 40);
                         for (var col = 0; moduleCount > col; col++) for (var row = 0; moduleCount - 6 > row; row++) qrCode.isDark(row, col) && !qrCode.isDark(row + 1, col) && qrCode.isDark(row + 2, col) && qrCode.isDark(row + 3, col) && qrCode.isDark(row + 4, col) && !qrCode.isDark(row + 5, col) && qrCode.isDark(row + 6, col) && (lostPoint += 40);
                         for (var darkCount = 0,
                                  col = 0; moduleCount > col; col++) for (var row = 0; moduleCount > row; row++) qrCode.isDark(row, col) && darkCount++;
                         var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
                         return lostPoint += 10 * ratio
                     }
                 },
                 QRMath = {
                     glog: function(n) {
                         if (1 > n) throw new Error("glog(" + n + ")");
                         return QRMath.LOG_TABLE[n]
                     },
                     gexp: function(n) {
                         for (; 0 > n;) n += 255;
                         for (; n >= 256;) n -= 255;
                         return QRMath.EXP_TABLE[n]
                     },
                     EXP_TABLE: new Array(256),
                     LOG_TABLE: new Array(256)
                 },
                 i = 0; 8 > i; i++) QRMath.EXP_TABLE[i] = 1 << i;
        for (var i = 8; 256 > i; i++) QRMath.EXP_TABLE[i] = QRMath.EXP_TABLE[i - 4] ^ QRMath.EXP_TABLE[i - 5] ^ QRMath.EXP_TABLE[i - 6] ^ QRMath.EXP_TABLE[i - 8];
        for (var i = 0; 255 > i; i++) QRMath.LOG_TABLE[QRMath.EXP_TABLE[i]] = i;
        QRPolynomial.prototype = {
            get: function(index) {
                return this.num[index]
            },
            getLength: function() {
                return this.num.length
            },
            multiply: function(e) {
                for (var num = new Array(this.getLength() + e.getLength() - 1), i = 0; i < this.getLength(); i++) for (var j = 0; j < e.getLength(); j++) num[i + j] ^= QRMath.gexp(QRMath.glog(this.get(i)) + QRMath.glog(e.get(j)));
                return new QRPolynomial(num, 0)
            },
            mod: function(e) {
                if (this.getLength() - e.getLength() < 0) return this;
                for (var ratio = QRMath.glog(this.get(0)) - QRMath.glog(e.get(0)), num = new Array(this.getLength()), i = 0; i < this.getLength(); i++) num[i] = this.get(i);
                for (var i = 0; i < e.getLength(); i++) num[i] ^= QRMath.gexp(QRMath.glog(e.get(i)) + ratio);
                return new QRPolynomial(num, 0).mod(e)
            }
        },
            QRRSBlock.RS_BLOCK_TABLE = [[1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9], [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16], [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13], [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9], [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12], [2, 86, 68], [4, 43, 27], [4, 43, 19], [4, 43, 15], [2, 98, 78], [4, 49, 31], [2, 32, 14, 4, 33, 15], [4, 39, 13, 1, 40, 14], [2, 121, 97], [2, 60, 38, 2, 61, 39], [4, 40, 18, 2, 41, 19], [4, 40, 14, 2, 41, 15], [2, 146, 116], [3, 58, 36, 2, 59, 37], [4, 36, 16, 4, 37, 17], [4, 36, 12, 4, 37, 13], [2, 86, 68, 2, 87, 69], [4, 69, 43, 1, 70, 44], [6, 43, 19, 2, 44, 20], [6, 43, 15, 2, 44, 16], [4, 101, 81], [1, 80, 50, 4, 81, 51], [4, 50, 22, 4, 51, 23], [3, 36, 12, 8, 37, 13], [2, 116, 92, 2, 117, 93], [6, 58, 36, 2, 59, 37], [4, 46, 20, 6, 47, 21], [7, 42, 14, 4, 43, 15], [4, 133, 107], [8, 59, 37, 1, 60, 38], [8, 44, 20, 4, 45, 21], [12, 33, 11, 4, 34, 12], [3, 145, 115, 1, 146, 116], [4, 64, 40, 5, 65, 41], [11, 36, 16, 5, 37, 17], [11, 36, 12, 5, 37, 13], [5, 109, 87, 1, 110, 88], [5, 65, 41, 5, 66, 42], [5, 54, 24, 7, 55, 25], [11, 36, 12], [5, 122, 98, 1, 123, 99], [7, 73, 45, 3, 74, 46], [15, 43, 19, 2, 44, 20], [3, 45, 15, 13, 46, 16], [1, 135, 107, 5, 136, 108], [10, 74, 46, 1, 75, 47], [1, 50, 22, 15, 51, 23], [2, 42, 14, 17, 43, 15], [5, 150, 120, 1, 151, 121], [9, 69, 43, 4, 70, 44], [17, 50, 22, 1, 51, 23], [2, 42, 14, 19, 43, 15], [3, 141, 113, 4, 142, 114], [3, 70, 44, 11, 71, 45], [17, 47, 21, 4, 48, 22], [9, 39, 13, 16, 40, 14], [3, 135, 107, 5, 136, 108], [3, 67, 41, 13, 68, 42], [15, 54, 24, 5, 55, 25], [15, 43, 15, 10, 44, 16], [4, 144, 116, 4, 145, 117], [17, 68, 42], [17, 50, 22, 6, 51, 23], [19, 46, 16, 6, 47, 17], [2, 139, 111, 7, 140, 112], [17, 74, 46], [7, 54, 24, 16, 55, 25], [34, 37, 13], [4, 151, 121, 5, 152, 122], [4, 75, 47, 14, 76, 48], [11, 54, 24, 14, 55, 25], [16, 45, 15, 14, 46, 16], [6, 147, 117, 4, 148, 118], [6, 73, 45, 14, 74, 46], [11, 54, 24, 16, 55, 25], [30, 46, 16, 2, 47, 17], [8, 132, 106, 4, 133, 107], [8, 75, 47, 13, 76, 48], [7, 54, 24, 22, 55, 25], [22, 45, 15, 13, 46, 16], [10, 142, 114, 2, 143, 115], [19, 74, 46, 4, 75, 47], [28, 50, 22, 6, 51, 23], [33, 46, 16, 4, 47, 17], [8, 152, 122, 4, 153, 123], [22, 73, 45, 3, 74, 46], [8, 53, 23, 26, 54, 24], [12, 45, 15, 28, 46, 16], [3, 147, 117, 10, 148, 118], [3, 73, 45, 23, 74, 46], [4, 54, 24, 31, 55, 25], [11, 45, 15, 31, 46, 16], [7, 146, 116, 7, 147, 117], [21, 73, 45, 7, 74, 46], [1, 53, 23, 37, 54, 24], [19, 45, 15, 26, 46, 16], [5, 145, 115, 10, 146, 116], [19, 75, 47, 10, 76, 48], [15, 54, 24, 25, 55, 25], [23, 45, 15, 25, 46, 16], [13, 145, 115, 3, 146, 116], [2, 74, 46, 29, 75, 47], [42, 54, 24, 1, 55, 25], [23, 45, 15, 28, 46, 16], [17, 145, 115], [10, 74, 46, 23, 75, 47], [10, 54, 24, 35, 55, 25], [19, 45, 15, 35, 46, 16], [17, 145, 115, 1, 146, 116], [14, 74, 46, 21, 75, 47], [29, 54, 24, 19, 55, 25], [11, 45, 15, 46, 46, 16], [13, 145, 115, 6, 146, 116], [14, 74, 46, 23, 75, 47], [44, 54, 24, 7, 55, 25], [59, 46, 16, 1, 47, 17], [12, 151, 121, 7, 152, 122], [12, 75, 47, 26, 76, 48], [39, 54, 24, 14, 55, 25], [22, 45, 15, 41, 46, 16], [6, 151, 121, 14, 152, 122], [6, 75, 47, 34, 76, 48], [46, 54, 24, 10, 55, 25], [2, 45, 15, 64, 46, 16], [17, 152, 122, 4, 153, 123], [29, 74, 46, 14, 75, 47], [49, 54, 24, 10, 55, 25], [24, 45, 15, 46, 46, 16], [4, 152, 122, 18, 153, 123], [13, 74, 46, 32, 75, 47], [48, 54, 24, 14, 55, 25], [42, 45, 15, 32, 46, 16], [20, 147, 117, 4, 148, 118], [40, 75, 47, 7, 76, 48], [43, 54, 24, 22, 55, 25], [10, 45, 15, 67, 46, 16], [19, 148, 118, 6, 149, 119], [18, 75, 47, 31, 76, 48], [34, 54, 24, 34, 55, 25], [20, 45, 15, 61, 46, 16]],
            QRRSBlock.getRSBlocks = function(typeNumber, errorCorrectLevel) {
                var rsBlock = QRRSBlock.getRsBlockTable(typeNumber, errorCorrectLevel);
                if (void 0 == rsBlock) throw new Error("bad rs block @ typeNumber:" + typeNumber + "/errorCorrectLevel:" + errorCorrectLevel);
                for (var length = rsBlock.length / 3,
                         list = [], i = 0; length > i; i++) for (var count = rsBlock[3 * i + 0], totalCount = rsBlock[3 * i + 1], dataCount = rsBlock[3 * i + 2], j = 0; count > j; j++) list.push(new QRRSBlock(totalCount, dataCount));
                return list
            },
            QRRSBlock.getRsBlockTable = function(typeNumber, errorCorrectLevel) {
                switch (errorCorrectLevel) {
                    case QRErrorCorrectLevel.L:
                        return QRRSBlock.RS_BLOCK_TABLE[4 * (typeNumber - 1) + 0];
                    case QRErrorCorrectLevel.M:
                        return QRRSBlock.RS_BLOCK_TABLE[4 * (typeNumber - 1) + 1];
                    case QRErrorCorrectLevel.Q:
                        return QRRSBlock.RS_BLOCK_TABLE[4 * (typeNumber - 1) + 2];
                    case QRErrorCorrectLevel.H:
                        return QRRSBlock.RS_BLOCK_TABLE[4 * (typeNumber - 1) + 3];
                    default:
                        return void 0
                }
            },
            QRBitBuffer.prototype = {
                get: function(index) {
                    var bufIndex = Math.floor(index / 8);
                    return 1 == (this.buffer[bufIndex] >>> 7 - index % 8 & 1)
                },
                put: function(num, length) {
                    for (var i = 0; length > i; i++) this.putBit(1 == (num >>> length - i - 1 & 1))
                },
                getLengthInBits: function() {
                    return this.length
                },
                putBit: function(bit) {
                    var bufIndex = Math.floor(this.length / 8);
                    this.buffer.length <= bufIndex && this.buffer.push(0),
                    bit && (this.buffer[bufIndex] |= 128 >>> this.length % 8),
                        this.length++
                }
            };
        var QRCodeLimitLength = [[17, 14, 11, 7], [32, 26, 20, 14], [53, 42, 32, 24], [78, 62, 46, 34], [106, 84, 60, 44], [134, 106, 74, 58], [154, 122, 86, 64], [192, 152, 108, 84], [230, 180, 130, 98], [271, 213, 151, 119], [321, 251, 177, 137], [367, 287, 203, 155], [425, 331, 241, 177], [458, 362, 258, 194], [520, 412, 292, 220], [586, 450, 322, 250], [644, 504, 364, 280], [718, 560, 394, 310], [792, 624, 442, 338], [858, 666, 482, 382], [929, 711, 509, 403], [1003, 779, 565, 439], [1091, 857, 611, 461], [1171, 911, 661, 511], [1273, 997, 715, 535], [1367, 1059, 751, 593], [1465, 1125, 805, 625], [1528, 1190, 868, 658], [1628, 1264, 908, 698], [1732, 1370, 982, 742], [1840, 1452, 1030, 790], [1952, 1538, 1112, 842], [2068, 1628, 1168, 898], [2188, 1722, 1228, 958], [2303, 1809, 1283, 983], [2431, 1911, 1351, 1051], [2563, 1989, 1423, 1093], [2699, 2099, 1499, 1139], [2809, 2213, 1579, 1219], [2953, 2331, 1663, 1273]],
            svgDrawer = function() {
                var Drawing = function(el, htOption) {
                    this._el = el,
                        this._htOption = htOption
                };
                return Drawing.prototype.draw = function(oQRCode) {
                    function makeSVG(tag, attrs) {
                        var el = document.createElementNS("http://www.w3.org/2000/svg", tag);
                        for (var k in attrs) attrs.hasOwnProperty(k) && el.setAttribute(k, attrs[k]);
                        return el
                    } {
                        var _htOption = this._htOption,
                            _el = this._el,
                            nCount = oQRCode.getModuleCount();
                        Math.floor(_htOption.width / nCount),
                            Math.floor(_htOption.height / nCount)
                    }
                    this.clear();
                    var svg = makeSVG("svg", {
                        viewBox: "0 0 " + String(nCount) + " " + String(nCount),
                        width: "100%",
                        height: "100%",
                        fill: _htOption.colorLight
                    });
                    svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink"),
                        _el.appendChild(svg),
                        svg.appendChild(makeSVG("rect", {
                            fill: _htOption.colorDark,
                            width: "1",
                            height: "1",
                            id: "template"
                        }));
                    for (var row = 0; nCount > row; row++) for (var col = 0; nCount > col; col++) if (oQRCode.isDark(row, col)) {
                        var child = makeSVG("use", {
                            x: String(row),
                            y: String(col)
                        });
                        child.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#template"),
                            svg.appendChild(child)
                    }
                },
                    Drawing.prototype.clear = function() {
                        for (; this._el.hasChildNodes();) this._el.removeChild(this._el.lastChild)
                    },
                    Drawing
            } (),
            useSVG = "svg" === document.documentElement.tagName.toLowerCase(),
            Drawing = useSVG ? svgDrawer: _isSupportCanvas() ?
                function() {
                    function _onMakeImage() {
                        this._elImage.style.display = "" === this._htOption.logoSrc ? "none": "block",
                            this._elImage.style.overflow = "auto",
                            this._elImage.style.margin = "auto",
                            this._elImage.style.position = "absolute",
                            this._elImage.style.top = 0,
                            this._elImage.style.left = 0,
                            this._elImage.style.bottom = 0,
                            this._elImage.style.right = 0
                    }
                    function _safeSetDataURI(fSuccess, fFail) {
                        var self = this;
                        if (self._fFail = fFail, self._fSuccess = fSuccess, null === self._bSupportDataURI) {
                            var el = document.createElement("img"),
                                fOnError = function() {
                                    self._bSupportDataURI = !1,
                                    self._fFail && _fFail.call(self)
                                },
                                fOnSuccess = function() {
                                    self._bSupportDataURI = !0,
                                    self._fSuccess && self._fSuccess.call(self)
                                };
                            return el.onabort = fOnError,
                                el.onerror = fOnError,
                                el.onload = fOnSuccess,
                                void(el.src = "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==")
                        }
                        self._bSupportDataURI === !0 && self._fSuccess ? self._fSuccess.call(self) : self._bSupportDataURI === !1 && self._fFail && self._fFail.call(self)
                    }
                    if (this._android && this._android <= 2.1) {
                        var factor = 1 / window.devicePixelRatio,
                            drawImage = CanvasRenderingContext2D.prototype.drawImage;
                        CanvasRenderingContext2D.prototype.drawImage = function(image, sx, sy, sw, sh, dx, dy, dw) {
                            if ("nodeName" in image && /img/i.test(image.nodeName)) for (var i = arguments.length - 1; i >= 1; i--) arguments[i] = arguments[i] * factor;
                            else "undefined" == typeof dw && (arguments[1] *= factor, arguments[2] *= factor, arguments[3] *= factor, arguments[4] *= factor);
                            drawImage.apply(this, arguments)
                        }
                    }
                    var Drawing = function(el, htOption) {
                        this._bIsPainted = !1,
                            this._android = _getAndroid(),
                            this._htOption = htOption,
                            this._elCanvas = document.createElement("canvas"),
                            this._elCanvas.width = htOption.width,
                            this._elCanvas.height = htOption.height,
                            el.appendChild(this._elCanvas),
                            this._el = el,
                            this._oContext = this._elCanvas.getContext("2d"),
                            this._bIsPainted = !1,
                            this._elImage = document.createElement("img"),
                            this._elImage.alt = "Scan me!",
                            this._elImage.style.display = "none",
                            this._el.appendChild(this._elImage),
                            this._bSupportDataURI = null
                    };
                    return Drawing.prototype.draw = function(oQRCode) {
                        var _elImage = this._elImage,
                            _oContext = this._oContext,
                            _htOption = this._htOption,
                            nCount = oQRCode.getModuleCount(),
                            nWidth = _htOption.width / nCount,
                            nHeight = _htOption.height / nCount,
                            nRoundedWidth = Math.round(nWidth),
                            nRoundedHeight = Math.round(nHeight);
                        _elImage.style.display = "none",
                            this.clear();
                        for (var row = 0; nCount > row; row++) for (var col = 0; nCount > col; col++) {
                            var bIsDark = oQRCode.isDark(row, col),
                                nLeft = col * nWidth + this._el.scrollLeft,
                                nTop = row * nHeight + this._el.scrollTop;
                            _oContext.strokeStyle = bIsDark ? _htOption.colorDark: _htOption.colorLight,
                                _oContext.lineWidth = 1,
                                _oContext.fillStyle = bIsDark ? _htOption.colorDark: _htOption.colorLight,
                                _oContext.fillRect(nLeft, nTop, nWidth, nHeight),
                                _oContext.strokeRect(Math.floor(nLeft) + .5, Math.floor(nTop) + .5, nRoundedWidth, nRoundedHeight),
                                _oContext.strokeRect(Math.ceil(nLeft) - .5, Math.ceil(nTop) - .5, nRoundedWidth, nRoundedHeight)
                        }
                        _elImage.src = _htOption.logoSrc,
                            this._bIsPainted = !0
                    },
                        Drawing.prototype.makeImage = function() {
                            this._bIsPainted && _safeSetDataURI.call(this, _onMakeImage)
                        },
                        Drawing.prototype.isPainted = function() {
                            return this._bIsPainted
                        },
                        Drawing.prototype.clear = function() {
                            this._oContext.clearRect(0, 0, this._elCanvas.width, this._elCanvas.height),
                                this._bIsPainted = !1
                        },
                        Drawing.prototype.round = function(nNumber) {
                            return nNumber ? Math.floor(1e3 * nNumber) / 1e3: nNumber
                        },
                        Drawing
                } () : function() {
                    var Drawing = function(el, htOption) {
                        this._el = el,
                            this._htOption = htOption
                    };
                    return Drawing.prototype.draw = function(oQRCode) {
                        for (var _htOption = this._htOption,
                                 _el = this._el,
                                 nCount = oQRCode.getModuleCount(), nWidth = Math.floor(_htOption.width / nCount), nHeight = Math.floor(_htOption.height / nCount), aHTML = ['<table style="border:0;border-collapse:collapse;">'], row = 0; nCount > row; row++) {
                            aHTML.push("<tr>");
                            for (var col = 0; nCount > col; col++) aHTML.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:' + nWidth + "px;height:" + nHeight + "px;background-color:" + (oQRCode.isDark(row, col) ? _htOption.colorDark: _htOption.colorLight) + ';"></td>');
                            aHTML.push("</tr>")
                        }
                        aHTML.push("</table>"),
                            _el.innerHTML = aHTML.join("");
                        var elTable = _el.childNodes[0],
                            nLeftMarginTable = (_htOption.width - elTable.offsetWidth) / 2,
                            nTopMarginTable = (_htOption.height - elTable.offsetHeight) / 2;
                        nLeftMarginTable > 0 && nTopMarginTable > 0 && (elTable.style.margin = nTopMarginTable + "px " + nLeftMarginTable + "px")
                    },
                        Drawing.prototype.clear = function() {
                            this._el.innerHTML = ""
                        },
                        Drawing
                } ();
        QRCode = function(el, vOption) {
            if (this._htOption = {
                    width: 256,
                    height: 256,
                    typeNumber: 4,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRErrorCorrectLevel.H,
                    logoSrc: ""
                },
                "string" == typeof vOption && (vOption = {
                    text: vOption
                }), vOption) for (var i in vOption) this._htOption[i] = vOption[i];
            "string" == typeof el && (el = document.getElementById(el)),
                this._android = _getAndroid(),
                this._el = el,
                this._oQRCode = null,
                this._oDrawing = new Drawing(this._el, this._htOption),
            this._htOption.text && this.makeCode(this._htOption.text)
        },
            QRCode.prototype.makeCode = function(sText) {
                this._oQRCode = new QRCodeModel(_getTypeNumber(sText, this._htOption.correctLevel), this._htOption.correctLevel),
                    this._oQRCode.addData(sText),
                    this._oQRCode.make(),
                    this._el.title = sText,
                    this._oDrawing.draw(this._oQRCode),
                    this.makeImage()
            },
            QRCode.prototype.makeImage = function() {
                "function" == typeof this._oDrawing.makeImage && (!this._android || this._android >= 3) && this._oDrawing.makeImage()
            },
            QRCode.prototype.clear = function() {
                this._oDrawing.clear(),
                    this._oDrawing._elImage.style.display = "none"
            },
            QRCode.prototype.changeLevel = function(ecLevel) {
                ecLevel > 0 && 4 > ecLevel && (this._htOption.correctLevel = ecLevel)
            },
            QRCode.CorrectLevel = QRErrorCorrectLevel
    } ();