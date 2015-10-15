import loader from '@loader';
import devConfig from './dev';
import prodConfig from './prod';

let isProduction = loader.env === 'production';

export default isProduction ? prodConfig : devConfig;
