"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const typescript_1 = __importStar(require("typescript"));
const ROOT = __dirname + '/../../src/client';
const ASSET_ROOT = __dirname + '/../../src/assets';
const NODE_MODULES_ROOT = __dirname + '/../../node_modules';
const SRC_RE = /^\/src\/(.+)$/;
const IMPORT_RE = /import (.+) from '(.+)';/g;
const MODULE_REPLACEMENTS = {
    'splux': '/lib/splux.js',
    'mbr-style': '/lib/mbr-style.js',
};
function replaceModules(input, entities, moduleName) {
    return moduleName in MODULE_REPLACEMENTS
        ? `import ${entities} from '${MODULE_REPLACEMENTS[moduleName]}'`
        : input;
}
function getResource(regMatch, request) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = request.getUrl(regMatch[1]);
        if (!url.getExtension()) {
            url.set(url.getPath() + '.ts' + url.getSearch());
        }
        try {
            const file = yield request.getFile({ file: url.getPath(), root: ROOT });
            const responseParams = url.getExtension() === 'ts'
                ? {
                    extension: 'js',
                    data: typescript_1.default.transpile(file.toString(), {
                        module: typescript_1.ModuleKind.ESNext,
                    }).replace(IMPORT_RE, replaceModules),
                } : {
                extension: url.getExtension() || '',
                data: file,
            };
            request.send(responseParams.data, responseParams.extension);
        }
        catch (error) {
            console.log(error);
            request.status = 404;
            request.send();
        }
    });
}
const ROUTER = {
    '/': ASSET_ROOT + '/index.html',
    '/favicon.ico': ASSET_ROOT + '/favicon.ico',
    '/lib/splux.js': NODE_MODULES_ROOT + '/splux/index.js',
    '/lib/mbr-style.js': NODE_MODULES_ROOT + '/mbr-style/index.js',
};
function server(request) {
    request.match(SRC_RE, getResource) || request.route(ROUTER);
}
exports.server = server;
;
