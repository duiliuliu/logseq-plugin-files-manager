// utils.js
import i18n from 'i18next';
import { __i18n_LOAD_MARK } from '../data/constants';

export var PRE_LANGUAGE: string = 'en'
export const getI18nConstantByPreLang = (key: string): string => {
  return i18n.t(key, { lng: PRE_LANGUAGE });
}

const getI18nConstant = (language: string, key: string): string => {
  PRE_LANGUAGE = language
  return i18n.t(key, { lng: language });
};

export const isLoadi18nSuccess = (lang?: string): boolean => {
  return getI18nConstant(lang ?? 'en', __i18n_LOAD_MARK) === "1"
}

export default getI18nConstant;
