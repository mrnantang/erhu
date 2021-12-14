// 横竖屏切换代码=======================================
window.addEventListener(
  "orientationchange",
  () => {
    location.reload();
  },
  false
);
document.addEventListener("WeixinJSBridgeReady", function onBridgeReady() {
  WeixinJSBridge.call("hideToolbar");
  WeixinJSBridge.call("hideOptionMenu");
});
  //解决IOS返回页面不刷新的问题
  var isPageHide = false;
  window.addEventListener('pageshow', function() {
      if(isPageHide) {
          window.location.reload();
      }
  });
  window.addEventListener('pagehide', function() {
      isPageHide = true;
  });
