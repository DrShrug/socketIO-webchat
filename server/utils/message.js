var generateMessage = (author, message) => {
  var currentTime = new Date();
  var minuteDigits = (currentTime.getMinutes() < 10 ? '0' : '') + currentTime.getMinutes();
  var date = {
    date: currentTime.getDate(),
    month: getMonthFromNumber(currentTime.getMonth()),
    year: currentTime.getFullYear()
  }
  var time = {
    hours: currentTime.getHours(),
    minutes: minuteDigits
  }
  return {
    author,
    message,
    date,
    time,
    formatedTime: `${ time.hours }:${ time.minutes }`
  };
};

function getMonthFromNumber(month) {
  var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
  return monthNames[month];
}

module.exports = {
  generateMessage
}