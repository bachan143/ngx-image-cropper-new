export class Point {
    constructor(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
        get next() {
            return this._next;
        }
        set next(p) {
            this._next = p;
        }
        get prev() {
            return this._prev;
        }
        set prev(p) {
            this._prev = p;
        }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9pbnQuanMiLCJzb3VyY2VSb290IjoiQzovd29ya3NwYWNlL25neC1pbWctY3JvcHBlci9wcm9qZWN0cy9uZ3gtaW1nLWNyb3BwZXIvc3JjLyIsInNvdXJjZXMiOlsibGliL2ltYWdlLWNyb3BwZXIvbW9kZWwvcG9pbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBT0EsTUFBTSxPQUFPLEtBQUs7SUFPaEIsWUFBWSxJQUFZLENBQUMsRUFBRSxJQUFZLENBQUM7UUFDdEMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNiLENBQUM7SUFFRCxJQUFXLElBQUk7UUFDYixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDckIsQ0FBQztJQUVELElBQVcsSUFBSSxDQUFDLENBQVE7UUFDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDbEIsQ0FBQztJQUVELElBQVcsSUFBSTtRQUNiLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNyQixDQUFDO0lBRUQsSUFBVyxJQUFJLENBQUMsQ0FBUTtRQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNsQixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgaW50ZXJmYWNlIElQb2ludCB7XHJcbiAgeDogbnVtYmVyO1xyXG4gIHk6IG51bWJlcjtcclxuICBuZXh0OiBQb2ludDtcclxuICBwcmV2OiBQb2ludDtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFBvaW50IGltcGxlbWVudHMgSVBvaW50IHtcclxuICBwdWJsaWMgeDogbnVtYmVyO1xyXG4gIHB1YmxpYyB5OiBudW1iZXI7XHJcblxyXG4gIHByaXZhdGUgbXlOZXh0OiBQb2ludDtcclxuICBwcml2YXRlIG15UHJldjogUG9pbnQ7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHg6IG51bWJlciA9IDAsIHk6IG51bWJlciA9IDApIHtcclxuICAgIHRoaXMueCA9IHg7XHJcbiAgICB0aGlzLnkgPSB5O1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldCBuZXh0KCk6IFBvaW50IHtcclxuICAgIHJldHVybiB0aGlzLm15TmV4dDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzZXQgbmV4dChwOiBQb2ludCkge1xyXG4gICAgdGhpcy5teU5leHQgPSBwO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldCBwcmV2KCk6IFBvaW50IHtcclxuICAgIHJldHVybiB0aGlzLm15UHJldjtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBzZXQgcHJldihwOiBQb2ludCkge1xyXG4gICAgdGhpcy5teVByZXYgPSBwO1xyXG4gIH1cclxufVxyXG4iXX0=