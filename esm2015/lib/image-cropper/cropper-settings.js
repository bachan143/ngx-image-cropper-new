import { CropperDrawSettings } from './cropper-draw-settings';
export class CropperSettings {
    constructor(settings) {
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
        this.showFullCropInitial = false;
        this._rounded = false;
        this._keepAspect = true;
        if (typeof settings === "object") {
            Object.assign(this, settings);
        }
    }
        get rounded(){
            return this._rounded;
        }
        set rounded(val) {
            this._rounded = val;
            if (val) {
                this._keepAspect = true;
            }
        }
        get keepAspect() {
            return this._keepAspect;
        }
        set keepAspect(val) {
            this._keepAspect = val;
            if (this._rounded === true && this._keepAspect === false) {
                console.error("Cannot set keep aspect to false on rounded cropper. Ellipsis not supported");
                this._keepAspect = true;
            }
        }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JvcHBlci1zZXR0aW5ncy5qcyIsInNvdXJjZVJvb3QiOiJDOi93b3Jrc3BhY2Uvbmd4LWltZy1jcm9wcGVyL3Byb2plY3RzL25neC1pbWctY3JvcHBlci9zcmMvIiwic291cmNlcyI6WyJsaWIvaW1hZ2UtY3JvcHBlci9jcm9wcGVyLXNldHRpbmdzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBK0I5RCxNQUFNLE9BQU8sZUFBZTtJQXlDMUIsWUFBWSxRQUEyQjtRQXhDaEMsZ0JBQVcsR0FBRyxHQUFHLENBQUM7UUFDbEIsaUJBQVksR0FBRyxHQUFHLENBQUM7UUFFbkIsa0JBQWEsR0FBRyxLQUFLLENBQUM7UUFJdEIsVUFBSyxHQUFHLEdBQUcsQ0FBQztRQUNaLFdBQU0sR0FBRyxHQUFHLENBQUM7UUFFYixhQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ2QsY0FBUyxHQUFHLEVBQUUsQ0FBQztRQUNmLGdDQUEyQixHQUFHLElBQUksQ0FBQztRQUVuQyxpQkFBWSxHQUFHLEdBQUcsQ0FBQztRQUNuQixrQkFBYSxHQUFHLEdBQUcsQ0FBQztRQUVwQix3QkFBbUIsR0FBd0IsSUFBSSxtQkFBbUIsRUFBRSxDQUFDO1FBQ3JFLGdCQUFXLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLGdCQUFXLEdBQUcsS0FBSyxDQUFDO1FBTXBCLHlCQUFvQixHQUFHLENBQUMsQ0FBQztRQUN6QixzQkFBaUIsR0FBRyxFQUFFLENBQUM7UUFDdkIscUJBQWdCLEdBQUcsSUFBSSxDQUFDO1FBRXhCLHNCQUFpQixHQUFXLHlCQUF5QixDQUFDO1FBQ3RELGlCQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBRXJCLGtCQUFhLEdBQUcsR0FBRyxDQUFDO1FBRTNCLHlDQUF5QztRQUNqQyxhQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ3pCLHlDQUF5QztRQUNqQyxnQkFBVyxHQUFHLElBQUksQ0FBQztRQUd6QixJQUFJLE9BQU8sUUFBUSxLQUFLLFFBQVEsRUFBRTtZQUNoQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztTQUMvQjtJQUNILENBQUM7SUFFRCxJQUFJLE9BQU8sQ0FBQyxHQUFZO1FBQ3RCLElBQUksQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO1FBQ3BCLElBQUksR0FBRyxFQUFFO1lBQ1AsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7U0FDekI7SUFDSCxDQUFDO0lBRUQsSUFBSSxPQUFPO1FBQ1QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxJQUFJLFVBQVUsQ0FBQyxHQUFZO1FBQ3pCLElBQUksQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDO1FBQ3ZCLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLFdBQVcsS0FBSyxLQUFLLEVBQUU7WUFDeEQsT0FBTyxDQUFDLEtBQUssQ0FDWCw0RUFBNEUsQ0FDN0UsQ0FBQztZQUNGLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQztJQUVELElBQUksVUFBVTtRQUNaLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUMxQixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDcm9wcGVyRHJhd1NldHRpbmdzIH0gZnJvbSAnLi9jcm9wcGVyLWRyYXctc2V0dGluZ3MnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQ3JvcHBlclNldHRpbmdzIHtcclxuICBjYW52YXNXaWR0aD86IG51bWJlcjtcclxuICBjYW52YXNIZWlnaHQ/OiBudW1iZXI7XHJcbiAgZHluYW1pY1NpemluZz86IGJvb2xlYW47XHJcbiAgY3JvcHBlckNsYXNzPzogc3RyaW5nO1xyXG4gIGNyb3BwaW5nQ2xhc3M/OiBzdHJpbmc7XHJcbiAgd2lkdGg/OiBudW1iZXI7XHJcbiAgaGVpZ2h0PzogbnVtYmVyO1xyXG4gIG1pbldpZHRoPzogbnVtYmVyO1xyXG4gIG1pbkhlaWdodD86IG51bWJlcjtcclxuICBtaW5XaXRoUmVsYXRpdmVUb1Jlc29sdXRpb24/OiBib29sZWFuO1xyXG4gIGNyb3BwZWRXaWR0aD86IG51bWJlcjtcclxuICBjcm9wcGVkSGVpZ2h0PzogbnVtYmVyO1xyXG4gIGNyb3BwZXJEcmF3U2V0dGluZ3M/OiBhbnk7XHJcbiAgdG91Y2hSYWRpdXM/OiBudW1iZXI7XHJcbiAgbm9GaWxlSW5wdXQ/OiBib29sZWFuO1xyXG4gIGZpbGVUeXBlPzogc3RyaW5nO1xyXG4gIHJlc2FtcGxlRm4/OiAoYzogSFRNTENhbnZhc0VsZW1lbnQpID0+IHZvaWQ7XHJcbiAgbWFya2VyU2l6ZU11bHRpcGxpZXI/OiBudW1iZXI7XHJcbiAgY2VudGVyVG91Y2hSYWRpdXM/OiBudW1iZXI7XHJcbiAgc2hvd0NlbnRlck1hcmtlcj86IGJvb2xlYW47XHJcbiAgYWxsb3dlZEZpbGVzUmVnZXg/OiBSZWdFeHA7XHJcbiAgY3JvcE9uUmVzaXplPzogYm9vbGVhbjtcclxuICBwcmVzZXJ2ZVNpemU/OiBib29sZWFuO1xyXG4gIGNvbXByZXNzUmF0aW8/OiBudW1iZXI7XHJcbiAgcm91bmRlZD86IGJvb2xlYW47XHJcbiAga2VlcEFzcGVjdD86IGJvb2xlYW47XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBDcm9wcGVyU2V0dGluZ3MgaW1wbGVtZW50cyBJQ3JvcHBlclNldHRpbmdzIHtcclxuICBwdWJsaWMgY2FudmFzV2lkdGggPSAzMDA7XHJcbiAgcHVibGljIGNhbnZhc0hlaWdodCA9IDMwMDtcclxuXHJcbiAgcHVibGljIGR5bmFtaWNTaXppbmcgPSBmYWxzZTtcclxuICBwdWJsaWMgY3JvcHBlckNsYXNzOiBzdHJpbmc7XHJcbiAgcHVibGljIGNyb3BwaW5nQ2xhc3M6IHN0cmluZztcclxuXHJcbiAgcHVibGljIHdpZHRoID0gMjAwO1xyXG4gIHB1YmxpYyBoZWlnaHQgPSAyMDA7XHJcblxyXG4gIHB1YmxpYyBtaW5XaWR0aCA9IDUwO1xyXG4gIHB1YmxpYyBtaW5IZWlnaHQgPSA1MDtcclxuICBwdWJsaWMgbWluV2l0aFJlbGF0aXZlVG9SZXNvbHV0aW9uID0gdHJ1ZTtcclxuXHJcbiAgcHVibGljIGNyb3BwZWRXaWR0aCA9IDEwMDtcclxuICBwdWJsaWMgY3JvcHBlZEhlaWdodCA9IDEwMDtcclxuXHJcbiAgcHVibGljIGNyb3BwZXJEcmF3U2V0dGluZ3M6IENyb3BwZXJEcmF3U2V0dGluZ3MgPSBuZXcgQ3JvcHBlckRyYXdTZXR0aW5ncygpO1xyXG4gIHB1YmxpYyB0b3VjaFJhZGl1cyA9IDIwO1xyXG4gIHB1YmxpYyBub0ZpbGVJbnB1dCA9IGZhbHNlO1xyXG5cclxuICBwdWJsaWMgZmlsZVR5cGU6IHN0cmluZztcclxuXHJcbiAgcHVibGljIHJlc2FtcGxlRm46IChjOiBIVE1MQ2FudmFzRWxlbWVudCkgPT4gdm9pZDtcclxuXHJcbiAgcHVibGljIG1hcmtlclNpemVNdWx0aXBsaWVyID0gMTtcclxuICBwdWJsaWMgY2VudGVyVG91Y2hSYWRpdXMgPSAyMDtcclxuICBwdWJsaWMgc2hvd0NlbnRlck1hcmtlciA9IHRydWU7XHJcblxyXG4gIHB1YmxpYyBhbGxvd2VkRmlsZXNSZWdleDogUmVnRXhwID0gL1xcLihqcGU/Z3xwbmd8Z2lmfGJtcCkkL2k7XHJcbiAgcHVibGljIGNyb3BPblJlc2l6ZSA9IHRydWU7XHJcbiAgcHVibGljIHByZXNlcnZlU2l6ZSA9IGZhbHNlO1xyXG5cclxuICBwdWJsaWMgY29tcHJlc3NSYXRpbyA9IDEuMDtcclxuXHJcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWVcclxuICBwcml2YXRlIF9yb3VuZGVkID0gZmFsc2U7XHJcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhcmlhYmxlLW5hbWVcclxuICBwcml2YXRlIF9rZWVwQXNwZWN0ID0gdHJ1ZTtcclxuXHJcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3M/OiBJQ3JvcHBlclNldHRpbmdzKSB7XHJcbiAgICBpZiAodHlwZW9mIHNldHRpbmdzID09PSAnb2JqZWN0Jykge1xyXG4gICAgICBPYmplY3QuYXNzaWduKHRoaXMsIHNldHRpbmdzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNldCByb3VuZGVkKHZhbDogYm9vbGVhbikge1xyXG4gICAgdGhpcy5fcm91bmRlZCA9IHZhbDtcclxuICAgIGlmICh2YWwpIHtcclxuICAgICAgdGhpcy5fa2VlcEFzcGVjdCA9IHRydWU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXQgcm91bmRlZCgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLl9yb3VuZGVkO1xyXG4gIH1cclxuXHJcbiAgc2V0IGtlZXBBc3BlY3QodmFsOiBib29sZWFuKSB7XHJcbiAgICB0aGlzLl9rZWVwQXNwZWN0ID0gdmFsO1xyXG4gICAgaWYgKHRoaXMuX3JvdW5kZWQgPT09IHRydWUgJiYgdGhpcy5fa2VlcEFzcGVjdCA9PT0gZmFsc2UpIHtcclxuICAgICAgY29uc29sZS5lcnJvcihcclxuICAgICAgICAnQ2Fubm90IHNldCBrZWVwIGFzcGVjdCB0byBmYWxzZSBvbiByb3VuZGVkIGNyb3BwZXIuIEVsbGlwc2lzIG5vdCBzdXBwb3J0ZWQnXHJcbiAgICAgICk7XHJcbiAgICAgIHRoaXMuX2tlZXBBc3BlY3QgPSB0cnVlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0IGtlZXBBc3BlY3QoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5fa2VlcEFzcGVjdDtcclxuICB9XHJcbn1cclxuIl19