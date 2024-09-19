// utils.js
import i18n from 'i18next';
import { logger } from '../utils/logger';

const getI18nConstant = (language: string, key: string): string => {
  const result = i18n.t(key, { lng: language })
  logger.debug(`getI18nConstant,language:${language},result:${result}`)
  return result;
};

export default getI18nConstant;
