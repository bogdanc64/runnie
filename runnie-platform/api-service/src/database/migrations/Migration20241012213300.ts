import { Migration } from '@mikro-orm/migrations';

export class Migration20241012213300 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table \`users\` add \`confirm_email_token\` varchar(255) null, add \`confirm_email_token_date\` datetime null, add \`status\` int not null default 1;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`users\` drop column \`confirm_email_token\`, drop column \`confirm_email_token_date\`, drop column \`status\`;`);
  }

}
