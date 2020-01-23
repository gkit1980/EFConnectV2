import { ExpressIceApplicationOptions } from '@impeo/exp-ice';

export interface VisualIceOptions {
  urlRelativePath: string;
  physicalAbsolutePath: string;
}

export interface ExpressApplicationOptions extends ExpressIceApplicationOptions {
  wwwRootPath: string;
  visualIce: VisualIceOptions;
  serverPort: number;
}
