import { ExchangeRule, IntegrationDataIn, IntegrationDataOut, IceConsole } from '@impeo/ice-core';
import { get, isString, template } from 'lodash';
import * as path from 'path';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';

//
//
export class InsisEmailExchangeRule extends ExchangeRule {
  async execute(request: IntegrationDataOut): Promise<IntegrationDataIn> {
    const data = new IntegrationDataIn();

    const to = get(request, 'params.to');
    const subject = get(request, 'params.subject');
    const templateName = get(request, 'params.template');

    if (!to || !subject || !templateName) {
      IceConsole.error(
        '"to", "subject" and "template" need to be specified in the tranformation as params'
      );
      return;
    }

    const options = request.payload;
    let html: string;
    try {
      const templateContent = await this.readFile(this.fullTemplatePath(templateName));
      const templateCompiled = template(templateContent);
      html = templateCompiled(options);
    } catch (error) {
      IceConsole.error("Can't find the email template file", error);
      data.payload.error = error;
      return data;
    }
    const email = {
      to,
      subject,
      html,
    };

    data.payload = await this.send(email);
    return data;
  }

  private async send(email) {
    if (this.isDebugMode()) {
      console.log('DEBUG MODE');
      await this.writeDebugFiles(email);
      return {};
    }

    const config = this.getConfig();
    const transporter = nodemailer.createTransport(config);
    try {
      const { accepted } = await transporter.sendMail({
        ...email,
        from: config.auth.user,
      });
      return {
        accepted,
      };
    } catch (error) {
      IceConsole.error(error);
      return error;
    }
  }

  private getConfig() {
    return {
      host: this.getValueFromEnvironment(this.getParam('host')),
      port: this.getValueFromEnvironment(this.getParam('port')),
      debugMode: this.getValueFromEnvironment(this.getParam('debugMode', false)),
      secure: false,
      auth: {
        user: this.getValueFromEnvironment(this.getParam('username')),
        pass: this.getValueFromEnvironment(this.getParam('password')),
      },
    };
  }

  private isDebugMode() {
    return this.getConfig().debugMode;
  }

  readFile(_path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(_path, 'utf8', (error, result) => {
        if (error) {
          console.error(
            'InsisEmailExchangeRule:' + this.integration.name,
            'Error reading template:',
            path,
            'Error:',
            error
          );
          reject(error);
        } else {
          resolve(result.toString());
        }
      });
    });
  }

  private async writeDebugFiles({ html }) {
    const fileName =
      'email-' + new Date().toISOString().split(':').join('-').split('.').join('-') + '.html';

    return new Promise((resolve, reject) => {
      const filePath = path.resolve(this.repoFolder + '/data/' + fileName);
      console.log('write file', filePath);
      fs.writeFile(filePath, html, (err) => {
        if (err) {
          console.log('ERROR');
          reject(err);
        } else {
          console.log('OK');
          resolve();
        }
      });
    });
  }

  private getValueFromEnvironment(value: string): string {
    if (!isString(value) || !value.startsWith('env:')) return value;
    return this.runtime.environmentVariables[value.replace('env:', '')];
  }

  private get repoFolder(): string {
    return get(this.integration.iceModel.context.runtime, ['environmentVariables', 'iceRepoPath']);
  }

  private fullTemplatePath(templateName): string {
    return path.resolve(this.repoFolder + '/data/' + templateName);
  }
}
