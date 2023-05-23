import * as express from 'express';
import * as _ from 'lodash';
var email = require('emailjs');
import * as fs from 'fs';
import { objectProperty } from 'babel-types';
import { any } from 'bluebird';
var path = require('path');


export class ContactFormRouter {
	//
	//

	public static getRoutes(): express.Router {
		let router = express.Router();

		//
		//
		router.route('/send-emails').post(async (request, response) => {
			ContactFormRouter.sendMail(request.body.theme, request.body.comment, request.body.data, request.body.docName, request.body.insuredFirstName, request.body.insuredLastName, request.body.taxCode, request.body.phone, request.body.email);
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

	private static sendMail(theme: any, comment: any, data: any, docName: any, insuredFirstName: any, insuredLastName: any, taxCode: any, insuredPhone: any, insuredEmail: any): void {

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
					subject: 'Contact form',
					from: "connect@eurolife.gr",
					to: "info@eurolife.gr",
					attachment: [
						{
							data: '<html>Νέα υποβολή φόρμας επικοινωνίας Eurolife FFH. Τα στοιχεία είναι: <br/> Όνομα: '
								+ insuredFirstName + '<br/> Επώνυμο: '
								+ insuredLastName + '<br/> Α.Φ.Μ: '
								+ taxCode + '<br/> Τηλέφωνο: '
								+ insuredPhone + '<br/> EMail: '
								+ insuredEmail + '<br/> Θέμα: '
								+ theme + '<br/><br/> Σχόλια:<br/>'
								+ comment + '<br/></html>', alternative: true
						},
						{ data: dataread, type: fileType, name: docName }
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
				subject: 'Contact form',
				from: "connect@eurolife.gr",
				// to: "rania_daflou@yahoo.com",
				to: "info@eurolife.gr",
				attachment: [
					{
						data: '<html>Νέα υποβολή φόρμας επικοινωνίας Eurolife FFH. Τα στοιχεία είναι: <br/> Όνομα: '
							+ insuredFirstName + '<br/> Επώνυμο: '
							+ insuredLastName + '<br/> Α.Φ.Μ: '
							+ taxCode + '<br/> Τηλέφωνο: '
							+ insuredPhone + '<br/> EMail: '
							+ insuredEmail + '<br/> Θέμα: '
							+ theme + '<br/><br/> Σχόλια:<br/>'
							+ comment + '<br/></html>', alternative: true
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
