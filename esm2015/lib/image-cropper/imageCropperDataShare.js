export class ImageCropperDataShare {
    constructor() {
        this.share = {};
    }
    setPressed(canvas) {
        this.pressed = canvas;
    }
    setReleased(canvas) {
        if (canvas === this.pressed) {
            //  this.pressed = undefined;
        }
    }
    setOver(canvas) {
        this.over = canvas;
    }
    setStyle(canvas, style) {
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
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2VDcm9wcGVyRGF0YVNoYXJlLmpzIiwic291cmNlUm9vdCI6IkM6L3dvcmtzcGFjZS9uZ3gtaW1nLWNyb3BwZXIvcHJvamVjdHMvbmd4LWltZy1jcm9wcGVyL3NyYy8iLCJzb3VyY2VzIjpbImxpYi9pbWFnZS1jcm9wcGVyL2ltYWdlQ3JvcHBlckRhdGFTaGFyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLE9BQU8scUJBQXFCO0lBQWxDO1FBQ1MsVUFBSyxHQUFRLEVBQUUsQ0FBQztJQStCekIsQ0FBQztJQTNCUSxVQUFVLENBQUMsTUFBeUI7UUFDekMsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7SUFDeEIsQ0FBQztJQUVNLFdBQVcsQ0FBQyxNQUF5QjtRQUMxQyxJQUFJLE1BQU0sS0FBSyxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQzNCLDZCQUE2QjtTQUM5QjtJQUNILENBQUM7SUFFTSxPQUFPLENBQUMsTUFBeUI7UUFDdEMsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7SUFDckIsQ0FBQztJQUVNLFFBQVEsQ0FBQyxNQUF5QixFQUFFLEtBQVU7UUFDbkQsSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLFNBQVMsRUFBRTtZQUM5QixJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssTUFBTSxFQUFFO2dCQUMzQixtQkFBbUI7Z0JBQ25CLGtFQUFrRTthQUNuRTtTQUNGO2FBQU07WUFDTCxJQUFJLE1BQU0sS0FBSyxJQUFJLENBQUMsSUFBSSxFQUFFO2dCQUN4QixtQkFBbUI7Z0JBQ25CLGtFQUFrRTthQUNuRTtTQUNGO0lBQ0gsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIEltYWdlQ3JvcHBlckRhdGFTaGFyZSB7XHJcbiAgcHVibGljIHNoYXJlOiBhbnkgPSB7fTtcclxuICBwdWJsaWMgcHJlc3NlZDogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgcHVibGljIG92ZXI6IEhUTUxDYW52YXNFbGVtZW50O1xyXG5cclxuICBwdWJsaWMgc2V0UHJlc3NlZChjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50KTogdm9pZCB7XHJcbiAgICB0aGlzLnByZXNzZWQgPSBjYW52YXM7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2V0UmVsZWFzZWQoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCk6IHZvaWQge1xyXG4gICAgaWYgKGNhbnZhcyA9PT0gdGhpcy5wcmVzc2VkKSB7XHJcbiAgICAgIC8vICB0aGlzLnByZXNzZWQgPSB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2V0T3ZlcihjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50KTogdm9pZCB7XHJcbiAgICB0aGlzLm92ZXIgPSBjYW52YXM7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2V0U3R5bGUoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgc3R5bGU6IGFueSk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMucHJlc3NlZCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIGlmICh0aGlzLnByZXNzZWQgPT09IGNhbnZhcykge1xyXG4gICAgICAgIC8vIFRPRE86IGNoZWNrIHRoaXNcclxuICAgICAgICAvLyBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5jc3MoJ2N1cnNvcicsIHN0eWxlKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKGNhbnZhcyA9PT0gdGhpcy5vdmVyKSB7XHJcbiAgICAgICAgLy8gVE9ETzogY2hlY2sgdGhpc1xyXG4gICAgICAgIC8vIGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpLmNzcygnY3Vyc29yJywgc3R5bGUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==