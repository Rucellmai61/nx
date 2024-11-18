import { HandlerResult } from './server';
import { serverLogger } from './logger';
import { getNxRequirePaths } from '../../utils/installation-directory';
import { HandleProcessInBackgroundMessage } from '../message-types/process-in-background';

export async function handleProcessInBackground(
  payload: HandleProcessInBackgroundMessage
): Promise<HandlerResult> {
  let fn;
  try {
    fn = require(require.resolve(payload.requirePath, {
      paths: getNxRequirePaths(),
    })).default;
  } catch (e) {
    return {
      description: `Unable to require ${payload.requirePath}`,
      error: new Error(`Unable to require ${payload.requirePath}`),
    };
  }

  try {
    const response = await fn(payload.data, serverLogger);
    return {
      response,
      description: payload.type,
    };
  } catch (e) {
    return {
      description: `Error when processing ${payload.type}.`,
      error: e,
    };
  }
}
