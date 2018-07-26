import * as crypto from 'crypto';
import * as path from 'path';

import { Connection, ContainerInterface, createConnection, useContainer } from 'typeorm';

import { Container } from 'typedi';
import { getEntities } from '../entities';

export async function createTestConnection(
  container: ContainerInterface = Container,
): Promise<Connection> {
  const name = getName();
  useContainer(container);
  const connection = await createConnection({
    type: 'sqlite',
    database: path.join(__dirname, '..', `test.${name}.sqlite3`),
    entities: getEntities(),
    synchronize: true,
  });
  Container.set(Connection, connection);
  return connection;
}

/**
 * Gets a name for the test database.
 * If the calling file can be determined, the file name with the line and column number will be
 * used. Otherwise a hash based on the stack will be generated.
 */
function getName(): string {
  const stack = new Error().stack!;
  const hash = crypto.createHash('md5').update(stack).digest('hex');
  const trace = stack.split('\n');
  const stackNotFromCreateTestConnection = trace.filter(s => s.includes('.test.'));
  if (stackNotFromCreateTestConnection.length > 0) {
    const expr = /__tests__\/(.+)\.test\.ts:(\d+):(\d+)/;
    const results = expr.exec(stackNotFromCreateTestConnection[0]);
    if (results && results.length === 4) {
      const [match, file, line, column] = results;
      return `${file}.${line}.${column}.${hash}`;
    }
  }
  return hash;
}
