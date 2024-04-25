const { promisify } = require('util');
const exec = promisify(require('child_process').exec)

module.exports.executeCommand = async function executeCommand (commandName ) {
  // Exec output contains both stderr and stdout outputs
  const commandOutput = await exec(commandName)

  return commandOutput.stdout.trim();
};