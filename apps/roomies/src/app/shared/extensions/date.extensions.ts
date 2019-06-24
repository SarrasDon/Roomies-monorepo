interface Date {
  copyHoursFrom(date: Date): void;
}
Date.prototype.copyHoursFrom = function(this: Date, date: Date) {
  this.setHours(
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds()
  );
};
