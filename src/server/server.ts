import { Request } from 'mbr-serv-request';
import ts, { ModuleKind } from 'typescript';

const ROOT = __dirname + '/../../src/client';
const ASSET_ROOT = __dirname + '/../../src/assets';
const NODE_MODULES_ROOT = __dirname + '/../../node_modules';
const SRC_RE = /^\/src\/(.+)$/;
const IMPORT_RE = /import (.+) from '(.+)';/g;

const MODULE_REPLACEMENTS: Record<string, string> = {
  'splux': '/lib/splux.js',
  'mbr-style': '/lib/mbr-style.js',
}

function replaceModules (input: string, entities: string, moduleName: string) {
  return moduleName in MODULE_REPLACEMENTS
    ? `import ${entities} from '${MODULE_REPLACEMENTS[moduleName]}'`
    : input;
}

async function getResource (regMatch: RegExpExecArray, request: Request) {
  const url = request.getUrl(regMatch[1]);

  if (!url.getExtension()) {
    url.set(url.getPath() + '.ts' + url.getSearch());
  }

  try {
    const file = await request.getFile({ file: url.getPath(), root: ROOT })

    const responseParams = url.getExtension() === 'ts'
      ? {
        extension: 'js',
        data: ts.transpile(file.toString(), {
          module: ModuleKind.ESNext,
        }).replace(IMPORT_RE, replaceModules),
      } : {
        extension: url.getExtension() || '',
        data: file,
      };

    request.send(responseParams.data, responseParams.extension);
  } catch (error) {
    console.log(error);
    request.status = 404;
    request.send();
  }
}

const ROUTER = {
  '/': ASSET_ROOT + '/index.html',
  '/favicon.ico': ASSET_ROOT + '/favicon.ico',
  '/lib/splux.js': NODE_MODULES_ROOT + '/splux/index.js',
  '/lib/mbr-style.js': NODE_MODULES_ROOT + '/mbr-style/index.js',
};

export function server (request: Request) {
  request.match(SRC_RE, getResource) || request.route(ROUTER);
};
