import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SectionComponentImplementation, IceSectionComponent } from '@impeo/ng-ice';
import { LocalStorageService } from '@insis-portal/services/local-storage.service';

@Component({
  selector: 'app-sign-up-validated',
  templateUrl: './sign-up-validated.component.html',
  styleUrls: ['./sign-up-validated.component.scss']
})
export class SignUpValidatedComponent extends SectionComponentImplementation {

  snapshotQueryParam = "initial value";
  subscribedQueryParam = 'initial value';
  emailCode = 'String';
  items: any[] = [];

  constructor(parent: IceSectionComponent,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private service: LocalStorageService) {
    super(parent);

  }

  ngOnInit() {

    this.snapshotQueryParam = this.route.snapshot.queryParamMap.get("queryName");
    // this.route.queryParamMap
    // .subscribe(queryParams => {
    //     this.subscribedQueryParam = queryParams.get("queryName");
    //
    //   });


    this.route.queryParams
      .subscribe(params => {
        this.emailCode = params.EmailVerified;

      });
    this.setEmailCode();
    this.getEmail();
  }

  // o goQuery thetei query panw sto url
  goQuery(value: string): void {
    this.router.navigate(['ice/default/customerArea.motor/signupvalidated'], { queryParams: { EmailVerified: '888' } });
  }

  goto(signupvalidated: string): void {
    this.router.navigate(['signupvalidated', signupvalidated]);
  }

  setEmailCode(): any {
    this.context.iceModel.elements["emailCode"].setSimpleValue(this.emailCode);


  }
  getEmail(): any {
    let email = this.service.getFromLocalStorage();
    this.context.iceModel.elements["signup.email"].setSimpleValue(email);
    return this.context.iceModel.elements['signup.email'].getValue().values[0].value;
  }
  getCreateUserStatus(): any {
    return this.context.iceModel.elements['createUserStatus'].getValue().values[0].value;
  }

}
