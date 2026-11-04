const constants = {
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  MAX_TEXT_LENGTH: 50000,
  ACCEPTED_MIME_TYPES: { "text/plain": [".txt"] },
  ACCEPTED_EXTENSIONS: [".txt"],
};

export const MAX_FILE_SIZE = constants.MAX_FILE_SIZE;
export const MAX_TEXT_LENGTH = constants.MAX_TEXT_LENGTH;
export default constants;
