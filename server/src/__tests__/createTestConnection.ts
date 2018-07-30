import * as path from 'path';

import { Connection, ContainerInterface, createConnection, useContainer } from 'typeorm';

import { Container } from 'typedi';
import { getDeterministicString } from './getDeterministicString';
import { getEntities } from '../entities';

export async function createTestConnection(
  container: ContainerInterface = Container,
): Promise<Connection> {
  const name = getName();
  useContainer(container);
  const connection = await createConnection({
    type: 'sqlite',
    database: ':memory:', // path.resolve(__dirname, '..', '..', `test.${name}.sqlite3`),
    entities: getEntities(),
    synchronize: true,
  });
  Container.set(Connection, connection);
  return connection;
}

/**
 * Gets a name for the test database.
 * If the calling file can be determined, the file name with the line will be used. Otherwise a hash
 * based on the stack will be generated.
 */
function getName(): string {
  const stack = new Error().stack!;
  const trace = stack.split('\n');
  const testCallerStack = trace.filter(s => s.includes('.test.'));
  if (testCallerStack.length > 0) {
    // Convert a path like /Users/../src/__tests__/OAuth.test.ts to dir.oauth
    const expr = /\((.+)\.test\.ts:(\d+):(\d+)\)/;
    const results = expr.exec(testCallerStack[0]);
    if (results && results.length === 4) {
      const [match, file, line, column] = results;
      const sourceDir = path.resolve(__dirname, '..') + '/';
      const fileWithSrcAndSlashReplaced = file
      .replace(sourceDir, '')
      .replace('__tests__/', '')
      .replace(new RegExp('\\' + path.sep, 'g'), '.');
      return `${fileWithSrcAndSlashReplaced}.${line}`;
    }
  }

  return getDeterministicString();
}
