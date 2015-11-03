import loader from '@loader';
import devConfig from './dev';
import prodConfig from './prod';

let loaderEnv = loader.env || '';
let isProduction = loaderEnv.indexOf('production') !== -1;

export default isProduction ? prodConfig : devConfig;
