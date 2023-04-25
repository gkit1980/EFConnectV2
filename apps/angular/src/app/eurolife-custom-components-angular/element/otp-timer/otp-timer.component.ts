import { Component,Pipe,OnInit} from "@angular/core";
import { environment } from "../../../../environments/environment";
import { Observable } from "rxjs/Rx";
import { ElementComponentImplementation } from "@impeo/ng-ice";
import { AmendmentsService } from "../../../services/amendments.service";
import { IndexedValue } from "@impeo/ice-core";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: "app-otp-timer",
  templateUrl: "./otp-timer.component.html",
  styleUrls: ["./otp-timer.component.css"]
})

@Pipe({
  name: "formatTime"
})
export class OtpTimerComponent extends ElementComponentImplementation implements OnInit{
  smsSentSuccess: boolean;
  errorMsgSmsCode: string;
  errorMEssage: string = "";
  email: any;
  private destroy$ = new Subject<>();

  constructor(
    private amendmentsService: AmendmentsService
  ) {
    super();
  }

  timeLeft: number;
  interval: any;
  timeIsOff: boolean;
  verifiedUser: any;
  isError: boolean = false;

  ngOnInit() {
    this.context.iceModel.elements["amendments.details.step.status"].$dataModelValueChange.pipe(takeUntil(this.destroy$)).subscribe((value: IndexedValue) => {
      if (value.element.getValue().forIndex(null) === 2) {
        this.startVerification();
      }
    });
    // this.email = this.element.iceModel.elements["customer.Email"].getValue().forIndex(null);
    this.email = this.element.iceModel.elements["customer.details.Email"].getValue().forIndex(null);
    //customer.Email
  }

  async startVerification() {
    await this.sendOtp()
    // this.startTimer();
  }

  async sendOtp() {
    await this.amendmentsService.sendOTP(this.email).subscribe(res => {
      if (res.Success) {
        this.timeLeft = res.SMSTimeOut;
        this.startTimer();
      } else {
        this.setError(res.Errors);
      }
    });
  }

  setError(error: any) {
    this.isError = true;
    this.errorMEssage = "Κάτι πήγε στραβά!";
    setTimeout(() => {
      this.isError = false;
      this.errorMEssage = "";
    }, 3000);
  }

  startTimer(): any {
    this.interval = Observable.timer(0, 1000)
      .take(this.timeLeft)
      .map(() => {
        if (this.timeLeft === 1) {
          this.smsSentSuccess = false;
          this.timeIsOff = true;
          return 0;
        } else {
          this.timeIsOff = false;
          return --this.timeLeft;
        }
      });
  }

  getIcon(iconID: string): string {
    let icon = environment.sitecore_media + iconID + ".ashx";
    return icon;
  }

  VerifySmsCode(event: any) {
    this.errorMsgSmsCode = "";
    let smsCodeInt = event.smsCode;
    if (smsCodeInt.toString().length === 6) {
      this.amendmentsService.VerifyOTP(this.email, smsCodeInt).subscribe((res: any) => {
        this.verifiedUser = res.Success;
        if (this.verifiedUser) {
          this.context.iceModel.elements["amendments.verifieduser"].setSimpleValue(true);
        }
        if (!res.Success) {
          this.errorMsgSmsCode = "error";
        }
      });
    }
  }

  resendOtp() {
    this.startVerification();
  }

  get imageSourceClock() {
    return this.getIcon("99105A3DB76C4494A235D3EEB13C54CD");
  }

  handleClockSVG(svg: SVGElement, parent: Element | null): SVGElement {
    //
    svg.setAttribute("width", "18");
    svg.setAttribute("height", "20");
    return svg;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
