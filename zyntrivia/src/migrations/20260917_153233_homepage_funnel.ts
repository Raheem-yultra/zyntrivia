import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."homepage_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload"."homepage_rels" CASCADE;
  ALTER TABLE "payload"."quote_requests" ALTER COLUMN "project_type" SET DATA TYPE text;
  DROP TYPE "payload"."enum_quote_requests_project_type";
  CREATE TYPE "payload"."enum_quote_requests_project_type" AS ENUM('automation', 'internal-tool', 'ai-agent', 'web-app', 'not-sure');
  ALTER TABLE "payload"."quote_requests" ALTER COLUMN "project_type" SET DATA TYPE "payload"."enum_quote_requests_project_type" USING "project_type"::"payload"."enum_quote_requests_project_type";
  ALTER TABLE "payload"."homepage" ALTER COLUMN "hero_headline" SET DEFAULT 'What’s wasting your team’s time?';
  ALTER TABLE "payload"."homepage" ALTER COLUMN "hero_subhead" SET DEFAULT 'Copying data between apps, chasing updates, rebuilding the same report every week. We build software that does it for you.';
  ALTER TABLE "payload"."case_studies" DROP COLUMN "show_on_home";
  ALTER TABLE "payload"."_case_studies_v" DROP COLUMN "version_show_on_home";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "payload"."homepage_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"case_studies_id" integer,
  	"posts_id" integer
  );
  
  ALTER TABLE "payload"."quote_requests" ALTER COLUMN "project_type" SET DATA TYPE text;
  DROP TYPE "payload"."enum_quote_requests_project_type";
  CREATE TYPE "payload"."enum_quote_requests_project_type" AS ENUM('web-app', 'automation', 'internal-tool', 'ai-agent', 'not-sure');
  ALTER TABLE "payload"."quote_requests" ALTER COLUMN "project_type" SET DATA TYPE "payload"."enum_quote_requests_project_type" USING "project_type"::"payload"."enum_quote_requests_project_type";
  ALTER TABLE "payload"."homepage" ALTER COLUMN "hero_headline" SET DEFAULT 'Software that takes the busywork off your team.';
  ALTER TABLE "payload"."homepage" ALTER COLUMN "hero_subhead" SET DEFAULT 'We build custom web apps, internal tools, and AI automations for growing businesses in the US and Europe.';
  ALTER TABLE "payload"."case_studies" ADD COLUMN "show_on_home" boolean DEFAULT false;
  ALTER TABLE "payload"."_case_studies_v" ADD COLUMN "version_show_on_home" boolean DEFAULT false;
  ALTER TABLE "payload"."homepage_rels" ADD CONSTRAINT "homepage_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."homepage_rels" ADD CONSTRAINT "homepage_rels_case_studies_fk" FOREIGN KEY ("case_studies_id") REFERENCES "payload"."case_studies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."homepage_rels" ADD CONSTRAINT "homepage_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "payload"."posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "homepage_rels_order_idx" ON "payload"."homepage_rels" USING btree ("order");
  CREATE INDEX "homepage_rels_parent_idx" ON "payload"."homepage_rels" USING btree ("parent_id");
  CREATE INDEX "homepage_rels_path_idx" ON "payload"."homepage_rels" USING btree ("path");
  CREATE INDEX "homepage_rels_case_studies_id_idx" ON "payload"."homepage_rels" USING btree ("case_studies_id");
  CREATE INDEX "homepage_rels_posts_id_idx" ON "payload"."homepage_rels" USING btree ("posts_id");`)
}
