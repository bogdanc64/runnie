import { Migration } from '@mikro-orm/migrations';

export class Migration20241014074809 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table \`users\` add \`is_oauth_user\` tinyint(1) not null default false;`);
    this.addSql(`alter table \`users\` modify \`password_hash\` varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`users\` drop column \`is_oauth_user\`;`);

    this.addSql(`alter table \`users\` modify \`password_hash\` varchar(255) not null;`);
  }

}
