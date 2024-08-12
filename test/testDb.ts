import { DataSource } from 'typeorm';

export class DbTest extends DataSource {
  public dbName: string;
  constructor() {
    super({
      type: 'postgres',
      username: process.env['POSTGRES_USER'],
      password: process.env['POSTGRES_PASSWORD'],
      host: process.env['POSTGRES_HOST'],
      port: +process.env['POSTGRES_PORT'],
      database: 'postgres',
    });

    this.dbName = `TEST_POSTGRES_PAIA_${Date.now() + Math.floor(Math.random() * 100)}`;
  }

  async create() {
    await this.initialize();
    await this.query(`CREATE DATABASE "${this.dbName}"`);
    await this.destroy();
  }

  async deleteAll() {
    await this.initialize();

    const databases: { datname: string }[] = await this.query(
      "SELECT datname FROM pg_database WHERE datname LIKE 'TEST_POSTGRES_PAIA_%'",
    );

    const querys = databases.map((db) =>
      this.query(`DROP DATABASE "${db.datname}"`),
    );

    await Promise.all(querys);

    await this.destroy();
  }
}

//
//

export default () => new DbTest().deleteAll();