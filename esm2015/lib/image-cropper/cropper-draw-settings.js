export class CropperDrawSettings {
    constructor(settings) {
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
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JvcHBlci1kcmF3LXNldHRpbmdzLmpzIiwic291cmNlUm9vdCI6IkM6L3dvcmtzcGFjZS9uZ3gtaW1nLWNyb3BwZXIvcHJvamVjdHMvbmd4LWltZy1jcm9wcGVyL3NyYy8iLCJzb3VyY2VzIjpbImxpYi9pbWFnZS1jcm9wcGVyL2Nyb3BwZXItZHJhdy1zZXR0aW5ncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxNQUFNLE9BQU8sbUJBQW1CO0lBVTlCLFlBQVksUUFBYztRQVRuQixhQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLGdCQUFXLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLGdCQUFXLEdBQUcscUJBQXFCLENBQUM7UUFDcEMsY0FBUyxHQUFHLHFCQUFxQixDQUFDO1FBQ2xDLHdCQUFtQixHQUFHLENBQUMsQ0FBQztRQUN4Qix3QkFBbUIsR0FBRyxlQUFlLENBQUM7UUFDdEMsc0JBQWlCLEdBQUcscUJBQXFCLENBQUM7UUFDMUMsd0JBQW1CLEdBQUcsaUJBQWlCLENBQUM7UUFHN0MsSUFBSSxPQUFPLFFBQVEsS0FBSyxRQUFRLEVBQUU7WUFDaEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDbkQsSUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUM7WUFDNUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDdEQsSUFBSSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUM7WUFDNUQsSUFBSSxDQUFDLG1CQUFtQjtnQkFDdEIsUUFBUSxDQUFDLG1CQUFtQixJQUFJLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztZQUMzRCxJQUFJLENBQUMsbUJBQW1CO2dCQUN0QixRQUFRLENBQUMsbUJBQW1CLElBQUksSUFBSSxDQUFDLG1CQUFtQixDQUFDO1lBQzNELElBQUksQ0FBQyxpQkFBaUI7Z0JBQ3BCLFFBQVEsQ0FBQyxpQkFBaUIsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUM7WUFDdkQsSUFBSSxDQUFDLG1CQUFtQjtnQkFDdEIsUUFBUSxDQUFDLG1CQUFtQixJQUFJLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztTQUM1RDtJQUNILENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBDcm9wcGVyRHJhd1NldHRpbmdzIHtcclxuICBwdWJsaWMgbGluZURhc2ggPSBmYWxzZTtcclxuICBwdWJsaWMgc3Ryb2tlV2lkdGggPSAxO1xyXG4gIHB1YmxpYyBzdHJva2VDb2xvciA9ICdyZ2JhKDI1NSwyNTUsMjU1LDEpJztcclxuICBwdWJsaWMgZmlsbENvbG9yID0gJ3JnYmEoMjU1LDI1NSwyNTUsMSknO1xyXG4gIHB1YmxpYyBkcmFnSWNvblN0cm9rZVdpZHRoID0gMTtcclxuICBwdWJsaWMgZHJhZ0ljb25TdHJva2VDb2xvciA9ICdyZ2JhKDAsMCwwLDEpJztcclxuICBwdWJsaWMgZHJhZ0ljb25GaWxsQ29sb3IgPSAncmdiYSgyNTUsMjU1LDI1NSwxKSc7XHJcbiAgcHVibGljIGJhY2tncm91bmRGaWxsQ29sb3IgPSAncmdiYSgwLDAsMCwwLjYpJztcclxuXHJcbiAgY29uc3RydWN0b3Ioc2V0dGluZ3M/OiBhbnkpIHtcclxuICAgIGlmICh0eXBlb2Ygc2V0dGluZ3MgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgIHRoaXMubGluZURhc2ggPSBzZXR0aW5ncy5saW5lRGFzaCB8fCB0aGlzLmxpbmVEYXNoO1xyXG4gICAgICB0aGlzLnN0cm9rZVdpZHRoID0gc2V0dGluZ3Muc3Ryb2tlV2lkdGggfHwgdGhpcy5zdHJva2VXaWR0aDtcclxuICAgICAgdGhpcy5maWxsQ29sb3IgPSBzZXR0aW5ncy5maWxsQ29sb3IgfHwgdGhpcy5maWxsQ29sb3I7XHJcbiAgICAgIHRoaXMuc3Ryb2tlQ29sb3IgPSBzZXR0aW5ncy5zdHJva2VDb2xvciB8fCB0aGlzLnN0cm9rZUNvbG9yO1xyXG4gICAgICB0aGlzLmRyYWdJY29uU3Ryb2tlV2lkdGggPVxyXG4gICAgICAgIHNldHRpbmdzLmRyYWdJY29uU3Ryb2tlV2lkdGggfHwgdGhpcy5kcmFnSWNvblN0cm9rZVdpZHRoO1xyXG4gICAgICB0aGlzLmRyYWdJY29uU3Ryb2tlQ29sb3IgPVxyXG4gICAgICAgIHNldHRpbmdzLmRyYWdJY29uU3Ryb2tlQ29sb3IgfHwgdGhpcy5kcmFnSWNvblN0cm9rZUNvbG9yO1xyXG4gICAgICB0aGlzLmRyYWdJY29uRmlsbENvbG9yID1cclxuICAgICAgICBzZXR0aW5ncy5kcmFnSWNvbkZpbGxDb2xvciB8fCB0aGlzLmRyYWdJY29uRmlsbENvbG9yO1xyXG4gICAgICB0aGlzLmJhY2tncm91bmRGaWxsQ29sb3IgPVxyXG4gICAgICAgIHNldHRpbmdzLmJhY2tncm91bmRGaWxsQ29sb3IgfHwgdGhpcy5iYWNrZ3JvdW5kRmlsbENvbG9yO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=