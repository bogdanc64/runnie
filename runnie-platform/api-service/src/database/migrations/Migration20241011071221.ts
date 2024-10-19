import { Migration } from '@mikro-orm/migrations';

export class Migration20241011071221 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table \`users\` modify \`refresh_token\` varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`users\` modify \`refresh_token\` varchar(255) not null;`);
  }

}
