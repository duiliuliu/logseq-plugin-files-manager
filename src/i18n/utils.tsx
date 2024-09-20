// utils.js
import i18n from 'i18next';
import { logger } from '../utils/logger';
import { __i18n_LOAD_MARK } from '../data/constants';

const getI18nConstant = (language: string, key: string): string => {
  logger.debug(key, i18n.t(key, { lng: language }))
  return i18n.t(key, { lng: language });
};


export const isLoadi18nSuccess = (lang?: string): boolean => {
  return getI18nConstant(lang ?? 'en', __i18n_LOAD_MARK) === "1"
}

export default getI18nConstant;
