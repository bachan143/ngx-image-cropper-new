import { Handle } from './handle';
export class CornerMarker extends Handle {
    constructor(x, y, radius, cropperSettings) {
        super(x, y, radius, cropperSettings);
    }
    drawCornerBorder(ctx) {
        let sideLength = 10;
        if (this.over || this.drag) {
            sideLength = 12;
        }
        let hDirection = this.cropperSettings.markerSizeMultiplier;
        let vDirection = this.cropperSettings.markerSizeMultiplier;
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
    }
    drawCornerFill(ctx) {
        let sideLength = 10;
        if (this.over || this.drag) {
            sideLength = 12;
        }
        let hDirection = this.cropperSettings.markerSizeMultiplier;
        let vDirection = this.cropperSettings.markerSizeMultiplier;
        if (this.horizontalNeighbour.position.x < this.position.x) {
            hDirection = -this.cropperSettings.markerSizeMultiplier;
        }
        if (this.verticalNeighbour.position.y < this.position.y) {
            vDirection = -this.cropperSettings.markerSizeMultiplier;
        }
        if (this.cropperSettings.rounded) {
            const width = this.position.x - this.horizontalNeighbour.position.x;
            const height = this.position.y - this.verticalNeighbour.position.y;
            const offX = Math.round(Math.sin(Math.PI / 2) * Math.abs(width / 2)) / 4;
            const offY = Math.round(Math.sin(Math.PI / 2) * Math.abs(height / 2)) / 4;
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
    }
    moveX(x) {
        this.setPosition(x, this.position.y);
    }
    moveY(y) {
        this.setPosition(this.position.x, y);
    }
    move(x, y) {
        this.setPosition(x, y);
        this.verticalNeighbour.moveX(x);
        this.horizontalNeighbour.moveY(y);
    }
    addHorizontalNeighbour(neighbour) {
        this.horizontalNeighbour = neighbour;
    }
    addVerticalNeighbour(neighbour) {
        this.verticalNeighbour = neighbour;
    }
    getHorizontalNeighbour() {
        return this.horizontalNeighbour;
    }
    getVerticalNeighbour() {
        return this.verticalNeighbour;
    }
    draw(ctx) {
        this.drawCornerFill(ctx);
        this.drawCornerBorder(ctx);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ybmVyTWFya2VyLmpzIiwic291cmNlUm9vdCI6IkM6L3dvcmtzcGFjZS9uZ3gtaW1nLWNyb3BwZXIvcHJvamVjdHMvbmd4LWltZy1jcm9wcGVyL3NyYy8iLCJzb3VyY2VzIjpbImxpYi9pbWFnZS1jcm9wcGVyL21vZGVsL2Nvcm5lck1hcmtlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFXLE1BQU0sVUFBVSxDQUFDO0FBUTNDLE1BQU0sT0FBTyxZQUFhLFNBQVEsTUFBTTtJQUl0QyxZQUNFLENBQVMsRUFDVCxDQUFTLEVBQ1QsTUFBYyxFQUNkLGVBQWdDO1FBRWhDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxlQUFlLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRU0sZ0JBQWdCLENBQUMsR0FBNkI7UUFDbkQsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQzFCLFVBQVUsR0FBRyxFQUFFLENBQUM7U0FDakI7UUFFRCxJQUFJLFVBQVUsR0FBVyxJQUFJLENBQUMsZUFBZSxDQUFDLG9CQUFvQixDQUFDO1FBQ25FLElBQUksVUFBVSxHQUFXLElBQUksQ0FBQyxlQUFlLENBQUMsb0JBQW9CLENBQUM7UUFDbkUsSUFBSSxJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRTtZQUN6RCxVQUFVLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLG9CQUFvQixDQUFDO1NBQ3pEO1FBQ0QsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRTtZQUN2RCxVQUFVLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLG9CQUFvQixDQUFDO1NBQ3pEO1FBRUQsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2hCLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUU7WUFDckQsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3pCO1FBQ0QsR0FBRyxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7UUFDdkIsR0FBRyxDQUFDLE1BQU0sQ0FDUixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFDL0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQ2hDLENBQUM7UUFDRixHQUFHLENBQUMsTUFBTSxDQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLFVBQVUsR0FBRyxVQUFVLEVBQ3pELElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUNoQyxDQUFDO1FBQ0YsR0FBRyxDQUFDLE1BQU0sQ0FDUixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxVQUFVLEdBQUcsVUFBVSxFQUN6RCxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxVQUFVLEdBQUcsVUFBVSxDQUMxRCxDQUFDO1FBQ0YsR0FBRyxDQUFDLE1BQU0sQ0FDUixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFDL0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsVUFBVSxHQUFHLFVBQVUsQ0FDMUQsQ0FBQztRQUNGLEdBQUcsQ0FBQyxNQUFNLENBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQy9CLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUNoQyxDQUFDO1FBQ0YsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2hCLEdBQUcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLENBQUM7UUFDckUsR0FBRyxDQUFDLFdBQVc7WUFDYixJQUFJLENBQUMsZUFBZSxDQUFDLG1CQUFtQixDQUFDLFdBQVc7Z0JBQ3BELHNCQUFzQixDQUFDO1FBQ3pCLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNmLENBQUM7SUFFTSxjQUFjLENBQUMsR0FBNkI7UUFDakQsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQzFCLFVBQVUsR0FBRyxFQUFFLENBQUM7U0FDakI7UUFDRCxJQUFJLFVBQVUsR0FBVyxJQUFJLENBQUMsZUFBZSxDQUFDLG9CQUFvQixDQUFDO1FBQ25FLElBQUksVUFBVSxHQUFXLElBQUksQ0FBQyxlQUFlLENBQUMsb0JBQW9CLENBQUM7UUFDbkUsSUFBSSxJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRTtZQUN6RCxVQUFVLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLG9CQUFvQixDQUFDO1NBQ3pEO1FBQ0QsSUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRTtZQUN2RCxVQUFVLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLG9CQUFvQixDQUFDO1NBQ3pEO1FBRUQsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRTtZQUNoQyxNQUFNLEtBQUssR0FDVCxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN4RCxNQUFNLE1BQU0sR0FDVixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUV0RCxNQUFNLElBQUksR0FDUixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM5RCxNQUFNLElBQUksR0FDUixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUUvRCxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzlDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7U0FDL0M7YUFBTTtZQUNMLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNsQixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbkI7UUFFRCxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDaEIsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsRUFBRTtZQUNyRCxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDekI7UUFDRCxHQUFHLENBQUMsTUFBTSxDQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUMvQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FDaEMsQ0FBQztRQUNGLEdBQUcsQ0FBQyxNQUFNLENBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsVUFBVSxHQUFHLFVBQVUsRUFDekQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQ2hDLENBQUM7UUFDRixHQUFHLENBQUMsTUFBTSxDQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLFVBQVUsR0FBRyxVQUFVLEVBQ3pELElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLFVBQVUsR0FBRyxVQUFVLENBQzFELENBQUM7UUFDRixHQUFHLENBQUMsTUFBTSxDQUNSLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUMvQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxVQUFVLEdBQUcsVUFBVSxDQUMxRCxDQUFDO1FBQ0YsR0FBRyxDQUFDLE1BQU0sQ0FDUixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFDL0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQ2hDLENBQUM7UUFDRixHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7UUFDaEIsR0FBRyxDQUFDLFNBQVM7WUFDWCxJQUFJLENBQUMsZUFBZSxDQUFDLG1CQUFtQixDQUFDLFNBQVM7Z0JBQ2xELHNCQUFzQixDQUFDO1FBQ3pCLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNiLENBQUM7SUFFTSxLQUFLLENBQUMsQ0FBUztRQUNwQixJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFTSxLQUFLLENBQUMsQ0FBUztRQUNwQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFTSxJQUFJLENBQUMsQ0FBUyxFQUFFLENBQVM7UUFDOUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFTSxzQkFBc0IsQ0FBQyxTQUF1QjtRQUNuRCxJQUFJLENBQUMsbUJBQW1CLEdBQUcsU0FBUyxDQUFDO0lBQ3ZDLENBQUM7SUFFTSxvQkFBb0IsQ0FBQyxTQUF1QjtRQUNqRCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsU0FBUyxDQUFDO0lBQ3JDLENBQUM7SUFFTSxzQkFBc0I7UUFDM0IsT0FBTyxJQUFJLENBQUMsbUJBQW1CLENBQUM7SUFDbEMsQ0FBQztJQUVNLG9CQUFvQjtRQUN6QixPQUFPLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztJQUNoQyxDQUFDO0lBRU0sSUFBSSxDQUFDLEdBQTZCO1FBQ3ZDLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDekIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzdCLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEhhbmRsZSwgSUhhbmRsZSB9IGZyb20gJy4vaGFuZGxlJztcclxuaW1wb3J0IHsgQ3JvcHBlclNldHRpbmdzIH0gZnJvbSAnLi4vY3JvcHBlci1zZXR0aW5ncyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElDb3JuZXJNYXJrZXIgZXh0ZW5kcyBJSGFuZGxlIHtcclxuICBob3Jpem9udGFsTmVpZ2hib3VyOiBDb3JuZXJNYXJrZXI7XHJcbiAgdmVydGljYWxOZWlnaGJvdXI6IENvcm5lck1hcmtlcjtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENvcm5lck1hcmtlciBleHRlbmRzIEhhbmRsZSBpbXBsZW1lbnRzIElDb3JuZXJNYXJrZXIge1xyXG4gIHB1YmxpYyBob3Jpem9udGFsTmVpZ2hib3VyOiBDb3JuZXJNYXJrZXI7XHJcbiAgcHVibGljIHZlcnRpY2FsTmVpZ2hib3VyOiBDb3JuZXJNYXJrZXI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgeDogbnVtYmVyLFxyXG4gICAgeTogbnVtYmVyLFxyXG4gICAgcmFkaXVzOiBudW1iZXIsXHJcbiAgICBjcm9wcGVyU2V0dGluZ3M6IENyb3BwZXJTZXR0aW5nc1xyXG4gICkge1xyXG4gICAgc3VwZXIoeCwgeSwgcmFkaXVzLCBjcm9wcGVyU2V0dGluZ3MpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXdDb3JuZXJCb3JkZXIoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpOiB2b2lkIHtcclxuICAgIGxldCBzaWRlTGVuZ3RoID0gMTA7XHJcbiAgICBpZiAodGhpcy5vdmVyIHx8IHRoaXMuZHJhZykge1xyXG4gICAgICBzaWRlTGVuZ3RoID0gMTI7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGhEaXJlY3Rpb246IG51bWJlciA9IHRoaXMuY3JvcHBlclNldHRpbmdzLm1hcmtlclNpemVNdWx0aXBsaWVyO1xyXG4gICAgbGV0IHZEaXJlY3Rpb246IG51bWJlciA9IHRoaXMuY3JvcHBlclNldHRpbmdzLm1hcmtlclNpemVNdWx0aXBsaWVyO1xyXG4gICAgaWYgKHRoaXMuaG9yaXpvbnRhbE5laWdoYm91ci5wb3NpdGlvbi54IDwgdGhpcy5wb3NpdGlvbi54KSB7XHJcbiAgICAgIGhEaXJlY3Rpb24gPSAtdGhpcy5jcm9wcGVyU2V0dGluZ3MubWFya2VyU2l6ZU11bHRpcGxpZXI7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy52ZXJ0aWNhbE5laWdoYm91ci5wb3NpdGlvbi55IDwgdGhpcy5wb3NpdGlvbi55KSB7XHJcbiAgICAgIHZEaXJlY3Rpb24gPSAtdGhpcy5jcm9wcGVyU2V0dGluZ3MubWFya2VyU2l6ZU11bHRpcGxpZXI7XHJcbiAgICB9XHJcblxyXG4gICAgY3R4LmJlZ2luUGF0aCgpO1xyXG4gICAgaWYgKHRoaXMuY3JvcHBlclNldHRpbmdzLmNyb3BwZXJEcmF3U2V0dGluZ3MubGluZURhc2gpIHtcclxuICAgICAgY3R4LnNldExpbmVEYXNoKFsxLCAzXSk7XHJcbiAgICB9XHJcbiAgICBjdHgubGluZUpvaW4gPSAnbWl0ZXInO1xyXG4gICAgY3R4Lm1vdmVUbyhcclxuICAgICAgdGhpcy5wb3NpdGlvbi54ICsgdGhpcy5vZmZzZXQueCxcclxuICAgICAgdGhpcy5wb3NpdGlvbi55ICsgdGhpcy5vZmZzZXQueVxyXG4gICAgKTtcclxuICAgIGN0eC5saW5lVG8oXHJcbiAgICAgIHRoaXMucG9zaXRpb24ueCArIHRoaXMub2Zmc2V0LnggKyBzaWRlTGVuZ3RoICogaERpcmVjdGlvbixcclxuICAgICAgdGhpcy5wb3NpdGlvbi55ICsgdGhpcy5vZmZzZXQueVxyXG4gICAgKTtcclxuICAgIGN0eC5saW5lVG8oXHJcbiAgICAgIHRoaXMucG9zaXRpb24ueCArIHRoaXMub2Zmc2V0LnggKyBzaWRlTGVuZ3RoICogaERpcmVjdGlvbixcclxuICAgICAgdGhpcy5wb3NpdGlvbi55ICsgdGhpcy5vZmZzZXQueSArIHNpZGVMZW5ndGggKiB2RGlyZWN0aW9uXHJcbiAgICApO1xyXG4gICAgY3R4LmxpbmVUbyhcclxuICAgICAgdGhpcy5wb3NpdGlvbi54ICsgdGhpcy5vZmZzZXQueCxcclxuICAgICAgdGhpcy5wb3NpdGlvbi55ICsgdGhpcy5vZmZzZXQueSArIHNpZGVMZW5ndGggKiB2RGlyZWN0aW9uXHJcbiAgICApO1xyXG4gICAgY3R4LmxpbmVUbyhcclxuICAgICAgdGhpcy5wb3NpdGlvbi54ICsgdGhpcy5vZmZzZXQueCxcclxuICAgICAgdGhpcy5wb3NpdGlvbi55ICsgdGhpcy5vZmZzZXQueVxyXG4gICAgKTtcclxuICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgIGN0eC5saW5lV2lkdGggPSB0aGlzLmNyb3BwZXJTZXR0aW5ncy5jcm9wcGVyRHJhd1NldHRpbmdzLnN0cm9rZVdpZHRoO1xyXG4gICAgY3R4LnN0cm9rZVN0eWxlID1cclxuICAgICAgdGhpcy5jcm9wcGVyU2V0dGluZ3MuY3JvcHBlckRyYXdTZXR0aW5ncy5zdHJva2VDb2xvciB8fFxyXG4gICAgICAncmdiYSgyNTUsMjU1LDI1NSwuNyknO1xyXG4gICAgY3R4LnN0cm9rZSgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGRyYXdDb3JuZXJGaWxsKGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTogdm9pZCB7XHJcbiAgICBsZXQgc2lkZUxlbmd0aCA9IDEwO1xyXG4gICAgaWYgKHRoaXMub3ZlciB8fCB0aGlzLmRyYWcpIHtcclxuICAgICAgc2lkZUxlbmd0aCA9IDEyO1xyXG4gICAgfVxyXG4gICAgbGV0IGhEaXJlY3Rpb246IG51bWJlciA9IHRoaXMuY3JvcHBlclNldHRpbmdzLm1hcmtlclNpemVNdWx0aXBsaWVyO1xyXG4gICAgbGV0IHZEaXJlY3Rpb246IG51bWJlciA9IHRoaXMuY3JvcHBlclNldHRpbmdzLm1hcmtlclNpemVNdWx0aXBsaWVyO1xyXG4gICAgaWYgKHRoaXMuaG9yaXpvbnRhbE5laWdoYm91ci5wb3NpdGlvbi54IDwgdGhpcy5wb3NpdGlvbi54KSB7XHJcbiAgICAgIGhEaXJlY3Rpb24gPSAtdGhpcy5jcm9wcGVyU2V0dGluZ3MubWFya2VyU2l6ZU11bHRpcGxpZXI7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy52ZXJ0aWNhbE5laWdoYm91ci5wb3NpdGlvbi55IDwgdGhpcy5wb3NpdGlvbi55KSB7XHJcbiAgICAgIHZEaXJlY3Rpb24gPSAtdGhpcy5jcm9wcGVyU2V0dGluZ3MubWFya2VyU2l6ZU11bHRpcGxpZXI7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuY3JvcHBlclNldHRpbmdzLnJvdW5kZWQpIHtcclxuICAgICAgY29uc3Qgd2lkdGg6IG51bWJlciA9XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbi54IC0gdGhpcy5ob3Jpem9udGFsTmVpZ2hib3VyLnBvc2l0aW9uLng7XHJcbiAgICAgIGNvbnN0IGhlaWdodDogbnVtYmVyID1cclxuICAgICAgICB0aGlzLnBvc2l0aW9uLnkgLSB0aGlzLnZlcnRpY2FsTmVpZ2hib3VyLnBvc2l0aW9uLnk7XHJcblxyXG4gICAgICBjb25zdCBvZmZYOiBudW1iZXIgPVxyXG4gICAgICAgIE1hdGgucm91bmQoTWF0aC5zaW4oTWF0aC5QSSAvIDIpICogTWF0aC5hYnMod2lkdGggLyAyKSkgLyA0O1xyXG4gICAgICBjb25zdCBvZmZZOiBudW1iZXIgPVxyXG4gICAgICAgIE1hdGgucm91bmQoTWF0aC5zaW4oTWF0aC5QSSAvIDIpICogTWF0aC5hYnMoaGVpZ2h0IC8gMikpIC8gNDtcclxuXHJcbiAgICAgIHRoaXMub2Zmc2V0LnggPSBoRGlyZWN0aW9uID4gMCA/IG9mZlggOiAtb2ZmWDtcclxuICAgICAgdGhpcy5vZmZzZXQueSA9IHZEaXJlY3Rpb24gPiAwID8gb2ZmWSA6IC1vZmZZO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5vZmZzZXQueCA9IDA7XHJcbiAgICAgIHRoaXMub2Zmc2V0LnkgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgIGlmICh0aGlzLmNyb3BwZXJTZXR0aW5ncy5jcm9wcGVyRHJhd1NldHRpbmdzLmxpbmVEYXNoKSB7XHJcbiAgICAgIGN0eC5zZXRMaW5lRGFzaChbMSwgM10pO1xyXG4gICAgfVxyXG4gICAgY3R4Lm1vdmVUbyhcclxuICAgICAgdGhpcy5wb3NpdGlvbi54ICsgdGhpcy5vZmZzZXQueCxcclxuICAgICAgdGhpcy5wb3NpdGlvbi55ICsgdGhpcy5vZmZzZXQueVxyXG4gICAgKTtcclxuICAgIGN0eC5saW5lVG8oXHJcbiAgICAgIHRoaXMucG9zaXRpb24ueCArIHRoaXMub2Zmc2V0LnggKyBzaWRlTGVuZ3RoICogaERpcmVjdGlvbixcclxuICAgICAgdGhpcy5wb3NpdGlvbi55ICsgdGhpcy5vZmZzZXQueVxyXG4gICAgKTtcclxuICAgIGN0eC5saW5lVG8oXHJcbiAgICAgIHRoaXMucG9zaXRpb24ueCArIHRoaXMub2Zmc2V0LnggKyBzaWRlTGVuZ3RoICogaERpcmVjdGlvbixcclxuICAgICAgdGhpcy5wb3NpdGlvbi55ICsgdGhpcy5vZmZzZXQueSArIHNpZGVMZW5ndGggKiB2RGlyZWN0aW9uXHJcbiAgICApO1xyXG4gICAgY3R4LmxpbmVUbyhcclxuICAgICAgdGhpcy5wb3NpdGlvbi54ICsgdGhpcy5vZmZzZXQueCxcclxuICAgICAgdGhpcy5wb3NpdGlvbi55ICsgdGhpcy5vZmZzZXQueSArIHNpZGVMZW5ndGggKiB2RGlyZWN0aW9uXHJcbiAgICApO1xyXG4gICAgY3R4LmxpbmVUbyhcclxuICAgICAgdGhpcy5wb3NpdGlvbi54ICsgdGhpcy5vZmZzZXQueCxcclxuICAgICAgdGhpcy5wb3NpdGlvbi55ICsgdGhpcy5vZmZzZXQueVxyXG4gICAgKTtcclxuICAgIGN0eC5jbG9zZVBhdGgoKTtcclxuICAgIGN0eC5maWxsU3R5bGUgPVxyXG4gICAgICB0aGlzLmNyb3BwZXJTZXR0aW5ncy5jcm9wcGVyRHJhd1NldHRpbmdzLmZpbGxDb2xvciB8fFxyXG4gICAgICAncmdiYSgyNTUsMjU1LDI1NSwuNyknO1xyXG4gICAgY3R4LmZpbGwoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBtb3ZlWCh4OiBudW1iZXIpOiB2b2lkIHtcclxuICAgIHRoaXMuc2V0UG9zaXRpb24oeCwgdGhpcy5wb3NpdGlvbi55KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBtb3ZlWSh5OiBudW1iZXIpOiB2b2lkIHtcclxuICAgIHRoaXMuc2V0UG9zaXRpb24odGhpcy5wb3NpdGlvbi54LCB5KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBtb3ZlKHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICB0aGlzLnNldFBvc2l0aW9uKHgsIHkpO1xyXG4gICAgdGhpcy52ZXJ0aWNhbE5laWdoYm91ci5tb3ZlWCh4KTtcclxuICAgIHRoaXMuaG9yaXpvbnRhbE5laWdoYm91ci5tb3ZlWSh5KTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhZGRIb3Jpem9udGFsTmVpZ2hib3VyKG5laWdoYm91cjogQ29ybmVyTWFya2VyKTogdm9pZCB7XHJcbiAgICB0aGlzLmhvcml6b250YWxOZWlnaGJvdXIgPSBuZWlnaGJvdXI7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYWRkVmVydGljYWxOZWlnaGJvdXIobmVpZ2hib3VyOiBDb3JuZXJNYXJrZXIpOiB2b2lkIHtcclxuICAgIHRoaXMudmVydGljYWxOZWlnaGJvdXIgPSBuZWlnaGJvdXI7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0SG9yaXpvbnRhbE5laWdoYm91cigpOiBDb3JuZXJNYXJrZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuaG9yaXpvbnRhbE5laWdoYm91cjtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXRWZXJ0aWNhbE5laWdoYm91cigpOiBDb3JuZXJNYXJrZXIge1xyXG4gICAgcmV0dXJuIHRoaXMudmVydGljYWxOZWlnaGJvdXI7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZHJhdyhjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk6IHZvaWQge1xyXG4gICAgdGhpcy5kcmF3Q29ybmVyRmlsbChjdHgpO1xyXG4gICAgdGhpcy5kcmF3Q29ybmVyQm9yZGVyKGN0eCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==