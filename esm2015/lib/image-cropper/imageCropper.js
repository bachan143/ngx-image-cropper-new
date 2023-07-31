import { Bounds } from './model/bounds';
import { CornerMarker } from './model/cornerMarker';
import { CropTouch } from './model/cropTouch';
import { DragMarker } from './model/dragMarker';
import { ImageCropperModel } from './model/imageCropperModel';
import { ImageCropperDataShare } from './imageCropperDataShare';
import { PointPool } from './model/pointPool';
export class ImageCropper extends ImageCropperModel {
    constructor(cropperSettings) {
        super();
        this.imageCropperDataShare = new ImageCropperDataShare();
        const x = 0;
        const y = 0;
        const width = cropperSettings.width;
        const height = cropperSettings.height;
        const keepAspect = cropperSettings.keepAspect;
        const touchRadius = cropperSettings.touchRadius;
        const centerTouchRadius = cropperSettings.centerTouchRadius;
        const minWidth = cropperSettings.minWidth;
        const minHeight = cropperSettings.minHeight;
        const croppedWidth = cropperSettings.croppedWidth;
        const croppedHeight = cropperSettings.croppedHeight;
        this.cropperSettings = cropperSettings;
        this.crop = this;
        this.imageZoom = 1;
        this.x = x;
        this.y = y;
        this.canvasHeight = cropperSettings.canvasHeight;
        this.canvasWidth = cropperSettings.canvasWidth;
        this.width = width;
        if (width === void 0) {
            this.width = 100;
        }
        this.height = height;
        if (height === void 0) {
            this.height = 50;
        }
        this.keepAspect = keepAspect;
        if (keepAspect === void 0) {
            this.keepAspect = true;
        }
        this.touchRadius = touchRadius;
        if (touchRadius === void 0) {
            this.touchRadius = 20;
        }
        this.minWidth = minWidth;
        this.minHeight = minHeight;
        this.aspectRatio = 0;
        this.currentDragTouches = [];
        this.isMouseDown = false;
        this.ratioW = 1;
        this.ratioH = 1;
        this.fileType = cropperSettings.fileType;
        this.imageSet = false;
        this.pointPool = new PointPool(200);
        this.tl = new CornerMarker(x, y, touchRadius, this.cropperSettings);
        this.tr = new CornerMarker(x + width, y, touchRadius, this.cropperSettings);
        this.bl = new CornerMarker(x, y + height, touchRadius, this.cropperSettings);
        this.br = new CornerMarker(x + width, y + height, touchRadius, this.cropperSettings);
        this.tl.addHorizontalNeighbour(this.tr);
        this.tl.addVerticalNeighbour(this.bl);
        this.tr.addHorizontalNeighbour(this.tl);
        this.tr.addVerticalNeighbour(this.br);
        this.bl.addHorizontalNeighbour(this.br);
        this.bl.addVerticalNeighbour(this.tl);
        this.br.addHorizontalNeighbour(this.bl);
        this.br.addVerticalNeighbour(this.tr);
        this.markers = [this.tl, this.tr, this.bl, this.br];
        this.center = new DragMarker(x + width / 2, y + height / 2, centerTouchRadius, this.cropperSettings);
        this.aspectRatio = height / width;
        this.croppedImage = new Image();
        this.currentlyInteracting = false;
        this.cropWidth = croppedWidth;
        this.cropHeight = croppedHeight;
    }
    sign(x) {
        if (+x === x) {
            return x === 0 ? x : x > 0 ? 1 : -1;
        }
        return NaN;
    }
    setImageZoom(scale) {
        this.imageZoom = (scale && !isNaN(scale)) ? scale : 1;
    };
    getMousePos(canvas, evt) {
        const rect = canvas.getBoundingClientRect();
        return new PointPool().instance.borrow(evt.clientX - rect.left, evt.clientY - rect.top);
    }
    getTouchPos(canvas, touch) {
        const rect = canvas.getBoundingClientRect();
        return new PointPool().instance.borrow(touch.clientX - rect.left, touch.clientY - rect.top);
    }
    detectVerticalSquash(img) {
        const ih = img.height;
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = ih;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, 1, ih);
        if (imageData) {
            const data = imageData.data;
            // search image edge pixel position in case it is squashed vertically.
            let sy = 0;
            let ey = ih;
            let py = ih;
            while (py > sy) {
                const alpha = data[(py - 1) * 4 + 3];
                if (alpha === 0) {
                    ey = py;
                }
                else {
                    sy = py;
                }
                // tslint:disable-next-line:no-bitwise
                py = (ey + sy) >> 1;
            }
            const ratio = py / ih;
            return ratio === 0 ? 1 : ratio;
        }
        else {
            return 1;
        }
    }
    getDataUriMimeType(dataUri) {
        // Get a substring because the regex does not perform well on very large strings.
        // Cater for optional charset. Length 50 shoould be enough.
        const dataUriSubstring = dataUri.substring(0, 50);
        let mimeType = 'image/png';
        // data-uri scheme
        // data:[<media type>][;charset=<character set>][;base64],<data>
        const regEx = RegExp(/^(data:)([\w\/\+]+);(charset=[\w-]+|base64).*,(.*)/gi);
        const matches = regEx.exec(dataUriSubstring);
        if (matches && matches[2]) {
            mimeType = matches[2];
            if (mimeType === 'image/jpg') {
                mimeType = 'image/jpeg';
            }
        }
        return mimeType;
    }
    prepare(canvas) {
        this.buffer = document.createElement('canvas');
        this.cropCanvas = document.createElement('canvas');
        // todo get more reliable parent width value.
        const responsiveWidth = canvas.parentElement
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
    }
    updateSettings(cropperSettings) {
        this.cropperSettings = cropperSettings;
    }
    resizeCanvas(width, height, setImage = false) {
        this.canvas.width = this.cropCanvas.width = this.width = this.canvasWidth = this.buffer.width = width;
        this.canvas.height = this.cropCanvas.height = this.height = this.canvasHeight = this.buffer.height = height;
        if (setImage) {
            this.setImage(this.srcImage);
        }
    }
    redrawImage() {
        if (this.isImageSet()) {
            this.setImage(this.srcImage);
        }
    };
    reset() {
        this.setImage(undefined);
    }
    draw(ctx) {
        const bounds = this.getBounds();
        if (this.srcImage) {
            ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            const sourceAspect = this.srcImage.height / this.srcImage.width;
            const canvasAspect = this.canvasHeight / this.canvasWidth;
            let w = this.canvasWidth;
            let h = this.canvasHeight;
            if (canvasAspect > sourceAspect) {
                w = this.canvasWidth;
                h = this.canvasWidth * sourceAspect;
            }
            else {
                h = this.canvasHeight;
                w = this.canvasHeight / sourceAspect;
            }
            w *= this.imageZoom;
            h *= this.imageZoom;
            this.ratioW = w / this.srcImage.width;
            this.ratioH = h / this.srcImage.height;
            // if (canvasAspect < sourceAspect) {
            //     this.drawImageIOSFix(ctx, this.srcImage, 0, 0, this.srcImage.width, this.srcImage.height, this.buffer.width / 2 - w / 2, 0, w, h);
            // }
            // else {
            //     this.drawImageIOSFix(ctx, this.srcImage, 0, 0, this.srcImage.width, this.srcImage.height, 0, this.buffer.height / 2 - h / 2, w, h);
            // }
            this.drawImageIOSFix(ctx, this.srcImage, 0, 0, this.srcImage.width, this.srcImage.height, (this.buffer.width - w) / 2, (this.buffer.height - h) / 2, w, h);
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
            let marker;
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < this.markers.length; i++) {
                marker = this.markers[i];
                marker.draw(ctx);
            }
            this.center.draw(ctx);
        }
        else {
            ctx.fillStyle = 'rgba(192,192,192,1)';
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    dragCenter(x, y, marker) {
        const bounds = this.getBounds();
        const left = x - (bounds.width / 2);
        const right = x + (bounds.width / 2);
        const top = y - (bounds.height / 2);
        const bottom = y + (bounds.height / 2);
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
        this.tl.moveX(x - (bounds.width / 2));
        this.tl.moveY(y - (bounds.height / 2));
        this.tr.moveX(x + (bounds.width / 2));
        this.tr.moveY(y - (bounds.height / 2));
        this.bl.moveX(x - (bounds.width / 2));
        this.bl.moveY(y + (bounds.height / 2));
        this.br.moveX(x + (bounds.width / 2));
        this.br.moveY(y + (bounds.height / 2));
        marker.setPosition(x, y);
    }
    enforceMinSize(x, y, marker) {
        const xLength = x - marker.getHorizontalNeighbour().position.x;
        const yLength = y - marker.getVerticalNeighbour().position.y;
        const xOver = this.minWidth - Math.abs(xLength);
        const yOver = this.minHeight - Math.abs(yLength);
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
    }
    dragCorner(x, y, marker) {
        let iX = 0;
        let iY = 0;
        let ax = 0;
        let ay = 0;
        let newHeight = 0;
        let newWidth = 0;
        let newY = 0;
        let newX = 0;
        let anchorMarker;
        let fold = 0;
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
                        const min = this.enforceMinSize(newX, newY, marker);
                        marker.move(min.x, min.y);
                        new PointPool().instance.returnPoint(min);
                    }
                    else {
                        if (fold < 0) {
                            newWidth = Math.abs(anchorMarker.position.x - x);
                            newHeight = newWidth * this.aspectRatio;
                            newY = anchorMarker.position.y - newHeight;
                            newX = anchorMarker.position.x - newWidth;
                            const min = this.enforceMinSize(newX, newY, marker);
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
                        const min = this.enforceMinSize(newX, newY, marker);
                        marker.move(min.x, min.y);
                        new PointPool().instance.returnPoint(min);
                    }
                    else {
                        if (fold < 0) {
                            newHeight = Math.abs(anchorMarker.position.y - y);
                            newWidth = newHeight / this.aspectRatio;
                            newY = anchorMarker.position.y + newHeight;
                            newX = anchorMarker.position.x - newWidth;
                            const min = this.enforceMinSize(newX, newY, marker);
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
                        const min = this.enforceMinSize(newX, newY, marker);
                        marker.move(min.x, min.y);
                        new PointPool().instance.returnPoint(min);
                    }
                    else {
                        if (fold > 0) {
                            newWidth = Math.abs(anchorMarker.position.x - x);
                            newHeight = newWidth * this.aspectRatio;
                            newY = anchorMarker.position.y - newHeight;
                            newX = anchorMarker.position.x + newWidth;
                            const min = this.enforceMinSize(newX, newY, marker);
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
                        const min = this.enforceMinSize(newX, newY, marker);
                        marker.move(min.x, min.y);
                        new PointPool().instance.returnPoint(min);
                    }
                    else {
                        if (fold > 0) {
                            newHeight = Math.abs(anchorMarker.position.y - y);
                            newWidth = newHeight / this.aspectRatio;
                            newY = anchorMarker.position.y + newHeight;
                            newX = anchorMarker.position.x + newWidth;
                            const min = this.enforceMinSize(newX, newY, marker);
                            marker.move(min.x, min.y);
                            new PointPool().instance.returnPoint(min);
                        }
                    }
                }
            }
        }
        else {
            const min = this.enforceMinSize(x, y, marker);
            marker.move(min.x, min.y);
            new PointPool().instance.returnPoint(min);
        }
        this.center.recalculatePosition(this.getBounds());
    }
    getSide(a, b, c) {
        const n = this.sign((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x));
        // TODO move the return of the pools to outside of this function
        new PointPool().instance.returnPoint(a);
        new PointPool().instance.returnPoint(c);
        return n;
    }
    handleRelease(newCropTouch) {
        if (newCropTouch == null) {
            return;
        }
        let index = 0;
        for (let k = 0; k < this.currentDragTouches.length; k++) {
            if (newCropTouch.id === this.currentDragTouches[k].id) {
                this.currentDragTouches[k].dragHandle.setDrag(false);
                index = k;
            }
        }
        this.currentDragTouches.splice(index, 1);
        this.draw(this.ctx);
    }
    handleMove(newCropTouch) {
        let matched = false;
        // tslint:disable-next-line:prefer-for-of
        for (let k = 0; k < this.currentDragTouches.length; k++) {
            if (newCropTouch.id === this.currentDragTouches[k].id &&
                this.currentDragTouches[k].dragHandle != null) {
                const dragTouch = this.currentDragTouches[k];
                const clampedPositions = this.clampPosition(newCropTouch.x - dragTouch.dragHandle.offset.x, newCropTouch.y - dragTouch.dragHandle.offset.y);
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
            for (const marker of this.markers) {
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
    }
    updateClampBounds() {
        const sourceAspect = this.srcImage.height / this.srcImage.width;
        const canvasAspect = this.canvas.height / this.canvas.width;
        let w = this.canvas.width;
        let h = this.canvas.height;
        if (canvasAspect > sourceAspect) {
            w = this.canvas.width;
            h = this.canvas.width * sourceAspect;
        }
        else {
            h = this.canvas.height;
            w = this.canvas.height / sourceAspect;
        }
        w = (w * this.imageZoom > this.canvas.width) ? this.canvas.width : w * this.imageZoom;
        h = (h * this.imageZoom > this.canvas.height) ? this.canvas.height : h * this.imageZoom;
        this.minXClamp = this.canvas.width / 2 - w / 2;
        this.minYClamp = this.canvas.height / 2 - h / 2;
        this.maxXClamp = this.canvas.width / 2 + w / 2;
        this.maxYClamp = this.canvas.height / 2 + h / 2;
    }
    getCropBounds() {
        const bounds = this.getBounds();
        bounds.top = Math.round((bounds.top - this.minYClamp) / this.ratioH);
        bounds.bottom = Math.round((bounds.bottom - this.minYClamp) / this.ratioH);
        bounds.left = Math.round((bounds.left - this.minXClamp) / this.ratioW);
        bounds.right = Math.round((bounds.right - this.minXClamp) / this.ratioW);
        return bounds;
    }
    clampPosition(x, y) {
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
    }
    isImageSet() {
        return this.imageSet;
    }
    setImage(img) {
        this.srcImage = img;
        if (!img) {
            this.imageSet = false;
            this.draw(this.ctx);
        }
        else {
            this.imageSet = true;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            const bufferContext = this.buffer.getContext('2d');
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
            const cropPosition = this.getCropPositionFromMarkers();
            this.setCropPosition(cropPosition);
        }
    }
    updateCropPosition(cropBounds) {
        const cropPosition = this.getCropPositionFromBounds(cropBounds);
        this.setCropPosition(cropPosition);
    }
    setCropPosition(cropPosition) {
        this.tl.setPosition(cropPosition[0].x, cropPosition[0].y);
        this.tr.setPosition(cropPosition[1].x, cropPosition[1].y);
        this.bl.setPosition(cropPosition[2].x, cropPosition[2].y);
        this.br.setPosition(cropPosition[3].x, cropPosition[3].y);
        this.center.setPosition(cropPosition[4].x, cropPosition[4].y);
        for (const position of cropPosition) {
            new PointPool().instance.returnPoint(position);
        }
        this.vertSquashRatio = this.detectVerticalSquash(this.srcImage);
        this.draw(this.ctx);
        this.croppedImage = this.getCroppedImageHelper(false, this.cropWidth, this.cropHeight);
    }
    getCropPositionFromMarkers() {
        let w = this.canvas.width;
        let h = this.canvas.height;
        let tlPos;
        let trPos;
        let blPos;
        let brPos;
        let center;
        const sourceAspect = this.srcImage.height / this.srcImage.width;
        const cropBounds = this.getBounds();
        const cropAspect = cropBounds.height / cropBounds.width;
        const cX = this.canvas.width / 2;
        const cY = this.canvas.height / 2;
        w = (w * this.imageZoom > this.canvasWidth) ? this.canvasWidth : w * this.imageZoom;
        h = (h * this.imageZoom > this.canvasHeight) ? this.canvasHeight : h * this.imageZoom;
        if (cropAspect > sourceAspect) {
            const imageH = Math.min(w * sourceAspect, h);
            const cropW = (this.cropperSettings.showFullCropInitial) ? Math.min(h / sourceAspect, w) : imageH / cropAspect;
            tlPos = new PointPool().instance.borrow(cX - cropW / 2, cY + imageH / 2);
            trPos = new PointPool().instance.borrow(cX + cropW / 2, cY + imageH / 2);
            blPos = new PointPool().instance.borrow(cX - cropW / 2, cY - imageH / 2);
            brPos = new PointPool().instance.borrow(cX + cropW / 2, cY - imageH / 2);
        }
        else {
            const imageW = Math.min(h / sourceAspect, w);
            const cropH = (this.cropperSettings.showFullCropInitial) ? Math.min(w * sourceAspect, h) : imageW * cropAspect;
            tlPos = new PointPool().instance.borrow(cX - imageW / 2, cY + cropH / 2);
            trPos = new PointPool().instance.borrow(cX + imageW / 2, cY + cropH / 2);
            blPos = new PointPool().instance.borrow(cX - imageW / 2, cY - cropH / 2);
            brPos = new PointPool().instance.borrow(cX + imageW / 2, cY - cropH / 2);
        }
        center = new PointPool().instance.borrow(cX, cY);
        const positions = [tlPos, trPos, blPos, brPos, center];
        return positions;
    }
    getCropPositionFromBounds(cropPosition) {
        let marginTop = 0;
        let marginLeft = 0;
        const canvasAspect = this.canvasHeight / this.canvasWidth;
        const sourceAspect = this.srcImage.height / this.srcImage.width;
        if (canvasAspect > sourceAspect) {
            marginTop =
                this.buffer.height / 2 - (this.canvasWidth * sourceAspect) / 2;
        }
        else {
            marginLeft = this.buffer.width / 2 - this.canvasHeight / sourceAspect / 2;
        }
        const ratioW = (this.canvasWidth - marginLeft * 2) / this.srcImage.width;
        const ratioH = (this.canvasHeight - marginTop * 2) / this.srcImage.height;
        let actualH = cropPosition.height * ratioH;
        let actualW = cropPosition.width * ratioW;
        const actualX = cropPosition.left * ratioW + marginLeft;
        const actualY = cropPosition.top * ratioH + marginTop;
        if (this.keepAspect) {
            const scaledW = actualH / this.aspectRatio;
            const scaledH = actualW * this.aspectRatio;
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
        const tlPos = new PointPool().instance.borrow(actualX, actualY + actualH);
        const trPos = new PointPool().instance.borrow(actualX + actualW, actualY + actualH);
        const blPos = new PointPool().instance.borrow(actualX, actualY);
        const brPos = new PointPool().instance.borrow(actualX + actualW, actualY);
        const center = new PointPool().instance.borrow(actualX + actualW / 2, actualY + actualH / 2);
        const positions = [tlPos, trPos, blPos, brPos, center];
        return positions;
    }
    getCroppedImageHelper(preserveSize, fillWidth, fillHeight) {
        if (this.cropperSettings.cropOnResize) {
            return this.getCroppedImage(preserveSize, fillWidth, fillHeight);
        }
        return this.croppedImage
            ? this.croppedImage
            : document.createElement('img');
    }
    // todo: Unused parameters?
    getCroppedImage(preserveSize, fillWidth, fillHeight) {
        const bounds = this.getBounds();
        if (!this.srcImage) {
            return document.createElement('img');
        }
        else {
            const sourceAspect = this.srcImage.height / this.srcImage.width;
            const canvasAspect = this.canvas.height / this.canvas.width;
            let w = this.canvas.width;
            let h = this.canvas.height;
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
            w *= this.imageZoom;
            h *= this.imageZoom;
            this.ratioW = w / this.srcImage.width;
            this.ratioH = h / this.srcImage.height;
            const offsetH = (this.buffer.height - h) / 2 / this.ratioH;
            const offsetW = (this.buffer.width - w) / 2 / this.ratioW;
            const ctx = this.cropCanvas.getContext('2d');
            if (this.cropperSettings.preserveSize || preserveSize) {
                const width = Math.round(bounds.right / this.ratioW - bounds.left / this.ratioW);
                const height = Math.round(bounds.bottom / this.ratioH - bounds.top / this.ratioH);
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
    }
    getBounds() {
        let minX = Number.MAX_VALUE;
        let minY = Number.MAX_VALUE;
        let maxX = -Number.MAX_VALUE;
        let maxY = -Number.MAX_VALUE;
        for (const marker of this.markers) {
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
        const bounds = new Bounds();
        bounds.left = minX;
        bounds.right = maxX;
        bounds.top = minY;
        bounds.bottom = maxY;
        return bounds;
    }
    setBounds(bounds) {
        // const topLeft: CornerMarker;
        // const topRight: CornerMarker;
        // const bottomLeft: CornerMarker;
        // const bottomRight: CornerMarker;
        const currentBounds = this.getBounds();
        for (const marker of this.markers) {
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
        this.center.recalculatePosition(bounds);
        this.center.draw(this.ctx);
        this.draw(this.ctx); // we need to redraw all canvas if we have changed bounds
    }
    onTouchMove(event) {
        if (this.crop.isImageSet()) {
            if (event.touches.length === 1) {
                if (this.isMouseDown) {
                    event.preventDefault();
                    // tslint:disable-next-line:prefer-for-of
                    for (let i = 0; i < event.touches.length; i++) {
                        const touch = event.touches[i];
                        const touchPosition = this.getTouchPos(this.canvas, touch);
                        const cropTouch = new CropTouch(touchPosition.x, touchPosition.y, touch.identifier);
                        new PointPool().instance.returnPoint(touchPosition);
                        this.move(cropTouch);
                    }
                }
            }
            else {
                if (event.touches.length === 2) {
                    event.preventDefault();
                    const distance = (event.touches[0].clientX - event.touches[1].clientX) *
                        (event.touches[0].clientX - event.touches[1].clientX) +
                        (event.touches[0].clientY - event.touches[1].clientY) *
                            (event.touches[0].clientY - event.touches[1].clientY);
                    if (this.previousDistance && this.previousDistance !== distance) {
                        const bounds = this.getBounds();
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
    }
    onMouseMove(e) {
        if (this.crop.isImageSet() && this.isMouseDown) {
            const mousePosition = this.getMousePos(this.canvas, e);
            this.move(new CropTouch(mousePosition.x, mousePosition.y, 0));
            let dragTouch = this.getDragTouchForID(0);
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
    }
    move(cropTouch) {
        if (this.isMouseDown) {
            this.handleMove(cropTouch);
        }
    }
    getDragTouchForID(id) {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.currentDragTouches.length; i++) {
            if (id === this.currentDragTouches[i].id) {
                return this.currentDragTouches[i];
            }
        }
        return undefined;
    }
    drawCursors(cropTouch) {
        let cursorDrawn = false;
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
        let didDraw = false;
        if (!cursorDrawn) {
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < this.markers.length; i++) {
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
    }
    drawCornerCursor(marker, x, y) {
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
    }
    onTouchStart(event) {
        if (this.crop.isImageSet()) {
            const touch = event.touches[0];
            const touchPosition = this.getTouchPos(this.canvas, touch);
            const cropTouch = new CropTouch(touchPosition.x, touchPosition.y, touch.identifier);
            new PointPool().instance.returnPoint(touchPosition);
            this.isMouseDown = false;
            for (const marker of this.markers) {
                if (marker.touchInBounds(cropTouch.x, cropTouch.y)) {
                    this.isMouseDown = true;
                }
            }
            if (this.center.touchInBounds(cropTouch.x, cropTouch.y)) {
                this.isMouseDown = true;
            }
        }
    }
    onTouchEnd(event) {
        if (this.crop.isImageSet()) {
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < event.changedTouches.length; i++) {
                const touch = event.changedTouches[i];
                const dragTouch = this.getDragTouchForID(touch.identifier);
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
    }
    // http://stackoverflow.com/questions/11929099/html5-canvas-drawimage-ratio-bug-ios
    drawImageIOSFix(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
        // Works only if whole image is displayed:
        // ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
        // The following works correct also when only a part of the image is displayed:
        // ctx.drawImage(img, sx * this.vertSquashRatio, sy * this.vertSquashRatio, sw * this.vertSquashRatio, sh *
        // this.vertSquashRatio, dx, dy, dw, dh);
        ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
    }
    onMouseDown(event) {
        if (this.crop.isImageSet()) {
            this.isMouseDown = true;
        }
    }
    onMouseUp(event) {
        if (this.crop.isImageSet()) {
            this.imageCropperDataShare.setReleased(this.canvas);
            this.isMouseDown = false;
            this.handleRelease(new CropTouch(0, 0, 0));
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2VDcm9wcGVyLmpzIiwic291cmNlUm9vdCI6IkM6L3dvcmtzcGFjZS9uZ3gtaW1nLWNyb3BwZXIvcHJvamVjdHMvbmd4LWltZy1jcm9wcGVyL3NyYy8iLCJzb3VyY2VzIjpbImxpYi9pbWFnZS1jcm9wcGVyL2ltYWdlQ3JvcHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDeEMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUU5QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDaEQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDOUQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDaEUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBSTlDLE1BQU0sT0FBTyxZQUFhLFNBQVEsaUJBQWlCO0lBTWpELFlBQVksZUFBZ0M7UUFDMUMsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxxQkFBcUIsRUFBRSxDQUFDO1FBQ3pELE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNaLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNaLE1BQU0sS0FBSyxHQUFXLGVBQWUsQ0FBQyxLQUFLLENBQUM7UUFDNUMsTUFBTSxNQUFNLEdBQVcsZUFBZSxDQUFDLE1BQU0sQ0FBQztRQUM5QyxNQUFNLFVBQVUsR0FBWSxlQUFlLENBQUMsVUFBVSxDQUFDO1FBQ3ZELE1BQU0sV0FBVyxHQUFXLGVBQWUsQ0FBQyxXQUFXLENBQUM7UUFDeEQsTUFBTSxpQkFBaUIsR0FBVyxlQUFlLENBQUMsaUJBQWlCLENBQUM7UUFDcEUsTUFBTSxRQUFRLEdBQVcsZUFB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QU0sSUFBSSxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNsQyxNQUFNLEtBQUssR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDbkMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sTUFBTSxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNyQyxJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQzNCLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1NBQ3ZDO1FBQ0QsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUMxQixDQUFDLEdBQUcsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztTQUN2QztRQUNELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDeEIsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7U0FDeEM7UUFDRCxJQUFJLE1BQU0sSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQzVCLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1NBQ3hDO1FBQ0QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDckMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDckMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUVNLGNBQWMsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLE1BQW9CO1FBQzlELE1BQU0sT0FBTyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsc0JBQXNCLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQy9ELE1BQU0sT0FBTyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQzdELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNoRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFakQsSUFBSSxPQUFPLEtBQUssQ0FBQyxJQUFJLE9BQU8sS0FBSyxDQUFDLEVBQUU7WUFDbEMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLENBQUMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUV0QixPQUFPLElBQUksU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDOUM7UUFFRCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDbkIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsRUFBRTtnQkFDN0MsSUFBSSxLQUFLLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUU7b0JBQ3BDLElBQUksT0FBTyxHQUFHLENBQUMsRUFBRTt3QkFDZixDQUFDLElBQUksS0FBSyxDQUFDO3dCQUVYLElBQUksT0FBTyxHQUFHLENBQUMsRUFBRTs0QkFDZixDQUFDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7eUJBQy9COzZCQUFNOzRCQUNMLENBQUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQzt5QkFDL0I7cUJBQ0Y7eUJBQU07d0JBQ0wsQ0FBQyxJQUFJLEtBQUssQ0FBQzt3QkFDWCxJQUFJLE9BQU8sR0FBRyxDQUFDLEVBQUU7NEJBQ2YsQ0FBQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO3lCQUMvQjs2QkFBTTs0QkFDTCxDQUFDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7eUJBQy9CO3FCQUNGO2lCQUNGO3FCQUFNO29CQUNMLElBQUksT0FBTyxHQUFHLENBQUMsRUFBRTt3QkFDZixDQUFDLElBQUksS0FBSyxDQUFDO3dCQUVYLElBQUksT0FBTyxHQUFHLENBQUMsRUFBRTs0QkFDZixDQUFDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7eUJBQy9COzZCQUFNOzRCQUNMLENBQUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQzt5QkFDL0I7cUJBQ0Y7eUJBQU07d0JBQ0wsQ0FBQyxJQUFJLEtBQUssQ0FBQzt3QkFDWCxJQUFJLE9BQU8sR0FBRyxDQUFDLEVBQUU7NEJBQ2YsQ0FBQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO3lCQUMvQjs2QkFBTTs0QkFDTCxDQUFDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7eUJBQy9CO3FCQUNGO2lCQUNGO2FBQ0Y7aUJBQU07Z0JBQ0wsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO29CQUNiLElBQUksT0FBTyxHQUFHLENBQUMsRUFBRTt3QkFDZixDQUFDLElBQUksS0FBSyxDQUFDO3dCQUNYLElBQUksT0FBTyxHQUFHLENBQUMsRUFBRTs0QkFDZixDQUFDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7eUJBQy9COzZCQUFNOzRCQUNMLENBQUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQzt5QkFDL0I7cUJBQ0Y7eUJBQU07d0JBQ0wsQ0FBQyxJQUFJLEtBQUssQ0FBQzt3QkFDWCxJQUFJLE9BQU8sR0FBRyxDQUFDLEVBQUU7NEJBQ2YsQ0FBQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO3lCQUMvQjs2QkFBTTs0QkFDTCxDQUFDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7eUJBQy9CO3FCQUNGO2lCQUNGO3FCQUFNO29CQUNMLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTt3QkFDYixJQUFJLE9BQU8sR0FBRyxDQUFDLEVBQUU7NEJBQ2YsQ0FBQyxJQUFJLEtBQUssQ0FBQzs0QkFFWCxJQUFJLE9BQU8sR0FBRyxDQUFDLEVBQUU7Z0NBQ2YsQ0FBQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDOzZCQUMvQjtpQ0FBTTtnQ0FDTCxDQUFDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7NkJBQy9CO3lCQUNGOzZCQUFNOzRCQUNMLENBQUMsSUFBSSxLQUFLLENBQUM7NEJBQ1gsSUFBSSxPQUFPLEdBQUcsQ0FBQyxFQUFFO2dDQUNmLENBQUMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQzs2QkFDL0I7aUNBQU07Z0NBQ0wsQ0FBQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDOzZCQUMvQjt5QkFDRjtxQkFDRjtpQkFDRjthQUNGO1NBQ0Y7YUFBTTtZQUNMLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtnQkFDYixJQUFJLE9BQU8sR0FBRyxDQUFDLEVBQUU7b0JBQ2YsQ0FBQyxJQUFJLEtBQUssQ0FBQztpQkFDWjtxQkFBTTtvQkFDTCxDQUFDLElBQUksS0FBSyxDQUFDO2lCQUNaO2FBQ0Y7WUFDRCxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7Z0JBQ2IsSUFBSSxPQUFPLEdBQUcsQ0FBQyxFQUFFO29CQUNmLENBQUMsSUFBSSxLQUFLLENBQUM7aUJBQ1o7cUJBQU07b0JBQ0wsQ0FBQyxJQUFJLEtBQUssQ0FBQztpQkFDWjthQUNGO1NBQ0Y7UUFFRCxJQUNFLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUztZQUNsQixDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVM7WUFDbEIsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTO1lBQ2xCLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUNsQjtZQUNBLENBQUMsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN0QixDQUFDLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7U0FDdkI7UUFFRCxPQUFPLElBQUksU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVNLFVBQVUsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLE1BQW9CO1FBQzFELElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNYLElBQUksU0FBUyxHQUFHLENBQUMsQ0FBQztRQUNsQixJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFDakIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ2IsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ2IsSUFBSSxZQUEwQixDQUFDO1FBQy9CLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztRQUViLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNuQixZQUFZLEdBQUcsTUFBTSxDQUFDLHNCQUFzQixFQUFFLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztZQUN0RSxFQUFFLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDN0IsRUFBRSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzdCLElBQUksQ0FBQyxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFO2dCQUNoQyxJQUFJLENBQUMsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRTtvQkFDaEMsRUFBRSxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztvQkFDakMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztvQkFDdEQsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQ2pCLElBQUksU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQ3ZDLFlBQVksQ0FBQyxRQUFRLEVBQ3JCLElBQUksU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQ3RDLENBQUM7b0JBQ0YsSUFBSSxJQUFJLEdBQUcsQ0FBQyxFQUFFO3dCQUNaLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUNsRCxRQUFRLEdBQUcsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7d0JBQ3hDLElBQUksR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUM7d0JBQzNDLElBQUksR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUM7d0JBQzFDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQzt3QkFDcEQsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDMUIsSUFBSSxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUMzQzt5QkFBTTt3QkFDTCxJQUFJLElBQUksR0FBRyxDQUFDLEVBQUU7NEJBQ1osUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7NEJBQ2pELFNBQVMsR0FBRyxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQzs0QkFDeEMsSUFBSSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQzs0QkFDM0MsSUFBSSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQzs0QkFDMUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDOzRCQUNwRCxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUMxQixJQUFJLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7eUJBQzNDO3FCQUNGO2lCQUNGO3FCQUFNO29CQUNMLEVBQUUsR0FBRyxFQUFFLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7b0JBQ2pDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7b0JBQ3RELElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUNqQixJQUFJLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUN2QyxZQUFZLENBQUMsUUFBUSxFQUNyQixJQUFJLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUN0QyxDQUFDO29CQUNGLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRTt3QkFDWixRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDakQsU0FBUyxHQUFHLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO3dCQUN4QyxJQUFJLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDO3dCQUMzQyxJQUFJLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDO3dCQUMxQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7d0JBQ3BELE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzFCLElBQUksU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFDM0M7eUJBQU07d0JBQ0wsSUFBSSxJQUFJLEdBQUcsQ0FBQyxFQUFFOzRCQUNaLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDOzRCQUNsRCxRQUFRLEdBQUcsU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7NEJBQ3hDLElBQUksR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUM7NEJBQzNDLElBQUksR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUM7NEJBQzFDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQzs0QkFDcEQsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDMUIsSUFBSSxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3lCQUMzQztxQkFDRjtpQkFDRjthQUNGO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFO29CQUNoQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO29CQUNqQyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO29CQUN0RCxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FDakIsSUFBSSxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFDdkMsWUFBWSxDQUFDLFFBQVEsRUFDckIsSUFBSSxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FDdEMsQ0FBQztvQkFDRixJQUFJLElBQUksR0FBRyxDQUFDLEVBQUU7d0JBQ1osU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ2xELFFBQVEsR0FBRyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQzt3QkFDeEMsSUFBSSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQzt3QkFDM0MsSUFBSSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQzt3QkFDMUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO3dCQUNwRCxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUMxQixJQUFJLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQzNDO3lCQUFNO3dCQUNMLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRTs0QkFDWixRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzs0QkFDakQsU0FBUyxHQUFHLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDOzRCQUN4QyxJQUFJLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDOzRCQUMzQyxJQUFJLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDOzRCQUMxQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7NEJBQ3BELE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQzFCLElBQUksU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQzt5QkFDM0M7cUJBQ0Y7aUJBQ0Y7cUJBQU07b0JBQ0wsRUFBRSxHQUFHLEVBQUUsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztvQkFDakMsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztvQkFDdEQsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQ2pCLElBQUksU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQ3ZDLFlBQVksQ0FBQyxRQUFRLEVBQ3JCLElBQUksU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQ3RDLENBQUM7b0JBQ0YsSUFBSSxJQUFJLEdBQUcsQ0FBQyxFQUFFO3dCQUNaLFFBQVEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO3dCQUNqRCxTQUFTLEdBQUcsUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7d0JBQ3hDLElBQUksR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUM7d0JBQzNDLElBQUksR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUM7d0JBQzFDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQzt3QkFDcEQsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDMUIsSUFBSSxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUMzQzt5QkFBTTt3QkFDTCxJQUFJLElBQUksR0FBRyxDQUFDLEVBQUU7NEJBQ1osU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7NEJBQ2xELFFBQVEsR0FBRyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQzs0QkFDeEMsSUFBSSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQzs0QkFDM0MsSUFBSSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQzs0QkFDMUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDOzRCQUNwRCxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUMxQixJQUFJLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7eUJBQzNDO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRjthQUFNO1lBQ0wsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzlDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUIsSUFBSSxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzNDO1FBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRU0sT0FBTyxDQUFDLENBQVEsRUFBRSxDQUFRLEVBQUUsQ0FBUTtRQUN6QyxNQUFNLENBQUMsR0FBVyxJQUFJLENBQUMsSUFBSSxDQUN6QixDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUN0RCxDQUFDO1FBRUYsZ0VBQWdFO1FBQ2hFLElBQUksU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4QyxJQUFJLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEMsT0FBTyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBRU0sYUFBYSxDQUFDLFlBQXVCO1FBQzFDLElBQUksWUFBWSxJQUFJLElBQUksRUFBRTtZQUN4QixPQUFPO1NBQ1I7UUFDRCxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDZCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN2RCxJQUFJLFlBQVksQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtnQkFDckQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3JELEtBQUssR0FBRyxDQUFDLENBQUM7YUFDWDtTQUNGO1FBQ0QsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdEIsQ0FBQztJQUVNLFVBQVUsQ0FBQyxZQUF1QjtRQUN2QyxJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDcEIseUNBQXlDO1FBQ3pDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3ZELElBQ0UsWUFBWSxDQUFDLEVBQUUsS0FBSyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDakQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsSUFBSSxJQUFJLEVBQzdDO2dCQUNBLE1BQU0sU0FBUyxHQUFjLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEQsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUN6QyxZQUFZLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsRUFDOUMsWUFBWSxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQy9DLENBQUM7Z0JBQ0YsWUFBWSxDQUFDLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BDLFlBQVksQ0FBQyxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO2dCQUNwQyxJQUFJLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDdkQsSUFBSSxTQUFTLENBQUMsVUFBVSxZQUFZLFlBQVksRUFBRTtvQkFDaEQsSUFBSSxDQUFDLFVBQVUsQ0FDYixZQUFZLENBQUMsQ0FBQyxFQUNkLFlBQVksQ0FBQyxDQUFDLEVBQ2QsU0FBUyxDQUFDLFVBQTBCLENBQ3JDLENBQUM7aUJBQ0g7cUJBQU07b0JBQ0wsSUFBSSxDQUFDLFVBQVUsQ0FDYixZQUFZLENBQUMsQ0FBQyxFQUNkLFlBQVksQ0FBQyxDQUFDLEVBQ2QsU0FBUyxDQUFDLFVBQXdCLENBQ25DLENBQUM7aUJBQ0g7Z0JBQ0QsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQztnQkFDakMsT0FBTyxHQUFHLElBQUksQ0FBQztnQkFDZixJQUFJLENBQUMscUJBQXFCLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDbkQsTUFBTTthQUNQO1NBQ0Y7UUFDRCxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ1osS0FBSyxNQUFNLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNqQyxJQUFJLE1BQU0sQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQ3hELFlBQVksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDO29CQUNqQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO29CQUMzQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNyQixZQUFZLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3dCQUM5QixZQUFZLENBQUMsQ0FBQyxHQUFHLFlBQVksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDdEQsWUFBWSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDOUIsWUFBWSxDQUFDLENBQUMsR0FBRyxZQUFZLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ3RELElBQUksQ0FBQyxVQUFVLENBQ2IsWUFBWSxDQUFDLENBQUMsR0FBRyxZQUFZLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQ2pELFlBQVksQ0FBQyxDQUFDLEdBQUcsWUFBWSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUNqRCxZQUFZLENBQUMsVUFBMEIsQ0FDeEMsQ0FBQztvQkFDRixNQUFNO2lCQUNQO2FBQ0Y7WUFDRCxJQUNFLFlBQVksQ0FBQyxVQUFVLEtBQUssSUFBSTtnQkFDaEMsT0FBTyxZQUFZLENBQUMsVUFBVSxLQUFLLFdBQVcsRUFDOUM7Z0JBQ0EsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDN0QsWUFBWSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO29CQUN0QyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO29CQUMzQyxZQUFZLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDdEMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFDOUIsWUFBWSxDQUFDLENBQUMsR0FBRyxZQUFZLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ3RELFlBQVksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7d0JBQzlCLFlBQVksQ0FBQyxDQUFDLEdBQUcsWUFBWSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUN0RCxJQUFJLENBQUMsVUFBVSxDQUNiLFlBQVksQ0FBQyxDQUFDLEdBQUcsWUFBWSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUNqRCxZQUFZLENBQUMsQ0FBQyxHQUFHLFlBQVksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsRUFDakQsWUFBWSxDQUFDLFVBQXdCLENBQ3RDLENBQUM7aUJBQ0g7YUFDRjtTQUNGO0lBQ0gsQ0FBQztJQUVNLGlCQUFpQjtRQUN0QixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztRQUNoRSxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUM1RCxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUMxQixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUMzQixJQUFJLFlBQVksR0FBRyxZQUFZLEVBQUU7WUFDL0IsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ3RCLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxZQUFZLENBQUM7U0FDdEM7YUFBTTtZQUNMLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUN2QixDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsWUFBWSxDQUFDO1NBQ3ZDO1FBQ0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0MsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRU0sYUFBYTtRQUNsQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDaEMsTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMzRSxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkUsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pFLE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxhQUFhLENBQUMsQ0FBUyxFQUFFLENBQVM7UUFDdkMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUN0QixDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztTQUNwQjtRQUNELElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDdEIsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7U0FDcEI7UUFDRCxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ3RCLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1NBQ3BCO1FBQ0QsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUN0QixDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztTQUNwQjtRQUNELE9BQU8sSUFBSSxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRU0sVUFBVTtRQUNmLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDO0lBRU0sUUFBUSxDQUFDLEdBQVE7UUFDdEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7UUFDcEIsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNSLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3JCO2FBQU07WUFDTCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztZQUNyQixJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDaEUsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQzFDLElBQUksQ0FDdUIsQ0FBQztZQUM5QixhQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUVyRSxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUU7Z0JBQ2xDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNsRDtZQUVELElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQywyQkFBMkIsRUFBRTtnQkFDcEQsSUFBSSxDQUFDLFFBQVE7b0JBQ1gsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQzt3QkFDbkQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxTQUFTO29CQUNaLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUM7d0JBQ3JELElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO2FBQ3hCO1lBRUQsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7WUFDekIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNyQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBRXZDLE1BQU0sWUFBWSxHQUFZLElBQUksQ0FBQywwQkFBMEIsRUFBRSxDQUFDO1lBQ2hFLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDcEM7SUFDSCxDQUFDO0lBRU0sa0JBQWtCLENBQUMsVUFBa0I7UUFDMUMsTUFBTSxZQUFZLEdBQVksSUFBSSxDQUFDLHlCQUF5QixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3pFLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVPLGVBQWUsQ0FBQyxZQUFxQjtRQUMzQyxJQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxRCxJQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxRCxJQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxRCxJQUFJLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxRCxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU5RCxLQUFLLE1BQU0sUUFBUSxJQUFJLFlBQVksRUFBRTtZQUNuQyxJQUFJLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDaEQ7UUFFRCxJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDaEUsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQzVDLEtBQUssRUFDTCxJQUFJLENBQUMsU0FBUyxFQUNkLElBQUksQ0FBQyxVQUFVLENBQ2hCLENBQUM7SUFDSixDQUFDO0lBRU8sMEJBQTBCO1FBQ2hDLE1BQU0sQ0FBQyxHQUFXLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ3BDLE1BQU0sQ0FBQyxHQUFXLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ3JDLElBQUksS0FBWSxDQUFDO1FBQ2pCLElBQUksS0FBWSxDQUFDO1FBQ2pCLElBQUksS0FBWSxDQUFDO1FBQ2pCLElBQUksS0FBWSxDQUFDO1FBQ2pCLElBQUksTUFBYSxDQUFDO1FBQ2xCLE1BQU0sWUFBWSxHQUFXLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO1FBQ3hFLE1BQU0sVUFBVSxHQUFXLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUM1QyxNQUFNLFVBQVUsR0FBVyxVQUFVLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUM7UUFDaEUsTUFBTSxFQUFFLEdBQVcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ3pDLE1BQU0sRUFBRSxHQUFXLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUUxQyxJQUFJLFVBQVUsR0FBRyxZQUFZLEVBQUU7WUFDN0IsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzdDLE1BQU0sS0FBSyxHQUFHLE1BQU0sR0FBRyxVQUFVLENBQUM7WUFDbEMsS0FBSyxHQUFHLElBQUksU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsS0FBSyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ3pFLEtBQUssR0FBRyxJQUFJLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRSxHQUFHLEtBQUssR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN6RSxLQUFLLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxLQUFLLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDekUsS0FBSyxHQUFHLElBQUksU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsS0FBSyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQzFFO2FBQU07WUFDTCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDN0MsTUFBTSxLQUFLLEdBQUcsTUFBTSxHQUFHLFVBQVUsQ0FBQztZQUNsQyxLQUFLLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxFQUFF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Q0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzVDO0lBQ0gsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQm91bmRzIH0gZnJvbSAnLi9tb2RlbC9ib3VuZHMnO1xyXG5pbXBvcnQgeyBDb3JuZXJNYXJrZXIgfSBmcm9tICcuL21vZGVsL2Nvcm5lck1hcmtlcic7XHJcbmltcG9ydCB7IENyb3BUb3VjaCB9IGZyb20gJy4vbW9kZWwvY3JvcFRvdWNoJztcclxuaW1wb3J0IHsgQ3JvcHBlclNldHRpbmdzIH0gZnJvbSAnLi9jcm9wcGVyLXNldHRpbmdzJztcclxuaW1wb3J0IHsgRHJhZ01hcmtlciB9IGZyb20gJy4vbW9kZWwvZHJhZ01hcmtlcic7XHJcbmltcG9ydCB7IEltYWdlQ3JvcHBlck1vZGVsIH0gZnJvbSAnLi9tb2RlbC9pbWFnZUNyb3BwZXJNb2RlbCc7XHJcbmltcG9ydCB7IEltYWdlQ3JvcHBlckRhdGFTaGFyZSB9IGZyb20gJy4vaW1hZ2VDcm9wcGVyRGF0YVNoYXJlJztcclxuaW1wb3J0IHsgUG9pbnRQb29sIH0gZnJvbSAnLi9tb2RlbC9wb2ludFBvb2wnO1xyXG5pbXBvcnQgeyBQb2ludCB9IGZyb20gJy4vbW9kZWwvcG9pbnQnO1xyXG5pbXBvcnQgeyBJQ29ybmVyTWFya2VyIH0gZnJvbSAnLi9tb2RlbC9jb3JuZXJNYXJrZXInO1xyXG5cclxuZXhwb3J0IGNsYXNzIEltYWdlQ3JvcHBlciBleHRlbmRzIEltYWdlQ3JvcHBlck1vZGVsIHtcclxuICBwcml2YXRlIGNyb3A6IEltYWdlQ3JvcHBlcjtcclxuICBwcml2YXRlIGNyb3BwZXJTZXR0aW5nczogQ3JvcHBlclNldHRpbmdzO1xyXG4gIHByaXZhdGUgcHJldmlvdXNEaXN0YW5jZTogbnVtYmVyO1xyXG4gIHByaXZhdGUgaW1hZ2VDcm9wcGVyRGF0YVNoYXJlOiBJbWFnZUNyb3BwZXJEYXRhU2hhcmU7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGNyb3BwZXJTZXR0aW5nczogQ3JvcHBlclNldHRpbmdzKSB7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgdGhpcy5pbWFnZUNyb3BwZXJEYXRhU2hhcmUgPSBuZXcgSW1hZ2VDcm9wcGVyRGF0YVNoYXJlKCk7XHJcbiAgICBjb25zdCB4ID0gMDtcclxuICAgIGNvbnN0IHkgPSAwO1xyXG4gICAgY29uc3Qgd2lkdGg6IG51bWJlciA9IGNyb3BwZXJTZXR0aW5ncy53aWR0aDtcclxuICAgIGNvbnN0IGhlaWdodDogbnVtYmVyID0gY3JvcHBlclNldHRpbmdzLmhlaWdodDtcclxuICAgIGNvbnN0IGtlZXBBc3BlY3Q6IGJvb2xlYW4gPSBjcm9wcGVyU2V0dGluZ3Mua2VlcEFzcGVjdDtcclxuICAgIGNvbnN0IHRvdWNoUmFkaXVzOiBudW1iZXIgPSBjcm9wcGVyU2V0dGluZ3MudG91Y2hSYWRpdXM7XHJcbiAgICBjb25zdCBjZW50ZXJUb3VjaFJhZGl1czogbnVtYmVyID0gY3JvcHBlclNldHRpbmdzLmNlbnRlclRvdWNoUmFkaXVzO1xyXG4gICAgY29uc3QgbWluV2lkdGg6IG51bWJlciA9IGNyb3BwZXJTZXR0aW5ncy5taW5XaWR0aDtcclxuICAgIGNvbnN0IG1pbkhlaWdodDogbnVtYmVyID0gY3JvcHBlclNldHRpbmdzLm1pbkhlaWdodDtcclxuICAgIGNvbnN0IGNyb3BwZWRXaWR0aDogbnVtYmVyID0gY3JvcHBlclNldHRpbmdzLmNyb3BwZWRXaWR0aDtcclxuICAgIGNvbnN0IGNyb3BwZWRIZWlnaHQ6IG51bWJlciA9IGNyb3BwZXJTZXR0aW5ncy5jcm9wcGVkSGVpZ2h0O1xyXG5cclxuICAgIHRoaXMuY3JvcHBlclNldHRpbmdzID0gY3JvcHBlclNldHRpbmdzO1xyXG5cclxuICAgIHRoaXMuY3JvcCA9IHRoaXM7XHJcbiAgICB0aGlzLnggPSB4O1xyXG4gICAgdGhpcy55ID0geTtcclxuXHJcbiAgICB0aGlzLmNhbnZhc0hlaWdodCA9IGNyb3BwZXJTZXR0aW5ncy5jYW52YXNIZWlnaHQ7XHJcbiAgICB0aGlzLmNhbnZhc1dpZHRoID0gY3JvcHBlclNldHRpbmdzLmNhbnZhc1dpZHRoO1xyXG5cclxuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcclxuICAgIGlmICh3aWR0aCA9PT0gdm9pZCAwKSB7XHJcbiAgICAgIHRoaXMud2lkdGggPSAxMDA7XHJcbiAgICB9XHJcbiAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuICAgIGlmIChoZWlnaHQgPT09IHZvaWQgMCkge1xyXG4gICAgICB0aGlzLmhlaWdodCA9IDUwO1xyXG4gICAgfVxyXG4gICAgdGhpcy5rZWVwQXNwZWN0ID0ga2VlcEFzcGVjdDtcclxuICAgIGlmIChrZWVwQXNwZWN0ID09PSB2b2lkIDApIHtcclxuICAgICAgdGhpcy5rZWVwQXNwZWN0ID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIHRoaXMudG91Y2hSYWRpdXMgPSB0b3VjaFJhZGl1cztcclxuICAgIGlmICh0b3VjaFJhZGl1cyA9PT0gdm9pZCAwKSB7XHJcbiAgICAgIHRoaXMudG91Y2hSYWRpdXMgPSAyMDtcclxuICAgIH1cclxuICAgIHRoaXMubWluV2lkdGggPSBtaW5XaWR0aDtcclxuICAgIHRoaXMubWluSGVpZ2h0ID0gbWluSGVpZ2h0O1xyXG4gICAgdGhpcy5hc3BlY3RSYXRpbyA9IDA7XHJcbiAgICB0aGlzLmN1cnJlbnREcmFnVG91Y2hlcyA9IFtdO1xyXG4gICAgdGhpcy5pc01vdXNlRG93biA9IGZhbHNlO1xyXG4gICAgdGhpcy5yYXRpb1cgPSAxO1xyXG4gICAgdGhpcy5yYXRpb0ggPSAxO1xyXG4gICAgdGhpcy5maWxlVHlwZSA9IGNyb3BwZXJTZXR0aW5ncy5maWxlVHlwZTtcclxuICAgIHRoaXMuaW1hZ2VTZXQgPSBmYWxzZTtcclxuICAgIHRoaXMucG9pbnRQb29sID0gbmV3IFBvaW50UG9vbCgyMDApO1xyXG5cclxuICAgIHRoaXMudGwgPSBuZXcgQ29ybmVyTWFya2VyKHgsIHksIHRvdWNoUmFkaXVzLCB0aGlzLmNyb3BwZXJTZXR0aW5ncyk7XHJcbiAgICB0aGlzLnRyID0gbmV3IENvcm5lck1hcmtlcih4ICsgd2lkdGgsIHksIHRvdWNoUmFkaXVzLCB0aGlzLmNyb3BwZXJTZXR0aW5ncyk7XHJcbiAgICB0aGlzLmJsID0gbmV3IENvcm5lck1hcmtlcihcclxuICAgICAgeCxcclxuICAgICAgeSArIGhlaWdodCxcclxuICAgICAgdG91Y2hSYWRpdXMsXHJcbiAgICAgIHRoaXMuY3JvcHBlclNldHRpbmdzXHJcbiAgICApO1xyXG4gICAgdGhpcy5iciA9IG5ldyBDb3JuZXJNYXJrZXIoXHJcbiAgICAgIHggKyB3aWR0aCxcclxuICAgICAgeSArIGhlaWdodCxcclxuICAgICAgdG91Y2hSYWRpdXMsXHJcbiAgICAgIHRoaXMuY3JvcHBlclNldHRpbmdzXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMudGwuYWRkSG9yaXpvbnRhbE5laWdoYm91cih0aGlzLnRyKTtcclxuICAgIHRoaXMudGwuYWRkVmVydGljYWxOZWlnaGJvdXIodGhpcy5ibCk7XHJcbiAgICB0aGlzLnRyLmFkZEhvcml6b250YWxOZWlnaGJvdXIodGhpcy50bCk7XHJcbiAgICB0aGlzLnRyLmFkZFZlcnRpY2FsTmVpZ2hib3VyKHRoaXMuYnIpO1xyXG4gICAgdGhpcy5ibC5hZGRIb3Jpem9udGFsTmVpZ2hib3VyKHRoaXMuYnIpO1xyXG4gICAgdGhpcy5ibC5hZGRWZXJ0aWNhbE5laWdoYm91cih0aGlzLnRsKTtcclxuICAgIHRoaXMuYnIuYWRkSG9yaXpvbnRhbE5laWdoYm91cih0aGlzLmJsKTtcclxuICAgIHRoaXMuYnIuYWRkVmVydGljYWxOZWlnaGJvdXIodGhpcy50cik7XHJcbiAgICB0aGlzLm1hcmtlcnMgPSBbdGhpcy50bCwgdGhpcy50ciwgdGhpcy5ibCwgdGhpcy5icl07XHJcblxyXG4gICAgdGhpcy5jZW50ZXIgPSBuZXcgRHJhZ01hcmtlcihcclxuICAgICAgeCArIHdpZHRoIC8gMixcclxuICAgICAgeSArIGhlaWdodCAvIDIsXHJcbiAgICAgIGNlbnRlclRvdWNoUmFkaXVzLFxyXG4gICAgICB0aGlzLmNyb3BwZXJTZXR0aW5nc1xyXG4gICAgKTtcclxuICAgIHRoaXMuYXNwZWN0UmF0aW8gPSBoZWlnaHQgLyB3aWR0aDtcclxuICAgIHRoaXMuY3JvcHBlZEltYWdlID0gbmV3IEltYWdlKCk7XHJcbiAgICB0aGlzLmN1cnJlbnRseUludGVyYWN0aW5nID0gZmFsc2U7XHJcbiAgICB0aGlzLmNyb3BXaWR0aCA9IGNyb3BwZWRXaWR0aDtcclxuICAgIHRoaXMuY3JvcEhlaWdodCA9IGNyb3BwZWRIZWlnaHQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNpZ24oeDogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIGlmICgreCA9PT0geCkge1xyXG4gICAgICByZXR1cm4geCA9PT0gMCA/IHggOiB4ID4gMCA/IDEgOiAtMTtcclxuICAgIH1cclxuICAgIHJldHVybiBOYU47XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldE1vdXNlUG9zKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsIGV2dDogTW91c2VFdmVudCk6IFBvaW50IHtcclxuICAgIGNvbnN0IHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICByZXR1cm4gbmV3IFBvaW50UG9vbCgpLmluc3RhbmNlLmJvcnJvdyhcclxuICAgICAgZXZ0LmNsaWVudFggLSByZWN0LmxlZnQsXHJcbiAgICAgIGV2dC5jbGllbnRZIC0gcmVjdC50b3BcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldFRvdWNoUG9zKGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsIHRvdWNoOiBUb3VjaCk6IFBvaW50IHtcclxuICAgIGNvbnN0IHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICByZXR1cm4gbmV3IFBvaW50UG9vbCgpLmluc3RhbmNlLmJvcnJvdyhcclxuICAgICAgdG91Y2guY2xpZW50WCAtIHJlY3QubGVmdCxcclxuICAgICAgdG91Y2guY2xpZW50WSAtIHJlY3QudG9wXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBkZXRlY3RWZXJ0aWNhbFNxdWFzaChcclxuICAgIGltZzogSFRNTEltYWdlRWxlbWVudCB8IEhUTUxDYW52YXNFbGVtZW50IHwgSFRNTFZpZGVvRWxlbWVudFxyXG4gICkge1xyXG4gICAgY29uc3QgaWggPSBpbWcuaGVpZ2h0O1xyXG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcbiAgICBjYW52YXMud2lkdGggPSAxO1xyXG4gICAgY2FudmFzLmhlaWdodCA9IGloO1xyXG4gICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJykgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gICAgY3R4LmRyYXdJbWFnZShpbWcsIDAsIDApO1xyXG4gICAgY29uc3QgaW1hZ2VEYXRhOiBhbnkgPSBjdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIDEsIGloKTtcclxuICAgIGlmIChpbWFnZURhdGEpIHtcclxuICAgICAgY29uc3QgZGF0YSA9IGltYWdlRGF0YS5kYXRhO1xyXG4gICAgICAvLyBzZWFyY2ggaW1hZ2UgZWRnZSBwaXhlbCBwb3NpdGlvbiBpbiBjYXNlIGl0IGlzIHNxdWFzaGVkIHZlcnRpY2FsbHkuXHJcbiAgICAgIGxldCBzeSA9IDA7XHJcbiAgICAgIGxldCBleSA9IGloO1xyXG4gICAgICBsZXQgcHkgPSBpaDtcclxuICAgICAgd2hpbGUgKHB5ID4gc3kpIHtcclxuICAgICAgICBjb25zdCBhbHBoYSA9IGRhdGFbKHB5IC0gMSkgKiA0ICsgM107XHJcbiAgICAgICAgaWYgKGFscGhhID09PSAwKSB7XHJcbiAgICAgICAgICBleSA9IHB5O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzeSA9IHB5O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYml0d2lzZVxyXG4gICAgICAgIHB5ID0gKGV5ICsgc3kpID4+IDE7XHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgcmF0aW8gPSBweSAvIGloO1xyXG4gICAgICByZXR1cm4gcmF0aW8gPT09IDAgPyAxIDogcmF0aW87XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gMTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0RGF0YVVyaU1pbWVUeXBlKGRhdGFVcmk6IHN0cmluZykge1xyXG4gICAgLy8gR2V0IGEgc3Vic3RyaW5nIGJlY2F1c2UgdGhlIHJlZ2V4IGRvZXMgbm90IHBlcmZvcm0gd2VsbCBvbiB2ZXJ5IGxhcmdlIHN0cmluZ3MuXHJcbiAgICAvLyBDYXRlciBmb3Igb3B0aW9uYWwgY2hhcnNldC4gTGVuZ3RoIDUwIHNob291bGQgYmUgZW5vdWdoLlxyXG4gICAgY29uc3QgZGF0YVVyaVN1YnN0cmluZyA9IGRhdGFVcmkuc3Vic3RyaW5nKDAsIDUwKTtcclxuICAgIGxldCBtaW1lVHlwZSA9ICdpbWFnZS9wbmcnO1xyXG4gICAgLy8gZGF0YS11cmkgc2NoZW1lXHJcbiAgICAvLyBkYXRhOls8bWVkaWEgdHlwZT5dWztjaGFyc2V0PTxjaGFyYWN0ZXIgc2V0Pl1bO2Jhc2U2NF0sPGRhdGE+XHJcbiAgICBjb25zdCByZWdFeCA9IFJlZ0V4cChcclxuICAgICAgL14oZGF0YTopKFtcXHdcXC9cXCtdKyk7KGNoYXJzZXQ9W1xcdy1dK3xiYXNlNjQpLiosKC4qKS9naVxyXG4gICAgKTtcclxuICAgIGNvbnN0IG1hdGNoZXMgPSByZWdFeC5leGVjKGRhdGFVcmlTdWJzdHJpbmcpO1xyXG4gICAgaWYgKG1hdGNoZXMgJiYgbWF0Y2hlc1syXSkge1xyXG4gICAgICBtaW1lVHlwZSA9IG1hdGNoZXNbMl07XHJcbiAgICAgIGlmIChtaW1lVHlwZSA9PT0gJ2ltYWdlL2pwZycpIHtcclxuICAgICAgICBtaW1lVHlwZSA9ICdpbWFnZS9qcGVnJztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG1pbWVUeXBlO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHByZXBhcmUoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCkge1xyXG4gICAgdGhpcy5idWZmZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgIHRoaXMuY3JvcENhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG5cclxuICAgIC8vIHRvZG8gZ2V0IG1vcmUgcmVsaWFibGUgcGFyZW50IHdpZHRoIHZhbHVlLlxyXG4gICAgY29uc3QgcmVzcG9uc2l2ZVdpZHRoOiBudW1iZXIgPSBjYW52YXMucGFyZW50RWxlbWVudFxyXG4gICAgICA/IGNhbnZhcy5wYXJlbnRFbGVtZW50LmNsaWVudFdpZHRoXHJcbiAgICAgIDogMDtcclxuICAgIGlmIChyZXNwb25zaXZlV2lkdGggPiAwICYmIHRoaXMuY3JvcHBlclNldHRpbmdzLmR5bmFtaWNTaXppbmcpIHtcclxuICAgICAgdGhpcy5jcm9wQ2FudmFzLndpZHRoID0gcmVzcG9uc2l2ZVdpZHRoO1xyXG4gICAgICB0aGlzLmJ1ZmZlci53aWR0aCA9IHJlc3BvbnNpdmVXaWR0aDtcclxuICAgICAgY2FudmFzLndpZHRoID0gcmVzcG9uc2l2ZVdpZHRoO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5jcm9wQ2FudmFzLndpZHRoID0gdGhpcy5jcm9wV2lkdGg7XHJcbiAgICAgIHRoaXMuYnVmZmVyLndpZHRoID0gY2FudmFzLndpZHRoO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY3JvcENhbnZhcy5oZWlnaHQgPSB0aGlzLmNyb3BIZWlnaHQ7XHJcbiAgICB0aGlzLmJ1ZmZlci5oZWlnaHQgPSBjYW52YXMuaGVpZ2h0O1xyXG4gICAgdGhpcy5jYW52YXMgPSBjYW52YXM7XHJcbiAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJykgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG5cclxuICAgIHRoaXMuZHJhdyh0aGlzLmN0eCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdXBkYXRlU2V0dGluZ3MoY3JvcHBlclNldHRpbmdzOiBDcm9wcGVyU2V0dGluZ3MpIHtcclxuICAgIHRoaXMuY3JvcHBlclNldHRpbmdzID0gY3JvcHBlclNldHRpbmdzO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHJlc2l6ZUNhbnZhcyhcclxuICAgIHdpZHRoOiBudW1iZXIsXHJcbiAgICBoZWlnaHQ6IG51bWJlcixcclxuICAgIHNldEltYWdlOiBib29sZWFuID0gZmFsc2VcclxuICApOiB2b2lkIHtcclxuICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy5jcm9wQ2FudmFzLndpZHRoID0gdGhpcy53aWR0aCA9IHRoaXMuY2FudmFzV2lkdGggPSB0aGlzLmJ1ZmZlci53aWR0aCA9IHdpZHRoO1xyXG4gICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5jcm9wQ2FudmFzLmhlaWdodCA9IHRoaXMuaGVpZ2h0ID0gdGhpcy5jYW52YXNIZWlnaHQgPSB0aGlzLmJ1ZmZlci5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICBpZiAoc2V0SW1hZ2UpIHtcclxuICAgICAgdGhpcy5zZXRJbWFnZSh0aGlzLnNyY0ltYWdlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyByZXNldCgpOiB2b2lkIHtcclxuICAgIHRoaXMuc2V0SW1hZ2UodW5kZWZpbmVkKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBkcmF3KGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTogdm9pZCB7XHJcbiAgICBjb25zdCBib3VuZHM6IEJvdW5kcyA9IHRoaXMuZ2V0Qm91bmRzKCk7XHJcbiAgICBpZiAodGhpcy5zcmNJbWFnZSkge1xyXG4gICAgICBjdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMuY2FudmFzV2lkdGgsIHRoaXMuY2FudmFzSGVpZ2h0KTtcclxuICAgICAgY29uc3Qgc291cmNlQXNwZWN0OiBudW1iZXIgPSB0aGlzLnNyY0ltYWdlLmhlaWdodCAvIHRoaXMuc3JjSW1hZ2Uud2lkdGg7XHJcbiAgICAgIGNvbnN0IGNhbnZhc0FzcGVjdDogbnVtYmVyID0gdGhpcy5jYW52YXNIZWlnaHQgLyB0aGlzLmNhbnZhc1dpZHRoO1xyXG4gICAgICBsZXQgdzogbnVtYmVyID0gdGhpcy5jYW52YXNXaWR0aDtcclxuICAgICAgbGV0IGg6IG51bWJlciA9IHRoaXMuY2FudmFzSGVpZ2h0O1xyXG4gICAgICBpZiAoY2FudmFzQXNwZWN0ID4gc291cmNlQXNwZWN0KSB7XHJcbiAgICAgICAgdyA9IHRoaXMuY2FudmFzV2lkdGg7XHJcbiAgICAgICAgaCA9IHRoaXMuY2FudmFzV2lkdGggKiBzb3VyY2VBc3BlY3Q7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaCA9IHRoaXMuY2FudmFzSGVpZ2h0O1xyXG4gICAgICAgIHcgPSB0aGlzLmNhbnZhc0hlaWdodCAvIHNvdXJjZUFzcGVjdDtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnJhdGlvVyA9IHcgLyB0aGlzLnNyY0ltYWdlLndpZHRoO1xyXG4gICAgICB0aGlzLnJhdGlvSCA9IGggLyB0aGlzLnNyY0ltYWdlLmhlaWdodDtcclxuICAgICAgaWYgKGNhbnZhc0FzcGVjdCA8IHNvdXJjZUFzcGVjdCkge1xyXG4gICAgICAgIHRoaXMuZHJhd0ltYWdlSU9TRml4KFxyXG4gICAgICAgICAgY3R4LFxyXG4gICAgICAgICAgdGhpcy5zcmNJbWFnZSxcclxuICAgICAgICAgIDAsXHJcbiAgICAgICAgICAwLFxyXG4gICAgICAgICAgdGhpcy5zcmNJbWFnZS53aWR0aCxcclxuICAgICAgICAgIHRoaXMuc3JjSW1hZ2UuaGVpZ2h0LFxyXG4gICAgICAgICAgdGhpcy5idWZmZXIud2lkdGggLyAyIC0gdyAvIDIsXHJcbiAgICAgICAgICAwLFxyXG4gICAgICAgICAgdyxcclxuICAgICAgICAgIGhcclxuICAgICAgICApO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuZHJhd0ltYWdlSU9TRml4KFxyXG4gICAgICAgICAgY3R4LFxyXG4gICAgICAgICAgdGhpcy5zcmNJbWFnZSxcclxuICAgICAgICAgIDAsXHJcbiAgICAgICAgICAwLFxyXG4gICAgICAgICAgdGhpcy5zcmNJbWFnZS53aWR0aCxcclxuICAgICAgICAgIHRoaXMuc3JjSW1hZ2UuaGVpZ2h0LFxyXG4gICAgICAgICAgMCxcclxuICAgICAgICAgIHRoaXMuYnVmZmVyLmhlaWdodCAvIDIgLSBoIC8gMixcclxuICAgICAgICAgIHcsXHJcbiAgICAgICAgICBoXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgICAodGhpcy5idWZmZXIuZ2V0Q29udGV4dCgnMmQnKSBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpLmRyYXdJbWFnZShcclxuICAgICAgICB0aGlzLmNhbnZhcyxcclxuICAgICAgICAwLFxyXG4gICAgICAgIDAsXHJcbiAgICAgICAgdGhpcy5jYW52YXNXaWR0aCxcclxuICAgICAgICB0aGlzLmNhbnZhc0hlaWdodFxyXG4gICAgICApO1xyXG5cclxuICAgICAgY3R4LmxpbmVXaWR0aCA9IHRoaXMuY3JvcHBlclNldHRpbmdzLmNyb3BwZXJEcmF3U2V0dGluZ3Muc3Ryb2tlV2lkdGg7XHJcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuY3JvcHBlclNldHRpbmdzLmNyb3BwZXJEcmF3U2V0dGluZ3Muc3Ryb2tlQ29sb3I7XHJcblxyXG4gICAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5jcm9wcGVyU2V0dGluZ3MuY3JvcHBlckRyYXdTZXR0aW5ncy5iYWNrZ3JvdW5kRmlsbENvbG9yO1xyXG4gICAgICBpZiAoIXRoaXMuY3JvcHBlclNldHRpbmdzLnJvdW5kZWQpIHtcclxuICAgICAgICBjdHguZmlsbFJlY3QoMCwgMCwgdGhpcy5jYW52YXNXaWR0aCwgdGhpcy5jYW52YXNIZWlnaHQpO1xyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoXHJcbiAgICAgICAgICB0aGlzLmJ1ZmZlcixcclxuICAgICAgICAgIGJvdW5kcy5sZWZ0LFxyXG4gICAgICAgICAgYm91bmRzLnRvcCxcclxuICAgICAgICAgIE1hdGgubWF4KGJvdW5kcy53aWR0aCwgMSksXHJcbiAgICAgICAgICBNYXRoLm1heChib3VuZHMuaGVpZ2h0LCAxKSxcclxuICAgICAgICAgIGJvdW5kcy5sZWZ0LFxyXG4gICAgICAgICAgYm91bmRzLnRvcCxcclxuICAgICAgICAgIGJvdW5kcy53aWR0aCxcclxuICAgICAgICAgIGJvdW5kcy5oZWlnaHRcclxuICAgICAgICApO1xyXG4gICAgICAgIGN0eC5zdHJva2VSZWN0KGJvdW5kcy5sZWZ0LCBib3VuZHMudG9wLCBib3VuZHMud2lkdGgsIGJvdW5kcy5oZWlnaHQpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICBjdHguc2F2ZSgpO1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgICAgICBjdHguYXJjKFxyXG4gICAgICAgICAgYm91bmRzLmxlZnQgKyBib3VuZHMud2lkdGggLyAyLFxyXG4gICAgICAgICAgYm91bmRzLnRvcCArIGJvdW5kcy5oZWlnaHQgLyAyLFxyXG4gICAgICAgICAgYm91bmRzLndpZHRoIC8gMixcclxuICAgICAgICAgIDAsXHJcbiAgICAgICAgICAyICogTWF0aC5QSVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgICAgIGN0eC5jbGlwKCk7XHJcbiAgICAgICAgaWYgKGNhbnZhc0FzcGVjdCA8IHNvdXJjZUFzcGVjdCkge1xyXG4gICAgICAgICAgdGhpcy5kcmF3SW1hZ2VJT1NGaXgoXHJcbiAgICAgICAgICAgIGN0eCxcclxuICAgICAgICAgICAgdGhpcy5zcmNJbWFnZSxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgdGhpcy5zcmNJbWFnZS53aWR0aCxcclxuICAgICAgICAgICAgdGhpcy5zcmNJbWFnZS5oZWlnaHQsXHJcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyLndpZHRoIC8gMiAtIHcgLyAyLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICB3LFxyXG4gICAgICAgICAgICBoXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmRyYXdJbWFnZUlPU0ZpeChcclxuICAgICAgICAgICAgY3R4LFxyXG4gICAgICAgICAgICB0aGlzLnNyY0ltYWdlLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICAwLFxyXG4gICAgICAgICAgICB0aGlzLnNyY0ltYWdlLndpZHRoLFxyXG4gICAgICAgICAgICB0aGlzLnNyY0ltYWdlLmhlaWdodCxcclxuICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgdGhpcy5idWZmZXIuaGVpZ2h0IC8gMiAtIGggLyAyLFxyXG4gICAgICAgICAgICB3LFxyXG4gICAgICAgICAgICBoXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjdHgucmVzdG9yZSgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgbWFya2VyOiBDb3JuZXJNYXJrZXI7XHJcblxyXG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cHJlZmVyLWZvci1vZlxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubWFya2Vycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIG1hcmtlciA9IHRoaXMubWFya2Vyc1tpXTtcclxuICAgICAgICBtYXJrZXIuZHJhdyhjdHgpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuY2VudGVyLmRyYXcoY3R4KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSgxOTIsMTkyLDE5MiwxKSc7XHJcbiAgICAgIGN0eC5maWxsUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBkcmFnQ2VudGVyKHg6IG51bWJlciwgeTogbnVtYmVyLCBtYXJrZXI6IERyYWdNYXJrZXIpIHtcclxuICAgIGNvbnN0IGJvdW5kcyA9IHRoaXMuZ2V0Qm91bmRzKCk7XHJcbiAgICBjb25zdCBsZWZ0ID0geCAtIGJvdW5kcy53aWR0aCAvIDI7XHJcbiAgICBjb25zdCByaWdodCA9IHggKyBib3VuZHMud2lkdGggLyAyO1xyXG4gICAgY29uc3QgdG9wID0geSAtIGJvdW5kcy5oZWlnaHQgLyAyO1xyXG4gICAgY29uc3QgYm90dG9tID0geSArIGJvdW5kcy5oZWlnaHQgLyAyO1xyXG4gICAgaWYgKHJpZ2h0ID49IHRoaXMubWF4WENsYW1wKSB7XHJcbiAgICAgIHggPSB0aGlzLm1heFhDbGFtcCAtIGJvdW5kcy53aWR0aCAvIDI7XHJcbiAgICB9XHJcbiAgICBpZiAobGVmdCA8PSB0aGlzLm1pblhDbGFtcCkge1xyXG4gICAgICB4ID0gYm91bmRzLndpZHRoIC8gMiArIHRoaXMubWluWENsYW1wO1xyXG4gICAgfVxyXG4gICAgaWYgKHRvcCA8IHRoaXMubWluWUNsYW1wKSB7XHJcbiAgICAgIHkgPSBib3VuZHMuaGVpZ2h0IC8gMiArIHRoaXMubWluWUNsYW1wO1xyXG4gICAgfVxyXG4gICAgaWYgKGJvdHRvbSA+PSB0aGlzLm1heFlDbGFtcCkge1xyXG4gICAgICB5ID0gdGhpcy5tYXhZQ2xhbXAgLSBib3VuZHMuaGVpZ2h0IC8gMjtcclxuICAgIH1cclxuICAgIHRoaXMudGwubW92ZVgoeCAtIGJvdW5kcy53aWR0aCAvIDIpO1xyXG4gICAgdGhpcy50bC5tb3ZlWSh5IC0gYm91bmRzLmhlaWdodCAvIDIpO1xyXG4gICAgdGhpcy50ci5tb3ZlWCh4ICsgYm91bmRzLndpZHRoIC8gMik7XHJcbiAgICB0aGlzLnRyLm1vdmVZKHkgLSBib3VuZHMuaGVpZ2h0IC8gMik7XHJcbiAgICB0aGlzLmJsLm1vdmVYKHggLSBib3VuZHMud2lkdGggLyAyKTtcclxuICAgIHRoaXMuYmwubW92ZVkoeSArIGJvdW5kcy5oZWlnaHQgLyAyKTtcclxuICAgIHRoaXMuYnIubW92ZVgoeCArIGJvdW5kcy53aWR0aCAvIDIpO1xyXG4gICAgdGhpcy5ici5tb3ZlWSh5ICsgYm91bmRzLmhlaWdodCAvIDIpO1xyXG4gICAgbWFya2VyLnNldFBvc2l0aW9uKHgsIHkpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGVuZm9yY2VNaW5TaXplKHg6IG51bWJlciwgeTogbnVtYmVyLCBtYXJrZXI6IENvcm5lck1hcmtlcikge1xyXG4gICAgY29uc3QgeExlbmd0aCA9IHggLSBtYXJrZXIuZ2V0SG9yaXpvbnRhbE5laWdoYm91cigpLnBvc2l0aW9uLng7XHJcbiAgICBjb25zdCB5TGVuZ3RoID0geSAtIG1hcmtlci5nZXRWZXJ0aWNhbE5laWdoYm91cigpLnBvc2l0aW9uLnk7XHJcbiAgICBjb25zdCB4T3ZlciA9IHRoaXMubWluV2lkdGggLSBNYXRoLmFicyh4TGVuZ3RoKTtcclxuICAgIGNvbnN0IHlPdmVyID0gdGhpcy5taW5IZWlnaHQgLSBNYXRoLmFicyh5TGVuZ3RoKTtcclxuXHJcbiAgICBpZiAoeExlbmd0aCA9PT0gMCB8fCB5TGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHggPSBtYXJrZXIucG9zaXRpb24ueDtcclxuICAgICAgeSA9IG1hcmtlci5wb3NpdGlvbi55O1xyXG5cclxuICAgICAgcmV0dXJuIG5ldyBQb2ludFBvb2woKS5pbnN0YW5jZS5ib3Jyb3coeCwgeSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMua2VlcEFzcGVjdCkge1xyXG4gICAgICBpZiAoeE92ZXIgPiAwICYmIHlPdmVyIC8gdGhpcy5hc3BlY3RSYXRpbyA+IDApIHtcclxuICAgICAgICBpZiAoeE92ZXIgPiB5T3ZlciAvIHRoaXMuYXNwZWN0UmF0aW8pIHtcclxuICAgICAgICAgIGlmICh4TGVuZ3RoIDwgMCkge1xyXG4gICAgICAgICAgICB4IC09IHhPdmVyO1xyXG5cclxuICAgICAgICAgICAgaWYgKHlMZW5ndGggPCAwKSB7XHJcbiAgICAgICAgICAgICAgeSAtPSB4T3ZlciAqIHRoaXMuYXNwZWN0UmF0aW87XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgeSArPSB4T3ZlciAqIHRoaXMuYXNwZWN0UmF0aW87XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHggKz0geE92ZXI7XHJcbiAgICAgICAgICAgIGlmICh5TGVuZ3RoIDwgMCkge1xyXG4gICAgICAgICAgICAgIHkgLT0geE92ZXIgKiB0aGlzLmFzcGVjdFJhdGlvO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHkgKz0geE92ZXIgKiB0aGlzLmFzcGVjdFJhdGlvO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmICh5TGVuZ3RoIDwgMCkge1xyXG4gICAgICAgICAgICB5IC09IHlPdmVyO1xyXG5cclxuICAgICAgICAgICAgaWYgKHhMZW5ndGggPCAwKSB7XHJcbiAgICAgICAgICAgICAgeCAtPSB5T3ZlciAvIHRoaXMuYXNwZWN0UmF0aW87XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgeCArPSB5T3ZlciAvIHRoaXMuYXNwZWN0UmF0aW87XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHkgKz0geU92ZXI7XHJcbiAgICAgICAgICAgIGlmICh4TGVuZ3RoIDwgMCkge1xyXG4gICAgICAgICAgICAgIHggLT0geU92ZXIgLyB0aGlzLmFzcGVjdFJhdGlvO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHggKz0geU92ZXIgLyB0aGlzLmFzcGVjdFJhdGlvO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICh4T3ZlciA+IDApIHtcclxuICAgICAgICAgIGlmICh4TGVuZ3RoIDwgMCkge1xyXG4gICAgICAgICAgICB4IC09IHhPdmVyO1xyXG4gICAgICAgICAgICBpZiAoeUxlbmd0aCA8IDApIHtcclxuICAgICAgICAgICAgICB5IC09IHhPdmVyICogdGhpcy5hc3BlY3RSYXRpbztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB5ICs9IHhPdmVyICogdGhpcy5hc3BlY3RSYXRpbztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgeCArPSB4T3ZlcjtcclxuICAgICAgICAgICAgaWYgKHlMZW5ndGggPCAwKSB7XHJcbiAgICAgICAgICAgICAgeSAtPSB4T3ZlciAqIHRoaXMuYXNwZWN0UmF0aW87XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgeSArPSB4T3ZlciAqIHRoaXMuYXNwZWN0UmF0aW87XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKHlPdmVyID4gMCkge1xyXG4gICAgICAgICAgICBpZiAoeUxlbmd0aCA8IDApIHtcclxuICAgICAgICAgICAgICB5IC09IHlPdmVyO1xyXG5cclxuICAgICAgICAgICAgICBpZiAoeExlbmd0aCA8IDApIHtcclxuICAgICAgICAgICAgICAgIHggLT0geU92ZXIgLyB0aGlzLmFzcGVjdFJhdGlvO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB4ICs9IHlPdmVyIC8gdGhpcy5hc3BlY3RSYXRpbztcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgeSArPSB5T3ZlcjtcclxuICAgICAgICAgICAgICBpZiAoeExlbmd0aCA8IDApIHtcclxuICAgICAgICAgICAgICAgIHggLT0geU92ZXIgLyB0aGlzLmFzcGVjdFJhdGlvO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB4ICs9IHlPdmVyIC8gdGhpcy5hc3BlY3RSYXRpbztcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmICh4T3ZlciA+IDApIHtcclxuICAgICAgICBpZiAoeExlbmd0aCA8IDApIHtcclxuICAgICAgICAgIHggLT0geE92ZXI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHggKz0geE92ZXI7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmICh5T3ZlciA+IDApIHtcclxuICAgICAgICBpZiAoeUxlbmd0aCA8IDApIHtcclxuICAgICAgICAgIHkgLT0geU92ZXI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHkgKz0geU92ZXI7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKFxyXG4gICAgICB4IDwgdGhpcy5taW5YQ2xhbXAgfHxcclxuICAgICAgeCA+IHRoaXMubWF4WENsYW1wIHx8XHJcbiAgICAgIHkgPCB0aGlzLm1pbllDbGFtcCB8fFxyXG4gICAgICB5ID4gdGhpcy5tYXhZQ2xhbXBcclxuICAgICkge1xyXG4gICAgICB4ID0gbWFya2VyLnBvc2l0aW9uLng7XHJcbiAgICAgIHkgPSBtYXJrZXIucG9zaXRpb24ueTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbmV3IFBvaW50UG9vbCgpLmluc3RhbmNlLmJvcnJvdyh4LCB5KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBkcmFnQ29ybmVyKHg6IG51bWJlciwgeTogbnVtYmVyLCBtYXJrZXI6IENvcm5lck1hcmtlcikge1xyXG4gICAgbGV0IGlYID0gMDtcclxuICAgIGxldCBpWSA9IDA7XHJcbiAgICBsZXQgYXggPSAwO1xyXG4gICAgbGV0IGF5ID0gMDtcclxuICAgIGxldCBuZXdIZWlnaHQgPSAwO1xyXG4gICAgbGV0IG5ld1dpZHRoID0gMDtcclxuICAgIGxldCBuZXdZID0gMDtcclxuICAgIGxldCBuZXdYID0gMDtcclxuICAgIGxldCBhbmNob3JNYXJrZXI6IENvcm5lck1hcmtlcjtcclxuICAgIGxldCBmb2xkID0gMDtcclxuXHJcbiAgICBpZiAodGhpcy5rZWVwQXNwZWN0KSB7XHJcbiAgICAgIGFuY2hvck1hcmtlciA9IG1hcmtlci5nZXRIb3Jpem9udGFsTmVpZ2hib3VyKCkuZ2V0VmVydGljYWxOZWlnaGJvdXIoKTtcclxuICAgICAgYXggPSBhbmNob3JNYXJrZXIucG9zaXRpb24ueDtcclxuICAgICAgYXkgPSBhbmNob3JNYXJrZXIucG9zaXRpb24ueTtcclxuICAgICAgaWYgKHggPD0gYW5jaG9yTWFya2VyLnBvc2l0aW9uLngpIHtcclxuICAgICAgICBpZiAoeSA8PSBhbmNob3JNYXJrZXIucG9zaXRpb24ueSkge1xyXG4gICAgICAgICAgaVggPSBheCAtIDEwMCAvIHRoaXMuYXNwZWN0UmF0aW87XHJcbiAgICAgICAgICBpWSA9IGF5IC0gKDEwMCAvIHRoaXMuYXNwZWN0UmF0aW8pICogdGhpcy5hc3BlY3RSYXRpbztcclxuICAgICAgICAgIGZvbGQgPSB0aGlzLmdldFNpZGUoXHJcbiAgICAgICAgICAgIG5ldyBQb2ludFBvb2woKS5pbnN0YW5jZS5ib3Jyb3coaVgsIGlZKSxcclxuICAgICAgICAgICAgYW5jaG9yTWFya2VyLnBvc2l0aW9uLFxyXG4gICAgICAgICAgICBuZXcgUG9pbnRQb29sKCkuaW5zdGFuY2UuYm9ycm93KHgsIHkpXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgICAgaWYgKGZvbGQgPiAwKSB7XHJcbiAgICAgICAgICAgIG5ld0hlaWdodCA9IE1hdGguYWJzKGFuY2hvck1hcmtlci5wb3NpdGlvbi55IC0geSk7XHJcbiAgICAgICAgICAgIG5ld1dpZHRoID0gbmV3SGVpZ2h0IC8gdGhpcy5hc3BlY3RSYXRpbztcclxuICAgICAgICAgICAgbmV3WSA9IGFuY2hvck1hcmtlci5wb3NpdGlvbi55IC0gbmV3SGVpZ2h0O1xyXG4gICAgICAgICAgICBuZXdYID0gYW5jaG9yTWFya2VyLnBvc2l0aW9uLnggLSBuZXdXaWR0aDtcclxuICAgICAgICAgICAgY29uc3QgbWluID0gdGhpcy5lbmZvcmNlTWluU2l6ZShuZXdYLCBuZXdZLCBtYXJrZXIpO1xyXG4gICAgICAgICAgICBtYXJrZXIubW92ZShtaW4ueCwgbWluLnkpO1xyXG4gICAgICAgICAgICBuZXcgUG9pbnRQb29sKCkuaW5zdGFuY2UucmV0dXJuUG9pbnQobWluKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChmb2xkIDwgMCkge1xyXG4gICAgICAgICAgICAgIG5ld1dpZHRoID0gTWF0aC5hYnMoYW5jaG9yTWFya2VyLnBvc2l0aW9uLnggLSB4KTtcclxuICAgICAgICAgICAgICBuZXdIZWlnaHQgPSBuZXdXaWR0aCAqIHRoaXMuYXNwZWN0UmF0aW87XHJcbiAgICAgICAgICAgICAgbmV3WSA9IGFuY2hvck1hcmtlci5wb3NpdGlvbi55IC0gbmV3SGVpZ2h0O1xyXG4gICAgICAgICAgICAgIG5ld1ggPSBhbmNob3JNYXJrZXIucG9zaXRpb24ueCAtIG5ld1dpZHRoO1xyXG4gICAgICAgICAgICAgIGNvbnN0IG1pbiA9IHRoaXMuZW5mb3JjZU1pblNpemUobmV3WCwgbmV3WSwgbWFya2VyKTtcclxuICAgICAgICAgICAgICBtYXJrZXIubW92ZShtaW4ueCwgbWluLnkpO1xyXG4gICAgICAgICAgICAgIG5ldyBQb2ludFBvb2woKS5pbnN0YW5jZS5yZXR1cm5Qb2ludChtaW4pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlYID0gYXggLSAxMDAgLyB0aGlzLmFzcGVjdFJhdGlvO1xyXG4gICAgICAgICAgaVkgPSBheSArICgxMDAgLyB0aGlzLmFzcGVjdFJhdGlvKSAqIHRoaXMuYXNwZWN0UmF0aW87XHJcbiAgICAgICAgICBmb2xkID0gdGhpcy5nZXRTaWRlKFxyXG4gICAgICAgICAgICBuZXcgUG9pbnRQb29sKCkuaW5zdGFuY2UuYm9ycm93KGlYLCBpWSksXHJcbiAgICAgICAgICAgIGFuY2hvck1hcmtlci5wb3NpdGlvbixcclxuICAgICAgICAgICAgbmV3IFBvaW50UG9vbCgpLmluc3RhbmNlLmJvcnJvdyh4LCB5KVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICAgIGlmIChmb2xkID4gMCkge1xyXG4gICAgICAgICAgICBuZXdXaWR0aCA9IE1hdGguYWJzKGFuY2hvck1hcmtlci5wb3NpdGlvbi54IC0geCk7XHJcbiAgICAgICAgICAgIG5ld0hlaWdodCA9IG5ld1dpZHRoICogdGhpcy5hc3BlY3RSYXRpbztcclxuICAgICAgICAgICAgbmV3WSA9IGFuY2hvck1hcmtlci5wb3NpdGlvbi55ICsgbmV3SGVpZ2h0O1xyXG4gICAgICAgICAgICBuZXdYID0gYW5jaG9yTWFya2VyLnBvc2l0aW9uLnggLSBuZXdXaWR0aDtcclxuICAgICAgICAgICAgY29uc3QgbWluID0gdGhpcy5lbmZvcmNlTWluU2l6ZShuZXdYLCBuZXdZLCBtYXJrZXIpO1xyXG4gICAgICAgICAgICBtYXJrZXIubW92ZShtaW4ueCwgbWluLnkpO1xyXG4gICAgICAgICAgICBuZXcgUG9pbnRQb29sKCkuaW5zdGFuY2UucmV0dXJuUG9pbnQobWluKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChmb2xkIDwgMCkge1xyXG4gICAgICAgICAgICAgIG5ld0hlaWdodCA9IE1hdGguYWJzKGFuY2hvck1hcmtlci5wb3NpdGlvbi55IC0geSk7XHJcbiAgICAgICAgICAgICAgbmV3V2lkdGggPSBuZXdIZWlnaHQgLyB0aGlzLmFzcGVjdFJhdGlvO1xyXG4gICAgICAgICAgICAgIG5ld1kgPSBhbmNob3JNYXJrZXIucG9zaXRpb24ueSArIG5ld0hlaWdodDtcclxuICAgICAgICAgICAgICBuZXdYID0gYW5jaG9yTWFya2VyLnBvc2l0aW9uLnggLSBuZXdXaWR0aDtcclxuICAgICAgICAgICAgICBjb25zdCBtaW4gPSB0aGlzLmVuZm9yY2VNaW5TaXplKG5ld1gsIG5ld1ksIG1hcmtlcik7XHJcbiAgICAgICAgICAgICAgbWFya2VyLm1vdmUobWluLngsIG1pbi55KTtcclxuICAgICAgICAgICAgICBuZXcgUG9pbnRQb29sKCkuaW5zdGFuY2UucmV0dXJuUG9pbnQobWluKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoeSA8PSBhbmNob3JNYXJrZXIucG9zaXRpb24ueSkge1xyXG4gICAgICAgICAgaVggPSBheCArIDEwMCAvIHRoaXMuYXNwZWN0UmF0aW87XHJcbiAgICAgICAgICBpWSA9IGF5IC0gKDEwMCAvIHRoaXMuYXNwZWN0UmF0aW8pICogdGhpcy5hc3BlY3RSYXRpbztcclxuICAgICAgICAgIGZvbGQgPSB0aGlzLmdldFNpZGUoXHJcbiAgICAgICAgICAgIG5ldyBQb2ludFBvb2woKS5pbnN0YW5jZS5ib3Jyb3coaVgsIGlZKSxcclxuICAgICAgICAgICAgYW5jaG9yTWFya2VyLnBvc2l0aW9uLFxyXG4gICAgICAgICAgICBuZXcgUG9pbnRQb29sKCkuaW5zdGFuY2UuYm9ycm93KHgsIHkpXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgICAgaWYgKGZvbGQgPCAwKSB7XHJcbiAgICAgICAgICAgIG5ld0hlaWdodCA9IE1hdGguYWJzKGFuY2hvck1hcmtlci5wb3NpdGlvbi55IC0geSk7XHJcbiAgICAgICAgICAgIG5ld1dpZHRoID0gbmV3SGVpZ2h0IC8gdGhpcy5hc3BlY3RSYXRpbztcclxuICAgICAgICAgICAgbmV3WSA9IGFuY2hvck1hcmtlci5wb3NpdGlvbi55IC0gbmV3SGVpZ2h0O1xyXG4gICAgICAgICAgICBuZXdYID0gYW5jaG9yTWFya2VyLnBvc2l0aW9uLnggKyBuZXdXaWR0aDtcclxuICAgICAgICAgICAgY29uc3QgbWluID0gdGhpcy5lbmZvcmNlTWluU2l6ZShuZXdYLCBuZXdZLCBtYXJrZXIpO1xyXG4gICAgICAgICAgICBtYXJrZXIubW92ZShtaW4ueCwgbWluLnkpO1xyXG4gICAgICAgICAgICBuZXcgUG9pbnRQb29sKCkuaW5zdGFuY2UucmV0dXJuUG9pbnQobWluKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChmb2xkID4gMCkge1xyXG4gICAgICAgICAgICAgIG5ld1dpZHRoID0gTWF0aC5hYnMoYW5jaG9yTWFya2VyLnBvc2l0aW9uLnggLSB4KTtcclxuICAgICAgICAgICAgICBuZXdIZWlnaHQgPSBuZXdXaWR0aCAqIHRoaXMuYXNwZWN0UmF0aW87XHJcbiAgICAgICAgICAgICAgbmV3WSA9IGFuY2hvck1hcmtlci5wb3NpdGlvbi55IC0gbmV3SGVpZ2h0O1xyXG4gICAgICAgICAgICAgIG5ld1ggPSBhbmNob3JNYXJrZXIucG9zaXRpb24ueCArIG5ld1dpZHRoO1xyXG4gICAgICAgICAgICAgIGNvbnN0IG1pbiA9IHRoaXMuZW5mb3JjZU1pblNpemUobmV3WCwgbmV3WSwgbWFya2VyKTtcclxuICAgICAgICAgICAgICBtYXJrZXIubW92ZShtaW4ueCwgbWluLnkpO1xyXG4gICAgICAgICAgICAgIG5ldyBQb2ludFBvb2woKS5pbnN0YW5jZS5yZXR1cm5Qb2ludChtaW4pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlYID0gYXggKyAxMDAgLyB0aGlzLmFzcGVjdFJhdGlvO1xyXG4gICAgICAgICAgaVkgPSBheSArICgxMDAgLyB0aGlzLmFzcGVjdFJhdGlvKSAqIHRoaXMuYXNwZWN0UmF0aW87XHJcbiAgICAgICAgICBmb2xkID0gdGhpcy5nZXRTaWRlKFxyXG4gICAgICAgICAgICBuZXcgUG9pbnRQb29sKCkuaW5zdGFuY2UuYm9ycm93KGlYLCBpWSksXHJcbiAgICAgICAgICAgIGFuY2hvck1hcmtlci5wb3NpdGlvbixcclxuICAgICAgICAgICAgbmV3IFBvaW50UG9vbCgpLmluc3RhbmNlLmJvcnJvdyh4LCB5KVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICAgIGlmIChmb2xkIDwgMCkge1xyXG4gICAgICAgICAgICBuZXdXaWR0aCA9IE1hdGguYWJzKGFuY2hvck1hcmtlci5wb3NpdGlvbi54IC0geCk7XHJcbiAgICAgICAgICAgIG5ld0hlaWdodCA9IG5ld1dpZHRoICogdGhpcy5hc3BlY3RSYXRpbztcclxuICAgICAgICAgICAgbmV3WSA9IGFuY2hvck1hcmtlci5wb3NpdGlvbi55ICsgbmV3SGVpZ2h0O1xyXG4gICAgICAgICAgICBuZXdYID0gYW5jaG9yTWFya2VyLnBvc2l0aW9uLnggKyBuZXdXaWR0aDtcclxuICAgICAgICAgICAgY29uc3QgbWluID0gdGhpcy5lbmZvcmNlTWluU2l6ZShuZXdYLCBuZXdZLCBtYXJrZXIpO1xyXG4gICAgICAgICAgICBtYXJrZXIubW92ZShtaW4ueCwgbWluLnkpO1xyXG4gICAgICAgICAgICBuZXcgUG9pbnRQb29sKCkuaW5zdGFuY2UucmV0dXJuUG9pbnQobWluKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChmb2xkID4gMCkge1xyXG4gICAgICAgICAgICAgIG5ld0hlaWdodCA9IE1hdGguYWJzKGFuY2hvck1hcmtlci5wb3NpdGlvbi55IC0geSk7XHJcbiAgICAgICAgICAgICAgbmV3V2lkdGggPSBuZXdIZWlnaHQgLyB0aGlzLmFzcGVjdFJhdGlvO1xyXG4gICAgICAgICAgICAgIG5ld1kgPSBhbmNob3JNYXJrZXIucG9zaXRpb24ueSArIG5ld0hlaWdodDtcclxuICAgICAgICAgICAgICBuZXdYID0gYW5jaG9yTWFya2VyLnBvc2l0aW9uLnggKyBuZXdXaWR0aDtcclxuICAgICAgICAgICAgICBjb25zdCBtaW4gPSB0aGlzLmVuZm9yY2VNaW5TaXplKG5ld1gsIG5ld1ksIG1hcmtlcik7XHJcbiAgICAgICAgICAgICAgbWFya2VyLm1vdmUobWluLngsIG1pbi55KTtcclxuICAgICAgICAgICAgICBuZXcgUG9pbnRQb29sKCkuaW5zdGFuY2UucmV0dXJuUG9pbnQobWluKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3QgbWluID0gdGhpcy5lbmZvcmNlTWluU2l6ZSh4LCB5LCBtYXJrZXIpO1xyXG4gICAgICBtYXJrZXIubW92ZShtaW4ueCwgbWluLnkpO1xyXG4gICAgICBuZXcgUG9pbnRQb29sKCkuaW5zdGFuY2UucmV0dXJuUG9pbnQobWluKTtcclxuICAgIH1cclxuICAgIHRoaXMuY2VudGVyLnJlY2FsY3VsYXRlUG9zaXRpb24odGhpcy5nZXRCb3VuZHMoKSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0U2lkZShhOiBQb2ludCwgYjogUG9pbnQsIGM6IFBvaW50KTogbnVtYmVyIHtcclxuICAgIGNvbnN0IG46IG51bWJlciA9IHRoaXMuc2lnbihcclxuICAgICAgKGIueCAtIGEueCkgKiAoYy55IC0gYS55KSAtIChiLnkgLSBhLnkpICogKGMueCAtIGEueClcclxuICAgICk7XHJcblxyXG4gICAgLy8gVE9ETyBtb3ZlIHRoZSByZXR1cm4gb2YgdGhlIHBvb2xzIHRvIG91dHNpZGUgb2YgdGhpcyBmdW5jdGlvblxyXG4gICAgbmV3IFBvaW50UG9vbCgpLmluc3RhbmNlLnJldHVyblBvaW50KGEpO1xyXG4gICAgbmV3IFBvaW50UG9vbCgpLmluc3RhbmNlLnJldHVyblBvaW50KGMpO1xyXG4gICAgcmV0dXJuIG47XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgaGFuZGxlUmVsZWFzZShuZXdDcm9wVG91Y2g6IENyb3BUb3VjaCkge1xyXG4gICAgaWYgKG5ld0Nyb3BUb3VjaCA9PSBudWxsKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGxldCBpbmRleCA9IDA7XHJcbiAgICBmb3IgKGxldCBrID0gMDsgayA8IHRoaXMuY3VycmVudERyYWdUb3VjaGVzLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgIGlmIChuZXdDcm9wVG91Y2guaWQgPT09IHRoaXMuY3VycmVudERyYWdUb3VjaGVzW2tdLmlkKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50RHJhZ1RvdWNoZXNba10uZHJhZ0hhbmRsZS5zZXREcmFnKGZhbHNlKTtcclxuICAgICAgICBpbmRleCA9IGs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMuY3VycmVudERyYWdUb3VjaGVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICB0aGlzLmRyYXcodGhpcy5jdHgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGhhbmRsZU1vdmUobmV3Q3JvcFRvdWNoOiBDcm9wVG91Y2gpIHtcclxuICAgIGxldCBtYXRjaGVkID0gZmFsc2U7XHJcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cHJlZmVyLWZvci1vZlxyXG4gICAgZm9yIChsZXQgayA9IDA7IGsgPCB0aGlzLmN1cnJlbnREcmFnVG91Y2hlcy5sZW5ndGg7IGsrKykge1xyXG4gICAgICBpZiAoXHJcbiAgICAgICAgbmV3Q3JvcFRvdWNoLmlkID09PSB0aGlzLmN1cnJlbnREcmFnVG91Y2hlc1trXS5pZCAmJlxyXG4gICAgICAgIHRoaXMuY3VycmVudERyYWdUb3VjaGVzW2tdLmRyYWdIYW5kbGUgIT0gbnVsbFxyXG4gICAgICApIHtcclxuICAgICAgICBjb25zdCBkcmFnVG91Y2g6IENyb3BUb3VjaCA9IHRoaXMuY3VycmVudERyYWdUb3VjaGVzW2tdO1xyXG4gICAgICAgIGNvbnN0IGNsYW1wZWRQb3NpdGlvbnMgPSB0aGlzLmNsYW1wUG9zaXRpb24oXHJcbiAgICAgICAgICBuZXdDcm9wVG91Y2gueCAtIGRyYWdUb3VjaC5kcmFnSGFuZGxlLm9mZnNldC54LFxyXG4gICAgICAgICAgbmV3Q3JvcFRvdWNoLnkgLSBkcmFnVG91Y2guZHJhZ0hhbmRsZS5vZmZzZXQueVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgbmV3Q3JvcFRvdWNoLnggPSBjbGFtcGVkUG9zaXRpb25zLng7XHJcbiAgICAgICAgbmV3Q3JvcFRvdWNoLnkgPSBjbGFtcGVkUG9zaXRpb25zLnk7XHJcbiAgICAgICAgbmV3IFBvaW50UG9vbCgpLmluc3RhbmNlLnJldHVyblBvaW50KGNsYW1wZWRQb3NpdGlvbnMpO1xyXG4gICAgICAgIGlmIChkcmFnVG91Y2guZHJhZ0hhbmRsZSBpbnN0YW5jZW9mIENvcm5lck1hcmtlcikge1xyXG4gICAgICAgICAgdGhpcy5kcmFnQ29ybmVyKFxyXG4gICAgICAgICAgICBuZXdDcm9wVG91Y2gueCxcclxuICAgICAgICAgICAgbmV3Q3JvcFRvdWNoLnksXHJcbiAgICAgICAgICAgIGRyYWdUb3VjaC5kcmFnSGFuZGxlIGFzIENvcm5lck1hcmtlclxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5kcmFnQ2VudGVyKFxyXG4gICAgICAgICAgICBuZXdDcm9wVG91Y2gueCxcclxuICAgICAgICAgICAgbmV3Q3JvcFRvdWNoLnksXHJcbiAgICAgICAgICAgIGRyYWdUb3VjaC5kcmFnSGFuZGxlIGFzIERyYWdNYXJrZXJcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY3VycmVudGx5SW50ZXJhY3RpbmcgPSB0cnVlO1xyXG4gICAgICAgIG1hdGNoZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuaW1hZ2VDcm9wcGVyRGF0YVNoYXJlLnNldFByZXNzZWQodGhpcy5jYW52YXMpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoIW1hdGNoZWQpIHtcclxuICAgICAgZm9yIChjb25zdCBtYXJrZXIgb2YgdGhpcy5tYXJrZXJzKSB7XHJcbiAgICAgICAgaWYgKG1hcmtlci50b3VjaEluQm91bmRzKG5ld0Nyb3BUb3VjaC54LCBuZXdDcm9wVG91Y2gueSkpIHtcclxuICAgICAgICAgIG5ld0Nyb3BUb3VjaC5kcmFnSGFuZGxlID0gbWFya2VyO1xyXG4gICAgICAgICAgdGhpcy5jdXJyZW50RHJhZ1RvdWNoZXMucHVzaChuZXdDcm9wVG91Y2gpO1xyXG4gICAgICAgICAgbWFya2VyLnNldERyYWcodHJ1ZSk7XHJcbiAgICAgICAgICBuZXdDcm9wVG91Y2guZHJhZ0hhbmRsZS5vZmZzZXQueCA9XHJcbiAgICAgICAgICAgIG5ld0Nyb3BUb3VjaC54IC0gbmV3Q3JvcFRvdWNoLmRyYWdIYW5kbGUucG9zaXRpb24ueDtcclxuICAgICAgICAgIG5ld0Nyb3BUb3VjaC5kcmFnSGFuZGxlLm9mZnNldC55ID1cclxuICAgICAgICAgICAgbmV3Q3JvcFRvdWNoLnkgLSBuZXdDcm9wVG91Y2guZHJhZ0hhbmRsZS5wb3NpdGlvbi55O1xyXG4gICAgICAgICAgdGhpcy5kcmFnQ29ybmVyKFxyXG4gICAgICAgICAgICBuZXdDcm9wVG91Y2gueCAtIG5ld0Nyb3BUb3VjaC5kcmFnSGFuZGxlLm9mZnNldC54LFxyXG4gICAgICAgICAgICBuZXdDcm9wVG91Y2gueSAtIG5ld0Nyb3BUb3VjaC5kcmFnSGFuZGxlLm9mZnNldC55LFxyXG4gICAgICAgICAgICBuZXdDcm9wVG91Y2guZHJhZ0hhbmRsZSBhcyBDb3JuZXJNYXJrZXJcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKFxyXG4gICAgICAgIG5ld0Nyb3BUb3VjaC5kcmFnSGFuZGxlID09PSBudWxsIHx8XHJcbiAgICAgICAgdHlwZW9mIG5ld0Nyb3BUb3VjaC5kcmFnSGFuZGxlID09PSAndW5kZWZpbmVkJ1xyXG4gICAgICApIHtcclxuICAgICAgICBpZiAodGhpcy5jZW50ZXIudG91Y2hJbkJvdW5kcyhuZXdDcm9wVG91Y2gueCwgbmV3Q3JvcFRvdWNoLnkpKSB7XHJcbiAgICAgICAgICBuZXdDcm9wVG91Y2guZHJhZ0hhbmRsZSA9IHRoaXMuY2VudGVyO1xyXG4gICAgICAgICAgdGhpcy5jdXJyZW50RHJhZ1RvdWNoZXMucHVzaChuZXdDcm9wVG91Y2gpO1xyXG4gICAgICAgICAgbmV3Q3JvcFRvdWNoLmRyYWdIYW5kbGUuc2V0RHJhZyh0cnVlKTtcclxuICAgICAgICAgIG5ld0Nyb3BUb3VjaC5kcmFnSGFuZGxlLm9mZnNldC54ID1cclxuICAgICAgICAgICAgbmV3Q3JvcFRvdWNoLnggLSBuZXdDcm9wVG91Y2guZHJhZ0hhbmRsZS5wb3NpdGlvbi54O1xyXG4gICAgICAgICAgbmV3Q3JvcFRvdWNoLmRyYWdIYW5kbGUub2Zmc2V0LnkgPVxyXG4gICAgICAgICAgICBuZXdDcm9wVG91Y2gueSAtIG5ld0Nyb3BUb3VjaC5kcmFnSGFuZGxlLnBvc2l0aW9uLnk7XHJcbiAgICAgICAgICB0aGlzLmRyYWdDZW50ZXIoXHJcbiAgICAgICAgICAgIG5ld0Nyb3BUb3VjaC54IC0gbmV3Q3JvcFRvdWNoLmRyYWdIYW5kbGUub2Zmc2V0LngsXHJcbiAgICAgICAgICAgIG5ld0Nyb3BUb3VjaC55IC0gbmV3Q3JvcFRvdWNoLmRyYWdIYW5kbGUub2Zmc2V0LnksXHJcbiAgICAgICAgICAgIG5ld0Nyb3BUb3VjaC5kcmFnSGFuZGxlIGFzIERyYWdNYXJrZXJcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgdXBkYXRlQ2xhbXBCb3VuZHMoKSB7XHJcbiAgICBjb25zdCBzb3VyY2VBc3BlY3QgPSB0aGlzLnNyY0ltYWdlLmhlaWdodCAvIHRoaXMuc3JjSW1hZ2Uud2lkdGg7XHJcbiAgICBjb25zdCBjYW52YXNBc3BlY3QgPSB0aGlzLmNhbnZhcy5oZWlnaHQgLyB0aGlzLmNhbnZhcy53aWR0aDtcclxuICAgIGxldCB3ID0gdGhpcy5jYW52YXMud2lkdGg7XHJcbiAgICBsZXQgaCA9IHRoaXMuY2FudmFzLmhlaWdodDtcclxuICAgIGlmIChjYW52YXNBc3BlY3QgPiBzb3VyY2VBc3BlY3QpIHtcclxuICAgICAgdyA9IHRoaXMuY2FudmFzLndpZHRoO1xyXG4gICAgICBoID0gdGhpcy5jYW52YXMud2lkdGggKiBzb3VyY2VBc3BlY3Q7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBoID0gdGhpcy5jYW52YXMuaGVpZ2h0O1xyXG4gICAgICB3ID0gdGhpcy5jYW52YXMuaGVpZ2h0IC8gc291cmNlQXNwZWN0O1xyXG4gICAgfVxyXG4gICAgdGhpcy5taW5YQ2xhbXAgPSB0aGlzLmNhbnZhcy53aWR0aCAvIDIgLSB3IC8gMjtcclxuICAgIHRoaXMubWluWUNsYW1wID0gdGhpcy5jYW52YXMuaGVpZ2h0IC8gMiAtIGggLyAyO1xyXG4gICAgdGhpcy5tYXhYQ2xhbXAgPSB0aGlzLmNhbnZhcy53aWR0aCAvIDIgKyB3IC8gMjtcclxuICAgIHRoaXMubWF4WUNsYW1wID0gdGhpcy5jYW52YXMuaGVpZ2h0IC8gMiArIGggLyAyO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldENyb3BCb3VuZHMoKSB7XHJcbiAgICBjb25zdCBib3VuZHMgPSB0aGlzLmdldEJvdW5kcygpO1xyXG4gICAgYm91bmRzLnRvcCA9IE1hdGgucm91bmQoKGJvdW5kcy50b3AgLSB0aGlzLm1pbllDbGFtcCkgLyB0aGlzLnJhdGlvSCk7XHJcbiAgICBib3VuZHMuYm90dG9tID0gTWF0aC5yb3VuZCgoYm91bmRzLmJvdHRvbSAtIHRoaXMubWluWUNsYW1wKSAvIHRoaXMucmF0aW9IKTtcclxuICAgIGJvdW5kcy5sZWZ0ID0gTWF0aC5yb3VuZCgoYm91bmRzLmxlZnQgLSB0aGlzLm1pblhDbGFtcCkgLyB0aGlzLnJhdGlvVyk7XHJcbiAgICBib3VuZHMucmlnaHQgPSBNYXRoLnJvdW5kKChib3VuZHMucmlnaHQgLSB0aGlzLm1pblhDbGFtcCkgLyB0aGlzLnJhdGlvVyk7XHJcbiAgICByZXR1cm4gYm91bmRzO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGNsYW1wUG9zaXRpb24oeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgIGlmICh4IDwgdGhpcy5taW5YQ2xhbXApIHtcclxuICAgICAgeCA9IHRoaXMubWluWENsYW1wO1xyXG4gICAgfVxyXG4gICAgaWYgKHggPiB0aGlzLm1heFhDbGFtcCkge1xyXG4gICAgICB4ID0gdGhpcy5tYXhYQ2xhbXA7XHJcbiAgICB9XHJcbiAgICBpZiAoeSA8IHRoaXMubWluWUNsYW1wKSB7XHJcbiAgICAgIHkgPSB0aGlzLm1pbllDbGFtcDtcclxuICAgIH1cclxuICAgIGlmICh5ID4gdGhpcy5tYXhZQ2xhbXApIHtcclxuICAgICAgeSA9IHRoaXMubWF4WUNsYW1wO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ldyBQb2ludFBvb2woKS5pbnN0YW5jZS5ib3Jyb3coeCwgeSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgaXNJbWFnZVNldCgpIHtcclxuICAgIHJldHVybiB0aGlzLmltYWdlU2V0O1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHNldEltYWdlKGltZzogYW55KSB7XHJcbiAgICB0aGlzLnNyY0ltYWdlID0gaW1nO1xyXG4gICAgaWYgKCFpbWcpIHtcclxuICAgICAgdGhpcy5pbWFnZVNldCA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmRyYXcodGhpcy5jdHgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5pbWFnZVNldCA9IHRydWU7XHJcbiAgICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcclxuICAgICAgY29uc3QgYnVmZmVyQ29udGV4dCA9IHRoaXMuYnVmZmVyLmdldENvbnRleHQoXHJcbiAgICAgICAgJzJkJ1xyXG4gICAgICApIGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICAgICAgYnVmZmVyQ29udGV4dC5jbGVhclJlY3QoMCwgMCwgdGhpcy5idWZmZXIud2lkdGgsIHRoaXMuYnVmZmVyLmhlaWdodCk7XHJcblxyXG4gICAgICBpZiAoIXRoaXMuY3JvcHBlclNldHRpbmdzLmZpbGVUeXBlKSB7XHJcbiAgICAgICAgdGhpcy5maWxlVHlwZSA9IHRoaXMuZ2V0RGF0YVVyaU1pbWVUeXBlKGltZy5zcmMpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5jcm9wcGVyU2V0dGluZ3MubWluV2l0aFJlbGF0aXZlVG9SZXNvbHV0aW9uKSB7XHJcbiAgICAgICAgdGhpcy5taW5XaWR0aCA9XHJcbiAgICAgICAgICAodGhpcy5jYW52YXMud2lkdGggKiB0aGlzLmNyb3BwZXJTZXR0aW5ncy5taW5XaWR0aCkgL1xyXG4gICAgICAgICAgdGhpcy5zcmNJbWFnZS53aWR0aDtcclxuICAgICAgICB0aGlzLm1pbkhlaWdodCA9XHJcbiAgICAgICAgICAodGhpcy5jYW52YXMuaGVpZ2h0ICogdGhpcy5jcm9wcGVyU2V0dGluZ3MubWluSGVpZ2h0KSAvXHJcbiAgICAgICAgICB0aGlzLnNyY0ltYWdlLmhlaWdodDtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy51cGRhdGVDbGFtcEJvdW5kcygpO1xyXG4gICAgICB0aGlzLmNhbnZhc1dpZHRoID0gdGhpcy5jYW52YXMud2lkdGg7XHJcbiAgICAgIHRoaXMuY2FudmFzSGVpZ2h0ID0gdGhpcy5jYW52YXMuaGVpZ2h0O1xyXG5cclxuICAgICAgY29uc3QgY3JvcFBvc2l0aW9uOiBQb2ludFtdID0gdGhpcy5nZXRDcm9wUG9zaXRpb25Gcm9tTWFya2VycygpO1xyXG4gICAgICB0aGlzLnNldENyb3BQb3NpdGlvbihjcm9wUG9zaXRpb24pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIHVwZGF0ZUNyb3BQb3NpdGlvbihjcm9wQm91bmRzOiBCb3VuZHMpOiB2b2lkIHtcclxuICAgIGNvbnN0IGNyb3BQb3NpdGlvbjogUG9pbnRbXSA9IHRoaXMuZ2V0Q3JvcFBvc2l0aW9uRnJvbUJvdW5kcyhjcm9wQm91bmRzKTtcclxuICAgIHRoaXMuc2V0Q3JvcFBvc2l0aW9uKGNyb3BQb3NpdGlvbik7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNldENyb3BQb3NpdGlvbihjcm9wUG9zaXRpb246IFBvaW50W10pOiB2b2lkIHtcclxuICAgIHRoaXMudGwuc2V0UG9zaXRpb24oY3JvcFBvc2l0aW9uWzBdLngsIGNyb3BQb3NpdGlvblswXS55KTtcclxuICAgIHRoaXMudHIuc2V0UG9zaXRpb24oY3JvcFBvc2l0aW9uWzFdLngsIGNyb3BQb3NpdGlvblsxXS55KTtcclxuICAgIHRoaXMuYmwuc2V0UG9zaXRpb24oY3JvcFBvc2l0aW9uWzJdLngsIGNyb3BQb3NpdGlvblsyXS55KTtcclxuICAgIHRoaXMuYnIuc2V0UG9zaXRpb24oY3JvcFBvc2l0aW9uWzNdLngsIGNyb3BQb3NpdGlvblszXS55KTtcclxuICAgIHRoaXMuY2VudGVyLnNldFBvc2l0aW9uKGNyb3BQb3NpdGlvbls0XS54LCBjcm9wUG9zaXRpb25bNF0ueSk7XHJcblxyXG4gICAgZm9yIChjb25zdCBwb3NpdGlvbiBvZiBjcm9wUG9zaXRpb24pIHtcclxuICAgICAgbmV3IFBvaW50UG9vbCgpLmluc3RhbmNlLnJldHVyblBvaW50KHBvc2l0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnZlcnRTcXVhc2hSYXRpbyA9IHRoaXMuZGV0ZWN0VmVydGljYWxTcXVhc2godGhpcy5zcmNJbWFnZSk7XHJcbiAgICB0aGlzLmRyYXcodGhpcy5jdHgpO1xyXG4gICAgdGhpcy5jcm9wcGVkSW1hZ2UgPSB0aGlzLmdldENyb3BwZWRJbWFnZUhlbHBlcihcclxuICAgICAgZmFsc2UsXHJcbiAgICAgIHRoaXMuY3JvcFdpZHRoLFxyXG4gICAgICB0aGlzLmNyb3BIZWlnaHRcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldENyb3BQb3NpdGlvbkZyb21NYXJrZXJzKCk6IFBvaW50W10ge1xyXG4gICAgY29uc3QgdzogbnVtYmVyID0gdGhpcy5jYW52YXMud2lkdGg7XHJcbiAgICBjb25zdCBoOiBudW1iZXIgPSB0aGlzLmNhbnZhcy5oZWlnaHQ7XHJcbiAgICBsZXQgdGxQb3M6IFBvaW50O1xyXG4gICAgbGV0IHRyUG9zOiBQb2ludDtcclxuICAgIGxldCBibFBvczogUG9pbnQ7XHJcbiAgICBsZXQgYnJQb3M6IFBvaW50O1xyXG4gICAgbGV0IGNlbnRlcjogUG9pbnQ7XHJcbiAgICBjb25zdCBzb3VyY2VBc3BlY3Q6IG51bWJlciA9IHRoaXMuc3JjSW1hZ2UuaGVpZ2h0IC8gdGhpcy5zcmNJbWFnZS53aWR0aDtcclxuICAgIGNvbnN0IGNyb3BCb3VuZHM6IEJvdW5kcyA9IHRoaXMuZ2V0Qm91bmRzKCk7XHJcbiAgICBjb25zdCBjcm9wQXNwZWN0OiBudW1iZXIgPSBjcm9wQm91bmRzLmhlaWdodCAvIGNyb3BCb3VuZHMud2lkdGg7XHJcbiAgICBjb25zdCBjWDogbnVtYmVyID0gdGhpcy5jYW52YXMud2lkdGggLyAyO1xyXG4gICAgY29uc3QgY1k6IG51bWJlciA9IHRoaXMuY2FudmFzLmhlaWdodCAvIDI7XHJcblxyXG4gICAgaWYgKGNyb3BBc3BlY3QgPiBzb3VyY2VBc3BlY3QpIHtcclxuICAgICAgY29uc3QgaW1hZ2VIID0gTWF0aC5taW4odyAqIHNvdXJjZUFzcGVjdCwgaCk7XHJcbiAgICAgIGNvbnN0IGNyb3BXID0gaW1hZ2VIIC8gY3JvcEFzcGVjdDtcclxuICAgICAgdGxQb3MgPSBuZXcgUG9pbnRQb29sKCkuaW5zdGFuY2UuYm9ycm93KGNYIC0gY3JvcFcgLyAyLCBjWSArIGltYWdlSCAvIDIpO1xyXG4gICAgICB0clBvcyA9IG5ldyBQb2ludFBvb2woKS5pbnN0YW5jZS5ib3Jyb3coY1ggKyBjcm9wVyAvIDIsIGNZICsgaW1hZ2VIIC8gMik7XHJcbiAgICAgIGJsUG9zID0gbmV3IFBvaW50UG9vbCgpLmluc3RhbmNlLmJvcnJvdyhjWCAtIGNyb3BXIC8gMiwgY1kgLSBpbWFnZUggLyAyKTtcclxuICAgICAgYnJQb3MgPSBuZXcgUG9pbnRQb29sKCkuaW5zdGFuY2UuYm9ycm93KGNYICsgY3JvcFcgLyAyLCBjWSAtIGltYWdlSCAvIDIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3QgaW1hZ2VXID0gTWF0aC5taW4oaCAvIHNvdXJjZUFzcGVjdCwgdyk7XHJcbiAgICAgIGNvbnN0IGNyb3BIID0gaW1hZ2VXICogY3JvcEFzcGVjdDtcclxuICAgICAgdGxQb3MgPSBuZXcgUG9pbnRQb29sKCkuaW5zdGFuY2UuYm9ycm93KGNYIC0gaW1hZ2VXIC8gMiwgY1kgKyBjcm9wSCAvIDIpO1xyXG4gICAgICB0clBvcyA9IG5ldyBQb2ludFBvb2woKS5pbnN0YW5jZS5ib3Jyb3coY1ggKyBpbWFnZVcgLyAyLCBjWSArIGNyb3BIIC8gMik7XHJcbiAgICAgIGJsUG9zID0gbmV3IFBvaW50UG9vbCgpLmluc3RhbmNlLmJvcnJvdyhjWCAtIGltYWdlVyAvIDIsIGNZIC0gY3JvcEggLyAyKTtcclxuICAgICAgYnJQb3MgPSBuZXcgUG9pbnRQb29sKCkuaW5zdGFuY2UuYm9ycm93KGNYICsgaW1hZ2VXIC8gMiwgY1kgLSBjcm9wSCAvIDIpO1xyXG4gICAgfVxyXG5cclxuICAgIGNlbnRlciA9IG5ldyBQb2ludFBvb2woKS5pbnN0YW5jZS5ib3Jyb3coY1gsIGNZKTtcclxuICAgIGNvbnN0IHBvc2l0aW9uczogUG9pbnRbXSA9IFt0bFBvcywgdHJQb3MsIGJsUG9zLCBiclBvcywgY2VudGVyXTtcclxuICAgIHJldHVybiBwb3NpdGlvbnM7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldENyb3BQb3NpdGlvbkZyb21Cb3VuZHMoY3JvcFBvc2l0aW9uOiBCb3VuZHMpOiBQb2ludFtdIHtcclxuICAgIGxldCBtYXJnaW5Ub3AgPSAwO1xyXG4gICAgbGV0IG1hcmdpbkxlZnQgPSAwO1xyXG4gICAgY29uc3QgY2FudmFzQXNwZWN0OiBudW1iZXIgPSB0aGlzLmNhbnZhc0hlaWdodCAvIHRoaXMuY2FudmFzV2lkdGg7XHJcbiAgICBjb25zdCBzb3VyY2VBc3BlY3Q6IG51bWJlciA9IHRoaXMuc3JjSW1hZ2UuaGVpZ2h0IC8gdGhpcy5zcmNJbWFnZS53aWR0aDtcclxuXHJcbiAgICBpZiAoY2FudmFzQXNwZWN0ID4gc291cmNlQXNwZWN0KSB7XHJcbiAgICAgIG1hcmdpblRvcCA9XHJcbiAgICAgICAgdGhpcy5idWZmZXIuaGVpZ2h0IC8gMiAtICh0aGlzLmNhbnZhc1dpZHRoICogc291cmNlQXNwZWN0KSAvIDI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBtYXJnaW5MZWZ0ID0gdGhpcy5idWZmZXIud2lkdGggLyAyIC0gdGhpcy5jYW52YXNIZWlnaHQgLyBzb3VyY2VBc3BlY3QgLyAyO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJhdGlvVzogbnVtYmVyID1cclxuICAgICAgKHRoaXMuY2FudmFzV2lkdGggLSBtYXJnaW5MZWZ0ICogMikgLyB0aGlzLnNyY0ltYWdlLndpZHRoO1xyXG4gICAgY29uc3QgcmF0aW9IOiBudW1iZXIgPVxyXG4gICAgICAodGhpcy5jYW52YXNIZWlnaHQgLSBtYXJnaW5Ub3AgKiAyKSAvIHRoaXMuc3JjSW1hZ2UuaGVpZ2h0O1xyXG5cclxuICAgIGxldCBhY3R1YWxIOiBudW1iZXIgPSBjcm9wUG9zaXRpb24uaGVpZ2h0ICogcmF0aW9IO1xyXG4gICAgbGV0IGFjdHVhbFc6IG51bWJlciA9IGNyb3BQb3NpdGlvbi53aWR0aCAqIHJhdGlvVztcclxuICAgIGNvbnN0IGFjdHVhbFg6IG51bWJlciA9IGNyb3BQb3NpdGlvbi5sZWZ0ICogcmF0aW9XICsgbWFyZ2luTGVmdDtcclxuICAgIGNvbnN0IGFjdHVhbFk6IG51bWJlciA9IGNyb3BQb3NpdGlvbi50b3AgKiByYXRpb0ggKyBtYXJnaW5Ub3A7XHJcblxyXG4gICAgaWYgKHRoaXMua2VlcEFzcGVjdCkge1xyXG4gICAgICBjb25zdCBzY2FsZWRXOiBudW1iZXIgPSBhY3R1YWxIIC8gdGhpcy5hc3BlY3RSYXRpbztcclxuICAgICAgY29uc3Qgc2NhbGVkSDogbnVtYmVyID0gYWN0dWFsVyAqIHRoaXMuYXNwZWN0UmF0aW87XHJcblxyXG4gICAgICBpZiAodGhpcy5nZXRDcm9wQm91bmRzKCkuaGVpZ2h0ID09PSBjcm9wUG9zaXRpb24uaGVpZ2h0KSB7XHJcbiAgICAgICAgLy8gb25seSB3aWR0aCBjaGFuZ2VkXHJcbiAgICAgICAgYWN0dWFsSCA9IHNjYWxlZEg7XHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5nZXRDcm9wQm91bmRzKCkud2lkdGggPT09IGNyb3BQb3NpdGlvbi53aWR0aCkge1xyXG4gICAgICAgIC8vIG9ubHkgaGVpZ2h0IGNoYW5nZWRcclxuICAgICAgICBhY3R1YWxXID0gc2NhbGVkVztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBoZWlnaHQgYW5kIHdpZHRoIGNoYW5nZWRcclxuICAgICAgICBpZiAoTWF0aC5hYnMoc2NhbGVkSCAtIGFjdHVhbEgpIDwgTWF0aC5hYnMoc2NhbGVkVyAtIGFjdHVhbFcpKSB7XHJcbiAgICAgICAgICBhY3R1YWxXID0gc2NhbGVkVztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgYWN0dWFsSCA9IHNjYWxlZEg7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdGxQb3M6IFBvaW50ID0gbmV3IFBvaW50UG9vbCgpLmluc3RhbmNlLmJvcnJvdyhcclxuICAgICAgYWN0dWFsWCxcclxuICAgICAgYWN0dWFsWSArIGFjdHVhbEhcclxuICAgICk7XHJcbiAgICBjb25zdCB0clBvczogUG9pbnQgPSBuZXcgUG9pbnRQb29sKCkuaW5zdGFuY2UuYm9ycm93KFxyXG4gICAgICBhY3R1YWxYICsgYWN0dWFsVyxcclxuICAgICAgYWN0dWFsWSArIGFjdHVhbEhcclxuICAgICk7XHJcbiAgICBjb25zdCBibFBvczogUG9pbnQgPSBuZXcgUG9pbnRQb29sKCkuaW5zdGFuY2UuYm9ycm93KGFjdHVhbFgsIGFjdHVhbFkpO1xyXG4gICAgY29uc3QgYnJQb3M6IFBvaW50ID0gbmV3IFBvaW50UG9vbCgpLmluc3RhbmNlLmJvcnJvdyhcclxuICAgICAgYWN0dWFsWCArIGFjdHVhbFcsXHJcbiAgICAgIGFjdHVhbFlcclxuICAgICk7XHJcbiAgICBjb25zdCBjZW50ZXI6IFBvaW50ID0gbmV3IFBvaW50UG9vbCgpLmluc3RhbmNlLmJvcnJvdyhcclxuICAgICAgYWN0dWFsWCArIGFjdHVhbFcgLyAyLFxyXG4gICAgICBhY3R1YWxZICsgYWN0dWFsSCAvIDJcclxuICAgICk7XHJcblxyXG4gICAgY29uc3QgcG9zaXRpb25zOiBQb2ludFtdID0gW3RsUG9zLCB0clBvcywgYmxQb3MsIGJyUG9zLCBjZW50ZXJdO1xyXG4gICAgcmV0dXJuIHBvc2l0aW9ucztcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXRDcm9wcGVkSW1hZ2VIZWxwZXIoXHJcbiAgICBwcmVzZXJ2ZVNpemU/OiBib29sZWFuLFxyXG4gICAgZmlsbFdpZHRoPzogbnVtYmVyLFxyXG4gICAgZmlsbEhlaWdodD86IG51bWJlclxyXG4gICk6IEhUTUxJbWFnZUVsZW1lbnQge1xyXG4gICAgaWYgKHRoaXMuY3JvcHBlclNldHRpbmdzLmNyb3BPblJlc2l6ZSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5nZXRDcm9wcGVkSW1hZ2UocHJlc2VydmVTaXplLCBmaWxsV2lkdGgsIGZpbGxIZWlnaHQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuY3JvcHBlZEltYWdlXHJcbiAgICAgID8gdGhpcy5jcm9wcGVkSW1hZ2VcclxuICAgICAgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcclxuICB9XHJcblxyXG4gIC8vIHRvZG86IFVudXNlZCBwYXJhbWV0ZXJzP1xyXG4gIHB1YmxpYyBnZXRDcm9wcGVkSW1hZ2UoXHJcbiAgICBwcmVzZXJ2ZVNpemU/OiBib29sZWFuLFxyXG4gICAgZmlsbFdpZHRoPzogbnVtYmVyLFxyXG4gICAgZmlsbEhlaWdodD86IG51bWJlclxyXG4gICk6IEhUTUxJbWFnZUVsZW1lbnQge1xyXG4gICAgY29uc3QgYm91bmRzOiBCb3VuZHMgPSB0aGlzLmdldEJvdW5kcygpO1xyXG4gICAgaWYgKCF0aGlzLnNyY0ltYWdlKSB7XHJcbiAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IHNvdXJjZUFzcGVjdDogbnVtYmVyID0gdGhpcy5zcmNJbWFnZS5oZWlnaHQgLyB0aGlzLnNyY0ltYWdlLndpZHRoO1xyXG4gICAgICBjb25zdCBjYW52YXNBc3BlY3Q6IG51bWJlciA9IHRoaXMuY2FudmFzLmhlaWdodCAvIHRoaXMuY2FudmFzLndpZHRoO1xyXG4gICAgICBsZXQgdzogbnVtYmVyID0gdGhpcy5jYW52YXMud2lkdGg7XHJcbiAgICAgIGxldCBoOiBudW1iZXIgPSB0aGlzLmNhbnZhcy5oZWlnaHQ7XHJcbiAgICAgIGlmIChjYW52YXNBc3BlY3QgPiBzb3VyY2VBc3BlY3QpIHtcclxuICAgICAgICB3ID0gdGhpcy5jYW52YXMud2lkdGg7XHJcbiAgICAgICAgaCA9IHRoaXMuY2FudmFzLndpZHRoICogc291cmNlQXNwZWN0O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChjYW52YXNBc3BlY3QgPCBzb3VyY2VBc3BlY3QpIHtcclxuICAgICAgICAgIGggPSB0aGlzLmNhbnZhcy5oZWlnaHQ7XHJcbiAgICAgICAgICB3ID0gdGhpcy5jYW52YXMuaGVpZ2h0IC8gc291cmNlQXNwZWN0O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBoID0gdGhpcy5jYW52YXMuaGVpZ2h0O1xyXG4gICAgICAgICAgdyA9IHRoaXMuY2FudmFzLndpZHRoO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICB0aGlzLnJhdGlvVyA9IHcgLyB0aGlzLnNyY0ltYWdlLndpZHRoO1xyXG4gICAgICB0aGlzLnJhdGlvSCA9IGggLyB0aGlzLnNyY0ltYWdlLmhlaWdodDtcclxuICAgICAgY29uc3Qgb2Zmc2V0SDogbnVtYmVyID0gKHRoaXMuYnVmZmVyLmhlaWdodCAtIGgpIC8gMiAvIHRoaXMucmF0aW9IO1xyXG4gICAgICBjb25zdCBvZmZzZXRXOiBudW1iZXIgPSAodGhpcy5idWZmZXIud2lkdGggLSB3KSAvIDIgLyB0aGlzLnJhdGlvVztcclxuXHJcbiAgICAgIGNvbnN0IGN0eCA9IHRoaXMuY3JvcENhbnZhcy5nZXRDb250ZXh0KCcyZCcpIGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuXHJcbiAgICAgIGlmICh0aGlzLmNyb3BwZXJTZXR0aW5ncy5wcmVzZXJ2ZVNpemUgfHwgcHJlc2VydmVTaXplKSB7XHJcbiAgICAgICAgY29uc3Qgd2lkdGggPSBNYXRoLnJvdW5kKFxyXG4gICAgICAgICAgYm91bmRzLnJpZ2h0IC8gdGhpcy5yYXRpb1cgLSBib3VuZHMubGVmdCAvIHRoaXMucmF0aW9XXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjb25zdCBoZWlnaHQgPSBNYXRoLnJvdW5kKFxyXG4gICAgICAgICAgYm91bmRzLmJvdHRvbSAvIHRoaXMucmF0aW9IIC0gYm91bmRzLnRvcCAvIHRoaXMucmF0aW9IXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5jcm9wQ2FudmFzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5jcm9wQ2FudmFzLmhlaWdodCA9IGhlaWdodDtcclxuXHJcbiAgICAgICAgdGhpcy5jcm9wcGVyU2V0dGluZ3MuY3JvcHBlZFdpZHRoID0gdGhpcy5jcm9wQ2FudmFzLndpZHRoO1xyXG4gICAgICAgIHRoaXMuY3JvcHBlclNldHRpbmdzLmNyb3BwZWRIZWlnaHQgPSB0aGlzLmNyb3BDYW52YXMuaGVpZ2h0O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuY3JvcENhbnZhcy53aWR0aCA9IHRoaXMuY3JvcFdpZHRoO1xyXG4gICAgICAgIHRoaXMuY3JvcENhbnZhcy5oZWlnaHQgPSB0aGlzLmNyb3BIZWlnaHQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jcm9wQ2FudmFzLndpZHRoLCB0aGlzLmNyb3BDYW52YXMuaGVpZ2h0KTtcclxuICAgICAgdGhpcy5kcmF3SW1hZ2VJT1NGaXgoXHJcbiAgICAgICAgY3R4LFxyXG4gICAgICAgIHRoaXMuc3JjSW1hZ2UsXHJcbiAgICAgICAgTWF0aC5tYXgoTWF0aC5yb3VuZChib3VuZHMubGVmdCAvIHRoaXMucmF0aW9XIC0gb2Zmc2V0VyksIDApLFxyXG4gICAgICAgIE1hdGgubWF4KE1hdGgucm91bmQoYm91bmRzLnRvcCAvIHRoaXMucmF0aW9IIC0gb2Zmc2V0SCksIDApLFxyXG4gICAgICAgIE1hdGgubWF4KE1hdGgucm91bmQoYm91bmRzLndpZHRoIC8gdGhpcy5yYXRpb1cpLCAxKSxcclxuICAgICAgICBNYXRoLm1heChNYXRoLnJvdW5kKGJvdW5kcy5oZWlnaHQgLyB0aGlzLnJhdGlvSCksIDEpLFxyXG4gICAgICAgIDAsXHJcbiAgICAgICAgMCxcclxuICAgICAgICB0aGlzLmNyb3BDYW52YXMud2lkdGgsXHJcbiAgICAgICAgdGhpcy5jcm9wQ2FudmFzLmhlaWdodFxyXG4gICAgICApO1xyXG5cclxuICAgICAgaWYgKHRoaXMuY3JvcHBlclNldHRpbmdzLnJlc2FtcGxlRm4pIHtcclxuICAgICAgICB0aGlzLmNyb3BwZXJTZXR0aW5ncy5yZXNhbXBsZUZuKHRoaXMuY3JvcENhbnZhcyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuY3JvcHBlZEltYWdlLndpZHRoID0gdGhpcy5jcm9wQ2FudmFzLndpZHRoO1xyXG4gICAgICB0aGlzLmNyb3BwZWRJbWFnZS5oZWlnaHQgPSB0aGlzLmNyb3BDYW52YXMuaGVpZ2h0O1xyXG4gICAgICB0aGlzLmNyb3BwZWRJbWFnZS5zcmMgPSB0aGlzLmNyb3BDYW52YXMudG9EYXRhVVJMKFxyXG4gICAgICAgIHRoaXMuZmlsZVR5cGUsXHJcbiAgICAgICAgdGhpcy5jcm9wcGVyU2V0dGluZ3MuY29tcHJlc3NSYXRpb1xyXG4gICAgICApO1xyXG4gICAgICByZXR1cm4gdGhpcy5jcm9wcGVkSW1hZ2U7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0Qm91bmRzKCk6IEJvdW5kcyB7XHJcbiAgICBsZXQgbWluWCA9IE51bWJlci5NQVhfVkFMVUU7XHJcbiAgICBsZXQgbWluWSA9IE51bWJlci5NQVhfVkFMVUU7XHJcbiAgICBsZXQgbWF4WCA9IC1OdW1iZXIuTUFYX1ZBTFVFO1xyXG4gICAgbGV0IG1heFkgPSAtTnVtYmVyLk1BWF9WQUxVRTtcclxuICAgIGZvciAoY29uc3QgbWFya2VyIG9mIHRoaXMubWFya2Vycykge1xyXG4gICAgICBpZiAobWFya2VyLnBvc2l0aW9uLnggPCBtaW5YKSB7XHJcbiAgICAgICAgbWluWCA9IG1hcmtlci5wb3NpdGlvbi54O1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChtYXJrZXIucG9zaXRpb24ueCA+IG1heFgpIHtcclxuICAgICAgICBtYXhYID0gbWFya2VyLnBvc2l0aW9uLng7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKG1hcmtlci5wb3NpdGlvbi55IDwgbWluWSkge1xyXG4gICAgICAgIG1pblkgPSBtYXJrZXIucG9zaXRpb24ueTtcclxuICAgICAgfVxyXG4gICAgICBpZiAobWFya2VyLnBvc2l0aW9uLnkgPiBtYXhZKSB7XHJcbiAgICAgICAgbWF4WSA9IG1hcmtlci5wb3NpdGlvbi55O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCBib3VuZHM6IEJvdW5kcyA9IG5ldyBCb3VuZHMoKTtcclxuICAgIGJvdW5kcy5sZWZ0ID0gbWluWDtcclxuICAgIGJvdW5kcy5yaWdodCA9IG1heFg7XHJcbiAgICBib3VuZHMudG9wID0gbWluWTtcclxuICAgIGJvdW5kcy5ib3R0b20gPSBtYXhZO1xyXG4gICAgcmV0dXJuIGJvdW5kcztcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzZXRCb3VuZHMoYm91bmRzOiBhbnkpIHtcclxuICAgIC8vIGNvbnN0IHRvcExlZnQ6IENvcm5lck1hcmtlcjtcclxuICAgIC8vIGNvbnN0IHRvcFJpZ2h0OiBDb3JuZXJNYXJrZXI7XHJcbiAgICAvLyBjb25zdCBib3R0b21MZWZ0OiBDb3JuZXJNYXJrZXI7XHJcbiAgICAvLyBjb25zdCBib3R0b21SaWdodDogQ29ybmVyTWFya2VyO1xyXG5cclxuICAgIGNvbnN0IGN1cnJlbnRCb3VuZHMgPSB0aGlzLmdldEJvdW5kcygpO1xyXG4gICAgZm9yIChjb25zdCBtYXJrZXIgb2YgdGhpcy5tYXJrZXJzKSB7XHJcbiAgICAgIGlmIChtYXJrZXIucG9zaXRpb24ueCA9PT0gY3VycmVudEJvdW5kcy5sZWZ0KSB7XHJcbiAgICAgICAgaWYgKG1hcmtlci5wb3NpdGlvbi55ID09PSBjdXJyZW50Qm91bmRzLnRvcCkge1xyXG4gICAgICAgICAgbWFya2VyLnNldFBvc2l0aW9uKGJvdW5kcy5sZWZ0LCBib3VuZHMudG9wKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgbWFya2VyLnNldFBvc2l0aW9uKGJvdW5kcy5sZWZ0LCBib3VuZHMuYm90dG9tKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKG1hcmtlci5wb3NpdGlvbi55ID09PSBjdXJyZW50Qm91bmRzLnRvcCkge1xyXG4gICAgICAgICAgbWFya2VyLnNldFBvc2l0aW9uKGJvdW5kcy5yaWdodCwgYm91bmRzLnRvcCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG1hcmtlci5zZXRQb3NpdGlvbihib3VuZHMucmlnaHQsIGJvdW5kcy5ib3R0b20pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY2VudGVyLnJlY2FsY3VsYXRlUG9zaXRpb24oYm91bmRzKTtcclxuICAgIHRoaXMuY2VudGVyLmRyYXcodGhpcy5jdHgpO1xyXG4gICAgdGhpcy5kcmF3KHRoaXMuY3R4KTsgLy8gd2UgbmVlZCB0byByZWRyYXcgYWxsIGNhbnZhcyBpZiB3ZSBoYXZlIGNoYW5nZWQgYm91bmRzXHJcbiAgfVxyXG5cclxuICBwdWJsaWMgb25Ub3VjaE1vdmUoZXZlbnQ6IFRvdWNoRXZlbnQpIHtcclxuICAgIGlmICh0aGlzLmNyb3AuaXNJbWFnZVNldCgpKSB7XHJcbiAgICAgIGlmIChldmVudC50b3VjaGVzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzTW91c2VEb3duKSB7XHJcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnByZWZlci1mb3Itb2ZcclxuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXZlbnQudG91Y2hlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCB0b3VjaCA9IGV2ZW50LnRvdWNoZXNbaV07XHJcbiAgICAgICAgICAgIGNvbnN0IHRvdWNoUG9zaXRpb24gPSB0aGlzLmdldFRvdWNoUG9zKHRoaXMuY2FudmFzLCB0b3VjaCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNyb3BUb3VjaCA9IG5ldyBDcm9wVG91Y2goXHJcbiAgICAgICAgICAgICAgdG91Y2hQb3NpdGlvbi54LFxyXG4gICAgICAgICAgICAgIHRvdWNoUG9zaXRpb24ueSxcclxuICAgICAgICAgICAgICB0b3VjaC5pZGVudGlmaWVyXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIG5ldyBQb2ludFBvb2woKS5pbnN0YW5jZS5yZXR1cm5Qb2ludCh0b3VjaFBvc2l0aW9uKTtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlKGNyb3BUb3VjaCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChldmVudC50b3VjaGVzLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9XHJcbiAgICAgICAgICAgIChldmVudC50b3VjaGVzWzBdLmNsaWVudFggLSBldmVudC50b3VjaGVzWzFdLmNsaWVudFgpICpcclxuICAgICAgICAgICAgICAoZXZlbnQudG91Y2hlc1swXS5jbGllbnRYIC0gZXZlbnQudG91Y2hlc1sxXS5jbGllbnRYKSArXHJcbiAgICAgICAgICAgIChldmVudC50b3VjaGVzWzBdLmNsaWVudFkgLSBldmVudC50b3VjaGVzWzFdLmNsaWVudFkpICpcclxuICAgICAgICAgICAgICAoZXZlbnQudG91Y2hlc1swXS5jbGllbnRZIC0gZXZlbnQudG91Y2hlc1sxXS5jbGllbnRZKTtcclxuICAgICAgICAgIGlmICh0aGlzLnByZXZpb3VzRGlzdGFuY2UgJiYgdGhpcy5wcmV2aW91c0Rpc3RhbmNlICE9PSBkaXN0YW5jZSkge1xyXG4gICAgICAgICAgICBjb25zdCBib3VuZHMgPSB0aGlzLmdldEJvdW5kcygpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGRpc3RhbmNlIDwgdGhpcy5wcmV2aW91c0Rpc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICAgYm91bmRzLnRvcCArPSAxO1xyXG4gICAgICAgICAgICAgIGJvdW5kcy5sZWZ0ICs9IDE7XHJcbiAgICAgICAgICAgICAgYm91bmRzLnJpZ2h0IC09IDE7XHJcbiAgICAgICAgICAgICAgYm91bmRzLmJvdHRvbSAtPSAxO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoZGlzdGFuY2UgPiB0aGlzLnByZXZpb3VzRGlzdGFuY2UpIHtcclxuICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICBib3VuZHMudG9wICE9PSB0aGlzLm1pbllDbGFtcCAmJlxyXG4gICAgICAgICAgICAgICAgYm91bmRzLmJvdHRvbSAhPT0gdGhpcy5tYXhZQ2xhbXAgJiZcclxuICAgICAgICAgICAgICAgIGJvdW5kcy5sZWZ0ICE9PSB0aGlzLm1pblhDbGFtcCAmJlxyXG4gICAgICAgICAgICAgICAgYm91bmRzLnJpZ2h0ICE9PSB0aGlzLm1heFhDbGFtcFxyXG4gICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgLy8gbm9uZVxyXG4gICAgICAgICAgICAgICAgYm91bmRzLnRvcCAtPSAxO1xyXG4gICAgICAgICAgICAgICAgYm91bmRzLmxlZnQgLT0gMTtcclxuICAgICAgICAgICAgICAgIGJvdW5kcy5yaWdodCArPSAxO1xyXG4gICAgICAgICAgICAgICAgYm91bmRzLmJvdHRvbSArPSAxO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoXHJcbiAgICAgICAgICAgICAgICBib3VuZHMudG9wICE9PSB0aGlzLm1pbllDbGFtcCAmJlxyXG4gICAgICAgICAgICAgICAgYm91bmRzLmJvdHRvbSAhPT0gdGhpcy5tYXhZQ2xhbXAgJiZcclxuICAgICAgICAgICAgICAgIGJvdW5kcy5sZWZ0ID09PSB0aGlzLm1pblhDbGFtcCAmJlxyXG4gICAgICAgICAgICAgICAgYm91bmRzLnJpZ2h0ICE9PSB0aGlzLm1heFhDbGFtcFxyXG4gICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgLy8gbGVmdFxyXG4gICAgICAgICAgICAgICAgYm91bmRzLnRvcCAtPSAxO1xyXG4gICAgICAgICAgICAgICAgYm91bmRzLnJpZ2h0ICs9IDI7XHJcbiAgICAgICAgICAgICAgICBib3VuZHMuYm90dG9tICs9IDE7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChcclxuICAgICAgICAgICAgICAgIGJvdW5kcy50b3AgIT09IHRoaXMubWluWUNsYW1wICYmXHJcbiAgICAgICAgICAgICAgICBib3VuZHMuYm90dG9tICE9PSB0aGlzLm1heFlDbGFtcCAmJlxyXG4gICAgICAgICAgICAgICAgYm91bmRzLmxlZnQgIT09IHRoaXMubWluWENsYW1wICYmXHJcbiAgICAgICAgICAgICAgICBib3VuZHMucmlnaHQgPT09IHRoaXMubWF4WENsYW1wXHJcbiAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyByaWdodFxyXG4gICAgICAgICAgICAgICAgYm91bmRzLnRvcCAtPSAxO1xyXG4gICAgICAgICAgICAgICAgYm91bmRzLmxlZnQgLT0gMjtcclxuICAgICAgICAgICAgICAgIGJvdW5kcy5ib3R0b20gKz0gMTtcclxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKFxyXG4gICAgICAgICAgICAgICAgYm91bmRzLnRvcCA9PT0gdGhpcy5taW5ZQ2xhbXAgJiZcclxuICAgICAgICAgICAgICAgIGJvdW5kcy5ib3R0b20gIT09IHRoaXMubWF4WUNsYW1wICYmXHJcbiAgICAgICAgICAgICAgICBib3VuZHMubGVmdCAhPT0gdGhpcy5taW5YQ2xhbXAgJiZcclxuICAgICAgICAgICAgICAgIGJvdW5kcy5yaWdodCAhPT0gdGhpcy5tYXhYQ2xhbXBcclxuICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIC8vIHRvcFxyXG4gICAgICAgICAgICAgICAgYm91bmRzLmxlZnQgLT0gMTtcclxuICAgICAgICAgICAgICAgIGJvdW5kcy5yaWdodCArPSAxO1xyXG4gICAgICAgICAgICAgICAgYm91bmRzLmJvdHRvbSArPSAyO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoXHJcbiAgICAgICAgICAgICAgICBib3VuZHMudG9wICE9PSB0aGlzLm1pbllDbGFtcCAmJlxyXG4gICAgICAgICAgICAgICAgYm91bmRzLmJvdHRvbSA9PT0gdGhpcy5tYXhZQ2xhbXAgJiZcclxuICAgICAgICAgICAgICAgIGJvdW5kcy5sZWZ0ICE9PSB0aGlzLm1pblhDbGFtcCAmJlxyXG4gICAgICAgICAgICAgICAgYm91bmRzLnJpZ2h0ICE9PSB0aGlzLm1heFhDbGFtcFxyXG4gICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgLy8gYm90dG9tXHJcbiAgICAgICAgICAgICAgICBib3VuZHMudG9wIC09IDI7XHJcbiAgICAgICAgICAgICAgICBib3VuZHMubGVmdCAtPSAxO1xyXG4gICAgICAgICAgICAgICAgYm91bmRzLnJpZ2h0ICs9IDE7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChcclxuICAgICAgICAgICAgICAgIGJvdW5kcy50b3AgPT09IHRoaXMubWluWUNsYW1wICYmXHJcbiAgICAgICAgICAgICAgICBib3VuZHMuYm90dG9tICE9PSB0aGlzLm1heFlDbGFtcCAmJlxyXG4gICAgICAgICAgICAgICAgYm91bmRzLmxlZnQgPT09IHRoaXMubWluWENsYW1wICYmXHJcbiAgICAgICAgICAgICAgICBib3VuZHMucmlnaHQgIT09IHRoaXMubWF4WENsYW1wXHJcbiAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB0b3AgbGVmdFxyXG4gICAgICAgICAgICAgICAgYm91bmRzLnJpZ2h0ICs9IDI7XHJcbiAgICAgICAgICAgICAgICBib3VuZHMuYm90dG9tICs9IDI7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChcclxuICAgICAgICAgICAgICAgIGJvdW5kcy50b3AgPT09IHRoaXMubWluWUNsYW1wICYmXHJcbiAgICAgICAgICAgICAgICBib3VuZHMuYm90dG9tICE9PSB0aGlzLm1heFlDbGFtcCAmJlxyXG4gICAgICAgICAgICAgICAgYm91bmRzLmxlZnQgIT09IHRoaXMubWluWENsYW1wICYmXHJcbiAgICAgICAgICAgICAgICBib3VuZHMucmlnaHQgPT09IHRoaXMubWF4WENsYW1wXHJcbiAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB0b3AgcmlnaHRcclxuICAgICAgICAgICAgICAgIGJvdW5kcy5sZWZ0IC09IDI7XHJcbiAgICAgICAgICAgICAgICBib3VuZHMuYm90dG9tICs9IDI7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChcclxuICAgICAgICAgICAgICAgIGJvdW5kcy50b3AgIT09IHRoaXMubWluWUNsYW1wICYmXHJcbiAgICAgICAgICAgICAgICBib3VuZHMuYm90dG9tID09PSB0aGlzLm1heFlDbGFtcCAmJlxyXG4gICAgICAgICAgICAgICAgYm91bmRzLmxlZnQgPT09IHRoaXMubWluWENsYW1wICYmXHJcbiAgICAgICAgICAgICAgICBib3VuZHMucmlnaHQgIT09IHRoaXMubWF4WENsYW1wXHJcbiAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBib3R0b20gbGVmdFxyXG4gICAgICAgICAgICAgICAgYm91bmRzLnRvcCAtPSAyO1xyXG4gICAgICAgICAgICAgICAgYm91bmRzLnJpZ2h0ICs9IDI7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChcclxuICAgICAgICAgICAgICAgIGJvdW5kcy50b3AgIT09IHRoaXMubWluWUNsYW1wICYmXHJcbiAgICAgICAgICAgICAgICBib3VuZHMuYm90dG9tID09PSB0aGlzLm1heFlDbGFtcCAmJlxyXG4gICAgICAgICAgICAgICAgYm91bmRzLmxlZnQgIT09IHRoaXMubWluWENsYW1wICYmXHJcbiAgICAgICAgICAgICAgICBib3VuZHMucmlnaHQgPT09IHRoaXMubWF4WENsYW1wXHJcbiAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBib3R0b20gcmlnaHRcclxuICAgICAgICAgICAgICAgIGJvdW5kcy50b3AgLT0gMjtcclxuICAgICAgICAgICAgICAgIGJvdW5kcy5sZWZ0IC09IDI7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoYm91bmRzLnRvcCA8IHRoaXMubWluWUNsYW1wKSB7XHJcbiAgICAgICAgICAgICAgYm91bmRzLnRvcCA9IHRoaXMubWluWUNsYW1wO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChib3VuZHMuYm90dG9tID4gdGhpcy5tYXhZQ2xhbXApIHtcclxuICAgICAgICAgICAgICBib3VuZHMuYm90dG9tID0gdGhpcy5tYXhZQ2xhbXA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGJvdW5kcy5sZWZ0IDwgdGhpcy5taW5YQ2xhbXApIHtcclxuICAgICAgICAgICAgICBib3VuZHMubGVmdCA9IHRoaXMubWluWENsYW1wO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChib3VuZHMucmlnaHQgPiB0aGlzLm1heFhDbGFtcCkge1xyXG4gICAgICAgICAgICAgIGJvdW5kcy5yaWdodCA9IHRoaXMubWF4WENsYW1wO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNldEJvdW5kcyhib3VuZHMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5wcmV2aW91c0Rpc3RhbmNlID0gZGlzdGFuY2U7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuZHJhdyh0aGlzLmN0eCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgb25Nb3VzZU1vdmUoZTogTW91c2VFdmVudCkge1xyXG4gICAgaWYgKHRoaXMuY3JvcC5pc0ltYWdlU2V0KCkgJiYgdGhpcy5pc01vdXNlRG93bikge1xyXG4gICAgICBjb25zdCBtb3VzZVBvc2l0aW9uID0gdGhpcy5nZXRNb3VzZVBvcyh0aGlzLmNhbnZhcywgZSk7XHJcbiAgICAgIHRoaXMubW92ZShuZXcgQ3JvcFRvdWNoKG1vdXNlUG9zaXRpb24ueCwgbW91c2VQb3NpdGlvbi55LCAwKSk7XHJcbiAgICAgIGxldCBkcmFnVG91Y2ggPSB0aGlzLmdldERyYWdUb3VjaEZvcklEKDApO1xyXG4gICAgICBpZiAoZHJhZ1RvdWNoKSB7XHJcbiAgICAgICAgZHJhZ1RvdWNoLnggPSBtb3VzZVBvc2l0aW9uLng7XHJcbiAgICAgICAgZHJhZ1RvdWNoLnkgPSBtb3VzZVBvc2l0aW9uLnk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZHJhZ1RvdWNoID0gbmV3IENyb3BUb3VjaChtb3VzZVBvc2l0aW9uLngsIG1vdXNlUG9zaXRpb24ueSwgMCk7XHJcbiAgICAgIH1cclxuICAgICAgbmV3IFBvaW50UG9vbCgpLmluc3RhbmNlLnJldHVyblBvaW50KG1vdXNlUG9zaXRpb24pO1xyXG4gICAgICB0aGlzLmRyYXdDdXJzb3JzKGRyYWdUb3VjaCk7XHJcbiAgICAgIHRoaXMuZHJhdyh0aGlzLmN0eCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgbW92ZShjcm9wVG91Y2g6IENyb3BUb3VjaCkge1xyXG4gICAgaWYgKHRoaXMuaXNNb3VzZURvd24pIHtcclxuICAgICAgdGhpcy5oYW5kbGVNb3ZlKGNyb3BUb3VjaCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0RHJhZ1RvdWNoRm9ySUQoaWQ6IGFueSk6IENyb3BUb3VjaCB8IHVuZGVmaW5lZCB7XHJcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cHJlZmVyLWZvci1vZlxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmN1cnJlbnREcmFnVG91Y2hlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBpZiAoaWQgPT09IHRoaXMuY3VycmVudERyYWdUb3VjaGVzW2ldLmlkKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudERyYWdUb3VjaGVzW2ldO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXdDdXJzb3JzKGNyb3BUb3VjaDogQ3JvcFRvdWNoKSB7XHJcbiAgICBsZXQgY3Vyc29yRHJhd24gPSBmYWxzZTtcclxuICAgIGlmIChjcm9wVG91Y2ggIT0gbnVsbCkge1xyXG4gICAgICBpZiAoY3JvcFRvdWNoLmRyYWdIYW5kbGUgPT09IHRoaXMuY2VudGVyKSB7XHJcbiAgICAgICAgdGhpcy5pbWFnZUNyb3BwZXJEYXRhU2hhcmUuc2V0U3R5bGUodGhpcy5jYW52YXMsICdtb3ZlJyk7XHJcbiAgICAgICAgY3Vyc29yRHJhd24gPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChcclxuICAgICAgICBjcm9wVG91Y2guZHJhZ0hhbmRsZSAhPT0gbnVsbCAmJlxyXG4gICAgICAgIGNyb3BUb3VjaC5kcmFnSGFuZGxlIGluc3RhbmNlb2YgQ29ybmVyTWFya2VyXHJcbiAgICAgICkge1xyXG4gICAgICAgIHRoaXMuZHJhd0Nvcm5lckN1cnNvcihcclxuICAgICAgICAgIGNyb3BUb3VjaC5kcmFnSGFuZGxlLFxyXG4gICAgICAgICAgY3JvcFRvdWNoLmRyYWdIYW5kbGUucG9zaXRpb24ueCxcclxuICAgICAgICAgIGNyb3BUb3VjaC5kcmFnSGFuZGxlLnBvc2l0aW9uLnlcclxuICAgICAgICApO1xyXG4gICAgICAgIGN1cnNvckRyYXduID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgbGV0IGRpZERyYXcgPSBmYWxzZTtcclxuICAgIGlmICghY3Vyc29yRHJhd24pIHtcclxuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnByZWZlci1mb3Itb2ZcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm1hcmtlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBkaWREcmF3ID1cclxuICAgICAgICAgIGRpZERyYXcgfHxcclxuICAgICAgICAgIHRoaXMuZHJhd0Nvcm5lckN1cnNvcih0aGlzLm1hcmtlcnNbaV0sIGNyb3BUb3VjaC54LCBjcm9wVG91Y2gueSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFkaWREcmF3KSB7XHJcbiAgICAgICAgdGhpcy5pbWFnZUNyb3BwZXJEYXRhU2hhcmUuc2V0U3R5bGUodGhpcy5jYW52YXMsICdpbml0aWFsJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChcclxuICAgICAgIWRpZERyYXcgJiZcclxuICAgICAgIWN1cnNvckRyYXduICYmXHJcbiAgICAgIHRoaXMuY2VudGVyLnRvdWNoSW5Cb3VuZHMoY3JvcFRvdWNoLngsIGNyb3BUb3VjaC55KVxyXG4gICAgKSB7XHJcbiAgICAgIHRoaXMuY2VudGVyLnNldE92ZXIodHJ1ZSk7XHJcbiAgICAgIHRoaXMuaW1hZ2VDcm9wcGVyRGF0YVNoYXJlLnNldE92ZXIodGhpcy5jYW52YXMpO1xyXG4gICAgICB0aGlzLmltYWdlQ3JvcHBlckRhdGFTaGFyZS5zZXRTdHlsZSh0aGlzLmNhbnZhcywgJ21vdmUnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuY2VudGVyLnNldE92ZXIoZmFsc2UpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXdDb3JuZXJDdXJzb3IobWFya2VyOiBhbnksIHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICBpZiAobWFya2VyLnRvdWNoSW5Cb3VuZHMoeCwgeSkpIHtcclxuICAgICAgbWFya2VyLnNldE92ZXIodHJ1ZSk7XHJcbiAgICAgIGlmIChtYXJrZXIuZ2V0SG9yaXpvbnRhbE5laWdoYm91cigpLnBvc2l0aW9uLnggPiBtYXJrZXIucG9zaXRpb24ueCkge1xyXG4gICAgICAgIGlmIChtYXJrZXIuZ2V0VmVydGljYWxOZWlnaGJvdXIoKS5wb3NpdGlvbi55ID4gbWFya2VyLnBvc2l0aW9uLnkpIHtcclxuICAgICAgICAgIHRoaXMuaW1hZ2VDcm9wcGVyRGF0YVNoYXJlLnNldE92ZXIodGhpcy5jYW52YXMpO1xyXG4gICAgICAgICAgdGhpcy5pbWFnZUNyb3BwZXJEYXRhU2hhcmUuc2V0U3R5bGUodGhpcy5jYW52YXMsICdud3NlLXJlc2l6ZScpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLmltYWdlQ3JvcHBlckRhdGFTaGFyZS5zZXRPdmVyKHRoaXMuY2FudmFzKTtcclxuICAgICAgICAgIHRoaXMuaW1hZ2VDcm9wcGVyRGF0YVNoYXJlLnNldFN0eWxlKHRoaXMuY2FudmFzLCAnbmVzdy1yZXNpemUnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKG1hcmtlci5nZXRWZXJ0aWNhbE5laWdoYm91cigpLnBvc2l0aW9uLnkgPiBtYXJrZXIucG9zaXRpb24ueSkge1xyXG4gICAgICAgICAgdGhpcy5pbWFnZUNyb3BwZXJEYXRhU2hhcmUuc2V0T3Zlcih0aGlzLmNhbnZhcyk7XHJcbiAgICAgICAgICB0aGlzLmltYWdlQ3JvcHBlckRhdGFTaGFyZS5zZXRTdHlsZSh0aGlzLmNhbnZhcywgJ25lc3ctcmVzaXplJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuaW1hZ2VDcm9wcGVyRGF0YVNoYXJlLnNldE92ZXIodGhpcy5jYW52YXMpO1xyXG4gICAgICAgICAgdGhpcy5pbWFnZUNyb3BwZXJEYXRhU2hhcmUuc2V0U3R5bGUodGhpcy5jYW52YXMsICdud3NlLXJlc2l6ZScpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIG1hcmtlci5zZXRPdmVyKGZhbHNlKTtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBvblRvdWNoU3RhcnQoZXZlbnQ6IFRvdWNoRXZlbnQpIHtcclxuICAgIGlmICh0aGlzLmNyb3AuaXNJbWFnZVNldCgpKSB7XHJcbiAgICAgIGNvbnN0IHRvdWNoID0gZXZlbnQudG91Y2hlc1swXTtcclxuICAgICAgY29uc3QgdG91Y2hQb3NpdGlvbiA9IHRoaXMuZ2V0VG91Y2hQb3ModGhpcy5jYW52YXMsIHRvdWNoKTtcclxuICAgICAgY29uc3QgY3JvcFRvdWNoID0gbmV3IENyb3BUb3VjaChcclxuICAgICAgICB0b3VjaFBvc2l0aW9uLngsXHJcbiAgICAgICAgdG91Y2hQb3NpdGlvbi55LFxyXG4gICAgICAgIHRvdWNoLmlkZW50aWZpZXJcclxuICAgICAgKTtcclxuICAgICAgbmV3IFBvaW50UG9vbCgpLmluc3RhbmNlLnJldHVyblBvaW50KHRvdWNoUG9zaXRpb24pO1xyXG5cclxuICAgICAgdGhpcy5pc01vdXNlRG93biA9IGZhbHNlO1xyXG4gICAgICBmb3IgKGNvbnN0IG1hcmtlciBvZiB0aGlzLm1hcmtlcnMpIHtcclxuICAgICAgICBpZiAobWFya2VyLnRvdWNoSW5Cb3VuZHMoY3JvcFRvdWNoLngsIGNyb3BUb3VjaC55KSkge1xyXG4gICAgICAgICAgdGhpcy5pc01vdXNlRG93biA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLmNlbnRlci50b3VjaEluQm91bmRzKGNyb3BUb3VjaC54LCBjcm9wVG91Y2gueSkpIHtcclxuICAgICAgICB0aGlzLmlzTW91c2VEb3duID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIG9uVG91Y2hFbmQoZXZlbnQ6IFRvdWNoRXZlbnQpIHtcclxuICAgIGlmICh0aGlzLmNyb3AuaXNJbWFnZVNldCgpKSB7XHJcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpwcmVmZXItZm9yLW9mXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXZlbnQuY2hhbmdlZFRvdWNoZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCB0b3VjaCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzW2ldO1xyXG4gICAgICAgIGNvbnN0IGRyYWdUb3VjaCA9IHRoaXMuZ2V0RHJhZ1RvdWNoRm9ySUQodG91Y2guaWRlbnRpZmllcik7XHJcbiAgICAgICAgaWYgKGRyYWdUb3VjaCAmJiBkcmFnVG91Y2ggIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICBkcmFnVG91Y2guZHJhZ0hhbmRsZSBpbnN0YW5jZW9mIENvcm5lck1hcmtlciB8fFxyXG4gICAgICAgICAgICBkcmFnVG91Y2guZHJhZ0hhbmRsZSBpbnN0YW5jZW9mIERyYWdNYXJrZXJcclxuICAgICAgICAgICkge1xyXG4gICAgICAgICAgICBkcmFnVG91Y2guZHJhZ0hhbmRsZS5zZXRPdmVyKGZhbHNlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuaGFuZGxlUmVsZWFzZShkcmFnVG91Y2gpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMuY3VycmVudERyYWdUb3VjaGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIHRoaXMuaXNNb3VzZURvd24gPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRseUludGVyYWN0aW5nID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTE5MjkwOTkvaHRtbDUtY2FudmFzLWRyYXdpbWFnZS1yYXRpby1idWctaW9zXHJcbiAgcHVibGljIGRyYXdJbWFnZUlPU0ZpeChcclxuICAgIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELFxyXG4gICAgaW1nOiBIVE1MSW1hZ2VFbGVtZW50IHwgSFRNTENhbnZhc0VsZW1lbnQgfCBIVE1MVmlkZW9FbGVtZW50LFxyXG4gICAgc3g6IG51bWJlcixcclxuICAgIHN5OiBudW1iZXIsXHJcbiAgICBzdzogbnVtYmVyLFxyXG4gICAgc2g6IG51bWJlcixcclxuICAgIGR4OiBudW1iZXIsXHJcbiAgICBkeTogbnVtYmVyLFxyXG4gICAgZHc6IG51bWJlcixcclxuICAgIGRoOiBudW1iZXJcclxuICApIHtcclxuICAgIC8vIFdvcmtzIG9ubHkgaWYgd2hvbGUgaW1hZ2UgaXMgZGlzcGxheWVkOlxyXG4gICAgLy8gY3R4LmRyYXdJbWFnZShpbWcsIHN4LCBzeSwgc3csIHNoLCBkeCwgZHksIGR3LCBkaCAvIHZlcnRTcXVhc2hSYXRpbyk7XHJcbiAgICAvLyBUaGUgZm9sbG93aW5nIHdvcmtzIGNvcnJlY3QgYWxzbyB3aGVuIG9ubHkgYSBwYXJ0IG9mIHRoZSBpbWFnZSBpcyBkaXNwbGF5ZWQ6XHJcbiAgICAvLyBjdHguZHJhd0ltYWdlKGltZywgc3ggKiB0aGlzLnZlcnRTcXVhc2hSYXRpbywgc3kgKiB0aGlzLnZlcnRTcXVhc2hSYXRpbywgc3cgKiB0aGlzLnZlcnRTcXVhc2hSYXRpbywgc2ggKlxyXG4gICAgLy8gdGhpcy52ZXJ0U3F1YXNoUmF0aW8sIGR4LCBkeSwgZHcsIGRoKTtcclxuICAgIGN0eC5kcmF3SW1hZ2UoaW1nLCBzeCwgc3ksIHN3LCBzaCwgZHgsIGR5LCBkdywgZGgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIG9uTW91c2VEb3duKGV2ZW50OiBNb3VzZUV2ZW50KSB7XHJcbiAgICBpZiAodGhpcy5jcm9wLmlzSW1hZ2VTZXQoKSkge1xyXG4gICAgICB0aGlzLmlzTW91c2VEb3duID0gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBvbk1vdXNlVXAoZXZlbnQ6IE1vdXNlRXZlbnQpIHtcclxuICAgIGlmICh0aGlzLmNyb3AuaXNJbWFnZVNldCgpKSB7XHJcbiAgICAgIHRoaXMuaW1hZ2VDcm9wcGVyRGF0YVNoYXJlLnNldFJlbGVhc2VkKHRoaXMuY2FudmFzKTtcclxuICAgICAgdGhpcy5pc01vdXNlRG93biA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmhhbmRsZVJlbGVhc2UobmV3IENyb3BUb3VjaCgwLCAwLCAwKSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==