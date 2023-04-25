class IdleTimer 
{
     private timeout:number;
     private onTimeout:any;
     private eventHandler: () => void;
     interval: NodeJS.Timeout;
     timeoutTracker: any;

    constructor(timeout: number,onTimeout: any) {
      
      this.timeout = timeout;
      this.onTimeout = onTimeout;
  
      this.eventHandler = this.updateExpiredTime.bind(this);
      this.tracker();
      this.startInterval();
    }
  
    startInterval() {
      this.updateExpiredTime();
  
      this.interval = setInterval(() => {
        const expiredTime = parseInt(localStorage.getItem("_expiredTime"), 10);
        const tokenExpiredTime = parseInt(localStorage.getItem("_tokenExpirationTime"), 10);
       
    //    console.info("Check with now!");  ///** Logs */
        if (expiredTime < Date.now() || tokenExpiredTime<Date.now()) {
          if (this.onTimeout) {
            this.onTimeout();
            this.cleanUp();
          }
        }
      }, 1000);
    }
  
    updateExpiredTime() 
    {
      if (this.timeoutTracker) {
        clearTimeout(this.timeoutTracker);
      }
      this.timeoutTracker = setTimeout(() => {
        let expiredTime=(Date.now() + this.timeout * 1000).toString()
        localStorage.setItem("_expiredTime",expiredTime);
        // console.info("Expired Time:"+expiredTime);    ///** Logs */
      }, 300);
    }
  
    tracker() 
    {
      window.addEventListener("mousemove", this.eventHandler);
      window.addEventListener("mouseup", this.eventHandler);
      window.addEventListener("mousedown", this.eventHandler);
      window.addEventListener("resize", this.eventHandler);
      window.addEventListener("scroll", this.eventHandler);
      window.addEventListener("keydown", this.eventHandler);
      window.addEventListener("touchstart", this.eventHandler);
      window.addEventListener("touchend", this.eventHandler);
      //window.addEventListener("visibilitychange", this.eventHandler);
    }
  
    cleanUp() {
      clearInterval(this.interval);
      window.removeEventListener("mousemove", this.eventHandler);
      window.removeEventListener("mouseup", this.eventHandler);
      window.removeEventListener("mousedown", this.eventHandler);
      window.removeEventListener("resize", this.eventHandler);
      window.removeEventListener("scroll", this.eventHandler);
      window.removeEventListener("keydown", this.eventHandler);
      window.removeEventListener("touchstart", this.eventHandler);
      window.removeEventListener("touchend", this.eventHandler);
      // window.removeEventListener("visibilitychange", this.eventHandler);
    }
  }
  export default IdleTimer;
