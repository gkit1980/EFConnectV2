import * as express from 'express';
import * as _ from 'lodash';
var email = require('emailjs');
import * as fs from 'fs';
import { objectProperty } from 'babel-types';
import { any } from 'bluebird';
var path = require('path');


export class SignupGroupRouter {
	//
	//

	public static getRoutes(): express.Router {
		let router = express.Router();

		//
		//
		router.route('/send-emails').post(async (request, response) => {
			SignupGroupRouter.sendMail( request.body.data, request.body.useremail ,request.body.companyName);
			response.send({ success: true });
		});

		return router;
	}

	private static base64decode(file: any, matches: any): any {

		if (matches.length !== 3) {
			return new Error('Invalid input string');
		}
		var bitmap = new Buffer(matches[2], 'base64');
		return bitmap;
		// try{
		// 	fs.writeFileSync(file, bitmap);

		// }
		//    catch(err)
		//    {
		// 	console.error("WRITEFILE:"+err);
		//    }

	}

	private static sendMail( data: any, useremail: any, companyName:any): void {

		let stream: any;
		let fileType: any;
		let streamPath: any

		var server = email.server.connect({
			user: 'myeurolife@eurolife.gr',
			host: "192.168.1.234",
			ssl: false,
			tls: false,
			port: 25
		});

		var message: any;
		if (data) {

			var dataread: any;
			var chunk;
			var matches = data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
				response: any = {};
			fileType = matches[1];

			var str1 = 'myAttachment.';
			var lastThreedigits = fileType.substr(fileType.length - 3); //gets the extension of the attachment
			var finalStr = str1.concat(lastThreedigits);

			dataread = this.base64decode(finalStr, matches);

			//console.log("PATH:"+ path.resolve(__dirname,finalStr));
			//	streamPath = path.join(path.dirname(path.dirname(path.dirname(path.dirname(__dirname)))), finalStr);
			//   console.log("FILEPATH: "+ streamPath);
			// if(!fs.existsSync(streamPath)) {
			// 	console.log("ERROR:File not found");
			//   }
			//  else
			//  {	
			console.log("TRY READ.....");
			try {
				//dataread= fs.readFileSync(streamPath,"utf-8");		
				message = {
					subject: 'Καλωσήρθατε στο Ομαδικό Πρόγραμμα Ασφάλισης Υγείας',
					from: "connect@eurolife.gr",
					to: useremail,
					attachment: [
						{
							data: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> <html xmlns="http://www.w3.org/1999/xhtml">'+
							'<head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>Welcome Email</title><meta name="viewport" content="width=device-width, initial-scale=1.0"><link href="https://fonts.googleapis.com/css?family=Ubuntu" rel="stylesheet">'+
							'<style>@import url("https://fonts.googleapis.com/css?family=Ubuntu&display=swap"); html,body {margin: 0 auto !important;padding: 0 !important;height: 100% !important;width: 100% !important;max-width: 740px;}'+
							'{-ms-text-size-adjust: 100%;}'+
							'table,td {mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;}'+
							'img {-ms-interpolation-mode: bicubic;}'+
							'a {text-decoration: none;}</style></head>'+
							'<body width="740" style="max-width: 740px; font-family: "Ubuntu", sans-serif;">'+
							'<table style="border: 0;width: 100%;"><tr><td style="text-align: justify;">'+
							'<table style="border-collapse: collapse;max-width: 740px;width: 100%;border: 0;margin-left: auto;margin-right: auto;"><tr>'+
							'<td style="padding: 27px 0px 26px 0px;"> <a href="https://connect.eurolife.gr/" target="_blank"><img src="https://scp.eurolife.gr/~/media/50515F4912C54EBDB4A2D34F7EAA3B41 "alt="EurolifeConnect" height="29" width="190"></a></td> </tr>'+
							'<tr><td style="background-color: #ef3340;height: 2px;"></td></tr>'+
							'<tr><td><div style="background-repeat: no-repeat;background-position: top center;background-size: cover;position: relative;display: inline-block;width: 100%;">'+
							'<img height="422" width="740"src="https://scp.eurolife.gr/~/media/D2BCCFC6623D4C298F0ECE3A8EDFA268" alt="Welcome email picture"style="position: absolute;z-index: -1;height: 422px;width: 740px;object-fit: cover;">'+
							'<div style="padding: 303px 51px 0px 0px;font-size: 52px;font-weight: 500;font-style: normal;font-stretch: normal;line-height: 1.19;letter-spacing: normal;text-align: right;color: #ffffff;">Καλωσήρθατε!</div>'+
							'<div style="padding: 0px 51px 0px 0px;font-size: 18px;font-weight: normal;font-style: normal;font-stretch: normal;line-height: 1.39;letter-spacing: normal;text-align: right;color: #ffffff;">Ομάδα EurolifeConnect</div>'+
							'</div></td></tr></td></tr></table>'+
							'<table style="border-collapse: collapse;max-width: 636px;border: 0;width: 100%;"><tr><td style="margin: 0px;padding: 0px;"><div style="padding: 0px;margin-top: 40px;font-size: 16px;font-weight: normal;font-style: normal;font-stretch: normal;line-height: 1.75;letter-spacing: normal;color: #383b38;">'+
							'<p>Αγαπητέ Ασφαλισμένε,</p><p>Η εγγραφή σας στο Ομαδικό Πρόγραμμα Ασφάλισης Υγείας της Εταιρείας' + companyName + ' ολοκληρώθηκε επιτυχώς.</p>'+
							'<p>Σας καλωσορίζουμε στις νέες μας λειτουργίες και υπηρεσίες που αφορούν το Ομαδικό Πρόγραμμα Ασφάλισης Υγείας και ως στόχο έχουν να κάνουν τη σχέση μας ακόμα πιο άμεση, εύκολη και απλή.</p><p>Με τη σύνδεσή σας, θα μπορείτε να έχετε πρόσβαση:</p></div>'+
							'<ul style="list-style: none;padding: 0px;font-size: 16px;font-weight: 500;font-style: normal;font-stretch: normal;line-height: 1.5;letter-spacing: normal;color: #383b38; margin: -50px 0px 0px 0px;">'+
							'<li style="display: flex;align-items: baseline;"><div style="min-width: 12px;height: 12px;background-color: #ef3340;margin: 0px 12px 0px 0px; border-radius: 80px;"></div><p style="max-width: 590px;">Στις καλύψεις και τις παροχές του Ομαδικού σας Προγράμματος Υγείας</p></li>'+
							'<li style="display: flex;align-items: baseline;"><div style="min-width: 12px;height: 12px;background-color: #ef3340;margin: 0px 12px 0px 0px; border-radius: 80px;"></div><p style="max-width: 590px;">Στα αιτήματα των αποζημιώσεών σας και τις πληροφορίες τους</p></li>'+
							'<li style="display: flex;align-items: baseline;"><div style="min-width: 12px;height: 12px;background-color: #ef3340;margin: 0px 12px 0px 0px; border-radius: 80px;"></div><p style="max-width: 590px;">Στα υπολειπόμενα προς ανάλωση κεφάλαια του Ομαδικού σας Προγράμματος Υγείας</p></li></ul></div></td></tr>'+
							'<tr style="padding: 32px 0px 0px 0px;"><td><div style="padding: 0px 15px 15px 15px;">'+
							'<p style="font-size: 16px;color: #383b38;line-height: 28px;"> Εάν επιθυμείτε να προσθέσετε εξαρτώμενα μέλη όπως σύζυγος ή/και τα τέκνα σας (ανήλικα ή/και τέκνα που σπουδάζουν έως 25 ετών) παρακαλούμε απευθυνθείτε στον υπεύθυνο της Εταιρείας σας, ο οποίος θα σας ενημερώσει για το αντίστοιχο κόστος συμμετοχής σας και θα φροντίσει να συμπληρώσετε την απαραίτητη αίτηση ένταξης προστατευόμενων μελών.</p>'+
							'<p style="font-size: 16px;color: #383b38;line-height: 28px;">Η επικοινωνία είναι για εμάς σημαντική και μέρος της σχέσης μας. Για αυτό βρισκόμαστε πάντοτε στη διάθεσή σας, με κάθε τρόπο, στην αντίστοιχη ενότητα "Επικοινωνήστε μαζί μας" μέσα στο EurolifeConnect. Εκεί βρίσκετε και απαντήσεις σε τυχόν απορίες στις ενότητες των Συχνών Ερωτήσεων και του Ασφαλιστικού Λεξικού.</p>'+
							'<p style="font-size: 16px;color: #383b38;line-height: 28px;"> Είμαστε δίπλα σας κάθε στιγμή, έτοιμοι να σας στηρίξουμε. Μιλήστε μας κι εμείς θα φροντίσουμε για τα υπόλοιπα.</p></div></td></tr>'+
							'<tr><td><div style="padding: 32px 15px 15px 15px;"><br><p style="margin: 0px;font-size: 16px;font-weight: normal;font-style: normal;font-stretch: normal;line-height: 1.75;letter-spacing: normal;color: #383b38;">Με εκτίμηση,</p>'+
							'<p style="margin: 0px;font-size: 22px;font-weight: 500;font-style: normal;font-stretch: normal;line-height: 1.23;letter-spacing: normal;color: #ef3340;">Ομάδα EurolifeConnect</p><br></div></td></tr></table>'+
							'<table style="border-collapse: collapse;max-width: 700px;border: 0;width: 100%;margin-left: auto;margin-right: auto;"><tr><td colspan="5" style="height: 2px;background-color: #ef3340;"></td></tr>'+
							'<tr><td colspan="4"><p style="opacity: 0.6;font-size: 14px;font-weight: normal;font-style: normal;font-stretch: normal;line-height: 1.36;letter-spacing: normal;color: #383b38;padding: 0px 0px 0px 32px;min-width: 202px;">Κέντρο Εξυπηρέτησης Πελατών</p></td>'+
							'<td colspan="1" style="text-align: end;padding: 0px 32px 0px 0px;"><a href="https://www.linkedin.com/company/eurolife-erb" target="_blank"style="text-decoration: none;padding: 0px 16px 0px 0px;"><img src="https://scp.eurolife.gr/~/media/85EF998FA82C40428FB6834D7DE0CFEA" alt="linkedin" style="width: 23px;height: 23px;"></a><a href="https://twitter.com/eurolife_erb?lang=el" target="_blank" style="text-decoration: none;padding: 0px 16px 0px 0px;"><img src="https://scp.eurolife.gr/~/media/E29AD575A9924662886987990FCB7088" alt="twitter" style="width: 23px;height: 19px;"></a><a href="https://www.youtube.com/user/EurolifeERB " target="_blank"style="text-decoration: none;padding: 0px 0px 0px 0px;"><img src="https://scp.eurolife.gr/~/media/C20FFEA7172D4565AA68AF4697137DB9" alt="youtube"style="width: 25px;height: 18px;"></a></td></tr>'+
							'<tr><td colspan="5"><div><a href="tel:+30 210 9303800 " style="margin: 0px;padding: 0px 0px 0px 32px;font-size: 32px;font-weight: 500;font-style: normal;font-stretch: normal;line-height: 1.31;letter-spacing: normal;color: #ef3340;text-decoration: none;">210 9303800 <p style="font-size: 15px; padding: 0px 0px 0px 32px; margin: -25px 0px 0px 200px;">Επιλογή 4</p></a></div></td></tr>'+
							'<tr><td><a href="mailto:info@eurolife.gr" style="margin: 0px;padding: 0px 0px 0px 32px;font-size: 16px;font-weight: normal;font-style: normal;font-stretch: normal;line-height: 1.75;letter-spacing: normal;color: #383b38;text-decoration: none;">info@eurolife.gr</a></td></tr>'+
							'<tr><td colspan="5"><hr></td></tr>'+
							'<tr><td colspan="4"><a href="https://eurolife.gr/" target="_blank" style="margin: 0px;padding: 0px 0px 0px 32px;font-size: 24px;font-weight: bold;font-style: normal;font-stretch: normal;line-height: normal;letter-spacing: normal;color: #ef3340;text-decoration: none;">'+
							'<img width="144" height="62" src="https://scp.eurolife.gr/~/media/E9C3B37B417F4061B742A3D8AC36897E"alt="eurolife.gr" style="width: 144px;height: 62px;object-fit: contain;"></a></td>'+
							'<td colspan="1"><p style="opacity: 0.6;font-family: Ubuntu;font-size: 12px;font-weight: normal;font-style: normal;font-stretch: normal;line-height: 1.58;letter-spacing: normal;color: #383b38;text-align: end;padding: 0px 32px 0px 0px;"> Copyright 2022 © Eurolife FFH</p></td></tr></table></body>'+
							'</html>', alternative: true
						},
						{ data: dataread, type: fileType }
					]
					// cc: "else <else@your-email.com>",
				};
				console.log("TRY TO SEND WITH ATTACHMENT.....");
				server.send(message, function (err: any, message: any) { console.log(err || message); });
			}
			catch (err) {
				console.log("ERROR DATAREAD:" + err);

			}
		}
		//stream =  fs.createReadStream(streamPath).on('error', ContactFormRouter.onError);	
		else {
			message = {
				subject: 'Καλωσήρθατε στο Ομαδικό Πρόγραμμα Ασφάλισης Υγείας',
				from: "connect@eurolife.gr",
				//to: "antigoni.valera@gmail.com",
				to: useremail,
				attachment: [
					{
						data: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> <html xmlns="http://www.w3.org/1999/xhtml">'+
						'<head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>Welcome Email</title><meta name="viewport" content="width=device-width, initial-scale=1.0"><link href="https://fonts.googleapis.com/css?family=Ubuntu" rel="stylesheet">'+
						'<style>@import url("https://fonts.googleapis.com/css?family=Ubuntu&display=swap"); html,body {margin: 0 auto !important;padding: 0 !important;height: 100% !important;width: 100% !important;max-width: 740px;}'+
						'{-ms-text-size-adjust: 100%;}'+
						'table,td {mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;}'+
						'img {-ms-interpolation-mode: bicubic;}'+
						'a {text-decoration: none;}</style></head>'+
						'<body width="740" style="max-width: 740px; font-family: "Ubuntu", sans-serif;">'+
						'<table style="border: 0;width: 100%;"><tr><td style="text-align: justify;">'+
						'<table style="border-collapse: collapse;max-width: 740px;width: 100%;border: 0;margin-left: auto;margin-right: auto;"><tr>'+
						'<td style="padding: 27px 0px 26px 0px;"> <a href="https://connect.eurolife.gr/" target="_blank"><img src="https://scp.eurolife.gr/~/media/50515F4912C54EBDB4A2D34F7EAA3B41 "alt="EurolifeConnect" height="29" width="190"></a></td> </tr>'+
						'<tr><td style="background-color: #ef3340;height: 2px;"></td></tr>'+
						'<tr><td><div style="background-repeat: no-repeat;background-position: top center;background-size: cover;position: relative;display: inline-block;width: 100%;">'+
						'<img height="422" width="740"src="https://scp.eurolife.gr/~/media/D2BCCFC6623D4C298F0ECE3A8EDFA268" alt="Welcome email picture"style="position: absolute;z-index: -1;height: 422px;width: 740px;object-fit: cover;">'+
						'<div style="padding: 303px 51px 0px 0px;font-size: 52px;font-weight: 500;font-style: normal;font-stretch: normal;line-height: 1.19;letter-spacing: normal;text-align: right;color: #ffffff;">Καλωσήρθατε!</div>'+
						'<div style="padding: 0px 51px 0px 0px;font-size: 18px;font-weight: normal;font-style: normal;font-stretch: normal;line-height: 1.39;letter-spacing: normal;text-align: right;color: #ffffff;">Ομάδα EurolifeConnect</div>'+
						'</div></td></tr></td></tr></table>'+
						'<table style="border-collapse: collapse;max-width: 636px;border: 0;width: 100%;"><tr><td style="margin: 0px;padding: 0px;"><div style="padding: 0px;margin-top: 40px;font-size: 16px;font-weight: normal;font-style: normal;font-stretch: normal;line-height: 1.75;letter-spacing: normal;color: #383b38;">'+
						'<p>Αγαπητέ Ασφαλισμένε,</p><p>Η εγγραφή σας στο Ομαδικό Πρόγραμμα Ασφάλισης Υγείας της Εταιρείας' + companyName + ' ολοκληρώθηκε επιτυχώς.</p>'+
						'<p>Σας καλωσορίζουμε στις νέες μας λειτουργίες και υπηρεσίες που αφορούν το Ομαδικό Πρόγραμμα Ασφάλισης Υγείας και ως στόχο έχουν να κάνουν τη σχέση μας ακόμα πιο άμεση, εύκολη και απλή.</p><p>Με τη σύνδεσή σας, θα μπορείτε να έχετε πρόσβαση:</p></div>'+
						'<ul style="list-style: none;padding: 0px;font-size: 16px;font-weight: 500;font-style: normal;font-stretch: normal;line-height: 1.5;letter-spacing: normal;color: #383b38; margin: -50px 0px 0px 0px;">'+
						'<li style="display: flex;align-items: baseline;"><div style="min-width: 12px;height: 12px;background-color: #ef3340;margin: 0px 12px 0px 0px; border-radius: 80px;"></div><p style="max-width: 590px;">Στις καλύψεις και τις παροχές του Ομαδικού σας Προγράμματος Υγείας</p></li>'+
						'<li style="display: flex;align-items: baseline;"><div style="min-width: 12px;height: 12px;background-color: #ef3340;margin: 0px 12px 0px 0px; border-radius: 80px;"></div><p style="max-width: 590px;">Στα αιτήματα των αποζημιώσεών σας και τις πληροφορίες τους</p></li>'+
						'<li style="display: flex;align-items: baseline;"><div style="min-width: 12px;height: 12px;background-color: #ef3340;margin: 0px 12px 0px 0px; border-radius: 80px;"></div><p style="max-width: 590px;">Στα υπολειπόμενα προς ανάλωση κεφάλαια του Ομαδικού σας Προγράμματος Υγείας</p></li></ul></div></td></tr>'+
						'<tr style="padding: 32px 0px 0px 0px;"><td><div style="padding: 0px 15px 15px 15px;">'+
						'<p style="font-size: 16px;color: #383b38;line-height: 28px;"> Εάν επιθυμείτε να προσθέσετε εξαρτώμενα μέλη όπως σύζυγος ή/και τα τέκνα σας (ανήλικα ή/και τέκνα που σπουδάζουν έως 25 ετών) παρακαλούμε απευθυνθείτε στον υπεύθυνο της Εταιρείας σας, ο οποίος θα σας ενημερώσει για το αντίστοιχο κόστος συμμετοχής σας και θα φροντίσει να συμπληρώσετε την απαραίτητη αίτηση ένταξης προστατευόμενων μελών.</p>'+
						'<p style="font-size: 16px;color: #383b38;line-height: 28px;">Η επικοινωνία είναι για εμάς σημαντική και μέρος της σχέσης μας. Για αυτό βρισκόμαστε πάντοτε στη διάθεσή σας, με κάθε τρόπο, στην αντίστοιχη ενότητα "Επικοινωνήστε μαζί μας" μέσα στο EurolifeConnect. Εκεί βρίσκετε και απαντήσεις σε τυχόν απορίες στις ενότητες των Συχνών Ερωτήσεων και του Ασφαλιστικού Λεξικού.</p>'+
						'<p style="font-size: 16px;color: #383b38;line-height: 28px;"> Είμαστε δίπλα σας κάθε στιγμή, έτοιμοι να σας στηρίξουμε. Μιλήστε μας κι εμείς θα φροντίσουμε για τα υπόλοιπα.</p></div></td></tr>'+
						'<tr><td><div style="padding: 32px 15px 15px 15px;"><br><p style="margin: 0px;font-size: 16px;font-weight: normal;font-style: normal;font-stretch: normal;line-height: 1.75;letter-spacing: normal;color: #383b38;">Με εκτίμηση,</p>'+
						'<p style="margin: 0px;font-size: 22px;font-weight: 500;font-style: normal;font-stretch: normal;line-height: 1.23;letter-spacing: normal;color: #ef3340;">Ομάδα EurolifeConnect</p><br></div></td></tr></table>'+
						'<table style="border-collapse: collapse;max-width: 700px;border: 0;width: 100%;margin-left: auto;margin-right: auto;"><tr><td colspan="5" style="height: 2px;background-color: #ef3340;"></td></tr>'+
						'<tr><td colspan="4"><p style="opacity: 0.6;font-size: 14px;font-weight: normal;font-style: normal;font-stretch: normal;line-height: 1.36;letter-spacing: normal;color: #383b38;padding: 0px 0px 0px 32px;min-width: 202px;">Κέντρο Εξυπηρέτησης Πελατών</p></td>'+
						'<td colspan="1" style="text-align: end;padding: 0px 32px 0px 0px;"><a href="https://www.linkedin.com/company/eurolife-erb" target="_blank"style="text-decoration: none;padding: 0px 16px 0px 0px;"><img src="https://scp.eurolife.gr/~/media/85EF998FA82C40428FB6834D7DE0CFEA" alt="linkedin" style="width: 23px;height: 23px;"></a><a href="https://twitter.com/eurolife_erb?lang=el" target="_blank" style="text-decoration: none;padding: 0px 16px 0px 0px;"><img src="https://scp.eurolife.gr/~/media/E29AD575A9924662886987990FCB7088" alt="twitter" style="width: 23px;height: 19px;"></a><a href="https://www.youtube.com/user/EurolifeERB " target="_blank"style="text-decoration: none;padding: 0px 0px 0px 0px;"><img src="https://scp.eurolife.gr/~/media/C20FFEA7172D4565AA68AF4697137DB9" alt="youtube"style="width: 25px;height: 18px;"></a></td></tr>'+
						'<tr><td colspan="5"><div><a href="tel:+30 210 9303800 " style="margin: 0px;padding: 0px 0px 0px 32px;font-size: 32px;font-weight: 500;font-style: normal;font-stretch: normal;line-height: 1.31;letter-spacing: normal;color: #ef3340;text-decoration: none;">210 9303800 <p style="font-size: 15px; padding: 0px 0px 0px 32px; margin: -25px 0px 0px 200px;">Επιλογή 4</p></a></div></td></tr>'+
						'<tr><td><a href="mailto:info@eurolife.gr" style="margin: 0px;padding: 0px 0px 0px 32px;font-size: 16px;font-weight: normal;font-style: normal;font-stretch: normal;line-height: 1.75;letter-spacing: normal;color: #383b38;text-decoration: none;">info@eurolife.gr</a></td></tr>'+
						'<tr><td colspan="5"><hr></td></tr>'+
						'<tr><td colspan="4"><a href="https://eurolife.gr/" target="_blank" style="margin: 0px;padding: 0px 0px 0px 32px;font-size: 24px;font-weight: bold;font-style: normal;font-stretch: normal;line-height: normal;letter-spacing: normal;color: #ef3340;text-decoration: none;">'+
						'<img width="144" height="62" src="https://scp.eurolife.gr/~/media/E9C3B37B417F4061B742A3D8AC36897E"alt="eurolife.gr" style="width: 144px;height: 62px;object-fit: contain;"></a></td>'+
						'<td colspan="1"><p style="opacity: 0.6;font-family: Ubuntu;font-size: 12px;font-weight: normal;font-style: normal;font-stretch: normal;line-height: 1.58;letter-spacing: normal;color: #383b38;text-align: end;padding: 0px 32px 0px 0px;"> Copyright 2022 © Eurolife FFH</p></td></tr></table></body>'+
						'</html>', alternative: true
					}
				]
				// cc: "else <else@your-email.com>",
			};
			// send the message and get a callback with ; an error or details of the message that was sent	
			console.log("TRY TO SEND WITHOUT ATTACHMENT.....");
			server.send(message, function (err: any, message: any) { console.log(err || message); });
		}


	}

}
