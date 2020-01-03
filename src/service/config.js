export const MAILING_HOST = process.env.MAILING_HOST || 'smtp.mailgun.org';
export const MAILING_PORT = process.env.MAILING_PORT || 587;
export const MAILING_USERNAME = process.env.MAILING_USERNAME || '';
export const MAILING_PASSWORD = process.env.MAILING_PASSWORD || '';
export const MAILING_SENDER_NAME = process.env.MAILING_SENDER_NAME || 'React App v1.0';
//API INFORMATION
export const MAILING_BASE_URL = process.env.MAILING_BASE_URL || ''
export const MAILING_API_KEY = process.env.MAILING_API_KEY || '';

export const MAILING_TEST_MODE = process.env.MAILING_TEST_MODE;

//UPLOADS
export const IMAGE_FILE_TYPES = process.env.IMAGE_FILE_TYPES || ['.jpeg', '.jpg', '.gif', '.png'];
export const DOC_FILE_TYPES = process.env.DOC_FILE_TYPES || ['.doc', '.docx', '.pdf'];
export const MAX_FILE_SIZE = process.env.MAX_FILE_SIZE || 800000; //~700Ko