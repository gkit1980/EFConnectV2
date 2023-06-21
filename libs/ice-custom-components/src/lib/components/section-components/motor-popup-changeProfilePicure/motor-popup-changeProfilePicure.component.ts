import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { HttpClient } from '@angular/common/http';
import { SitecoreService } from "@insis-portal/services/sitecore.service";
import { environment } from "@insis-portal/environments/environment";
import { ProfilePictureService } from "@insis-portal/services/profile-picture.service";
import { LocalStorageService } from "@insis-portal/services/local-storage.service";
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from "rxjs";
import { SpinnerService } from "@insis-portal/services/spinner.service";
import { Router } from "@angular/router";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalService } from "@insis-portal/services/modal.service";






@Component({
	selector: 'motor-popup-changeProfilePicture',
	templateUrl: 'motor-popup-changeProfilePicure.component.html',
	styleUrls: ['motor-popup-changeProfilePicure.component.scss']
})
export class MotorPopUpChangeProfilePicture implements OnInit {





	base64textString: string;
	profilePicture: any;
	imageErrorMessage: boolean;
	selectedFile: File = null;
	public flag = false;
	public avatarsList: any = [];
	private response: string;


	changePhoto = 'elements.motor.profilePicture.changePhoto.label';
	upload = 'elements.motor.profilePicture.upload.label';
	defaultPhotos = 'elements.motor.profilePicture.defaultPhotos.label';
	application = 'elements.motor.profilePicture.application.label';
	selectedSVG: boolean;
	svgToShow: any
	svgURL = environment.sitecore_media + '587B1CA564EA46D085F1C755786E2E16' + '.ashx';
	url = new Subject<any>();

	constructor(
		// public dialogRef: MatDialogRef<MotorPopUpChangeProfilePicture>,
		private http: HttpClient,
		private sitecoreService: SitecoreService,
		private profilePicureService: ProfilePictureService,
		private localStorage: LocalStorageService,
		private SpinnerService: SpinnerService,
		private router: Router,
		private ngbActiveModal: NgbActiveModal,
		private modalService: ModalService) {

	}

	ngOnInit() {
		this.setData();
		this.selectedSVG = true;
	}

	onNoClick(): void {
		// this.dialogRef.close();
		this.modalService.isModalClosed();
		this.ngbActiveModal.close();
	}

	async setData() {
		await this.sitecoreService.getIconsList('Avatars').subscribe((res: any) => {

			this.response = res.FieldValues.MediaList;
			this.avatarsList = this.response.split('|');
			this.avatarsList = this.avatarsList.map((item: any) => {
				item = item.substring(1, item.length - 1);
				return item.replace(/-/g, '');
			})

		});
	}

	openInput() {
		document.getElementById('fileInput').click();
	}

	onFileSelected(evt: any) {
		this.selectedSVG = false;

		var files = evt.target.files;
		var file = files[0];
		if (file.type === "image/jpeg" || file.type === "image/png") {



			if (files && file) {
				this.imageErrorMessage = false;
				var reader = new FileReader();

				reader.onload = this.handleReaderLoaded.bind(this);

				let data = reader.readAsBinaryString(file);

				this.profilePicture = file.name;

			}
		} else {
			this.svgURL = environment.sitecore_media + '587B1CA564EA46D085F1C755786E2E16' + '.ashx';
			this.imageErrorMessage = true;
		}
	};

	async onSubmitPhoto() {
		const fd = new FormData();

		// await this.profilePicureService.uploadPhoto("testonboarding1000@mail.com", this.base64textString)
		await this.profilePicureService.uploadPhoto(this.localStorage.getDataFromLocalStorage("email"), this.base64textString)
			.subscribe((response) => {
				this.profilePicureService.getPhoto(this.localStorage.getDataFromLocalStorage("email"))
					.subscribe((response: any) => {

						this.profilePicureService.setPhoto(response.Photo);
						// this.SpinnerService.visible.next(true);
						// this.dialogRef.close();
						this.modalService.isModalClosed();
						this.ngbActiveModal.close();
					})

			})





	}


	imageSource(avatar: string): string {
		let skata = `${environment.sitecore_media}${avatar}.ashx`;
		return skata;
	}

	get closeImageSource() {
		return this.getIcon('9E57CCB2D5E54B739BF6D3DE8551E683');
	}

	getIcon(iconID: string): string {
		let icon = environment.sitecore_media + iconID + '.ashx';
		return icon;
	}

	handlecloseSVG(svg: SVGElement, parent: Element | null): SVGElement {
		svg.setAttribute('style', 'display: block');
		svg.setAttribute('width', '27');
		svg.setAttribute('height', '27');

		return svg;
	}

	handleReaderLoaded(readerEvt: any) {
		var binaryString = readerEvt.target.result;
		this.base64textString = btoa(binaryString);

		// let url = this.sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + btoa(binaryString)).changingThisBreaksApplicationSecurity;
		let url = 'data:image/jpg;base64,' + btoa(binaryString);
		console.log(url);
		this.profilePicture = url;
	}

	async selectAvatar(avatar: any) {
		this.selectedSVG = true;
		this.svgURL = `${environment.sitecore_media}${avatar}.ashx`;

		await this.http.get(this.svgURL, { responseType: 'blob' }).subscribe(data => {
			this.createImageFromBlob(data);
		}, error => {
			console.log(error);
		});

	}

	createImageFromBlob(image: Blob) {

		this.selectedSVG = false;
		let reader = new FileReader();
		reader.addEventListener("load", () => {
			this.svgToShow = reader.result;
			this.base64textString = this.svgToShow.split(",")[1];

			this.profilePicture = this.svgToShow;
		}, false);

		if (image) {
			reader.readAsDataURL(image);
		}

	}

	handleSVG(svg: SVGElement, parent: Element | null): SVGElement {
		svg.setAttribute('style', 'display: block; margin: auto; ');
		svg.setAttribute('width', '96');
		svg.setAttribute('height', '116.1');

		return svg;
	}

	showSVG() {
		let svg = `${this.svgURL}`;
		return svg;
	}



}
