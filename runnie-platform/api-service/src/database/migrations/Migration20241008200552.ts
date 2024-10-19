import { Migration } from '@mikro-orm/migrations';

export class Migration20241008200552 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table \`users\` modify \`modified\` datetime null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`users\` modify \`modified\` datetime not null;`);
  }

}
