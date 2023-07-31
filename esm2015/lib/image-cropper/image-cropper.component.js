import { Component, ViewChild, ElementRef, Input, Output, EventEmitter, Renderer2, Inject } from '@angular/core';
import { CropperSettings } from './cropper-settings';
import { ImageCropper } from './imageCropper';
import { CropPosition } from './model/cropPosition';
import { Exif } from './exif';
import { DOCUMENT } from '@angular/common';
export class ImageCropperComponent {
    constructor(renderer, document) {
        this.document = document;
        this.imageZoom = 1;
        this.cropPositionChange = new EventEmitter();
        this.exif = new Exif();
        // tslint:disable-next-line:no-output-on-prefix
        this.onCrop = new EventEmitter();
        this.imageSet = new EventEmitter();
        this.dragUnsubscribers = [];
        this.renderer = renderer;
    }
    ngAfterViewInit() {
        const canvas = this.cropcanvas.nativeElement;
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
        this.cropper.setImageZoom(this.imageZoom);
        this.cropper.prepare(canvas);
    }
    ngOnChanges(changes) {
        if (this.isCropPositionChanged(changes)) {
            this.cropper.updateCropPosition(this.cropPosition.toBounds());
            if (this.cropper.isImageSet()) {
                const bounds = this.cropper.getCropBounds();
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
        if (changes.imageZoom && !!this.cropper && this.cropper.setImageZoom) {
            this.cropper.setImageZoom(changes.imageZoom.currentValue);
            this.cropper.redrawImage();
        }
    }
    ngOnDestroy() {
        this.removeDragListeners();
        if (this.settings.dynamicSizing && this.windowListener) {
            window.removeEventListener('resize', this.windowListener);
        }
    }
    onTouchMove(event) {
        this.cropper.onTouchMove(event);
    }
    onTouchStart(event) {
        this.cropper.onTouchStart(event);
    }
    onTouchEnd(event) {
        this.cropper.onTouchEnd(event);
        if (this.cropper.isImageSet()) {
            this.image.image = this.cropper.getCroppedImageHelper().src;
            this.onCrop.emit(this.cropper.getCropBounds());
            this.updateCropBounds();
        }
    }
    onMouseDown(event) {
        this.dragUnsubscribers.push(this.renderer.listen(this.document, 'mousemove', this.onMouseMove.bind(this)));
        this.dragUnsubscribers.push(this.renderer.listen(this.document, 'mouseup', this.onMouseUp.bind(this)));
        this.cropper.onMouseDown(event);
        // if (!this.cropper.isImageSet() && !this.settings.noFileInput) {
        //   // load img
        //   this.fileInput.nativeElement.click();
        // }
    }
    removeDragListeners() {
        this.dragUnsubscribers.forEach(unsubscribe => unsubscribe());
    }
    onMouseUp(event) {
        this.removeDragListeners();
        if (this.cropper.isImageSet()) {
            this.cropper.onMouseUp(event);
            this.image.image = this.cropper.getCroppedImageHelper().src;
            this.onCrop.emit(this.cropper.getCropBounds());
            this.updateCropBounds();
        }
    }
    onMouseMove(event) {
        this.cropper.onMouseMove(event);
    }
    fileChangeListener($event) {
        if ($event.target.files.length === 0) {
            return;
        }
        const file = $event.target.files[0];
        if (this.settings.allowedFilesRegex.test(file.name)) {
            const image = new Image();
            const fileReader = new FileReader();
            fileReader.addEventListener('loadend', (loadEvent) => {
                image.addEventListener('load', () => {
                    this.setImage(image);
                });
                image.src = loadEvent.target.result;
            });
            fileReader.readAsDataURL(file);
        }
    }
    resize() {
        const canvas = this.cropcanvas.nativeElement;
        this.settings.canvasWidth = canvas.offsetWidth;
        this.settings.canvasHeight = canvas.offsetHeight;
        this.cropper.resizeCanvas(canvas.offsetWidth, canvas.offsetHeight, true);
    }
    reset() {
        this.cropper.reset();
        this.renderer.setAttribute(this.cropcanvas.nativeElement, 'class', this.settings.cropperClass);
        this.image.image = this.cropper.getCroppedImageHelper().src;
    }
    setImage(image, newBounds = null) {
        this.imageSet.emit(true);
        this.renderer.setAttribute(this.cropcanvas.nativeElement, 'class', `${this.settings.cropperClass} ${this.settings.croppingClass}`);
        this.raf = window.requestAnimationFrame(() => {
            if (this.raf) {
                window.cancelAnimationFrame(this.raf);
            }
            if (image.naturalHeight > 0 && image.naturalWidth > 0) {
                image.height = image.naturalHeight;
                image.width = image.naturalWidth;
                window.cancelAnimationFrame(this.raf);
                this.getOrientedImage(image, (img) => {
                    if (this.settings.dynamicSizing) {
                        const canvas = this.cropcanvas.nativeElement;
                        this.settings.canvasWidth = canvas.offsetWidth;
                        this.settings.canvasHeight = canvas.offsetHeight;
                        this.cropper.resizeCanvas(canvas.offsetWidth, canvas.offsetHeight, false);
                    }
                    this.cropper.setImage(img);
                    if (this.cropPosition && this.cropPosition.isInitialized()) {
                        this.cropper.updateCropPosition(this.cropPosition.toBounds());
                    }
                    this.image.original = img;
                    let bounds = this.cropper.getCropBounds();
                    this.image.image = this.cropper.getCroppedImageHelper().src;
                    if (!this.image) {
                        this.image = image;
                    }
                    if (newBounds != null) {
                        bounds = newBounds;
                        this.cropper.setBounds(bounds);
                        this.cropper.updateCropPosition(bounds);
                    }
                    this.onCrop.emit(bounds);
                });
            }
        });
    }
    isCropPositionChanged(changes) {
        if (this.cropper &&
            changes.cropPosition &&
            this.isCropPositionUpdateNeeded) {
            return true;
        }
        else {
            this.isCropPositionUpdateNeeded = true;
            return false;
        }
    }
    updateCropBounds() {
        const cropBound = this.cropper.getCropBounds();
        this.cropPositionChange.emit(new CropPosition(cropBound.left, cropBound.top, cropBound.width, cropBound.height));
        this.isCropPositionUpdateNeeded = false;
    }
    getOrientedImage(image, callback) {
        let img;
        this.exif.getData(image, () => {
            const orientation = this.exif.getTag(image, 'Orientation');
            if ([3, 6, 8].indexOf(orientation) > -1) {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                let cw = image.width;
                let ch = image.height;
                let cx = 0;
                let cy = 0;
                let deg = 0;
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
                img.addEventListener('load', () => {
                    callback(img);
                });
                img.src = canvas.toDataURL('image/png');
            }
            else {
                img = image;
                callback(img);
            }
        });
    }
}
ImageCropperComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'img-cropper',
                template: "<span class=\"ng2-imgcrop\">\r\n  <input\r\n    *ngIf=\"!settings.noFileInput\"\r\n    #fileInput\r\n    type=\"file\"\r\n    accept=\"image/*\"\r\n    (change)=\"fileChangeListener($event)\"\r\n  />\r\n  <canvas\r\n    #cropcanvas\r\n    (mousedown)=\"onMouseDown($event)\"\r\n    (touchmove)=\"onTouchMove($event)\"\r\n    (touchend)=\"onTouchEnd($event)\"\r\n    (touchstart)=\"onTouchStart($event)\"\r\n  >\r\n  </canvas>\r\n</span>\r\n"
            },] }
];
ImageCropperComponent.ctorParameters = () => [
    { type: Renderer2 },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
];
ImageCropperComponent.propDecorators = {
    cropcanvas: [{ type: ViewChild, args: ['cropcanvas', { static: true },] }],
    fileInput: [{ type: ViewChild, args: ['fileInput',] }],
    settings: [{ type: Input }],
    image: [{ type: Input }],
    inputImage: [{ type: Input }],
    imageZoom: [{ type: Input },],
    cropper: [{ type: Input }],
    cropPosition: [{ type: Input }],
    cropPositionChange: [{ type: Output }],
    onCrop: [{ type: Output }],
    imageSet: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2UtY3JvcHBlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiQzovd29ya3NwYWNlL25neC1pbWctY3JvcHBlci9wcm9qZWN0cy9uZ3gtaW1nLWNyb3BwZXIvc3JjLyIsInNvdXJjZXMiOlsibGliL2ltYWdlLWNyb3BwZXIvaW1hZ2UtY3JvcHBlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFJVCxTQUFTLEVBQ1QsVUFBVSxFQUNWLEtBQUssRUFDTCxNQUFNLEVBQ04sWUFBWSxFQUNaLFNBQVMsRUFDTSxNQUFNLEVBQ3RCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRXBELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFDOUIsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBTzNDLE1BQU0sT0FBTyxxQkFBcUI7SUFnQ2hDLFlBQVksUUFBbUIsRUFDTyxRQUFRO1FBQVIsYUFBUSxHQUFSLFFBQVEsQ0FBQTtRQXJCdkMsdUJBQWtCLEdBQStCLElBQUksWUFBWSxFQUVyRSxDQUFDO1FBRUksU0FBSSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7UUFFMUIsK0NBQStDO1FBQzlCLFdBQU0sR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUN0RCxhQUFRLEdBQTBCLElBQUksWUFBWSxFQUFXLENBQUM7UUFVaEUsc0JBQWlCLEdBQW1CLEVBQUUsQ0FBQztRQUk3QyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUMzQixDQUFDO0lBRU0sZUFBZTtRQUNwQixNQUFNLE1BQU0sR0FBc0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFh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LEdBQUcsRUFBRSxDQUFDO2dCQUNoQixHQUFHLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRTtvQkFDaEMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNoQixDQUFDLENBQUMsQ0FBQztnQkFDSCxHQUFHLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7YUFDekM7aUJBQU07Z0JBQ0wsR0FBRyxHQUFHLEtBQUssQ0FBQztnQkFDWixRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDZjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7O1lBdlVGLFNBQVMsU0FBQztnQkFDVCw4Q0FBOEM7Z0JBQzlDLFFBQVEsRUFBRSxhQUFhO2dCQUN2QixvY0FBNkM7YUFDOUM7OztZQWRDLFNBQVM7NENBZ0RJLE1BQU0sU0FBQyxRQUFROzs7eUJBL0IzQixTQUFTLFNBQUMsWUFBWSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTt3QkFFeEMsU0FBUyxTQUFDLFdBQVc7dUJBRXJCLEtBQUs7b0JBQ0wsS0FBSzt5QkFDTCxLQUFLO3NCQUNMLEtBQUs7MkJBQ0wsS0FBSztpQ0FDTCxNQUFNO3FCQVFOLE1BQU07dUJBQ04sTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgQ29tcG9uZW50LFxyXG4gIEFmdGVyVmlld0luaXQsXHJcbiAgT25DaGFuZ2VzLFxyXG4gIE9uRGVzdHJveSxcclxuICBWaWV3Q2hpbGQsXHJcbiAgRWxlbWVudFJlZixcclxuICBJbnB1dCxcclxuICBPdXRwdXQsXHJcbiAgRXZlbnRFbWl0dGVyLFxyXG4gIFJlbmRlcmVyMixcclxuICBTaW1wbGVDaGFuZ2VzLCBJbmplY3RcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ3JvcHBlclNldHRpbmdzIH0gZnJvbSAnLi9jcm9wcGVyLXNldHRpbmdzJztcclxuaW1wb3J0IHsgSW1hZ2VDcm9wcGVyIH0gZnJvbSAnLi9pbWFnZUNyb3BwZXInO1xyXG5pbXBvcnQgeyBDcm9wUG9zaXRpb24gfSBmcm9tICcuL21vZGVsL2Nyb3BQb3NpdGlvbic7XHJcbmltcG9ydCB7IEJvdW5kcyB9IGZyb20gJy4vbW9kZWwvYm91bmRzJztcclxuaW1wb3J0IHsgRXhpZiB9IGZyb20gJy4vZXhpZic7XHJcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpjb21wb25lbnQtc2VsZWN0b3JcclxuICBzZWxlY3RvcjogJ2ltZy1jcm9wcGVyJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vaW1hZ2UtY3JvcHBlci5jb21wb25lbnQuaHRtbCdcclxufSlcclxuZXhwb3J0IGNsYXNzIEltYWdlQ3JvcHBlckNvbXBvbmVudFxyXG4gIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xyXG4gIEBWaWV3Q2hpbGQoJ2Nyb3BjYW52YXMnLCB7IHN0YXRpYzogdHJ1ZSB9KVxyXG4gIGNyb3BjYW52YXM6IEVsZW1lbnRSZWY7XHJcbiAgQFZpZXdDaGlsZCgnZmlsZUlucHV0JykgZmlsZUlucHV0OiBFbGVtZW50UmVmO1xyXG5cclxuICBASW5wdXQoKSBwdWJsaWMgc2V0dGluZ3M6IENyb3BwZXJTZXR0aW5ncztcclxuICBASW5wdXQoKSBwdWJsaWMgaW1hZ2U6IGFueTtcclxuICBASW5wdXQoKSBwdWJsaWMgaW5wdXRJbWFnZTogYW55O1xyXG4gIEBJbnB1dCgpIHB1YmxpYyBjcm9wcGVyOiBJbWFnZUNyb3BwZXI7XHJcbiAgQElucHV0KCkgcHVibGljIGNyb3BQb3NpdGlvbjogQ3JvcFBvc2l0aW9uO1xyXG4gIEBPdXRwdXQoKVxyXG4gIHB1YmxpYyBjcm9wUG9zaXRpb25DaGFuZ2U6IEV2ZW50RW1pdHRlcjxDcm9wUG9zaXRpb24+ID0gbmV3IEV2ZW50RW1pdHRlcjxcclxuICAgIENyb3BQb3NpdGlvblxyXG4gID4oKTtcclxuXHJcbiAgcHJpdmF0ZSBleGlmID0gbmV3IEV4aWYoKTtcclxuXHJcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLW91dHB1dC1vbi1wcmVmaXhcclxuICBAT3V0cHV0KCkgcHVibGljIG9uQ3JvcDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcbiAgQE91dHB1dCgpIGltYWdlU2V0OiBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4gPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XHJcblxyXG4gIHB1YmxpYyBjcm9wcGVkV2lkdGg6IG51bWJlcjtcclxuICBwdWJsaWMgY3JvcHBlZEhlaWdodDogbnVtYmVyO1xyXG4gIHB1YmxpYyBpbnRlcnZhbFJlZjogbnVtYmVyO1xyXG4gIHB1YmxpYyByYWY6IG51bWJlcjtcclxuICBwdWJsaWMgcmVuZGVyZXI6IFJlbmRlcmVyMjtcclxuICBwdWJsaWMgd2luZG93TGlzdGVuZXI6IEV2ZW50TGlzdGVuZXJPYmplY3Q7XHJcblxyXG4gIHByaXZhdGUgaXNDcm9wUG9zaXRpb25VcGRhdGVOZWVkZWQ6IGJvb2xlYW47XHJcbiAgcHJpdmF0ZSBkcmFnVW5zdWJzY3JpYmVyczogKCgpID0+IHZvaWQpW10gPSBbXTtcclxuXHJcbiAgY29uc3RydWN0b3IocmVuZGVyZXI6IFJlbmRlcmVyMixcclxuICAgICAgICAgICAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvY3VtZW50KSB7XHJcbiAgICB0aGlzLnJlbmRlcmVyID0gcmVuZGVyZXI7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xyXG4gICAgY29uc3QgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IHRoaXMuY3JvcGNhbnZhcy5uYXRpdmVFbGVtZW50O1xyXG5cclxuICAgIGlmICghdGhpcy5zZXR0aW5ncykge1xyXG4gICAgICB0aGlzLnNldHRpbmdzID0gbmV3IENyb3BwZXJTZXR0aW5ncygpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnNldHRpbmdzLmNyb3BwZXJDbGFzcykge1xyXG4gICAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZShjYW52YXMsICdjbGFzcycsIHRoaXMuc2V0dGluZ3MuY3JvcHBlckNsYXNzKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXRoaXMuc2V0dGluZ3MuZHluYW1pY1NpemluZykge1xyXG4gICAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZShcclxuICAgICAgICBjYW52YXMsXHJcbiAgICAgICAgJ3dpZHRoJyxcclxuICAgICAgICB0aGlzLnNldHRpbmdzLmNhbnZhc1dpZHRoLnRvU3RyaW5nKClcclxuICAgICAgKTtcclxuICAgICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUoXHJcbiAgICAgICAgY2FudmFzLFxyXG4gICAgICAgICdoZWlnaHQnLFxyXG4gICAgICAgIHRoaXMuc2V0dGluZ3MuY2FudmFzSGVpZ2h0LnRvU3RyaW5nKClcclxuICAgICAgKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMud2luZG93TGlzdGVuZXIgPSB0aGlzLnJlc2l6ZS5iaW5kKHRoaXMpO1xyXG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy53aW5kb3dMaXN0ZW5lcik7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF0aGlzLmNyb3BwZXIpIHtcclxuICAgICAgdGhpcy5jcm9wcGVyID0gbmV3IEltYWdlQ3JvcHBlcih0aGlzLnNldHRpbmdzKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNyb3BwZXIucHJlcGFyZShjYW52YXMpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLmlzQ3JvcFBvc2l0aW9uQ2hhbmdlZChjaGFuZ2VzKSkge1xyXG4gICAgICB0aGlzLmNyb3BwZXIudXBkYXRlQ3JvcFBvc2l0aW9uKHRoaXMuY3JvcFBvc2l0aW9uLnRvQm91bmRzKCkpO1xyXG4gICAgICBpZiAodGhpcy5jcm9wcGVyLmlzSW1hZ2VTZXQoKSkge1xyXG4gICAgICAgIGNvbnN0IGJvdW5kcyA9IHRoaXMuY3JvcHBlci5nZXRDcm9wQm91bmRzKCk7XHJcbiAgICAgICAgdGhpcy5pbWFnZS5pbWFnZSA9IHRoaXMuY3JvcHBlci5nZXRDcm9wcGVkSW1hZ2VIZWxwZXIoKS5zcmM7XHJcbiAgICAgICAgdGhpcy5vbkNyb3AuZW1pdChib3VuZHMpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMudXBkYXRlQ3JvcEJvdW5kcygpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChjaGFuZ2VzLmlucHV0SW1hZ2UpIHtcclxuICAgICAgdGhpcy5zZXRJbWFnZShjaGFuZ2VzLmlucHV0SW1hZ2UuY3VycmVudFZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY2hhbmdlcy5zZXR0aW5ncyAmJiB0aGlzLmNyb3BwZXIpIHtcclxuICAgICAgdGhpcy5jcm9wcGVyLnVwZGF0ZVNldHRpbmdzKHRoaXMuc2V0dGluZ3MpO1xyXG4gICAgICBpZiAodGhpcy5jcm9wcGVyLmlzSW1hZ2VTZXQoKSkge1xyXG4gICAgICAgIHRoaXMuaW1hZ2UuaW1hZ2UgPSB0aGlzLmNyb3BwZXIuZ2V0Q3JvcHBlZEltYWdlSGVscGVyKCkuc3JjO1xyXG4gICAgICAgIHRoaXMub25Dcm9wLmVtaXQodGhpcy5jcm9wcGVyLmdldENyb3BCb3VuZHMoKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpIHtcclxuICAgIHRoaXMucmVtb3ZlRHJhZ0xpc3RlbmVycygpO1xyXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuZHluYW1pY1NpemluZyAmJiB0aGlzLndpbmRvd0xpc3RlbmVyKSB7XHJcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLndpbmRvd0xpc3RlbmVyKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBvblRvdWNoTW92ZShldmVudDogVG91Y2hFdmVudCk6IHZvaWQge1xyXG4gICAgdGhpcy5jcm9wcGVyLm9uVG91Y2hNb3ZlKGV2ZW50KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBvblRvdWNoU3RhcnQoZXZlbnQ6IFRvdWNoRXZlbnQpOiB2b2lkIHtcclxuICAgIHRoaXMuY3JvcHBlci5vblRvdWNoU3RhcnQoZXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIG9uVG91Y2hFbmQoZXZlbnQ6IFRvdWNoRXZlbnQpOiB2b2lkIHtcclxuICAgIHRoaXMuY3JvcHBlci5vblRvdWNoRW5kKGV2ZW50KTtcclxuICAgIGlmICh0aGlzLmNyb3BwZXIuaXNJbWFnZVNldCgpKSB7XHJcbiAgICAgIHRoaXMuaW1hZ2UuaW1hZ2UgPSB0aGlzLmNyb3BwZXIuZ2V0Q3JvcHBlZEltYWdlSGVscGVyKCkuc3JjO1xyXG4gICAgICB0aGlzLm9uQ3JvcC5lbWl0KHRoaXMuY3JvcHBlci5nZXRDcm9wQm91bmRzKCkpO1xyXG4gICAgICB0aGlzLnVwZGF0ZUNyb3BCb3VuZHMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBvbk1vdXNlRG93bihldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xyXG4gICAgdGhpcy5kcmFnVW5zdWJzY3JpYmVycy5wdXNoKHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMuZG9jdW1lbnQsICdtb3VzZW1vdmUnLCB0aGlzLm9uTW91c2VNb3ZlLmJpbmQodGhpcykpKTtcclxuICAgIHRoaXMuZHJhZ1Vuc3Vic2NyaWJlcnMucHVzaCh0aGlzLnJlbmRlcmVyLmxpc3Rlbih0aGlzLmRvY3VtZW50LCAnbW91c2V1cCcsIHRoaXMub25Nb3VzZVVwLmJpbmQodGhpcykpKTtcclxuXHJcbiAgICB0aGlzLmNyb3BwZXIub25Nb3VzZURvd24oZXZlbnQpO1xyXG4gICAgLy8gaWYgKCF0aGlzLmNyb3BwZXIuaXNJbWFnZVNldCgpICYmICF0aGlzLnNldHRpbmdzLm5vRmlsZUlucHV0KSB7XHJcbiAgICAvLyAgIC8vIGxvYWQgaW1nXHJcbiAgICAvLyAgIHRoaXMuZmlsZUlucHV0Lm5hdGl2ZUVsZW1lbnQuY2xpY2soKTtcclxuICAgIC8vIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVtb3ZlRHJhZ0xpc3RlbmVycygpIHtcclxuICAgIHRoaXMuZHJhZ1Vuc3Vic2NyaWJlcnMuZm9yRWFjaCh1bnN1YnNjcmliZSA9PiB1bnN1YnNjcmliZSgpKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBvbk1vdXNlVXAoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcclxuICAgIHRoaXMucmVtb3ZlRHJhZ0xpc3RlbmVycygpO1xyXG4gICAgaWYgKHRoaXMuY3JvcHBlci5pc0ltYWdlU2V0KCkpIHtcclxuICAgICAgdGhpcy5jcm9wcGVyLm9uTW91c2VVcChldmVudCk7XHJcbiAgICAgIHRoaXMuaW1hZ2UuaW1hZ2UgPSB0aGlzLmNyb3BwZXIuZ2V0Q3JvcHBlZEltYWdlSGVscGVyKCkuc3JjO1xyXG4gICAgICB0aGlzLm9uQ3JvcC5lbWl0KHRoaXMuY3JvcHBlci5nZXRDcm9wQm91bmRzKCkpO1xyXG4gICAgICB0aGlzLnVwZGF0ZUNyb3BCb3VuZHMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBvbk1vdXNlTW92ZShldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xyXG4gICAgdGhpcy5jcm9wcGVyLm9uTW91c2VNb3ZlKGV2ZW50KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBmaWxlQ2hhbmdlTGlzdGVuZXIoJGV2ZW50OiBhbnkpIHtcclxuICAgIGlmICgkZXZlbnQudGFyZ2V0LmZpbGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZmlsZTogRmlsZSA9ICRldmVudC50YXJnZXQuZmlsZXNbMF07XHJcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5hbGxvd2VkRmlsZXNSZWdleC50ZXN0KGZpbGUubmFtZSkpIHtcclxuICAgICAgY29uc3QgaW1hZ2U6IGFueSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICBjb25zdCBmaWxlUmVhZGVyOiBGaWxlUmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHJcbiAgICAgIGZpbGVSZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcignbG9hZGVuZCcsIChsb2FkRXZlbnQ6IGFueSkgPT4ge1xyXG4gICAgICAgIGltYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnNldEltYWdlKGltYWdlKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpbWFnZS5zcmMgPSBsb2FkRXZlbnQudGFyZ2V0LnJlc3VsdDtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBmaWxlUmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlc2l6ZSgpIHtcclxuICAgIGNvbnN0IGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgPSB0aGlzLmNyb3BjYW52YXMubmF0aXZlRWxlbWVudDtcclxuICAgIHRoaXMuc2V0dGluZ3MuY2FudmFzV2lkdGggPSBjYW52YXMub2Zmc2V0V2lkdGg7XHJcbiAgICB0aGlzLnNldHRpbmdzLmNhbnZhc0hlaWdodCA9IGNhbnZhcy5vZmZzZXRIZWlnaHQ7XHJcbiAgICB0aGlzLmNyb3BwZXIucmVzaXplQ2FudmFzKGNhbnZhcy5vZmZzZXRXaWR0aCwgY2FudmFzLm9mZnNldEhlaWdodCwgdHJ1ZSk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgcmVzZXQoKTogdm9pZCB7XHJcbiAgICB0aGlzLmNyb3BwZXIucmVzZXQoKTtcclxuICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKFxyXG4gICAgICB0aGlzLmNyb3BjYW52YXMubmF0aXZlRWxlbWVudCxcclxuICAgICAgJ2NsYXNzJyxcclxuICAgICAgdGhpcy5zZXR0aW5ncy5jcm9wcGVyQ2xhc3NcclxuICAgICk7XHJcbiAgICB0aGlzLmltYWdlLmltYWdlID0gdGhpcy5jcm9wcGVyLmdldENyb3BwZWRJbWFnZUhlbHBlcigpLnNyYztcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzZXRJbWFnZShpbWFnZTogSFRNTEltYWdlRWxlbWVudCwgbmV3Qm91bmRzOiBhbnkgPSBudWxsKSB7XHJcbiAgICB0aGlzLmltYWdlU2V0LmVtaXQodHJ1ZSk7XHJcbiAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZShcclxuICAgICAgdGhpcy5jcm9wY2FudmFzLm5hdGl2ZUVsZW1lbnQsXHJcbiAgICAgICdjbGFzcycsXHJcbiAgICAgIGAke3RoaXMuc2V0dGluZ3MuY3JvcHBlckNsYXNzfSAke3RoaXMuc2V0dGluZ3MuY3JvcHBpbmdDbGFzc31gXHJcbiAgICApO1xyXG4gICAgdGhpcy5yYWYgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgaWYgKHRoaXMucmFmKSB7XHJcbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMucmFmKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaW1hZ2UubmF0dXJhbEhlaWdodCA+IDAgJiYgaW1hZ2UubmF0dXJhbFdpZHRoID4gMCkge1xyXG4gICAgICAgIGltYWdlLmhlaWdodCA9IGltYWdlLm5hdHVyYWxIZWlnaHQ7XHJcbiAgICAgICAgaW1hZ2Uud2lkdGggPSBpbWFnZS5uYXR1cmFsV2lkdGg7XHJcblxyXG4gICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLnJhZik7XHJcbiAgICAgICAgdGhpcy5nZXRPcmllbnRlZEltYWdlKGltYWdlLCAoaW1nOiBIVE1MSW1hZ2VFbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5keW5hbWljU2l6aW5nKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgPSB0aGlzLmNyb3BjYW52YXMubmF0aXZlRWxlbWVudDtcclxuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5jYW52YXNXaWR0aCA9IGNhbnZhcy5vZmZzZXRXaWR0aDtcclxuICAgICAgICAgICAgdGhpcy5zZXR0aW5ncy5jYW52YXNIZWlnaHQgPSBjYW52YXMub2Zmc2V0SGVpZ2h0O1xyXG4gICAgICAgICAgICB0aGlzLmNyb3BwZXIucmVzaXplQ2FudmFzKFxyXG4gICAgICAgICAgICAgIGNhbnZhcy5vZmZzZXRXaWR0aCxcclxuICAgICAgICAgICAgICBjYW52YXMub2Zmc2V0SGVpZ2h0LFxyXG4gICAgICAgICAgICAgIGZhbHNlXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgdGhpcy5jcm9wcGVyLnNldEltYWdlKGltZyk7XHJcbiAgICAgICAgICBpZiAodGhpcy5jcm9wUG9zaXRpb24gJiYgdGhpcy5jcm9wUG9zaXRpb24uaXNJbml0aWFsaXplZCgpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3JvcHBlci51cGRhdGVDcm9wUG9zaXRpb24odGhpcy5jcm9wUG9zaXRpb24udG9Cb3VuZHMoKSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgdGhpcy5pbWFnZS5vcmlnaW5hbCA9IGltZztcclxuICAgICAgICAgIGxldCBib3VuZHMgPSB0aGlzLmNyb3BwZXIuZ2V0Q3JvcEJvdW5kcygpO1xyXG4gICAgICAgICAgdGhpcy5pbWFnZS5pbWFnZSA9IHRoaXMuY3JvcHBlci5nZXRDcm9wcGVkSW1hZ2VIZWxwZXIoKS5zcmM7XHJcblxyXG4gICAgICAgICAgaWYgKCF0aGlzLmltYWdlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW1hZ2UgPSBpbWFnZTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBpZiAobmV3Qm91bmRzICE9IG51bGwpIHtcclxuICAgICAgICAgICAgYm91bmRzID0gbmV3Qm91bmRzO1xyXG4gICAgICAgICAgICB0aGlzLmNyb3BwZXIuc2V0Qm91bmRzKGJvdW5kcyk7XHJcbiAgICAgICAgICAgIHRoaXMuY3JvcHBlci51cGRhdGVDcm9wUG9zaXRpb24oYm91bmRzKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMub25Dcm9wLmVtaXQoYm91bmRzKTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGlzQ3JvcFBvc2l0aW9uQ2hhbmdlZChjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogYm9vbGVhbiB7XHJcbiAgICBpZiAoXHJcbiAgICAgIHRoaXMuY3JvcHBlciAmJlxyXG4gICAgICBjaGFuZ2VzLmNyb3BQb3NpdGlvbiAmJlxyXG4gICAgICB0aGlzLmlzQ3JvcFBvc2l0aW9uVXBkYXRlTmVlZGVkXHJcbiAgICApIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmlzQ3JvcFBvc2l0aW9uVXBkYXRlTmVlZGVkID0gdHJ1ZTtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB1cGRhdGVDcm9wQm91bmRzKCk6IHZvaWQge1xyXG4gICAgY29uc3QgY3JvcEJvdW5kOiBCb3VuZHMgPSB0aGlzLmNyb3BwZXIuZ2V0Q3JvcEJvdW5kcygpO1xyXG4gICAgdGhpcy5jcm9wUG9zaXRpb25DaGFuZ2UuZW1pdChcclxuICAgICAgbmV3IENyb3BQb3NpdGlvbihcclxuICAgICAgICBjcm9wQm91bmQubGVmdCxcclxuICAgICAgICBjcm9wQm91bmQudG9wLFxyXG4gICAgICAgIGNyb3BCb3VuZC53aWR0aCxcclxuICAgICAgICBjcm9wQm91bmQuaGVpZ2h0XHJcbiAgICAgIClcclxuICAgICk7XHJcbiAgICB0aGlzLmlzQ3JvcFBvc2l0aW9uVXBkYXRlTmVlZGVkID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldE9yaWVudGVkSW1hZ2UoXHJcbiAgICBpbWFnZTogSFRNTEltYWdlRWxlbWVudCxcclxuICAgIGNhbGxiYWNrOiAoaW1nOiBIVE1MSW1hZ2VFbGVtZW50KSA9PiB2b2lkXHJcbiAgKSB7XHJcbiAgICBsZXQgaW1nOiBhbnk7XHJcblxyXG4gICAgdGhpcy5leGlmLmdldERhdGEoaW1hZ2UsICgpID0+IHtcclxuICAgICAgY29uc3Qgb3JpZW50YXRpb24gPSB0aGlzLmV4aWYuZ2V0VGFnKGltYWdlLCAnT3JpZW50YXRpb24nKTtcclxuXHJcbiAgICAgIGlmIChbMywgNiwgOF0uaW5kZXhPZihvcmllbnRhdGlvbikgPiAtMSkge1xyXG4gICAgICAgIGNvbnN0IGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgICAgICBjb25zdCBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCA9IGNhbnZhcy5nZXRDb250ZXh0KFxyXG4gICAgICAgICAgJzJkJ1xyXG4gICAgICAgICkgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gICAgICAgIGxldCBjdzogbnVtYmVyID0gaW1hZ2Uud2lkdGg7XHJcbiAgICAgICAgbGV0IGNoOiBudW1iZXIgPSBpbWFnZS5oZWlnaHQ7XHJcbiAgICAgICAgbGV0IGN4ID0gMDtcclxuICAgICAgICBsZXQgY3kgPSAwO1xyXG4gICAgICAgIGxldCBkZWcgPSAwO1xyXG5cclxuICAgICAgICBzd2l0Y2ggKG9yaWVudGF0aW9uKSB7XHJcbiAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgIGN4ID0gLWltYWdlLndpZHRoO1xyXG4gICAgICAgICAgICBjeSA9IC1pbWFnZS5oZWlnaHQ7XHJcbiAgICAgICAgICAgIGRlZyA9IDE4MDtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlIDY6XHJcbiAgICAgICAgICAgIGN3ID0gaW1hZ2UuaGVpZ2h0O1xyXG4gICAgICAgICAgICBjaCA9IGltYWdlLndpZHRoO1xyXG4gICAgICAgICAgICBjeSA9IC1pbWFnZS5oZWlnaHQ7XHJcbiAgICAgICAgICAgIGRlZyA9IDkwO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGNhc2UgODpcclxuICAgICAgICAgICAgY3cgPSBpbWFnZS5oZWlnaHQ7XHJcbiAgICAgICAgICAgIGNoID0gaW1hZ2Uud2lkdGg7XHJcbiAgICAgICAgICAgIGN4ID0gLWltYWdlLndpZHRoO1xyXG4gICAgICAgICAgICBkZWcgPSAyNzA7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjYW52YXMud2lkdGggPSBjdztcclxuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gY2g7XHJcbiAgICAgICAgY3R4LnJvdGF0ZSgoZGVnICogTWF0aC5QSSkgLyAxODApO1xyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1hZ2UsIGN4LCBjeSk7XHJcbiAgICAgICAgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XHJcbiAgICAgICAgaW1nLndpZHRoID0gY3c7XHJcbiAgICAgICAgaW1nLmhlaWdodCA9IGNoO1xyXG4gICAgICAgIGltZy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xyXG4gICAgICAgICAgY2FsbGJhY2soaW1nKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBpbWcuc3JjID0gY2FudmFzLnRvRGF0YVVSTCgnaW1hZ2UvcG5nJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaW1nID0gaW1hZ2U7XHJcbiAgICAgICAgY2FsbGJhY2soaW1nKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==