// returns stats for a specific language
// - added: contains all added messages
// - modified: contains all existing messages that have been updated
// - untranslated: contains all untranslated messages
// - deleted: contains all deleted messages
// - fileOutput: contains output for the new language file
//               a single object with all added, modified and untranslated messages
//               in a key (messageKey) value (message) format
// - whitelistOutput: contains output for the new languageWhitelist file
//                    all previously whitelisted keys, without the deleted keys
//
// {
//   added: [],
//   modified: [],
//   untranslated: [],
//   deleted: [],
//   fileOutput: {},
//   whitelistOutput: [],
// }
//
// every message is declared in the following format
// {
//   key: 'unique_message_key',
//   message: 'specific_message',
// }

export const getCleanReport = () => ({
  added: [],
  untranslated: [],
  deleted: [],
  modified: [],
  fileOutput: {},
  whitelistOutpsut: []
});

export default (
  defaultMessages,
  languageMessages = {},
  languageWhitelist = []
) => {
  const result = getCleanReport();

  const defaultMessageKeys = Object.keys(defaultMessages);

  defaultMessageKeys.forEach(key => {
    const oldMessage = languageMessages[key];
    const defaultMessage = defaultMessages[key];

    if (oldMessage) {
      if (oldMessage === defaultMessage) {
        result.fileOutput[key] = oldMessage;

        if (languageWhitelist.indexOf(key) === -1) {
          result.untranslated.push({
            key,
            message: defaultMessage
          });
        } else {
          result.whitelistOutput.push(key);
        }
      }
      else {
        result.fileOutput[key] = defaultMessage;

        result.modified.push({
          key: key,
          message: defaultMessage
        });
      }
    } else {
      result.fileOutput[key] = defaultMessage;

      result.added.push({
        key,
        message: defaultMessage
      });
    }
  });

  // if the key is still in the language file but no longer in the
  // defaultMessages file, then the key was deleted.
  result.deleted = Object.keys(languageMessages)
    .filter(key => defaultMessageKeys.indexOf(key) === -1)
    .map(key => ({
      key,
      message: languageMessages[key]
    }));

  return result;
};
