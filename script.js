// 获取当前时间
function getTime() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
  
    // 格式化时间
    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
  
    return hours + ':' + minutes + ':' + seconds;
  }
  
  // 更新时间显示
  function updateTime() {
    var timeElement = document.getElementById('time');
    if (timeElement) {
      timeElement.innerHTML = '当前时间：' + getTime();
    }
  }
  
  // 记录访问人次
  var visitorsCount = 0;
  
// 更新访问人次显示
function updateVisitors() {
    visitorsCount++;
    var visitorsElement = document.getElementById('visitors');
    if (visitorsElement) {
      visitorsElement.innerHTML = '访问人次：' + visitorsCount;
    }
    // 将访问次数保存到 localStorage 中
    localStorage.setItem('visitorsCount', visitorsCount);
  }
  
  // 页面加载完成后执行
  document.addEventListener('DOMContentLoaded', function() {
    updateTime();
  
    // 从 localStorage 中获取访问次数
    visitorsCount = parseInt(localStorage.getItem('visitorsCount')) || 0;
    updateVisitors();
  
    // 每秒更新一次时间
    var timerId = setInterval(updateTime, 1000);
  
    // 在页面关闭时清除计时器
    window.addEventListener('beforeunload', function() {
      clearInterval(timerId);
    });
  });
  
  
  