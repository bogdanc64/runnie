import { Migration } from '@mikro-orm/migrations';

export class Migration20241008200344 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table \`users\` add \`password_hash\` varchar(255) not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`users\` drop column \`password_hash\`;`);
  }

}
