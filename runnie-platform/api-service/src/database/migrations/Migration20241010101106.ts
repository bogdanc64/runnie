import { Migration } from '@mikro-orm/migrations';

export class Migration20241010101106 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table \`users\` add \`refresh_token\` varchar(255) not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`users\` drop column \`refresh_token\`;`);
  }

}
