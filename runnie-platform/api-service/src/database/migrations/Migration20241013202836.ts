import { Migration } from '@mikro-orm/migrations';

export class Migration20241013202836 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table \`users\` add \`reset_password_token\` varchar(255) null, add \`reset_password_token_date\` datetime null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`users\` drop column \`reset_password_token\`, drop column \`reset_password_token_date\`;`);
  }

}
